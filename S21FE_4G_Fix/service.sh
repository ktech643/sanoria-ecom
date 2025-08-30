#!/system/bin/sh

# Samsung S21 FE 4G Connectivity Fix - Service Script
# This script runs after boot to apply 4G connectivity fixes

# Wait for system to be ready
sleep 30

# Create log directory
mkdir -p /data/local/tmp

# Log start
echo "$(date): Samsung S21 FE 4G Fix - Service script started" >> /data/local/tmp/s21fe_4g_fix.log

# Function to log and execute commands
log_exec() {
    echo "$(date): Executing: $1" >> /data/local/tmp/s21fe_4g_fix.log
    eval "$1"
    echo "$(date): Exit code: $?" >> /data/local/tmp/s21fe_4g_fix.log
}

# === COMPREHENSIVE IWLAN TO GSM/LTE CONVERSION ===

# Step 1: Complete IWLAN Disable and GSM/LTE Force
log_exec "setprop persist.vendor.radio.enable_iwlan false"
log_exec "setprop persist.vendor.radio.iwlan_enable false"
log_exec "setprop persist.vendor.radio.iwlan_operation_mode false"
log_exec "setprop ro.telephony.iwlan_operation_mode legacy"
log_exec "setprop persist.vendor.radio.enable_wfc false"
log_exec "setprop persist.vendor.radio.enable_iwlan_call false"
log_exec "setprop persist.vendor.radio.enable_iwlan_sms false"

# Step 2: Force Network Mode to LTE/GSM/WCDMA (Mode 22 = Global)
log_exec "settings put global preferred_network_mode 22"
log_exec "settings put global preferred_network_mode0 22"
log_exec "settings put global preferred_network_mode1 22"

# Force specific network types for dual SIM
log_exec "settings put global preferred_network_mode_slot0 22"
log_exec "settings put global preferred_network_mode_slot1 22"

# Step 3: Comprehensive WiFi Calling and IMS Disable
log_exec "settings put global wfc_ims_enabled 0"
log_exec "settings put global wfc_ims_mode 0"
log_exec "settings put global wfc_ims_roaming_enabled 0"
log_exec "settings put global wfc_ims_roaming_mode 0"

# Disable IMS over IWLAN completely
log_exec "settings put global ims_volte_enabled 1"
log_exec "settings put global enhanced_4g_mode_enabled 1"
log_exec "settings put global volte_vt_enabled 0"

# Step 4: Force Cellular Data Registration and Disable IWLAN Data
log_exec "settings put global mobile_data 1"
log_exec "settings put global data_roaming 0"
log_exec "settings put global airplane_mode_on 0"

# Force cellular data preference
log_exec "setprop persist.vendor.radio.data_ltd_sys_ind 1"
log_exec "setprop persist.vendor.radio.force_on_dc true"

# Step 5: Reset Telephony Services (with delay)
sleep 5
log_exec "am broadcast -a android.intent.action.SERVICE_STATE --ei state 0"
log_exec "am broadcast -a android.intent.action.SIM_STATE_CHANGED"
log_exec "am broadcast -a android.intent.action.RADIO_TECHNOLOGY_CHANGED"

# Step 6: Reset Carrier Configuration
log_exec "pm clear com.android.carrierconfig"
sleep 2
log_exec "am broadcast -a com.android.internal.telephony.CARRIER_SIGNAL_RESET"

# Step 7: Force Network Re-registration and IWLAN to GSM Conversion
sleep 3
log_exec "am broadcast -a android.intent.action.SERVICE_STATE"

# Force radio restart to apply IWLAN to GSM conversion
log_exec "setprop ctl.restart ril-daemon"
log_exec "setprop ctl.restart vendor.ril-daemon"

# Additional network mode enforcement
sleep 5
log_exec "am start -a android.settings.DATA_USAGE_SETTINGS"
sleep 2
log_exec "input keyevent 4"  # Back button to close settings

# Force network operator re-selection to ensure GSM/LTE registration
log_exec "am broadcast -a android.intent.action.NETWORK_SET_COUNTRY"
log_exec "am broadcast -a android.intent.action.LOCALE_CHANGED"

# Step 8: Final IWLAN to GSM/LTE Verification and Enforcement
sleep 5

# Disable any remaining IWLAN services
log_exec "pm disable com.android.ims.rcsservice/com.android.ims.IwlanService 2>/dev/null || true"
log_exec "pm disable com.samsung.android.ims/com.samsung.android.ims.iwlan.IwlanService 2>/dev/null || true"

# Force cellular network selection
log_exec "settings put global network_operator_selection_mode 0"  # Auto select
log_exec "settings put global data_prefer_apn cellular"

# Final network mode enforcement
log_exec "settings put global preferred_network_mode 22"
log_exec "setprop persist.vendor.radio.enable_iwlan false"

echo "$(date): Samsung S21 FE 4G Fix - Service script completed" >> /data/local/tmp/s21fe_4g_fix.log
echo "$(date): IWLAN to GSM/LTE conversion applied successfully" >> /data/local/tmp/s21fe_4g_fix.log

# Verify the fix after 10 seconds
(
    sleep 10
    echo "$(date): Verifying fix..." >> /data/local/tmp/s21fe_4g_fix.log
    dumpsys telephony.registry | grep -E 'mServiceState|mDataConnectionState|mDataActivity|mDataRegState' >> /data/local/tmp/s21fe_4g_fix.log 2>&1
    echo "$(date): Verification complete" >> /data/local/tmp/s21fe_4g_fix.log
) &