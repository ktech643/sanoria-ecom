// ===== SANORIA.PK - Products Management =====

// Load Products
async function loadProducts() {
    try {
        // Load new arrivals
        loadNewArrivals();
        
        // Load most viewed products
        loadMostViewed();
        
        // Load blog posts
        loadBlogPosts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Load New Arrivals
function loadNewArrivals() {
    const container = document.getElementById('newArrivalsContainer');
    if (!container) return;
    
    // Sample products (in real app, this would come from API)
    const newArrivals = [
        {
            id: 1,
            name: "Luxury Gold Serum",
            price: 3499,
            oldPrice: 4499,
            image: "/images/placeholder.svg",
            badge: "NEW",
            rating: 4.8,
            reviews: 125
        },
        {
            id: 2,
            name: "Rose Hydrating Mist",
            price: 1299,
            oldPrice: 1599,
            image: "/images/placeholder.svg",
            badge: "20% OFF",
            rating: 4.9,
            reviews: 89
        },
        {
            id: 3,
            name: "Vitamin C Brightening Cream",
            price: 2199,
            image: "/images/placeholder.svg",
            badge: "BESTSELLER",
            rating: 4.7,
            reviews: 234
        },
        {
            id: 4,
            name: "Retinol Night Repair",
            price: 2999,
            image: "/images/placeholder.svg",
            badge: "NEW",
            rating: 4.6,
            reviews: 67
        }
    ];
    
    const productsHTML = newArrivals.map(product => createProductCard(product)).join('');
    container.innerHTML = productsHTML;
    
    // Add event listeners to product cards
    setupProductCardListeners();
}

// Load Most Viewed Products
function loadMostViewed() {
    const container = document.getElementById('mostViewedContainer');
    if (!container) return;
    
    const mostViewed = [
        {
            id: 5,
            name: "24K Gold Face Mask",
            price: 899,
            oldPrice: 1199,
            image: "/images/placeholder.svg",
            badge: "25% OFF",
            rating: 4.9,
            reviews: 456
        },
        {
            id: 6,
            name: "Hyaluronic Acid Serum",
            price: 1799,
            image: "/images/placeholder.svg",
            rating: 4.8,
            reviews: 312
        },
        {
            id: 7,
            name: "Green Tea Cleanser",
            price: 999,
            image: "/images/placeholder.svg",
            rating: 4.7,
            reviews: 198
        },
        {
            id: 8,
            name: "Collagen Eye Cream",
            price: 1599,
            oldPrice: 1999,
            image: "/images/placeholder.svg",
            badge: "LIMITED",
            rating: 4.8,
            reviews: 267
        }
    ];
    
    const productsHTML = mostViewed.map(product => createProductCard(product)).join('');
    container.innerHTML = productsHTML;
    
    setupProductCardListeners();
}

// Create Product Card HTML
function createProductCard(product) {
    const oldPriceHTML = product.oldPrice ? 
        `<span class="old-price">Rs. ${product.oldPrice}</span>` : '';
    
    const badgeHTML = product.badge ? 
        `<span class="product-badge">${product.badge}</span>` : '';
    
    return `
        <div class="col-md-3 col-6 mb-4">
            <div class="product-card" data-product-id="${product.id}">
                ${badgeHTML}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='/images/placeholder.jpg'">
                    <div class="product-overlay">
                        <button class="btn btn-sm btn-primary quick-view-btn" onclick="quickView(${product.id})">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        ${oldPriceHTML}
                        Rs. ${product.price}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm w-100 mb-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-primary btn-sm wishlist-btn" onclick="toggleWishlist(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate Star Rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Quick View Function
function quickView(productId) {
    // Create modal for quick view
    const modalHTML = `
        <div class="modal fade" id="quickViewModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Quick View</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="/images/products/product-${productId}.jpg" class="img-fluid" alt="Product">
                            </div>
                            <div class="col-md-6">
                                <h3>Product Name</h3>
                                <div class="product-rating mb-3">
                                    <div class="stars text-warning">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star-half-alt"></i>
                                    </div>
                                    <span>(125 reviews)</span>
                                </div>
                                <h4 class="text-primary mb-3">Rs. 2,499</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <div class="quantity-selector mb-3">
                                    <label>Quantity:</label>
                                    <div class="input-group" style="width: 150px;">
                                        <button class="btn btn-outline-secondary" type="button">-</button>
                                        <input type="number" class="form-control text-center" value="1" min="1">
                                        <button class="btn btn-outline-secondary" type="button">+</button>
                                    </div>
                                </div>
                                <button class="btn btn-primary btn-lg w-100">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('quickViewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
}

// Toggle Wishlist
window.toggleWishlist = function(productId) {
    // Initialize wishlist if not exists
    if (!window.wishlist) {
        window.wishlist = JSON.parse(localStorage.getItem('sanoriaWishlist')) || [];
    }
    
    const index = wishlist.findIndex(id => id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist', 'success');
    }
    
    localStorage.setItem('sanoriaWishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    
    // Animate heart icon
    const heartIcon = event.target.closest('.wishlist-btn');
    if (heartIcon) {
        heartIcon.classList.add('animate-pulse');
        setTimeout(() => heartIcon.classList.remove('animate-pulse'), 1000);
    }
}

// Update Wishlist UI
function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.closest('[data-product-id]').dataset.productId);
        const isInWishlist = wishlist.includes(productId);
        
        if (isInWishlist) {
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.classList.add('active');
        } else {
            btn.innerHTML = '<i class="far fa-heart"></i>';
            btn.classList.remove('active');
        }
    });
}

