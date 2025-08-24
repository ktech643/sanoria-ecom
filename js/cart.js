/**
 * Shopping Cart JavaScript for Sanoria.pk
 * Handles cart functionality, quantity updates, and checkout process
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // GLOBAL VARIABLES
    // =====================
    let cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
    let appliedPromo = JSON.parse(localStorage.getItem('sanoria_applied_promo')) || null;

    // =====================
    // INITIALIZATION
    // =====================
    initCartPage();
    initQuantityControls();
    initPromoCode();
    initCheckout();
    loadCartItems();
    updateCartTotals();

    // =====================
    // CART PAGE INITIALIZATION
    // =====================
    function initCartPage() {
        // Check if cart is empty
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }

        // Initialize item actions
        initItemActions();
        
        // Apply any existing promo code
        if (appliedPromo) {
            applyPromoCode(appliedPromo.code, false);
        }

        // Update cart count in header
        updateHeaderCartCount();
    }

    function showEmptyCart() {
        $('#cartItems').addClass('d-none');
        $('#emptyCart').removeClass('d-none');
        $('.cart-summary').addClass('d-none');
    }

    function hideEmptyCart() {
        $('#cartItems').removeClass('d-none');
        $('#emptyCart').addClass('d-none');
        $('.cart-summary').removeClass('d-none');
    }

    // =====================
    // LOAD CART ITEMS
    // =====================
    function loadCartItems() {
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }

        const $cartItems = $('#cartItems');
        $cartItems.empty();

        cart.forEach(item => {
            const cartItemHtml = createCartItemHTML(item);
            $cartItems.append(cartItemHtml);
        });

        hideEmptyCart();
        initItemActions();
    }

    function createCartItemHTML(item) {
        const originalPrice = item.originalPrice ? 
            `<div class="price-original text-muted text-decoration-line-through">Rs. ${item.originalPrice.toLocaleString()}</div>` : '';
        
        const stockStatus = item.stock > 0 ? 
            '<span class="item-stock text-success">In Stock</span>' : 
            '<span class="item-stock text-danger">Out of Stock</span>';

        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid">
                </div>
                <div class="item-details">
                    <h5 class="item-name">${item.name}</h5>
                    <p class="item-description">${item.description || 'Premium beauty product for your skincare routine.'}</p>
                    <div class="item-meta">
                        <span class="item-sku">SKU: ${item.sku || 'N/A'}</span>
                        ${stockStatus}
                    </div>
                </div>
                <div class="item-quantity">
                    <label class="form-label">Quantity</label>
                    <div class="quantity-controls">
                        <button class="btn btn-outline-secondary btn-sm quantity-decrease" type="button" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" max="10">
                        <button class="btn btn-outline-secondary btn-sm quantity-increase" type="button" ${item.quantity >= 10 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="item-price">
                    <div class="price-current">Rs. ${item.price.toLocaleString()}</div>
                    ${originalPrice}
                </div>
                <div class="item-total">
                    <div class="total-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-outline-danger btn-sm remove-item" title="Remove from cart">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm move-to-wishlist" title="Move to wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // =====================
    // QUANTITY CONTROLS
    // =====================
    function initQuantityControls() {
        $(document).on('click', '.quantity-decrease', function() {
            const $item = $(this).closest('.cart-item');
            const $input = $item.find('.quantity-input');
            const currentQty = parseInt($input.val());
            
            if (currentQty > 1) {
                updateQuantity($item, currentQty - 1);
            }
        });

        $(document).on('click', '.quantity-increase', function() {
            const $item = $(this).closest('.cart-item');
            const $input = $item.find('.quantity-input');
            const currentQty = parseInt($input.val());
            
            if (currentQty < 10) {
                updateQuantity($item, currentQty + 1);
            }
        });

        $(document).on('change', '.quantity-input', function() {
            const $item = $(this).closest('.cart-item');
            let newQty = parseInt($(this).val());
            
            // Validate quantity
            if (isNaN(newQty) || newQty < 1) {
                newQty = 1;
            } else if (newQty > 10) {
                newQty = 10;
            }
            
            $(this).val(newQty);
            updateQuantity($item, newQty);
        });
    }

    function updateQuantity($item, newQuantity) {
        const productId = parseInt($item.data('product-id'));
        const $input = $item.find('.quantity-input');
        const $decreaseBtn = $item.find('.quantity-decrease');
        const $increaseBtn = $item.find('.quantity-increase');
        const $totalPrice = $item.find('.total-price');

        // Add updating state
        $item.addClass('updating');

        // Find item in cart
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) {
            showNotification('Item not found in cart', 'error');
            $item.removeClass('updating');
            return;
        }

        // Update quantity
        cartItem.quantity = newQuantity;
        $input.val(newQuantity);

        // Update total price for this item
        const itemTotal = cartItem.price * newQuantity;
        $totalPrice.text(`Rs. ${itemTotal.toLocaleString()}`);

        // Update button states
        $decreaseBtn.prop('disabled', newQuantity <= 1);
        $increaseBtn.prop('disabled', newQuantity >= 10);

        // Save to localStorage
        saveCartToStorage();

        // Update cart totals
        setTimeout(() => {
            updateCartTotals();
            updateHeaderCartCount();
            $item.removeClass('updating');
            
            showNotification('Quantity updated', 'success', 2000);
        }, 300);
    }

    // =====================
    // ITEM ACTIONS
    // =====================
    function initItemActions() {
        // Remove item
        $(document).on('click', '.remove-item', function(e) {
            e.preventDefault();
            const $item = $(this).closest('.cart-item');
            const productId = parseInt($item.data('product-id'));
            
            removeItemFromCart($item, productId);
        });

        // Move to wishlist
        $(document).on('click', '.move-to-wishlist', function(e) {
            e.preventDefault();
            const $item = $(this).closest('.cart-item');
            const productId = parseInt($item.data('product-id'));
            
            moveToWishlist($item, productId);
        });

        // Add recommended products
        $(document).on('click', '.recommended-details .btn', function(e) {
            e.preventDefault();
            addRecommendedProduct();
        });
    }

    function removeItemFromCart($item, productId) {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            // Add removing animation
            $item.addClass('removing');
            
            setTimeout(() => {
                // Remove from cart array
                cart = cart.filter(item => item.id !== productId);
                
                // Remove from DOM
                $item.remove();
                
                // Update storage and totals
                saveCartToStorage();
                updateCartTotals();
                updateHeaderCartCount();
                
                // Check if cart is empty
                if (cart.length === 0) {
                    showEmptyCart();
                }
                
                showNotification('Item removed from cart', 'info');
            }, 300);
        }
    }

    function moveToWishlist($item, productId) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        // Get existing wishlist
        let wishlist = JSON.parse(localStorage.getItem('sanoria_wishlist')) || [];
        
        // Check if item already in wishlist
        const existingWishlistItem = wishlist.find(item => item.id === productId);
        
        if (!existingWishlistItem) {
            // Add to wishlist
            wishlist.push({
                id: cartItem.id,
                name: cartItem.name,
                price: cartItem.price,
                image: cartItem.image,
                dateAdded: new Date().toISOString()
            });
            
            localStorage.setItem('sanoria_wishlist', JSON.stringify(wishlist));
        }

        // Remove from cart
        removeItemFromCart($item, productId);
        
        showNotification('Item moved to wishlist', 'success');
    }

    function addRecommendedProduct() {
        // Simulate adding recommended product
        const recommendedProduct = {
            id: Math.floor(Math.random() * 1000) + 100,
            name: 'Gentle Cleansing Foam',
            price: 749,
            quantity: 1,
            image: 'images/products/product-3.jpg',
            description: 'Gentle sulfate-free cleanser that removes impurities while maintaining skin barrier.'
        };

        // Check if already in cart
        const existingItem = cart.find(item => item.id === recommendedProduct.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification('Quantity updated in cart', 'success');
        } else {
            cart.push(recommendedProduct);
            showNotification('Product added to cart', 'success');
        }

        saveCartToStorage();
        loadCartItems();
        updateCartTotals();
        updateHeaderCartCount();
    }

    // =====================
    // PROMO CODE
    // =====================
    function initPromoCode() {
        $('#applyPromo').on('click', function() {
            const promoCode = $('#promoCode').val().trim().toUpperCase();
            if (promoCode) {
                applyPromoCode(promoCode);
            }
        });

        $('#promoCode').on('keypress', function(e) {
            if (e.which === 13) {
                $('#applyPromo').click();
            }
        });
    }

    function applyPromoCode(code, showMessages = true) {
        const validPromoCodes = {
            'WELCOME20': { type: 'percentage', value: 20, minAmount: 1000 },
            'SAVE500': { type: 'fixed', value: 500, minAmount: 3000 },
            'FREESHIP': { type: 'free_shipping', value: 0, minAmount: 1500 },
            'SKINCARE15': { type: 'percentage', value: 15, minAmount: 800 }
        };

        const promo = validPromoCodes[code];
        const subtotal = calculateSubtotal();
        const $promoMessage = $('.promo-message');

        if (!promo) {
            if (showMessages) {
                $promoMessage.removeClass('success').addClass('error')
                    .text('Invalid promo code');
            }
            return false;
        }

        if (subtotal < promo.minAmount) {
            if (showMessages) {
                $promoMessage.removeClass('success').addClass('error')
                    .text(`Minimum order amount of Rs. ${promo.minAmount.toLocaleString()} required`);
            }
            return false;
        }

        // Apply promo code
        appliedPromo = { code, ...promo };
        localStorage.setItem('sanoria_applied_promo', JSON.stringify(appliedPromo));
        
        $('#promoCode').val(code);
        $promoMessage.removeClass('error').addClass('success')
            .text(`Promo code "${code}" applied successfully!`);

        updateCartTotals();
        
        if (showMessages) {
            showNotification(`Promo code applied! You saved ${formatDiscount(promo)}`, 'success');
        }

        return true;
    }

    function removePromoCode() {
        appliedPromo = null;
        localStorage.removeItem('sanoria_applied_promo');
        $('#promoCode').val('');
        $('.promo-message').text('');
        updateCartTotals();
        showNotification('Promo code removed', 'info');
    }

    function formatDiscount(promo) {
        if (promo.type === 'percentage') {
            return `${promo.value}%`;
        } else if (promo.type === 'fixed') {
            return `Rs. ${promo.value.toLocaleString()}`;
        } else {
            return 'Free shipping';
        }
    }

    // =====================
    // CART CALCULATIONS
    // =====================
    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function calculateDiscount(subtotal) {
        if (!appliedPromo) return 0;

        if (appliedPromo.type === 'percentage') {
            return Math.round(subtotal * appliedPromo.value / 100);
        } else if (appliedPromo.type === 'fixed') {
            return Math.min(appliedPromo.value, subtotal);
        }

        return 0;
    }

    function calculateShipping(subtotal) {
        const freeShippingThreshold = 2000;
        
        if (appliedPromo && appliedPromo.type === 'free_shipping') {
            return 0;
        }
        
        return subtotal >= freeShippingThreshold ? 0 : 150;
    }

    function updateCartTotals() {
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount(subtotal);
        const discountedSubtotal = subtotal - discount;
        const shipping = calculateShipping(discountedSubtotal);
        const tax = 0; // No tax for now
        const total = discountedSubtotal + shipping + tax;

        // Update display
        $('.subtotal').text(`Rs. ${subtotal.toLocaleString()}`);
        $('.discount').text(`-Rs. ${discount.toLocaleString()}`);
        $('.shipping').text(shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`);
        $('.tax').text(`Rs. ${tax.toLocaleString()}`);
        $('.total-amount').text(`Rs. ${total.toLocaleString()}`);

        // Show/hide discount row
        if (discount > 0) {
            $('.discount-row').removeClass('d-none');
        } else {
            $('.discount-row').addClass('d-none');
        }

        // Update item count
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        $('.detail-row:first span:first-child').text(`Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})`);

        // Update shipping progress
        updateShippingProgress(subtotal);
    }

    function updateShippingProgress(subtotal) {
        const freeShippingThreshold = 2000;
        const $shippingProgress = $('.shipping-progress');
        const $shippingMessage = $('.shipping-message');
        const $progressBar = $('.progress-bar');

        if (subtotal >= freeShippingThreshold) {
            $shippingMessage.removeClass('text-warning').addClass('text-success')
                .html('<i class="fas fa-check-circle me-2"></i>You qualify for FREE shipping!');
            $progressBar.removeClass('bg-warning').addClass('bg-success').css('width', '100%');
        } else {
            const remaining = freeShippingThreshold - subtotal;
            const progress = (subtotal / freeShippingThreshold) * 100;
            
            $shippingMessage.removeClass('text-success').addClass('text-warning')
                .html(`<i class="fas fa-truck me-2"></i>Add Rs. ${remaining.toLocaleString()} more for FREE shipping!`);
            $progressBar.removeClass('bg-success').addClass('bg-warning').css('width', `${progress}%`);
        }
    }

    // =====================
    // CHECKOUT
    // =====================
    function initCheckout() {
        $('.checkout-btn').on('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'warning');
                return;
            }

            // Check stock availability
            const outOfStockItems = cart.filter(item => item.stock === 0);
            if (outOfStockItems.length > 0) {
                showNotification('Some items in your cart are out of stock', 'error');
                return;
            }

            proceedToCheckout();
        });
    }

    function proceedToCheckout() {
        // Prepare checkout data
        const checkoutData = {
            items: cart,
            subtotal: calculateSubtotal(),
            discount: calculateDiscount(calculateSubtotal()),
            shipping: calculateShipping(calculateSubtotal() - calculateDiscount(calculateSubtotal())),
            total: calculateSubtotal() - calculateDiscount(calculateSubtotal()) + calculateShipping(calculateSubtotal() - calculateDiscount(calculateSubtotal())),
            promoCode: appliedPromo ? appliedPromo.code : null
        };

        // Store checkout data
        localStorage.setItem('sanoria_checkout_data', JSON.stringify(checkoutData));

        // Show loading state
        const $btn = $('.checkout-btn');
        const originalText = $btn.html();
        $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...').prop('disabled', true);

        // Simulate checkout process
        setTimeout(() => {
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        }, 1500);
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    function saveCartToStorage() {
        localStorage.setItem('sanoria_cart', JSON.stringify(cart));
    }

    function updateHeaderCartCount() {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        $('.cart-count').text(itemCount);
        
        if (itemCount > 0) {
            $('.cart-count').show();
        } else {
            $('.cart-count').hide();
        }
    }

    function showNotification(message, type = 'info', duration = 4000) {
        const notificationTypes = {
            success: { icon: 'fa-check-circle', class: 'alert-success' },
            error: { icon: 'fa-exclamation-circle', class: 'alert-danger' },
            warning: { icon: 'fa-exclamation-triangle', class: 'alert-warning' },
            info: { icon: 'fa-info-circle', class: 'alert-info' }
        };

        const notificationType = notificationTypes[type] || notificationTypes.info;
        
        const notificationHtml = `
            <div class="alert ${notificationType.class} alert-dismissible fade show cart-notification" role="alert">
                <i class="fas ${notificationType.icon} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Create notification container if it doesn't exist
        if (!$('.cart-notification-container').length) {
            $('body').append('<div class="cart-notification-container position-fixed top-0 end-0 p-3" style="z-index: 9999; margin-top: 80px;"></div>');
        }

        const $notification = $(notificationHtml);
        $('.cart-notification-container').append($notification);

        // Auto-remove notification
        if (duration > 0) {
            setTimeout(() => {
                $notification.alert('close');
            }, duration);
        }
    }

    // =====================
    // DEMO FUNCTIONS
    // =====================
    
    // Simulate adding sample items if cart is empty (for demo)
    if (cart.length === 0) {
        const sampleItems = [
            {
                id: 1,
                name: 'Hydrating Facial Serum',
                price: 1299,
                originalPrice: 1599,
                quantity: 2,
                image: 'images/products/product-1.jpg',
                description: 'Deeply hydrating serum with hyaluronic acid for plump, moisturized skin.',
                sku: 'HFS-001',
                stock: 50
            },
            {
                id: 2,
                name: 'Vitamin C Brightening Serum',
                price: 1299,
                originalPrice: 1599,
                quantity: 1,
                image: 'images/products/product-2.jpg',
                description: 'Brightening serum with 20% Vitamin C for radiant, even-toned skin.',
                sku: 'VCS-002',
                stock: 35
            }
        ];

        cart = sampleItems;
        saveCartToStorage();
    }

    // =====================
    // EVENT HANDLERS
    // =====================
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        // Reload cart data if returning to cart page
        cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
        loadCartItems();
        updateCartTotals();
    });

    // Handle page unload
    window.addEventListener('beforeunload', function() {
        // Save any pending changes
        saveCartToStorage();
    });

    console.log('🛒 Shopping cart initialized');
});

// =====================
// ADDITIONAL CSS FOR NOTIFICATIONS
// =====================
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .cart-notification {
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: none;
            border-radius: 8px;
            max-width: 400px;
        }
        
        .cart-notification .btn-close {
            padding: 0.5rem;
        }
        
        .cart-notification-container {
            pointer-events: none;
        }
        
        .cart-notification-container .alert {
            pointer-events: auto;
        }
        
        .updating {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .removing {
            animation: slideOutRight 0.3s ease-out forwards;
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
                max-height: 200px;
                margin-bottom: 1rem;
            }
            to {
                opacity: 0;
                transform: translateX(100%);
                max-height: 0;
                margin-bottom: 0;
                padding-top: 0;
                padding-bottom: 0;
            }
        }
    `)
    .appendTo('head');