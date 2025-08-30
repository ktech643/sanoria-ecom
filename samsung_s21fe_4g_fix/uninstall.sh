#!/system/bin/sh

# Samsung S21 FE 4G Connectivity Fix - Uninstall Script
# This script reverts changes made by the module

echo "$(date): Samsung S21 FE 4G Fix - Uninstall script started" >> /data/local/tmp/s21fe_4g_fix.log

# Revert IWLAN settings to default
setprop persist.vendor.radio.enable_iwlan true
setprop persist.vendor.radio.iwlan_enable true
resetprop --delete ro.telephony.iwlan_operation_mode

# Revert network mode to auto
settings put global preferred_network_mode 0
settings put global preferred_network_mode0 0
settings put global preferred_network_mode1 0

# Re-enable WiFi calling preference
settings put global wfc_ims_enabled 1
settings put global wfc_ims_mode 2

# Reset radio
setprop ctl.restart ril-daemon

echo "$(date): Samsung S21 FE 4G Fix - Uninstall script completed" >> /data/local/tmp/s21fe_4g_fix.log