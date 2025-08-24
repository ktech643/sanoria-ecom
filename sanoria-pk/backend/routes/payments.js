// ===== SANORIA.PK - Payment Routes =====

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../config/database');

// JazzCash configuration
const JAZZCASH_CONFIG = {
    merchantId: process.env.JAZZCASH_MERCHANT_ID || 'MC12345',
    password: process.env.JAZZCASH_PASSWORD || 'your-password',
    integritySalt: process.env.JAZZCASH_INTEGRITY_SALT || 'your-salt',
    returnUrl: process.env.JAZZCASH_RETURN_URL || 'http://localhost:5000/api/payments/jazzcash/callback',
    apiUrl: process.env.JAZZCASH_API_URL || 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction'
};

// EasyPaisa configuration
const EASYPAISA_CONFIG = {
    storeId: process.env.EASYPAISA_STORE_ID || 'store123',
    accountNum: process.env.EASYPAISA_ACCOUNT || '03001234567',
    hashKey: process.env.EASYPAISA_HASH_KEY || 'your-hash-key',
    returnUrl: process.env.EASYPAISA_RETURN_URL || 'http://localhost:5000/api/payments/easypaisa/callback',
    apiUrl: process.env.EASYPAISA_API_URL || 'https://easypay.easypaisa.com.pk/easypay/Index.jsf'
};

// Initialize payment for order
router.post('/initialize', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { order_id, payment_method } = req.body;
        
        // Get order details
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE id = ? AND user_id = ? AND payment_status = ?',
            [order_id, userId, 'pending']
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or already paid'
            });
        }
        
        const order = orders[0];
        
        // Handle different payment methods
        let paymentData;
        
        switch (payment_method) {
            case 'jazzcash':
                paymentData = await initializeJazzCash(order);
                break;
                
            case 'easypaisa':
                paymentData = await initializeEasyPaisa(order);
                break;
                
            case 'cod':
                // Cash on delivery - no payment gateway needed
                await pool.execute(
                    'UPDATE orders SET payment_method = ? WHERE id = ?',
                    ['cod', order_id]
                );
                
                return res.json({
                    success: true,
                    message: 'Cash on delivery selected',
                    data: {
                        payment_method: 'cod',
                        order_number: order.order_number
                    }
                });
                
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment method'
                });
        }
        
        // Update order with payment method
        await pool.execute(
            'UPDATE orders SET payment_method = ? WHERE id = ?',
            [payment_method, order_id]
        );
        
        res.json({
            success: true,
            data: paymentData
        });
        
    } catch (error) {
        next(error);
    }
});

// Initialize JazzCash payment
async function initializeJazzCash(order) {
    const txnRefNo = 'T' + Date.now();
    const txnDateTime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const txnExpiryDateTime = new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0];
    
    // Create secure hash
    const hashString = 
        JAZZCASH_CONFIG.integritySalt + '&' +
        Math.round(order.total_amount * 100) + '&' +
        'PKR&' +
        txnDateTime + '&' +
        txnExpiryDateTime + '&' +
        JAZZCASH_CONFIG.merchantId + '&' +
        order.order_number + '&' +
        JAZZCASH_CONFIG.password + '&' +
        txnRefNo + '&' +
        '1';
    
    const secureHash = crypto.createHash('sha256').update(hashString).digest('hex');
    
    // Prepare payment form data
    const paymentData = {
        pp_Version: '1.1',
        pp_TxnType: 'MWALLET',
        pp_Language: 'EN',
        pp_MerchantID: JAZZCASH_CONFIG.merchantId,
        pp_Password: JAZZCASH_CONFIG.password,
        pp_TxnRefNo: txnRefNo,
        pp_Amount: Math.round(order.total_amount * 100),
        pp_TxnCurrency: 'PKR',
        pp_TxnDateTime: txnDateTime,
        pp_BillReference: order.order_number,
        pp_Description: 'Payment for Order ' + order.order_number,
        pp_TxnExpiryDateTime: txnExpiryDateTime,
        pp_ReturnURL: JAZZCASH_CONFIG.returnUrl,
        pp_SecureHash: secureHash,
        pp_MobileNumber: '',
        pp_CNIC: '',
        ppmpf_1: '1',
        ppmpf_2: '2',
        ppmpf_3: '3',
        ppmpf_4: '4',
        ppmpf_5: '5'
    };
    
    return {
        payment_method: 'jazzcash',
        payment_url: JAZZCASH_CONFIG.apiUrl,
        payment_data: paymentData
    };
}

// Initialize EasyPaisa payment
async function initializeEasyPaisa(order) {
    const orderId = order.order_number;
    const amount = order.total_amount.toFixed(2);
    const txnDateTime = new Date().toISOString();
    
    // Create hash
    const hashString = 
        EASYPAISA_CONFIG.storeId + 
        orderId + 
        txnDateTime + 
        amount + 
        EASYPAISA_CONFIG.hashKey;
    
    const hash = crypto.createHash('sha256').update(hashString).digest('hex');
    
    // Prepare payment data
    const paymentData = {
        storeId: EASYPAISA_CONFIG.storeId,
        amount: amount,
        postBackURL: EASYPAISA_CONFIG.returnUrl,
        orderRefNum: orderId,
        expiryDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        autoRedirect: '1',
        paymentMethod: 'MA_PAYMENT_METHOD',
        emailAddr: '', // Will be filled by user
        mobileNum: '', // Will be filled by user
        hash: hash
    };
    
    return {
        payment_method: 'easypaisa',
        payment_url: EASYPAISA_CONFIG.apiUrl,
        payment_data: paymentData
    };
}

