<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'sanoria_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Site configuration
define('SITE_URL', 'http://localhost/sanoria-pk');
define('SITE_NAME', 'Sanoria.pk');
define('SITE_EMAIL', 'info@sanoria.pk');

// Directory paths
define('ROOT_PATH', dirname(__DIR__));
define('ASSETS_PATH', ROOT_PATH . '/assets');
define('UPLOADS_PATH', ROOT_PATH . '/uploads');

// Payment gateway configurations
define('JAZZCASH_MERCHANT_ID', 'YOUR_MERCHANT_ID');
define('JAZZCASH_PASSWORD', 'YOUR_PASSWORD');
define('JAZZCASH_INTEGRITY_SALT', 'YOUR_SALT');

define('EASYPAISA_STORE_ID', 'YOUR_STORE_ID');
define('EASYPAISA_ACCOUNT_NUM', 'YOUR_ACCOUNT');

// Courier API configurations
define('LEOPARD_API_KEY', 'YOUR_API_KEY');
define('LEOPARD_API_PASSWORD', 'YOUR_PASSWORD');

define('TCS_API_KEY', 'YOUR_API_KEY');
define('TCS_USERNAME', 'YOUR_USERNAME');

// Session configuration
session_start();

// Timezone
date_default_timezone_set('Asia/Karachi');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Helper function to sanitize input
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Generate order number
function generateOrderNumber() {
    return 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
}

// Hash password
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Verify password
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Generate verification code
function generateVerificationCode() {
    return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
}

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Check if user is admin
function isAdmin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == true;
}

// Redirect function
function redirect($url) {
    header("Location: " . $url);
    exit();
}

// Upload image function
function uploadImage($file, $directory) {
    $targetDir = UPLOADS_PATH . '/' . $directory . '/';
    $fileName = time() . '_' . basename($file["name"]);
    $targetFile = $targetDir . $fileName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    
    // Check if image file is actual image
    $check = getimagesize($file["tmp_name"]);
    if($check === false) {
        return false;
    }
    
    // Check file size (max 5MB)
    if ($file["size"] > 5000000) {
        return false;
    }
    
    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        return false;
    }
    
    // Upload file
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return $directory . '/' . $fileName;
    }
    
    return false;
}

// Get cart count
function getCartCount() {
    global $pdo;
    if (!isLoggedIn()) return 0;
    
    $stmt = $pdo->prepare("SELECT SUM(quantity) as count FROM cart WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $result = $stmt->fetch();
    
    return $result['count'] ?: 0;
}

// Get wishlist count
function getWishlistCount() {
    global $pdo;
    if (!isLoggedIn()) return 0;
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $result = $stmt->fetch();
    
    return $result['count'];
}

// Get notification count
function getNotificationCount() {
    global $pdo;
    if (!isLoggedIn()) return 0;
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0");
    $stmt->execute([$_SESSION['user_id']]);
    $result = $stmt->fetch();
    
    return $result['count'];
}

// Format price
function formatPrice($price) {
    return 'Rs. ' . number_format($price, 0);
}

// Calculate discount percentage
function calculateDiscountPercentage($originalPrice, $salePrice) {
    if ($originalPrice <= 0) return 0;
    return round((($originalPrice - $salePrice) / $originalPrice) * 100);
}
?>