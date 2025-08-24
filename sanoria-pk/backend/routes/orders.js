// ===== SANORIA.PK - Order Routes =====

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { generateOrderNumber, calculateShipping, paginate, buildPaginationMeta } = require('../utils/helpers');
const { sendOrderConfirmationEmail } = require('../utils/email');

// Get user's orders
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;
        
        // Build query
        let query = 'SELECT * FROM orders WHERE user_id = ?';
        const params = [userId];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        // Get total count
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        
        // Add sorting and pagination
        query += ' ORDER BY created_at DESC';
        const { limit: pageLimit, offset } = paginate(parseInt(page), parseInt(limit));
        query += ' LIMIT ? OFFSET ?';
        params.push(pageLimit, offset);
        
        // Get orders
        const [orders] = await pool.execute(query, params);
        
        // Parse JSON fields
        orders.forEach(order => {
            order.shipping_address = JSON.parse(order.shipping_address || '{}');
            order.billing_address = JSON.parse(order.billing_address || '{}');
        });
        
        // Get order items for each order
        if (orders.length > 0) {
            const orderIds = orders.map(o => o.id);
            const placeholders = orderIds.map(() => '?').join(',');
            
            const [items] = await pool.execute(
                `SELECT oi.*, p.name, p.slug, p.images 
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id IN (${placeholders})`,
                orderIds
            );
            
            // Group items by order
            const itemsByOrder = items.reduce((acc, item) => {
                item.images = JSON.parse(item.images || '[]');
                if (!acc[item.order_id]) acc[item.order_id] = [];
                acc[item.order_id].push(item);
                return acc;
            }, {});
            
            // Add items to orders
            orders.forEach(order => {
                order.items = itemsByOrder[order.id] || [];
            });
        }
        
        res.json({
            success: true,
            data: orders,
            meta: buildPaginationMeta(total, parseInt(page), pageLimit)
        });
        
    } catch (error) {
        next(error);
    }
});

// Get single order
router.get('/:orderNumber', async (req, res, next) => {
    try {
        const { orderNumber } = req.params;
        const userId = req.user.id;
        
        // Get order
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE order_number = ? AND user_id = ?',
            [orderNumber, userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const order = orders[0];
        
        // Parse JSON fields
        order.shipping_address = JSON.parse(order.shipping_address || '{}');
        order.billing_address = JSON.parse(order.billing_address || '{}');
        
        // Get order items
        const [items] = await pool.execute(
            `SELECT oi.*, p.name, p.slug, p.images 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [order.id]
        );
        
        items.forEach(item => {
            item.images = JSON.parse(item.images || '[]');
        });
        
        order.items = items;
        
        res.json({
            success: true,
            data: order
        });
        
    } catch (error) {
        next(error);
    }
});

// Create new order
router.post('/', async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const userId = req.user.id;
        const {
            items,
            shipping_address,
            billing_address,
            payment_method,
            shipping_method = 'standard',
            coupon_code,
            notes
        } = req.body;
        
        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }
        
        // Get cart items with product details
        const productIds = items.map(item => item.product_id);
        const placeholders = productIds.map(() => '?').join(',');
        
        const [products] = await connection.execute(
            `SELECT id, name, price, quantity, weight 
             FROM products 
             WHERE id IN (${placeholders}) AND is_active = TRUE`,
            productIds
        );
        
        if (products.length !== items.length) {
            throw new Error('Some products are not available');
        }
        
        // Create product map
        const productMap = products.reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
        }, {});
        
        // Calculate order totals
        let subtotal = 0;
        let totalWeight = 0;
        const orderItems = [];
        
        for (const item of items) {
            const product = productMap[item.product_id];
            
            // Check stock
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            totalWeight += (product.weight || 0.5) * item.quantity;
            
            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });
        }
        
        // Calculate shipping
        const shippingAmount = calculateShipping(totalWeight, shipping_address.city, shipping_method);
        
        // Apply coupon if provided
        let discountAmount = 0;
        if (coupon_code) {
            const [coupons] = await connection.execute(
                `SELECT * FROM coupons 
                 WHERE code = ? AND is_active = TRUE 
                 AND (valid_from IS NULL OR valid_from <= NOW())
                 AND (valid_until IS NULL OR valid_until >= NOW())
                 AND (usage_limit IS NULL OR used_count < usage_limit)`,
                [coupon_code]
            );
            
            if (coupons.length > 0) {
                const coupon = coupons[0];
                
                if (!coupon.minimum_amount || subtotal >= coupon.minimum_amount) {
                    if (coupon.discount_type === 'percentage') {
                        discountAmount = (subtotal * coupon.discount_value) / 100;
                    } else {
                        discountAmount = coupon.discount_value;
                    }
                    
                    // Update coupon usage
                    await connection.execute(
                        'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
                        [coupon.id]
                    );
                }
            }
        }
        
        // Calculate total
        const taxAmount = 0; // Pakistan doesn't have GST on cosmetics for consumers
        const totalAmount = subtotal - discountAmount + shippingAmount + taxAmount;
        
        // Create order
        const orderNumber = generateOrderNumber();
        
        const [orderResult] = await connection.execute(
            `INSERT INTO orders (
                order_number, user_id, status, subtotal, discount_amount, 
                shipping_amount, tax_amount, total_amount, payment_method, 
                shipping_address, billing_address, shipping_method, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                orderNumber, userId, 'pending', subtotal, discountAmount,
                shippingAmount, taxAmount, totalAmount, payment_method,
                JSON.stringify(shipping_address), JSON.stringify(billing_address),
                shipping_method, notes
            ]
        );
        
        const orderId = orderResult.insertId;
        
        // Create order items
        for (const item of orderItems) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price, item.total]
            );
            
            // Update product stock
            await connection.execute(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }
        
        // Clear user's cart
        await connection.execute(
            'DELETE FROM cart_items WHERE user_id = ?',
            [userId]
        );
        
        await connection.commit();
        
        // Get user email for confirmation
        const [users] = await pool.execute(
            'SELECT email, full_name FROM users WHERE id = ?',
            [userId]
        );
        
        // Send confirmation email
        if (users.length > 0) {
            await sendOrderConfirmationEmail(users[0].email, {
                orderNumber,
                items: orderItems,
                total: totalAmount
            });
        }
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: {
                order_number: orderNumber,
                total: totalAmount
            }
        });
        
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
});

