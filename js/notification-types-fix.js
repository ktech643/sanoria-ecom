// =====================
// NOTIFICATION TYPES FIX - ORDER TRACKING & PROMOTIONS
// =====================

$(document).ready(function() {
    console.log('📦 Initializing Notification Types Fix...');
    
    // Initialize notification types system
    initializeNotificationTypes();
});

function initializeNotificationTypes() {
    try {
        // 1. Create comprehensive notification system
        createNotificationSystem();
        
        // 2. Initialize order tracking notifications
        initializeOrderTrackingNotifications();
        
        // 3. Initialize promotional notifications
        initializePromotionalNotifications();
        
        // 4. Set up notification handlers
        setupNotificationHandlers();
        
        // 5. Start notification updates
        startNotificationUpdates();
        
        console.log('✅ Notification Types System Initialized');
        
    } catch (error) {
        console.error('❌ Error initializing notification types:', error);
    }
}

function createNotificationSystem() {
    // Enhanced notification structure with proper categorization
    const notificationSystem = {
        categories: {
            order: {
                icon: 'fas fa-shopping-bag',
                color: '#FF0066',
                gradient: 'linear-gradient(135deg, #FF0066, #FF3385)',
                types: ['order_placed', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled']
            },
            promotion: {
                icon: 'fas fa-tag',
                color: '#FF3385',
                gradient: 'linear-gradient(135deg, #FF3385, #FF66B3)',
                types: ['sale', 'discount', 'new_product', 'limited_offer', 'seasonal']
            },
            tracking: {
                icon: 'fas fa-truck',
                color: '#FF66B3',
                gradient: 'linear-gradient(135deg, #FF66B3, #FFB3D9)',
                types: ['shipped', 'in_transit', 'out_for_delivery', 'delivered']
            },
            system: {
                icon: 'fas fa-cog',
                color: '#E6005C',
                gradient: 'linear-gradient(135deg, #E6005C, #CC0052)',
                types: ['welcome', 'profile_update', 'security', 'maintenance']
            },
            account: {
                icon: 'fas fa-user',
                color: '#CC0052',
                gradient: 'linear-gradient(135deg, #CC0052, #990040)',
                types: ['login', 'password_change', 'email_verification', 'profile_complete']
            }
        }
    };
    
    // Store notification system in window for global access
    window.notificationSystem = notificationSystem;
    
    console.log('✅ Notification system structure created');
}

function initializeOrderTrackingNotifications() {
    try {
        // Create realistic order tracking notifications
        const orderNotifications = [
            {
                id: generateNotificationId(),
                category: 'order',
                type: 'order_confirmed',
                title: 'Order Confirmed',
                message: 'Your order #SAN001 has been confirmed and is being prepared',
                details: {
                    orderId: 'SAN001',
                    status: 'confirmed',
                    items: 3,
                    total: 2599
                },
                time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                read: false,
                priority: 'high'
            },
            {
                id: generateNotificationId(),
                category: 'tracking',
                type: 'shipped',
                title: 'Order Shipped',
                message: 'Your order #SAN002 has been shipped via TCS Express',
                details: {
                    orderId: 'SAN002',
                    trackingId: 'TCS123456789',
                    courier: 'TCS Express',
                    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                },
                time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                read: false,
                priority: 'high'
            },
            {
                id: generateNotificationId(),
                category: 'tracking',
                type: 'out_for_delivery',
                title: 'Out for Delivery',
                message: 'Your order #SAN003 is out for delivery and will arrive today',
                details: {
                    orderId: 'SAN003',
                    trackingId: 'LCS987654321',
                    courier: 'Leopard Express',
                    estimatedTime: '2-4 PM'
                },
                time: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                read: false,
                priority: 'urgent'
            },
            {
                id: generateNotificationId(),
                category: 'order',
                type: 'order_delivered',
                title: 'Order Delivered',
                message: 'Your order #SAN004 has been successfully delivered',
                details: {
                    orderId: 'SAN004',
                    deliveredAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    signature: 'Customer Received'
                },
                time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                read: true,
                priority: 'medium'
            }
        ];
        
        // Store order notifications
        storeNotifications(orderNotifications, 'order_tracking');
        
        console.log('✅ Order tracking notifications initialized');
        
    } catch (error) {
        console.error('❌ Error initializing order tracking notifications:', error);
    }
}

function initializePromotionalNotifications() {
    try {
        // Create engaging promotional notifications
        const promotionalNotifications = [
            {
                id: generateNotificationId(),
                category: 'promotion',
                type: 'limited_offer',
                title: '🔥 Flash Sale - 50% OFF',
                message: 'Limited time offer on all Vitamin C serums. Only 4 hours left!',
                details: {
                    discount: 50,
                    category: 'Serums',
                    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
                    code: 'VITC50'
                },
                time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                read: false,
                priority: 'urgent'
            },
            {
                id: generateNotificationId(),
                category: 'promotion',
                type: 'new_product',
                title: '✨ New Arrival Alert',
                message: 'Introducing our new Retinol Night Cream - Now available!',
                details: {
                    productName: 'Retinol Night Cream',
                    price: 2199,
                    category: 'Night Care',
                    discount: 20
                },
                time: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                read: false,
                priority: 'medium'
            },
            {
                id: generateNotificationId(),
                category: 'promotion',
                type: 'seasonal',
                title: '🌸 Spring Collection',
                message: 'Fresh spring skincare collection now available with free delivery',
                details: {
                    collection: 'Spring Care',
                    freeShipping: true,
                    minOrder: 1500
                },
                time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                read: false,
                priority: 'medium'
            },
            {
                id: generateNotificationId(),
                category: 'promotion',
                type: 'discount',
                title: '💎 VIP Customer Reward',
                message: 'Exclusive 30% discount for our valued customers',
                details: {
                    discount: 30,
                    vipCode: 'VIP30',
                    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                },
                time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                read: true,
                priority: 'high'
            }
        ];
        
        // Store promotional notifications
        storeNotifications(promotionalNotifications, 'promotions');
        
        console.log('✅ Promotional notifications initialized');
        
    } catch (error) {
        console.error('❌ Error initializing promotional notifications:', error);
    }
}

function storeNotifications(notifications, type) {
    try {
        // Get existing notifications
        const existingNotifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        
        // Filter out old notifications of this type
        const filteredNotifications = existingNotifications.filter(n => {
            if (type === 'order_tracking') {
                return !['order', 'tracking'].includes(n.category);
            } else if (type === 'promotions') {
                return n.category !== 'promotion';
            }
            return true;
        });
        
        // Add new notifications
        const allNotifications = [...filteredNotifications, ...notifications];
        
        // Sort by time (newest first)
        allNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        // Keep only latest 20 notifications
        const limitedNotifications = allNotifications.slice(0, 20);
        
        // Store updated notifications
        localStorage.setItem('sanoria_notifications', JSON.stringify(limitedNotifications));
        
        console.log(`✅ Stored ${notifications.length} ${type} notifications`);
        
    } catch (error) {
        console.error('❌ Error storing notifications:', error);
    }
}

function setupNotificationHandlers() {
    try {
        // Enhanced notification click handlers
        $(document).off('click.notificationTypes').on('click.notificationTypes', '.notification-item-enhanced', function(e) {
            e.preventDefault();
            
            const notificationId = $(this).data('notification-id');
            const category = $(this).data('category');
            const type = $(this).data('type');
            
            // Handle different notification types
            handleNotificationClick(notificationId, category, type);
        });
        
        // Notification action buttons
        $(document).off('click.notificationActions').on('click.notificationActions', '.notification-action', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const action = $(this).data('action');
            const notificationId = $(this).closest('.notification-item-enhanced').data('notification-id');
            
            handleNotificationAction(action, notificationId);
        });
        
        console.log('✅ Notification handlers set up');
        
    } catch (error) {
        console.error('❌ Error setting up notification handlers:', error);
    }
}

