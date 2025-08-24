// ===== SANORIA.PK - QR Code Utilities =====

const QRCode = require('qrcode');

// Generate QR code for various purposes
async function generateQRCode(data, options = {}) {
    const defaultOptions = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
            dark: '#1a1a1a',
            light: '#FFFFFF'
        },
        width: 256
    };
    
    const qrOptions = { ...defaultOptions, ...options };
    
    try {
        const qrCodeDataURL = await QRCode.toDataURL(data, qrOptions);
        return qrCodeDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

// Generate product QR code
async function generateProductQR(product) {
    const baseUrl = process.env.FRONTEND_URL || 'https://sanoria.pk';
    const productUrl = `${baseUrl}/products/${product.slug}`;
    
    const qrData = {
        type: 'product',
        id: product.id,
        name: product.name,
        url: productUrl,
        price: product.price
    };
    
    return await generateQRCode(JSON.stringify(qrData));
}

// Generate order QR code
async function generateOrderQR(order) {
    const baseUrl = process.env.FRONTEND_URL || 'https://sanoria.pk';
    const trackingUrl = `${baseUrl}/orders/track/${order.order_number}`;
    
    const qrData = {
        type: 'order',
        orderNumber: order.order_number,
        url: trackingUrl,
        amount: order.total_amount,
        date: order.created_at
    };
    
    return await generateQRCode(JSON.stringify(qrData));
}

// Generate promotion QR code
async function generatePromotionQR(promotion) {
    const baseUrl = process.env.FRONTEND_URL || 'https://sanoria.pk';
    const promoUrl = `${baseUrl}/apply-promo/${promotion.code}`;
    
    const qrData = {
        type: 'promotion',
        code: promotion.code,
        discount: promotion.discount_value,
        discountType: promotion.discount_type,
        url: promoUrl,
        validUntil: promotion.valid_until
    };
    
    return await generateQRCode(JSON.stringify(qrData));
}

// Generate user verification QR code
async function generateVerificationQR(userId, verificationCode) {
    const baseUrl = process.env.FRONTEND_URL || 'https://sanoria.pk';
    const verifyUrl = `${baseUrl}/verify?user=${userId}&code=${verificationCode}`;
    
    const qrData = {
        type: 'verification',
        userId: userId,
        code: verificationCode,
        url: verifyUrl
    };
    
    return await generateQRCode(JSON.stringify(qrData));
}

// Parse QR code data
function parseQRCodeData(qrString) {
    try {
        const data = JSON.parse(qrString);
        
        if (!data.type) {
            throw new Error('Invalid QR code format');
        }
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: 'Invalid QR code data'
        };
    }
}

// Validate promotion QR code
async function validatePromotionQR(qrData, userId) {
    try {
        const parsed = parseQRCodeData(qrData);
        if (!parsed.success || parsed.data.type !== 'promotion') {
            return {
                valid: false,
                message: 'Invalid promotion QR code'
            };
        }
        
        const promoData = parsed.data;
        
        // Check if promotion is still valid
        if (promoData.validUntil && new Date(promoData.validUntil) < new Date()) {
            return {
                valid: false,
                message: 'Promotion has expired'
            };
        }
        
        // Check if user has already used this promotion
        // (Add database check here)
        
        return {
            valid: true,
            code: promoData.code,
            discount: promoData.discount,
            discountType: promoData.discountType
        };
    } catch (error) {
        return {
            valid: false,
            message: 'Error validating QR code'
        };
    }
}

module.exports = {
    generateQRCode,
    generateProductQR,
    generateOrderQR,
    generatePromotionQR,
    generateVerificationQR,
    parseQRCodeData,
    validatePromotionQR
};