// Setup Product Card Listeners
function setupProductCardListeners() {
    // Add hover effects
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-lift');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-lift');
        });
    });
    
    // Update wishlist UI
    updateWishlistUI();
}

// Load Blog Posts
function loadBlogPosts() {
    const container = document.getElementById('blogContainer');
    if (!container) return;
    
    const blogPosts = [
        {
            id: 1,
            title: "10 Steps to Perfect Skin",
            excerpt: "Discover the ultimate skincare routine for glowing, healthy skin...",
            image: "/images/placeholder.svg",
            date: "March 15, 2024",
            author: "Dr. Sarah Ahmed"
        },
        {
            id: 2,
            title: "Understanding Your Skin Type",
            excerpt: "Learn how to identify your skin type and choose the right products...",
            image: "/images/placeholder.svg",
            date: "March 12, 2024",
            author: "Beauty Expert"
        },
        {
            id: 3,
            title: "Natural Ingredients for Beauty",
            excerpt: "Explore the power of natural ingredients in modern skincare...",
            image: "/images/placeholder.svg",
            date: "March 10, 2024",
            author: "Wellness Coach"
        }
    ];
    
    const blogHTML = blogPosts.map(post => `
        <div class="col-md-4 mb-4">
            <div class="blog-card">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}" onerror="this.src='/images/blog-placeholder.jpg'">
                    <div class="blog-date">
                        <span>${post.date}</span>
                    </div>
                </div>
                <div class="blog-content">
                    <h5>${post.title}</h5>
                    <p>${post.excerpt}</p>
                    <div class="blog-meta">
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = blogHTML;
}

// Product Filter Functions
function filterByCategory(category) {
    // Implementation for category filtering
    console.log('Filtering by category:', category);
}

function filterBySkinType(skinType) {
    // Implementation for skin type filtering
    console.log('Filtering by skin type:', skinType);
}

function sortProducts(sortBy) {
    // Implementation for product sorting
    console.log('Sorting by:', sortBy);
}

// Add necessary CSS for product overlay
const style = document.createElement('style');
style.textContent = `
    .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .product-card:hover .product-overlay {
        opacity: 1;
    }
    
    .quick-view-btn {
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .product-card:hover .quick-view-btn {
        transform: translateY(0);
    }
    
    .product-actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .product-actions .wishlist-btn {
        width: 40px;
        height: 38px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .wishlist-btn.active {
        background: var(--accent-color);
        border-color: var(--accent-color);
        color: white;
    }
    
    .blog-card {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
        height: 100%;
    }
    
    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .blog-image {
        position: relative;
        padding-top: 60%;
        overflow: hidden;
    }
    
    .blog-image img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .blog-date {
        position: absolute;
        top: 20px;
        left: 20px;
        background: var(--primary-color);
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .blog-content {
        padding: 20px;
    }
    
    .blog-content h5 {
        margin-bottom: 15px;
    }
    
    .blog-content p {
        color: var(--text-secondary);
        margin-bottom: 20px;
    }
    
    .blog-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    
    .blog-meta span {
        color: var(--text-secondary);
    }
    
    .read-more {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 600;
        transition: var(--transition);
    }
    
    .read-more:hover {
        color: var(--secondary-color);
    }
`;
document.head.appendChild(style);