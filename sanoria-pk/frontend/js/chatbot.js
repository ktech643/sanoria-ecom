// ===== SANORIA.PK - Chatbot Functionality =====

let chatbotOpen = false;
let chatHistory = [];

// Toggle Chatbot
function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatWindow.classList.add('active');
        document.getElementById('chatInput').focus();
        
        // Send welcome message if first time
        if (chatHistory.length === 0) {
            setTimeout(() => {
                addBotMessage("Welcome to Sanoria! 👋 I'm here to help you find the perfect skincare products. How can I assist you today?");
            }, 500);
        }
    } else {
        chatWindow.classList.remove('active');
    }
}

// Send Chat Message
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and generate response
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateBotResponse(message);
        addBotMessage(response);
    }, 1000 + Math.random() * 1000);
}

// Add User Message
function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user animate-fade-up';
    messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to history
    chatHistory.push({ type: 'user', message: message });
}

// Add Bot Message
function addBotMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot animate-fade-up';
    messageDiv.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to history
    chatHistory.push({ type: 'bot', message: message });
}

// Generate Bot Response
function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Product recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
        if (lowerMessage.includes('dry skin')) {
            return `For dry skin, I recommend:
                <br><br>
                🌟 <strong>Hydra Boost Cream</strong> - Deep moisturizing formula
                <br>💧 <strong>Hyaluronic Acid Serum</strong> - Intense hydration
                <br>🌹 <strong>Rose Hydrating Mist</strong> - Refreshing throughout the day
                <br><br>
                Would you like to see these products or need more recommendations?`;
        } else if (lowerMessage.includes('oily skin')) {
            return `For oily skin, try these products:
                <br><br>
                🍃 <strong>Green Tea Cleanser</strong> - Oil control formula
                <br>✨ <strong>Mattifying Toner</strong> - Reduces shine
                <br>🌟 <strong>Lightweight Gel Moisturizer</strong> - Non-greasy hydration
                <br><br>
                Shall I add any of these to your cart?`;
        } else {
            return "I'd love to recommend products for you! Could you tell me your skin type? (Dry, Oily, Combination, or Sensitive)";
        }
    }
    
    // Order tracking
    if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
        return `To track your order:
            <br><br>
            1. Go to "My Account" 
            <br>2. Click on "Order History"
            <br>3. Find your order and click "Track"
            <br><br>
            You can also enter your order number here, and I'll check it for you!`;
    }
    
    // Shipping information
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return `We offer FREE shipping on orders above Rs. 1500! 🚚
            <br><br>
            📦 Standard Delivery: 3-5 business days
            <br>⚡ Express Delivery: 1-2 business days
            <br><br>
            We partner with Leopard, TCS, and PkDex for reliable delivery across Pakistan.`;
    }
    
    // Returns
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return `We offer a 14-day easy return policy! 
            <br><br>
            If you're not satisfied with your purchase:
            <br>• Contact us within 14 days
            <br>• Products must be unused and in original packaging
            <br>• We'll arrange a pickup at no cost to you
            <br><br>
            Need to initiate a return? I can help with that!`;
    }
    
    // Payment methods
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        return `We accept multiple payment methods for your convenience:
            <br><br>
            💳 JazzCash & EasyPaisa
            <br>🏦 Bank Transfer
            <br>💵 Cash on Delivery
            <br>💰 All major debit/credit cards
            <br><br>
            All transactions are 100% secure! 🔒`;
    }
    
    // Promotions
    if (lowerMessage.includes('discount') || lowerMessage.includes('offer') || lowerMessage.includes('sale')) {
        return `🎉 Current Offers:
            <br><br>
            • 20% OFF on all products - Limited time!
            <br>• FREE gift with orders above Rs. 2000
            <br>• Buy 2 Get 1 FREE on selected items
            <br>• First-time customer? Use code WELCOME10 for 10% off
            <br><br>
            Don't miss out on these amazing deals!`;
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! 😊 Welcome to Sanoria. How can I help you today? I can assist with product recommendations, order tracking, or answer any questions about our skincare products.";
    }
    
    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! 😊 Is there anything else I can help you with today?";
    }
    
    // Skin concerns
    if (lowerMessage.includes('acne') || lowerMessage.includes('pimple')) {
        return `For acne-prone skin, I recommend:
            <br><br>
            🌿 <strong>Tea Tree Spot Treatment</strong> - Targets blemishes
            <br>🧪 <strong>Salicylic Acid Cleanser</strong> - Unclogs pores
            <br>✨ <strong>Niacinamide Serum</strong> - Reduces inflammation
            <br><br>
            These products are gentle yet effective for acne management!`;
    }
    
    // Anti-aging
    if (lowerMessage.includes('aging') || lowerMessage.includes('wrinkle') || lowerMessage.includes('anti-age')) {
        return `Our anti-aging collection includes:
            <br><br>
            🌟 <strong>Retinol Night Repair</strong> - Reduces fine lines
            <br>💎 <strong>24K Gold Serum</strong> - Firms and lifts
            <br>👁️ <strong>Collagen Eye Cream</strong> - Targets crow's feet
            <br><br>
            Start with one product and gradually build your routine!`;
    }
    
    // Default response
    return `I'm here to help! You can ask me about:
        <br><br>
        • Product recommendations for your skin type
        <br>• Current offers and discounts
        <br>• Order tracking and shipping
        <br>• Return policy
        <br>• Skin care tips and routines
        <br><br>
        What would you like to know?`;
}

// Show Typing Indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <p>
            <span></span>
            <span></span>
            <span></span>
        </p>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

// Remove Typing Indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Scroll to Bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle Enter Key
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// Add chatbot-specific styles
const chatbotStyles = document.createElement('style');
chatbotStyles.textContent = `
    .typing-indicator p {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .typing-indicator span {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--primary-color);
        animation: typing 1.4s infinite;
    }
    
    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
    
    .chat-message strong {
        color: var(--primary-color);
    }
    
    .chat-message br {
        line-height: 0.5;
    }
`;
document.head.appendChild(chatbotStyles);

// Quick Reply Buttons
function addQuickReplies(replies) {
    const messagesContainer = document.getElementById('chatMessages');
    const quickReplyDiv = document.createElement('div');
    quickReplyDiv.className = 'quick-replies animate-fade-up';
    
    const buttons = replies.map(reply => 
        `<button class="quick-reply-btn" onclick="quickReply('${reply}')">${reply}</button>`
    ).join('');
    
    quickReplyDiv.innerHTML = buttons;
    messagesContainer.appendChild(quickReplyDiv);
    scrollToBottom();
}

// Handle Quick Reply
function quickReply(message) {
    document.getElementById('chatInput').value = message;
    sendChatMessage();
    
    // Remove quick reply buttons
    const quickReplies = document.querySelector('.quick-replies');
    if (quickReplies) {
        quickReplies.remove();
    }
}

// Add quick reply styles
const quickReplyStyles = document.createElement('style');
quickReplyStyles.textContent = `
    .quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0;
    }
    
    .quick-reply-btn {
        background: var(--bg-light);
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .quick-reply-btn:hover {
        background: var(--primary-color);
        color: white;
    }
`;
document.head.appendChild(quickReplyStyles);