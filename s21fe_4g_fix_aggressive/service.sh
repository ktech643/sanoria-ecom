#!/system/bin/sh
# Aggressive 4G fix - continuously enforces settings

# Wait for boot
while [ "$(getprop sys.boot_completed)" != "1" ]; do
  sleep 5
done

# Initial wait
sleep 15

# Log function
log_msg() {
  echo "[S21FE-4G-FIX] $1" >> /data/local/tmp/s21fe_4g_fix.log
  echo "[S21FE-4G-FIX] $1" > /dev/kmsg
}

log_msg "Starting aggressive 4G fix service"

# Initial setup
apply_4g_fix() {
  # Kill any IMS/IWLAN processes
  pkill -f "iwlan"
  pkill -f "vowifi"
  
  # Force stop IMS service
  am force-stop com.sec.imsservice 2>/dev/null
  pm disable com.sec.imsservice 2>/dev/null
  
  # Set all network modes
  settings put global preferred_network_mode 22
  settings put global preferred_network_mode0 22
  settings put global preferred_network_mode1 22
  settings put global preferred_network_mode2 22
  
  # Disable WiFi calling completely
  settings put global wfc_ims_enabled 0
  settings put global wfc_ims_mode 0
  settings put global wfc_ims_roaming_enabled 0
  settings put global wifi_calling_enabled 0
  
  # Force mobile data
  settings put global mobile_data 1
  settings put global mobile_data0 1
  settings put global mobile_data1 1
  settings put global data_roaming 0
  
  # Enable cellular data
  svc data enable
  svc wifi disable
  sleep 2
  svc wifi enable
  
  # Reset telephony
  settings put global airplane_mode_on 1
  am broadcast -a android.intent.action.AIRPLANE_MODE
  sleep 3
  settings put global airplane_mode_on 0
  am broadcast -a android.intent.action.AIRPLANE_MODE
  
  # Force LTE only mode
  settings put global lte_service_forced 1
  
  # Clear telephony cache
  pm clear com.android.phone 2>/dev/null
  pm clear com.android.server.telecom 2>/dev/null
  
  # Restart RIL daemons
  stop ril-daemon
  stop vendor.ril-daemon
  start ril-daemon
  start vendor.ril-daemon
  
  # Force network re-registration
  am broadcast -a android.intent.action.SERVICE_STATE
  am broadcast -a android.intent.action.SIM_STATE_CHANGED
  am broadcast -a com.android.internal.telephony.CARRIER_SIGNAL_RESET
}

# Apply initial fix
apply_4g_fix
log_msg "Initial 4G fix applied"

# Monitor and maintain 4G connection
while true; do
  # Check if IWLAN is being used
  CURRENT_NETWORK=$(dumpsys telephony.registry | grep "mDataNetworkType" | grep -o "mDataNetworkType=[^ ]*" | cut -d= -f2)
  
  if [ "$CURRENT_NETWORK" = "IWLAN" ] || [ "$CURRENT_NETWORK" = "Unknown" ]; then
    log_msg "Detected IWLAN/Unknown network, reapplying fix..."
    apply_4g_fix
  fi
  
  # Check network mode every 30 seconds
  NETWORK_MODE=$(settings get global preferred_network_mode)
  if [ "$NETWORK_MODE" != "22" ]; then
    log_msg "Network mode changed to $NETWORK_MODE, resetting to 22"
    settings put global preferred_network_mode 22
    settings put global preferred_network_mode0 22
    settings put global preferred_network_mode1 22
  fi
  
  # Ensure WiFi calling stays disabled
  WFC_ENABLED=$(settings get global wfc_ims_enabled)
  if [ "$WFC_ENABLED" != "0" ]; then
    log_msg "WiFi calling re-enabled, disabling again"
    settings put global wfc_ims_enabled 0
    settings put global wifi_calling_enabled 0
  fi
  
  sleep 30
done