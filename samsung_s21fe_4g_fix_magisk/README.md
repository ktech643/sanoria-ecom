# Samsung S21 FE 4G Connectivity Fix - Magisk Module

## Description
This Magisk module fixes 4G connectivity issues on Samsung S21 FE devices where the phone gets stuck on IWLAN (WiFi calling) and cannot properly register on cellular data networks.

## What This Module Does
- Disables IWLAN preference to prioritize cellular data
- Forces network mode to LTE/GSM/WCDMA
- Resets telephony services for proper 4G registration
- Configures radio properties for stable cellular connectivity
- Keeps WiFi calling available as a backup option

## Installation
1. Download the module ZIP file
2. Open Magisk Manager
3. Go to Modules section
4. Tap the "+" button and select the ZIP file
5. Reboot your device

## Compatibility
- **Designed for**: Samsung Galaxy S21 FE (SM-G990B)
- **Magisk Version**: 20.4+
- **Android Version**: Android 11+

⚠️ **Warning**: This module modifies telephony settings. While it should work on other Samsung devices with similar issues, it's specifically designed for S21 FE.

## Features
### System Properties Modified
- `persist.vendor.radio.enable_iwlan`: false
- `persist.vendor.radio.iwlan_enable`: false
- `ro.telephony.iwlan_operation_mode`: legacy
- Network mode set to: 22 (LTE/GSM/WCDMA Global)

### Boot Scripts
- **post-fs-data.sh**: Early boot property overrides
- **service.sh**: Late boot network configuration
- **system.prop**: Persistent radio properties

## Verification
After installation and reboot, verify the fix:

```bash
# Check data registration state
adb shell dumpsys telephony.registry | grep mDataRegState

# Should show: mDataRegState=IN_SERVICE

# Check network type
adb shell dumpsys telephony.registry | grep mDataNetworkType

# Should show: mDataNetworkType=LTE (not IWLAN)
```

## Troubleshooting

### If 4G Still Not Working
1. Clear carrier services cache:
   ```
   Settings → Apps → Show system apps → Carrier Services → Clear cache
   ```

2. Manually select network:
   ```
   Settings → Connections → Mobile networks → Network operators
   Turn off "Select automatically" and manually select your carrier
   ```

3. Try different APN settings:
   ```
   Settings → Connections → Mobile networks → Access Point Names
   ```

### Module Not Working
- Ensure Magisk is properly installed and working
- Check Magisk logs for any errors
- Try reinstalling the module
- Make sure your device is actually an S21 FE

## Uninstallation
1. Open Magisk Manager
2. Go to Modules section
3. Find "Samsung S21 FE 4G Connectivity Fix"
4. Tap the trash icon
5. Reboot

## Backup
The module creates backups of your original settings in:
`/data/adb/modules/samsung_s21fe_4g_fix/backup/`

## Support
- Report issues with device logs
- Include output of: `adb shell getprop | grep radio`
- Mention your carrier and region

## Changelog
### v1.0
- Initial release
- Basic IWLAN to LTE conversion
- Automatic network registration fixes

## License
This module is provided as-is without any warranty. Use at your own risk.

## Credits
- XDA Community for research and testing
- Magisk by topjohnwu