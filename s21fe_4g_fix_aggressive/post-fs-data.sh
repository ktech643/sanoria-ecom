#!/system/bin/sh
# Early boot aggressive property overrides

# Create log file
mkdir -p /data/local/tmp
echo "[S21FE-4G-FIX] Post-fs-data starting..." > /data/local/tmp/s21fe_4g_fix.log

# Disable IWLAN completely
resetprop persist.vendor.radio.enable_iwlan false
resetprop persist.vendor.radio.iwlan_enable false
resetprop persist.data.iwlan.enable false
resetprop persist.radio.vowifi_available false
resetprop persist.dbg.wfc_avail_ovr 0
resetprop persist.vendor.radio.is_wps_enabled false
resetprop persist.radio.calls.on.ims 0

# Force telephony to use cellular only
resetprop ro.telephony.iwlan_operation_mode legacy
resetprop telephony.lteOnCdmaDevice 1
resetprop ro.telephony.default_network 22,22
resetprop persist.vendor.radio.rat_on lte,gsm,wcdma
resetprop persist.vendor.radio.force_on_dc true

# Disable IMS for WiFi
resetprop persist.vendor.ims.disableADBLogs 1
resetprop persist.vendor.ims.disableDebugLogs 1
resetprop persist.vendor.ims.disableIMSLogs 1
resetprop persist.vendor.ims.disableQXDMLogs 1

# Force LTE mode
resetprop persist.radio.mode_pref_nv10 1
resetprop persist.vendor.radio.lte_vrte_ltd 1
resetprop persist.vendor.radio.cs_srv_type 1

# Samsung specific
resetprop persist.vendor.radio.enable_voiwifi 0
resetprop persist.vendor.radio.voiwifi 0

# Log completion
echo "[S21FE-4G-FIX] Properties set" >> /data/local/tmp/s21fe_4g_fix.log