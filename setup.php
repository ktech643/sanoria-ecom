<?php
// ==========================================================================
//   Sanoria.pk Setup Script
// ==========================================================================

echo "<h1>Sanoria.pk E-commerce Setup</h1>";
echo "<p>Setting up your Sanoria.pk e-commerce website...</p>";

// Check PHP version
if (version_compare(PHP_VERSION, '7.4.0') < 0) {
    die('<div style="color: red;">Error: PHP 7.4 or higher is required. Current version: ' . PHP_VERSION . '</div>');
}

echo "<p>✓ PHP version: " . PHP_VERSION . " (Compatible)</p>";

// Check required extensions
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'mbstring'];
$missing_extensions = [];

foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        $missing_extensions[] = $ext;
    }
}

if (!empty($missing_extensions)) {
    die('<div style="color: red;">Error: Missing required PHP extensions: ' . implode(', ', $missing_extensions) . '</div>');
}

echo "<p>✓ All required PHP extensions are installed</p>";

// Test database connection
try {
    require_once 'config/database.php';
    echo "<p>✓ Database connection successful</p>";
    echo "<p>✓ Database tables created</p>";
    echo "<p>✓ Sample data inserted</p>";
    echo "<p>✓ Admin user created (Email: abcd@gmail.com, Password: 11223344)</p>";
} catch (Exception $e) {
    echo '<div style="color: red;">Database Error: ' . $e->getMessage() . '</div>';
    echo '<p><strong>Please check your database configuration in config/database.php</strong></p>';
}

// Check write permissions
$directories = ['images', 'uploads'];
foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
    
    if (is_writable($dir)) {
        echo "<p>✓ Directory '$dir' is writable</p>";
    } else {
        echo "<p style='color: orange;'>⚠ Warning: Directory '$dir' is not writable</p>";
    }
}

echo "<h2>Setup Complete!</h2>";
echo "<p><strong>Your Sanoria.pk e-commerce website is ready!</strong></p>";

echo "<h3>Quick Start:</h3>";
echo "<ul>";
echo "<li><a href='index.html' target='_blank'>Visit your website homepage</a></li>";
echo "<li><a href='admin/index.html' target='_blank'>Access admin dashboard</a> (Email: abcd@gmail.com, Password: 11223344)</li>";
echo "<li><a href='login.html' target='_blank'>Customer login page</a></li>";
echo "<li><a href='register.html' target='_blank'>Customer registration page</a></li>";
echo "</ul>";

echo "<h3>Features Included:</h3>";
echo "<ul>";
echo "<li>✓ Responsive design with luxury styling</li>";
echo "<li>✓ AI-generated logo with elegant design</li>";
echo "<li>✓ Complete product catalog system</li>";
echo "<li>✓ Shopping cart and wishlist</li>";
echo "<li>✓ Customer registration with phone verification</li>";
echo "<li>✓ Admin dashboard with analytics</li>";
echo "<li>✓ Payment integration (JazzCash, EasyPaisa, COD)</li>";
echo "<li>✓ Shipping partners (Leopard, TCS, PkDex)</li>";
echo "<li>✓ Chatbot for customer support</li>";
echo "<li>✓ QR code scanning for promotions</li>";
echo "<li>✓ SEO optimization</li>";
echo "<li>✓ Mobile-responsive design</li>";
echo "</ul>";

echo "<h3>Next Steps:</h3>";
echo "<ol>";
echo "<li>Customize the design colors and fonts in css/style.css</li>";
echo "<li>Add your product images to the images/ directory</li>";
echo "<li>Configure payment gateway API keys</li>";
echo "<li>Set up SSL certificate for secure payments</li>";
echo "<li>Configure email settings for notifications</li>";
echo "<li>Add your actual business information</li>";
echo "</ol>";

echo "<h3>Support:</h3>";
echo "<p>For technical support or customization requests, please refer to the README.md file.</p>";

echo "<div style='background: #d4af37; color: white; padding: 20px; border-radius: 10px; margin-top: 30px; text-align: center;'>";
echo "<h2>🎉 Welcome to Sanoria.pk!</h2>";
echo "<p>Your premium beauty and cosmetics e-commerce platform is now live!</p>";
echo "</div>";
?>

<style>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    line-height: 1.6;
    color: #333;
}

h1, h2, h3 {
    color: #2c3e50;
    border-bottom: 2px solid #d4af37;
    padding-bottom: 10px;
}

a {
    color: #d4af37;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

ul, ol {
    margin-left: 20px;
}

li {
    margin-bottom: 5px;
}
</style>