function handleNotificationClick(notificationId, category, type) {
    try {
        // Mark as read
        markNotificationAsRead(notificationId);
        
        // Handle different notification types
        switch (category) {
            case 'order':
            case 'tracking':
                // Redirect to order tracking page
                window.location.href = `order-history.html#order-${notificationId}`;
                break;
                
            case 'promotion':
                // Redirect to promotions page or product
                if (type === 'new_product') {
                    window.location.href = 'new-arrivals.html';
                } else {
                    window.location.href = 'promotions.html';
                }
                break;
                
            case 'system':
                // Redirect to profile or notifications page
                window.location.href = 'profile.html';
                break;
                
            default:
                window.location.href = 'notifications.html';
        }
        
        console.log(`📱 Handled click for ${category}/${type} notification`);
        
    } catch (error) {
        console.error('❌ Error handling notification click:', error);
    }
}

function handleNotificationAction(action, notificationId) {
    try {
        switch (action) {
            case 'track':
                // Open tracking modal or page
                openTrackingModal(notificationId);
                break;
                
            case 'shop':
                // Redirect to shop with discount code
                applyDiscountAndShop(notificationId);
                break;
                
            case 'dismiss':
                // Mark as read and hide
                markNotificationAsRead(notificationId);
                break;
                
            case 'view':
                // View full notification details
                viewNotificationDetails(notificationId);
                break;
        }
        
        console.log(`🎬 Handled action: ${action} for notification ${notificationId}`);
        
    } catch (error) {
        console.error('❌ Error handling notification action:', error);
    }
}

