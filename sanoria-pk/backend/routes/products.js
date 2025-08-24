// ===== SANORIA.PK - Product Routes =====

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');
const { paginate, buildPaginationMeta, slugify } = require('../utils/helpers');

// Get all products
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            skinType,
            minPrice,
            maxPrice,
            search,
            sort = 'created_at',
            order = 'DESC'
        } = req.query;
        
        // Build query
        let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = TRUE';
        const params = [];
        
        // Add filters
        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }
        
        if (skinType) {
            query += ' AND JSON_CONTAINS(p.skin_types, ?)';
            params.push(`"${skinType}"`);
        }
        
        if (minPrice) {
            query += ' AND p.price >= ?';
            params.push(parseFloat(minPrice));
        }
        
        if (maxPrice) {
            query += ' AND p.price <= ?';
            params.push(parseFloat(maxPrice));
        }
        
        if (search) {
            query += ' AND MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE)';
            params.push(search);
        }
        
        // Get total count
        const countQuery = query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        
        // Add sorting
        const allowedSorts = ['created_at', 'price', 'name', 'rating'];
        const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        query += ` ORDER BY p.${sortField} ${sortOrder}`;
        
        // Add pagination
        const { limit: pageLimit, offset } = paginate(parseInt(page), parseInt(limit));
        query += ' LIMIT ? OFFSET ?';
        params.push(pageLimit, offset);
        
        // Execute query
        const [products] = await pool.execute(query, params);
        
        // Parse JSON fields
        products.forEach(product => {
            product.skin_types = JSON.parse(product.skin_types || '[]');
            product.tags = JSON.parse(product.tags || '[]');
            product.images = JSON.parse(product.images || '[]');
            product.dimensions = JSON.parse(product.dimensions || '{}');
        });
        
        // Get ratings for products
        if (products.length > 0) {
            const productIds = products.map(p => p.id);
            const placeholders = productIds.map(() => '?').join(',');
            const [ratings] = await pool.execute(
                `SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count 
                 FROM product_reviews 
                 WHERE product_id IN (${placeholders}) 
                 GROUP BY product_id`,
                productIds
            );
            
            // Add ratings to products
            const ratingsMap = ratings.reduce((acc, r) => {
                acc[r.product_id] = {
                    rating: parseFloat(r.avg_rating).toFixed(1),
                    reviews: r.review_count
                };
                return acc;
            }, {});
            
            products.forEach(product => {
                product.rating = ratingsMap[product.id]?.rating || 0;
                product.reviews = ratingsMap[product.id]?.reviews || 0;
            });
        }
        
        res.json({
            success: true,
            data: products,
            meta: buildPaginationMeta(total, parseInt(page), pageLimit)
        });
        
    } catch (error) {
        next(error);
    }
});

