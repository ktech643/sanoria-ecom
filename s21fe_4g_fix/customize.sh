#!/sbin/sh

# Magisk Module Installer

# Set flags
SKIPMOUNT=false
PROPFILE=false
POSTFSDATA=true
LATESTARTSERVICE=true

# Print module name
ui_print "********************************"
ui_print "  Samsung S21 FE 4G Fix v1.0   "
ui_print "********************************"
ui_print "- Installing 4G connectivity fix"
ui_print "- This will disable IWLAN preference"
ui_print "- And force proper cellular registration"

# Check device
DEVICE=$(getprop ro.product.model)
ui_print "- Device: $DEVICE"

if echo "$DEVICE" | grep -q "SM-G990"; then
    ui_print "- Samsung S21 FE detected"
else
    ui_print "- Warning: Optimized for S21 FE"
fi

ui_print "- Installation complete"
ui_print "- Please reboot to apply changes"