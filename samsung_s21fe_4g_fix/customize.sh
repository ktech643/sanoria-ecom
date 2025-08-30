#!/sbin/sh

# Samsung S21 FE 4G Connectivity Fix - Installation Script

# Magisk Module Template Install Script
# by topjohnwu, modified for Samsung S21 FE 4G fix

##########################################################################################
# Config Flags
##########################################################################################

# Set to true if you do *NOT* want Magisk to mount
# any files for you. Most modules would want to leave this false.
SKIPMOUNT=false

# Set to true if you need to load system.prop
PROPFILE=true

# Set to true if you need post-fs-data script
POSTFSDATA=true

# Set to true if you need late_start service script
LATESTARTSERVICE=true

##########################################################################################
# Replace list
##########################################################################################

# List all directories you want to directly replace in the system
# Check the documentations for more info why you would need this

# Construct your list in the following format
# This is an example
REPLACE_EXAMPLE="
/system/app/Youtube
/system/priv-app/SystemUI
/system/priv-app/Settings
/system/framework
"

# Construct your own list here
REPLACE="
"

##########################################################################################
# Permissions
##########################################################################################

set_permissions() {
  # The following is the default rule, DO NOT remove
  set_perm_recursive $MODPATH 0 0 0755 0644

  # Here are some examples:
  # set_perm_recursive  $MODPATH/system/lib       0     0       0755      0644
  # set_perm  $MODPATH/system/bin/app_process32   0     2000    0755      u:object_r:zygote_exec:s0
  # set_perm  $MODPATH/system/bin/dex2oat         0     2000    0755      u:object_r:dex2oat_exec:s0
  # set_perm  $MODPATH/system/lib/libart.so       0     0       0644
  
  # Set permissions for our scripts
  set_perm $MODPATH/service.sh 0 0 0755
  set_perm $MODPATH/post-fs-data.sh 0 0 0755
}

##########################################################################################
# MMT Extended Logic - Don't modify anything after this
##########################################################################################

# Device check
ui_print "- Checking device compatibility..."

# Check if this is a Samsung device
MANUFACTURER=$(getprop ro.product.manufacturer)
MODEL=$(getprop ro.product.model)

if [ "$MANUFACTURER" != "samsung" ]; then
    ui_print "! Warning: This module is designed for Samsung devices"
    ui_print "! Current device: $MANUFACTURER $MODEL"
    ui_print "! Proceeding anyway, but module may not work correctly"
fi

# Check for Samsung S21 FE specifically
if echo "$MODEL" | grep -q "SM-G990"; then
    ui_print "✓ Samsung S21 FE detected: $MODEL"
elif echo "$MODEL" | grep -q "Galaxy S21 FE"; then
    ui_print "✓ Samsung S21 FE detected: $MODEL"
else
    ui_print "! Warning: This module is optimized for Samsung S21 FE"
    ui_print "! Current device: $MODEL"
    ui_print "! Module may work on other Samsung devices but is untested"
fi

ui_print "- Installing Samsung S21 FE 4G Connectivity Fix..."
ui_print "- This module will:"
ui_print "  • Disable IWLAN preference"
ui_print "  • Force LTE/GSM network mode"
ui_print "  • Fix 4G registration issues"
ui_print "  • Keep WiFi calling as backup"

# Create system.prop for persistent properties
ui_print "- Creating system properties..."
cat > $MODPATH/system.prop << 'EOF'
# Samsung S21 FE 4G Connectivity Fix Properties
# Disable IWLAN preference
persist.vendor.radio.enable_iwlan=false
persist.vendor.radio.iwlan_enable=false
ro.telephony.iwlan_operation_mode=legacy

# Network mode preferences
ro.telephony.default_network=22,22
persist.vendor.radio.rat_on=primary,1
persist.vendor.radio.sib16_support=0

# IMS and VoWiFi settings
persist.vendor.radio.calls.on.ims=0
persist.vendor.radio.domain.ps=0

# Force cellular data preference
persist.vendor.radio.data_ltd_sys_ind=1
persist.vendor.radio.data_con_rprt=1
EOF

ui_print "- Installation completed!"
ui_print "- Please reboot your device to apply the fix"
ui_print "- Check /data/local/tmp/s21fe_4g_fix.log for detailed logs"