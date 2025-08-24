# Sanoria.pk - Premium Beauty & Skincare E-commerce Platform

A luxurious and feature-rich e-commerce website for beauty and skincare products, built with modern web technologies and optimized for the Pakistani market.

## 🌟 Features

### Customer Features
- **Elegant & Luxurious Design** - Premium UI/UX with gold accents and sophisticated typography
- **Shop by Skin Type** - Personalized product recommendations based on skin type
- **Smart Search** - Full-text search with filters and suggestions
- **User Accounts** - Order history, wishlist, and profile management
- **Multiple Payment Options** - JazzCash, EasyPaisa, Bank Transfer, and Cash on Delivery
- **Order Tracking** - Real-time order status updates
- **14-Day Return Policy** - Easy returns and refunds
- **AI Chatbot** - 24/7 customer support assistant
- **QR Code Integration** - Scan for promotions and product details
- **Mobile Responsive** - Optimized for all devices

### Admin Features
- **Dashboard** - Real-time statistics and analytics
- **Product Management** - Add, edit, and manage products with variants
- **Order Management** - Process orders and update shipping status
- **Customer Management** - View and manage customer accounts
- **Inventory Tracking** - Low stock alerts and reports
- **Coupon System** - Create and manage discount codes
- **Email Marketing** - Send promotional emails to customers
- **Reports** - Sales, inventory, and customer reports

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sanoria-pk.git
cd sanoria-pk
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Database credentials
- JWT secret
- Email configuration
- Payment gateway credentials

5. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Default Admin Access
- Email: `abcd@gmail.com`
- Password: `11223344`

⚠️ **Important**: Change these credentials immediately after first login!

## 📁 Project Structure

```
sanoria-pk/
├── frontend/              # Frontend files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Images and assets
│   └── index.html        # Main HTML file
├── backend/              # Backend API
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Express server
├── public/               # Public assets
│   └── uploads/          # User uploads
├── database/             # Database files
├── package.json          # Dependencies
└── README.md            # This file
```

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 - Responsive framework
- Font Awesome - Icons
- Google Fonts - Typography
- AJAX - Asynchronous requests

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MySQL - Database
- JWT - Authentication
- Bcrypt - Password hashing
- Multer - File uploads
- Nodemailer - Email service

### Payment Integration
- JazzCash API
- EasyPaisa API

### Shipping Partners
- Leopard Courier
- TCS
- PkDex

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Input validation
- Secure file uploads

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get single product
- `GET /api/products/skin-type/:type` - Get products by skin type
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/new/arrivals` - Get new arrivals

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order details
- `POST /api/orders/:orderNumber/cancel` - Cancel order
- `GET /api/orders/:orderNumber/track` - Track order

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/wishlist` - Get wishlist
- `GET /api/users/cart` - Get cart items

### Admin (Requires admin authentication)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `/frontend/css/style.css`:
```css
:root {
    --primary-color: #D4AF37; /* Luxury Gold */
    --secondary-color: #1a1a1a;
    --accent-color: #E91E63;
}
```

### Changing Fonts
Update the Google Fonts import in `/frontend/index.html` and font-family in CSS.

### Adding Payment Methods
1. Add payment gateway configuration in `.env`
2. Create new payment handler in `/backend/routes/payments.js`
3. Update payment options in frontend

## 🚀 Deployment

### Production Checklist
- [ ] Change default admin credentials
- [ ] Update environment variables
- [ ] Enable HTTPS
- [ ] Set up proper database backups
- [ ] Configure email service
- [ ] Set up monitoring and logging
- [ ] Optimize images and assets
- [ ] Enable caching
- [ ] Set up CDN for static assets

### Deployment Options
- **VPS**: Deploy on DigitalOcean, Linode, or AWS EC2
- **Shared Hosting**: Use cPanel with Node.js support
- **PaaS**: Deploy on Heroku, Railway, or Render
- **Serverless**: Use Vercel or Netlify with serverless functions

## 📈 SEO Optimization

The platform includes:
- Meta tags optimization
- Structured data for products
- XML sitemap generation
- Robots.txt configuration
- Fast page load times
- Mobile-friendly design
- Clean URLs
- Alt tags for images

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Sanoria.pk. All rights reserved.

## 📞 Support

For support and queries:
- Email: support@sanoria.pk
- Phone: +92 XXX XXXXXXX
- Website: https://sanoria.pk

## 🙏 Acknowledgments

- Bootstrap team for the amazing framework
- Font Awesome for the icon library
- Google Fonts for typography
- All open-source contributors

---

Made with ❤️ for Sanoria.pk - Your trusted partner in luxury skincare