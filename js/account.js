/**
 * Account Management Functions for Sanoria.pk
 * Handles profile, order history, wishlist, and account features
 */

$(document).ready(function() {
    'use strict';

    // Initialize based on current page
    initAccountPage();

    // Initialize common account functionality
    initAccountFeatures();
});

function initAccountPage() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('order-history')) {
        loadOrderHistory();
        initOrderHistoryFeatures();
    }
    
    if (currentPath.includes('profile')) {
        loadUserProfile();
        initProfileFeatures();
    }
    
    if (currentPath.includes('wishlist')) {
        loadWishlist();
        initWishlistFeatures();
    }

    // Load user info in sidebar
    loadUserInfo();
}

function initAccountFeatures() {
    // Update cart count
    updateCartDisplay();
    
    // Initialize logout functionality
    window.logout = function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('sanoria_user_session');
            localStorage.removeItem('sanoria_user');
            window.location.href = 'login.html';
        }
    };
}

// =====================
// ORDER HISTORY
// =====================
function loadOrderHistory() {
    const orders = [
        {
            id: 'SAN20241215001',
            date: '2024-12-15',
            total: 3299,
            status: 'shipped',
            trackingNumber: 'TCS123456789',
            courier: 'TCS',
            items: [
                { 
                    id: 1, 
                    name: 'Hydrating Facial Serum', 
                    quantity: 2, 
                    price: 1299,
                    image: 'images/products/product-1.jpg'
                },
                { 
                    id: 2, 
                    name: 'Vitamin C Serum', 
                    quantity: 1, 
                    price: 1299,
                    image: 'images/products/product-2.jpg'
                }
            ]
        },
        {
            id: 'SAN20241210001',
            date: '2024-12-10',
            total: 1899,
            status: 'delivered',
            trackingNumber: 'LEO987654321',
            courier: 'Leopard',
            items: [
                { 
                    id: 4, 
                    name: 'Anti-Aging Night Cream', 
                    quantity: 1, 
                    price: 1899,
                    image: 'images/products/product-4.jpg'
                }
            ]
        },
        {
            id: 'SAN20241205001',
            date: '2024-12-05',
            total: 2598,
            status: 'confirmed',
            trackingNumber: '',
            courier: '',
            items: [
                { 
                    id: 3, 
                    name: 'Gentle Foaming Cleanser', 
                    quantity: 1, 
                    price: 899,
                    image: 'images/products/product-3.jpg'
                },
                { 
                    id: 7, 
                    name: 'Retinol Night Serum', 
                    quantity: 1, 
                    price: 1699,
                    image: 'images/products/product-6.jpg'
                }
            ]
        },
        {
            id: 'SAN20241201001',
            date: '2024-12-01',
            total: 799,
            status: 'pending',
            trackingNumber: '',
            courier: '',
            items: [
                { 
                    id: 5, 
                    name: 'Facial Cleansing Brush', 
                    quantity: 1, 
                    price: 799,
                    image: 'images/products/tool-1.jpg'
                }
            ]
        }
    ];

    const ordersHtml = orders.map(order => `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-info">
                    <h5>Order #${order.id}</h5>
                    <p class="text-muted mb-0">Placed on ${formatDate(order.date)}</p>
                    ${order.trackingNumber ? `<small class="tracking-info">Tracking: ${order.trackingNumber}</small>` : ''}
                </div>
                <div class="order-status-container">
                    <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='images/placeholder.svg'">
                        <div class="item-details">
                            <h6>${item.name}</h6>
                            <span class="item-quantity">Qty: ${item.quantity}</span>
                        </div>
                        <div class="item-price">
                            Rs. ${(item.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">
                    <strong>Total: Rs. ${order.total.toLocaleString()}</strong>
                </div>
                <div class="order-actions">
                    <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye me-1"></i>View Details
                    </button>
                    ${order.status === 'shipped' || order.status === 'delivered' ? 
                        `<button class="btn btn-primary btn-sm" onclick="trackOrder('${order.id}')">
                            <i class="fas fa-map-marker-alt me-1"></i>Track Order
                        </button>` : ''}
                    ${order.status === 'delivered' ? 
                        `<button class="btn btn-success btn-sm" onclick="reorderItems('${order.id}')">
                            <i class="fas fa-redo me-1"></i>Reorder
                        </button>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    $('#ordersContainer').html(ordersHtml);
    
    // Store orders for filtering
    window.allOrders = orders;
}

function initOrderHistoryFeatures() {
    // Status filter
    $('#statusFilter').on('change', function() {
        filterOrders();
    });
    
    // Date filter
    $('#dateFilter').on('change', function() {
        filterOrders();
    });
}

function filterOrders() {
    const statusFilter = $('#statusFilter').val();
    const dateFilter = $('#dateFilter').val();
    
    let filteredOrders = window.allOrders || [];
    
    // Filter by status
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
        const days = parseInt(dateFilter);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        filteredOrders = filteredOrders.filter(order => 
            new Date(order.date) >= cutoffDate
        );
    }
    
    // Update display
    if (filteredOrders.length === 0) {
        $('#ordersContainer').html(`
            <div class="no-orders text-center py-5">
                <i class="fas fa-box-open text-muted mb-3" style="font-size: 3rem;"></i>
                <h4>No orders found</h4>
                <p class="text-muted">Try adjusting your filters or place your first order!</p>
                <a href="category.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `);
    } else {
        const ordersHtml = filteredOrders.map(order => `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h5>Order #${order.id}</h5>
                        <p class="text-muted mb-0">Placed on ${formatDate(order.date)}</p>
                        ${order.trackingNumber ? `<small class="tracking-info">Tracking: ${order.trackingNumber}</small>` : ''}
                    </div>
                    <div class="order-status-container">
                        <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='images/placeholder.svg'">
                            <div class="item-details">
                                <h6>${item.name}</h6>
                                <span class="item-quantity">Qty: ${item.quantity}</span>
                            </div>
                            <div class="item-price">
                                Rs. ${(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: Rs. ${order.total.toLocaleString()}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        ${order.status === 'shipped' || order.status === 'delivered' ? 
                            `<button class="btn btn-primary btn-sm" onclick="trackOrder('${order.id}')">
                                <i class="fas fa-map-marker-alt me-1"></i>Track Order
                            </button>` : ''}
                        ${order.status === 'delivered' ? 
                            `<button class="btn btn-success btn-sm" onclick="reorderItems('${order.id}')">
                                <i class="fas fa-redo me-1"></i>Reorder
                            </button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        $('#ordersContainer').html(ordersHtml);
    }
}

// =====================
// PROFILE MANAGEMENT
// =====================
function loadUserProfile() {
    // Load sample user data (in real app, this would come from API)
    const sampleUser = {
        firstName: 'Sarah',
        lastName: 'Ahmed',
        email: 'sarah@example.com',
        phone: '+92 300 1234567',
        dateOfBirth: '1995-06-15',
        gender: 'female',
        skinType: 'combination',
        skinConcerns: 'acne',
        categories: ['skincare'],
        emailNotifications: true,
        smsNotifications: true,
        beautyTips: true
    };

    // Populate form fields
    if (sampleUser) {
        $('#firstName').val(sampleUser.firstName);
        $('#lastName').val(sampleUser.lastName);
        $('#email').val(sampleUser.email);
        $('#phone').val(sampleUser.phone || '');
        $('#dateOfBirth').val(sampleUser.dateOfBirth || '');
        $('#gender').val(sampleUser.gender || '');
        $('#skinType').val(sampleUser.skinType || '');
        $('#skinConcerns').val(sampleUser.skinConcerns || '');
        
        // Set checkboxes
        $('#emailNotifications').prop('checked', sampleUser.emailNotifications);
        $('#smsNotifications').prop('checked', sampleUser.smsNotifications);
        $('#beautyTips').prop('checked', sampleUser.beautyTips);
        
        // Set category checkboxes
        if (sampleUser.categories) {
            sampleUser.categories.forEach(category => {
                $(`#cat-${category}`).prop('checked', true);
            });
        }
    }
}

function initProfileFeatures() {
    // Form submission
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });
    
    // Password strength checker
    $('#newPassword').on('input', function() {
        checkPasswordStrength($(this).val());
    });
    
    // Confirm password validation
    $('#confirmPassword').on('input', function() {
        validatePasswordMatch();
    });
    
    // Avatar upload (placeholder)
    $('.user-avatar').on('click', function() {
        alert('Avatar upload feature will be implemented soon!');
    });
}

