#!/system/bin/sh
# Check 4G data status

echo "=== 4G Data Connection Check ==="
echo ""

# Network type
echo "Network Type:"
dumpsys telephony.registry | grep "mDataNetworkType=" | tail -1

echo ""
echo "Data Connection State:"
dumpsys telephony.registry | grep "mDataConnectionState=" | tail -1
echo "(0=DISCONNECTED, 1=CONNECTING, 2=CONNECTED)"

echo ""
echo "Data Activity:"
dumpsys telephony.registry | grep "mDataActivity=" | tail -1

echo ""
echo "Mobile Data Settings:"
echo "Mobile data enabled: $(settings get global mobile_data)"
echo "Data roaming: $(settings get global data_roaming)"

echo ""
echo "APN Info:"
content query --uri content://telephony/carriers/preferapn

echo ""
echo "IP Address:"
ip addr show | grep rmnet

echo ""
echo "DNS Servers:"
getprop net.dns1
getprop net.dns2

echo ""
echo "Ping Test:"
ping -c 3 8.8.8.8 || echo "Data connection not working"