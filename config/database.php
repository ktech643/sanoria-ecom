<?php
// ==========================================================================
//   Sanoria.pk Database Configuration
// ==========================================================================

class Database {
    private $host = 'localhost';
    private $database = 'sanoria_pk';
    private $username = 'root';
    private $password = '';
    private $charset = 'utf8mb4';
    private $pdo;
    
    public function __construct() {
        $this->connect();
        $this->createTables();
        $this->createAdminUser();
    }
    
    private function connect() {
        $dsn = "mysql:host={$this->host};dbname={$this->database};charset={$this->charset}";
        
        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    private function createTables() {
        $queries = [
            // Users table
            "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                email_verified_at TIMESTAMP NULL,
                verification_code VARCHAR(6),
                role ENUM('customer', 'admin') DEFAULT 'customer',
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Categories table
            "CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                image VARCHAR(255),
                status ENUM('active', 'inactive') DEFAULT 'active',
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Products table
            "CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                short_description TEXT,
                category_id INT,
                sku VARCHAR(100) UNIQUE,
                price DECIMAL(10,2) NOT NULL,
                sale_price DECIMAL(10,2),
                stock_quantity INT DEFAULT 0,
                manage_stock BOOLEAN DEFAULT TRUE,
                in_stock BOOLEAN DEFAULT TRUE,
                weight DECIMAL(8,2),
                dimensions VARCHAR(100),
                image VARCHAR(255),
                gallery TEXT,
                featured BOOLEAN DEFAULT FALSE,
                status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
                meta_title VARCHAR(255),
                meta_description TEXT,
                meta_keywords TEXT,
                skin_type ENUM('oily', 'dry', 'combination', 'sensitive', 'normal', 'all') DEFAULT 'all',
                ingredients TEXT,
                usage_instructions TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )",
            
            // Orders table
            "CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(50) UNIQUE NOT NULL,
                user_id INT,
                status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
                total_amount DECIMAL(10,2) NOT NULL,
                shipping_amount DECIMAL(10,2) DEFAULT 0,
                tax_amount DECIMAL(10,2) DEFAULT 0,
                discount_amount DECIMAL(10,2) DEFAULT 0,
                payment_method ENUM('cod', 'jazzcash', 'easypaisa', 'bank_transfer') NOT NULL,
                payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
                shipping_address TEXT NOT NULL,
                billing_address TEXT,
                notes TEXT,
                courier_company ENUM('leopard', 'tcs', 'pkdex') DEFAULT 'tcs',
                tracking_number VARCHAR(100),
                shipped_at TIMESTAMP NULL,
                delivered_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )",
            
            // Order items table
            "CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                product_sku VARCHAR(100),
                quantity INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )",
            
