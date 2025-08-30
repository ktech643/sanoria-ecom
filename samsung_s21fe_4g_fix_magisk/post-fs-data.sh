#!/system/bin/sh
# Samsung S21 FE 4G Fix - Post-fs-data Script
# This script runs early in the boot process

# Create property override directory if it doesn't exist
mkdir -p /data/property

# Early property overrides
resetprop persist.vendor.radio.enable_iwlan false
resetprop persist.vendor.radio.iwlan_enable false
resetprop ro.telephony.iwlan_operation_mode legacy
resetprop persist.radio.calls.on.ims 0
resetprop persist.vendor.radio.enable_voiwifi 0

# Force cellular data mode
resetprop persist.vendor.radio.rat_on lte,gsm,wcdma
resetprop persist.vendor.radio.data_ltd_sys_ind 1
resetprop persist.vendor.radio.data_con_rprt 1

# Log early boot changes
echo "[S21FE-4G-FIX] Early boot properties set" > /dev/kmsg