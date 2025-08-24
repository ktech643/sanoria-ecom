<?php
session_start();
require_once '../includes/config.php';

// Check if user is admin
if(!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != true) {
    header('Location: index.php');
    exit();
}

// Get dashboard statistics
$stats = [];

// Total products
$stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
$stats['products'] = $stmt->fetch()['count'];

// Total orders
$stmt = $pdo->query("SELECT COUNT(*) as count FROM orders");
$stats['orders'] = $stmt->fetch()['count'];

// Total customers
$stmt = $pdo->query("SELECT COUNT(*) as count FROM users WHERE is_admin = 0");
$stats['customers'] = $stmt->fetch()['count'];

// Total revenue
$stmt = $pdo->query("SELECT SUM(final_amount) as total FROM orders WHERE payment_status = 'paid'");
$stats['revenue'] = $stmt->fetch()['total'] ?: 0;

// Recent orders
$recentOrdersStmt = $pdo->query("SELECT o.*, u.full_name 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC 
    LIMIT 10");
$recentOrders = $recentOrdersStmt->fetchAll();

// Low stock products
$lowStockStmt = $pdo->query("SELECT * FROM products WHERE stock_quantity < 10 ORDER BY stock_quantity ASC LIMIT 10");
$lowStockProducts = $lowStockStmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Sanoria.pk</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admin-style.css">
</head>
<body>
    <div class="admin-wrapper">
        <!-- Sidebar -->
        <nav class="sidebar">
            <div class="sidebar-header">
                <h3>Sanoria Admin</h3>
            </div>
            <ul class="sidebar-menu">
                <li class="active">
                    <a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                </li>
                <li>
                    <a href="products.php"><i class="fas fa-box"></i> Products</a>
                </li>
                <li>
                    <a href="categories.php"><i class="fas fa-tags"></i> Categories</a>
                </li>
                <li>
                    <a href="orders.php"><i class="fas fa-shopping-cart"></i> Orders</a>
                </li>
                <li>
                    <a href="customers.php"><i class="fas fa-users"></i> Customers</a>
                </li>
                <li>
                    <a href="coupons.php"><i class="fas fa-ticket-alt"></i> Coupons</a>
                </li>
                <li>
                    <a href="promotions.php"><i class="fas fa-bullhorn"></i> Promotions</a>
                </li>
                <li>
                    <a href="blog.php"><i class="fas fa-blog"></i> Blog</a>
                </li>
                <li>
                    <a href="reviews.php"><i class="fas fa-star"></i> Reviews</a>
                </li>
                <li>
                    <a href="settings.php"><i class="fas fa-cog"></i> Settings</a>
                </li>
            </ul>
        </nav>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Top Bar -->
            <div class="top-bar">
                <div class="d-flex justify-content-between align-items-center">
                    <h4>Dashboard</h4>
                    <div class="user-menu">
                        <span>Welcome, <?php echo $_SESSION['user_name']; ?></span>
                        <a href="logout.php" class="btn btn-sm btn-outline-danger ms-3">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div class="container-fluid">
                <!-- Stats Cards -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="stat-card bg-primary">
                            <div class="stat-icon">
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="stat-content">
                                <h3><?php echo $stats['products']; ?></h3>
                                <p>Total Products</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-success">
                            <div class="stat-icon">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                            <div class="stat-content">
                                <h3><?php echo $stats['orders']; ?></h3>
                                <p>Total Orders</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-info">
                            <div class="stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-content">
                                <h3><?php echo $stats['customers']; ?></h3>
                                <p>Total Customers</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-warning">
                            <div class="stat-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="stat-content">
                                <h3><?php echo formatPrice($stats['revenue']); ?></h3>
                                <p>Total Revenue</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Orders -->
                <div class="row mb-4">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Recent Orders</h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Customer</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach($recentOrders as $order): ?>
                                            <tr>
                                                <td><?php echo $order['order_number']; ?></td>
                                                <td><?php echo $order['full_name']; ?></td>
                                                <td><?php echo formatPrice($order['final_amount']); ?></td>
                                                <td>
                                                    <span class="badge bg-<?php echo getOrderStatusColor($order['order_status']); ?>">
                                                        <?php echo ucfirst($order['order_status']); ?>
                                                    </span>
                                                </td>
                                                <td><?php echo date('d M Y', strtotime($order['created_at'])); ?></td>
                                                <td>
                                                    <a href="order-details.php?id=<?php echo $order['id']; ?>" class="btn btn-sm btn-primary">
                                                        <i class="fas fa-eye"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Low Stock Alert -->
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header bg-danger text-white">
                                <h5 class="mb-0">Low Stock Alert</h5>
                            </div>
                            <div class="card-body">
                                <div class="low-stock-list">
                                    <?php foreach($lowStockProducts as $product): ?>
                                    <div class="low-stock-item">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span><?php echo $product['name']; ?></span>
                                            <span class="badge bg-danger"><?php echo $product['stock_quantity']; ?> left</span>
                                        </div>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Quick Actions</h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <a href="add-product.php" class="quick-action-btn">
                                            <i class="fas fa-plus-circle"></i>
                                            <span>Add New Product</span>
                                        </a>
                                    </div>
                                    <div class="col-md-3">
                                        <a href="add-coupon.php" class="quick-action-btn">
                                            <i class="fas fa-ticket-alt"></i>
                                            <span>Create Coupon</span>
                                        </a>
                                    </div>
                                    <div class="col-md-3">
                                        <a href="add-promotion.php" class="quick-action-btn">
                                            <i class="fas fa-bullhorn"></i>
                                            <span>New Promotion</span>
                                        </a>
                                    </div>
                                    <div class="col-md-3">
                                        <a href="add-blog.php" class="quick-action-btn">
                                            <i class="fas fa-pen"></i>
                                            <span>Write Blog Post</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="admin-script.js"></script>
</body>
</html>

<?php
function getOrderStatusColor($status) {
    switch($status) {
        case 'pending': return 'warning';
        case 'processing': return 'info';
        case 'shipped': return 'primary';
        case 'delivered': return 'success';
        case 'cancelled': return 'danger';
        case 'returned': return 'secondary';
        default: return 'secondary';
    }
}
?>