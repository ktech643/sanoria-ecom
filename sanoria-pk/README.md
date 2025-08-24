# Sanoria.pk - E-commerce Website

A stylish and elegant e-commerce website for beauty and skincare products with comprehensive features for both customers and administrators.

## Features

### Customer Features
- **Elegant Design**: Luxurious UI with beautiful typography using Playfair Display and Poppins fonts
- **Product Browsing**: Browse by categories or skin type
- **User Accounts**: Registration, login, order history, and wishlist
- **Shopping Cart**: Add to cart, update quantities, apply coupons
- **Multiple Payment Options**: Cash on Delivery, JazzCash, EasyPaisa, Bank Transfer
- **Shipping Partners**: Integration with TCS, Leopard, and PKDex
- **Chatbot Support**: AI-powered customer support chatbot
- **Promotions**: Discount banners, QR codes, and special offers
- **Reviews**: Customer reviews and ratings
- **Blog**: Beauty tips and product updates
- **14-Day Return Policy**: Easy returns for customer satisfaction

### Admin Features
- **Dashboard**: Overview of sales, orders, and inventory
- **Product Management**: Add, edit, delete products with multiple images
- **Order Management**: Process and track orders
- **Customer Management**: View and manage customer accounts
- **Coupon System**: Create and manage discount coupons
- **Promotion Management**: Create promotional campaigns
- **Blog Management**: Write and publish blog posts
- **Low Stock Alerts**: Automatic inventory alerts

## Setup Instructions

### Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- GD Library for PHP (for image processing)

### Installation

1. **Clone or download the project** to your web server's document root

2. **Create the database**:
   ```sql
   CREATE DATABASE sanoria_db;
   ```

3. **Import the database schema**:
   ```bash
   mysql -u root -p sanoria_db < database/schema.sql
   ```

4. **Configure database connection**:
   Edit `includes/config.php` and update the database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'sanoria_db');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   ```

5. **Initialize the database**:
   Run the initialization script in your browser:
   ```
   http://localhost/sanoria-pk/database/init.php
   ```

6. **Create placeholder images**:
   Run the image creation script:
   ```
   http://localhost/sanoria-pk/create-placeholder-images.php
   ```

7. **Create the logo**:
   Run the logo creation script:
   ```
   http://localhost/sanoria-pk/create-logo.php
   ```

### Admin Access

- **URL**: `http://localhost/sanoria-pk/admin/`
- **Email**: `abcd@gmail.com`
- **Password**: `11223344`

### Directory Structure

```
sanoria-pk/
├── admin/              # Admin dashboard files
├── api/                # API endpoints
├── assets/             # CSS, JS, images, fonts
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
├── database/           # Database schema and migrations
├── includes/           # Configuration and common functions
├── pages/              # Additional page templates
├── uploads/            # User uploaded files
│   ├── products/
│   ├── banners/
│   └── logos/
├── index.php           # Homepage
├── login.php           # Login/Registration page
└── README.md          # This file
```

### Payment Gateway Configuration

To enable payment gateways, update the following in `includes/config.php`:

**JazzCash**:
```php
define('JAZZCASH_MERCHANT_ID', 'YOUR_MERCHANT_ID');
define('JAZZCASH_PASSWORD', 'YOUR_PASSWORD');
define('JAZZCASH_INTEGRITY_SALT', 'YOUR_SALT');
```

**EasyPaisa**:
```php
define('EASYPAISA_STORE_ID', 'YOUR_STORE_ID');
define('EASYPAISA_ACCOUNT_NUM', 'YOUR_ACCOUNT');
```

### Courier Integration

Update courier API credentials in `includes/config.php`:

**Leopard**:
```php
define('LEOPARD_API_KEY', 'YOUR_API_KEY');
define('LEOPARD_API_PASSWORD', 'YOUR_PASSWORD');
```

**TCS**:
```php
define('TCS_API_KEY', 'YOUR_API_KEY');
define('TCS_USERNAME', 'YOUR_USERNAME');
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Bootstrap 5, jQuery
- **Backend**: PHP 7.4+
- **Database**: MySQL
- **Fonts**: Google Fonts (Playfair Display, Poppins)
- **Icons**: Font Awesome
- **Animations**: AOS (Animate On Scroll)

## Security Features

- Password hashing using bcrypt
- SQL injection prevention using prepared statements
- XSS protection through input sanitization
- CSRF protection (to be implemented)
- Secure session management

## SEO Optimization

- Meta tags for all pages
- Clean URLs (with .htaccess configuration)
- Sitemap generation
- Schema markup for products
- Fast loading times

## Support

For any issues or questions, please contact:
- Email: info@sanoria.pk
- Phone: +92 300 1234567

## License

This project is proprietary software for Sanoria.pk.