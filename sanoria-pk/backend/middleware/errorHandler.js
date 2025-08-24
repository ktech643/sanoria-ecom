// ===== SANORIA.PK - Error Handler Middleware =====

function errorHandler(err, req, res, next) {
    // Log error
    console.error('Error:', err);
    
    // Default error
    let status = err.status || 500;
    let message = err.message || 'Internal server error';
    
    // Handle specific errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation error';
    } else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized';
    } else if (err.code === 'ER_DUP_ENTRY') {
        status = 409;
        message = 'Duplicate entry';
    }
    
    // Send error response
    res.status(status).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
}

module.exports = errorHandler;