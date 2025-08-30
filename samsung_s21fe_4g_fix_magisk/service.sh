#!/system/bin/sh
# Samsung S21 FE 4G Fix - Service Script
# This script runs on boot after Magisk is initialized

# Wait for boot to complete
while [ "$(getprop sys.boot_completed)" != "1" ]; do
  sleep 5
done

# Additional wait to ensure telephony services are ready
sleep 10

# Log start
echo "[S21FE-4G-FIX] Starting 4G connectivity fix..." > /dev/kmsg

# Force network mode to LTE/GSM/WCDMA (Global)
settings put global preferred_network_mode 22
settings put global preferred_network_mode0 22
settings put global preferred_network_mode1 22

# Disable WiFi calling preference
settings put global wfc_ims_enabled 0
settings put global wfc_ims_mode 1
settings put global wfc_ims_roaming_enabled 0

# Enable mobile data
settings put global mobile_data 1
settings put global data_roaming 0
svc data enable

# Reset carrier configuration
pm clear com.android.carrierconfig 2>/dev/null

# Force network re-registration
am broadcast -a android.intent.action.SERVICE_STATE 2>/dev/null
am broadcast -a android.intent.action.SIM_STATE_CHANGED 2>/dev/null
am broadcast -a com.android.internal.telephony.CARRIER_SIGNAL_RESET 2>/dev/null

# Restart RIL daemon
setprop ctl.restart ril-daemon
setprop ctl.restart vendor.ril-daemon

# Log completion
echo "[S21FE-4G-FIX] 4G connectivity fix applied successfully" > /dev/kmsg