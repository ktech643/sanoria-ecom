// ==========================================================================
//   Sanoria.pk - E-commerce Website JavaScript
// ==========================================================================

// Global Variables
let cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('sanoria_wishlist')) || [];
let notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];

// Sample Product Data
const featuredProducts = [
    {
        id: 1,
        name: "Luxury Face Cream",
        price: 2500,
        originalPrice: 3000,
        image: "images/product1.jpg",
        rating: 4.8,
        reviews: 124,
        badge: "Best Seller",
        category: "skincare"
    },
    {
        id: 2,
        name: "Premium Lipstick Set",
        price: 1800,
        originalPrice: 2200,
        image: "images/product2.jpg",
        rating: 4.9,
        reviews: 89,
        badge: "New",
        category: "makeup"
    },
    {
        id: 3,
        name: "Anti-Aging Serum",
        price: 3200,
        originalPrice: 3800,
        image: "images/product3.jpg",
        rating: 4.7,
        reviews: 156,
        badge: "20% Off",
        category: "skincare"
    },
    {
        id: 4,
        name: "Signature Perfume",
        price: 4500,
        originalPrice: 5000,
        image: "images/product4.jpg",
        rating: 4.9,
        reviews: 203,
        badge: "Limited",
        category: "fragrance"
    },
    {
        id: 5,
        name: "Hair Growth Oil",
        price: 1500,
        originalPrice: 1800,
        image: "images/product5.jpg",
        rating: 4.6,
        reviews: 78,
        badge: "Natural",
        category: "haircare"
    },
    {
        id: 6,
        name: "Foundation Set",
        price: 2800,
        originalPrice: 3200,
        image: "images/product6.jpg",
        rating: 4.8,
        reviews: 95,
        badge: "Popular",
        category: "makeup"
    }
];

// ==========================================================================
//   DOM Ready
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    loadFeaturedProducts();
    updateCartCount();
    updateWishlistCount();
    updateNotificationCount();
    initializeScrollEffects();
    initializeChatbot();
    initializeQRScanner();
    initializeSearch();
});

// ==========================================================================
//   Website Initialization
// ==========================================================================

