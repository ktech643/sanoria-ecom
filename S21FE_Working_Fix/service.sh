#!/system/bin/sh

# Samsung S21 FE 4G Fix - Service Script
# Safe version that won't break airplane mode

# Wait for system to be ready
sleep 30

# Create log directory
mkdir -p /data/local/tmp

# Log start
echo "$(date): Samsung S21 FE 4G Fix - Service started" >> /data/local/tmp/s21fe_4g_fix.log

# Function to safely execute commands
safe_exec() {
    echo "$(date): Executing: $1" >> /data/local/tmp/s21fe_4g_fix.log
    eval "$1" 2>/dev/null
    local exit_code=$?
    echo "$(date): Exit code: $exit_code" >> /data/local/tmp/s21fe_4g_fix.log
    return $exit_code
}

# Check if airplane mode is on - skip if it is
AIRPLANE_MODE=$(settings get global airplane_mode_on 2>/dev/null)
if [ "$AIRPLANE_MODE" = "1" ]; then
    echo "$(date): Airplane mode is ON - skipping all changes" >> /data/local/tmp/s21fe_4g_fix.log
    exit 0
fi

echo "$(date): Applying 4G connectivity fixes..." >> /data/local/tmp/s21fe_4g_fix.log

# Apply basic IWLAN to GSM conversion
safe_exec "setprop persist.vendor.radio.enable_iwlan false"
safe_exec "setprop persist.vendor.radio.iwlan_enable false"
safe_exec "setprop ro.telephony.iwlan_operation_mode legacy"

# Set network mode to LTE/GSM/WCDMA (22)
safe_exec "settings put global preferred_network_mode 22"
safe_exec "settings put global preferred_network_mode0 22"
safe_exec "settings put global preferred_network_mode1 22"

# Basic WiFi calling disable
safe_exec "settings put global wfc_ims_enabled 0"

# Ensure mobile data is enabled
safe_exec "settings put global mobile_data 1"

# Wait and check airplane mode again
sleep 5
AIRPLANE_CHECK=$(settings get global airplane_mode_on 2>/dev/null)
if [ "$AIRPLANE_CHECK" = "1" ]; then
    echo "$(date): WARNING: Airplane mode turned ON - reverting" >> /data/local/tmp/s21fe_4g_fix.log
    safe_exec "settings put global airplane_mode_on 0"
fi

# Log final status
echo "$(date): Final status:" >> /data/local/tmp/s21fe_4g_fix.log
echo "$(date): - Airplane mode: $(settings get global airplane_mode_on 2>/dev/null)" >> /data/local/tmp/s21fe_4g_fix.log
echo "$(date): - Mobile data: $(settings get global mobile_data 2>/dev/null)" >> /data/local/tmp/s21fe_4g_fix.log
echo "$(date): - Network mode: $(settings get global preferred_network_mode 2>/dev/null)" >> /data/local/tmp/s21fe_4g_fix.log
echo "$(date): - IWLAN status: $(getprop persist.vendor.radio.enable_iwlan)" >> /data/local/tmp/s21fe_4g_fix.log

echo "$(date): Samsung S21 FE 4G Fix - Service completed" >> /data/local/tmp/s21fe_4g_fix.log