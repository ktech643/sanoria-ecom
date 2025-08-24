/**
 * Admin Panel JavaScript for Sanoria.pk
 * Handles admin dashboard functionality
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // INITIALIZATION
    // =====================
    initSidebar();
    initNotifications();
    initQuickActions();
    initDataTables();
    initCharts();
    checkAuthStatus();

    // =====================
    // SIDEBAR MANAGEMENT
    // =====================
    function initSidebar() {
        // Mobile sidebar toggle
        $('#mobileSidebarToggle, #sidebarToggle').on('click', function() {
            toggleSidebar();
        });

        // Close sidebar when clicking overlay
        $(document).on('click', '.sidebar-overlay', function() {
            hideSidebar();
        });

        // Highlight active menu item
        highlightActiveMenuItem();

        // Handle menu item clicks
        $('.menu-link').on('click', function(e) {
            const $this = $(this);
            const href = $this.attr('href');
            
            // If it's a real link, let it navigate normally
            if (href && href !== '#') {
                return true;
            }
            
            e.preventDefault();
            
            // Update active state
            $('.menu-item').removeClass('active');
            $this.closest('.menu-item').addClass('active');
        });
    }

    function toggleSidebar() {
        const $sidebar = $('.admin-sidebar');
        const $overlay = $('.sidebar-overlay');
        
        if ($sidebar.hasClass('show')) {
            hideSidebar();
        } else {
            showSidebar();
        }
    }

    function showSidebar() {
        const $sidebar = $('.admin-sidebar');
        const $body = $('body');
        
        $sidebar.addClass('show');
        
        // Add overlay for mobile
        if ($(window).width() <= 992) {
            if (!$('.sidebar-overlay').length) {
                $body.append('<div class="sidebar-overlay"></div>');
            }
            $('.sidebar-overlay').addClass('show').fadeIn(200);
        }
    }

    function hideSidebar() {
        $('.admin-sidebar').removeClass('show');
        $('.sidebar-overlay').removeClass('show').fadeOut(200);
    }

    function highlightActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        
        $('.menu-link').each(function() {
            const $this = $(this);
            const href = $this.attr('href');
            
            if (href === currentPage) {
                $('.menu-item').removeClass('active');
                $this.closest('.menu-item').addClass('active');
            }
        });
    }

    // =====================
    // NOTIFICATIONS
    // =====================
    function initNotifications() {
        // Mark notification as read when clicked
        $('.notification-item').on('click', function() {
            $(this).addClass('read');
        });

        // Update notification badge
        updateNotificationBadge();
        
        // Check for new notifications periodically
        setInterval(checkNewNotifications, 30000); // Every 30 seconds
    }

    function updateNotificationBadge() {
        const unreadCount = $('.notification-item:not(.read)').length;
        $('.notification-badge').text(unreadCount);
        
        if (unreadCount === 0) {
            $('.notification-badge').hide();
        } else {
            $('.notification-badge').show();
        }
    }

    function checkNewNotifications() {
        // Simulate API call for new notifications
        // In real implementation, this would fetch from server
        console.log('Checking for new notifications...');
    }

    function addNotification(type, title, message) {
        const icons = {
            order: 'fa-shopping-cart text-warning',
            customer: 'fa-user text-success',
            stock: 'fa-exclamation-triangle text-danger',
            system: 'fa-cog text-info'
        };

        const icon = icons[type] || icons.system;
        const timestamp = new Date().toLocaleString();

        const notificationHtml = `
            <div class="notification-item">
                <i class="fas ${icon}"></i>
                <div>
                    <p class="mb-1">${title}</p>
                    <small class="text-muted">${timestamp}</small>
                </div>
            </div>
        `;

        $('.notification-dropdown .dropdown-divider').before(notificationHtml);
        updateNotificationBadge();

        // Show toast notification
        showToast(title, message, type);
    }

    // =====================
    // QUICK ACTIONS
    // =====================
    function initQuickActions() {
        $('.quick-action-btn').on('click', function(e) {
            const $this = $(this);
            const href = $this.attr('href');
            
            // Add loading state
            $this.addClass('loading');
            
            // If it's a real link, let it navigate
            if (href && href !== '#' && !href.includes('action=')) {
                return true;
            }
            
            e.preventDefault();
            
            // Handle different actions
            const action = href ? href.split('action=')[1] : null;
            
            switch(action) {
                case 'add':
                    if (href.includes('products')) {
                        handleAddProduct();
                    } else if (href.includes('coupons')) {
                        handleAddCoupon();
                    }
                    break;
                default:
                    // For other actions, just navigate
                    if (href && href !== '#') {
                        window.location.href = href;
                    }
            }
            
            // Remove loading state
            setTimeout(() => {
                $this.removeClass('loading');
            }, 1000);
        });
    }

    function handleAddProduct() {
        showModal('Add New Product', `
            <form id="addProductForm">
                <div class="mb-3">
                    <label for="productName" class="form-label">Product Name</label>
                    <input type="text" class="form-control" id="productName" required>
                </div>
                <div class="mb-3">
                    <label for="productCategory" class="form-label">Category</label>
                    <select class="form-control" id="productCategory" required>
                        <option value="">Select Category</option>
                        <option value="skincare">Skincare</option>
                        <option value="makeup">Makeup</option>
                        <option value="haircare">Hair Care</option>
                        <option value="fragrance">Fragrance</option>
                    </select>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label for="productPrice" class="form-label">Price (Rs.)</label>
                        <input type="number" class="form-control" id="productPrice" required>
                    </div>
                    <div class="col-md-6">
                        <label for="productStock" class="form-label">Stock Quantity</label>
                        <input type="number" class="form-control" id="productStock" required>
                    </div>
                </div>
            </form>
        `, 'Add Product', 'btn-primary', function() {
            // Handle form submission
            const formData = {
                name: $('#productName').val(),
                category: $('#productCategory').val(),
                price: $('#productPrice').val(),
                stock: $('#productStock').val()
            };
            
            // Simulate API call
            setTimeout(() => {
                showToast('Success', 'Product added successfully!', 'success');
                closeModal();
            }, 1000);
        });
    }

    function handleAddCoupon() {
        showModal('Create New Coupon', `
            <form id="addCouponForm">
                <div class="mb-3">
                    <label for="couponCode" class="form-label">Coupon Code</label>
                    <input type="text" class="form-control" id="couponCode" required>
                </div>
                <div class="mb-3">
                    <label for="couponType" class="form-label">Discount Type</label>
                    <select class="form-control" id="couponType" required>
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                        <option value="free_shipping">Free Shipping</option>
                    </select>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label for="couponValue" class="form-label">Discount Value</label>
                        <input type="number" class="form-control" id="couponValue" required>
                    </div>
                    <div class="col-md-6">
                        <label for="couponExpiry" class="form-label">Expiry Date</label>
                        <input type="date" class="form-control" id="couponExpiry" required>
                    </div>
                </div>
            </form>
        `, 'Create Coupon', 'btn-success', function() {
            showToast('Success', 'Coupon created successfully!', 'success');
            closeModal();
        });
    }

    // =====================
    // DATA TABLES
    // =====================
    function initDataTables() {
        // Initialize enhanced table functionality
        $('.table').each(function() {
            const $table = $(this);
            
            // Add row hover effects
            $table.find('tbody tr').on('mouseenter', function() {
                $(this).addClass('table-row-hover');
            }).on('mouseleave', function() {
                $(this).removeClass('table-row-hover');
            });
            
            // Handle action buttons
            $table.on('click', '.btn', function(e) {
                e.stopPropagation();
                
                const action = $(this).attr('title') || $(this).data('action');
                const row = $(this).closest('tr');
                
                handleTableAction(action, row);
            });
        });
    }

    function handleTableAction(action, $row) {
        const orderId = $row.find('td:first strong').text();
        
        switch(action.toLowerCase()) {
            case 'view':
                showOrderDetails(orderId);
                break;
            case 'process':
                processOrder(orderId);
                break;
            case 'track':
                trackOrder(orderId);
                break;
            default:
                console.log(`Action: ${action} for ${orderId}`);
        }
    }

    function showOrderDetails(orderId) {
        showModal(`Order Details - ${orderId}`, `
            <div class="order-details">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <strong>Customer:</strong> Sarah Ahmad<br>
                        <strong>Email:</strong> sarah@example.com<br>
                        <strong>Phone:</strong> +92 300 1234567
                    </div>
                    <div class="col-md-6">
                        <strong>Order Date:</strong> Dec 15, 2024<br>
                        <strong>Status:</strong> <span class="badge bg-warning">Processing</span><br>
                        <strong>Total:</strong> Rs. 3,299
                    </div>
                </div>
                <hr>
                <h6>Order Items:</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hydrating Facial Serum</td>
                                <td>2</td>
                                <td>Rs. 1,299</td>
                                <td>Rs. 2,598</td>
                            </tr>
                            <tr>
                                <td>Vitamin C Serum</td>
                                <td>1</td>
                                <td>Rs. 1,599</td>
                                <td>Rs. 1,599</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `, 'Close', 'btn-secondary');
    }

    function processOrder(orderId) {
        if (confirm(`Are you sure you want to process order ${orderId}?`)) {
            showToast('Processing', `Order ${orderId} is being processed...`, 'info');
            
            // Simulate processing
            setTimeout(() => {
                showToast('Success', `Order ${orderId} processed successfully!`, 'success');
                
                // Update order status in table
                $(`td:contains("${orderId}")`).closest('tr')
                    .find('.badge.bg-warning')
                    .removeClass('bg-warning')
                    .addClass('bg-info')
                    .text('Confirmed');
            }, 2000);
        }
    }

    function trackOrder(orderId) {
        showModal(`Track Order - ${orderId}`, `
            <div class="tracking-info">
                <div class="timeline">
                    <div class="timeline-item completed">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h6>Order Placed</h6>
                            <small class="text-muted">Dec 14, 2024 - 10:30 AM</small>
                        </div>
                    </div>
                    <div class="timeline-item completed">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h6>Payment Confirmed</h6>
                            <small class="text-muted">Dec 14, 2024 - 10:35 AM</small>
                        </div>
                    </div>
                    <div class="timeline-item completed">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h6>Order Processed</h6>
                            <small class="text-muted">Dec 14, 2024 - 2:15 PM</small>
                        </div>
                    </div>
                    <div class="timeline-item active">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h6>Shipped</h6>
                            <small class="text-muted">Dec 15, 2024 - 9:00 AM</small>
                            <p class="mb-0"><strong>Tracking:</strong> TCS123456789</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h6>Out for Delivery</h6>
                            <small class="text-muted">Pending</small>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h6>Delivered</h6>
                            <small class="text-muted">Pending</small>
                        </div>
                    </div>
                </div>
            </div>
        `, 'Close', 'btn-secondary');
    }

    // =====================
    // CHARTS ENHANCEMENT
    // =====================
    function initCharts() {
        // Add chart interaction handlers
        addChartEventListeners();
        
        // Refresh charts periodically
        setInterval(refreshCharts, 300000); // Every 5 minutes
    }

    function addChartEventListeners() {
        // Handle chart period selection
        $('select').on('change', function() {
            if ($(this).closest('.card-actions').length) {
                const period = $(this).val();
                updateChartData(period);
            }
        });
    }

    function updateChartData(period) {
        // Simulate data update based on period
        console.log(`Updating chart data for period: ${period}`);
        
        // In real implementation, this would fetch new data from API
        showToast('Updated', `Chart data updated for ${period}`, 'info');
    }

    function refreshCharts() {
        // Refresh chart data
        console.log('Refreshing chart data...');
    }

    // =====================
    // MODAL FUNCTIONS
    // =====================
    function showModal(title, content, buttonText = 'Save', buttonClass = 'btn-primary', onSave = null) {
        const modalId = 'dynamicModal';
        
        // Remove existing modal
        $(`#${modalId}`).remove();
        
        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            ${onSave ? `<button type="button" class="btn ${buttonClass}" id="modalSaveBtn">${buttonText}</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHtml);
        
        const $modal = $(`#${modalId}`);
        
        if (onSave) {
            $modal.find('#modalSaveBtn').on('click', onSave);
        }
        
        $modal.modal('show');
    }

    function closeModal() {
        $('.modal.show').modal('hide');
    }

    // =====================
    // TOAST NOTIFICATIONS
    // =====================
    function showToast(title, message, type = 'info', duration = 4000) {
        const toastId = 'toast-' + Date.now();
        const icons = {
            success: 'fa-check-circle text-success',
            error: 'fa-exclamation-circle text-danger',
            warning: 'fa-exclamation-triangle text-warning',
            info: 'fa-info-circle text-info'
        };
        
        const icon = icons[type] || icons.info;
        
        const toastHtml = `
            <div class="toast" id="${toastId}" role="alert">
                <div class="toast-header">
                    <i class="fas ${icon} me-2"></i>
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        // Create toast container if it doesn't exist
        if (!$('.toast-container').length) {
            $('body').append('<div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 11000;"></div>');
        }
        
        $('.toast-container').append(toastHtml);
        
        const $toast = $(`#${toastId}`);
        const toast = new bootstrap.Toast($toast[0], { delay: duration });
        toast.show();
        
        // Remove toast after it's hidden
        $toast.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }

    // =====================
    // AUTH STATUS CHECK
    // =====================
    function checkAuthStatus() {
        // Check if user is logged in and has admin privileges
        const userSession = getUserSession();
        
        if (!userSession || userSession.role !== 'admin') {
            // Redirect to login
            window.location.href = '../login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }
        
        // Update admin info
        $('.admin-name').text(userSession.firstName + ' ' + userSession.lastName);
        $('.profile-name').text(userSession.firstName);
    }

    function getUserSession() {
        try {
            const sessionData = JSON.parse(localStorage.getItem('sanoria_user_session'));
            
            if (sessionData && Date.now() - sessionData.timestamp < sessionData.expiresIn) {
                return sessionData.user;
            } else {
                localStorage.removeItem('sanoria_user_session');
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    // =====================
    // RESPONSIVE HANDLERS
    // =====================
    $(window).on('resize', function() {
        if ($(window).width() > 992) {
            hideSidebar();
        }
    });

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    function formatCurrency(amount) {
        return 'Rs. ' + amount.toLocaleString();
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // =====================
    // DEMO FUNCTIONS
    // =====================
    
    // Simulate real-time updates
    setTimeout(() => {
        addNotification('order', 'New Order Received', 'Order #SAN20241004 has been placed');
    }, 5000);

    setTimeout(() => {
        addNotification('stock', 'Low Stock Alert', 'Vitamin C Serum is running low');
    }, 10000);

    setTimeout(() => {
        addNotification('customer', 'New Customer Registration', 'A new customer has registered');
    }, 15000);

    console.log('🔧 Admin panel initialized successfully');
});

// =====================
// ADDITIONAL CSS FOR COMPONENTS
// =====================
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .table-row-hover {
            background-color: rgba(212, 175, 55, 0.05) !important;
        }
        
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #dee2e6;
        }
        
        .timeline-item {
            position: relative;
            padding-bottom: 25px;
        }
        
        .timeline-marker {
            position: absolute;
            left: -23px;
            top: 5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #dee2e6;
            background: #fff;
        }
        
        .timeline-item.completed .timeline-marker {
            border-color: #28a745;
            background: #28a745;
        }
        
        .timeline-item.active .timeline-marker {
            border-color: #d4af37;
            background: #d4af37;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.2);
        }
        
        .timeline-content h6 {
            margin: 0 0 5px 0;
            color: #2c3e50;
            font-weight: 600;
        }
        
        .timeline-item.completed .timeline-content h6 {
            color: #28a745;
        }
        
        .timeline-item.active .timeline-content h6 {
            color: #d4af37;
        }
        
        .order-details .table th {
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            font-size: 0.85rem;
            padding: 10px;
        }
        
        .order-details .table td {
            padding: 10px;
            font-size: 0.9rem;
        }
    `)
    .appendTo('head');