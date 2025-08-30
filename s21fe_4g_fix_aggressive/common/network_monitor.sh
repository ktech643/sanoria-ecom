#!/system/bin/sh
# Network monitor script - can be run manually to check status

echo "=== S21 FE Network Monitor ==="
echo ""

# Check current network type
echo "Current Network Status:"
dumpsys telephony.registry | grep -E "mServiceState|mDataRegState|mDataNetworkType|mDataConnectionState" | head -10

echo ""
echo "Network Settings:"
echo "Preferred network mode: $(settings get global preferred_network_mode)"
echo "WiFi calling enabled: $(settings get global wfc_ims_enabled)"
echo "Mobile data: $(settings get global mobile_data)"

echo ""
echo "Radio Properties:"
getprop | grep -E "iwlan|radio.enable|wfc|voiwifi" | grep -v "ril.ecclist"

echo ""
echo "Active Network:"
dumpsys connectivity | grep "Active network" | head -5

echo ""
echo "Module Log:"
tail -20 /data/local/tmp/s21fe_4g_fix.log 2>/dev/null || echo "No log file found"