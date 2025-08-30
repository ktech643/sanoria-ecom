#!/system/bin/sh
# Verification script for Samsung S21 FE 4G Fix

echo "=== Samsung S21 FE 4G Fix Verification ==="
echo ""

# Check if module is installed
if [ -d "/data/adb/modules/samsung_s21fe_4g_fix" ]; then
    echo "✓ Module is installed"
else
    echo "✗ Module is NOT installed"
    exit 1
fi

echo ""
echo "=== Checking System Properties ==="

# Check IWLAN properties
IWLAN_ENABLED=$(getprop persist.vendor.radio.enable_iwlan)
if [ "$IWLAN_ENABLED" = "false" ]; then
    echo "✓ IWLAN disabled: $IWLAN_ENABLED"
else
    echo "✗ IWLAN still enabled: $IWLAN_ENABLED"
fi

# Check network mode
NETWORK_MODE=$(settings get global preferred_network_mode)
if [ "$NETWORK_MODE" = "22" ]; then
    echo "✓ Network mode set to LTE/GSM/WCDMA: $NETWORK_MODE"
else
    echo "⚠️  Network mode: $NETWORK_MODE (expected: 22)"
fi

# Check WiFi calling
WFC_ENABLED=$(settings get global wfc_ims_enabled)
if [ "$WFC_ENABLED" = "0" ]; then
    echo "✓ WiFi calling disabled by default: $WFC_ENABLED"
else
    echo "⚠️  WiFi calling: $WFC_ENABLED"
fi

echo ""
echo "=== Checking Network Status ==="

# Parse telephony registry
dumpsys telephony.registry | grep -E "mServiceState|mDataRegState|mDataNetworkType" | while read line; do
    if echo "$line" | grep -q "mDataRegState"; then
        if echo "$line" | grep -q "IN_SERVICE"; then
            echo "✓ Data registration: IN_SERVICE"
        else
            echo "✗ Data registration: $(echo $line | grep -oE 'mDataRegState=[^ ]*')"
        fi
    elif echo "$line" | grep -q "mDataNetworkType"; then
        if echo "$line" | grep -q "IWLAN"; then
            echo "✗ Network type still on IWLAN"
        else
            echo "✓ Network type: $(echo $line | grep -oE 'mDataNetworkType=[^ ]*')"
        fi
    fi
done

echo ""
echo "=== Mobile Data Status ==="
MOBILE_DATA=$(settings get global mobile_data)
if [ "$MOBILE_DATA" = "1" ]; then
    echo "✓ Mobile data enabled"
else
    echo "✗ Mobile data disabled"
fi

echo ""
echo "=== Summary ==="
echo "If all checks show ✓, the fix is working correctly."
echo "If you see ✗, try rebooting again or check module logs."
echo ""