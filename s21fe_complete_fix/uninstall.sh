#!/system/bin/sh
# Uninstall script - restore IWLAN if needed

# Re-enable IWLAN packages
pm enable com.sec.epdg 2>/dev/null
pm enable com.sec.imsservice 2>/dev/null
pm enable com.samsung.android.iwlan 2>/dev/null

# Clear our logs
rm -f /data/local/tmp/s21fe_4g_complete.log