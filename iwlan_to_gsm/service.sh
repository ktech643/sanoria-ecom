#!/system/bin/sh
# IWLAN to GSM Converter - Main service

# Wait for boot
while [ "$(getprop sys.boot_completed)" != "1" ]; do
  sleep 5
done

sleep 10

# Disable IWLAN packages
pm disable com.sec.epdg
pm disable com.sec.imsservice
pm disable com.samsung.ims.smk
pm disable com.sec.vowifi
pm disable com.samsung.android.iwlan

# Clear IMS data
pm clear com.sec.imsservice
pm clear com.sec.epdg

# Stop IWLAN services
stop epdg
stop imsd
stop iwland
stop vowifi-service

# Kill any remaining IWLAN processes
pkill -f epdg
pkill -f iwlan
pkill -f vowifi
pkill -f imsservice

# Set network to LTE/GSM only (mode 9)
settings put global preferred_network_mode 9
settings put global preferred_network_mode0 9
settings put global preferred_network_mode1 9

# Alternative network modes if 9 doesn't work
# Mode 1 = GSM only
# Mode 11 = LTE only  
# Mode 9 = LTE/GSM

# Completely disable WiFi calling
settings put global wfc_ims_enabled 0
settings put global wfc_ims_mode 0
settings put global wfc_ims_roaming_enabled 0
settings put global wifi_calling_mode 0

# Force mobile data
settings put global mobile_data 1
settings put global mobile_data_always_on 1

# Disable VoLTE to force GSM
settings put global enhanced_4g_mode_enabled 0
settings put global volte_vt_enabled 0

# Reset telephony to apply changes
stop ril-daemon
stop vendor.ril-daemon
setprop ctl.restart rild
start ril-daemon
start vendor.ril-daemon

# Force network refresh
settings put global airplane_mode_on 1
am broadcast -a android.intent.action.AIRPLANE_MODE --ez state true
sleep 5
settings put global airplane_mode_on 0
am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false

# Monitor loop
while true; do
  # Keep killing IWLAN if it tries to start
  if pidof epdg > /dev/null || pidof iwland > /dev/null; then
    pkill -f epdg
    pkill -f iwlan
    pm disable com.sec.epdg
    pm disable com.samsung.android.iwlan
  fi
  
  # Ensure we stay on GSM/LTE
  NETWORK_TYPE=$(dumpsys telephony.registry | grep "mDataNetworkType=" | tail -1 | cut -d= -f2 | cut -d' ' -f1)
  if [ "$NETWORK_TYPE" = "IWLAN" ]; then
    # Force switch back
    settings put global preferred_network_mode 1  # GSM only temporarily
    sleep 2
    settings put global preferred_network_mode 9  # Back to LTE/GSM
    setprop ctl.restart rild
  fi
  
  sleep 20
done