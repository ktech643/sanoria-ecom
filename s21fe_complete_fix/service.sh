#!/system/bin/sh
# Complete 4G Fix - Main Service

# Wait for boot
while [ "$(getprop sys.boot_completed)" != "1" ]; do
  sleep 5
done

# Additional wait for radio
sleep 15

log() {
  echo "[S21FE-4G] $1" >> /data/local/tmp/s21fe_4g_complete.log
}

log "Starting complete 4G fix service"

# Step 1: Kill and disable all IWLAN/IMS services
log "Disabling IWLAN services..."
for pkg in com.sec.epdg com.sec.imsservice com.samsung.ims.smk com.sec.vowifi com.samsung.android.iwlan; do
  pm disable $pkg 2>/dev/null
  pm clear $pkg 2>/dev/null
  am force-stop $pkg 2>/dev/null
done

# Step 2: Clear telephony databases
log "Clearing telephony databases..."
rm -f /data/data/com.android.providers.telephony/databases/telephony.db*
rm -f /data/data/com.android.phone/databases/*
rm -f /data/vendor/radio/*
rm -f /data/vendor_de/0/radio/*

# Step 3: Set proper network mode
log "Setting network mode to LTE/TDSCDMA/GSM/WCDMA..."
settings put global preferred_network_mode 22
settings put global preferred_network_mode0 22
settings put global preferred_network_mode1 22

# Step 4: Configure data properly
log "Configuring mobile data..."
settings put global mobile_data 1
settings put global mobile_data0 1
settings put global mobile_data1 1
settings put global mobile_data_always_on 1
settings put global data_roaming 0

# Disable all IMS/VoLTE/WiFi calling
settings put global wfc_ims_enabled 0
settings put global wfc_ims_mode 0
settings put global wfc_ims_roaming_enabled 0
settings put global enhanced_4g_mode_enabled 0
settings put global volte_vt_enabled 0

# Step 5: Reset APN to defaults
log "Resetting APN..."
content delete --uri content://telephony/carriers/restore

# Step 6: Fix DNS
setprop net.dns1 8.8.8.8
setprop net.dns2 8.8.4.4
setprop net.rmnet0.dns1 8.8.8.8
setprop net.rmnet0.dns2 8.8.4.4

# Step 7: Restart radio completely
log "Restarting radio services..."
stop ril-daemon
stop vendor.ril-daemon
stop netd
pkill -9 rild
pkill -9 netd

# Clear radio logs
rm -f /data/vendor/radio/ril_log*
rm -f /data/vendor/radio/power_anomaly_data.txt

# Start services
start netd
start vendor.ril-daemon
start ril-daemon

# Step 8: Force network registration
sleep 5
log "Forcing network registration..."

# Toggle airplane mode
settings put global airplane_mode_on 1
am broadcast -a android.intent.action.AIRPLANE_MODE
sleep 5
settings put global airplane_mode_on 0
am broadcast -a android.intent.action.AIRPLANE_MODE

# Step 9: Wait and verify
sleep 10

# Step 10: Apply carrier config
am broadcast -a android.telephony.action.CARRIER_CONFIG_CHANGED

# Monitor and maintain connection
while true; do
  # Check if we're on IWLAN
  NETWORK_TYPE=$(dumpsys telephony.registry 2>/dev/null | grep "mDataNetworkType=" | tail -1 | cut -d= -f2 | cut -d' ' -f1)
  
  if [ "$NETWORK_TYPE" = "IWLAN" ] || [ "$NETWORK_TYPE" = "Unknown" ]; then
    log "Detected $NETWORK_TYPE, forcing back to cellular..."
    
    # Kill IWLAN processes
    pkill -9 -f epdg
    pkill -9 -f iwlan
    
    # Force cellular
    settings put global preferred_network_mode 1  # GSM only
    sleep 2
    settings put global preferred_network_mode 22 # Back to full mode
    
    # Restart RIL
    setprop ctl.restart rild
  fi
  
  # Ensure data is enabled
  DATA_ENABLED=$(settings get global mobile_data)
  if [ "$DATA_ENABLED" != "1" ]; then
    log "Re-enabling mobile data..."
    settings put global mobile_data 1
    svc data enable
  fi
  
  # Check data connection state
  DATA_STATE=$(dumpsys telephony.registry 2>/dev/null | grep "mDataConnectionState=" | tail -1 | cut -d= -f2 | cut -d' ' -f1)
  if [ "$DATA_STATE" != "2" ] && [ "$DATA_ENABLED" = "1" ]; then
    log "Data disconnected, attempting reconnection..."
    
    # Force data reconnection
    am broadcast -a android.intent.action.ANY_DATA_STATE
    ifconfig rmnet_data0 down 2>/dev/null
    ifconfig rmnet_data0 up 2>/dev/null
    
    # If still not connected after 30 seconds, do aggressive fix
    sleep 30
    DATA_STATE=$(dumpsys telephony.registry 2>/dev/null | grep "mDataConnectionState=" | tail -1 | cut -d= -f2 | cut -d' ' -f1)
    if [ "$DATA_STATE" != "2" ]; then
      log "Applying aggressive reconnection..."
      setprop ctl.restart rild
    fi
  fi
  
  sleep 30
done