function initializeWebsite() {
    // Add scrolled class to navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.luxury-nav');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger-menu');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.style.animationFillMode = 'both';
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.category-card, .skin-type-card, .product-card').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================================================
//   Product Management
// ==========================================================================

function loadFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;

    container.innerHTML = '';

    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const isInWishlist = wishlist.some(item => item.id === product.id);

    col.innerHTML = `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                <div class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</div>
                <div class="product-wishlist ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
            <div class="product-content">
                <h5 class="product-title">${product.name}</h5>
                <div class="product-price">
                    Rs. ${product.price.toLocaleString()}
                    ${product.originalPrice > product.price ? 
                        `<small class="text-muted text-decoration-line-through ms-2">Rs. ${product.originalPrice.toLocaleString()}</small>` : ''}
                </div>
                <div class="product-rating">
                    <span class="rating-stars">
                        ${generateStars(product.rating)}
                    </span>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    <button class="btn-quick-view" onclick="showQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// ==========================================================================
//   Cart Management
// ==========================================================================

function addToCart(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast('Item quantity updated in cart!', 'success');
    } else {
        cart.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        showToast('Item added to cart successfully!', 'success');
    }

    localStorage.setItem('sanoria_cart', JSON.stringify(cart));
    updateCartCount();
    
    // Add cart animation
    animateCartIcon();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('sanoria_cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Item removed from cart', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('sanoria_cart', JSON.stringify(cart));
            updateCartCount();
        }
    }
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.animation = 'none';
        setTimeout(() => {
            cartIcon.style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
    }
}

// ==========================================================================
//   Wishlist Management
// ==========================================================================

function toggleWishlist(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push({
            ...product,
            addedAt: new Date().toISOString()
        });
        showToast('Added to wishlist!', 'success');
    }

    localStorage.setItem('sanoria_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    updateWishlistIcons();
}

function updateWishlistCount() {
    const wishlistCount = wishlist.length;
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlistCount;
        wishlistCountElement.style.display = wishlistCount > 0 ? 'flex' : 'none';
    }
}

function updateWishlistIcons() {
    document.querySelectorAll('.product-wishlist').forEach(icon => {
        const productId = parseInt(icon.getAttribute('onclick').match(/\d+/)[0]);
        const isInWishlist = wishlist.some(item => item.id === productId);
        icon.classList.toggle('active', isInWishlist);
    });
}

// ==========================================================================
//   Notification Management
// ==========================================================================

function addNotification(title, message, type = 'info') {
    const notification = {
        id: Date.now(),
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
    };

    notifications.unshift(notification);
    localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
    updateNotificationCount();
}

function updateNotificationCount() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// ==========================================================================
//   Chatbot
// ==========================================================================

let chatbotOpen = false;

function initializeChatbot() {
    // Add initial bot responses
    const botResponses = [
        "Hello! Welcome to Sanoria.pk! How can I help you today?",
        "I can help you with product information, order tracking, or any questions about our services.",
        "Feel free to ask me about our skincare, makeup, fragrance, or hair care products!"
    ];

    // Add welcome message after delay
    setTimeout(() => {
        addNotification(
            'Chatbot Ready',
            'Our customer service bot is ready to help you!',
            'success'
        );
    }, 3000);
}

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbotWindow.classList.add('active');
    } else {
        chatbotWindow.classList.remove('active');
    }
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addChatMessage(botResponse, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost')) {
        return "Our products range from Rs. 1,000 to Rs. 5,000. You can find specific pricing on each product page. Would you like recommendations based on your budget?";
    } else if (message.includes('shipping') || message.includes('delivery')) {
        return "We offer free shipping on orders above Rs. 2,000! Standard delivery takes 2-3 business days. We partner with Leopard, TCS, and PkDex for reliable delivery.";
    } else if (message.includes('return') || message.includes('exchange')) {
        return "We have a 14-day easy return policy! If you're not satisfied with your purchase, you can return it within 14 days for a full refund or exchange.";
    } else if (message.includes('skin') || message.includes('skincare')) {
        return "We have amazing skincare products for all skin types! Are you looking for products for oily, dry, or combination skin? I can recommend the best products for you.";
    } else if (message.includes('makeup')) {
        return "Our makeup collection includes premium lipsticks, foundations, and complete sets. What type of makeup products are you interested in?";
    } else if (message.includes('order') || message.includes('track')) {
        return "To track your order, please provide your order number. You can also check your order history in your account dashboard.";
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! Welcome to Sanoria.pk! I'm here to help you find the perfect beauty products. What can I assist you with today?";
    } else if (message.includes('thanks') || message.includes('thank you')) {
        return "You're welcome! Is there anything else I can help you with? I'm here to make your shopping experience amazing!";
    } else {
        return "That's a great question! For detailed information, you can browse our products or contact our customer service team. Is there anything specific you'd like to know about our beauty products?";
    }
}

// Allow Enter key to send message
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('chatbot-input') === document.activeElement) {
        sendMessage();
    }
});

// ==========================================================================
//   QR Code Scanner
// ==========================================================================

function initializeQRScanner() {
    // Add QR scanner button to navigation
    const qrButton = document.createElement('a');
    qrButton.href = '#';
    qrButton.className = 'nav-link';
    qrButton.innerHTML = '<i class="fas fa-qrcode"></i>';
    qrButton.title = 'Scan QR for Offers';
    qrButton.onclick = function(e) {
        e.preventDefault();
        openQRScanner();
    };

    const navIcons = document.querySelector('.navbar-nav.ms-auto');
    if (navIcons) {
        navIcons.insertBefore(qrButton, navIcons.firstChild);
    }
}

function openQRScanner() {
    const modal = new bootstrap.Modal(document.getElementById('qrScannerModal'));
    modal.show();

    // Initialize QR code scanner
    const qrReader = new Html5Qrcode("qr-reader");
    
    qrReader.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
            // Handle successful QR code scan
            handleQRCodeScan(decodedText);
            qrReader.stop();
            modal.hide();
        },
        (errorMessage) => {
            // Handle scan errors
            console.log(`QR Code scan error: ${errorMessage}`);
        }
    ).catch(err => {
        console.error(`Unable to start scanning: ${err}`);
        showToast('Camera access required for QR scanning', 'error');
    });

    // Stop scanner when modal is closed
    document.getElementById('qrScannerModal').addEventListener('hidden.bs.modal', function () {
        qrReader.stop().catch(err => console.error(err));
    });
}

function handleQRCodeScan(qrData) {
    // Process QR code data
    if (qrData.includes('discount') || qrData.includes('offer')) {
        showToast('Special discount code applied!', 'success');
        addNotification('QR Discount', 'You\'ve unlocked a special discount!', 'success');
    } else if (qrData.includes('product')) {
        // Redirect to product page
        showToast('Product found! Redirecting...', 'info');
    } else {
        showToast('QR code scanned successfully!', 'info');
    }
}

// ==========================================================================
//   Search Functionality
// ==========================================================================

function initializeSearch() {
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showSearchModal();
        });
    }
}

function showSearchModal() {
    // Create search modal if it doesn't exist
    let searchModal = document.getElementById('searchModal');
    if (!searchModal) {
        searchModal = createSearchModal();
        document.body.appendChild(searchModal);
    }

    const modal = new bootstrap.Modal(searchModal);
    modal.show();

    // Focus on search input
    setTimeout(() => {
        document.getElementById('searchInput').focus();
    }, 300);
}

function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'searchModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Search Products</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="search-container">
                        <input type="text" id="searchInput" class="form-control form-control-lg" 
                               placeholder="Search for products, brands, categories..." 
                               onkeyup="performSearch(this.value)">
                    </div>
                    <div id="searchResults" class="search-results mt-3"></div>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }

    // Filter products based on search query
    const results = featuredProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(results);
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-muted text-center">No products found</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(product => `
        <div class="search-result-item d-flex align-items-center p-3 border-bottom">
            <img src="${product.image}" alt="${product.name}" class="search-result-image me-3" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                 onerror="this.src='images/placeholder.jpg'">
            <div class="flex-grow-1">
                <h6 class="mb-1">${product.name}</h6>
                <p class="mb-1 text-muted">${product.category}</p>
                <strong class="text-gold">Rs. ${product.price.toLocaleString()}</strong>
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// ==========================================================================
//   Scroll Effects
// ==========================================================================

function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add scroll-to-top button
    createScrollToTopButton();
}

