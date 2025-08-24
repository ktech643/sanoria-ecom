// ===== SANORIA.PK - Main JavaScript =====

// Global Variables
let cart = JSON.parse(localStorage.getItem('sanoriaCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('sanoriaWishlist')) || [];
let isLoggedIn = false;
let currentUser = null;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    updateCartUI();
    loadProducts();
    initializeAnimations();
});

// Initialize App
function initializeApp() {
    // Check if user is logged in
    const token = localStorage.getItem('sanoriaToken');
    if (token) {
        validateToken(token);
    }
    
    // Initialize tooltips and popovers
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Setup Event Listeners
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Search functionality
    const searchInput = document.querySelector('#searchModal input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Skin type cards
    document.querySelectorAll('.skin-type-card').forEach(card => {
        card.addEventListener('click', handleSkinTypeClick);
    });
    
    // User account click
    document.getElementById('userAccount').addEventListener('click', handleUserAccountClick);
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Close Banner
function closeBanner() {
    const banner = document.querySelector('.discount-banner');
    banner.style.animation = 'slideUp 0.5s ease-out forwards';
    setTimeout(() => {
        banner.style.display = 'none';
        document.querySelector('.navbar').style.marginTop = '0';
    }, 500);
}

// Search Functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const resultsContainer = document.querySelector('.search-results');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Simulate search (in real app, this would be an API call)
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    displaySearchResults(searchResults, resultsContainer);
}

// Display Search Results
function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No products found</p>';
        return;
    }
    
    const html = results.map(product => `
        <div class="search-result-item d-flex align-items-center mb-3">
            <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px;">
            <div class="ms-3">
                <h6 class="mb-1">${product.name}</h6>
                <p class="mb-0 text-primary fw-bold">Rs. ${product.price}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Newsletter Submit
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Show loading state
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Successfully subscribed to newsletter!', 'success');
        e.target.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}

// Skin Type Click Handler
function handleSkinTypeClick(e) {
    const skinType = e.currentTarget.dataset.skin;
    window.location.href = `#shop?skin=${skinType}`;
}

// User Account Click Handler
function handleUserAccountClick(e) {
    e.preventDefault();
    if (isLoggedIn) {
        window.location.href = '/account';
    } else {
        showLoginModal();
    }
}

// Show Login Modal
function showLoginModal() {
    const modalHtml = `
        <div class="modal fade" id="loginModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">Welcome to Sanoria</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs mb-3" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#login-tab" type="button">Login</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#register-tab" type="button">Register</button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane fade show active" id="login-tab">
                                <form id="loginForm">
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input type="password" class="form-control" required>
                                    </div>
                                    <div class="mb-3 form-check">
                                        <input type="checkbox" class="form-check-input" id="rememberMe">
                                        <label class="form-check-label" for="rememberMe">Remember me</label>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Login</button>
                                    <p class="text-center mt-3">
                                        <a href="#" class="text-primary">Forgot password?</a>
                                    </p>
                                </form>
                            </div>
                            <div class="tab-pane fade" id="register-tab">
                                <form id="registerForm">
                                    <div class="mb-3">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input type="password" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Create Account</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
    
    // Setup form handlers
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('sanoriaToken', data.token);
            isLoggedIn = true;
            currentUser = data.user;
            showNotification('Login successful!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            updateUIForLoggedInUser();
        } else {
            showNotification('Invalid credentials', 'error');
        }
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            showNotification('Registration successful! Please check your email for verification.', 'success');
            // Switch to login tab
            document.querySelector('[data-bs-target="#login-tab"]').click();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Add to Cart
window.addToCart = function(productId) {
    // Find product from loaded products or fetch it
    let product = null;
    
    // Check if we have products loaded
    const allProducts = window.productsData || [];
    product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        // If product not found in memory, create a temporary one
        // In production, this would fetch from API
        product = {
            id: productId,
            name: `Product ${productId}`,
            price: 1999,
            image: '/images/placeholder.jpg'
        };
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('sanoriaCart', JSON.stringify(cart));
    updateCartUI();
    showNotification('Product added to cart!', 'success');
    
    // Update cart icon animation
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => cartIcon.classList.remove('animate-bounce'), 1000);
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} animate-fade-up`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Position notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
    `;
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check Auth Status
async function checkAuthStatus() {
    const token = localStorage.getItem('sanoriaToken');
    if (token) {
        try {
            const response = await fetch('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                isLoggedIn = true;
                currentUser = data.user;
                updateUIForLoggedInUser();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }
}

// Update UI for Logged In User
function updateUIForLoggedInUser() {
    const userIcon = document.getElementById('userAccount');
    userIcon.innerHTML = `<i class="fas fa-user-circle"></i>`;
    // Add more UI updates as needed
}

// Initialize Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.product-card, .feature-box, .skin-type-card').forEach(el => {
        observer.observe(el);
    });
}

// Placeholder products data
const products = [
    {
        id: 1,
        name: "Radiance Serum",
        price: 2499,
        image: "/images/product-1.jpg",
        description: "Brightening serum with Vitamin C",
        category: "serum",
        skinType: ["all"]
    },
    {
        id: 2,
        name: "Hydra Boost Cream",
        price: 1999,
        image: "/images/product-2.jpg",
        description: "Deep moisturizing cream",
        category: "moisturizer",
        skinType: ["dry", "combination"]
    }
];