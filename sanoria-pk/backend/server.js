// ===== SANORIA.PK - Backend Server =====

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const qrcodeRoutes = require('./routes/qrcode');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'sanoria-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/qrcode', qrcodeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Sanoria.pk API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║                                        ║
    ║        SANORIA.PK SERVER STARTED       ║
    ║                                        ║
    ╠════════════════════════════════════════╣
    ║  Server running on port: ${PORT}         ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}          ║
    ║  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}  ║
    ╚════════════════════════════════════════╝
    `);
    
    // Initialize database
    require('./config/database').initialize();
});