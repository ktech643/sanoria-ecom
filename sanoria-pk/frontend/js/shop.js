// ===== SANORIA.PK - Shop Page Functionality =====

// Shop products data
const shopProducts = [
    {
        id: 1,
        name: "Luxury Gold Serum",
        price: 3499,
        oldPrice: 4499,
        image: "/images/placeholder.svg",
        category: "serum",
        skinType: ["all"],
        badge: "BESTSELLER",
        rating: 4.8,
        reviews: 125,
        description: "24K gold-infused serum for radiant skin"
    },
    {
        id: 2,
        name: "Rose Hydrating Mist",
        price: 1299,
        oldPrice: 1599,
        image: "/images/placeholder.svg",
        category: "toner",
        skinType: ["dry", "sensitive"],
        badge: "20% OFF",
        rating: 4.9,
        reviews: 89,
        description: "Refreshing rose water mist for instant hydration"
    },
    {
        id: 3,
        name: "Vitamin C Brightening Cream",
        price: 2199,
        image: "/images/placeholder.svg",
        category: "moisturizer",
        skinType: ["all"],
        rating: 4.7,
        reviews: 234,
        description: "Brightening cream with Vitamin C for glowing skin"
    },
    {
        id: 4,
        name: "Retinol Night Repair",
        price: 2999,
        image: "/images/placeholder.svg",
        category: "serum",
        skinType: ["mature"],
        badge: "NEW",
        rating: 4.6,
        reviews: 67,
        description: "Anti-aging night serum with retinol"
    },
    {
        id: 5,
        name: "Green Tea Cleanser",
        price: 999,
        image: "/images/placeholder.svg",
        category: "cleanser",
        skinType: ["oily", "combination"],
        rating: 4.8,
        reviews: 156,
        description: "Gentle foam cleanser with green tea extract"
    },
    {
        id: 6,
        name: "Hyaluronic Acid Mask",
        price: 599,
        oldPrice: 799,
        image: "/images/placeholder.svg",
        category: "mask",
        skinType: ["dry"],
        badge: "25% OFF",
        rating: 4.9,
        reviews: 98,
        description: "Intensive hydrating sheet mask"
    },
    {
        id: 7,
        name: "Niacinamide Serum",
        price: 1899,
        image: "/images/placeholder.svg",
        category: "serum",
        skinType: ["oily", "combination"],
        rating: 4.7,
        reviews: 187,
        description: "10% Niacinamide for pore refinement"
    },
    {
        id: 8,
        name: "Collagen Eye Cream",
        price: 1599,
        oldPrice: 1999,
        image: "/images/placeholder.svg",
        category: "moisturizer",
        skinType: ["all"],
        badge: "LIMITED",
        rating: 4.8,
        reviews: 142,
        description: "Anti-aging eye cream with collagen"
    },
    {
        id: 9,
        name: "Clay Purifying Mask",
        price: 1299,
        image: "/images/placeholder.svg",
        category: "mask",
        skinType: ["oily"],
        rating: 4.6,
        reviews: 76,
        description: "Deep cleansing clay mask for oily skin"
    },
    {
        id: 10,
        name: "Peptide Moisturizer",
        price: 2499,
        image: "/images/placeholder.svg",
        category: "moisturizer",
        skinType: ["dry", "mature"],
        rating: 4.9,
        reviews: 203,
        description: "Rich moisturizer with peptides"
    },
    {
        id: 11,
        name: "Micellar Water",
        price: 799,
        image: "/images/placeholder.svg",
        category: "cleanser",
        skinType: ["all"],
        rating: 4.7,
        reviews: 298,
        description: "Gentle makeup remover and cleanser"
    },
    {
        id: 12,
        name: "Sunscreen SPF 50",
        price: 1499,
        image: "/images/placeholder.svg",
        category: "sunscreen",
        skinType: ["all"],
        badge: "MUST HAVE",
        rating: 4.8,
        reviews: 412,
        description: "Broad spectrum sun protection"
    }
];

// Make products globally accessible
window.productsData = shopProducts;

// Current filters
let currentFilters = {
    categories: [],
    skinTypes: [],
    priceRange: [0, 10000],
    sort: 'featured'
};

// Initialize shop page
document.addEventListener('DOMContentLoaded', function() {
    loadShopProducts();
    setupFilterListeners();
    checkUrlParams();
    
    // Initialize wishlist
    window.wishlist = JSON.parse(localStorage.getItem('sanoriaWishlist')) || [];
});

