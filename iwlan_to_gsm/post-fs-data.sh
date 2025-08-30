#!/system/bin/sh
# IWLAN to GSM Converter - Early boot

# Completely disable IWLAN at property level
resetprop persist.vendor.radio.enable_iwlan false
resetprop persist.vendor.radio.iwlan_enable false
resetprop persist.data.iwlan.enable false
resetprop persist.data.iwlan false
resetprop persist.radio.calls.on.ims 0
resetprop persist.radio.jbims 0
resetprop persist.radio.vrte_logic 0
resetprop persist.radio.VT_ENABLE 0
resetprop persist.radio.volte.dan_support false

# Disable all WiFi calling
resetprop persist.dbg.wfc_avail_ovr 0
resetprop persist.vendor.radio.enable_voiwifi 0
resetprop persist.support.voiwifi 0
resetprop persist.vendor.radio.calls.on.ims_0 0
resetprop persist.vendor.radio.calls.on.ims_1 0

# Force GSM/LTE only
resetprop ro.telephony.iwlan_operation_mode none
resetprop ro.telephony.default_network 9
resetprop persist.vendor.radio.rat_on lte,gsm
resetprop persist.vendor.radio.prefer_nw 9

# Disable IMS completely
resetprop persist.vendor.ims.disableService true
resetprop persist.vendor.ims.dropset_feature 3
resetprop persist.vendor.radio.vdp_on_ims_cap 0

# Samsung specific
resetprop persist.vendor.radio.ss_policy 0
resetprop persist.vendor.radio.enable_sar_standby false