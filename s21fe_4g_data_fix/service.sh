#!/system/bin/sh
# Fix 4G data connection after boot

# Wait for boot
while [ "$(getprop sys.boot_completed)" != "1" ]; do
  sleep 5
done

sleep 10

# Function to fix data
fix_data_connection() {
  # Reset APN to default
  settings put global apn_restore_delay_default_int 3000
  content delete --uri content://telephony/carriers/restore
  
  # Enable mobile data
  settings put global mobile_data 1
  settings put global mobile_data0 1
  settings put global mobile_data1 1
  settings put global mobile_data_always_on 1
  settings put global data_roaming 0
  
  # Fix data service
  svc data enable
  cmd connectivity airplane-mode disable
  
  # Reset network mode to LTE/GSM/WCDMA
  settings put global preferred_network_mode 9
  settings put global preferred_network_mode0 9
  settings put global preferred_network_mode1 9
  
  # Enable data for all apps
  cmd netpolicy set restrict-background false
  
  # Fix DNS
  setprop net.dns1 8.8.8.8
  setprop net.dns2 8.8.4.4
  
  # Restart data services
  stop netd
  start netd
  
  # Force data connection
  am broadcast -a android.intent.action.ANY_DATA_STATE -es apn "default"
  am broadcast -a android.telephony.action.DEFAULT_DATA_SUBSCRIPTION_CHANGED
  
  # Reset telephony
  pkill -TERM -f com.android.phone
  
  # Restart network
  ifconfig rmnet_data0 down
  ifconfig rmnet_data0 up
  
  # Force APN update
  am broadcast -a android.intent.action.SIM_STATE_CHANGED
  am broadcast -a android.telephony.action.CARRIER_CONFIG_CHANGED
}

# Initial fix
fix_data_connection

# Log status
echo "[4G-DATA-FIX] Initial data fix applied" > /data/local/tmp/4g_data_fix.log

# Monitor data connection
while true; do
  # Check if mobile data is enabled but not working
  MOBILE_DATA=$(settings get global mobile_data)
  DATA_STATE=$(dumpsys telephony.registry | grep "mDataConnectionState=" | tail -1 | cut -d= -f2 | cut -d' ' -f1)
  
  if [ "$MOBILE_DATA" = "1" ] && [ "$DATA_STATE" != "2" ]; then
    echo "[4G-DATA-FIX] Data not connected, attempting fix..." >> /data/local/tmp/4g_data_fix.log
    
    # Try to fix data
    fix_data_connection
    
    # If still not working, try more aggressive fix
    sleep 10
    DATA_STATE=$(dumpsys telephony.registry | grep "mDataConnectionState=" | tail -1 | cut -d= -f2 | cut -d' ' -f1)
    if [ "$DATA_STATE" != "2" ]; then
      echo "[4G-DATA-FIX] Applying aggressive fix..." >> /data/local/tmp/4g_data_fix.log
      
      # Toggle airplane mode
      settings put global airplane_mode_on 1
      am broadcast -a android.intent.action.AIRPLANE_MODE
      sleep 5
      settings put global airplane_mode_on 0
      am broadcast -a android.intent.action.AIRPLANE_MODE
      
      # Clear telephony database
      rm -f /data/data/com.android.providers.telephony/databases/telephony.db
      rm -f /data/data/com.android.providers.telephony/databases/telephony.db-journal
      
      # Reboot radio
      setprop ctl.restart rild
    fi
  fi
  
  sleep 30
done