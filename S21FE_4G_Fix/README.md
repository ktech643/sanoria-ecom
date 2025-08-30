# Samsung S21 FE 4G Fix - IWLAN to GSM/LTE Conversion Module

This Magisk module completely converts Samsung S21 FE from IWLAN-only mode to proper GSM/LTE cellular connectivity.

## Problem Description
- Device stuck on IWLAN (WiFi calling) for all connectivity
- Shows `mDataRegState: NOT_REG_OR_SEARCHING` for cellular data
- Cannot register on 4G/LTE network properly
- Only emergency calls available on cellular network
- WiFi calling becomes the primary connection method

## Solution - Complete IWLAN to GSM/LTE Conversion
This module performs a comprehensive conversion from IWLAN to GSM/LTE by:

### Early Boot (post-fs-data.sh)
- **Complete IWLAN Disable**: Sets 15+ properties to disable IWLAN at system level
- **Force GSM/LTE Preference**: Configures radio to prefer cellular over WiFi
- **IMS Configuration**: Disables IMS over IWLAN, enables VoLTE over cellular
- **Network Mode Setting**: Forces LTE/GSM/WCDMA global mode (22)

### System Properties (system.prop)
- **Persistent IWLAN Block**: 25+ properties ensure IWLAN stays disabled
- **Cellular Preference**: Forces cellular data and voice preference
- **Dual SIM Support**: Proper configuration for dual SIM variants
- **Network Enforcement**: Ensures network mode stays on cellular

### Late Boot (service.sh)
- **Settings Configuration**: Updates Android settings for network preferences
- **Telephony Reset**: Restarts radio services to apply changes
- **Carrier Config Reset**: Clears carrier-specific IWLAN preferences
- **Network Re-registration**: Forces device to register on cellular network
- **Service Disable**: Disables any remaining IWLAN services

## Installation
1. Download `S21FE_4G_Fix_v1.0.zip`
2. Install via Magisk Manager
3. Reboot device
4. Wait 3-5 minutes for complete conversion

## Verification
After reboot, check conversion success:

```bash
# Check network registration
adb shell "dumpsys telephony.registry | grep -E 'mDataRegState|mDataNetworkType'"
# Should show: mDataRegState=IN_SERVICE, mDataNetworkType=LTE

# Verify IWLAN is disabled
adb shell "getprop persist.vendor.radio.enable_iwlan"
# Should return: false

# Check network mode
adb shell "settings get global preferred_network_mode"
# Should return: 22 (LTE/GSM/WCDMA Global)
```

## Expected Results After Conversion
- ✅ **Data Registration**: `mDataRegState: IN_SERVICE`
- ✅ **Network Type**: `mDataNetworkType: LTE` (not IWLAN)
- ✅ **Cellular Bars**: Shows proper 4G/LTE signal strength
- ✅ **Mobile Data**: Works on cellular network
- ✅ **Voice Calls**: Uses VoLTE over cellular (not WiFi calling)
- ✅ **WiFi Calling**: Available as backup option only

## Comprehensive Features
- **25+ System Properties**: Complete IWLAN disable and GSM/LTE force
- **Dual SIM Support**: Works with single and dual SIM variants
- **Persistent Settings**: Survives reboots and system updates
- **Detailed Logging**: All actions logged to `/data/local/tmp/s21fe_4g_fix.log`
- **Service Management**: Disables IWLAN services, enables cellular services
- **Radio Management**: Properly restarts telephony stack

## Compatibility
- **Samsung S21 FE**: All variants (SM-G990B/DS/E/U)
- **Android**: 11, 12, 13, 14
- **One UI**: 3.1, 4.0, 4.1, 5.0, 5.1, 6.0+
- **Magisk**: v20.4+

## Troubleshooting IWLAN to GSM Conversion

### If Still Shows IWLAN After Installation
1. **Check Module Status**:
   ```bash
   adb shell "ls /data/adb/modules/s21fe_4g_fix/"
   ```

2. **Verify Properties Applied**:
   ```bash
   adb shell "getprop | grep iwlan"
   # All should show false/disabled
   ```

3. **Force Network Mode**:
   ```bash
   adb shell "settings put global preferred_network_mode 22"
   adb reboot
   ```

### Manual IWLAN to GSM Conversion
If module doesn't work, apply manually:
```bash
# Disable IWLAN completely
adb shell "setprop persist.vendor.radio.enable_iwlan false"
adb shell "setprop persist.vendor.radio.iwlan_enable false"
adb shell "setprop persist.vendor.radio.iwlan_operation_mode false"

# Force GSM/LTE mode
adb shell "settings put global preferred_network_mode 22"

# Reset telephony
adb shell "setprop ctl.restart ril-daemon"
adb reboot
```

## Logs and Debugging
- **Module Logs**: `/data/local/tmp/s21fe_4g_fix.log`
- **Network Status**: `adb shell "dumpsys telephony.registry"`
- **Properties**: `adb shell "getprop | grep -E 'iwlan|network_mode|radio'"`

## Uninstallation
To revert IWLAN to GSM conversion:
1. Remove module via Magisk Manager
2. Reboot device
3. Or manually restore IWLAN:
   ```bash
   adb shell "setprop persist.vendor.radio.enable_iwlan true"
   adb shell "settings put global wfc_ims_enabled 1"
   ```

## Changelog
### v1.0 - Complete IWLAN to GSM/LTE Conversion
- 25+ system properties for complete IWLAN disable
- Comprehensive GSM/LTE preference enforcement
- Dual SIM support and configuration
- Telephony service management
- Persistent settings across reboots
- Detailed logging and verification

## Support
This module performs a complete conversion from IWLAN to GSM/LTE connectivity. If issues persist, verify:
1. Device is properly rooted with Magisk
2. Carrier supports GSM/LTE modes being set
3. SIM card is properly inserted and activated
4. No carrier-specific restrictions on network mode changes