function loadEnhancedNotifications() {
    try {
        const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        const unreadNotifications = notifications.filter(n => !n.read).slice(0, 5);
        
        const $container = $('.notification-quick-list');
        if ($container.length === 0) return;
        
        $container.empty();
        
        if (unreadNotifications.length === 0) {
            $container.html(`
                <div class="dropdown-item text-center text-muted py-4">
                    <i class="fas fa-check-circle me-2 text-success" style="font-size: 1.2rem;"></i>
                    <div class="mt-2">
                        <strong>All caught up!</strong>
                        <br><small>No new notifications</small>
                    </div>
                </div>
            `);
        } else {
            unreadNotifications.forEach(notification => {
                const html = createEnhancedNotificationHTML(notification);
                $container.append(html);
            });
            
            // Add footer
            $container.append(`
                <div class="dropdown-divider"></div>
                <div class="dropdown-item text-center py-2">
                    <a href="notifications.html" class="btn btn-sm btn-outline-primary me-2">
                        <i class="fas fa-eye me-1"></i> View All
                    </a>
                    <button class="btn btn-sm btn-outline-secondary mark-all-read" onclick="markAllNotificationsAsRead()">
                        <i class="fas fa-check-double me-1"></i> Mark All Read
                    </button>
                </div>
            `);
        }
        
        // Update notification count
        updateNotificationCount(notifications.filter(n => !n.read).length);
        
        console.log('✅ Enhanced notifications loaded');
        
    } catch (error) {
        console.error('❌ Error loading enhanced notifications:', error);
    }
}