// Get single product
router.get('/:slug', optionalAuth, async (req, res, next) => {
    try {
        const { slug } = req.params;
        
        // Get product
        const [products] = await pool.execute(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.slug = ? AND p.is_active = TRUE`,
            [slug]
        );
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const product = products[0];
        
        // Parse JSON fields
        product.skin_types = JSON.parse(product.skin_types || '[]');
        product.tags = JSON.parse(product.tags || '[]');
        product.images = JSON.parse(product.images || '[]');
        product.dimensions = JSON.parse(product.dimensions || '{}');
        
        // Get product rating
        const [ratings] = await pool.execute(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM product_reviews WHERE product_id = ?',
            [product.id]
        );
        
        product.rating = parseFloat(ratings[0].avg_rating || 0).toFixed(1);
        product.reviews = ratings[0].review_count || 0;
        
        // Get related products
        const [relatedProducts] = await pool.execute(
            `SELECT id, name, slug, price, compare_price, images 
             FROM products 
             WHERE category_id = ? AND id != ? AND is_active = TRUE 
             LIMIT 4`,
            [product.category_id, product.id]
        );
        
        relatedProducts.forEach(p => {
            p.images = JSON.parse(p.images || '[]');
        });
        
        // Track view (if user is logged in)
        if (req.user) {
            // Add to recently viewed or increment view count
        }
        
        res.json({
            success: true,
            data: {
                product,
                relatedProducts
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Get product reviews
router.get('/:slug/reviews', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // Get product ID from slug
        const [products] = await pool.execute(
            'SELECT id FROM products WHERE slug = ?',
            [slug]
        );
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const productId = products[0].id;
        
        // Get total count
        const [countResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM product_reviews WHERE product_id = ?',
            [productId]
        );
        const total = countResult[0].total;
        
        // Get reviews with user info
        const { limit: pageLimit, offset } = paginate(parseInt(page), parseInt(limit));
        const [reviews] = await pool.execute(
            `SELECT r.*, u.full_name 
             FROM product_reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC 
             LIMIT ? OFFSET ?`,
            [productId, pageLimit, offset]
        );
        
        // Get rating breakdown
        const [ratingBreakdown] = await pool.execute(
            `SELECT rating, COUNT(*) as count 
             FROM product_reviews 
             WHERE product_id = ? 
             GROUP BY rating`,
            [productId]
        );
        
        res.json({
            success: true,
            data: {
                reviews,
                ratingBreakdown: ratingBreakdown.reduce((acc, r) => {
                    acc[r.rating] = r.count;
                    return acc;
                }, {})
            },
            meta: buildPaginationMeta(total, parseInt(page), pageLimit)
        });
        
    } catch (error) {
        next(error);
    }
});

// Get products by skin type
router.get('/skin-type/:skinType', async (req, res, next) => {
    try {
        const { skinType } = req.params;
        const { page = 1, limit = 20 } = req.query;
        
        // Validate skin type
        const validSkinTypes = ['dry', 'oily', 'combination', 'sensitive', 'normal'];
        if (!validSkinTypes.includes(skinType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid skin type'
            });
        }
        
        // Get products for skin type
        const { limit: pageLimit, offset } = paginate(parseInt(page), parseInt(limit));
        const [products] = await pool.execute(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.is_active = TRUE 
             AND (JSON_CONTAINS(p.skin_types, ?) OR JSON_CONTAINS(p.skin_types, '"all"'))
             ORDER BY p.is_featured DESC, p.created_at DESC
             LIMIT ? OFFSET ?`,
            [`"${skinType}"`, pageLimit, offset]
        );
        
        // Parse JSON fields
        products.forEach(product => {
            product.skin_types = JSON.parse(product.skin_types || '[]');
            product.tags = JSON.parse(product.tags || '[]');
            product.images = JSON.parse(product.images || '[]');
        });
        
        res.json({
            success: true,
            data: products,
            skinType: skinType
        });
        
    } catch (error) {
        next(error);
    }
});

// Get featured products
router.get('/featured/list', async (req, res, next) => {
    try {
        const [products] = await pool.execute(
            `SELECT id, name, slug, price, compare_price, images, tags 
             FROM products 
             WHERE is_active = TRUE AND is_featured = TRUE 
             ORDER BY RAND() 
             LIMIT 8`
        );
        
        // Parse JSON fields
        products.forEach(product => {
            product.images = JSON.parse(product.images || '[]');
            product.tags = JSON.parse(product.tags || '[]');
        });
        
        res.json({
            success: true,
            data: products
        });
        
    } catch (error) {
        next(error);
    }
});

// Get new arrivals
router.get('/new/arrivals', async (req, res, next) => {
    try {
        const [products] = await pool.execute(
            `SELECT id, name, slug, price, compare_price, images, created_at 
             FROM products 
             WHERE is_active = TRUE 
             ORDER BY created_at DESC 
             LIMIT 12`
        );
        
        // Parse JSON fields
        products.forEach(product => {
            product.images = JSON.parse(product.images || '[]');
            product.isNew = (new Date() - new Date(product.created_at)) < (7 * 24 * 60 * 60 * 1000); // 7 days
        });
        
        res.json({
            success: true,
            data: products
        });
        
    } catch (error) {
        next(error);
    }
});

// Get best sellers (most ordered products)
router.get('/best/sellers', async (req, res, next) => {
    try {
        const [products] = await pool.execute(
            `SELECT p.id, p.name, p.slug, p.price, p.compare_price, p.images, 
                    COUNT(oi.id) as order_count, SUM(oi.quantity) as total_sold
             FROM products p
             JOIN order_items oi ON p.id = oi.product_id
             JOIN orders o ON oi.order_id = o.id
             WHERE p.is_active = TRUE 
             AND o.status IN ('delivered', 'shipped')
             AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
             GROUP BY p.id
             ORDER BY total_sold DESC
             LIMIT 8`
        );
        
        // Parse JSON fields
        products.forEach(product => {
            product.images = JSON.parse(product.images || '[]');
        });
        
        res.json({
            success: true,
            data: products
        });
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;