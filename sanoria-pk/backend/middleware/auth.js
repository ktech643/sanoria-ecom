// ===== SANORIA.PK - Authentication Middleware =====

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sanoria-jwt-secret-2024';

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
    
    req.user = decoded;
    next();
}

// Admin authorization middleware
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
}

// Optional authentication (doesn't fail if no token)
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
        }
    }
    
    next();
}

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    authorizeAdmin,
    optionalAuth
};