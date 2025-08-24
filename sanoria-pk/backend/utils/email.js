// ===== SANORIA.PK - Email Utilities =====

const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'noreply@sanoria.pk',
        pass: process.env.SMTP_PASS || 'your-email-password'
    }
});

// Email templates
const emailTemplates = {
    verification: (code) => ({
        subject: 'Verify Your Email - Sanoria.pk',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%); padding: 30px; text-align: center; }
                    .logo { font-size: 36px; font-weight: bold; color: #1a1a1a; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .code-box { background: #fff; border: 2px solid #D4AF37; padding: 20px; text-align: center; margin: 20px 0; }
                    .code { font-size: 32px; font-weight: bold; color: #D4AF37; letter-spacing: 5px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Sanoria.pk</div>
                        <p style="color: #666; margin: 10px 0 0 0;">Premium Beauty & Skincare</p>
                    </div>
                    <div class="content">
                        <h2>Welcome to Sanoria!</h2>
                        <p>Thank you for creating an account with us. To complete your registration, please verify your email address using the code below:</p>
                        <div class="code-box">
                            <div class="code">${code}</div>
                        </div>
                        <p>This code will expire in 1 hour. If you didn't create an account with Sanoria, please ignore this email.</p>
                        <p>Best regards,<br>The Sanoria Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Sanoria.pk. All rights reserved.</p>
                        <p>Follow us on social media for exclusive offers!</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),
    
    passwordReset: (token) => ({
        subject: 'Password Reset Request - Sanoria.pk',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%); padding: 30px; text-align: center; }
                    .logo { font-size: 36px; font-weight: bold; color: #1a1a1a; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .button { display: inline-block; background: #D4AF37; color: #1a1a1a; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Sanoria.pk</div>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>We received a request to reset your password. Use the code below to reset your password:</p>
                        <div style="background: #fff; padding: 20px; text-align: center; margin: 20px 0;">
                            <h3 style="color: #D4AF37;">${token}</h3>
                        </div>
                        <p>This code will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
                        <p>Best regards,<br>The Sanoria Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Sanoria.pk. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),
    
    orderConfirmation: (order) => ({
        subject: `Order Confirmation #${order.orderNumber} - Sanoria.pk`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%); padding: 30px; text-align: center; }
                    .logo { font-size: 36px; font-weight: bold; color: #1a1a1a; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .order-details { background: #fff; padding: 20px; margin: 20px 0; }
                    .item { border-bottom: 1px solid #eee; padding: 15px 0; }
                    .total { font-size: 20px; font-weight: bold; color: #D4AF37; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Sanoria.pk</div>
                    </div>
                    <div class="content">
                        <h2>Thank You for Your Order!</h2>
                        <p>Your order has been confirmed and will be processed soon.</p>
                        <div class="order-details">
                            <h3>Order Number: ${order.orderNumber}</h3>
                            <p>Order Date: ${new Date().toLocaleDateString()}</p>
                            <hr>
                            ${order.items.map(item => `
                                <div class="item">
                                    <strong>${item.name}</strong><br>
                                    Quantity: ${item.quantity} × Rs. ${item.price}
                                </div>
                            `).join('')}
                            <hr>
                            <div class="total">Total: Rs. ${order.total}</div>
                        </div>
                        <p>We'll send you another email when your order ships.</p>
                        <p>Best regards,<br>The Sanoria Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Sanoria.pk. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),
    
    promotionalEmail: (promotion) => ({
        subject: `${promotion.title} - Exclusive Offer from Sanoria.pk`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #E91E63 0%, #F8BBD0 100%); padding: 40px; text-align: center; color: white; }
                    .logo { font-size: 36px; font-weight: bold; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .promo-code { background: #D4AF37; color: #1a1a1a; padding: 15px 30px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
                    .button { display: inline-block; background: #E91E63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Sanoria.pk</div>
                        <h1>${promotion.title}</h1>
                    </div>
                    <div class="content">
                        <p>${promotion.description}</p>
                        <div class="promo-code">
                            Use Code: ${promotion.code}
                        </div>
                        <p style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL}/shop" class="button">Shop Now</a>
                        </p>
                        <p><small>*Terms and conditions apply. Valid until ${promotion.validUntil}</small></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Sanoria.pk. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    })
};

// Send verification email
async function sendVerificationEmail(email, code) {
    const template = emailTemplates.verification(code);
    
    try {
        await transporter.sendMail({
            from: '"Sanoria.pk" <noreply@sanoria.pk>',
            to: email,
            subject: template.subject,
            html: template.html
        });
        
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

// Send password reset email
async function sendPasswordResetEmail(email, token) {
    const template = emailTemplates.passwordReset(token);
    
    try {
        await transporter.sendMail({
            from: '"Sanoria.pk" <noreply@sanoria.pk>',
            to: email,
            subject: template.subject,
            html: template.html
        });
        
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

// Send order confirmation email
async function sendOrderConfirmationEmail(email, order) {
    const template = emailTemplates.orderConfirmation(order);
    
    try {
        await transporter.sendMail({
            from: '"Sanoria.pk" <noreply@sanoria.pk>',
            to: email,
            subject: template.subject,
            html: template.html
        });
        
        console.log(`Order confirmation email sent to ${email}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
}

// Send promotional email
async function sendPromotionalEmail(emails, promotion) {
    const template = emailTemplates.promotionalEmail(promotion);
    
    try {
        // Send in batches to avoid overloading
        const batchSize = 50;
        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);
            
            await Promise.all(batch.map(email => 
                transporter.sendMail({
                    from: '"Sanoria.pk" <noreply@sanoria.pk>',
                    to: email,
                    subject: template.subject,
                    html: template.html
                })
            ));
            
            // Add delay between batches
            if (i + batchSize < emails.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        console.log(`Promotional emails sent to ${emails.length} recipients`);
    } catch (error) {
        console.error('Error sending promotional emails:', error);
        throw error;
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendOrderConfirmationEmail,
    sendPromotionalEmail
};