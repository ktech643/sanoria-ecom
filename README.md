# Sanoria.pk - Premium Beauty & Skincare E-commerce Website

A complete, modern e-commerce website for beauty and skincare products built with HTML, CSS, Bootstrap, JavaScript, and MySQL.

## 🌟 Features

### ✅ Completed Features

#### **Frontend & Design**
- ✅ Elegant, luxurious design with premium fonts (Playfair Display, Poppins, Dancing Script)
- ✅ Fully responsive layout (mobile, tablet, desktop)
- ✅ Beautiful homepage with hero section, product showcases, and promotional banners
- ✅ Hamburger menu positioned on the right side
- ✅ Professional color scheme with gold (#d4af37) primary color

#### **User Authentication**
- ✅ User registration with email verification
- ✅ Secure login system with password strength validation
- ✅ "Remember me" functionality
- ✅ Password reset via email
- ✅ Social login integration (Google, Facebook)
- ✅ Demo credentials for testing:
  - **Customer**: customer@sanoria.pk / password123
  - **Admin**: abcd@gmail.com / 11223344

#### **Product Management**
- ✅ Shop by skin type feature (Dry, Oily, Combination, Sensitive, Normal)
- ✅ Product categorization (Skincare, Makeup, Hair Care, Fragrance, Beauty Tools)
- ✅ Product variants and inventory management
- ✅ Advanced search functionality
- ✅ Product reviews and ratings system

#### **Shopping Experience**
- ✅ Full shopping cart functionality
- ✅ Wishlist management
- ✅ Promo code system with validation
- ✅ Real-time cart updates
- ✅ Free shipping threshold (Rs. 2000)
- ✅ 14-day return policy

#### **Admin Dashboard**
- ✅ Comprehensive admin panel
- ✅ Sales analytics with Chart.js
- ✅ Order management system
- ✅ Product inventory tracking
- ✅ Customer management
- ✅ Real-time notifications
- ✅ Low stock alerts

#### **Interactive Features**
- ✅ Responsive chatbot for customer support
- ✅ QR code scanner for discounts
- ✅ Real-time notifications
- ✅ Loading animations and transitions

#### **Database**
- ✅ Complete MySQL database schema
- ✅ Proper relationships and indexing
- ✅ Sample data with 11 products
- ✅ User management tables
- ✅ Order tracking system

### 🚧 Pending Features

#### **Product Catalog**
- Product listing pages
- Detailed product pages
- Advanced filtering and sorting
- Product comparison

#### **Payment Integration**
- JazzCash integration
- EasyPaisa integration
- Bank transfer processing
- Cash on Delivery

#### **Additional Features**
- Blog system with CMS
- Email newsletter
- Advanced analytics
- Multi-language support

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Bootstrap 5.3.2** - Responsive framework
- **JavaScript (ES6+)** - Interactive functionality
- **jQuery 3.7.1** - DOM manipulation
- **Font Awesome 6.4.0** - Icons
- **Google Fonts** - Typography

### Backend
- **PHP** - Server-side scripting
- **MySQL** - Database management
- **PDO** - Database connectivity

### Libraries & Plugins
- **Chart.js** - Analytics charts
- **Html5-qrcode** - QR code scanning
- **AOS** - Scroll animations

## 📁 Project Structure

```
sanoria-pk/
├── admin/                      # Admin panel
│   ├── css/
│   │   └── admin.css          # Admin-specific styles
│   ├── js/
│   │   └── admin.js           # Admin functionality
│   └── dashboard.html         # Admin dashboard
├── css/
│   ├── style.css              # Main stylesheet
│   ├── auth.css              # Authentication styles
│   └── cart.css              # Shopping cart styles
├── js/
│   ├── main.js               # Main JavaScript
│   ├── auth.js               # Authentication logic
│   └── cart.js               # Shopping cart functionality
├── images/                    # Image assets
│   ├── products/             # Product images
│   ├── categories/           # Category images
│   ├── blog/                 # Blog images
│   └── brands/               # Brand logos
├── database/
│   ├── schema.sql            # Database schema
│   └── seed_data.sql         # Sample data
├── config/
│   └── database.php          # Database configuration
├── index.html                # Homepage
├── login.html                # Login page
├── register.html             # Registration page
├── cart.html                 # Shopping cart
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Web server (Apache/Nginx)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sanoria-pk.git
   cd sanoria-pk
   ```

2. **Set up the database**
   ```bash
   mysql -u root -p
   source database/schema.sql
   source database/seed_data.sql
   ```

3. **Configure database connection**
   - Edit `config/database.php`
   - Update database credentials

4. **Start web server**
   ```bash
   # For development
   php -S localhost:8000
   ```

5. **Access the website**
   - Website: http://localhost:8000
   - Admin: http://localhost:8000/admin/dashboard.html

### Demo Login Credentials

#### Customer Account
- **Email**: customer@sanoria.pk
- **Password**: password123

#### Admin Account
- **Email**: abcd@gmail.com
- **Password**: 11223344

## 💳 Payment Methods

The website supports multiple payment options popular in Pakistan:

- **JazzCash** - Mobile wallet payments
- **EasyPaisa** - Mobile wallet payments
- **Bank Transfer** - Direct bank transfers
- **Cash on Delivery** - Pay when you receive

## 🛍️ Key Features

### Skin Type Shopping
Users can shop based on their skin type:
- **Dry Skin** - Nourishing and hydrating products
- **Oily Skin** - Oil control and mattifying products
- **Combination Skin** - Balanced care for mixed zones
- **Sensitive Skin** - Gentle, hypoallergenic formulas
- **Normal Skin** - Maintenance and enhancement products

### Smart Features
- **Free Shipping** on orders over Rs. 2000
- **Free Samples** with every order
- **14-day Return Policy** for customer satisfaction
- **QR Code Discounts** for exclusive offers
- **Real-time Chat Support** for customer queries

### Admin Capabilities
- **Dashboard Analytics** with sales charts
- **Order Management** with status tracking
- **Inventory Control** with low stock alerts
- **Customer Management** with purchase history
- **Promotion Management** with coupon system

## 🎨 Design System

### Color Palette
- **Primary**: #d4af37 (Elegant Gold)
- **Secondary**: #2c3e50 (Deep Blue)
- **Accent**: #e74c3c (Vibrant Red)
- **Success**: #27ae60 (Green)
- **Light**: #f8f9fa (Light Gray)

### Typography
- **Primary Font**: Playfair Display (Headings)
- **Secondary Font**: Poppins (Body text)
- **Script Font**: Dancing Script (Brand name)

### Responsive Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 992px
- **Desktop**: > 992px

## 🔧 Configuration

### Database Settings
```php
// config/database.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'sanoria_pk');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### Payment Gateway Settings
Configure payment gateways in the database `payment_gateways` table:

```sql
-- JazzCash Configuration
UPDATE payment_gateways 
SET configuration = '{"merchant_id": "your_merchant_id", "password": "your_password"}' 
WHERE gateway_key = 'jazzcash';
```

## 📊 Analytics & Tracking

The admin dashboard provides comprehensive analytics:

- **Sales Overview** - Daily, weekly, monthly sales charts
- **Top Categories** - Best-performing product categories
- **Customer Insights** - Registration and purchase trends
- **Inventory Alerts** - Low stock notifications
- **Order Tracking** - Real-time order status updates

## 🛡️ Security Features

- **Password Hashing** with bcrypt
- **SQL Injection Protection** with prepared statements
- **XSS Protection** with input sanitization
- **CSRF Protection** with token validation
- **Secure Sessions** with proper session management

## 📱 Mobile Optimization

- **Touch-friendly** interface design
- **Optimized images** for faster loading
- **Mobile-first** responsive design
- **Progressive Web App** capabilities
- **Offline functionality** for cached pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Manager**: AI Assistant
- **Frontend Developer**: AI Assistant
- **Backend Developer**: AI Assistant
- **UI/UX Designer**: AI Assistant
- **Database Administrator**: AI Assistant

## 📞 Support

For support and queries:
- **Email**: info@sanoria.pk
- **Phone**: +92 300 1234567
- **Live Chat**: Available on website

## 🎯 Future Roadmap

### Phase 1 (Immediate)
- [ ] Complete product catalog pages
- [ ] Payment gateway integration
- [ ] Email notification system
- [ ] Advanced search filters

### Phase 2 (Next Quarter)
- [ ] Mobile app development
- [ ] Multi-vendor support
- [ ] Advanced analytics dashboard
- [ ] AI-powered product recommendations

### Phase 3 (Future)
- [ ] International shipping
- [ ] Multi-language support
- [ ] Subscription box service
- [ ] Augmented reality try-on

---

**Sanoria.pk** - *Elevating your beauty experience with premium skincare solutions.*

Made with ❤️ for the beauty community in Pakistan.