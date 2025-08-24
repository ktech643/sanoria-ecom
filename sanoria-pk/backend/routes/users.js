// ===== SANORIA.PK - User Routes =====

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { validatePakistaniPhone, normalizePakistaniPhone } = require('../utils/helpers');

// Get user profile
router.get('/profile', async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const [users] = await pool.execute(
            'SELECT id, email, full_name, phone, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const user = users[0];
        
        // Get user statistics
        const [orderStats] = await pool.execute(
            `SELECT 
                COUNT(*) as total_orders,
                SUM(total_amount) as total_spent,
                COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders
             FROM orders 
             WHERE user_id = ?`,
            [userId]
        );
        
        const [wishlistCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM wishlist_items WHERE user_id = ?',
            [userId]
        );
        
        const [reviewCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM product_reviews WHERE user_id = ?',
            [userId]
        );
        
        user.stats = {
            totalOrders: orderStats[0].total_orders || 0,
            totalSpent: orderStats[0].total_spent || 0,
            completedOrders: orderStats[0].completed_orders || 0,
            wishlistItems: wishlistCount[0].count || 0,
            reviews: reviewCount[0].count || 0
        };
        
        res.json({
            success: true,
            data: user
        });
        
    } catch (error) {
        next(error);
    }
});

// Update user profile
router.put('/profile', [
    body('full_name').optional().notEmpty().trim(),
    body('phone').optional().custom(validatePakistaniPhone)
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
        const { full_name, phone } = req.body;
        
        const updates = [];
        const params = [];
        
        if (full_name) {
            updates.push('full_name = ?');
            params.push(full_name);
        }
        
        if (phone) {
            updates.push('phone = ?');
            params.push(normalizePakistaniPhone(phone));
        }
        
        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        params.push(userId);
        
        await pool.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        
        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Change password
router.put('/change-password', [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 6 })
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
        const { current_password, new_password } = req.body;
        
        // Get current password hash
        const [users] = await pool.execute(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Verify current password
        const isValid = await bcrypt.compare(current_password, users[0].password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        
        // Update password
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Get user addresses
router.get('/addresses', async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const [addresses] = await pool.execute(
            'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [userId]
        );
        
        res.json({
            success: true,
            data: addresses
        });
        
    } catch (error) {
        next(error);
    }
});

// Add new address
router.post('/addresses', [
    body('address_line1').notEmpty().trim(),
    body('city').notEmpty().trim(),
    body('state').notEmpty().trim(),
    body('postal_code').optional().isPostalCode('PK')
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
        const {
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            is_default = false
        } = req.body;
        
        // If setting as default, unset other defaults
        if (is_default) {
            await pool.execute(
                'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
                [userId]
            );
        }
        
        const [result] = await pool.execute(
            `INSERT INTO user_addresses 
             (user_id, address_line1, address_line2, city, state, postal_code, is_default) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, address_line1, address_line2, city, state, postal_code, is_default]
        );
        
        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: { id: result.insertId }
        });
        
    } catch (error) {
        next(error);
    }
});

// Update address
router.put('/addresses/:id', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const updates = req.body;
        
        // Check if address belongs to user
        const [addresses] = await pool.execute(
            'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );
        
        if (addresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }
        
        // Build update query
        const allowedFields = ['address_line1', 'address_line2', 'city', 'state', 'postal_code', 'is_default'];
        const updateFields = [];
        const params = [];
        
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                params.push(updates[field]);
            }
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        // If setting as default, unset others
        if (updates.is_default) {
            await pool.execute(
                'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
                [userId]
            );
        }
        
        params.push(addressId, userId);
        
        await pool.execute(
            `UPDATE user_addresses SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
            params
        );
        
        res.json({
            success: true,
            message: 'Address updated successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Delete address
router.delete('/addresses/:id', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        
        const [result] = await pool.execute(
            'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Address deleted successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Get wishlist
router.get('/wishlist', async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const [items] = await pool.execute(
            `SELECT p.*, w.created_at as added_at 
             FROM wishlist_items w 
             JOIN products p ON w.product_id = p.id 
             WHERE w.user_id = ? AND p.is_active = TRUE
             ORDER BY w.created_at DESC`,
            [userId]
        );
        
        // Parse JSON fields
        items.forEach(item => {
            item.images = JSON.parse(item.images || '[]');
            item.skin_types = JSON.parse(item.skin_types || '[]');
            item.tags = JSON.parse(item.tags || '[]');
        });
        
        res.json({
            success: true,
            data: items
        });
        
    } catch (error) {
        next(error);
    }
});

// Add to wishlist
router.post('/wishlist/:productId', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        
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
        
        // Check if already in wishlist
        const [existing] = await pool.execute(
            'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }
        
        // Add to wishlist
        await pool.execute(
            'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Added to wishlist'
        });
        
    } catch (error) {
        next(error);
    }
});

// Remove from wishlist
router.delete('/wishlist/:productId', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        
        const [result] = await pool.execute(
            'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not in wishlist'
            });
        }
        
        res.json({
            success: true,
            message: 'Removed from wishlist'
        });
        
    } catch (error) {
        next(error);
    }
});

// Get cart
router.get('/cart', async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const [items] = await pool.execute(
            `SELECT c.*, p.name, p.slug, p.price, p.images, p.quantity as stock 
             FROM cart_items c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ? AND p.is_active = TRUE`,
            [userId]
        );
        
        // Parse JSON fields and calculate totals
        let cartTotal = 0;
        items.forEach(item => {
            item.images = JSON.parse(item.images || '[]');
            item.total = item.price * item.quantity;
            cartTotal += item.total;
        });
        
        res.json({
            success: true,
            data: {
                items,
                total: cartTotal
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Add to cart
router.post('/cart', [
    body('product_id').isInt(),
    body('quantity').isInt({ min: 1 })
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
        const { product_id, quantity } = req.body;
        
        // Check product availability
        const [products] = await pool.execute(
            'SELECT id, quantity as stock FROM products WHERE id = ? AND is_active = TRUE',
            [product_id]
        );
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const product = products[0];
        
        // Check if already in cart
        const [existingItems] = await pool.execute(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );
        
        if (existingItems.length > 0) {
            // Update quantity
            const newQuantity = existingItems[0].quantity + quantity;
            
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }
            
            await pool.execute(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existingItems[0].id]
            );
        } else {
            // Add new item
            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }
            
            await pool.execute(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, product_id, quantity]
            );
        }
        
        res.json({
            success: true,
            message: 'Added to cart'
        });
        
    } catch (error) {
        next(error);
    }
});

// Update cart item
router.put('/cart/:productId', [
    body('quantity').isInt({ min: 0 })
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
        const { quantity } = req.body;
        
        if (quantity === 0) {
            // Remove from cart
            await pool.execute(
                'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
        } else {
            // Check stock
            const [products] = await pool.execute(
                'SELECT quantity as stock FROM products WHERE id = ?',
                [productId]
            );
            
            if (products.length > 0 && quantity > products[0].stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }
            
            // Update quantity
            const [result] = await pool.execute(
                'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not in cart'
                });
            }
        }
        
        res.json({
            success: true,
            message: quantity === 0 ? 'Removed from cart' : 'Cart updated'
        });
        
    } catch (error) {
        next(error);
    }
});

// Clear cart
router.delete('/cart', async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        await pool.execute(
            'DELETE FROM cart_items WHERE user_id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            message: 'Cart cleared'
        });
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;