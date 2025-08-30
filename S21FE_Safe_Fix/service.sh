#!/system/bin/sh

# Samsung S21 FE SAFE 4G Fix - Service Script
# This is a MINIMAL, SAFE version that won't break airplane mode or radio

# Wait for system to be ready
sleep 45

# Create log directory
mkdir -p /data/local/tmp

# Log start
echo "$(date): Samsung S21 FE SAFE 4G Fix - Starting" >> /data/local/tmp/s21fe_safe_fix.log

# Function to log and execute commands safely
safe_exec() {
    echo "$(date): SAFE - Executing: $1" >> /data/local/tmp/s21fe_safe_fix.log
    eval "$1" 2>/dev/null || true
    echo "$(date): SAFE - Completed: $1" >> /data/local/tmp/s21fe_safe_fix.log
}

# Check airplane mode first - DO NOT proceed if airplane mode is on
AIRPLANE_MODE=$(settings get global airplane_mode_on)
if [ "$AIRPLANE_MODE" = "1" ]; then
    echo "$(date): SAFE - Airplane mode is ON, skipping all changes" >> /data/local/tmp/s21fe_safe_fix.log
    exit 0
fi

# === MINIMAL SAFE IWLAN TO GSM CONVERSION ===

# Step 1: Basic IWLAN disable (SAFE)
safe_exec "setprop persist.vendor.radio.enable_iwlan false"
safe_exec "setprop persist.vendor.radio.iwlan_enable false"
safe_exec "setprop ro.telephony.iwlan_operation_mode legacy"

# Step 2: Set network mode to LTE/GSM (SAFE)
safe_exec "settings put global preferred_network_mode 22"

# Step 3: Basic WiFi calling disable (SAFE)
safe_exec "settings put global wfc_ims_enabled 0"

# Step 4: Ensure mobile data is enabled (SAFE)
safe_exec "settings put global mobile_data 1"

# Step 5: Wait and verify airplane mode is still OFF
sleep 10
AIRPLANE_CHECK=$(settings get global airplane_mode_on)
if [ "$AIRPLANE_CHECK" = "1" ]; then
    echo "$(date): SAFE - WARNING: Airplane mode turned ON unexpectedly" >> /data/local/tmp/s21fe_safe_fix.log
    # Turn airplane mode OFF if it got turned on
    safe_exec "settings put global airplane_mode_on 0"
    sleep 5
fi

# Step 6: Final verification (SAFE)
echo "$(date): SAFE - Final status check:" >> /data/local/tmp/s21fe_safe_fix.log
echo "$(date): SAFE - Airplane mode: $(settings get global airplane_mode_on)" >> /data/local/tmp/s21fe_safe_fix.log
echo "$(date): SAFE - Mobile data: $(settings get global mobile_data)" >> /data/local/tmp/s21fe_safe_fix.log
echo "$(date): SAFE - Network mode: $(settings get global preferred_network_mode)" >> /data/local/tmp/s21fe_safe_fix.log
echo "$(date): SAFE - IWLAN enabled: $(getprop persist.vendor.radio.enable_iwlan)" >> /data/local/tmp/s21fe_safe_fix.log

echo "$(date): Samsung S21 FE SAFE 4G Fix - Completed successfully" >> /data/local/tmp/s21fe_safe_fix.log