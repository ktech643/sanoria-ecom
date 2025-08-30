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

## Support
If you encounter issues:
1. Check the troubleshooting section above
2. Review the log file: `/data/local/tmp/s21fe_4g_fix.log`
3. Ensure your device is properly rooted with Magisk
4. Verify your carrier supports the network modes being set