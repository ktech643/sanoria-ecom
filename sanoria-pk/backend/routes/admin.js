// ===== SANORIA.PK - Admin Routes =====

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { pool } = require('../config/database');
const { authorizeAdmin } = require('../middleware/auth');
const { generateSKU, slugify, paginate, buildPaginationMeta } = require('../utils/helpers');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '../public/uploads/';
        if (file.fieldname === 'product_images') {
            uploadPath += 'products/';
        } else if (file.fieldname === 'category_image') {
            uploadPath += 'categories/';
        } else if (file.fieldname === 'banner_image') {
            uploadPath += 'banners/';
        }
        cb(null, path.join(__dirname, uploadPath));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Apply admin authorization to all routes
router.use(authorizeAdmin);

// Dashboard statistics
router.get('/dashboard', async (req, res, next) => {
    try {
        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Get statistics
        const [todayOrders] = await pool.execute(
            'SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders WHERE created_at >= ? AND created_at < ?',
            [today, tomorrow]
        );
        
        const [totalOrders] = await pool.execute(
            'SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders'
        );
        
        const [pendingOrders] = await pool.execute(
            'SELECT COUNT(*) as count FROM orders WHERE status = ?',
            ['pending']
        );
        
        const [totalProducts] = await pool.execute(
            'SELECT COUNT(*) as count FROM products WHERE is_active = TRUE'
        );
        
        const [lowStockProducts] = await pool.execute(
            'SELECT COUNT(*) as count FROM products WHERE quantity < 10 AND is_active = TRUE'
        );
        
        const [totalUsers] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['customer']
        );
        
        const [newUsers] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = ? AND created_at >= ?',
            ['customer', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]
        );
        
        // Get recent orders
        const [recentOrders] = await pool.execute(
            `SELECT o.*, u.full_name 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             ORDER BY o.created_at DESC 
             LIMIT 10`
        );
        
        // Get top selling products
        const [topProducts] = await pool.execute(
            `SELECT p.id, p.name, p.price, SUM(oi.quantity) as total_sold 
             FROM products p 
             JOIN order_items oi ON p.id = oi.product_id 
             JOIN orders o ON oi.order_id = o.id 
             WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
             GROUP BY p.id 
             ORDER BY total_sold DESC 
             LIMIT 5`
        );
        
        res.json({
            success: true,
            data: {
                stats: {
                    todayOrders: todayOrders[0].count || 0,
                    todayRevenue: todayOrders[0].revenue || 0,
                    totalOrders: totalOrders[0].count || 0,
                    totalRevenue: totalOrders[0].revenue || 0,
                    pendingOrders: pendingOrders[0].count || 0,
                    totalProducts: totalProducts[0].count || 0,
                    lowStockProducts: lowStockProducts[0].count || 0,
                    totalUsers: totalUsers[0].count || 0,
                    newUsers: newUsers[0].count || 0
                },
                recentOrders,
                topProducts
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Product Management

// Get all products (admin view)
router.get('/products', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, category, status } = req.query;
        
        let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
        const params = [];
        
        if (search) {
            query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        if (category) {
            query += ' AND p.category_id = ?';
            params.push(category);
        }
        
        if (status !== undefined) {
            query += ' AND p.is_active = ?';
            params.push(status === 'active');
        }
        
        // Get total count
        const countQuery = query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        
        // Add pagination
        query += ' ORDER BY p.created_at DESC';
        const { limit: pageLimit, offset } = paginate(parseInt(page), parseInt(limit));
        query += ' LIMIT ? OFFSET ?';
        params.push(pageLimit, offset);
        
        const [products] = await pool.execute(query, params);
        
        // Parse JSON fields
        products.forEach(product => {
            product.skin_types = JSON.parse(product.skin_types || '[]');
            product.tags = JSON.parse(product.tags || '[]');
            product.images = JSON.parse(product.images || '[]');
        });
        
        res.json({
            success: true,
            data: products,
            meta: buildPaginationMeta(total, parseInt(page), pageLimit)
        });
        
    } catch (error) {
        next(error);
    }
});

// Create new product
router.post('/products', upload.array('product_images', 5), async (req, res, next) => {
    try {
        const {
            name,
            description,
            short_description,
            category_id,
            price,
            compare_price,
            cost,
            quantity,
            is_featured,
            skin_types,
            tags,
            weight,
            dimensions
        } = req.body;
        
        // Generate SKU and slug
        const sku = generateSKU(name, category_id);
        const slug = slugify(name);
        
        // Process uploaded images
        const images = req.files.map(file => `/uploads/products/${file.filename}`);
        
        // Insert product
        const [result] = await pool.execute(
            `INSERT INTO products (
                sku, name, slug, description, short_description, category_id,
                price, compare_price, cost, quantity, is_featured,
                skin_types, tags, images, weight, dimensions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                sku, name, slug, description, short_description, category_id,
                parseFloat(price), compare_price ? parseFloat(compare_price) : null,
                cost ? parseFloat(cost) : null, parseInt(quantity) || 0,
                is_featured === 'true', JSON.stringify(skin_types || []),
                JSON.stringify(tags || []), JSON.stringify(images),
                weight ? parseFloat(weight) : null, JSON.stringify(dimensions || {})
            ]
        );
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { id: result.insertId, sku, slug }
        });
        
    } catch (error) {
        next(error);
    }
});

// Update product
router.put('/products/:id', upload.array('product_images', 5), async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updates = req.body;
        
        // Get existing product
        const [products] = await pool.execute(
            'SELECT images FROM products WHERE id = ?',
            [productId]
        );
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Handle image updates
        let images = JSON.parse(products[0].images || '[]');
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            images = [...images, ...newImages];
        }
        
        // Build update query
        const allowedFields = [
            'name', 'description', 'short_description', 'category_id',
            'price', 'compare_price', 'cost', 'quantity', 'is_active',
            'is_featured', 'skin_types', 'tags', 'weight', 'dimensions'
        ];
        
        const updateFields = [];
        const params = [];
        
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                if (field === 'skin_types' || field === 'tags' || field === 'dimensions') {
                    updateFields.push(`${field} = ?`);
                    params.push(JSON.stringify(updates[field]));
                } else if (field === 'is_active' || field === 'is_featured') {
                    updateFields.push(`${field} = ?`);
                    params.push(updates[field] === 'true');
                } else {
                    updateFields.push(`${field} = ?`);
                    params.push(updates[field]);
                }
            }
        }
        
        // Update slug if name changed
        if (updates.name) {
            updateFields.push('slug = ?');
            params.push(slugify(updates.name));
        }
        
        // Always update images if there are new ones
        if (req.files && req.files.length > 0) {
            updateFields.push('images = ?');
            params.push(JSON.stringify(images));
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        params.push(productId);
        
        await pool.execute(
            `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );
        
        res.json({
            success: true,
            message: 'Product updated successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Delete product (soft delete)
router.delete('/products/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        
        await pool.execute(
            'UPDATE products SET is_active = FALSE WHERE id = ?',
            [productId]
        );
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Order Management

// Get all orders (admin view)
router.get('/orders', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, search, date_from, date_to } = req.query;
        
        let query = `SELECT o.*, u.full_name, u.email 
                     FROM orders o 
                     JOIN users u ON o.user_id = u.id 
                     WHERE 1=1`;
        const params = [];
        
        if (status) {
            query += ' AND o.status = ?';
            params.push(status);
        }
        
        if (search) {
            query += ' AND (o.order_number LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (date_from) {
            query += ' AND o.created_at >= ?';
            params.push(date_from);
        }
        
        if (date_to) {
            query += ' AND o.created_at <= ?';
            params.push(date_to);
        }
        
        // Get total count
        const countQuery = query.replace('SELECT o.*, u.full_name, u.email', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        
        // Add sorting and pagination
        query += ' ORDER BY o.created_at DESC';
        const { limit: pageLimit, offset } = paginate(parseInt(page), parseInt(limit));
        query += ' LIMIT ? OFFSET ?';
        params.push(pageLimit, offset);
        
        const [orders] = await pool.execute(query, params);
        
        // Parse JSON fields
        orders.forEach(order => {
            order.shipping_address = JSON.parse(order.shipping_address || '{}');
            order.billing_address = JSON.parse(order.billing_address || '{}');
        });
        
        res.json({
            success: true,
            data: orders,
            meta: buildPaginationMeta(total, parseInt(page), pageLimit)
        });
        
    } catch (error) {
        next(error);
    }
});

// Update order status
router.put('/orders/:id/status', async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const { status, tracking_number } = req.body;
        
        const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const updates = ['status = ?'];
        const params = [status];
        
        if (tracking_number && status === 'shipped') {
            updates.push('tracking_number = ?');
            params.push(tracking_number);
        }
        
        params.push(orderId);
        
        await pool.execute(
            `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        
        // TODO: Send status update email to customer
        
        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// User Management

// Get all users
router.get('/users', async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, role } = req.query;
        
        let query = 'SELECT id, email, full_name, phone, role, is_verified, created_at FROM users WHERE 1=1';
        const params = [];
        
        if (search) {
            query += ' AND (email LIKE ? OR full_name LIKE ? OR phone LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }
        
        // Get total count
        const countQuery = query.replace('SELECT id, email, full_name, phone, role, is_verified, created_at', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        
        // Add pagination
        query += ' ORDER BY created_at DESC';
        const { limit: pageLimit, offset } = paginate(parseInt(page), parseInt(limit));
        query += ' LIMIT ? OFFSET ?';
        params.push(pageLimit, offset);
        
        const [users] = await pool.execute(query, params);
        
        res.json({
            success: true,
            data: users,
            meta: buildPaginationMeta(total, parseInt(page), pageLimit)
        });
        
    } catch (error) {
        next(error);
    }
});

// Category Management

// Get all categories
router.get('/categories', async (req, res, next) => {
    try {
        const [categories] = await pool.execute(
            'SELECT * FROM categories ORDER BY name'
        );
        
        res.json({
            success: true,
            data: categories
        });
        
    } catch (error) {
        next(error);
    }
});

// Create category
router.post('/categories', upload.single('category_image'), async (req, res, next) => {
    try {
        const { name, description, parent_id } = req.body;
        const slug = slugify(name);
        const image_url = req.file ? `/uploads/categories/${req.file.filename}` : null;
        
        const [result] = await pool.execute(
            'INSERT INTO categories (name, slug, description, parent_id, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, slug, description, parent_id || null, image_url]
        );
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { id: result.insertId, slug }
        });
        
    } catch (error) {
        next(error);
    }
});

// Reports

// Sales report
router.get('/reports/sales', async (req, res, next) => {
    try {
        const { date_from, date_to, group_by = 'day' } = req.query;
        
        let dateFormat;
        switch (group_by) {
            case 'month':
                dateFormat = '%Y-%m';
                break;
            case 'week':
                dateFormat = '%Y-%u';
                break;
            default:
                dateFormat = '%Y-%m-%d';
        }
        
        let query = `
            SELECT 
                DATE_FORMAT(created_at, '${dateFormat}') as period,
                COUNT(*) as order_count,
                SUM(total_amount) as revenue,
                AVG(total_amount) as avg_order_value
            FROM orders
            WHERE status NOT IN ('cancelled', 'refunded')
        `;
        
        const params = [];
        
        if (date_from) {
            query += ' AND created_at >= ?';
            params.push(date_from);
        }
        
        if (date_to) {
            query += ' AND created_at <= ?';
            params.push(date_to);
        }
        
        query += ' GROUP BY period ORDER BY period DESC';
        
        const [salesData] = await pool.execute(query, params);
        
        res.json({
            success: true,
            data: salesData
        });
        
    } catch (error) {
        next(error);
    }
});

// Inventory report
router.get('/reports/inventory', async (req, res, next) => {
    try {
        const [lowStock] = await pool.execute(
            `SELECT id, sku, name, quantity, 
                    CASE 
                        WHEN quantity = 0 THEN 'Out of Stock'
                        WHEN quantity < 10 THEN 'Low Stock'
                        ELSE 'In Stock'
                    END as stock_status
             FROM products 
             WHERE is_active = TRUE AND quantity < 20
             ORDER BY quantity ASC`
        );
        
        const [stockValue] = await pool.execute(
            `SELECT 
                SUM(quantity * cost) as total_value,
                SUM(quantity) as total_units,
                COUNT(*) as total_products
             FROM products 
             WHERE is_active = TRUE`
        );
        
        res.json({
            success: true,
            data: {
                lowStockProducts: lowStock,
                stockSummary: stockValue[0]
            }
        });
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;