// Load products based on filters
function loadShopProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    // Show loading
    container.innerHTML = `
        <div class="col-12">
            <div class="products-loading">
                <div class="spinner"></div>
            </div>
        </div>
    `;
    
    // Filter products
    let filteredProducts = [...shopProducts];
    
    // Apply category filter
    if (currentFilters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            currentFilters.categories.includes(product.category)
        );
    }
    
    // Apply skin type filter
    if (currentFilters.skinTypes.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.skinType.some(type => currentFilters.skinTypes.includes(type))
        );
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product => 
        product.price >= currentFilters.priceRange[0] && 
        product.price <= currentFilters.priceRange[1]
    );
    
    // Apply sorting
    filteredProducts = sortProductsArray(filteredProducts, currentFilters.sort);
    
    // Update product count
    document.getElementById('productCount').textContent = filteredProducts.length;
    
    // Display products
    setTimeout(() => {
        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your filters or search criteria</p>
                        <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
            
            // Update wishlist UI
            if (window.updateWishlistUI) {
                window.updateWishlistUI();
            }
        }
    }, 500);
}

// Create product card HTML
function createProductCard(product) {
    const oldPriceHTML = product.oldPrice ? 
        `<span class="old-price">Rs. ${product.oldPrice}</span>` : '';
    
    const badgeHTML = product.badge ? 
        `<span class="product-badge">${product.badge}</span>` : '';
    
    const isInWishlist = window.wishlist && window.wishlist.includes(product.id);
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card" data-product-id="${product.id}">
                ${badgeHTML}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='/images/placeholder.svg'">
                    <div class="product-overlay">
                        <button class="btn btn-sm btn-primary quick-view-btn" onclick="quickView(${product.id})">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
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
                        <button class="btn btn-outline-primary btn-sm wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Sort products array
function sortProductsArray(products, sortBy) {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'newest':
            return sorted.reverse(); // Assuming last items are newest
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted; // Featured (default order)
    }
}

// Setup filter listeners
function setupFilterListeners() {
    // Category checkboxes
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterType = this.closest('.filter-group').querySelector('h6').textContent;
            const value = this.value;
            
            if (filterType.includes('Categories')) {
                if (this.checked) {
                    currentFilters.categories.push(value);
                } else {
                    currentFilters.categories = currentFilters.categories.filter(cat => cat !== value);
                }
            } else if (filterType.includes('Skin Type')) {
                if (this.checked) {
                    currentFilters.skinTypes.push(value);
                } else {
                    currentFilters.skinTypes = currentFilters.skinTypes.filter(type => type !== value);
                }
            }
        });
    });
    
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            currentFilters.priceRange[1] = parseInt(this.value);
            document.querySelector('.price-range-values span:last-child').textContent = `Rs. ${this.value}`;
        });
    }
}

// Apply filters
window.applyFilters = function() {
    loadShopProducts();
};

// Clear filters
window.clearFilters = function() {
    // Reset filters
    currentFilters = {
        categories: [],
        skinTypes: [],
        priceRange: [0, 10000],
        sort: 'featured'
    };
    
    // Reset UI
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 10000;
        document.querySelector('.price-range-values span:last-child').textContent = 'Rs. 10,000';
    }
    
    // Reload products
    loadShopProducts();
};

// Sort products
window.sortProducts = function() {
    const sortSelect = document.getElementById('sortSelect');
    currentFilters.sort = sortSelect.value;
    loadShopProducts();
};

// Check URL parameters
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for skin type parameter
    const skinType = urlParams.get('skin');
    if (skinType) {
        currentFilters.skinTypes = [skinType];
        document.querySelector(`input[value="${skinType}"]`)?.click();
    }
    
    // Check for filter parameter
    const filter = urlParams.get('filter');
    if (filter === 'new') {
        // Show newest products
        document.getElementById('sortSelect').value = 'newest';
        currentFilters.sort = 'newest';
    }
    
    loadShopProducts();
}

// Quick view function (reuse from products.js)
window.quickView = function(productId) {
    const product = shopProducts.find(p => p.id === productId);
    if (!product) return;
    
    // You can reuse the quickView modal from products.js
    // or create a simpler version here
    alert(`Quick view for: ${product.name}\nPrice: Rs. ${product.price}\n${product.description}`);
};