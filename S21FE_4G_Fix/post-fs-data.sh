#!/system/bin/sh

# Samsung S21 FE 4G Connectivity Fix - Post-FS-Data Script
# This script runs early in the boot process to set critical system properties

# Create log file
mkdir -p /data/local/tmp
echo "$(date): Samsung S21 FE 4G Fix - Post-FS-Data script started" >> /data/local/tmp/s21fe_4g_fix.log

# Set critical system properties early in boot process
# These need to be set before telephony services start

# === IWLAN TO GSM/LTE CONVERSION ===

# Completely disable IWLAN at the lowest level
setprop persist.vendor.radio.enable_iwlan false
setprop persist.vendor.radio.iwlan_enable false
setprop persist.vendor.radio.iwlan_operation_mode false
setprop ro.telephony.iwlan_operation_mode legacy
setprop persist.vendor.radio.enable_wfc false

# Force GSM/LTE preference over IWLAN
setprop persist.vendor.radio.prefer_spn_over_plmn true
setprop persist.vendor.radio.rat_on primary,1
setprop persist.vendor.radio.sib16_support 0
setprop persist.vendor.radio.data_ltd_sys_ind 1

# Disable VoWiFi and IMS over IWLAN
setprop persist.vendor.radio.calls.on.ims 0
setprop persist.vendor.radio.domain.ps 0
setprop persist.vendor.radio.jbims 0
setprop persist.vendor.radio.enable_voicecall_on_ims 0

# Force cellular network registration
setprop ro.telephony.default_network 22,22
setprop persist.vendor.radio.force_on_dc true
setprop persist.vendor.radio.enable_fd_plmn_list true

# Disable IWLAN scanning and selection
setprop persist.vendor.radio.iwlan_scan_enable false
setprop persist.vendor.radio.disable_retry_setup_data_call true

# Force GSM/LTE mode selection
setprop persist.vendor.radio.msim.stackid_0 0
setprop persist.vendor.radio.msim.stackid_1 1
setprop persist.vendor.radio.primarycard 0

# Additional IWLAN disable properties
setprop persist.vendor.radio.enable_iwlan_call false
setprop persist.vendor.radio.enable_iwlan_sms false

# Log completion
echo "$(date): Samsung S21 FE 4G Fix - Post-FS-Data script completed" >> /data/local/tmp/s21fe_4g_fix.log