/**
 * Checkout JavaScript for Sanoria.pk
 * Handles checkout process, payment methods, order processing
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // GLOBAL VARIABLES
    // =====================
    
    let cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
    let selectedShipping = 'standard';
    let selectedPayment = 'cod';
    let shippingCost = 200;
    let discountAmount = 0;
    let appliedPromo = null;

    // =====================
    // INITIALIZATION
    // =====================
    
    initCheckoutPage();
    loadOrderSummary();
    initEventHandlers();
    validateFormFields();

    function initCheckoutPage() {
        // Check if cart is empty
        if (cart.length === 0) {
            showEmptyCartMessage();
            return;
        }

        // Update cart count
        updateCartDisplay();
        
        // Calculate initial totals
        calculateTotals();
        
        // Load saved customer info if available
        loadSavedCustomerInfo();
        
        console.log('✅ Checkout page initialized');
    }

    function showEmptyCartMessage() {
        $('.checkout-main').html(`
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6 text-center py-5">
                        <i class="fas fa-shopping-cart text-muted mb-3" style="font-size: 4rem;"></i>
                        <h3>Your cart is empty</h3>
                        <p class="text-muted">Add some products to your cart to proceed with checkout.</p>
                        <a href="category.html" class="btn btn-primary">Start Shopping</a>
                    </div>
                </div>
            </div>
        `);
    }

    // =====================
    // ORDER SUMMARY
    // =====================
    
    function loadOrderSummary() {
        if (cart.length === 0) return;

        const itemsHtml = cart.map(item => `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='images/placeholder.svg'">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    ${item.size ? `<div class="item-variant">Size: ${item.size}</div>` : ''}
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                </div>
                <div class="item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        `).join('');

        $('#summaryItems').html(itemsHtml);
    }

    function calculateTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Check for free shipping
        if (subtotal >= 2000) {
            shippingCost = 0;
        }
        
        const total = subtotal + shippingCost - discountAmount;

        // Update display
        $('#subtotal').text(`Rs. ${subtotal.toLocaleString()}`);
        $('#shippingCost').text(shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost.toLocaleString()}`);
        $('#grandTotal').text(`Rs. ${total.toLocaleString()}`);

        if (discountAmount > 0) {
            $('.discount-row').removeClass('d-none');
            $('#discountAmount').text(`-Rs. ${discountAmount.toLocaleString()}`);
        } else {
            $('.discount-row').addClass('d-none');
        }
    }

    // =====================
    // EVENT HANDLERS
    // =====================
    
    function initEventHandlers() {
        // Shipping method selection
        $('.shipping-option').on('click', function() {
            $('.shipping-option').removeClass('active');
            $(this).addClass('active');
            
            selectedShipping = $(this).data('method');
            shippingCost = $(this).data('price');
            
            // Update shipping radio button
            $(this).find('input[type="radio"]').prop('checked', true);
            
            calculateTotals();
            updateProgressStep();
        });

        // Payment method selection
        $('.payment-option').on('click', function() {
            $('.payment-option').removeClass('active');
            $(this).addClass('active');
            
            selectedPayment = $(this).data('method');
            
            // Update payment radio button
            $(this).find('input[type="radio"]').prop('checked', true);
            
            // Show/hide payment forms
            showPaymentForm(selectedPayment);
            updateProgressStep();
        });

        // Promo code application
        $('#applyPromo').on('click', applyPromoCode);
        $('#promoCode').on('keypress', function(e) {
            if (e.which === 13) {
                applyPromoCode();
            }
        });

        // Form validation
        $('input, select, textarea').on('blur', validateField);
        $('input, select, textarea').on('input', clearValidation);

        // Proceed to payment
        $('#proceedToPayment').on('click', proceedToPayment);

        // City selection handler
        $('#city').on('change', function() {
            const city = $(this).val();
            updateShippingOptions(city);
        });
    }

    function showPaymentForm(method) {
        // Hide all payment forms
        $('.payment-form').addClass('d-none');
        
        // Show selected payment form
        if (method !== 'cod') {
            $(`#${method}Form`).removeClass('d-none');
        }
    }

    function updateShippingOptions(city) {
        const overnightCities = ['karachi', 'lahore', 'islamabad', 'rawalpindi'];
        const overnightOption = $('.shipping-option[data-method="overnight"]');
        
        if (overnightCities.includes(city)) {
            overnightOption.show();
        } else {
            overnightOption.hide();
            // If overnight was selected, switch to express
            if (selectedShipping === 'overnight') {
                $('.shipping-option[data-method="express"]').click();
            }
        }
    }

    // =====================
    // PROMO CODE HANDLING
    // =====================
    
    function applyPromoCode() {
        const promoCode = $('#promoCode').val().trim().toUpperCase();
        
        if (!promoCode) {
            showPromoMessage('Please enter a promo code', 'error');
            return;
        }

        // Sample promo codes
        const promoCodes = {
            'WELCOME10': { discount: 10, type: 'percentage', minAmount: 1000 },
            'SAVE200': { discount: 200, type: 'fixed', minAmount: 1500 },
            'NEWCUSTOMER': { discount: 15, type: 'percentage', minAmount: 2000 },
            'FREESHIP': { discount: 0, type: 'freeship', minAmount: 0 }
        };

        const promo = promoCodes[promoCode];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        if (!promo) {
            showPromoMessage('Invalid promo code', 'error');
            return;
        }

        if (subtotal < promo.minAmount) {
            showPromoMessage(`Minimum order amount Rs. ${promo.minAmount.toLocaleString()} required`, 'error');
            return;
        }

        // Apply discount
        appliedPromo = { code: promoCode, ...promo };
        
        if (promo.type === 'percentage') {
            discountAmount = Math.round(subtotal * (promo.discount / 100));
        } else if (promo.type === 'fixed') {
            discountAmount = promo.discount;
        } else if (promo.type === 'freeship') {
            shippingCost = 0;
            discountAmount = 0;
        }

        calculateTotals();
        showPromoMessage(`Promo code applied! You saved Rs. ${discountAmount.toLocaleString()}`, 'success');
        
        // Disable promo input
        $('#promoCode').prop('disabled', true);
        $('#applyPromo').text('Applied').prop('disabled', true);
    }

    function showPromoMessage(message, type) {
        $('#promoMessage').removeClass('success error').addClass(type).text(message);
    }

    // =====================
    // FORM VALIDATION
    // =====================
    
    function validateField() {
        const $field = $(this);
        const value = $field.val().trim();
        const fieldType = $field.attr('type') || 'text';
        const isRequired = $field.prop('required');

        // Clear previous validation
        $field.removeClass('is-valid is-invalid');

        if (isRequired && !value) {
            $field.addClass('is-invalid');
            return false;
        }

        // Specific validation rules
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                $field.addClass('is-invalid');
                return false;
            }
        }

        if (fieldType === 'tel' && value) {
            const phoneRegex = /^(\+92|0)?3[0-9]{2}[-\s]?[0-9]{7}$/;
            if (!phoneRegex.test(value)) {
                $field.addClass('is-invalid');
                return false;
            }
        }

        if (value) {
            $field.addClass('is-valid');
        }

        return true;
    }

    function clearValidation() {
        $(this).removeClass('is-valid is-invalid');
    }

    function validateFormFields() {
        let isValid = true;

        // Validate required fields
        $('input[required], select[required]').each(function() {
            if (!validateField.call(this)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // =====================
    // PROGRESS TRACKING
    // =====================
    
    function updateProgressStep() {
        // Check form completion
        const contactComplete = $('#firstName').val() && $('#lastName').val() && 
                               $('#email').val() && $('#phone').val();
        const shippingComplete = $('#address').val() && $('#city').val();
        const paymentComplete = selectedPayment;

        // Update progress steps
        if (contactComplete && shippingComplete && paymentComplete) {
            $('.step').eq(2).addClass('completed').removeClass('active');
            $('.step').eq(3).addClass('active');
        } else if (contactComplete && shippingComplete) {
            $('.step').eq(1).addClass('completed').removeClass('active');
            $('.step').eq(2).addClass('active');
        } else if (contactComplete) {
            $('.step').eq(0).addClass('completed');
            $('.step').eq(1).addClass('active');
        }
    }

    // =====================
    // ORDER PROCESSING
    // =====================
    
    function proceedToPayment() {
        // Validate all form fields
        if (!validateFormFields()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Collect order data
        const orderData = {
            customer: {
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                email: $('#email').val(),
                phone: $('#phone').val()
            },
            shipping: {
                address: $('#address').val(),
                city: $('#city').val(),
                postalCode: $('#postalCode').val(),
                instructions: $('#deliveryInstructions').val(),
                method: selectedShipping,
                cost: shippingCost
            },
            payment: {
                method: selectedPayment
            },
            items: cart,
            totals: {
                subtotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
                shipping: shippingCost,
                discount: discountAmount,
                total: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + shippingCost - discountAmount
            },
            promo: appliedPromo
        };

        // Process payment based on method
        processPayment(orderData);
    }

    function processPayment(orderData) {
        // Show processing modal
        $('#paymentModal').modal('show');

        // Simulate payment processing
        setTimeout(() => {
            $('#paymentModal').modal('hide');
            
            if (orderData.payment.method === 'cod') {
                // Cash on delivery - immediate confirmation
                completeOrder(orderData);
            } else {
                // Other payment methods - simulate payment gateway
                simulatePaymentGateway(orderData);
            }
        }, 2000);
    }

    function simulatePaymentGateway(orderData) {
        // Simulate payment gateway response
        const paymentSuccess = Math.random() > 0.1; // 90% success rate

        if (paymentSuccess) {
            completeOrder(orderData);
        } else {
            showPaymentError();
        }
    }

    function completeOrder(orderData) {
        // Generate order number
        const orderNumber = generateOrderNumber();
        const estimatedDelivery = calculateDeliveryDate(orderData.shipping.method);

        // Save order to localStorage (in real app, send to server)
        const order = {
            orderNumber,
            ...orderData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        let orders = JSON.parse(localStorage.getItem('sanoria_orders')) || [];
        orders.push(order);
        localStorage.setItem('sanoria_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('sanoria_cart');
        localStorage.removeItem('sanoria_applied_promo');

        // Show confirmation
        $('#orderNumber').text(orderNumber);
        $('#estimatedDelivery').text(estimatedDelivery);
        $('#confirmationModal').modal('show');

        // Track conversion
        console.log('🎉 Order completed:', order);
    }

    function showPaymentError() {
        alert('Payment failed. Please try again or choose a different payment method.');
    }

    function generateOrderNumber() {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `SAN${timestamp}${random}`;
    }

    function calculateDeliveryDate(shippingMethod) {
        const days = {
            'standard': 5,
            'express': 2,
            'overnight': 1
        };

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days[shippingMethod]);
        
        return deliveryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    
    function updateCartDisplay() {
        $('.cart-count').text(cart.length);
    }

    function loadSavedCustomerInfo() {
        // Load from localStorage if available
        const savedCustomer = JSON.parse(localStorage.getItem('sanoria_customer')) || {};
        
        Object.keys(savedCustomer).forEach(key => {
            const $field = $(`#${key}`);
            if ($field.length && savedCustomer[key]) {
                $field.val(savedCustomer[key]);
            }
        });
    }

    function saveCustomerInfo() {
        const customerData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            postalCode: $('#postalCode').val()
        };

        localStorage.setItem('sanoria_customer', JSON.stringify(customerData));
    }

    // Auto-save customer info on field change
    $('input, select').on('change', saveCustomerInfo);

    // =====================
    // GLOBAL FUNCTIONS
    // =====================
    
    window.trackOrder = function() {
        // Redirect to order tracking
        window.location.href = 'order-history.html';
    };

    console.log('✅ Checkout system loaded successfully');
});