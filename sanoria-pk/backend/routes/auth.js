// ===== SANORIA.PK - Authentication Routes =====

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { generateVerificationCode } = require('../utils/helpers');

// Register new user
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').notEmpty().trim(),
    body('phone').optional().isMobilePhone()
], async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { email, password, full_name, phone } = req.body;
        
        // Check if user exists
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate verification code
        const verificationCode = generateVerificationCode();
        
        // Create user
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, full_name, phone, verification_code) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, full_name, phone, verificationCode]
        );
        
        // Send verification email
        await sendVerificationEmail(email, verificationCode);
        
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email for verification code.',
            userId: result.insertId
        });
        
    } catch (error) {
        next(error);
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { email, password } = req.body;
        
        // Get user
        const [users] = await pool.execute(
            'SELECT id, email, password, full_name, role, is_verified FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const user = users[0];
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check if verified
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first'
            });
        }
        
        // Generate token
        const token = generateToken(user);
        
        // Remove password from response
        delete user.password;
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user
        });
        
    } catch (error) {
        next(error);
    }
});

// Verify email
router.post('/verify-email', [
    body('email').isEmail().normalizeEmail(),
    body('code').notEmpty()
], async (req, res, next) => {
    try {
        const { email, code } = req.body;
        
        // Check verification code
        const [users] = await pool.execute(
            'SELECT id, verification_code FROM users WHERE email = ? AND is_verified = FALSE',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already verified'
            });
        }
        
        const user = users[0];
        
        if (user.verification_code !== code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }
        
        // Update user as verified
        await pool.execute(
            'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE id = ?',
            [user.id]
        );
        
        res.json({
            success: true,
            message: 'Email verified successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Request password reset
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail()
], async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Get user
        const [users] = await pool.execute(
            'SELECT id, full_name FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            // Don't reveal if email exists
            return res.json({
                success: true,
                message: 'If the email exists, a reset link has been sent'
            });
        }
        
        const user = users[0];
        
        // Generate reset token
        const resetToken = generateVerificationCode() + generateVerificationCode();
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour
        
        // Save reset token
        await pool.execute(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [resetToken, resetExpires, user.id]
        );
        
        // Send reset email
        await sendPasswordResetEmail(email, resetToken);
        
        res.json({
            success: true,
            message: 'If the email exists, a reset link has been sent'
        });
        
    } catch (error) {
        next(error);
    }
});

// Reset password
router.post('/reset-password', [
    body('email').isEmail().normalizeEmail(),
    body('token').notEmpty(),
    body('password').isLength({ min: 6 })
], async (req, res, next) => {
    try {
        const { email, token, password } = req.body;
        
        // Check reset token
        const [users] = await pool.execute(
            'SELECT id FROM users WHERE email = ? AND reset_token = ? AND reset_token_expires > NOW()',
            [email, token]
        );
        
        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
        
        const user = users[0];
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update password and clear reset token
        await pool.execute(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );
        
        res.json({
            success: true,
            message: 'Password reset successful'
        });
        
    } catch (error) {
        next(error);
    }
});

// Verify token
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        // Get fresh user data
        const [users] = await pool.execute(
            'SELECT id, email, full_name, role FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user: users[0]
        });
        
    } catch (error) {
        next(error);
    }
});

// Logout (optional - mainly for session cleanup)
router.post('/logout', authenticateToken, (req, res) => {
    // In JWT-based auth, logout is handled client-side
    // This endpoint can be used for additional cleanup if needed
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;