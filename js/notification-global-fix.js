// =====================
// GLOBAL NOTIFICATION BELL ICON FIX
// =====================

$(document).ready(function() {
    console.log('🔧 Applying global notification fixes...');
    
    // Apply notification fixes to all pages
    applyGlobalNotificationFixes();
});

function applyGlobalNotificationFixes() {
    try {
        // 1. Initialize default notifications if none exist
        initializeDefaultNotifications();
        
        // 2. Fix all notification count displays
        fixAllNotificationCounts();
        
        // 3. Fix bell icon styling across all instances
        fixAllBellIconStyling();
        
        // 4. Set up global event listeners
        setupGlobalNotificationListeners();
        
        // 5. Update notification counts
        updateAllNotificationCounts();
        
        console.log('✅ Global notification fixes applied');
        
    } catch (error) {
        console.error('❌ Error applying global notification fixes:', error);
    }
}

function fixAllNotificationCounts() {
    // Fix all notification count badges
    $('.notification-count, .notification-badge, [data-notification-count]').each(function() {
        $(this).css({
            'position': 'absolute',
            'top': '-5px',
            'right': '-5px',
            'z-index': '10',
            'background': 'linear-gradient(135deg, #FF0066, #CC0052)',
            'color': 'white',
            'border-radius': '50%',
            'min-width': '18px',
            'height': '18px',
            'font-size': '0.7rem',
            'font-weight': '700',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'border': '2px solid white',
            'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)'
        });
    });
}

function fixAllBellIconStyling() {
    // Fix all bell icon containers
    $('.header-icon').each(function() {
        if ($(this).find('.fa-bell').length > 0) {
            $(this).css({
                'position': 'relative',
                'display': 'inline-block'
            });
        }
    });
    
    // Fix all bell icons
    $('.fa-bell').each(function() {
        $(this).css({
            'font-size': '1.2rem',
            'transition': 'all 0.3s ease'
        });
    });
    
    // Add pink theme colors for admin pages
    if (window.location.pathname.includes('admin/')) {
        $('.notification-count, .notification-badge').css({
            'background': 'linear-gradient(135deg, #FF0066, #CC0052)'
        });
    }
}

function setupGlobalNotificationListeners() {
    // Global notification click handlers
    $(document).off('click', '.notification-item-quick').on('click', '.notification-item-quick', function(e) {
        e.preventDefault();
        const notificationId = $(this).data('notification-id');
        if (notificationId) {
            markNotificationAsRead(notificationId);
        }
    });
    
    // Global mark all as read handler
    $(document).off('click', '.mark-all-read').on('click', '.mark-all-read', function(e) {
        e.preventDefault();
        markAllNotificationsAsRead();
    });
    
    // Global notification bell click handler (for pages without dropdown)
    $(document).off('click', '.fa-bell').on('click', '.fa-bell', function(e) {
        // If this bell doesn't have a dropdown, redirect to notifications page
        if (!$(this).closest('.dropdown').length) {
            e.preventDefault();
            window.location.href = 'notifications.html';
        }
    });
    
    console.log('✅ Global notification listeners set up');
}

function updateAllNotificationCounts() {
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
            countElements.hide();
            // Remove animation classes when no notifications
            $('.fa-bell').removeClass('notification-alert');
        } else {
            countElements.show().text(unreadCount);
            // Add subtle animation to bell icon
            $('.fa-bell').addClass('notification-alert');
        }
        
        // Update document title with count
        const baseTitle = document.title.replace(/^\(\d+\)\s*/, '');
        if (unreadCount > 0) {
            document.title = `(${unreadCount}) ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
        
        console.log(`📊 All notification counts updated: ${unreadCount} unread`);
        
    } catch (error) {
        console.error('❌ Error updating notification counts:', error);
        // Fallback: hide count if there's an error
        $('.notification-count, .notification-badge').hide();
    }
}

function markNotificationAsRead(notificationId) {
    try {
        const stored = localStorage.getItem('sanoria_notifications');
        if (!stored) return;
        
        const notifications = JSON.parse(stored);
        const notification = notifications.find(n => n.id == notificationId);
        
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
            updateAllNotificationCounts();
            
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

function markAllNotificationsAsRead() {
    try {
        const stored = localStorage.getItem('sanoria_notifications');
        if (!stored) return;
        
        const notifications = JSON.parse(stored);
        notifications.forEach(n => n.read = true);
        localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
        updateAllNotificationCounts();
        
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
                message: 'Your order #SAN001 is on the way',
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

// Listen for storage changes from other tabs/pages
window.addEventListener('storage', function(e) {
    if (e.key === 'sanoria_notifications') {
        updateAllNotificationCounts();
    }
});

// Listen for custom notification events
window.addEventListener('notificationUpdated', function(e) {
    updateAllNotificationCounts();
});

// Periodically check for notification updates
setInterval(updateAllNotificationCounts, 30000); // Check every 30 seconds

// Override the existing updateNotificationCount function if it exists
if (typeof window.updateNotificationCount === 'function') {
    window.updateNotificationCount = updateAllNotificationCounts;
}

console.log('📋 Global notification fix script loaded');