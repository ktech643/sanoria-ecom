#!/system/bin/sh

# Samsung S21 FE 4G Fix - Service Script
# Wait for system to be ready
sleep 30

# Create log directory
mkdir -p /data/local/tmp

# Log start
echo "$(date): S21FE 4G Fix started" >> /data/local/tmp/s21fe_fix.log

# Disable IWLAN preference
setprop persist.vendor.radio.enable_iwlan false
setprop persist.vendor.radio.iwlan_enable false
setprop ro.telephony.iwlan_operation_mode legacy

# Set network mode to LTE/GSM/WCDMA (22)
settings put global preferred_network_mode 22
settings put global preferred_network_mode0 22
settings put global preferred_network_mode1 22

# Disable WiFi calling preference
settings put global wfc_ims_enabled 0
settings put global wfc_ims_mode 1

# Force cellular data
settings put global mobile_data 1

# Reset telephony
sleep 5
am broadcast -a android.intent.action.SERVICE_STATE --ei state 0
am broadcast -a android.intent.action.SIM_STATE_CHANGED

# Reset carrier config
pm clear com.android.carrierconfig

echo "$(date): S21FE 4G Fix completed" >> /data/local/tmp/s21fe_fix.log