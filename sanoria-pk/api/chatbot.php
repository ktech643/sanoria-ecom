<?php
session_start();
require_once '../includes/config.php';

header('Content-Type: application/json');

$message = $_POST['message'] ?? '';
$userId = $_SESSION['user_id'] ?? null;
$sessionId = session_id();

if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'No message provided']);
    exit();
}

// Save user message
$stmt = $pdo->prepare("INSERT INTO chatbot_messages (user_id, session_id, message, message_type) VALUES (?, ?, ?, 'user')");
$stmt->execute([$userId, $sessionId, $message]);

// Generate bot response based on keywords
$response = generateBotResponse($message);

// Save bot response
$stmt = $pdo->prepare("INSERT INTO chatbot_messages (user_id, session_id, message, response, message_type) VALUES (?, ?, ?, ?, 'bot')");
$stmt->execute([$userId, $sessionId, $message, $response]);

echo json_encode(['success' => true, 'reply' => $response]);

function generateBotResponse($message) {
    $message = strtolower($message);
    
    // Greetings
    if (strpos($message, 'hello') !== false || strpos($message, 'hi') !== false || strpos($message, 'hey') !== false) {
        return "Hello! Welcome to Sanoria.pk. How can I assist you today? I can help you with:\n• Product recommendations\n• Order tracking\n• Shipping information\n• Return policy\n• Skin type advice";
    }
    
    // Product inquiries
    if (strpos($message, 'product') !== false || strpos($message, 'recommend') !== false) {
        return "I'd be happy to help you find the perfect products! What's your skin type? We have specialized products for:\n• Normal skin\n• Dry skin\n• Oily skin\n• Combination skin\n• Sensitive skin\n\nYou can also browse our categories: Skincare, Makeup, Hair Care, Fragrance, and Bath & Body.";
    }
    
    // Skin type
    if (strpos($message, 'skin type') !== false || strpos($message, 'skin') !== false) {
        return "Understanding your skin type is important for choosing the right products. We offer a quick skin type quiz on our website. Would you like me to guide you through it? Just tell me about your skin concerns:\n• Does your skin feel tight or dry?\n• Do you have oily areas?\n• Is your skin sensitive or reactive?";
    }
    
    // Shipping
    if (strpos($message, 'shipping') !== false || strpos($message, 'delivery') !== false) {
        return "We offer fast and reliable shipping across Pakistan through our partners:\n• TCS\n• Leopard Courier\n• PKDex\n\nFree shipping on orders above Rs. 2500!\nDelivery usually takes 2-5 business days depending on your location.";
    }
    
    // Payment
    if (strpos($message, 'payment') !== false || strpos($message, 'pay') !== false) {
        return "We accept multiple payment methods for your convenience:\n• Cash on Delivery (COD)\n• JazzCash\n• EasyPaisa\n• Bank Transfer\n\nAll online payments are secure and encrypted.";
    }
    
    // Returns
    if (strpos($message, 'return') !== false || strpos($message, 'refund') !== false) {
        return "We have a 14-day easy return policy! If you're not satisfied with your purchase, you can return it within 14 days of delivery. Products must be:\n• Unused and in original packaging\n• With all tags and labels intact\n\nRefunds are processed within 5-7 business days.";
    }
    
    // Order tracking
    if (strpos($message, 'track') !== false || strpos($message, 'order') !== false) {
        return "To track your order, please log in to your account and go to 'My Orders'. You'll find your tracking number there. You can also track directly on the courier's website using your tracking number.";
    }
    
    // Discounts
    if (strpos($message, 'discount') !== false || strpos($message, 'offer') !== false || strpos($message, 'sale') !== false) {
        return "Great news! We have ongoing promotions:\n• New customer discount: 10% off on first order\n• Free gifts with orders above Rs. 3000\n• Seasonal sales up to 50% off\n\nCheck our promotions page for current offers and use promo codes at checkout!";
    }
    
    // Contact
    if (strpos($message, 'contact') !== false || strpos($message, 'phone') !== false || strpos($message, 'email') !== false) {
        return "You can reach us through:\n📞 Phone: +92 300 1234567\n📧 Email: info@sanoria.pk\n🕐 Hours: Mon-Sat, 9 AM - 6 PM\n\nWe're always happy to help!";
    }
    
    // Gift
    if (strpos($message, 'gift') !== false || strpos($message, 'free') !== false) {
        return "Yes! We offer free gifts and samples with qualifying orders:\n• Orders above Rs. 3000: Free deluxe sample\n• Orders above Rs. 5000: Free full-size gift\n\nGifts are automatically added to your order. Check our current gift offerings on the homepage!";
    }
    
    // Default response
    return "I'm here to help! You can ask me about:\n• Product recommendations\n• Shipping and delivery\n• Payment methods\n• Return policy\n• Current offers\n• Order tracking\n\nWhat would you like to know?";
}
?>