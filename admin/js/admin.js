// ==========================================================================
//   Sanoria.pk Admin Dashboard JavaScript
// ==========================================================================

// Global Variables
let currentSection = 'dashboard';
let sidebarCollapsed = false;
let charts = {};

// Sample Data
const sampleProducts = [
    { id: 1, name: "Luxury Face Cream", category: "skincare", price: 2500, stock: 45, status: "active", image: "../images/product1.jpg" },
    { id: 2, name: "Premium Lipstick Set", category: "makeup", price: 1800, stock: 32, status: "active", image: "../images/product2.jpg" },
    { id: 3, name: "Anti-Aging Serum", category: "skincare", price: 3200, stock: 18, status: "active", image: "../images/product3.jpg" },
    { id: 4, name: "Signature Perfume", category: "fragrance", price: 4500, stock: 8, status: "active", image: "../images/product4.jpg" },
    { id: 5, name: "Hair Growth Oil", category: "haircare", price: 1500, stock: 0, status: "inactive", image: "../images/product5.jpg" }
];

const sampleOrders = [
    { id: "ORD001", customer: "Ayesha Khan", email: "ayesha@email.com", products: 3, amount: 5800, status: "delivered", payment: "jazzcash", date: "2024-01-15" },
    { id: "ORD002", customer: "Fatima Ali", email: "fatima@email.com", products: 2, amount: 3200, status: "shipped", payment: "easypaisa", date: "2024-01-14" },
    { id: "ORD003", customer: "Sarah Ahmed", email: "sarah@email.com", products: 1, amount: 2500, status: "processing", payment: "cod", date: "2024-01-14" },
    { id: "ORD004", customer: "Zara Hassan", email: "zara@email.com", products: 4, amount: 7200, status: "pending", payment: "bank", date: "2024-01-13" },
    { id: "ORD005", customer: "Malika Sheikh", email: "malika@email.com", products: 2, amount: 4100, status: "cancelled", payment: "jazzcash", date: "2024-01-12" }
];

const sampleCustomers = [
    { id: 1, name: "Ayesha Khan", email: "ayesha@email.com", phone: "+92 300 1234567", orders: 5, totalSpent: 15200, joinDate: "2023-08-15" },
    { id: 2, name: "Fatima Ali", email: "fatima@email.com", phone: "+92 301 2345678", orders: 3, totalSpent: 8900, joinDate: "2023-09-22" },
    { id: 3, name: "Sarah Ahmed", email: "sarah@email.com", phone: "+92 302 3456789", orders: 7, totalSpent: 22100, joinDate: "2023-07-10" },
    { id: 4, name: "Zara Hassan", email: "zara@email.com", phone: "+92 303 4567890", orders: 2, totalSpent: 5600, joinDate: "2023-11-05" },
    { id: 5, name: "Malika Sheikh", email: "malika@email.com", phone: "+92 304 5678901", orders: 4, totalSpent: 12300, joinDate: "2023-10-18" }
];

const samplePromotions = [
    { id: 1, name: "Winter Sale", type: "percentage", discount: 25, startDate: "2024-01-01", endDate: "2024-01-31", status: "active" },
    { id: 2, name: "New Year Offer", type: "fixed", discount: 500, startDate: "2024-01-01", endDate: "2024-01-07", status: "expired" },
    { id: 3, name: "Valentine Special", type: "percentage", discount: 20, startDate: "2024-02-10", endDate: "2024-02-20", status: "scheduled" }
];

// ==========================================================================
//   DOM Ready
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadDashboardData();
    initializeCharts();
    loadAllData();
});

// ==========================================================================
//   Admin Initialization
// ==========================================================================

function initializeAdmin() {
    // Check authentication
    checkAdminAuth();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load user preferences
    loadUserPreferences();
    
    // Initialize tooltips
    initializeTooltips();
}

function checkAdminAuth() {
    // In a real application, this would check JWT token or session
    const adminAuth = localStorage.getItem('admin_auth');
    if (!adminAuth) {
        showLoginPrompt();
    }
}