function createEnhancedNotificationHTML(notification) {
    const system = window.notificationSystem;
    const category = system.categories[notification.category] || system.categories.system;
    const timeAgo = getTimeAgo(new Date(notification.time));
    
    // Priority styling
    const priorityClass = notification.priority === 'urgent' ? 'border-danger' : 
                         notification.priority === 'high' ? 'border-warning' : 'border-light';
    
    // Category-specific actions
    let actions = '';
    if (notification.category === 'tracking' || notification.category === 'order') {
        actions = `<button class="btn btn-xs btn-outline-primary notification-action" data-action="track">Track</button>`;
    } else if (notification.category === 'promotion') {
        actions = `<button class="btn btn-xs btn-gradient notification-action" data-action="shop">Shop Now</button>`;
    }
    
    return `
        <div class="dropdown-item notification-item-enhanced ${priorityClass}" 
             data-notification-id="${notification.id}"
             data-category="${notification.category}"
             data-type="${notification.type}"
             style="cursor: pointer; padding: 12px 16px; border-left: 4px solid ${category.color};">
            
            <div class="d-flex align-items-start">
                <!-- Icon -->
                <div class="notification-icon-enhanced me-3" 
                     style="width: 40px; height: 40px; border-radius: 10px; 
                            background: ${category.gradient}; 
                            display: flex; align-items: center; justify-content: center; 
                            box-shadow: 0 2px 8px rgba(255, 0, 102, 0.2);">
                    <i class="${category.icon}" style="color: white; font-size: 1rem;"></i>
                </div>
                
                <!-- Content -->
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <h6 class="mb-0 fw-bold" style="color: #2C3E50; font-size: 0.9rem;">
                            ${notification.title}
                        </h6>
                        <small class="text-muted" style="font-size: 0.7rem;">${timeAgo}</small>
                    </div>
                    
                    <p class="mb-2 small" style="color: #6c757d; line-height: 1.3; font-size: 0.8rem;">
                        ${notification.message}
                    </p>
                    
                    <!-- Actions -->
                    ${actions ? `<div class="notification-actions">${actions}</div>` : ''}
                </div>
                
                <!-- Priority indicator -->
                ${notification.priority === 'urgent' ? 
                    '<div class="notification-priority"><span class="badge bg-danger rounded-pill">!</span></div>' : ''}
            </div>
        </div>
    `;
}

function updateNotificationCount(count) {
    try {
        if (count === undefined) {
            const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
            count = notifications.filter(n => !n.read).length;
        }
        
        // Update all notification count badges
        $('.notification-count').each(function() {
            const $badge = $(this);
            if (count === 0) {
                $badge.hide();
            } else {
                $badge.show().text(count);
            }
        });
        
        // Update bell icon animation
        if (count > 0) {
            $('.fa-bell').addClass('notification-alert');
        } else {
            $('.fa-bell').removeClass('notification-alert');
        }
        
        // Update document title
        const baseTitle = document.title.replace(/^\(\d+\)\s*/, '');
        if (count > 0) {
            document.title = `(${count}) ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
        
        console.log(`📊 Notification count updated: ${count} unread`);
        
    } catch (error) {
        console.error('❌ Error updating notification count:', error);
    }
}

function markNotificationAsRead(notificationId) {
    try {
        const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        const notification = notifications.find(n => n.id == notificationId);
        
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
            
            // Reload notifications
            loadEnhancedNotifications();
            
            console.log(`✅ Notification ${notificationId} marked as read`);
        }
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
    }
}

function markAllNotificationsAsRead() {
    try {
        const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        notifications.forEach(n => n.read = true);
        localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
        
        // Reload notifications
        loadEnhancedNotifications();
        
        console.log('✅ All notifications marked as read');
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
    }
}

function startNotificationUpdates() {
    try {
        // Initial load
        loadEnhancedNotifications();
        
        // Periodic updates
        setInterval(loadEnhancedNotifications, 30000); // Every 30 seconds
        
        // Listen for storage changes
        window.addEventListener('storage', function(e) {
            if (e.key === 'sanoria_notifications') {
                loadEnhancedNotifications();
            }
        });
        
        console.log('✅ Notification updates started');
        
    } catch (error) {
        console.error('❌ Error starting notification updates:', error);
    }
}

// Utility functions
function generateNotificationId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// Make functions globally available
window.notificationTypes = {
    loadEnhancedNotifications: loadEnhancedNotifications,
    markNotificationAsRead: markNotificationAsRead,
    markAllNotificationsAsRead: markAllNotificationsAsRead,
    updateNotificationCount: updateNotificationCount
};

console.log('📋 Notification Types Fix Script Loaded');