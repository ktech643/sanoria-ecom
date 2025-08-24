// ===== SANORIA.PK - Helper Utilities =====

// Generate random verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate order number
function generateOrderNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
}

// Generate SKU
function generateSKU(productName, categoryId) {
    const namePart = productName.substring(0, 3).toUpperCase();
    const categoryPart = categoryId ? categoryId.toString().padStart(3, '0') : '000';
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${namePart}-${categoryPart}-${random}`;
}

// Slugify text
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

// Calculate discount percentage
function calculateDiscountPercentage(originalPrice, salePrice) {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) {
        return 0;
    }
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// Format currency
function formatCurrency(amount, currency = 'PKR') {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Validate Pakistani phone number
function validatePakistaniPhone(phone) {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    
    // Pakistani phone number patterns
    const patterns = [
        /^03\d{9}$/,           // 03XX-XXXXXXX
        /^\+923\d{9}$/,        // +923XX-XXXXXXX
        /^00923\d{9}$/,        // 00923XX-XXXXXXX
        /^923\d{9}$/           // 923XX-XXXXXXX
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
}

// Normalize Pakistani phone number
function normalizePakistaniPhone(phone) {
    const cleaned = phone.replace(/[\s-]/g, '');
    
    if (cleaned.startsWith('03')) {
        return '+92' + cleaned.substring(1);
    } else if (cleaned.startsWith('00923')) {
        return '+' + cleaned.substring(2);
    } else if (cleaned.startsWith('923')) {
        return '+' + cleaned;
    } else if (cleaned.startsWith('+923')) {
        return cleaned;
    }
    
    return cleaned;
}

// Calculate shipping cost
function calculateShipping(weight, city, method = 'standard') {
    const baseRates = {
        standard: {
            karachi: 150,
            lahore: 150,
            islamabad: 200,
            other: 250
        },
        express: {
            karachi: 250,
            lahore: 250,
            islamabad: 350,
            other: 400
        }
    };
    
    const cityLower = city.toLowerCase();
    let rate = baseRates[method].other;
    
    if (cityLower.includes('karachi')) {
        rate = baseRates[method].karachi;
    } else if (cityLower.includes('lahore')) {
        rate = baseRates[method].lahore;
    } else if (cityLower.includes('islamabad')) {
        rate = baseRates[method].islamabad;
    }
    
    // Add weight-based charges (per kg after first kg)
    const additionalWeight = Math.max(0, weight - 1);
    const weightCharge = additionalWeight * 50;
    
    return rate + weightCharge;
}

// Paginate results
function paginate(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return {
        limit: Math.min(limit, 100), // Max 100 items per page
        offset
    };
}

// Build pagination metadata
function buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
}

// Sanitize HTML
function sanitizeHtml(html) {
    // Basic HTML sanitization (in production, use a proper library like DOMPurify)
    return html
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Generate QR code data
function generateQRData(type, data) {
    const baseUrl = process.env.FRONTEND_URL || 'https://sanoria.pk';
    
    switch (type) {
        case 'product':
            return `${baseUrl}/products/${data.slug}`;
        case 'order':
            return `${baseUrl}/orders/${data.orderNumber}`;
        case 'promotion':
            return `${baseUrl}/promotions/${data.code}`;
        default:
            return baseUrl;
    }
}

module.exports = {
    generateVerificationCode,
    generateOrderNumber,
    generateSKU,
    slugify,
    calculateDiscountPercentage,
    formatCurrency,
    validatePakistaniPhone,
    normalizePakistaniPhone,
    calculateShipping,
    paginate,
    buildPaginationMeta,
    sanitizeHtml,
    generateQRData
};