#!/sbin/sh

##########################################################################################
#
# Magisk Module Installer Script
#
##########################################################################################

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
REPLACE=""

##########################################################################################
# Function Callbacks
##########################################################################################

# The following functions will be called by the installation framework.
# You do not have the ability to modify update-binary, the only way you can customize
# installation is through implementing these functions.
#
# When running your callbacks, the installation framework will make sure the Magisk
# internal busybox path is *PREPENDED* to PATH, so all common commands shall exist.
# Also, it will make sure /data, /system, and /vendor is properly mounted.

##########################################################################################
# The installation framework will export some variables and functions.
# You should use these variables and functions for installation.
#
# ! DO NOT use any Magisk internal paths as those are NOT public API.
# ! DO NOT use other functions in util_functions.sh as they are NOT public API.
# ! Non-public APIs are not guaranteed to maintain compatibility between releases.
#
# Available variables:
#
# MAGISK_VER (string): the version string of current installed Magisk
# MAGISK_VER_CODE (int): the version code of current installed Magisk
# BOOTMODE (bool): true if the module is currently being installed in Magisk Manager
# MODPATH (path): the path where your module files should be installed
# TMPDIR (path): a place where you can temporarily store files
# ZIPFILE (path): your module's installation zip
# ARCH (string): the architecture of the device. Value is either arm, arm64, x86, or x64
# IS64BIT (bool): true if $ARCH is either arm64 or x64
# API (int): the API level (Android version) of the device
#
# Available functions:
#
# ui_print <msg>
#     print <msg> to console
#     Avoid using 'echo' as it will not display in custom recovery's console
#
# abort <msg>
#     print error message <msg> to console and terminate installation
#     Avoid using 'exit' as it will skip the termination cleanup steps
#
# set_perm <target> <owner> <group> <permission> [context]
#     if [context] is empty, it will default to "u:object_r:system_file:s0"
#     this function is a shorthand for the following commands
#       chown owner.group target
#       chmod permission target
#       chcon context target
#
# set_perm_recursive <directory> <owner> <group> <dirpermission> <filepermission> [context]
#     if [context] is empty, it will default to "u:object_r:system_file:s0"
#     for all files in <directory>, it will call:
#       set_perm file owner group filepermission context
#     for all directories in <directory> (including itself), it will call:
#       set_perm dir owner group dirpermission context
#
##########################################################################################

##########################################################################################
# If you need boot scripts, DO NOT use general boot scripts (service.d/post-fs-data.d)
# ONLY use module scripts as it respects the module status (remove/disable) and is
# guaranteed to maintain the same behavior in future Magisk releases.
# Enable boot scripts by setting the flags in the config section above.
##########################################################################################

print_modname() {
  ui_print "*******************************"
  ui_print " Samsung S21 FE 4G Fix Module  "
  ui_print "*******************************"
}

on_install() {
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
}

set_permissions() {
  # The following is the default rule, DO NOT remove
  set_perm_recursive $MODPATH 0 0 0755 0644

  # Set executable permissions for our scripts
  set_perm $MODPATH/service.sh 0 0 0755
  set_perm $MODPATH/post-fs-data.sh 0 0 0755
}