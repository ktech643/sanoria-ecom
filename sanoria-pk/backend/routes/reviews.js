// ===== SANORIA.PK - Review Routes =====

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Add product review
router.post('/product/:productId', authenticateToken, [
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ max: 255 }),
    body('comment').optional().trim().isLength({ max: 1000 })
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const userId = req.user.id;
        const productId = req.params.productId;
        const { rating, title, comment } = req.body;
        
        // Check if product exists
        const [products] = await pool.execute(
            'SELECT id FROM products WHERE id = ? AND is_active = TRUE',
            [productId]
        );
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check if user has already reviewed this product
        const [existingReviews] = await pool.execute(
            'SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?',
            [productId, userId]
        );
        
        if (existingReviews.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }
        
        // Check if user has purchased this product
        const [purchases] = await pool.execute(
            `SELECT COUNT(*) as count 
             FROM order_items oi 
             JOIN orders o ON oi.order_id = o.id 
             WHERE oi.product_id = ? AND o.user_id = ? AND o.status = 'delivered'`,
            [productId, userId]
        );
        
        const isVerifiedPurchase = purchases[0].count > 0;
        
        // Create review
        const [result] = await pool.execute(
            `INSERT INTO product_reviews 
             (product_id, user_id, rating, title, comment, is_verified_purchase) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [productId, userId, rating, title || null, comment || null, isVerifiedPurchase]
        );
        
        // Create notification for admin
        await pool.execute(
            `INSERT INTO notifications (user_id, title, message, type) 
             SELECT id, 'New Product Review', ?, 'review' 
             FROM users WHERE role = 'admin'`,
            [`New ${rating}-star review for product #${productId}`]
        );
        
        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: {
                reviewId: result.insertId,
                isVerifiedPurchase
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Update product review
router.put('/:reviewId', authenticateToken, [
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ max: 255 }),
    body('comment').optional().trim().isLength({ max: 1000 })
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const userId = req.user.id;
        const reviewId = req.params.reviewId;
        const updates = req.body;
        
        // Check if review belongs to user
        const [reviews] = await pool.execute(
            'SELECT id FROM product_reviews WHERE id = ? AND user_id = ?',
            [reviewId, userId]
        );
        
        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        // Build update query
        const updateFields = [];
        const params = [];
        
        if (updates.rating !== undefined) {
            updateFields.push('rating = ?');
            params.push(updates.rating);
        }
        
        if (updates.title !== undefined) {
            updateFields.push('title = ?');
            params.push(updates.title || null);
        }
        
        if (updates.comment !== undefined) {
            updateFields.push('comment = ?');
            params.push(updates.comment || null);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        params.push(reviewId);
        
        await pool.execute(
            `UPDATE product_reviews SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );
        
        res.json({
            success: true,
            message: 'Review updated successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Delete product review
router.delete('/:reviewId', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;
        
        const [result] = await pool.execute(
            'DELETE FROM product_reviews WHERE id = ? AND user_id = ?',
            [reviewId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Mark review as helpful
router.post('/:reviewId/helpful', optionalAuth, async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user?.id;
        
        // Check if review exists
        const [reviews] = await pool.execute(
            'SELECT id, helpful_count FROM product_reviews WHERE id = ?',
            [reviewId]
        );
        
        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        // Check if user has already marked this review as helpful
        if (userId) {
            const [existing] = await pool.execute(
                'SELECT id FROM review_helpful WHERE review_id = ? AND user_id = ?',
                [reviewId, userId]
            );
            
            if (existing.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'You have already marked this review as helpful'
                });
            }
            
            // Record user's vote
            await pool.execute(
                'INSERT INTO review_helpful (review_id, user_id) VALUES (?, ?)',
                [reviewId, userId]
            );
        }
        
        // Increment helpful count
        await pool.execute(
            'UPDATE product_reviews SET helpful_count = helpful_count + 1 WHERE id = ?',
            [reviewId]
        );
        
        res.json({
            success: true,
            message: 'Review marked as helpful',
            data: {
                helpfulCount: reviews[0].helpful_count + 1
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Report review
router.post('/:reviewId/report', authenticateToken, [
    body('reason').notEmpty().isIn(['spam', 'inappropriate', 'fake', 'other']),
    body('details').optional().trim().isLength({ max: 500 })
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const userId = req.user.id;
        const reviewId = req.params.reviewId;
        const { reason, details } = req.body;
        
        // Check if review exists
        const [reviews] = await pool.execute(
            'SELECT id FROM product_reviews WHERE id = ?',
            [reviewId]
        );
        
        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        // Check if already reported by this user
        const [existing] = await pool.execute(
            'SELECT id FROM review_reports WHERE review_id = ? AND user_id = ?',
            [reviewId, userId]
        );
        
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'You have already reported this review'
            });
        }
        
        // Create report
        await pool.execute(
            'INSERT INTO review_reports (review_id, user_id, reason, details) VALUES (?, ?, ?, ?)',
            [reviewId, userId, reason, details || null]
        );
        
        // Notify admins
        await pool.execute(
            `INSERT INTO notifications (user_id, title, message, type) 
             SELECT id, 'Review Reported', ?, 'report' 
             FROM users WHERE role = 'admin'`,
            [`Review #${reviewId} has been reported for: ${reason}`]
        );
        
        res.json({
            success: true,
            message: 'Review reported successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Get user's reviews
router.get('/user/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // Get total count
        const [countResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM product_reviews WHERE user_id = ?',
            [userId]
        );
        const total = countResult[0].total;
        
        // Get reviews with product info
        const offset = (page - 1) * limit;
        const [reviews] = await pool.execute(
            `SELECT r.*, p.name as product_name, p.slug as product_slug, p.images 
             FROM product_reviews r 
             JOIN products p ON r.product_id = p.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, parseInt(limit), offset]
        );
        
        // Parse images
        reviews.forEach(review => {
            review.images = JSON.parse(review.images || '[]');
        });
        
        res.json({
            success: true,
            data: reviews,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Create review helpful tracking table
const createReviewHelpfulTable = `
    CREATE TABLE IF NOT EXISTS review_helpful (
        id INT AUTO_INCREMENT PRIMARY KEY,
        review_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES product_reviews(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_review_user (review_id, user_id),
        INDEX idx_review_id (review_id)
    )
`;

// Create review reports table
const createReviewReportsTable = `
    CREATE TABLE IF NOT EXISTS review_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        review_id INT NOT NULL,
        user_id INT NOT NULL,
        reason ENUM('spam', 'inappropriate', 'fake', 'other') NOT NULL,
        details TEXT,
        status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at DATETIME,
        FOREIGN KEY (review_id) REFERENCES product_reviews(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE KEY unique_review_user (review_id, user_id),
        INDEX idx_review_id (review_id),
        INDEX idx_status (status)
    )
`;

module.exports = router;