# Samsung S21 FE 4G Connectivity Fix - Magisk Module

This Magisk module fixes the 4G connectivity issue on Samsung S21 FE where the device gets stuck on IWLAN (WiFi calling) and cannot register properly on the cellular data network.

## Problem Description
- Device shows `mDataRegState: NOT_REG_OR_SEARCHING` for cellular data
- Device is forced to use IWLAN (WiFi calling) for all connectivity
- 4G/LTE registration fails, only emergency calls available on cellular
- Frequent cell tower handoffs without proper data registration

## Solution
This module converts IWLAN preference to GSM/LTE mode and forces proper cellular data registration while keeping WiFi calling as backup option.

## Requirements
- **Rooted Samsung S21 FE** (SM-G990B/DS/E/U variants)
- **Magisk v20.4+** installed
- **Android 11+** (One UI 3.1+)

## Installation

### Method 1: Magisk Manager (Recommended)
1. Download the `Samsung_S21FE_4G_Fix_v1.0.zip` file
2. Open Magisk Manager
3. Go to **Modules** tab
4. Tap **Install from storage**
5. Select the downloaded ZIP file
6. Wait for installation to complete
7. **Reboot your device**

### Method 2: Custom Recovery (TWRP/OrangeFox)
1. Boot into recovery mode
2. Go to **Install** section
3. Select the ZIP file
4. Swipe to confirm flash
5. Reboot to system

## What the Module Does

### Boot-time Actions
1. **Early Boot (post-fs-data.sh)**:
   - Sets critical system properties before telephony services start
   - Disables IWLAN at the lowest system level
   - Forces LTE/GSM preference early in boot process

2. **Late Boot (service.sh)**:
   - Applies network mode settings (LTE/GSM/WCDMA Global - Mode 22)
   - Configures WiFi calling as backup only
   - Forces cellular data registration
   - Resets telephony services
   - Clears carrier configuration cache

### Persistent Properties Set
```bash
# IWLAN Disable
persist.vendor.radio.enable_iwlan=false
persist.vendor.radio.iwlan_enable=false
ro.telephony.iwlan_operation_mode=legacy

# Network Mode
ro.telephony.default_network=22,22
persist.vendor.radio.rat_on=primary,1

# Data Preference
persist.vendor.radio.data_ltd_sys_ind=1
persist.vendor.radio.data_con_rprt=1
```

## Verification

### Check if Module is Working
1. **Via Magisk Manager**:
   - Go to Modules tab
   - Ensure "Samsung S21 FE 4G Fix" shows as enabled

2. **Via Terminal/ADB**:
   ```bash
   # Check if properties are set
   adb shell "getprop persist.vendor.radio.enable_iwlan"
   # Should return: false
   
   # Check network mode
   adb shell "settings get global preferred_network_mode"
   # Should return: 22
   
   # Check data registration
   adb shell "dumpsys telephony.registry | grep -E 'mDataRegState|mDataNetworkType'"
   # mDataRegState should show: IN_SERVICE
   # mDataNetworkType should show: LTE (not IWLAN)
   ```

3. **Check Logs**:
   ```bash
   adb shell "cat /data/local/tmp/s21fe_4g_fix.log"
   ```

### Expected Results After Fix
- **Data Registration**: `mDataRegState: IN_SERVICE`
- **Network Type**: `mDataNetworkType: LTE` (not `IWLAN`)
- **Signal Strength**: Proper cellular signal bars
- **Internet**: 4G/LTE data working on cellular network
- **WiFi Calling**: Still available but as backup option

## Troubleshooting

### Module Not Working
1. **Check Magisk Logs**:
   - Open Magisk Manager → Logs
   - Look for errors related to the module

2. **Verify Installation**:
   ```bash
   adb shell "ls -la /data/adb/modules/samsung_s21fe_4g_fix/"
   ```

3. **Manual Property Check**:
   ```bash
   adb shell "getprop | grep iwlan"
   adb shell "getprop | grep network_mode"
   ```

### Still No 4G After Installation
1. **Try Different Network Mode**:
   - Open Phone app, dial `*#*#4636#*#*`
   - Go to Phone Information
   - Set network type to "LTE/WCDMA/GSM"

2. **Manual Network Selection**:
   - Settings → Connections → Mobile networks → Network operators
   - Turn off "Select automatically"
   - Manually select your carrier

3. **Reset Network Settings**:
   - Settings → General management → Reset → Reset network settings
   - **Note**: This will reset WiFi passwords

### Emergency Restore
If the module causes issues:

1. **Disable Module**:
   - Boot into safe mode or recovery
   - Open Magisk Manager
   - Disable the module
   - Reboot

2. **Remove Module Completely**:
   ```bash
   adb shell "rm -rf /data/adb/modules/samsung_s21fe_4g_fix"
   adb reboot
   ```

## Network Mode Reference
- `0` = GSM only
- `1` = GSM/WCDMA (WCDMA preferred)
- `2` = WCDMA only
- `9` = LTE/GSM/WCDMA
- `10` = LTE only
- `11` = LTE/WCDMA
- `22` = LTE/GSM/WCDMA (Global) - **Used by this module**
- `23` = LTE/WCDMA/GSM (LTE preferred)

## Compatibility
- **Tested on**: Samsung S21 FE (SM-G990B, SM-G990E)
- **Android Version**: 11, 12, 13, 14
- **One UI Version**: 3.1, 4.0, 4.1, 5.0, 5.1, 6.0+
- **Magisk Version**: 20.4+

**Note**: While optimized for S21 FE, this module may work on other Samsung Galaxy devices experiencing similar IWLAN connectivity issues.

## File Structure
```
samsung_s21fe_4g_fix/
├── META-INF/
│   └── com/google/android/
│       ├── update-binary
│       └── updater-script
├── module.prop
├── customize.sh
├── post-fs-data.sh
├── service.sh
├── system.prop (created during installation)
└── README.md
```

## Logs and Debugging
- **Module logs**: `/data/local/tmp/s21fe_4g_fix.log`
- **Magisk logs**: Magisk Manager → Logs
- **System logs**: `adb logcat | grep -E 'telephony|radio|iwlan'`

## Uninstallation
1. Open Magisk Manager
2. Go to Modules tab
3. Tap the trash icon next to "Samsung S21 FE 4G Fix"
4. Reboot device

## Disclaimer
This module modifies system-level telephony settings. While tested on Samsung S21 FE devices, use at your own risk. Always have a backup plan (custom recovery) in case you need to remove the module.

## Changelog

### v1.0 (Initial Release)
- Disable IWLAN preference system-wide
- Force LTE/GSM/WCDMA network mode (Global)
- Reset telephony services on boot
- Keep WiFi calling as backup option
- Comprehensive logging for troubleshooting

## Credits
- Original ADB fix script analysis and testing
- Magisk module template by topjohnwu
- Samsung telephony property research by Android community

## Support
If you encounter issues:
1. Check the troubleshooting section above
2. Review the log file: `/data/local/tmp/s21fe_4g_fix.log`
3. Ensure your device is properly rooted with Magisk
4. Verify your carrier supports the network modes being set