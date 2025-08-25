#!/bin/sh

# Gradle Wrapper Script for Sanoria.pk E-commerce Platform
# This script ensures consistent Gradle version across environments

set -e

# Configuration
GRADLE_VERSION="8.5"
GRADLE_HOME="$HOME/.gradle/wrapper/gradle-$GRADLE_VERSION"
GRADLE_ZIP="$GRADLE_HOME/gradle-$GRADLE_VERSION-bin.zip"
GRADLE_URL="https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if Gradle is already installed
if [ -d "$GRADLE_HOME" ] && [ -f "$GRADLE_HOME/bin/gradle" ]; then
    log_success "Gradle $GRADLE_VERSION found"
else
    log_info "Installing Gradle $GRADLE_VERSION..."
    
    # Create directories
    mkdir -p "$GRADLE_HOME"
    
    # Download Gradle if not exists
    if [ ! -f "$GRADLE_ZIP" ]; then
        log_info "Downloading Gradle $GRADLE_VERSION..."
        if command -v curl >/dev/null 2>&1; then
            curl -L "$GRADLE_URL" -o "$GRADLE_ZIP"
        elif command -v wget >/dev/null 2>&1; then
            wget "$GRADLE_URL" -O "$GRADLE_ZIP"
        else
            echo "❌ Neither curl nor wget found. Please install one of them."
            exit 1
        fi
    fi
    
    # Extract Gradle
    log_info "Extracting Gradle..."
    cd "$GRADLE_HOME"
    unzip -q "$GRADLE_ZIP"
    mv gradle-$GRADLE_VERSION/* .
    rmdir gradle-$GRADLE_VERSION
    
    log_success "Gradle $GRADLE_VERSION installed"
fi

# Run Gradle with all arguments
exec "$GRADLE_HOME/bin/gradle" "$@"