function showLoginPrompt() {
    // Simple authentication check
    const email = prompt('Enter admin email:');
    const password = prompt('Enter admin password:');
    
    if (email === 'abcd@gmail.com' && password === '11223344') {
        localStorage.setItem('admin_auth', 'authenticated');
        showToast('Welcome to Sanoria.pk Admin Dashboard!', 'success');
    } else {
        alert('Invalid credentials! Use email: abcd@gmail.com, password: 11223344');
        location.href = '../index.html';
    }
}

function setupEventListeners() {
    // Sidebar toggle
    document.addEventListener('click', function(e) {
        if (e.target.closest('.sidebar-toggle')) {
            toggleSidebar();
        }
    });
    
    // Form submissions
    document.getElementById('store-settings-form')?.addEventListener('submit', saveStoreSettings);
    document.getElementById('payment-settings-form')?.addEventListener('submit', savePaymentSettings);
    document.getElementById('add-product-form')?.addEventListener('submit', handleAddProduct);
    
    // Search and filters
    document.getElementById('orderStatus')?.addEventListener('change', filterOrders);
    document.getElementById('orderDateFrom')?.addEventListener('change', filterOrders);
    document.getElementById('orderDateTo')?.addEventListener('change', filterOrders);
}

// ==========================================================================
//   Navigation & Layout
// ==========================================================================

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.classList.add('active');
    
    currentSection = sectionName;
    
    // Load section-specific data
    loadSectionData(sectionName);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebarCollapsed = !sidebarCollapsed;
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
    
    // Save preference
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed);
}

function loadUserPreferences() {
    const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    if (collapsed) {
        toggleSidebar();
    }
}

// ==========================================================================
//   Dashboard Data
// ==========================================================================

function loadDashboardData() {
    loadRecentOrders();
    updateDashboardStats();
}

function updateDashboardStats() {
    // Calculate stats from sample data
    const totalOrders = sampleOrders.length;
    const totalRevenue = sampleOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalCustomers = sampleCustomers.length;
    const totalProducts = sampleProducts.length;
    const outOfStock = sampleProducts.filter(p => p.stock === 0).length;
    
    // Update dashboard cards (would normally be done server-side)
    document.querySelector('.stats-card:nth-child(1) h3').textContent = totalOrders.toLocaleString();
    document.querySelector('.stats-card:nth-child(2) h3').textContent = `Rs. ${totalRevenue.toLocaleString()}`;
    document.querySelector('.stats-card:nth-child(3) h3').textContent = totalCustomers.toLocaleString();
    document.querySelector('.stats-card:nth-child(4) h3').textContent = totalProducts.toLocaleString();
    
    if (outOfStock > 0) {
        document.querySelector('.stats-card:nth-child(4) .badge').textContent = `${outOfStock} out of stock`;
        document.querySelector('.stats-card:nth-child(4) .badge').className = 'badge bg-warning';
    }
}

