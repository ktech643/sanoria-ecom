// =====================
// COMPREHENSIVE NOTIFICATION SYSTEM FIX
// =====================

$(document).ready(function() {
    console.log('🔧 Starting comprehensive notification system fix...');
    
    // Apply all fixes
    applyComprehensiveNotificationFix();
});

function applyComprehensiveNotificationFix() {
    try {
        // 1. Fix initialization issues
        fixNotificationInitialization();
        
        // 2. Fix duplicate function conflicts
        fixDuplicateFunctionConflicts();
        
        // 3. Fix CSS styling issues
        fixNotificationStyling();
        
        // 4. Fix event handler conflicts
        fixEventHandlerConflicts();
        
        // 5. Fix dropdown positioning
        fixDropdownPositioning();
        
        // 6. Fix notification count updates
        fixNotificationCountUpdates();
        
        // 7. Initialize proper functionality
        initializeProperNotificationSystem();
        
        console.log('✅ Comprehensive notification system fix completed');
        
    } catch (error) {
        console.error('❌ Error in comprehensive notification fix:', error);
    }
}

function fixNotificationInitialization() {
    // Ensure default notifications exist
    const stored = localStorage.getItem('sanoria_notifications');
    if (!stored) {
        const defaultNotifications = [
            {
                id: 1,
                type: 'promotion',
                title: 'Welcome to Sanoria!',
                message: 'Discover our premium beauty collection',
                time: new Date(Date.now() - 1 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 2,
                type: 'system',
                title: 'Profile Setup',
                message: 'Complete your profile for better recommendations',
                time: new Date(Date.now() - 3 * 60 * 60 * 1000),
                read: false
            }
        ];
        localStorage.setItem('sanoria_notifications', JSON.stringify(defaultNotifications));
        console.log('✅ Default notifications initialized');
    }
}

function fixDuplicateFunctionConflicts() {
    // Remove any duplicate event listeners
    $(document).off('click.notification-fix');
    
    // Ensure only one updateNotificationCount function exists
    if (window.updateNotificationCount) {
        window.originalUpdateNotificationCount = window.updateNotificationCount;
    }
    
    console.log('✅ Function conflicts resolved');
}

function fixNotificationStyling() {
    // Apply critical CSS fixes inline
    const criticalCSS = `
        <style id="notification-critical-fix">
            .header-icon {
                position: relative !important;
                display: inline-flex !important;
                align-items: center !important;
                padding: 8px !important;
            }
            
            .notification-count {
                position: absolute !important;
                top: -8px !important;
                right: -8px !important;
                z-index: 1000 !important;
                background: linear-gradient(135deg, #FF0066, #CC0052) !important;
                color: white !important;
                border: 2px solid white !important;
                border-radius: 50% !important;
                min-width: 18px !important;
                height: 18px !important;
                font-size: 0.7rem !important;
                font-weight: 700 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
                animation: none !important;
            }
            
            .notification-count:not(.hidden) {
                display: flex !important;
            }
            
            .notification-count.hidden {
                display: none !important;
            }
            
            .fa-bell {
                font-size: 1.2rem !important;
                transition: all 0.3s ease !important;
                color: var(--primary-text-color, #2C3E50) !important;
            }
            
            .fa-bell.notification-alert {
                animation: bellShake 0.8s ease-in-out infinite !important;
                color: #FF0066 !important;
            }
            
            @keyframes bellShake {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-5deg); }
                75% { transform: rotate(5deg); }
            }
            
            .notifications-dropdown {
                width: 380px !important;
                max-height: 450px !important;
                border: none !important;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
                border-radius: 12px !important;
                overflow: hidden !important;
            }
            
            .notification-quick-list {
                max-height: 300px !important;
                overflow-y: auto !important;
            }
            
            .notification-item-quick {
                padding: 12px 16px !important;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
                transition: all 0.3s ease !important;
                cursor: pointer !important;
            }
            
            .notification-item-quick:hover {
                background-color: rgba(255, 0, 102, 0.05) !important;
            }
            
            /* Admin theme adjustments */
            .admin-body .notification-count {
                background: linear-gradient(135deg, #FF0066, #CC0052) !important;
            }
        </style>
    `;
    
    // Remove existing critical fix and add new one
    $('#notification-critical-fix').remove();
    $('head').append(criticalCSS);
    
    console.log('✅ Critical CSS fixes applied');
}

function fixEventHandlerConflicts() {
    // Clear all existing notification event handlers
    $('.notification-item-quick').off('click.notification');
    $('.mark-all-read').off('click.notification');
    $('.fa-bell').off('click.notification');
    
    // Set up clean event handlers
    $(document).on('click.notification-fix', '.notification-item-quick', function(e) {
        e.preventDefault();
        const notificationId = $(this).data('notification-id') || $(this).find('[data-notification-id]').data('notification-id');
        if (notificationId) {
            markSingleNotificationRead(notificationId);
        }
    });
    
    $(document).on('click.notification-fix', '.mark-all-read', function(e) {
        e.preventDefault();
        markAllNotificationsRead();
    });
    
    console.log('✅ Event handler conflicts resolved');
}

function fixDropdownPositioning() {
    // Fix Bootstrap dropdown positioning issues
    $('.dropdown-toggle[data-bs-toggle="dropdown"]').each(function() {
        const $this = $(this);
        if ($this.find('.fa-bell').length > 0) {
            // Ensure proper Bootstrap dropdown attributes
            $this.attr('role', 'button');
            $this.attr('aria-expanded', 'false');
            
            // Fix dropdown menu positioning
            const $dropdown = $this.siblings('.dropdown-menu');
            $dropdown.addClass('dropdown-menu-end');
        }
    });
    
    console.log('✅ Dropdown positioning fixed');
}

function fixNotificationCountUpdates() {
    // Create a robust notification count update function
    window.updateNotificationCount = function() {
        try {
            const stored = localStorage.getItem('sanoria_notifications');
            let unreadCount = 0;
            
            if (stored) {
                const notifications = JSON.parse(stored);
                unreadCount = notifications.filter(n => !n.read).length;
            }
            
            // Update all notification count elements with more specific selectors
            const countSelectors = [
                '.notification-count',
                '.notification-badge', 
                '[data-notification-count]',
                '.header-icon .badge',
                '.notification-icon .badge'
            ];
            
            countSelectors.forEach(selector => {
                const elements = $(selector);
                elements.each(function() {
                    const $el = $(this);
                    if (unreadCount === 0) {
                        $el.hide().addClass('hidden').text('0');
                    } else {
                        $el.show().removeClass('hidden').text(unreadCount);
                    }
                });
            });
            
            // Update bell icon animation
            if (unreadCount === 0) {
                $('.fa-bell').removeClass('notification-alert');
            } else {
                $('.fa-bell').addClass('notification-alert');
            }
            
            // Update document title
            const baseTitle = document.title.replace(/^\(\d+\)\s*/, '');
            if (unreadCount > 0) {
                document.title = `(${unreadCount}) ${baseTitle}`;
            } else {
                document.title = baseTitle;
            }
            
            // Load quick notifications if dropdown exists
            if ($('.notification-quick-list').length > 0) {
                loadQuickNotificationsFixed();
            }
            
            console.log(`📊 Notification count updated: ${unreadCount} unread`);
            return unreadCount;
            
        } catch (error) {
            console.error('❌ Error updating notification count:', error);
            // Fallback: hide all counts
            $('.notification-count, .notification-badge').hide();
            return 0;
        }
    };
}

function loadQuickNotificationsFixed() {
    try {
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
        if (container.length === 0) return;
        
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
                const timeAgo = getTimeAgo(notification.time);
                const iconClass = getNotificationIcon(notification.type);
                
                container.append(`
                    <div class="dropdown-item notification-item-quick" data-notification-id="${notification.id}">
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
        
        console.log('✅ Quick notifications loaded');
        
    } catch (error) {
        console.error('❌ Error loading quick notifications:', error);
    }
}

function markSingleNotificationRead(notificationId) {
    try {
        const stored = localStorage.getItem('sanoria_notifications');
        if (!stored) return;
        
        const notifications = JSON.parse(stored);
        const notification = notifications.find(n => n.id == notificationId);
        
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
            
            // Update counts
            if (window.updateNotificationCount) {
                window.updateNotificationCount();
            }
            
            // Trigger custom event
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
        
        // Update counts
        if (window.updateNotificationCount) {
            window.updateNotificationCount();
        }
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('notificationUpdated', {
            detail: { action: 'markAllRead' }
        }));
        
        console.log('✅ All notifications marked as read');
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
    }
}

function initializeProperNotificationSystem() {
    // Update counts immediately
    if (window.updateNotificationCount) {
        window.updateNotificationCount();
    }
    
    // Set up cross-page synchronization
    window.addEventListener('storage', function(e) {
        if (e.key === 'sanoria_notifications' && window.updateNotificationCount) {
            window.updateNotificationCount();
        }
    });
    
    // Set up custom event listeners
    window.addEventListener('notificationUpdated', function(e) {
        if (window.updateNotificationCount) {
            window.updateNotificationCount();
        }
    });
    
    // Periodic updates (every 30 seconds)
    setInterval(function() {
        if (window.updateNotificationCount) {
            window.updateNotificationCount();
        }
    }, 30000);
    
    console.log('✅ Notification system properly initialized');
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
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

console.log('📋 Comprehensive notification system fix loaded');