function saveProfile() {
    const formData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        dateOfBirth: $('#dateOfBirth').val(),
        gender: $('#gender').val(),
        skinType: $('#skinType').val(),
        skinConcerns: $('#skinConcerns').val(),
        categories: $('input[name="categories[]"]:checked').map(function() {
            return $(this).val();
        }).get(),
        emailNotifications: $('#emailNotifications').is(':checked'),
        smsNotifications: $('#smsNotifications').is(':checked'),
        beautyTips: $('#beautyTips').is(':checked')
    };
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Password validation if changing password
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    
    if (newPassword && (!currentPassword || newPassword !== confirmPassword)) {
        alert('Please check your password fields.');
        return;
    }
    
    // Show saving state
    const $saveBtn = $('#profileForm button[type="submit"]');
    const originalText = $saveBtn.html();
    $saveBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...').prop('disabled', true);
    
    // Simulate save (in real app, this would be an API call)
    setTimeout(() => {
        // Save to localStorage for demo
        localStorage.setItem('sanoria_user_profile', JSON.stringify(formData));
        
        // Show success message
        alert('Profile updated successfully!');
        
        // Clear password fields
        $('#currentPassword, #newPassword, #confirmPassword').val('');
        $('#passwordStrength').empty();
        
        // Restore button
        $saveBtn.html(originalText).prop('disabled', false);
        
        // Update user info display
        updateUserInfo(formData);
    }, 1500);
}

