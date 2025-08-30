#!/bin/bash

# Build script for Samsung S21 FE 4G Fix Magisk Module

echo "Building Samsung S21 FE 4G Fix Magisk Module..."

# Module name
MODULE_NAME="samsung_s21fe_4g_fix"
VERSION="v1.0"

# Clean any previous builds
rm -f "../${MODULE_NAME}_${VERSION}.zip"

# Make scripts executable
chmod +x post-fs-data.sh
chmod +x service.sh
chmod +x customize.sh
chmod +x META-INF/com/google/android/update-binary

# Create the zip file
echo "Creating module ZIP..."
zip -r9 "../${MODULE_NAME}_${VERSION}.zip" . -x "*.git*" "build_module.sh" "*.zip"

echo ""
echo "✓ Module built successfully!"
echo "  File: ${MODULE_NAME}_${VERSION}.zip"
echo ""
echo "Installation instructions:"
echo "1. Copy the ZIP file to your phone"
echo "2. Open Magisk Manager"
echo "3. Go to Modules → Install from storage"
echo "4. Select ${MODULE_NAME}_${VERSION}.zip"
echo "5. Reboot your device"
echo ""