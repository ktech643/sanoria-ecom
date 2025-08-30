# Samsung S21 FE 4G Fix - Installation Guide

## Prerequisites
- Samsung Galaxy S21 FE with 4G connectivity issues
- Device must be rooted with Magisk 20.4 or newer
- USB debugging enabled (for verification)
- ADB installed on your computer (optional, for verification)

## Download
The module file: `samsung_s21fe_4g_fix_v1.0.zip`

## Installation Steps

### Method 1: Via Magisk Manager (Recommended)
1. Transfer `samsung_s21fe_4g_fix_v1.0.zip` to your phone
2. Open Magisk Manager app
3. Tap on "Modules" at the bottom
4. Tap the "Install from storage" button (folder icon)
5. Navigate to and select the ZIP file
6. Wait for installation to complete
7. Tap "Reboot" when prompted

### Method 2: Via Recovery (TWRP)
1. Boot into TWRP recovery
2. Select "Install"
3. Navigate to the ZIP file
4. Swipe to install
5. Reboot to system

### Method 3: Via ADB
```bash
adb push samsung_s21fe_4g_fix_v1.0.zip /sdcard/
adb shell
su
magisk --install-module /sdcard/samsung_s21fe_4g_fix_v1.0.zip
reboot
```

## Post-Installation

### Wait Time
After reboot, wait 2-3 minutes for:
- Telephony services to fully initialize
- Network registration to complete
- Module scripts to apply all changes

### Verification
1. Check network status:
   - Go to Settings → About phone → Status → SIM card status
   - Should show "Mobile network state: Connected"
   - Should show "Mobile data network type: LTE" (not IWLAN)

2. Via ADB (optional):
   ```bash
   adb shell sh /data/adb/modules/samsung_s21fe_4g_fix/common/verify_fix.sh
   ```

3. Test data connection:
   - Turn off WiFi
   - Open a web browser
   - Navigate to any website

## Troubleshooting

### Issue: Still showing IWLAN after reboot
**Solution:**
1. Go to Settings → Connections → Mobile networks
2. Turn off and on "Mobile data"
3. If still not working, manually select network operator

### Issue: No mobile data at all
**Solution:**
1. Check APN settings are correct for your carrier
2. Try toggling airplane mode on/off
3. Perform network settings reset (last resort)

### Issue: Module not showing in Magisk
**Solution:**
1. Verify Magisk is working properly
2. Check Magisk logs for errors
3. Try reinstalling Magisk and then the module

### Issue: Phone bootloops after installation
**Solution:**
1. Boot into Safe Mode (hold Volume Down during boot)
2. Use Magisk Manager to disable/remove the module
3. Or use TWRP to delete `/data/adb/modules/samsung_s21fe_4g_fix`

## Checking Module Logs

### Via Magisk Manager
1. Open Magisk Manager
2. Tap menu (≡) → Logs
3. Look for entries with "[S21FE-4G-FIX]"

### Via ADB
```bash
# Check kernel messages
adb shell dmesg | grep S21FE-4G-FIX

# Check Magisk logs
adb shell cat /data/adb/magisk.log | grep samsung_s21fe

# Check module execution
adb shell ls -la /data/adb/modules/samsung_s21fe_4g_fix/
```

## Uninstallation

### Via Magisk Manager
1. Open Magisk Manager
2. Go to Modules
3. Find "Samsung S21 FE 4G Connectivity Fix"
4. Tap the trash icon
5. Reboot

### Via ADB
```bash
adb shell
su
rm -rf /data/adb/modules/samsung_s21fe_4g_fix
reboot
```

## Reverting Changes
If you need to restore IWLAN preference:
1. Uninstall the module
2. Reset network settings: Settings → General management → Reset → Reset network settings
3. Reboot

## Support Information
When reporting issues, please provide:
1. Device model and Android version
2. Magisk version
3. Carrier name and country
4. Output of verification script
5. Relevant logcat entries

## Safety Notes
- This module only modifies runtime properties
- No system files are permanently changed
- Can be safely uninstalled at any time
- Always backup important data before installing system modifications

## FAQ

**Q: Will this work on other Samsung devices?**
A: It's designed specifically for S21 FE but may work on devices with similar IWLAN issues. Use at your own risk.

**Q: Does this affect WiFi calling?**
A: WiFi calling remains available but won't be the default. You can still enable it when needed.

**Q: Will this survive OTA updates?**
A: The module should persist through OTA updates as long as Magisk remains installed.

**Q: Can I modify the network mode?**
A: Yes, edit `/data/adb/modules/samsung_s21fe_4g_fix/service.sh` and change the network mode value (default: 22).