// ===== SANORIA.PK - Shipping Routes =====

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { calculateShipping } = require('../utils/helpers');
const axios = require('axios');

// Shipping partner configurations
const SHIPPING_PARTNERS = {
    leopard: {
        name: 'Leopard Courier',
        apiUrl: process.env.LEOPARD_API_URL || 'https://api.leopards.com.pk',
        apiKey: process.env.LEOPARD_API_KEY,
        logo: '/images/leopard.png'
    },
    tcs: {
        name: 'TCS',
        apiUrl: process.env.TCS_API_URL || 'https://api.tcs.com.pk',
        apiKey: process.env.TCS_API_KEY,
        logo: '/images/tcs.png'
    },
    pkdex: {
        name: 'PkDex',
        apiUrl: process.env.PKDEX_API_URL || 'https://api.pkdex.com',
        apiKey: process.env.PKDEX_API_KEY,
        logo: '/images/pkdex.png'
    }
};

// Calculate shipping rates
router.post('/calculate', async (req, res, next) => {
    try {
        const {
            destination_city,
            destination_state,
            weight = 0.5,
            items = []
        } = req.body;
        
        if (!destination_city) {
            return res.status(400).json({
                success: false,
                message: 'Destination city is required'
            });
        }
        
        // Calculate total weight if items provided
        let totalWeight = weight;
        if (items.length > 0) {
            totalWeight = items.reduce((sum, item) => {
                return sum + ((item.weight || 0.5) * (item.quantity || 1));
            }, 0);
        }
        
        // Get shipping rates from different partners
        const shippingOptions = [];
        
        // Standard shipping rates
        const standardRate = calculateShipping(totalWeight, destination_city, 'standard');
        shippingOptions.push({
            partner: 'standard',
            name: 'Standard Delivery',
            description: '3-5 business days',
            rate: standardRate,
            estimatedDays: '3-5',
            icon: 'fa-truck'
        });
        
        // Express shipping rates
        const expressRate = calculateShipping(totalWeight, destination_city, 'express');
        shippingOptions.push({
            partner: 'express',
            name: 'Express Delivery',
            description: '1-2 business days',
            rate: expressRate,
            estimatedDays: '1-2',
            icon: 'fa-shipping-fast'
        });
        
        // Try to get real rates from shipping partners (if APIs are configured)
        for (const [key, partner] of Object.entries(SHIPPING_PARTNERS)) {
            if (partner.apiKey) {
                try {
                    const partnerRate = await getPartnerShippingRate(
                        key,
                        destination_city,
                        totalWeight
                    );
                    
                    if (partnerRate) {
                        shippingOptions.push({
                            partner: key,
                            name: partner.name,
                            description: partnerRate.description,
                            rate: partnerRate.rate,
                            estimatedDays: partnerRate.estimatedDays,
                            logo: partner.logo
                        });
                    }
                } catch (error) {
                    console.error(`Error getting ${key} rates:`, error.message);
                }
            }
        }
        
        // Sort by rate
        shippingOptions.sort((a, b) => a.rate - b.rate);
        
        res.json({
            success: true,
            data: {
                destination: {
                    city: destination_city,
                    state: destination_state || 'Punjab'
                },
                weight: totalWeight,
                options: shippingOptions
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Get partner shipping rate (mock implementation)
async function getPartnerShippingRate(partner, city, weight) {
    // In production, this would make actual API calls to shipping partners
    // For now, return mock data
    
    const mockRates = {
        leopard: {
            karachi: 180,
            lahore: 180,
            islamabad: 220,
            other: 280
        },
        tcs: {
            karachi: 200,
            lahore: 200,
            islamabad: 250,
            other: 300
        },
        pkdex: {
            karachi: 170,
            lahore: 170,
            islamabad: 210,
            other: 270
        }
    };
    
    const cityLower = city.toLowerCase();
    let baseRate = mockRates[partner].other;
    
    if (cityLower.includes('karachi')) {
        baseRate = mockRates[partner].karachi;
    } else if (cityLower.includes('lahore')) {
        baseRate = mockRates[partner].lahore;
    } else if (cityLower.includes('islamabad')) {
        baseRate = mockRates[partner].islamabad;
    }
    
    // Add weight charges
    const weightCharge = Math.max(0, weight - 1) * 50;
    const totalRate = baseRate + weightCharge;
    
    return {
        rate: totalRate,
        description: `Delivery by ${SHIPPING_PARTNERS[partner].name}`,
        estimatedDays: partner === 'pkdex' ? '2-4' : '3-5'
    };
}

// Create shipping label
router.post('/create-label', authenticateToken, async (req, res, next) => {
    try {
        const {
            order_id,
            shipping_partner,
            pickup_address,
            delivery_address
        } = req.body;
        
        // Get order details
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [order_id, req.user.id]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const order = orders[0];
        
        // Mock shipping label creation
        // In production, this would integrate with actual shipping APIs
        const trackingNumber = generateTrackingNumber(shipping_partner);
        
        // Update order with tracking info
        await pool.execute(
            'UPDATE orders SET tracking_number = ?, shipping_method = ? WHERE id = ?',
            [trackingNumber, shipping_partner, order_id]
        );
        
        // Create shipping record
        await pool.execute(
            `INSERT INTO shipping_labels 
             (order_id, shipping_partner, tracking_number, pickup_address, delivery_address, status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                order_id,
                shipping_partner,
                trackingNumber,
                JSON.stringify(pickup_address),
                JSON.stringify(delivery_address),
                'created'
            ]
        );
        
        res.json({
            success: true,
            data: {
                trackingNumber,
                shippingPartner: shipping_partner,
                labelUrl: `/api/shipping/label/${trackingNumber}`,
                estimatedDelivery: calculateEstimatedDelivery(shipping_partner)
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// Track shipment
router.get('/track/:trackingNumber', async (req, res, next) => {
    try {
        const { trackingNumber } = req.params;
        
        // Get shipping info
        const [shipments] = await pool.execute(
            `SELECT s.*, o.order_number 
             FROM shipping_labels s 
             JOIN orders o ON s.order_id = o.id 
             WHERE s.tracking_number = ?`,
            [trackingNumber]
        );
        
        if (shipments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tracking number not found'
            });
        }
        
        const shipment = shipments[0];
        
        // Mock tracking data
        // In production, this would call the actual shipping partner API
        const trackingData = generateMockTrackingData(shipment);
        
        res.json({
            success: true,
            data: trackingData
        });
        
    } catch (error) {
        next(error);
    }
});

// Get available cities for shipping
router.get('/cities', async (req, res, next) => {
    try {
        const { search } = req.query;
        
        // Major cities in Pakistan
        let cities = [
            { name: 'Karachi', state: 'Sindh' },
            { name: 'Lahore', state: 'Punjab' },
            { name: 'Islamabad', state: 'Federal' },
            { name: 'Rawalpindi', state: 'Punjab' },
            { name: 'Faisalabad', state: 'Punjab' },
            { name: 'Multan', state: 'Punjab' },
            { name: 'Peshawar', state: 'KPK' },
            { name: 'Quetta', state: 'Balochistan' },
            { name: 'Sialkot', state: 'Punjab' },
            { name: 'Gujranwala', state: 'Punjab' },
            { name: 'Hyderabad', state: 'Sindh' },
            { name: 'Sukkur', state: 'Sindh' },
            { name: 'Bahawalpur', state: 'Punjab' },
            { name: 'Sargodha', state: 'Punjab' },
            { name: 'Abbottabad', state: 'KPK' },
            { name: 'Mardan', state: 'KPK' },
            { name: 'Rahim Yar Khan', state: 'Punjab' },
            { name: 'Sahiwal', state: 'Punjab' },
            { name: 'Okara', state: 'Punjab' },
            { name: 'Wah Cantt', state: 'Punjab' },
            { name: 'Dera Ghazi Khan', state: 'Punjab' },
            { name: 'Mirpur Khas', state: 'Sindh' },
            { name: 'Nawabshah', state: 'Sindh' },
            { name: 'Mingora', state: 'KPK' },
            { name: 'Chiniot', state: 'Punjab' },
            { name: 'Kamoke', state: 'Punjab' },
            { name: 'Mandi Bahauddin', state: 'Punjab' },
            { name: 'Jhelum', state: 'Punjab' },
            { name: 'Sadiqabad', state: 'Punjab' },
            { name: 'Khanewal', state: 'Punjab' },
            { name: 'Hafizabad', state: 'Punjab' },
            { name: 'Kohat', state: 'KPK' },
            { name: 'Jacobabad', state: 'Sindh' },
            { name: 'Shikarpur', state: 'Sindh' },
            { name: 'Muzaffargarh', state: 'Punjab' },
            { name: 'Khanpur', state: 'Punjab' },
            { name: 'Gojra', state: 'Punjab' },
            { name: 'Bahawalnagar', state: 'Punjab' },
            { name: 'Muridke', state: 'Punjab' },
            { name: 'Pak Pattan', state: 'Punjab' },
            { name: 'Jaranwala', state: 'Punjab' },
            { name: 'Chishtian', state: 'Punjab' },
            { name: 'Daska', state: 'Punjab' },
            { name: 'Mian Channu', state: 'Punjab' },
            { name: 'Tando Adam', state: 'Sindh' },
            { name: 'Vehari', state: 'Punjab' },
            { name: 'Nowshera', state: 'KPK' },
            { name: 'Swabi', state: 'KPK' },
            { name: 'Charsadda', state: 'KPK' },
            { name: 'Kandhkot', state: 'Sindh' },
            { name: 'Hasilpur', state: 'Punjab' },
            { name: 'Attock', state: 'Punjab' },
            { name: 'Muzaffarabad', state: 'AJK' },
            { name: 'Gilgit', state: 'Gilgit-Baltistan' }
        ];
        
        // Filter by search term if provided
        if (search) {
            cities = cities.filter(city => 
                city.name.toLowerCase().includes(search.toLowerCase()) ||
                city.state.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        res.json({
            success: true,
            data: cities
        });
        
    } catch (error) {
        next(error);
    }
});

// Helper functions
function generateTrackingNumber(partner) {
    const prefix = partner.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

function calculateEstimatedDelivery(partner) {
    const days = partner === 'express' ? 2 : 4;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toISOString().split('T')[0];
}

function generateMockTrackingData(shipment) {
    const statuses = [
        {
            status: 'Order Placed',
            description: 'Your order has been placed',
            timestamp: shipment.created_at,
            location: 'Karachi',
            completed: true
        },
        {
            status: 'Picked Up',
            description: 'Package picked up by courier',
            timestamp: new Date(shipment.created_at).setHours(+24),
            location: 'Karachi Hub',
            completed: true
        },
        {
            status: 'In Transit',
            description: 'Package is on the way',
            timestamp: new Date(shipment.created_at).setHours(+48),
            location: 'Sorting Facility',
            completed: shipment.status !== 'created'
        },
        {
            status: 'Out for Delivery',
            description: 'Package is out for delivery',
            timestamp: new Date(shipment.created_at).setHours(+72),
            location: 'Local Hub',
            completed: shipment.status === 'delivered'
        },
        {
            status: 'Delivered',
            description: 'Package delivered successfully',
            timestamp: new Date(shipment.created_at).setHours(+96),
            location: 'Customer Address',
            completed: shipment.status === 'delivered'
        }
    ];
    
    return {
        trackingNumber: shipment.tracking_number,
        orderNumber: shipment.order_number,
        shippingPartner: shipment.shipping_partner,
        currentStatus: shipment.status,
        estimatedDelivery: calculateEstimatedDelivery(shipment.shipping_partner),
        timeline: statuses
    };
}

// Create shipping labels table
const createShippingLabelsTable = `
    CREATE TABLE IF NOT EXISTS shipping_labels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        shipping_partner VARCHAR(50) NOT NULL,
        tracking_number VARCHAR(100) UNIQUE NOT NULL,
        pickup_address JSON,
        delivery_address JSON,
        label_url VARCHAR(500),
        status ENUM('created', 'printed', 'picked_up', 'in_transit', 'delivered', 'cancelled') DEFAULT 'created',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        INDEX idx_tracking (tracking_number),
        INDEX idx_order (order_id),
        INDEX idx_status (status)
    )
`;

module.exports = router;