// JazzCash callback
router.post('/jazzcash/callback', async (req, res, next) => {
    try {
        const {
            pp_ResponseCode,
            pp_ResponseMessage,
            pp_TxnRefNo,
            pp_BillReference,
            pp_SecureHash
        } = req.body;
        
        // Verify secure hash
        // In production, implement proper hash verification
        
        // Get order
        const [orders] = await pool.execute(
            'SELECT id FROM orders WHERE order_number = ?',
            [pp_BillReference]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const orderId = orders[0].id;
        
        if (pp_ResponseCode === '000') {
            // Payment successful
            await pool.execute(
                'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
                ['paid', 'processing', orderId]
            );
            
            // Create payment record
            await pool.execute(
                `INSERT INTO payment_transactions 
                 (order_id, payment_method, transaction_id, amount, status, response_data) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, 'jazzcash', pp_TxnRefNo, req.body.pp_Amount / 100, 'completed', JSON.stringify(req.body)]
            );
            
            res.redirect(`${process.env.FRONTEND_URL}/payment/success?order=${pp_BillReference}`);
        } else {
            // Payment failed
            await pool.execute(
                `INSERT INTO payment_transactions 
                 (order_id, payment_method, transaction_id, amount, status, response_data) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, 'jazzcash', pp_TxnRefNo, req.body.pp_Amount / 100, 'failed', JSON.stringify(req.body)]
            );
            
            res.redirect(`${process.env.FRONTEND_URL}/payment/failed?order=${pp_BillReference}&reason=${pp_ResponseMessage}`);
        }
        
    } catch (error) {
        next(error);
    }
});

// EasyPaisa callback
router.post('/easypaisa/callback', async (req, res, next) => {
    try {
        const {
            status,
            orderRefNumber,
            transactionRefNumber,
            amount,
            hash
        } = req.body;
        
        // Verify hash
        // In production, implement proper hash verification
        
        // Get order
        const [orders] = await pool.execute(
            'SELECT id FROM orders WHERE order_number = ?',
            [orderRefNumber]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        const orderId = orders[0].id;
        
        if (status === 'Success' || status === '0000') {
            // Payment successful
            await pool.execute(
                'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
                ['paid', 'processing', orderId]
            );
            
            // Create payment record
            await pool.execute(
                `INSERT INTO payment_transactions 
                 (order_id, payment_method, transaction_id, amount, status, response_data) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, 'easypaisa', transactionRefNumber, amount, 'completed', JSON.stringify(req.body)]
            );
            
            res.redirect(`${process.env.FRONTEND_URL}/payment/success?order=${orderRefNumber}`);
        } else {
            // Payment failed
            await pool.execute(
                `INSERT INTO payment_transactions 
                 (order_id, payment_method, transaction_id, amount, status, response_data) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, 'easypaisa', transactionRefNumber, amount, 'failed', JSON.stringify(req.body)]
            );
            
            res.redirect(`${process.env.FRONTEND_URL}/payment/failed?order=${orderRefNumber}`);
        }
        
    } catch (error) {
        next(error);
    }
});

// Get payment status
router.get('/status/:orderNumber', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { orderNumber } = req.params;
        
        // Get order with payment info
        const [orders] = await pool.execute(
            `SELECT o.payment_status, o.payment_method, o.total_amount,
                    t.transaction_id, t.status as txn_status, t.created_at as payment_date
             FROM orders o
             LEFT JOIN payment_transactions t ON o.id = t.order_id
             WHERE o.order_number = ? AND o.user_id = ?
             ORDER BY t.created_at DESC
             LIMIT 1`,
            [orderNumber, userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            data: orders[0]
        });
        
    } catch (error) {
        next(error);
    }
});

// Refund request
router.post('/refund', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { order_number, reason } = req.body;
        
        // Get order
        const [orders] = await pool.execute(
            `SELECT id, payment_status, total_amount, created_at 
             FROM orders 
             WHERE order_number = ? AND user_id = ? AND payment_status = ?`,
            [order_number, userId, 'paid']
        );
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or not eligible for refund'
            });
        }
        
        const order = orders[0];
        
        // Check if within refund period (14 days)
        const daysSinceOrder = Math.floor((Date.now() - new Date(order.created_at)) / (1000 * 60 * 60 * 24));
        if (daysSinceOrder > 14) {
            return res.status(400).json({
                success: false,
                message: 'Refund period has expired (14 days)'
            });
        }
        
        // Create refund request
        await pool.execute(
            `INSERT INTO refund_requests 
             (order_id, amount, reason, status) 
             VALUES (?, ?, ?, ?)`,
            [order.id, order.total_amount, reason, 'pending']
        );
        
        // Update order status
        await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['refund_requested', order.id]
        );
        
        res.json({
            success: true,
            message: 'Refund request submitted successfully'
        });
        
    } catch (error) {
        next(error);
    }
});

// Create payment transactions table in migrations
const createPaymentTransactionsTable = `
    CREATE TABLE IF NOT EXISTS payment_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        transaction_id VARCHAR(100),
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        response_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        INDEX idx_transaction_id (transaction_id),
        INDEX idx_order_id (order_id)
    )
`;

// Create refund requests table
const createRefundRequestsTable = `
    CREATE TABLE IF NOT EXISTS refund_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        reason TEXT,
        status ENUM('pending', 'approved', 'rejected', 'processed') DEFAULT 'pending',
        admin_notes TEXT,
        processed_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        INDEX idx_order_id (order_id),
        INDEX idx_status (status)
    )
`;

module.exports = router;