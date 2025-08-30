#!/system/bin/sh
# This script will be executed in late_start service mode
# More info in the main Magisk thread

# Wait for boot to complete
while [ "$(getprop sys.boot_completed)" != "1" ]; do
  sleep 5
done

# Additional wait
sleep 10

# Apply 4G fixes
settings put global preferred_network_mode 22
settings put global preferred_network_mode0 22
settings put global preferred_network_mode1 22

# Disable WiFi calling preference
settings put global wfc_ims_enabled 0
settings put global wfc_ims_mode 1

# Enable mobile data
settings put global mobile_data 1
svc data enable

# Reset RIL
setprop ctl.restart ril-daemon