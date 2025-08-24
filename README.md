# Sanoria.pk - Premium E-commerce Website

A luxury e-commerce website for beauty and cosmetics products in Pakistan, built with modern web technologies and elegant design.

## 🌟 Features

### Frontend Features
- **Elegant Design**: Luxury and stylish design with premium fonts (Playfair Display & Poppins)
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Navigation**: Hamburger menu with smooth animations
- **Product Catalog**: Beautiful product cards with wishlist and quick view
- **Shopping Cart**: Dynamic cart with localStorage persistence
- **Wishlist**: Save favorite products for later
- **Search Functionality**: Real-time product search with filters
- **Chatbot**: Responsive customer service chatbot
- **QR Code Scanner**: Promotional QR code scanning feature
- **Notifications**: Toast notifications and notification center
- **SEO Optimized**: Meta tags, structured data, and semantic HTML

### E-commerce Features
- **Product Management**: Categories, SKU, inventory tracking
- **Shopping Cart**: Add/remove items, quantity updates
- **Wishlist**: Save products for later purchase
- **User Accounts**: Registration, login, order history
- **Order Management**: Complete order processing system
- **Payment Integration**: JazzCash, EasyPaisa, Bank Transfer, COD
- **Shipping Partners**: Leopard, TCS, PkDex integration
- **Discount System**: Coupons, promotional codes, QR discounts
- **Review System**: Product reviews and ratings
- **Return Policy**: 14-day easy return system

### Admin Dashboard
- **Modern Interface**: Clean and intuitive admin panel
- **Dashboard Analytics**: Sales overview, charts, and statistics
- **Product Management**: Add, edit, delete products with image upload
- **Order Management**: Process orders, update status, track shipments
- **Customer Management**: View customer details and order history
- **Inventory Control**: Stock management and low stock alerts
- **Promotional Tools**: Create and manage discount campaigns
- **Settings Panel**: Configure store settings and preferences

### Technical Features
- **Database**: MySQL with proper relationships and migrations
- **API**: RESTful API endpoints for all functionality
- **Security**: Admin authentication system
- **Performance**: Optimized images, lazy loading, caching
- **Code Quality**: Clean, documented, and maintainable code

## 🛠️ Technologies Used

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.3 for responsive design
- Font Awesome 6.4 for icons
- Chart.js for analytics visualization
- Google Fonts (Playfair Display, Poppins)

### Backend
- PHP 8.0+ with PDO
- MySQL database
- RESTful API architecture

### Tools & Libraries
- HTML5-QRCode for QR scanning
- Local Storage for cart persistence
- CSS Grid & Flexbox for layouts
- CSS Custom Properties (Variables)

## 📋 Prerequisites

- Web server (Apache/Nginx)
- PHP 8.0 or higher
- MySQL 5.7 or higher
- Modern web browser

## 🚀 Installation

1. **Clone or Download** the project files to your web server directory

2. **Database Setup**:
   ```sql
   CREATE DATABASE sanoria_pk;
   ```

3. **Configure Database**:
   - Open `config/database.php`
   - Update database credentials:
     ```php
     private $host = 'localhost';
     private $database = 'sanoria_pk';
     private $username = 'your_username';
     private $password = 'your_password';
     ```

4. **Run Database Migration**:
   - Visit your website URL
   - The database tables will be created automatically
   - Sample data will be inserted

5. **Admin Access**:
   - Email: `abcd@gmail.com`
   - Password: `11223344`
   - Visit `/admin/` to access the admin dashboard

## 📁 Project Structure

```
sanoria-pk/
├── index.html                 # Main homepage
├── css/
│   └── style.css             # Main styles
├── js/
│   └── script.js             # Main JavaScript
├── images/                   # Product and site images
├── admin/                    # Admin dashboard
│   ├── index.html
│   ├── css/admin.css
│   └── js/admin.js
├── api/                      # Backend API endpoints
│   ├── products.php
│   ├── cart.php
│   └── orders.php
├── config/
│   └── database.php          # Database configuration
├── includes/                 # PHP includes and utilities
└── README.md
```

## 🎨 Design Features

### Color Scheme
- Primary: Gold (#d4af37)
- Secondary: Dark Blue (#2c3e50)
- Accent: Red (#e74c3c)
- Background: Light Gray (#f8f9fa)

### Typography
- Headings: Playfair Display (Elegant serif)
- Body Text: Poppins (Modern sans-serif)
- Weight: 300-700 range for hierarchy

### Components
- Luxury product cards with hover effects
- Animated navigation with gold accents
- Elegant form styling
- Professional admin dashboard
- Responsive image galleries

## 🛒 E-commerce Functionality

### Product Categories
- **Skincare**: Face creams, serums, cleansers
- **Makeup**: Lipsticks, foundations, eye makeup
- **Fragrance**: Perfumes and body sprays
- **Hair Care**: Shampoos, oils, treatments

### Skin Type Filtering
- Oily Skin
- Dry Skin
- Combination Skin
- Sensitive Skin
- Normal Skin

### Payment Methods
- **JazzCash**: Mobile wallet payment
- **EasyPaisa**: Digital payment solution
- **Bank Transfer**: Direct bank payments
- **Cash on Delivery**: Pay upon delivery

### Shipping Partners
- **Leopard Courier**: Fast delivery service
- **TCS**: Nationwide courier network
- **PkDex**: Express delivery solutions

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📟 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1200px+)

## 🔧 Customization

### Adding Products
1. Access admin dashboard
2. Go to Products section
3. Click "Add Product"
4. Fill in product details
5. Upload images
6. Set pricing and inventory

### Modifying Design
- Edit `css/style.css` for frontend styling
- Edit `admin/css/admin.css` for admin styling
- Customize color variables in `:root` section

### Adding Features
- Create new API endpoints in `api/` folder
- Add JavaScript functionality in `js/script.js`
- Extend database schema in `config/database.php`

## 🔒 Security Features

- Password hashing for user accounts
- SQL injection prevention with prepared statements
- XSS protection with input validation
- Admin authentication system
- Session management for cart persistence

## 📊 Analytics & Tracking

The admin dashboard includes:
- Sales overview charts
- Product performance metrics
- Customer analytics
- Revenue tracking
- Inventory monitoring

## 🎯 SEO Optimization

- Semantic HTML structure
- Meta tags for all pages
- Open Graph tags for social sharing
- Schema.org markup for products
- Clean URL structure
- Fast loading times

## 🚀 Performance Optimization

- Optimized images with lazy loading
- Minified CSS and JavaScript
- Efficient database queries
- Browser caching headers
- Progressive enhancement

## 📞 Support & Contact

For support or questions about this project:
- Website: [sanoria.pk](https://sanoria.pk)
- Email: info@sanoria.pk
- Phone: +92 300 1234567

## 📄 License

This project is created for Sanoria.pk and includes all necessary components for a complete e-commerce solution.

## 🙏 Acknowledgments

- Google Fonts for typography
- Font Awesome for icons
- Bootstrap for responsive framework
- Chart.js for analytics visualization
- HTML5-QRCode for QR scanning functionality

---

**Built with ❤️ for Sanoria.pk - Premium Beauty & Cosmetics**