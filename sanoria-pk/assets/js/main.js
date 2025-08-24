// Sanoria.pk - Main JavaScript

$(document).ready(function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Add to Cart functionality
    $('.add-to-cart').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('id');
        const button = $(this);
        const originalText = button.html();
        
        button.html('<span class="loading"></span> Adding...');
        button.prop('disabled', true);
        
        $.ajax({
            url: 'api/cart.php',
            type: 'POST',
            data: {
                action: 'add',
                product_id: productId,
                quantity: 1
            },
            success: function(response) {
                if(response.success) {
                    button.html('<i class="fas fa-check"></i> Added');
                    updateCartCount();
                    showNotification('Product added to cart!', 'success');
                    
                    setTimeout(function() {
                        button.html(originalText);
                        button.prop('disabled', false);
                    }, 2000);
                } else {
                    showNotification(response.message || 'Error adding to cart', 'error');
                    button.html(originalText);
                    button.prop('disabled', false);
                }
            },
            error: function() {
                showNotification('Error adding to cart', 'error');
                button.html(originalText);
                button.prop('disabled', false);
            }
        });
    });

    // Add to Wishlist functionality
    $('.add-to-wishlist').on('click', function(e) {
        e.preventDefault();
        const productId = $(this).data('id');
        const button = $(this);
        
        $.ajax({
            url: 'api/wishlist.php',
            type: 'POST',
            data: {
                action: 'toggle',
                product_id: productId
            },
            success: function(response) {
                if(response.success) {
                    if(response.added) {
                        button.addClass('active');
                        showNotification('Added to wishlist!', 'success');
                    } else {
                        button.removeClass('active');
                        showNotification('Removed from wishlist!', 'info');
                    }
                    updateWishlistCount();
                } else {
                    showNotification(response.message || 'Error updating wishlist', 'error');
                }
            },
            error: function() {
                showNotification('Please login to add to wishlist', 'warning');
            }
        });
    });

    // Chatbot functionality
    $('#chatbotToggle').on('click', function() {
        $('#chatbot').toggle();
        $(this).hide();
    });

    $('#closeChatbot').on('click', function() {
        $('#chatbot').hide();
        $('#chatbotToggle').show();
    });

    $('#chatForm').on('submit', function(e) {
        e.preventDefault();
        const input = $('#chatInput');
        const message = input.val().trim();
        
        if(message) {
            // Add user message
            addChatMessage(message, 'user');
            input.val('');
            
            // Send to server
            $.ajax({
                url: 'api/chatbot.php',
                type: 'POST',
                data: { message: message },
                success: function(response) {
                    if(response.success) {
                        addChatMessage(response.reply, 'bot');
                    } else {
                        addChatMessage('Sorry, I couldn\'t process your request. Please try again.', 'bot');
                    }
                },
                error: function() {
                    addChatMessage('Sorry, there was an error. Please try again later.', 'bot');
                }
            });
        }
    });

    // Newsletter subscription
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const email = form.find('input[type="email"]').val();
        const button = form.find('button');
        const originalText = button.text();
        
        button.html('<span class="loading"></span> Subscribing...');
        button.prop('disabled', true);
        
        $.ajax({
            url: 'api/newsletter.php',
            type: 'POST',
            data: { email: email },
            success: function(response) {
                if(response.success) {
                    showNotification('Successfully subscribed to newsletter!', 'success');
                    form[0].reset();
                } else {
                    showNotification(response.message || 'Error subscribing', 'error');
                }
                button.text(originalText);
                button.prop('disabled', false);
            },
            error: function() {
                showNotification('Error subscribing to newsletter', 'error');
                button.text(originalText);
                button.prop('disabled', false);
            }
        });
    });

    // Notification dropdown
    $('.notification-icon').on('click', function(e) {
        e.preventDefault();
        loadNotifications();
    });

    // Search functionality
    $('.search-form').on('submit', function(e) {
        e.preventDefault();
        const query = $(this).find('input').val().trim();
        if(query) {
            window.location.href = 'search.php?q=' + encodeURIComponent(query);
        }
    });

    // Product quick view
    $(document).on('click', '.quick-view', function(e) {
        e.preventDefault();
        const productId = $(this).data('id');
        loadProductQuickView(productId);
    });

    // Helper Functions
    function updateCartCount() {
        $.get('api/cart.php?action=count', function(response) {
            if(response.success) {
                $('.header-icons .fa-shopping-cart').siblings('.badge').text(response.count);
            }
        });
    }

    function updateWishlistCount() {
        $.get('api/wishlist.php?action=count', function(response) {
            if(response.success) {
                $('.header-icons .fa-heart').siblings('.badge').text(response.count);
            }
        });
    }

    function addChatMessage(message, type) {
        const messageHtml = `
            <div class="chat-message ${type}-message">
                <p>${message}</p>
            </div>
        `;
        $('#chatbotBody').append(messageHtml);
        $('#chatbotBody').scrollTop($('#chatbotBody')[0].scrollHeight);
    }

    function showNotification(message, type) {
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 
                          type === 'warning' ? 'alert-warning' : 'alert-info';
        
        const notification = $(`
            <div class="alert ${alertClass} alert-dismissible fade show notification-toast" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            notification.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

    function loadNotifications() {
        $.get('api/notifications.php', function(response) {
            if(response.success) {
                // Show notifications in a dropdown or modal
                console.log(response.notifications);
            }
        });
    }

    function loadProductQuickView(productId) {
        $.get('api/product.php?id=' + productId, function(response) {
            if(response.success) {
                // Show product details in a modal
                console.log(response.product);
            }
        });
    }

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Product image zoom on hover
    $('.product-image').on('mouseenter', function() {
        $(this).find('img').css('transform', 'scale(1.2)');
    }).on('mouseleave', function() {
        $(this).find('img').css('transform', 'scale(1)');
    });

    // Cart quantity update
    $(document).on('change', '.cart-quantity', function() {
        const productId = $(this).data('id');
        const quantity = $(this).val();
        updateCartQuantity(productId, quantity);
    });

    function updateCartQuantity(productId, quantity) {
        $.ajax({
            url: 'api/cart.php',
            type: 'POST',
            data: {
                action: 'update',
                product_id: productId,
                quantity: quantity
            },
            success: function(response) {
                if(response.success) {
                    location.reload(); // Reload to update totals
                } else {
                    showNotification('Error updating quantity', 'error');
                }
            }
        });
    }

    // Remove from cart
    $(document).on('click', '.remove-from-cart', function(e) {
        e.preventDefault();
        const productId = $(this).data('id');
        
        if(confirm('Are you sure you want to remove this item?')) {
            $.ajax({
                url: 'api/cart.php',
                type: 'POST',
                data: {
                    action: 'remove',
                    product_id: productId
                },
                success: function(response) {
                    if(response.success) {
                        location.reload();
                    } else {
                        showNotification('Error removing item', 'error');
                    }
                }
            });
        }
    });

    // Apply coupon code
    $('#applyCoupon').on('click', function() {
        const code = $('#couponCode').val().trim();
        if(code) {
            $.ajax({
                url: 'api/coupon.php',
                type: 'POST',
                data: { code: code },
                success: function(response) {
                    if(response.success) {
                        showNotification('Coupon applied successfully!', 'success');
                        location.reload();
                    } else {
                        showNotification(response.message || 'Invalid coupon code', 'error');
                    }
                }
            });
        }
    });

    // QR code scanner initialization (requires additional library)
    if($('#qr-reader').length) {
        // Initialize QR code scanner
        // This would require a QR code scanning library like qr-scanner.js
    }

    // Skin type quiz
    $('#skinTypeQuiz').on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serialize();
        
        $.ajax({
            url: 'api/skin-quiz.php',
            type: 'POST',
            data: formData,
            success: function(response) {
                if(response.success) {
                    $('#quizResult').html(`
                        <h4>Your skin type is: ${response.skinType}</h4>
                        <p>${response.description}</p>
                        <a href="skin-type.php?type=${response.skinType}" class="btn btn-primary">
                            View Recommended Products
                        </a>
                    `);
                }
            }
        });
    });
});

// Additional notification styles
const notificationStyles = `
<style>
.notification-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

$('head').append(notificationStyles);