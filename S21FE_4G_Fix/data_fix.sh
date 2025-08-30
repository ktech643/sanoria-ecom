#!/system/bin/sh

# Samsung S21 FE Data Connection Fix Script
# This script specifically fixes data connectivity issues after IWLAN to GSM conversion

# Wait for main service script to complete
sleep 60

echo "$(date): Data Connection Fix - Starting" >> /data/local/tmp/s21fe_4g_fix.log

# Function to log and execute commands
log_exec() {
    echo "$(date): Data Fix - Executing: $1" >> /data/local/tmp/s21fe_4g_fix.log
    eval "$1"
    echo "$(date): Data Fix - Exit code: $?" >> /data/local/tmp/s21fe_4g_fix.log
}

# === COMPREHENSIVE DATA CONNECTION RESTORATION ===

# Step 1: Reset all data connections
log_exec "svc data disable"
sleep 5
log_exec "svc data enable"

# Step 2: Clear telephony database and cache
log_exec "pm clear com.android.providers.telephony"
log_exec "pm clear com.android.phone"
sleep 3

# Step 3: Reset APN database
log_exec "content delete --uri content://telephony/carriers/preferapn"
log_exec "content delete --uri content://telephony/carriers/current"

# Step 4: Force network interface reset
log_exec "ifconfig rmnet0 down 2>/dev/null || true"
log_exec "ifconfig rmnet_data0 down 2>/dev/null || true"
sleep 2
log_exec "ifconfig rmnet0 up 2>/dev/null || true"
log_exec "ifconfig rmnet_data0 up 2>/dev/null || true"

# Step 5: Reset routing table
log_exec "ip route flush table main 2>/dev/null || true"
log_exec "ip route add default via 0.0.0.0 dev rmnet0 2>/dev/null || true"

# Step 6: Force DNS resolution
log_exec "setprop net.dns1 8.8.8.8"
log_exec "setprop net.dns2 8.8.4.4"
log_exec "setprop net.rmnet0.dns1 8.8.8.8"
log_exec "setprop net.rmnet0.dns2 8.8.4.4"

# Step 7: Restart data services
log_exec "stop ril-daemon"
sleep 3
log_exec "start ril-daemon"

# Step 8: Force data connection establishment
sleep 10
log_exec "svc data disable"
sleep 5
log_exec "svc data enable"

# Step 9: Test data connection
sleep 15
PING_RESULT=$(ping -c 3 -W 5 8.8.8.8 2>/dev/null | grep "packet loss" || echo "ping failed")
echo "$(date): Data Fix - Ping result: $PING_RESULT" >> /data/local/tmp/s21fe_4g_fix.log

# Step 10: If data still not working, try alternative methods
if echo "$PING_RESULT" | grep -q "100% packet loss\|ping failed"; then
    echo "$(date): Data Fix - Primary method failed, trying alternatives" >> /data/local/tmp/s21fe_4g_fix.log
    
    # Alternative 1: Reset network settings completely
    log_exec "settings put global airplane_mode_on 1"
    sleep 5
    log_exec "settings put global airplane_mode_on 0"
    sleep 10
    
    # Alternative 2: Force network re-registration
    log_exec "am broadcast -a android.intent.action.SIM_STATE_CHANGED"
    log_exec "am broadcast -a android.intent.action.SERVICE_STATE"
    
    # Alternative 3: Manual APN trigger
    log_exec "am start -a android.settings.APN_SETTINGS"
    sleep 3
    log_exec "input keyevent 4"  # Back button
    
    # Final test
    sleep 10
    PING_RESULT2=$(ping -c 3 -W 5 8.8.8.8 2>/dev/null | grep "packet loss" || echo "ping failed")
    echo "$(date): Data Fix - Final ping result: $PING_RESULT2" >> /data/local/tmp/s21fe_4g_fix.log
fi

echo "$(date): Data Connection Fix - Completed" >> /data/local/tmp/s21fe_4g_fix.log