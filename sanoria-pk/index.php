<?php
require_once 'includes/config.php';

// Fetch featured products
$featuredStmt = $pdo->prepare("SELECT p.*, pi.image_url FROM products p 
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1 
    WHERE p.featured = 1 AND p.status = 'active' 
    ORDER BY p.created_at DESC LIMIT 8");
$featuredStmt->execute();
$featuredProducts = $featuredStmt->fetchAll();

// Fetch new arrivals
$newArrivalsStmt = $pdo->prepare("SELECT p.*, pi.image_url FROM products p 
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1 
    WHERE p.is_new = 1 AND p.status = 'active' 
    ORDER BY p.created_at DESC LIMIT 8");
$newArrivalsStmt->execute();
$newArrivals = $newArrivalsStmt->fetchAll();

// Fetch most viewed products
$mostViewedStmt = $pdo->prepare("SELECT p.*, pi.image_url FROM products p 
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1 
    WHERE p.status = 'active' 
    ORDER BY p.view_count DESC LIMIT 8");
$mostViewedStmt->execute();
$mostViewed = $mostViewedStmt->fetchAll();

// Fetch active promotions
$promotionsStmt = $pdo->prepare("SELECT * FROM promotions 
    WHERE is_active = 1 AND start_date <= CURDATE() AND end_date >= CURDATE() 
    ORDER BY created_at DESC LIMIT 3");
$promotionsStmt->execute();
$promotions = $promotionsStmt->fetchAll();

// Fetch latest blog posts
$blogStmt = $pdo->prepare("SELECT * FROM blog_posts 
    WHERE status = 'published' 
    ORDER BY published_at DESC LIMIT 3");
$blogStmt->execute();
$blogPosts = $blogStmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sanoria.pk - Premium Beauty & Skincare Products</title>
    <meta name="description" content="Discover premium beauty and skincare products at Sanoria.pk. Shop by skin type, enjoy free gifts, and get fast delivery across Pakistan.">
    <meta name="keywords" content="beauty products, skincare, cosmetics, Pakistan, online shopping">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    
    <!-- AOS Animation -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>
<body>
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <span><i class="fas fa-phone-alt"></i> +92 300 1234567</span>
                    <span class="ms-3"><i class="fas fa-envelope"></i> info@sanoria.pk</span>
                </div>
                <div class="col-md-6 text-end">
                    <span><i class="fas fa-truck"></i> Free Shipping on Orders Above Rs. 2500</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-3">
                    <div class="logo">
                        <img src="assets/images/logo.png" alt="Sanoria.pk" class="img-fluid">
                    </div>
                </div>
                <div class="col-lg-6">
                    <form class="search-form">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search for products...">
                            <button class="btn btn-primary" type="submit">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <div class="col-lg-3">
                    <div class="header-icons">
                        <?php if(isLoggedIn()): ?>
                            <a href="account.php" class="icon-link">
                                <i class="fas fa-user"></i>
                                <span>Account</span>
                            </a>
                        <?php else: ?>
                            <a href="login.php" class="icon-link">
                                <i class="fas fa-user"></i>
                                <span>Login</span>
                            </a>
                        <?php endif; ?>
                        <a href="wishlist.php" class="icon-link">
                            <i class="fas fa-heart"></i>
                            <span>Wishlist</span>
                            <span class="badge"><?php echo getWishlistCount(); ?></span>
                        </a>
                        <a href="cart.php" class="icon-link">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Cart</span>
                            <span class="badge"><?php echo getCartCount(); ?></span>
                        </a>
                        <a href="#" class="icon-link notification-icon">
                            <i class="fas fa-bell"></i>
                            <span class="badge"><?php echo getNotificationCount(); ?></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation with Hamburger Menu -->
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="index.php">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            Shop by Category
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="category.php?cat=skincare">Skincare</a></li>
                            <li><a class="dropdown-item" href="category.php?cat=makeup">Makeup</a></li>
                            <li><a class="dropdown-item" href="category.php?cat=haircare">Hair Care</a></li>
                            <li><a class="dropdown-item" href="category.php?cat=fragrance">Fragrance</a></li>
                            <li><a class="dropdown-item" href="category.php?cat=bath-body">Bath & Body</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            Shop by Skin Type
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="skin-type.php?type=normal">Normal Skin</a></li>
                            <li><a class="dropdown-item" href="skin-type.php?type=dry">Dry Skin</a></li>
                            <li><a class="dropdown-item" href="skin-type.php?type=oily">Oily Skin</a></li>
                            <li><a class="dropdown-item" href="skin-type.php?type=combination">Combination Skin</a></li>
                            <li><a class="dropdown-item" href="skin-type.php?type=sensitive">Sensitive Skin</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="new-arrivals.php">New Arrivals</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="promotions.php">Promotions</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="blog.php">Blog</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.php">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Banner Slider -->
    <section class="hero-section">
        <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="hero-slide" style="background-image: url('assets/images/hero-1.jpg')">
                        <div class="container">
                            <div class="hero-content" data-aos="fade-up">
                                <h1 class="display-3 fw-bold">Discover Your Perfect Glow</h1>
                                <p class="lead">Premium skincare products tailored for your skin type</p>
                                <a href="shop.php" class="btn btn-primary btn-lg">Shop Now</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="hero-slide" style="background-image: url('assets/images/hero-2.jpg')">
                        <div class="container">
                            <div class="hero-content" data-aos="fade-up">
                                <h1 class="display-3 fw-bold">New Year Special</h1>
                                <p class="lead">Get up to 50% off on selected items</p>
                                <a href="promotions.php" class="btn btn-primary btn-lg">View Offers</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>
    </section>

    <!-- Discount Banner -->
    <?php if(!empty($promotions)): ?>
    <section class="discount-banner">
        <div class="container">
            <div class="row">
                <?php foreach($promotions as $promo): ?>
                <div class="col-md-4" data-aos="fade-up">
                    <div class="promo-card">
                        <img src="uploads/<?php echo $promo['banner_image']; ?>" alt="<?php echo $promo['title']; ?>" class="img-fluid">
                        <div class="promo-content">
                            <h3><?php echo $promo['title']; ?></h3>
                            <p><?php echo $promo['description']; ?></p>
                            <?php if($promo['qr_code']): ?>
                                <img src="uploads/<?php echo $promo['qr_code']; ?>" alt="QR Code" class="qr-code">
                            <?php endif; ?>
                            <?php if($promo['promo_code']): ?>
                                <div class="promo-code">Use Code: <strong><?php echo $promo['promo_code']; ?></strong></div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <div class="row">
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="100">
                    <div class="feature-box">
                        <i class="fas fa-shipping-fast"></i>
                        <h4>Fast Delivery</h4>
                        <p>Quick delivery through TCS, Leopard & PKDex</p>
                    </div>
                </div>
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="200">
                    <div class="feature-box">
                        <i class="fas fa-undo"></i>
                        <h4>14 Days Return</h4>
                        <p>Easy return policy for your satisfaction</p>
                    </div>
                </div>
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="300">
                    <div class="feature-box">
                        <i class="fas fa-gift"></i>
                        <h4>Free Gifts</h4>
                        <p>Get free samples with every order</p>
                    </div>
                </div>
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="400">
                    <div class="feature-box">
                        <i class="fas fa-money-bill-wave"></i>
                        <h4>Secure Payment</h4>
                        <p>Multiple payment options including COD</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="products-section">
        <div class="container">
            <div class="section-header text-center" data-aos="fade-up">
                <h2 class="display-5">Featured Products</h2>
                <p class="lead">Handpicked products just for you</p>
            </div>
            <div class="row">
                <?php foreach($featuredProducts as $product): ?>
                <div class="col-md-3 mb-4" data-aos="fade-up">
                    <div class="product-card">
                        <?php if($product['sale_price']): ?>
                            <span class="badge-sale">-<?php echo calculateDiscountPercentage($product['price'], $product['sale_price']); ?>%</span>
                        <?php endif; ?>
                        <div class="product-image">
                            <img src="uploads/<?php echo $product['image_url'] ?: 'products/default.jpg'; ?>" alt="<?php echo $product['name']; ?>" class="img-fluid">
                            <div class="product-overlay">
                                <a href="product.php?id=<?php echo $product['id']; ?>" class="btn btn-sm btn-primary">Quick View</a>
                                <button class="btn btn-sm btn-outline-primary add-to-wishlist" data-id="<?php echo $product['id']; ?>">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5><?php echo $product['name']; ?></h5>
                            <div class="price">
                                <?php if($product['sale_price']): ?>
                                    <span class="sale-price"><?php echo formatPrice($product['sale_price']); ?></span>
                                    <span class="original-price"><?php echo formatPrice($product['price']); ?></span>
                                <?php else: ?>
                                    <span class="regular-price"><?php echo formatPrice($product['price']); ?></span>
                                <?php endif; ?>
                            </div>
                            <button class="btn btn-primary btn-sm add-to-cart" data-id="<?php echo $product['id']; ?>">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- New Arrivals -->
    <section class="products-section bg-light">
        <div class="container">
            <div class="section-header text-center" data-aos="fade-up">
                <h2 class="display-5">New Arrivals</h2>
                <p class="lead">Latest products in our collection</p>
            </div>
            <div class="row">
                <?php foreach($newArrivals as $product): ?>
                <div class="col-md-3 mb-4" data-aos="fade-up">
                    <div class="product-card">
                        <span class="badge-new">New</span>
                        <div class="product-image">
                            <img src="uploads/<?php echo $product['image_url'] ?: 'products/default.jpg'; ?>" alt="<?php echo $product['name']; ?>" class="img-fluid">
                            <div class="product-overlay">
                                <a href="product.php?id=<?php echo $product['id']; ?>" class="btn btn-sm btn-primary">Quick View</a>
                                <button class="btn btn-sm btn-outline-primary add-to-wishlist" data-id="<?php echo $product['id']; ?>">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5><?php echo $product['name']; ?></h5>
                            <div class="price">
                                <span class="regular-price"><?php echo formatPrice($product['price']); ?></span>
                            </div>
                            <button class="btn btn-primary btn-sm add-to-cart" data-id="<?php echo $product['id']; ?>">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Blog Section -->
    <?php if(!empty($blogPosts)): ?>
    <section class="blog-section">
        <div class="container">
            <div class="section-header text-center" data-aos="fade-up">
                <h2 class="display-5">Latest from Our Blog</h2>
                <p class="lead">Beauty tips, trends, and more</p>
            </div>
            <div class="row">
                <?php foreach($blogPosts as $post): ?>
                <div class="col-md-4 mb-4" data-aos="fade-up">
                    <div class="blog-card">
                        <img src="uploads/<?php echo $post['featured_image']; ?>" alt="<?php echo $post['title']; ?>" class="img-fluid">
                        <div class="blog-content">
                            <h4><?php echo $post['title']; ?></h4>
                            <p><?php echo $post['excerpt']; ?></p>
                            <a href="blog-post.php?id=<?php echo $post['id']; ?>" class="btn btn-link">Read More →</a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Newsletter -->
    <section class="newsletter-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6" data-aos="fade-right">
                    <h3>Subscribe to Our Newsletter</h3>
                    <p>Get exclusive offers and be the first to know about new arrivals</p>
                </div>
                <div class="col-md-6" data-aos="fade-left">
                    <form class="newsletter-form">
                        <div class="input-group">
                            <input type="email" class="form-control" placeholder="Enter your email address" required>
                            <button class="btn btn-primary" type="submit">Subscribe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>About Sanoria.pk</h5>
                    <p>Your trusted destination for premium beauty and skincare products in Pakistan. We offer authentic products with fast delivery and excellent customer service.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="col-md-2">
                    <h5>Quick Links</h5>
                    <ul class="footer-links">
                        <li><a href="about.php">About Us</a></li>
                        <li><a href="contact.php">Contact Us</a></li>
                        <li><a href="shipping.php">Shipping Info</a></li>
                        <li><a href="returns.php">Return Policy</a></li>
                        <li><a href="privacy.php">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="col-md-2">
                    <h5>Categories</h5>
                    <ul class="footer-links">
                        <li><a href="category.php?cat=skincare">Skincare</a></li>
                        <li><a href="category.php?cat=makeup">Makeup</a></li>
                        <li><a href="category.php?cat=haircare">Hair Care</a></li>
                        <li><a href="category.php?cat=fragrance">Fragrance</a></li>
                        <li><a href="category.php?cat=bath-body">Bath & Body</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Payment Methods</h5>
                    <div class="payment-methods">
                        <img src="assets/images/cod.png" alt="Cash on Delivery">
                        <img src="assets/images/jazzcash.png" alt="JazzCash">
                        <img src="assets/images/easypaisa.png" alt="EasyPaisa">
                        <img src="assets/images/bank-transfer.png" alt="Bank Transfer">
                    </div>
                    <h5 class="mt-3">Delivery Partners</h5>
                    <div class="delivery-partners">
                        <img src="assets/images/tcs.png" alt="TCS">
                        <img src="assets/images/leopard.png" alt="Leopard">
                        <img src="assets/images/pkdex.png" alt="PKDex">
                    </div>
                </div>
            </div>
            <hr class="my-4">
            <div class="text-center">
                <p>&copy; 2024 Sanoria.pk. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Chatbot Widget -->
    <div class="chatbot-widget" id="chatbot">
        <div class="chatbot-header">
            <h5>Chat with Us</h5>
            <button class="btn-close" id="closeChatbot"></button>
        </div>
        <div class="chatbot-body" id="chatbotBody">
            <div class="chat-message bot-message">
                <p>Hello! Welcome to Sanoria.pk. How can I help you today?</p>
            </div>
        </div>
        <div class="chatbot-footer">
            <form id="chatForm">
                <div class="input-group">
                    <input type="text" class="form-control" id="chatInput" placeholder="Type your message...">
                    <button class="btn btn-primary" type="submit">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
    <button class="chatbot-toggle" id="chatbotToggle">
        <i class="fas fa-comments"></i>
    </button>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>