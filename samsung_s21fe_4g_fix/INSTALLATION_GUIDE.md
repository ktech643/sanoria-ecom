# Samsung S21 FE 4G Fix - Installation Guide

## Quick Installation Steps

### 1. Prerequisites Check
- ✅ Samsung S21 FE device (any variant: SM-G990B/DS/E/U)
- ✅ Device is rooted with Magisk v20.4+
- ✅ USB debugging enabled (for verification)

### 2. Install the Module
**Option A: Magisk Manager (Easiest)**
1. Download `Samsung_S21FE_4G_Fix_v1.0.zip`
2. Open Magisk Manager app
3. Modules tab → Install from storage
4. Select the ZIP file → Install
5. Reboot when prompted

**Option B: ADB Installation**
```bash
adb push Samsung_S21FE_4G_Fix_v1.0.zip /sdcard/
# Then use Magisk Manager to install from /sdcard/
```

### 3. Verification (After Reboot)
Wait 2-3 minutes after reboot, then check:

```bash
# Check if module is active
adb shell "ls /data/adb/modules/samsung_s21fe_4g_fix/"

# Verify 4G registration
adb shell "dumpsys telephony.registry | grep -E 'mDataRegState|mDataNetworkType'"
# Expected: mDataRegState=IN_SERVICE, mDataNetworkType=LTE

# Check logs
adb shell "cat /data/local/tmp/s21fe_4g_fix.log"
```

### 4. Success Indicators
- ✅ Cellular data bars show 4G/LTE
- ✅ Internet works on mobile data
- ✅ No more "Emergency calls only"
- ✅ WiFi calling still available as backup

## Troubleshooting

### Module Installed but 4G Still Not Working

**Step 1: Check Module Status**
```bash
adb shell "magisk --list | grep samsung_s21fe_4g_fix"
```

**Step 2: Verify Properties**
```bash
adb shell "getprop persist.vendor.radio.enable_iwlan"
# Should return: false
```

**Step 3: Manual Network Mode**
If still not working, try setting network mode manually:
- Dial `*#*#4636#*#*` in Phone app
- Phone Information → Set Preferred Network Type → LTE/WCDMA/GSM

**Step 4: Carrier Reset**
```bash
adb shell "pm clear com.android.carrierconfig"
adb reboot
```

### Module Installation Failed

**Check Magisk Version**:
```bash
adb shell "magisk -v"
# Should be 20.4 or higher
```

**Check Available Space**:
```bash
adb shell "df /data"
# Ensure sufficient space in /data partition
```

**Manual Installation**:
If Magisk Manager fails, try manual installation:
```bash
adb shell "mkdir -p /data/adb/modules/samsung_s21fe_4g_fix"
adb push samsung_s21fe_4g_fix/* /data/adb/modules/samsung_s21fe_4g_fix/
adb shell "chmod 755 /data/adb/modules/samsung_s21fe_4g_fix/*.sh"
adb reboot
```

## Emergency Recovery

### Safe Mode Boot
If device becomes unstable:
1. Hold Power + Volume Down during boot
2. Device will boot without Magisk modules
3. Open Magisk Manager → Disable problematic module

### Remove Module Completely
```bash
adb shell "rm -rf /data/adb/modules/samsung_s21fe_4g_fix"
adb reboot
```

### Factory Reset (Last Resort)
If all else fails:
1. Backup important data
2. Settings → General management → Reset → Factory data reset
3. Re-root with Magisk after reset

## Advanced Configuration

### Custom Network Mode
Edit `/data/adb/modules/samsung_s21fe_4g_fix/service.sh`:
```bash
# Change line with preferred_network_mode
# From: settings put global preferred_network_mode 22
# To:   settings put global preferred_network_mode [YOUR_MODE]
```

### Enable Additional Logging
Add to service.sh:
```bash
# Enable verbose telephony logging
setprop log.tag.RILJ VERBOSE
setprop log.tag.RIL VERBOSE
```

## FAQ

**Q: Will this affect WiFi calling?**
A: No, WiFi calling remains available as a backup option. The module just prevents it from being the primary connection method.

**Q: Does this work on other Samsung devices?**
A: This module is optimized for S21 FE, but may work on other Samsung Galaxy devices with similar IWLAN issues.

**Q: Can I use this with other Magisk modules?**
A: Yes, this module is designed to be compatible with other Magisk modules.

**Q: How do I know if the fix worked?**
A: Check that your phone shows 4G/LTE bars and mobile data works. The status should show `mDataRegState: IN_SERVICE`.

**Q: What if my carrier doesn't support LTE?**
A: The module falls back to GSM/WCDMA. You can also manually change the network mode in phone settings.

## Contact
For issues specific to this module, check the logs first, then review the troubleshooting steps above.