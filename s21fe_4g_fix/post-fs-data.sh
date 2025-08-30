#!/system/bin/sh
# This script will be executed in post-fs-data mode
# More info in the main Magisk thread

# Set properties early
resetprop persist.vendor.radio.enable_iwlan false
resetprop persist.vendor.radio.iwlan_enable false
resetprop ro.telephony.iwlan_operation_mode legacy