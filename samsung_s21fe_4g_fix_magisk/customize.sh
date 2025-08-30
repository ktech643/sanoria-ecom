#!/system/bin/sh
# Samsung S21 FE 4G Fix - Customize Script

# Display module info
ui_print "********************************"
ui_print " Samsung S21 FE 4G Fix Module  "
ui_print "********************************"
ui_print " "
ui_print "This module fixes 4G connectivity"
ui_print "issues by disabling IWLAN preference"
ui_print "and forcing cellular data mode."
ui_print " "

# Check device
DEVICE=$(getprop ro.product.device)
MODEL=$(getprop ro.product.model)

ui_print "- Device: $DEVICE"
ui_print "- Model: $MODEL"

# Warning for non-S21 FE devices
if [[ ! "$MODEL" =~ "SM-G990" ]] && [[ ! "$DEVICE" =~ "r9q" ]]; then
    ui_print " "
    ui_print "⚠️  WARNING: This module is designed"
    ui_print "   for Samsung S21 FE (SM-G990B)"
    ui_print "   Your device: $MODEL"
    ui_print "   Continue at your own risk!"
    ui_print " "
fi

# Set permissions
ui_print "- Setting permissions..."
set_perm_recursive $MODPATH 0 0 0755 0644
set_perm $MODPATH/service.sh 0 0 0755
set_perm $MODPATH/post-fs-data.sh 0 0 0755

# Create backup of current network settings
ui_print "- Backing up current settings..."
mkdir -p $MODPATH/backup
settings get global preferred_network_mode > $MODPATH/backup/preferred_network_mode.txt 2>/dev/null
settings get global wfc_ims_enabled > $MODPATH/backup/wfc_ims_enabled.txt 2>/dev/null
getprop persist.vendor.radio.enable_iwlan > $MODPATH/backup/iwlan_enabled.txt 2>/dev/null

ui_print " "
ui_print "✓ Module installed successfully!"
ui_print " "
ui_print "- Please reboot your device"
ui_print "- After reboot, wait 2-3 minutes"
ui_print "- Check network status in Settings"
ui_print " "
ui_print "If you need to uninstall:"
ui_print "Use Magisk Manager to remove module"
ui_print " "