// =====================
// NOTIFICATION SYSTEM FIX
// =====================

$(document).ready(function() {
    console.log('🔧 Initializing notification system fix...');
    
    // Fix notification system initialization
    initNotificationSystemFix();
});

function initNotificationSystemFix() {
    try {
        // 1. Initialize default notifications if none exist
        initializeDefaultNotifications();
        
        // 2. Fix notification count display
        updateNotificationCount();
        
        // 3. Fix bell icon positioning and styling
        fixBellIconPositioning();
        
        // 4. Fix dropdown functionality
        fixNotificationDropdown();
        
        // 5. Set up event listeners
        setupNotificationEventListeners();
        
        console.log('✅ Notification system fix completed');
        
    } catch (error) {
        console.error('❌ Error fixing notification system:', error);
    }
}

function fixBellIconPositioning() {
    // Ensure proper positioning of notification elements
    const bellIcon = $('.header-icon .fa-bell');
    const notificationCount = $('.notification-count');
    const headerIcon = $('.header-icon');
    
    // Fix header icon container
    headerIcon.css({
        'position': 'relative',
        'display': 'inline-block',
        'padding': '8px'
    });
    
    // Fix bell icon
    bellIcon.css({
        'font-size': '1.2rem',
        'transition': 'all 0.3s ease'
    });
    
    // Fix notification count badge
    notificationCount.css({
        'position': 'absolute',
        'top': '-8px',
        'right': '-8px',
        'z-index': '10',
        'background': 'linear-gradient(135deg, #FF0066, #CC0052)',
        'color': 'white',
        'font-size': '0.7rem',
        'font-weight': '700',
        'border': '2px solid white',
        'border-radius': '50%',
        'min-width': '20px',
        'height': '20px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)'
    });
    
    console.log('✅ Bell icon positioning fixed');
}

function fixNotificationDropdown() {
    // Ensure dropdown is properly styled and positioned
    const dropdown = $('.notifications-dropdown');
    
    dropdown.css({
        'width': '380px',
        'max-height': '450px',
        'border': 'none',
        'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'border-radius': '12px',
        'overflow': 'hidden'
    });
    
    // Fix dropdown header
    $('.dropdown-header.fancy-header').css({
        'background': 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
        'color': 'var(--primary-text-color)',
        'padding': '1rem',
        'border-bottom': '1px solid var(--primary-dark)'
    });
    
    console.log('✅ Notification dropdown fixed');
}

function setupNotificationEventListeners() {
    // Fix notification click handlers
    $(document).off('click', '.notification-item-quick').on('click', '.notification-item-quick', function(e) {
        e.preventDefault();
        const notificationId = $(this).data('notification-id');
        if (notificationId) {
            markNotificationRead(notificationId);
        }
    });
    
    // Fix bell icon click
    $(document).off('click', '#notification-bell, .header-icon').on('click', '#notification-bell, .header-icon', function(e) {
        // Let Bootstrap handle the dropdown
        console.log('🔔 Notification bell clicked');
    });
    
    // Fix mark all as read
    $(document).off('click', '.mark-all-read').on('click', '.mark-all-read', function(e) {
        e.preventDefault();
        markAllNotificationsRead();
    });
    
    console.log('✅ Notification event listeners set up');
}

