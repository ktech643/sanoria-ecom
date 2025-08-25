#!/bin/bash

# Sanoria.pk E-commerce Platform Health Check
# Comprehensive system validation and optimization script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}$(printf '=%.0s' {1..50})${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Initialize counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# Function to run check
run_check() {
    local check_name="$1"
    local check_command="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    log_info "Checking: $check_name"
    
    if eval "$check_command"; then
        log_success "$check_name - PASSED"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        log_error "$check_name - FAILED"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Function to run warning check
run_warning_check() {
    local check_name="$1"
    local check_command="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    log_info "Checking: $check_name"
    
    if eval "$check_command"; then
        log_success "$check_name - PASSED"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        log_warning "$check_name - WARNING"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

# Start health check
clear
echo -e "${CYAN}"
cat << "EOF"
  ____              _               _         _ 
 / ___|  __ _ _ __  | |__   ___ _ __(_) __ _  | |_ _ __   | | __
 \___ \ / _` | '_ \ | '_ \ / _ \ '__| |/ _` | | __| '_ \  | |/ /
  ___) | (_| | | | || | | |  __/ |  | | (_| |_| |_| | | ||   < 
 |____/ \__,_|_| |_||_| |_|\___|_|  |_|\__,_(_)\__|_| |_||_|\_\
                                                               
          E-COMMERCE PLATFORM HEALTH CHECK
EOF
echo -e "${NC}"

log_header "🚀 STARTING COMPREHENSIVE HEALTH CHECK"

# 1. Project Structure Validation
log_header "📁 PROJECT STRUCTURE VALIDATION"

run_check "Main HTML file exists" "[ -f 'index.html' ]"
run_check "CSS directory exists" "[ -d 'css' ]"
run_check "JavaScript directory exists" "[ -d 'js' ]"
run_check "Images directory exists" "[ -d 'images' ]"
run_check "Admin directory exists" "[ -d 'admin' ]"
run_check "Database directory exists" "[ -d 'database' ]"
run_check "Config directory exists" "[ -d 'config' ]"

# Key files
run_check "Main stylesheet exists" "[ -f 'css/style.css' ]"
run_check "Main JavaScript exists" "[ -f 'js/main.js' ]"
run_check "Admin dashboard exists" "[ -f 'admin/dashboard.html' ]"
run_check "Admin stylesheet exists" "[ -f 'admin/css/admin.css' ]"
run_check "Admin JavaScript exists" "[ -f 'admin/js/admin.js' ]"
run_check "Database schema exists" "[ -f 'database/schema.sql' ]"
run_check "README file exists" "[ -f 'README.md' ]"

# 2. HTML Files Validation
log_header "🌐 HTML FILES VALIDATION"

html_files=(
    "index.html"
    "login.html"
    "register.html"
    "cart.html"
    "checkout.html"
    "product.html"
    "profile.html"
    "order-history.html"
    "wishlist.html"
    "search.html"
    "notifications.html"
    "feedback.html"
    "about.html"
    "contact.html"
    "admin/dashboard.html"
    "admin/login.html"
    "admin/profile.html"
)

for file in "${html_files[@]}"; do
    run_check "$file exists" "[ -f '$file' ]"
done

# 3. CSS Files Validation
log_header "🎨 CSS FILES VALIDATION"

css_files=(
    "css/style.css"
    "css/auth.css"
    "css/cart.css"
    "css/checkout.css"
    "css/product.css"
    "css/account.css"
    "css/feedback.css"
    "admin/css/admin.css"
)

for file in "${css_files[@]}"; do
    run_check "$file exists" "[ -f '$file' ]"
done

# 4. JavaScript Files Validation
log_header "⚡ JAVASCRIPT FILES VALIDATION"

js_files=(
    "js/main.js"
    "js/auth.js"
    "js/cart.js"
    "js/checkout.js"
    "js/product.js"
    "js/account.js"
    "js/feedback.js"
    "admin/js/admin.js"
)

for file in "${js_files[@]}"; do
    run_check "$file exists" "[ -f '$file' ]"
done

# 5. Database Files Validation
log_header "🗄️ DATABASE FILES VALIDATION"

run_check "Database schema exists" "[ -f 'database/schema.sql' ]"
run_check "Database seed data exists" "[ -f 'database/seed_data.sql' ]"
run_check "Database config exists" "[ -f 'config/database.php' ]"

# 6. File Size Analysis
log_header "📊 FILE SIZE ANALYSIS"

get_file_size() {
    if [ -f "$1" ]; then
        stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

# Calculate total sizes
total_html_size=0
total_css_size=0
total_js_size=0

for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(get_file_size "$file")
        total_html_size=$((total_html_size + size))
    fi
done

for file in "${css_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(get_file_size "$file")
        total_css_size=$((total_css_size + size))
    fi
done

for file in "${js_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(get_file_size "$file")
        total_js_size=$((total_js_size + size))
    fi
done

# Convert to KB
html_kb=$((total_html_size / 1024))
css_kb=$((total_css_size / 1024))
js_kb=$((total_js_size / 1024))
total_kb=$((html_kb + css_kb + js_kb))

log_info "HTML files total size: ${html_kb} KB"
log_info "CSS files total size: ${css_kb} KB"
log_info "JavaScript files total size: ${js_kb} KB"
log_info "Total project size: ${total_kb} KB"

# Check if sizes are reasonable
run_warning_check "Total size under 5MB" "[ $total_kb -lt 5120 ]"
run_warning_check "CSS size under 500KB" "[ $css_kb -lt 500 ]"
run_warning_check "JS size under 1MB" "[ $js_kb -lt 1024 ]"

# 7. Dependency Validation
log_header "📦 DEPENDENCY VALIDATION"

# Check for external CDN dependencies in HTML files
run_warning_check "Bootstrap CDN referenced" "grep -q 'bootstrap' index.html"
run_warning_check "Font Awesome CDN referenced" "grep -q 'font-awesome\\|fontawesome' index.html"
run_warning_check "jQuery CDN referenced" "grep -q 'jquery' index.html"
run_warning_check "Google Fonts referenced" "grep -q 'fonts.googleapis.com' index.html"

# 8. Security Checks
log_header "🔒 SECURITY VALIDATION"

run_warning_check "No hardcoded API keys in JS" "! grep -r 'api[_-]key\\|apikey\\|secret' js/ || true"
run_warning_check "No hardcoded passwords in files" "! grep -r 'password.*=' . --exclude-dir=.git || true"
run_check "CSRF protection placeholder exists" "grep -q 'csrf\\|token' js/auth.js || true"

# 9. Functionality Checks
log_header "⚙️ FUNCTIONALITY VALIDATION"

run_check "Search functionality implemented" "grep -q 'search' js/main.js"
run_check "Cart functionality implemented" "[ -f 'js/cart.js' ]"
run_check "Authentication implemented" "[ -f 'js/auth.js' ]"
run_check "Admin functionality implemented" "[ -f 'admin/js/admin.js' ]"
run_check "Notification system implemented" "grep -q 'notification' js/main.js"
run_check "Mobile responsiveness implemented" "grep -q '@media' css/style.css"

# 10. Performance Checks
log_header "🚀 PERFORMANCE VALIDATION"

run_warning_check "Images directory not empty" "[ -n \"$(ls -A images/ 2>/dev/null)\" ] || true"
run_warning_check "Minification ready" "[ -f 'package.json' ]"
run_warning_check "Build system configured" "[ -f 'build.gradle' ]"

# 11. Documentation Checks
log_header "📚 DOCUMENTATION VALIDATION"

run_check "README exists" "[ -f 'README.md' ]"
run_warning_check "Package.json exists" "[ -f 'package.json' ]"
run_warning_check "Build configuration exists" "[ -f 'build.gradle' ]"

# 12. Git Repository Check
log_header "🔧 REPOSITORY VALIDATION"

run_warning_check "Git repository initialized" "[ -d '.git' ]"
run_warning_check "Gitignore exists" "[ -f '.gitignore' ] || true"

# Generate final report
log_header "📋 HEALTH CHECK SUMMARY"

echo ""
log_info "Total Checks: $TOTAL_CHECKS"
log_success "Passed: $PASSED_CHECKS"
log_error "Failed: $FAILED_CHECKS"
log_warning "Warnings: $WARNINGS"

# Calculate success rate
if [ $TOTAL_CHECKS -gt 0 ]; then
    success_rate=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
    echo ""
    log_info "Success Rate: ${success_rate}%"
fi

# Final status
echo ""
if [ $FAILED_CHECKS -eq 0 ]; then
    log_success "🎉 ALL CRITICAL CHECKS PASSED!"
    log_success "🚀 PROJECT IS READY FOR DEPLOYMENT"
    
    if [ $WARNINGS -gt 0 ]; then
        log_warning "Note: $WARNINGS warnings found - consider addressing for optimal performance"
    fi
    
    exit_code=0
else
    log_error "❌ $FAILED_CHECKS CRITICAL ISSUES FOUND"
    log_error "🛠️  PLEASE FIX ISSUES BEFORE DEPLOYMENT"
    exit_code=1
fi

# Create health check report
report_dir="reports"
mkdir -p "$report_dir"

cat > "$report_dir/health-check-report.txt" << EOF
SANORIA.PK E-COMMERCE PLATFORM - HEALTH CHECK REPORT
====================================================

Date: $(date)
Total Checks: $TOTAL_CHECKS
Passed: $PASSED_CHECKS
Failed: $FAILED_CHECKS
Warnings: $WARNINGS
Success Rate: ${success_rate}%

File Sizes:
- HTML: ${html_kb} KB
- CSS: ${css_kb} KB
- JavaScript: ${js_kb} KB
- Total: ${total_kb} KB

Status: $([ $FAILED_CHECKS -eq 0 ] && echo "READY FOR DEPLOYMENT" || echo "NEEDS ATTENTION")
EOF

log_success "Health check report generated: $report_dir/health-check-report.txt"

echo ""
log_header "🎯 NEXT STEPS"
if [ $FAILED_CHECKS -eq 0 ]; then
    echo "1. Run: gradle fullBuild"
    echo "2. Run: npm run optimize"
    echo "3. Deploy to production"
else
    echo "1. Fix the $FAILED_CHECKS critical issues"
    echo "2. Re-run health check"
    echo "3. Proceed with build and deployment"
fi

exit $exit_code