// =====================
// WISHLIST MANAGEMENT
// =====================
function loadWishlist() {
    // Sample wishlist data (in real app, this would come from API/localStorage)
    const sampleWishlist = [
        {
            id: 1,
            name: 'Hydrating Facial Serum',
            price: 1299,
            originalPrice: 1599,
            image: 'images/products/product-1.jpg',
            inStock: true,
            rating: 4.5,
            dateAdded: '2024-12-10'
        },
        {
            id: 2,
            name: 'Vitamin C Brightening Serum',
            price: 1599,
            originalPrice: null,
            image: 'images/products/product-2.jpg',
            inStock: true,
            rating: 4.8,
            dateAdded: '2024-12-08'
        },
        {
            id: 4,
            name: 'Anti-Aging Night Cream',
            price: 1899,
            originalPrice: 2299,
            image: 'images/products/product-4.jpg',
            inStock: false,
            rating: 4.6,
            dateAdded: '2024-12-05'
        },
        {
            id: 7,
            name: 'Retinol Night Serum',
            price: 2199,
            originalPrice: null,
            image: 'images/products/product-6.jpg',
            inStock: true,
            rating: 4.9,
            dateAdded: '2024-12-03'
        },
        {
            id: 8,
            name: 'Jade Roller Set',
            price: 599,
            originalPrice: 799,
            image: 'images/products/tool-2.jpg',
            inStock: true,
            rating: 4.3,
            dateAdded: '2024-12-01'
        }
    ];
    
    displayWishlistItems(sampleWishlist);
    
    // Store for global access
    window.wishlistItems = sampleWishlist;
    
    // Update counts
    updateWishlistCount();
}

