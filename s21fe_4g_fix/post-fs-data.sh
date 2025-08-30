#!/system/bin/sh

# Samsung S21 FE 4G Fix - Early Boot Script
# Set critical properties before telephony starts

# Disable IWLAN early
setprop persist.vendor.radio.enable_iwlan false
setprop persist.vendor.radio.iwlan_enable false
setprop ro.telephony.iwlan_operation_mode legacy

# Set network preference early
setprop ro.telephony.default_network 22,22