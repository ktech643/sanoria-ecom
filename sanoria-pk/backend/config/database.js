// ===== SANORIA.PK - Database Configuration =====

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sanoria_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database
async function initialize() {
    try {
        // Create database if not exists
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await connection.end();
        
        // Run migrations
        await runMigrations();
        
        // Create admin user if not exists
        await createAdminUser();
        
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Run database migrations
async function runMigrations() {
    const migrations = [
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            role ENUM('customer', 'admin') DEFAULT 'customer',
            is_verified BOOLEAN DEFAULT FALSE,
            verification_code VARCHAR(6),
            reset_token VARCHAR(255),
            reset_token_expires DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_role (role)
        )`,
        
        // User addresses table
        `CREATE TABLE IF NOT EXISTS user_addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            address_line1 VARCHAR(255) NOT NULL,
            address_line2 VARCHAR(255),
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            postal_code VARCHAR(20),
            country VARCHAR(100) DEFAULT 'Pakistan',
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id)
        )`,
        
        // Categories table
        `CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            parent_id INT,
            image_url VARCHAR(500),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
            INDEX idx_slug (slug)
        )`,
        
        // Products table
        `CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sku VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            short_description VARCHAR(500),
            category_id INT,
            price DECIMAL(10, 2) NOT NULL,
            compare_price DECIMAL(10, 2),
            cost DECIMAL(10, 2),
            quantity INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            skin_types JSON,
            tags JSON,
            images JSON,
            weight DECIMAL(10, 2),
            dimensions JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
            INDEX idx_sku (sku),
            INDEX idx_slug (slug),
            INDEX idx_category (category_id),
            FULLTEXT idx_search (name, description)
        )`,
        
        // Product reviews table
        `CREATE TABLE IF NOT EXISTS product_reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            user_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            title VARCHAR(255),
            comment TEXT,
            is_verified_purchase BOOLEAN DEFAULT FALSE,
            helpful_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_product (product_id),
            INDEX idx_user (user_id)
        )`,
        
        // Cart table
        `CREATE TABLE IF NOT EXISTS cart_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_product (user_id, product_id)
        )`,
        
        // Wishlist table
        `CREATE TABLE IF NOT EXISTS wishlist_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_product (user_id, product_id)
        )`,
        
        // Orders table
        `CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_number VARCHAR(50) UNIQUE NOT NULL,
            user_id INT NOT NULL,
            status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
            subtotal DECIMAL(10, 2) NOT NULL,
            discount_amount DECIMAL(10, 2) DEFAULT 0,
            shipping_amount DECIMAL(10, 2) DEFAULT 0,
            tax_amount DECIMAL(10, 2) DEFAULT 0,
            total_amount DECIMAL(10, 2) NOT NULL,
            payment_method VARCHAR(50),
            payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
            shipping_address JSON,
            billing_address JSON,
            shipping_method VARCHAR(50),
            tracking_number VARCHAR(100),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            INDEX idx_order_number (order_number),
            INDEX idx_user (user_id),
            INDEX idx_status (status),
            INDEX idx_created (created_at)
        )`,
        
        // Order items table
        `CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            total DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id),
            INDEX idx_order (order_id)
        )`,
        
        // Coupons table
        `CREATE TABLE IF NOT EXISTS coupons (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(50) UNIQUE NOT NULL,
            description VARCHAR(255),
            discount_type ENUM('percentage', 'fixed') NOT NULL,
            discount_value DECIMAL(10, 2) NOT NULL,
            minimum_amount DECIMAL(10, 2),
            usage_limit INT,
            used_count INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            valid_from DATETIME,
            valid_until DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_code (code)
        )`,
        
        // Notifications table
        `CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT,
            type VARCHAR(50),
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user (user_id),
            INDEX idx_read (is_read)
        )`,
        
        // Blog posts table
        `CREATE TABLE IF NOT EXISTS blog_posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            content TEXT,
            excerpt VARCHAR(500),
            author_id INT,
            featured_image VARCHAR(500),
            is_published BOOLEAN DEFAULT FALSE,
            published_at DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id),
            INDEX idx_slug (slug),
            INDEX idx_published (is_published),
            FULLTEXT idx_search (title, content)
        )`
    ];
    
    for (const migration of migrations) {
        try {
            await pool.execute(migration);
        } catch (error) {
            console.error('Migration error:', error.message);
        }
    }
}

// Create default admin user
async function createAdminUser() {
    try {
        // Check if admin exists
        const [rows] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            ['abcd@gmail.com']
        );
        
        if (rows.length === 0) {
            // Hash password
            const hashedPassword = await bcrypt.hash('11223344', 10);
            
            // Create admin user
            await pool.execute(
                'INSERT INTO users (email, password, full_name, role, is_verified) VALUES (?, ?, ?, ?, ?)',
                ['abcd@gmail.com', hashedPassword, 'Admin User', 'admin', true]
            );
            
            console.log('✅ Admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

module.exports = {
    pool,
    initialize
};