function displayWishlistItems(items) {
    const $container = $('#wishlistItems');
    const $emptyState = $('#emptyWishlist');
    
    if (!items || items.length === 0) {
        $container.addClass('d-none');
        $emptyState.removeClass('d-none');
        return;
    }
    
    $container.removeClass('d-none');
    $emptyState.addClass('d-none');
    
    const itemsHtml = items.map(item => `
        <div class="wishlist-item" data-product-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.svg'">
                ${!item.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
            </div>
            <div class="item-details">
                <h6 class="item-name">${item.name}</h6>
                <div class="item-rating">
                    ${generateStars(item.rating)}
                    <span class="rating-count">(${item.rating})</span>
                </div>
                <div class="item-price">
                    <span class="current-price">Rs. ${item.price.toLocaleString()}</span>
                    ${item.originalPrice ? `<span class="original-price">Rs. ${item.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="item-meta">
                    <small class="text-muted">Added on ${formatDate(item.dateAdded)}</small>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary btn-sm ${!item.inStock ? 'disabled' : ''}" 
                        onclick="addToCartFromWishlist(${item.id})" 
                        ${!item.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart me-1"></i>
                    ${item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick="removeFromWishlist(${item.id})">
                    <i class="fas fa-times me-1"></i>Remove
                </button>
            </div>
        </div>
    `).join('');
    
    $container.html(itemsHtml);
}

function initWishlistFeatures() {
    // Clear all wishlist
    $('#clearWishlistBtn').on('click', function() {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            clearWishlist();
        }
    });
    
    // Add all to cart
    $('#addAllToCartBtn').on('click', function() {
        addAllToCart();
    });
}

// =====================
// UTILITY FUNCTIONS
// =====================
function loadUserInfo() {
    // Load user info for sidebar
    const user = {
        name: 'Sarah Ahmed',
        email: 'sarah@example.com',
        avatar: 'images/user-avatar.svg'
    };
    
    $('#userName').text(user.name);
    $('#userEmail').text(user.email);
    $('#userAvatar').attr('src', user.avatar);
}

function updateUserInfo(userData) {
    const fullName = `${userData.firstName} ${userData.lastName}`;
    $('#userName').text(fullName);
    $('#userEmail').text(userData.email);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-warning"></i>';
    }
    
    return starsHtml;
}

function updateWishlistCount() {
    const count = window.wishlistItems ? window.wishlistItems.length : 0;
    $('#wishlistItemCount').text(count);
    $('#wishlistBadge').text(count);
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
    $('.cart-count').text(cart.length);
}

function checkPasswordStrength(password) {
    const $indicator = $('#passwordStrength');
    
    if (!password) {
        $indicator.empty();
        return;
    }
    
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Lowercase letter');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Uppercase letter');
    
    if (/\d/.test(password)) strength++;
    else feedback.push('Number');
    
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    else feedback.push('Special character');
    
    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['danger', 'danger', 'warning', 'info', 'success'];
    
    $indicator.html(`
        <div class="password-strength-meter mt-1">
            <div class="strength-bar">
                <div class="strength-fill bg-${strengthColors[strength]}" style="width: ${(strength / 5) * 100}%"></div>
            </div>
            <small class="text-${strengthColors[strength]}">${strengthLevels[strength] || 'Very Weak'}</small>
            ${feedback.length > 0 ? `<div class="feedback"><small class="text-muted">Need: ${feedback.join(', ')}</small></div>` : ''}
        </div>
    `);
}

function validatePasswordMatch() {
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    const $confirmField = $('#confirmPassword');
    
    if (confirmPassword && newPassword !== confirmPassword) {
        $confirmField.addClass('is-invalid');
        if (!$confirmField.next('.invalid-feedback').length) {
            $confirmField.after('<div class="invalid-feedback">Passwords do not match</div>');
        }
    } else {
        $confirmField.removeClass('is-invalid');
        $confirmField.next('.invalid-feedback').remove();
    }
}

// =====================
// GLOBAL FUNCTIONS
// =====================
window.viewOrderDetails = function(orderId) {
    const order = window.allOrders?.find(o => o.id === orderId);
    if (!order) return;
    
    const detailsHtml = `
        <div class="order-details">
            <h6>Order #${order.id}</h6>
            <p><strong>Date:</strong> ${formatDate(order.date)}</p>
            <p><strong>Status:</strong> <span class="badge bg-primary">${getStatusText(order.status)}</span></p>
            ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.trackingNumber}</p>` : ''}
            
            <h6 class="mt-3">Items:</h6>
            <div class="order-items-list">
                ${order.items.map(item => `
                    <div class="d-flex align-items-center mb-2">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                        <div class="flex-grow-1">
                            <strong>${item.name}</strong><br>
                            <small>Qty: ${item.quantity} × Rs. ${item.price.toLocaleString()}</small>
                        </div>
                        <div class="text-end">
                            Rs. ${(item.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total mt-3 pt-3 border-top">
                <strong>Total: Rs. ${order.total.toLocaleString()}</strong>
            </div>
        </div>
    `;
    
    $('#orderDetailsContent').html(detailsHtml);
    $('#orderDetailsModal').modal('show');
};

window.trackOrder = function(orderId) {
    alert(`Tracking feature will open for order ${orderId}. Integration with courier APIs coming soon!`);
};

window.reorderItems = function(orderId) {
    const order = window.allOrders?.find(o => o.id === orderId);
    if (!order) return;
    
    if (confirm(`Add all items from order ${orderId} to your cart?`)) {
        order.items.forEach(item => {
            // Add to cart logic here
            console.log(`Adding ${item.name} to cart`);
        });
        alert('Items added to cart successfully!');
    }
};

window.addToCartFromWishlist = function(productId) {
    const item = window.wishlistItems?.find(item => item.id === productId);
    if (!item) return;
    
    // Add to cart logic
    const cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
    cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
    });
    localStorage.setItem('sanoria_cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show success message
    alert(`${item.name} added to cart!`);
};

window.removeFromWishlist = function(productId) {
    if (confirm('Remove this item from your wishlist?')) {
        window.wishlistItems = window.wishlistItems?.filter(item => item.id !== productId);
        displayWishlistItems(window.wishlistItems);
        updateWishlistCount();
        
        // Update localStorage
        localStorage.setItem('sanoria_wishlist', JSON.stringify(window.wishlistItems));
        
        alert('Item removed from wishlist!');
    }
};

window.clearWishlist = function() {
    window.wishlistItems = [];
    displayWishlistItems([]);
    updateWishlistCount();
    localStorage.removeItem('sanoria_wishlist');
    alert('Wishlist cleared!');
};

window.addAllToCart = function() {
    const availableItems = window.wishlistItems?.filter(item => item.inStock) || [];
    
    if (availableItems.length === 0) {
        alert('No items available to add to cart.');
        return;
    }
    
    if (confirm(`Add ${availableItems.length} items to your cart?`)) {
        const cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
        
        availableItems.forEach(item => {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                image: item.image
            });
        });
        
        localStorage.setItem('sanoria_cart', JSON.stringify(cart));
        updateCartDisplay();
        
        alert(`${availableItems.length} items added to cart!`);
    }
};

console.log('📊 Account management system loaded successfully');