function updateNotificationCountFixed() {
    try {
        const stored = localStorage.getItem('sanoria_notifications');
        let unreadCount = 0;
        
        if (stored) {
            const notifications = JSON.parse(stored);
            unreadCount = notifications.filter(n => !n.read).length;
        }
        
        // Update all notification count elements
        const countElements = $('.notification-count, .notification-badge, [data-notification-count]');
        
        if (unreadCount === 0) {
            countElements.hide().text('0');
            // Remove animation classes when no notifications
            $('.fa-bell').removeClass('notification-alert');
        } else {
            countElements.show().text(unreadCount);
            // Add subtle animation to bell icon
            $('.fa-bell').addClass('notification-alert');
        }
        
        // Update document title with count
        const baseTitle = 'Sanoria.pk - Premium Beauty & Skincare';
        if (unreadCount > 0) {
            document.title = `(${unreadCount}) ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
        
        // Load quick notifications in dropdown
        loadQuickNotificationsFixed();
        
        console.log(`📊 Notification count updated: ${unreadCount} unread`);
        
    } catch (error) {
        console.error('❌ Error updating notification count:', error);
        // Fallback: hide count if there's an error
        $('.notification-count, .notification-badge').hide();
    }
}

function loadQuickNotificationsFixed() {
    const stored = localStorage.getItem('sanoria_notifications');
    let notifications = [];
    
    if (stored) {
        notifications = JSON.parse(stored);
    }
    
    // Show only latest 3 unread notifications
    const quickNotifications = notifications
        .filter(n => !n.read)
        .slice(0, 3)
        .map(n => ({
            ...n,
            time: new Date(n.time)
        }));
    
    const container = $('.notification-quick-list');
    container.empty();
    
    if (quickNotifications.length === 0) {
        container.html(`
            <div class="dropdown-item text-center text-muted py-3">
                <i class="fas fa-check-circle me-2 text-success"></i>
                All caught up!
            </div>
        `);
    } else {
        quickNotifications.forEach(notification => {
            const timeAgo = getTimeAgoShort(notification.time);
            const iconClass = getNotificationIconClass(notification.type);
            
            container.append(`
                <div class="dropdown-item notification-item-quick" data-notification-id="${notification.id}" style="cursor: pointer;">
                    <div class="d-flex align-items-start">
                        <div class="notification-icon-small ${notification.type}-icon me-2">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fs-6">${notification.title}</h6>
                            <p class="mb-1 small text-muted">${notification.message}</p>
                            <small class="text-muted">${timeAgo}</small>
                        </div>
                        <div class="notification-indicator">
                            <span class="badge bg-primary rounded-pill">•</span>
                        </div>
                    </div>
                </div>
            `);
        });
    }
}

function getTimeAgoShort(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function getNotificationIconClass(type) {
    const iconMap = {
        promotion: 'fas fa-tag',
        order: 'fas fa-shopping-bag',
        system: 'fas fa-cog',
        message: 'fas fa-envelope',
        alert: 'fas fa-exclamation-triangle'
    };
    return iconMap[type] || 'fas fa-bell';
}

function markNotificationRead(notificationId) {
    try {
        const stored = localStorage.getItem('sanoria_notifications');
        if (!stored) return;
        
        const notifications = JSON.parse(stored);
        const notification = notifications.find(n => n.id == notificationId);
        
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
            updateNotificationCountFixed();
            
            // Trigger custom event for cross-page updates
            window.dispatchEvent(new CustomEvent('notificationUpdated', {
                detail: { notificationId, action: 'read' }
            }));
            
            console.log(`✅ Notification ${notificationId} marked as read`);
        }
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
    }
}

function markAllNotificationsRead() {
    try {
        const stored = localStorage.getItem('sanoria_notifications');
        if (!stored) return;
        
        const notifications = JSON.parse(stored);
        notifications.forEach(n => n.read = true);
        localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
        updateNotificationCountFixed();
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('notificationUpdated', {
            detail: { action: 'markAllRead' }
        }));
        
        console.log('✅ All notifications marked as read');
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
    }
}

function initializeDefaultNotifications() {
    const stored = localStorage.getItem('sanoria_notifications');
    
    if (!stored) {
        const defaultNotifications = [
            {
                id: 1,
                type: 'promotion',
                title: 'New Year Special!',
                message: 'Get 30% off on all skincare products',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 2,
                type: 'order',
                title: 'Order Shipped!',
                message: 'Your order #SAN20241215001 is on the way',
                time: new Date(Date.now() - 5 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 3,
                type: 'system',
                title: 'Welcome to Sanoria!',
                message: 'Complete your profile for personalized recommendations',
                time: new Date(Date.now() - 24 * 60 * 60 * 1000),
                read: false
            }
        ];
        
        localStorage.setItem('sanoria_notifications', JSON.stringify(defaultNotifications));
        console.log('✅ Default notifications initialized');
    }
}

// Override the existing updateNotificationCount function
window.updateNotificationCount = updateNotificationCountFixed;

// Listen for storage changes from other tabs/pages
window.addEventListener('storage', function(e) {
    if (e.key === 'sanoria_notifications') {
        updateNotificationCountFixed();
    }
});

// Listen for custom notification events
window.addEventListener('notificationUpdated', function(e) {
    updateNotificationCountFixed();
});

// Periodically check for notification updates
setInterval(updateNotificationCountFixed, 30000); // Check every 30 seconds

console.log('📋 Notification fix script loaded');