function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--luxury-gold);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    scrollButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(scrollButton);

    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
        } else {
            scrollButton.style.opacity = '0';
        }
    });
}

// ==========================================================================
//   Toast Notifications
// ==========================================================================

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    bsToast.show();

    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// ==========================================================================
//   Quick View Modal
// ==========================================================================

function showQuickView(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    // Create or update quick view modal
    let quickViewModal = document.getElementById('quickViewModal');
    if (!quickViewModal) {
        quickViewModal = createQuickViewModal();
        document.body.appendChild(quickViewModal);
    }

    // Update modal content
    updateQuickViewContent(product);

    // Show modal
    const modal = new bootstrap.Modal(quickViewModal);
    modal.show();
}

function createQuickViewModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'quickViewModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Product Quick View</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="quickViewContent">
                    <!-- Content will be dynamically loaded -->
                </div>
            </div>
        </div>
    `;
    return modal;
}

function updateQuickViewContent(product) {
    const content = document.getElementById('quickViewContent');
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded" 
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="col-md-6">
                <h3>${product.name}</h3>
                <div class="product-rating mb-3">
                    <span class="rating-stars">${generateStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price mb-3">
                    <h4 class="text-gold">Rs. ${product.price.toLocaleString()}</h4>
                    ${product.originalPrice > product.price ? 
                        `<small class="text-muted text-decoration-line-through">Rs. ${product.originalPrice.toLocaleString()}</small>` : ''}
                </div>
                <p class="product-description mb-4">
                    Premium quality ${product.category} product designed to enhance your beauty routine. 
                    Made with carefully selected ingredients for optimal results.
                </p>
                <div class="product-actions">
                    <button class="btn btn-primary btn-lg me-3" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-outline-secondary" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart ${isInWishlist ? 'text-danger' : ''}"></i>
                        ${isInWishlist ? 'Remove from' : 'Add to'} Wishlist
                    </button>
                </div>
                <div class="product-features mt-4">
                    <h6>Features:</h6>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-check text-success me-2"></i>Premium Quality</li>
                        <li><i class="fas fa-check text-success me-2"></i>Dermatologically Tested</li>
                        <li><i class="fas fa-check text-success me-2"></i>Natural Ingredients</li>
                        <li><i class="fas fa-check text-success me-2"></i>Cruelty Free</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// ==========================================================================
//   User Authentication (Basic)
// ==========================================================================

function showLoginModal() {
    // Implementation for login modal
    console.log('Login modal functionality to be implemented');
}

function showRegisterModal() {
    // Implementation for registration modal
    console.log('Register modal functionality to be implemented');
}

// ==========================================================================
//   Code Verification System
// ==========================================================================

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendVerificationCode(phone) {
    const code = generateVerificationCode();
    // In a real application, this would send SMS
    console.log(`Verification code ${code} sent to ${phone}`);
    return code;
}

function verifyCode(enteredCode, actualCode) {
    return enteredCode === actualCode;
}

// ==========================================================================
//   Local Storage Management
// ==========================================================================

function clearAllData() {
    localStorage.removeItem('sanoria_cart');
    localStorage.removeItem('sanoria_wishlist');
    localStorage.removeItem('sanoria_notifications');
    cart = [];
    wishlist = [];
    notifications = [];
    updateCartCount();
    updateWishlistCount();
    updateNotificationCount();
}

// ==========================================================================
//   Error Handling
// ==========================================================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// ==========================================================================
//   Performance Optimization
// ==========================================================================

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// ==========================================================================
//   Export functions for global access
// ==========================================================================

window.Sanoria = {
    addToCart,
    removeFromCart,
    toggleWishlist,
    showQuickView,
    toggleChatbot,
    sendMessage,
    openQRScanner,
    showToast,
    clearAllData
};