#!/sbin/sh

# Samsung S21 FE 4G Fix - Customize Script

# Config flags
SKIPMOUNT=false
PROPFILE=true
POSTFSDATA=false
LATESTARTSERVICE=true

# Print module info
ui_print "********************************"
ui_print "  Samsung S21 FE 4G Fix v1.0   "
ui_print "********************************"

# Check device
DEVICE=$(getprop ro.product.model)
ui_print "- Device: $DEVICE"

if echo "$DEVICE" | grep -q "SM-G990"; then
    ui_print "✓ Samsung S21 FE detected"
elif echo "$DEVICE" | grep -q "Galaxy S21 FE"; then
    ui_print "✓ Samsung S21 FE detected"
else
    ui_print "! Warning: Optimized for Samsung S21 FE"
    ui_print "! Current device may not be fully supported"
fi

ui_print "- Installing 4G connectivity fix..."
ui_print "- This module will:"
ui_print "  • Disable IWLAN preference"
ui_print "  • Force LTE/GSM network mode"
ui_print "  • Fix 4G registration issues"
ui_print "  • Apply safe system properties"

ui_print "- Installation completed"
ui_print "- Reboot required to apply changes"
ui_print "- Check logs: /data/local/tmp/s21fe_4g_fix.log"