function loadRecentOrders() {
    const tableBody = document.getElementById('recent-orders-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Show last 5 orders
    sampleOrders.slice(0, 5).forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">${order.customer.charAt(0)}</div>
                    <div>
                        <div class="fw-medium">${order.customer}</div>
                        <small class="text-muted">${order.email}</small>
                    </div>
                </div>
            </td>
            <td>${order.products} items</td>
            <td><strong>Rs. ${order.amount.toLocaleString()}</strong></td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.date)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// ==========================================================================
//   Charts Initialization
// ==========================================================================

function initializeCharts() {
    initializeSalesChart();
    initializeCategoryChart();
    initializeRevenueChart();
    initializeProductChart();
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    charts.sales = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales',
                data: [65, 78, 90, 81, 95, 110, 125, 140, 130, 155, 170, 185],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Skincare', 'Makeup', 'Fragrance', 'Hair Care'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: [
                    '#d4af37',
                    '#2c3e50',
                    '#e74c3c',
                    '#27ae60'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    charts.revenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Revenue',
                data: [15000, 22000, 18000, 25000],
                backgroundColor: '#d4af37',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeProductChart() {
    const ctx = document.getElementById('productChart');
    if (!ctx) return;
    
    charts.product = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Sales', 'Views', 'Reviews', 'Returns', 'Satisfaction'],
            datasets: [{
                label: 'Performance',
                data: [85, 90, 78, 15, 92],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// ==========================================================================
//   Data Loading Functions
// ==========================================================================

function loadAllData() {
    loadProducts();
    loadOrders();
    loadCustomers();
    loadPromotions();
}

function loadSectionData(section) {
    switch(section) {
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'promotions':
            loadPromotions();
            break;
        case 'analytics':
            initializeAnalyticsCharts();
            break;
    }
}

function loadProducts() {
    const tableBody = document.getElementById('products-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    sampleProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/placeholder.jpg'">
            </td>
            <td>
                <div class="fw-medium">${product.name}</div>
                <small class="text-muted">ID: ${product.id}</small>
            </td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td><strong>Rs. ${product.price.toLocaleString()}</strong></td>
            <td>
                <span class="${product.stock === 0 ? 'text-danger' : product.stock < 10 ? 'text-warning' : 'text-success'}">
                    ${product.stock} units
                </span>
            </td>
            <td><span class="status-badge status-${product.status}">${product.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewProduct(${product.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadOrders() {
    const tableBody = document.getElementById('orders-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    sampleOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>
                <div class="fw-medium">${order.customer}</div>
                <small class="text-muted">${order.email}</small>
            </td>
            <td>${order.products} items</td>
            <td><strong>Rs. ${order.amount.toLocaleString()}</strong></td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <span class="badge ${getPaymentBadgeClass(order.payment)}">
                    ${order.payment.toUpperCase()}
                </span>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="updateOrderStatus('${order.id}')" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadCustomers() {
    const tableBody = document.getElementById('customers-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    sampleCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">${customer.name.charAt(0)}</div>
                    <div>
                        <div class="fw-medium">${customer.name}</div>
                        <small class="text-muted">ID: ${customer.id}</small>
                    </div>
                </div>
            </td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td><span class="badge bg-info">${customer.orders} orders</span></td>
            <td><strong>Rs. ${customer.totalSpent.toLocaleString()}</strong></td>
            <td>${formatDate(customer.joinDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewCustomer(${customer.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editCustomer(${customer.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadPromotions() {
    const tableBody = document.getElementById('promotions-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    samplePromotions.forEach(promotion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="fw-medium">${promotion.name}</div>
                <small class="text-muted">ID: ${promotion.id}</small>
            </td>
            <td><span class="badge bg-secondary">${promotion.type}</span></td>
            <td>
                <strong>
                    ${promotion.type === 'percentage' ? promotion.discount + '%' : 'Rs. ' + promotion.discount}
                </strong>
            </td>
            <td>${formatDate(promotion.startDate)}</td>
            <td>${formatDate(promotion.endDate)}</td>
            <td><span class="status-badge status-${promotion.status}">${promotion.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewPromotion(${promotion.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editPromotion(${promotion.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deletePromotion(${promotion.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ==========================================================================
//   Product Management
// ==========================================================================

function showAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

function addProduct() {
    const form = document.getElementById('add-product-form');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // In a real application, this would send data to server
    const productData = {
        id: Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        description: formData.get('description'),
        status: 'active',
        image: '../images/placeholder.jpg'
    };
    
    // Add to sample data
    sampleProducts.push(productData);
    
    // Reload products table
    loadProducts();
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
    
    // Reset form
    form.reset();
    
    showToast('Product added successfully!', 'success');
}

function viewProduct(id) {
    const product = sampleProducts.find(p => p.id === id);
    if (product) {
        alert(`Product: ${product.name}\nCategory: ${product.category}\nPrice: Rs. ${product.price}\nStock: ${product.stock}`);
    }
}

function editProduct(id) {
    showToast('Edit product functionality to be implemented', 'info');
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = sampleProducts.findIndex(p => p.id === id);
        if (index > -1) {
            sampleProducts.splice(index, 1);
            loadProducts();
            showToast('Product deleted successfully!', 'success');
        }
    }
}

// ==========================================================================
//   Order Management
// ==========================================================================

function viewOrder(id) {
    const order = sampleOrders.find(o => o.id === id);
    if (order) {
        alert(`Order: ${order.id}\nCustomer: ${order.customer}\nAmount: Rs. ${order.amount}\nStatus: ${order.status}`);
    }
}

function updateOrderStatus(id) {
    const newStatus = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):');
    if (newStatus) {
        const order = sampleOrders.find(o => o.id === id);
        if (order) {
            order.status = newStatus.toLowerCase();
            loadOrders();
            showToast(`Order ${id} status updated to ${newStatus}`, 'success');
        }
    }
}

function filterOrders() {
    // Filter functionality would be implemented here
    showToast('Filter functionality to be implemented', 'info');
}

// ==========================================================================
//   Customer Management
// ==========================================================================

function viewCustomer(id) {
    const customer = sampleCustomers.find(c => c.id === id);
    if (customer) {
        alert(`Customer: ${customer.name}\nEmail: ${customer.email}\nOrders: ${customer.orders}\nTotal Spent: Rs. ${customer.totalSpent}`);
    }
}

function editCustomer(id) {
    showToast('Edit customer functionality to be implemented', 'info');
}

// ==========================================================================
//   Promotion Management
// ==========================================================================

function showAddPromotionModal() {
    showToast('Add promotion modal to be implemented', 'info');
}

function viewPromotion(id) {
    const promotion = samplePromotions.find(p => p.id === id);
    if (promotion) {
        alert(`Promotion: ${promotion.name}\nType: ${promotion.type}\nDiscount: ${promotion.discount}\nStatus: ${promotion.status}`);
    }
}

function editPromotion(id) {
    showToast('Edit promotion functionality to be implemented', 'info');
}

function deletePromotion(id) {
    if (confirm('Are you sure you want to delete this promotion?')) {
        const index = samplePromotions.findIndex(p => p.id === id);
        if (index > -1) {
            samplePromotions.splice(index, 1);
            loadPromotions();
            showToast('Promotion deleted successfully!', 'success');
        }
    }
}

// ==========================================================================
//   Settings Management
// ==========================================================================

function saveStoreSettings(e) {
    e.preventDefault();
    // Save store settings
    showToast('Store settings saved successfully!', 'success');
}

function savePaymentSettings(e) {
    e.preventDefault();
    // Save payment settings
    showToast('Payment settings saved successfully!', 'success');
}

// ==========================================================================
//   Analytics Charts
// ==========================================================================

function initializeAnalyticsCharts() {
    // This would initialize additional analytics charts
    console.log('Analytics charts initialized');
}

// ==========================================================================
//   Utility Functions
// ==========================================================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getPaymentBadgeClass(payment) {
    switch(payment) {
        case 'jazzcash': return 'bg-primary';
        case 'easypaisa': return 'bg-success';
        case 'cod': return 'bg-warning';
        case 'bank': return 'bg-info';
        default: return 'bg-secondary';
    }
}

function initializeTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_auth');
        location.href = '../index.html';
    }
}

// ==========================================================================
//   Toast Notifications
// ==========================================================================

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    bsToast.show();

    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// ==========================================================================
//   Error Handling
// ==========================================================================

window.addEventListener('error', function(e) {
    console.error('Admin Dashboard Error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// ==========================================================================
//   Export for global access
// ==========================================================================

window.AdminDashboard = {
    showSection,
    toggleSidebar,
    showAddProductModal,
    addProduct,
    viewProduct,
    editProduct,
    deleteProduct,
    viewOrder,
    updateOrderStatus,
    filterOrders,
    viewCustomer,
    editCustomer,
    showAddPromotionModal,
    viewPromotion,
    editPromotion,
    deletePromotion,
    saveStoreSettings,
    savePaymentSettings,
    logout,
    showToast
};