            // Cart table
            "CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                session_id VARCHAR(255),
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )",
            
            // Wishlist table
            "CREATE TABLE IF NOT EXISTS wishlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE KEY unique_wishlist (user_id, product_id)
            )",
            
            // Reviews table
            "CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                user_id INT NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                title VARCHAR(255),
                comment TEXT,
                verified_purchase BOOLEAN DEFAULT FALSE,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )",
            
            // Coupons table
            "CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                type ENUM('percentage', 'fixed') NOT NULL,
                value DECIMAL(10,2) NOT NULL,
                minimum_amount DECIMAL(10,2) DEFAULT 0,
                maximum_discount DECIMAL(10,2),
                usage_limit INT,
                used_count INT DEFAULT 0,
                user_limit INT DEFAULT 1,
                start_date TIMESTAMP NULL,
                end_date TIMESTAMP NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Coupon usage table
            "CREATE TABLE IF NOT EXISTS coupon_usage (
                id INT AUTO_INCREMENT PRIMARY KEY,
                coupon_id INT NOT NULL,
                user_id INT NOT NULL,
                order_id INT NOT NULL,
                discount_amount DECIMAL(10,2) NOT NULL,
                used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )",
            
            // Blog posts table
            "CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                excerpt TEXT,
                content LONGTEXT NOT NULL,
                featured_image VARCHAR(255),
                author_id INT,
                status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
                featured BOOLEAN DEFAULT FALSE,
                meta_title VARCHAR(255),
                meta_description TEXT,
                meta_keywords TEXT,
                published_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
            )",
            
            // Blog categories table
            "CREATE TABLE IF NOT EXISTS blog_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Notifications table
            "CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                type ENUM('order', 'promotion', 'general', 'system') NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                data JSON,
                read_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )",
            
            // Settings table
            "CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value LONGTEXT,
                setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Contact messages table
            "CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                subject VARCHAR(255),
                message TEXT NOT NULL,
                status ENUM('new', 'read', 'replied') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            // Analytics table
            "CREATE TABLE IF NOT EXISTS analytics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_type ENUM('page_view', 'product_view', 'add_to_cart', 'purchase', 'search') NOT NULL,
                event_data JSON,
                user_id INT,
                session_id VARCHAR(255),
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )"
        ];
        
        foreach ($queries as $query) {
            try {
                $this->pdo->exec($query);
            } catch (PDOException $e) {
                echo "Error creating table: " . $e->getMessage() . "\n";
            }
        }
        
        $this->insertSampleData();
    }
    
    private function createAdminUser() {
        $email = 'abcd@gmail.com';
        $password = '11223344';
        
        // Check if admin user already exists
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ? AND role = 'admin'");
        $stmt->execute([$email]);
        
        if (!$stmt->fetch()) {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $this->pdo->prepare("
                INSERT INTO users (name, email, password, role, status, email_verified_at) 
                VALUES (?, ?, ?, 'admin', 'active', NOW())
            ");
            $stmt->execute(['Admin User', $email, $hashedPassword]);
        }
    }
    
    private function insertSampleData() {
        // Insert sample categories
        $categories = [
            ['Skincare', 'skincare', 'Premium skincare products for all skin types'],
            ['Makeup', 'makeup', 'High-quality makeup products and cosmetics'],
            ['Fragrance', 'fragrance', 'Luxurious fragrances and perfumes'],
            ['Hair Care', 'hair-care', 'Professional hair care products']
        ];
        
        foreach ($categories as $category) {
            $stmt = $this->pdo->prepare("
                INSERT IGNORE INTO categories (name, slug, description) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute($category);
        }
        
        // Insert sample products
        $products = [
            [
                'name' => 'Luxury Face Cream',
                'slug' => 'luxury-face-cream',
                'description' => 'Premium anti-aging face cream with natural ingredients. Reduces fine lines and provides deep hydration.',
                'short_description' => 'Premium anti-aging face cream with natural ingredients.',
                'category_id' => 1,
                'sku' => 'LFC001',
                'price' => 2500.00,
                'sale_price' => 2000.00,
                'stock_quantity' => 50,
                'image' => 'images/product1.jpg',
                'featured' => 1,
                'skin_type' => 'all',
                'ingredients' => 'Hyaluronic acid, Vitamin C, Retinol, Natural oils',
                'usage_instructions' => 'Apply gently on clean face twice daily'
            ],
            [
                'name' => 'Premium Lipstick Set',
                'slug' => 'premium-lipstick-set',
                'description' => 'Set of 5 premium lipsticks in trending colors. Long-lasting formula with moisturizing properties.',
                'short_description' => 'Set of 5 premium lipsticks in trending colors.',
                'category_id' => 2,
                'sku' => 'PLS002',
                'price' => 1800.00,
                'stock_quantity' => 30,
                'image' => 'images/product2.jpg',
                'featured' => 1,
                'skin_type' => 'all',
                'ingredients' => 'Natural wax, Vitamin E, Shea butter',
                'usage_instructions' => 'Apply directly to lips for best results'
            ],
            [
                'name' => 'Anti-Aging Serum',
                'slug' => 'anti-aging-serum',
                'description' => 'Advanced anti-aging serum with peptides and antioxidants. Reduces wrinkles and improves skin texture.',
                'short_description' => 'Advanced anti-aging serum with peptides and antioxidants.',
                'category_id' => 1,
                'sku' => 'AAS003',
                'price' => 3200.00,
                'sale_price' => 2800.00,
                'stock_quantity' => 25,
                'image' => 'images/product3.jpg',
                'featured' => 1,
                'skin_type' => 'all',
                'ingredients' => 'Peptides, Vitamin C, Niacinamide, Hyaluronic acid',
                'usage_instructions' => 'Apply 2-3 drops on clean face before moisturizer'
            ]
        ];
        
        foreach ($products as $product) {
            $stmt = $this->pdo->prepare("
                INSERT IGNORE INTO products (
                    name, slug, description, short_description, category_id, sku, 
                    price, sale_price, stock_quantity, image, featured, skin_type, 
                    ingredients, usage_instructions
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $product['name'], $product['slug'], $product['description'], 
                $product['short_description'], $product['category_id'], $product['sku'],
                $product['price'], $product['sale_price'] ?? null, $product['stock_quantity'],
                $product['image'], $product['featured'], $product['skin_type'],
                $product['ingredients'], $product['usage_instructions']
            ]);
        }
        
        // Insert sample settings
        $settings = [
            ['site_name', 'Sanoria.pk', 'string', 'Website name'],
            ['site_description', 'Premium Beauty & Cosmetics Store', 'string', 'Website description'],
            ['contact_email', 'info@sanoria.pk', 'string', 'Contact email address'],
            ['contact_phone', '+92 300 1234567', 'string', 'Contact phone number'],
            ['shipping_fee', '200', 'number', 'Standard shipping fee'],
            ['free_shipping_threshold', '2000', 'number', 'Minimum order for free shipping'],
            ['currency', 'PKR', 'string', 'Store currency'],
            ['tax_rate', '0', 'number', 'Tax rate percentage'],
            ['enable_reviews', '1', 'boolean', 'Enable product reviews'],
            ['enable_wishlist', '1', 'boolean', 'Enable wishlist functionality']
        ];
        
        foreach ($settings as $setting) {
            $stmt = $this->pdo->prepare("
                INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, description) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute($setting);
        }
    }
    
    public function query($sql, $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
    
    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }
    
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    public function lastInsertId() {
        return $this->pdo->lastInsertId();
    }
    
    public function beginTransaction() {
        return $this->pdo->beginTransaction();
    }
    
    public function commit() {
        return $this->pdo->commit();
    }
    
    public function rollback() {
        return $this->pdo->rollback();
    }
}

// Initialize database connection
try {
    $database = new Database();
    $pdo = $database->getConnection();
} catch (Exception $e) {
    die("Database initialization failed: " . $e->getMessage());
}
?>