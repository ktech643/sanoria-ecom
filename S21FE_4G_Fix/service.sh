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

# Step 1: Disable IWLAN Preference
log_exec "setprop persist.vendor.radio.enable_iwlan false"
log_exec "setprop persist.vendor.radio.iwlan_enable false"
log_exec "setprop ro.telephony.iwlan_operation_mode legacy"

# Step 2: Force Network Mode to LTE/GSM (Mode 22 = LTE/GSM/WCDMA Global)
log_exec "settings put global preferred_network_mode 22"
log_exec "settings put global preferred_network_mode0 22"
log_exec "settings put global preferred_network_mode1 22"

# Step 3: Disable WiFi Calling Preference
log_exec "settings put global wfc_ims_enabled 0"
log_exec "settings put global wfc_ims_mode 1"
log_exec "settings put global wfc_ims_roaming_enabled 0"

# Step 4: Force Cellular Data Registration
log_exec "settings put global mobile_data 1"
log_exec "settings put global data_roaming 0"

# Step 5: Reset Telephony Services (with delay)
sleep 5
log_exec "am broadcast -a android.intent.action.SERVICE_STATE --ei state 0"
log_exec "am broadcast -a android.intent.action.SIM_STATE_CHANGED"
log_exec "am broadcast -a android.intent.action.RADIO_TECHNOLOGY_CHANGED"

# Step 6: Reset Carrier Configuration
log_exec "pm clear com.android.carrierconfig"
sleep 2
log_exec "am broadcast -a com.android.internal.telephony.CARRIER_SIGNAL_RESET"

# Step 7: Force Network Re-registration
sleep 3
log_exec "am broadcast -a android.intent.action.SERVICE_STATE"

echo "$(date): Samsung S21 FE 4G Fix - Service script completed" >> /data/local/tmp/s21fe_4g_fix.log

# Verify the fix after 10 seconds
(
    sleep 10
    echo "$(date): Verifying fix..." >> /data/local/tmp/s21fe_4g_fix.log
    dumpsys telephony.registry | grep -E 'mServiceState|mDataConnectionState|mDataActivity|mDataRegState' >> /data/local/tmp/s21fe_4g_fix.log 2>&1
    echo "$(date): Verification complete" >> /data/local/tmp/s21fe_4g_fix.log
) &