// =====================
// BELL ICON COMPREHENSIVE FIX
// =====================

$(document).ready(function() {
    console.log('🔔 Starting Bell Icon Fix...');
    
    // Fix bell icon functionality
    fixBellIconComprehensive();
});

function fixBellIconComprehensive() {
    try {
        // 1. Fix notification count display
        fixNotificationCountDisplay();
        
        // 2. Fix dropdown functionality
        fixDropdownFunctionality();
        
        // 3. Fix event handlers
        fixEventHandlers();
        
        // 4. Initialize notifications properly
        initializeNotifications();
        
        // 5. Load notification content
        loadNotificationContent();
        
        console.log('✅ Bell Icon Fix Complete');
        
    } catch (error) {
        console.error('❌ Bell Icon Fix Error:', error);
    }
}

function fixNotificationCountDisplay() {
    try {
        // Ensure notification count is properly positioned and visible
        $('.notification-count').each(function() {
            const $badge = $(this);
            
            // Apply proper styling
            $badge.css({
                'position': 'absolute',
                'top': '-8px',
                'right': '-8px',
                'z-index': '1000',
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
        
        // Ensure header icon has proper positioning
        $('.header-icon').each(function() {
            if ($(this).find('.fa-bell').length > 0) {
                $(this).css({
                    'position': 'relative',
                    'display': 'inline-flex',
                    'align-items': 'center'
                });
            }
        });
        
        console.log('✅ Notification count display fixed');
        
    } catch (error) {
        console.error('❌ Error fixing notification count display:', error);
    }
}

function fixDropdownFunctionality() {
    try {
        // Ensure Bootstrap dropdown is properly initialized
        const $bellDropdown = $('.header-icon[data-bs-toggle="dropdown"]').filter(function() {
            return $(this).find('.fa-bell').length > 0;
        });
        
        if ($bellDropdown.length === 0) {
            console.warn('⚠️ Bell dropdown not found, fixing...');
            
            // Find bell icon and ensure it has proper dropdown attributes
            $('.fa-bell').closest('a').each(function() {
                const $link = $(this);
                if (!$link.attr('data-bs-toggle')) {
                    $link.attr('data-bs-toggle', 'dropdown');
                    $link.attr('role', 'button');
                    $link.attr('aria-expanded', 'false');
                    console.log('✅ Added dropdown attributes to bell icon');
                }
            });
        }
        
        // Fix dropdown menu positioning
        $('.notifications-dropdown').each(function() {
            const $dropdown = $(this);
            $dropdown.addClass('dropdown-menu dropdown-menu-end');
            
            // Ensure proper styling
            $dropdown.css({
                'width': '380px',
                'max-height': '450px',
                'border': 'none',
                'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.15)',
                'border-radius': '12px',
                'overflow': 'hidden'
            });
        });
        
        console.log('✅ Dropdown functionality fixed');
        
    } catch (error) {
        console.error('❌ Error fixing dropdown functionality:', error);
    }
}

function fixEventHandlers() {
    try {
        // Remove any conflicting event handlers
        $(document).off('click.bellfix');
        
        // Add proper click handler for notification items
        $(document).on('click.bellfix', '.notification-item-quick', function(e) {
            e.preventDefault();
            const notificationId = $(this).data('notification-id');
            if (notificationId) {
                markNotificationAsRead(notificationId);
            }
        });
        
        // Add handler for "View All" link
        $(document).on('click.bellfix', '.notifications-dropdown .btn', function(e) {
            if ($(this).attr('href') === 'notifications.html') {
                // Allow normal navigation
                return true;
            }
        });
        
        // Add handler for mark all as read
        $(document).on('click.bellfix', '.mark-all-read', function(e) {
            e.preventDefault();
            markAllAsRead();
        });
        
        // Ensure dropdown stays open when clicking inside (except on links)
        $(document).on('click.bellfix', '.notifications-dropdown', function(e) {
            if (!$(e.target).is('a') && !$(e.target).closest('a').length) {
                e.stopPropagation();
            }
        });
        
        console.log('✅ Event handlers fixed');
        
    } catch (error) {
        console.error('❌ Error fixing event handlers:', error);
    }
}

function initializeNotifications() {
    try {
        // Initialize default notifications if none exist
        let notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        
        if (notifications.length === 0) {
            notifications = [
                {
                    id: 1,
                    type: 'promotion',
                    title: 'Welcome to Sanoria!',
                    message: 'Discover our premium beauty collection with exclusive offers',
                    time: new Date(Date.now() - 1 * 60 * 60 * 1000),
                    read: false
                },
                {
                    id: 2,
                    type: 'order',
                    title: 'Special Offer',
                    message: 'Get 30% off on all skincare products this week',
                    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    read: false
                },
                {
                    id: 3,
                    type: 'system',
                    title: 'Profile Setup',
                    message: 'Complete your profile for personalized recommendations',
                    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    read: false
                }
            ];
            localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
            console.log('✅ Default notifications created');
        }
        
        console.log('✅ Notifications initialized');
        
    } catch (error) {
        console.error('❌ Error initializing notifications:', error);
    }
}

function loadNotificationContent() {
    try {
        const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3);
        
        // Update notification count
        updateNotificationCount(notifications);
        
        // Load quick notifications in dropdown
        const $container = $('.notification-quick-list');
        if ($container.length > 0) {
            $container.empty();
            
            if (unreadNotifications.length === 0) {
                $container.html(`
                    <div class="dropdown-item text-center text-muted py-3">
                        <i class="fas fa-check-circle me-2 text-success"></i>
                        All caught up! No new notifications.
                    </div>
                `);
            } else {
                unreadNotifications.forEach(notification => {
                    const timeAgo = getTimeAgo(new Date(notification.time));
                    const iconClass = getNotificationIcon(notification.type);
                    
                    $container.append(`
                        <div class="dropdown-item notification-item-quick" data-notification-id="${notification.id}" style="cursor: pointer; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <div class="d-flex align-items-start">
                                <div class="notification-icon-small ${notification.type}-icon me-3" style="width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #FF0066, #FF3385); color: white;">
                                    <i class="${iconClass}" style="font-size: 0.9rem;"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h6 class="mb-1 fs-6 fw-bold" style="color: #2C3E50;">${notification.title}</h6>
                                    <p class="mb-1 small text-muted" style="line-height: 1.4;">${notification.message}</p>
                                    <small class="text-muted" style="font-size: 0.75rem;">${timeAgo}</small>
                                </div>
                                <div class="notification-indicator">
                                    <span class="badge rounded-pill" style="background: #FF0066; width: 8px; height: 8px; padding: 0;"></span>
                                </div>
                            </div>
                        </div>
                    `);
                });
                
                // Add "View All" footer
                $container.append(`
                    <div class="dropdown-item text-center border-top pt-2 mt-2">
                        <a href="notifications.html" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-eye me-1"></i> View All Notifications
                        </a>
                    </div>
                `);
            }
        }
        
        console.log('✅ Notification content loaded');
        
    } catch (error) {
        console.error('❌ Error loading notification content:', error);
    }
}

function updateNotificationCount(notifications) {
    try {
        if (!notifications) {
            notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        }
        
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Update all notification count badges
        $('.notification-count').each(function() {
            const $badge = $(this);
            if (unreadCount === 0) {
                $badge.hide();
            } else {
                $badge.show().text(unreadCount);
            }
        });
        
        // Update bell icon animation
        if (unreadCount > 0) {
            $('.fa-bell').addClass('notification-alert');
        } else {
            $('.fa-bell').removeClass('notification-alert');
        }
        
        // Update document title
        const baseTitle = document.title.replace(/^\(\d+\)\s*/, '');
        if (unreadCount > 0) {
            document.title = `(${unreadCount}) ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
        
        console.log(`📊 Notification count updated: ${unreadCount} unread`);
        return unreadCount;
        
    } catch (error) {
        console.error('❌ Error updating notification count:', error);
        return 0;
    }
}

function markNotificationAsRead(notificationId) {
    try {
        const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        const notification = notifications.find(n => n.id == notificationId);
        
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
            
            // Reload content
            loadNotificationContent();
            
            console.log(`✅ Notification ${notificationId} marked as read`);
        }
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
    }
}

function markAllAsRead() {
    try {
        const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        notifications.forEach(n => n.read = true);
        localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
        
        // Reload content
        loadNotificationContent();
        
        console.log('✅ All notifications marked as read');
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
    }
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

function getNotificationIcon(type) {
    const iconMap = {
        promotion: 'fas fa-tag',
        order: 'fas fa-shopping-bag',
        system: 'fas fa-cog',
        message: 'fas fa-envelope',
        alert: 'fas fa-exclamation-triangle'
    };
    return iconMap[type] || 'fas fa-bell';
}

// Make functions globally available
window.bellIconFix = {
    updateNotificationCount: updateNotificationCount,
    loadNotificationContent: loadNotificationContent,
    markNotificationAsRead: markNotificationAsRead,
    markAllAsRead: markAllAsRead
};

console.log('📋 Bell Icon Fix Script Loaded');