// Cancel order
router.post('/:orderNumber/cancel', async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { orderNumber } = req.params;
        const userId = req.user.id;
        
        // Get order
        const [orders] = await connection.execute(
            'SELECT * FROM orders WHERE order_number = ? AND user_id = ?',
            [orderNumber, userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const order = orders[0];
        
        // Check if order can be cancelled
        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled'
            });
        }
        
        // Get order items to restore stock
        const [items] = await connection.execute(
            'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
            [order.id]
        );
        
        // Restore product stock
        for (const item of items) {
            await connection.execute(
                'UPDATE products SET quantity = quantity + ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }
        
        // Update order status
        await connection.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['cancelled', order.id]
        );
        
        await connection.commit();
        
        res.json({
            success: true,
            message: 'Order cancelled successfully'
        });
        
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
});

// Track order
router.get('/:orderNumber/track', async (req, res, next) => {
    try {
        const { orderNumber } = req.params;
        const userId = req.user.id;
        
        // Get order with tracking info
        const [orders] = await pool.execute(
            `SELECT order_number, status, shipping_method, tracking_number, 
                    created_at, updated_at 
             FROM orders 
             WHERE order_number = ? AND user_id = ?`,
            [orderNumber, userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const order = orders[0];
        
        // Mock tracking data (in production, integrate with courier APIs)
        const trackingSteps = [
            {
                status: 'pending',
                title: 'Order Placed',
                description: 'Your order has been received',
                timestamp: order.created_at,
                completed: true
            },
            {
                status: 'processing',
                title: 'Processing',
                description: 'Your order is being prepared',
                timestamp: null,
                completed: ['processing', 'shipped', 'delivered'].includes(order.status)
            },
            {
                status: 'shipped',
                title: 'Shipped',
                description: 'Your order is on the way',
                timestamp: null,
                completed: ['shipped', 'delivered'].includes(order.status)
            },
            {
                status: 'delivered',
                title: 'Delivered',
                description: 'Your order has been delivered',
                timestamp: null,
                completed: order.status === 'delivered'
            }
        ];
        
        res.json({
            success: true,
            data: {
                order_number: order.order_number,
                current_status: order.status,
                tracking_number: order.tracking_number,
                shipping_method: order.shipping_method,
                tracking_steps: trackingSteps
            }
        });
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;