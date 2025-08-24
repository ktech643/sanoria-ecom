// ===== SANORIA.PK - QR Code Routes =====

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const {
    generateProductQR,
    generateOrderQR,
    generatePromotionQR,
    validatePromotionQR,
    parseQRCodeData
} = require('../utils/qrcode');

// Generate QR code for product
router.get('/product/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        
        // Get product details
        const [products] = await pool.execute(
            'SELECT id, name, slug, price FROM products WHERE id = ? AND is_active = TRUE',
            [productId]
        );
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const product = products[0];
        const qrCode = await generateProductQR(product);
        
        res.json({
            success: true,
            data: {
                qrCode,
                product: {
                    id: product.id,
                    name: product.name,
                    slug: product.slug
                }
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Generate QR code for order (authenticated)
router.get('/order/:orderNumber', authenticateToken, async (req, res, next) => {
    try {
        const { orderNumber } = req.params;
        const userId = req.user.id;
        
        // Get order details
        const [orders] = await pool.execute(
            'SELECT order_number, total_amount, created_at FROM orders WHERE order_number = ? AND user_id = ?',
            [orderNumber, userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const order = orders[0];
        const qrCode = await generateOrderQR(order);
        
        res.json({
            success: true,
            data: {
                qrCode,
                orderNumber: order.order_number
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Generate QR code for promotion
router.get('/promotion/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        
        // Get promotion details
        const [promotions] = await pool.execute(
            `SELECT code, discount_type, discount_value, valid_until 
             FROM coupons 
             WHERE code = ? AND is_active = TRUE`,
            [code]
        );
        
        if (promotions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found'
            });
        }
        
        const promotion = promotions[0];
        const qrCode = await generatePromotionQR(promotion);
        
        res.json({
            success: true,
            data: {
                qrCode,
                promotion: {
                    code: promotion.code,
                    discountType: promotion.discount_type,
                    discountValue: promotion.discount_value,
                    validUntil: promotion.valid_until
                }
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Scan and validate QR code
router.post('/scan', optionalAuth, async (req, res, next) => {
    try {
        const { qrData } = req.body;
        
        if (!qrData) {
            return res.status(400).json({
                success: false,
                message: 'QR code data is required'
            });
        }
        
        const parsed = parseQRCodeData(qrData);
        
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error
            });
        }
        
        const data = parsed.data;
        let response;
        
        switch (data.type) {
            case 'product':
                // Get product details
                const [products] = await pool.execute(
                    `SELECT p.*, c.name as category_name 
                     FROM products p 
                     LEFT JOIN categories c ON p.category_id = c.id 
                     WHERE p.id = ? AND p.is_active = TRUE`,
                    [data.id]
                );
                
                if (products.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                
                const product = products[0];
                product.images = JSON.parse(product.images || '[]');
                
                response = {
                    type: 'product',
                    data: product,
                    action: 'view_product',
                    url: data.url
                };
                break;
                
            case 'order':
                // For order tracking, no authentication required
                response = {
                    type: 'order',
                    data: {
                        orderNumber: data.orderNumber,
                        trackingUrl: data.url
                    },
                    action: 'track_order',
                    url: data.url
                };
                break;
                
            case 'promotion':
                // Validate promotion
                const validation = await validatePromotionQR(qrData, req.user?.id);
                
                if (!validation.valid) {
                    return res.status(400).json({
                        success: false,
                        message: validation.message
                    });
                }
                
                response = {
                    type: 'promotion',
                    data: {
                        code: validation.code,
                        discount: validation.discount,
                        discountType: validation.discountType
                    },
                    action: 'apply_promotion',
                    url: data.url
                };
                break;
                
            case 'verification':
                response = {
                    type: 'verification',
                    data: {
                        userId: data.userId,
                        code: data.code
                    },
                    action: 'verify_account',
                    url: data.url
                };
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Unknown QR code type'
                });
        }
        
        // Log QR code scan
        if (req.user) {
            await pool.execute(
                'INSERT INTO qr_scan_logs (user_id, qr_type, qr_data) VALUES (?, ?, ?)',
                [req.user.id, data.type, qrData]
            );
        }
        
        res.json({
            success: true,
            ...response
        });
        
    } catch (error) {
        next(error);
    }
});

// Apply scanned promotion code
router.post('/apply-promotion', authenticateToken, async (req, res, next) => {
    try {
        const { qrData } = req.body;
        const userId = req.user.id;
        
        const validation = await validatePromotionQR(qrData, userId);
        
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }
        
        // Check if coupon exists and is valid
        const [coupons] = await pool.execute(
            `SELECT * FROM coupons 
             WHERE code = ? AND is_active = TRUE 
             AND (valid_from IS NULL OR valid_from <= NOW())
             AND (valid_until IS NULL OR valid_until >= NOW())
             AND (usage_limit IS NULL OR used_count < usage_limit)`,
            [validation.code]
        );
        
        if (coupons.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired promotion code'
            });
        }
        
        const coupon = coupons[0];
        
        // Check if user has already used this coupon
        const [usageCheck] = await pool.execute(
            `SELECT COUNT(*) as count FROM coupon_usage 
             WHERE user_id = ? AND coupon_id = ?`,
            [userId, coupon.id]
        );
        
        if (usageCheck[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already used this promotion'
            });
        }
        
        // Mark coupon as applied to user's session
        // In a real implementation, you might want to store this in session or temporary storage
        
        res.json({
            success: true,
            message: 'Promotion applied successfully',
            data: {
                code: coupon.code,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                minimumAmount: coupon.minimum_amount
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Get QR scan history for user
router.get('/history', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const [scans] = await pool.execute(
            `SELECT qr_type, qr_data, created_at 
             FROM qr_scan_logs 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 50`,
            [userId]
        );
        
        res.json({
            success: true,
            data: scans
        });
        
    } catch (error) {
        next(error);
    }
});

// Create QR scan logs table
const createQRScanLogsTable = `
    CREATE TABLE IF NOT EXISTS qr_scan_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        qr_type VARCHAR(50) NOT NULL,
        qr_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_type (qr_type),
        INDEX idx_created (created_at)
    )
`;

// Create coupon usage table
const createCouponUsageTable = `
    CREATE TABLE IF NOT EXISTS coupon_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        coupon_id INT NOT NULL,
        order_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (coupon_id) REFERENCES coupons(id),
        FOREIGN KEY (order_id) REFERENCES orders(id),
        UNIQUE KEY unique_user_coupon (user_id, coupon_id),
        INDEX idx_user_id (user_id),
        INDEX idx_coupon_id (coupon_id)
    )
`;

module.exports = router;