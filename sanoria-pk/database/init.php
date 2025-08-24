<?php
// Database initialization script
require_once '../includes/config.php';

// Hash the admin password
$adminPassword = hashPassword('11223344');

// Update the admin user password
try {
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = 'abcd@gmail.com'");
    $stmt->execute([$adminPassword]);
    
    echo "Admin password has been set successfully!<br>";
    echo "Email: abcd@gmail.com<br>";
    echo "Password: 11223344<br>";
    
    // Insert some sample categories
    $categories = [
        ['name' => 'Skincare', 'slug' => 'skincare', 'description' => 'Premium skincare products for all skin types'],
        ['name' => 'Makeup', 'slug' => 'makeup', 'description' => 'Professional makeup products and cosmetics'],
        ['name' => 'Hair Care', 'slug' => 'haircare', 'description' => 'Hair care products for healthy, beautiful hair'],
        ['name' => 'Fragrance', 'slug' => 'fragrance', 'description' => 'Luxury perfumes and fragrances'],
        ['name' => 'Bath & Body', 'slug' => 'bath-body', 'description' => 'Bath and body care essentials']
    ];
    
    foreach($categories as $category) {
        $stmt = $pdo->prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
        $stmt->execute([$category['name'], $category['slug'], $category['description']]);
    }
    
    echo "<br>Sample categories have been created!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>