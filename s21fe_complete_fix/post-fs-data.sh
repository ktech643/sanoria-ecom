#!/system/bin/sh
# Complete 4G Fix - Early Boot Stage

# Create directories
mkdir -p /data/vendor/radio
mkdir -p /data/vendor_de/0/radio

# Completely remove IWLAN capability
resetprop -n ro.telephony.iwlan_operation_mode none
resetprop -n persist.vendor.radio.enable_iwlan false
resetprop -n persist.vendor.radio.iwlan_enable false
resetprop -n persist.vendor.radio.calls.on.ims 0
resetprop -n persist.data.iwlan.enable false
resetprop -n persist.data.iwlan false
resetprop -n persist.radio.vowifi_available 0
resetprop -n persist.dbg.wfc_avail_ovr 0

# Force proper network mode (22 = LTE/TDSCDMA/GSM/WCDMA)
resetprop -n ro.telephony.default_network 22,22
resetprop -n persist.vendor.radio.prefer_nw 22

# Enable proper data handling
resetprop -n persist.vendor.radio.aosp_usr_pref_sel true
resetprop -n persist.vendor.radio.data_con_rprt 1
resetprop -n persist.vendor.radio.data_ltd_sys_ind 1
resetprop -n persist.vendor.radio.manual_nw_rej_ct 1

# Fix RIL and radio behavior
resetprop -n persist.vendor.radio.force_on_dc true
resetprop -n persist.radio.multisim.config dsds
resetprop -n persist.vendor.radio.rat_on "lte,tdscdma,gsm,wcdma"
resetprop -n persist.vendor.radio.stack_id_0 0
resetprop -n persist.vendor.radio.stack_id_1 1

# Data fixes
resetprop -n persist.data.df.dev_name rmnet_usb0
resetprop -n persist.vendor.data.mode concurrent
resetprop -n persist.data.netmgrd.qos.enable true