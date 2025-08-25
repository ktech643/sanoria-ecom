/**
 * Product Page JavaScript for Sanoria.pk
 * Handles product display, image gallery, cart functionality
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // INITIALIZATION
    // =====================
    
    let currentProduct = null;
    let selectedQuantity = 1;
    let selectedSize = null;
    
    // Load product from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProductData(productId);
    } else {
        // Default product for demo
        loadProductData(1);
    }

    // =====================
    // PRODUCT DATA LOADING
    // =====================
    
    function loadProductData(productId) {
        // Sample product data (in real app, this would come from API)
        const products = {
            1: {
                id: 1,
                name: 'Hydrating Facial Serum',
                description: 'A luxurious hydrating serum that deeply moisturizes and revitalizes your skin for a radiant, youthful glow.',
                fullDescription: `
                    <p>Our premium Hydrating Facial Serum is formulated with advanced ingredients to deliver intense moisture and nourishment to your skin. This lightweight, fast-absorbing serum penetrates deep into the skin layers to provide long-lasting hydration.</p>
                    <p>Perfect for all skin types, this serum helps to:</p>
                    <ul>
                        <li>Restore skin's natural moisture barrier</li>
                        <li>Reduce fine lines and wrinkles</li>
                        <li>Improve skin texture and elasticity</li>
                        <li>Provide antioxidant protection</li>
                        <li>Give your skin a healthy, radiant glow</li>
                    </ul>
                    <p>Dermatologist tested and suitable for sensitive skin. Free from parabens, sulfates, and artificial fragrances.</p>
                `,
                price: 1299,
                originalPrice: 1599,
                discount: 19,
                images: [
                    'images/products/product-1.svg',
                    'images/products/product-1.svg',
                    'images/products/product-1.svg'
                ],
                category: 'Skincare',
                subcategory: 'Serums',
                tags: ['Hydrating', 'Anti-Aging', 'Moisturizing', 'Serum'],
                sku: 'SAN-SER-001',
                inStock: true,
                stockQuantity: 25,
                rating: 4.8,
                reviewCount: 127,
                benefits: [
                    'Deep hydration for up to 24 hours',
                    'Reduces appearance of fine lines',
                    'Improves skin elasticity and firmness',
                    'Suitable for all skin types',
                    'Fast-absorbing, non-greasy formula'
                ],
                ingredients: `
                    <strong>Key Ingredients:</strong>
                    <ul>
                        <li><strong>Hyaluronic Acid:</strong> Provides intense hydration and plumps the skin</li>
                        <li><strong>Vitamin E:</strong> Powerful antioxidant that protects against free radicals</li>
                        <li><strong>Niacinamide:</strong> Improves skin texture and minimizes pores</li>
                        <li><strong>Peptides:</strong> Stimulate collagen production for firmer skin</li>
                        <li><strong>Aloe Vera Extract:</strong> Soothes and calms irritated skin</li>
                    </ul>
                    <p><strong>Full Ingredients List:</strong> Aqua, Sodium Hyaluronate, Niacinamide, Tocopheryl Acetate, Palmitoyl Tripeptide-1, Aloe Barbadensis Leaf Extract, Glycerin, Carbomer, Phenoxyethanol, Ethylhexylglycerin</p>
                `,
                usage: `
                    <ol>
                        <li><strong>Cleanse:</strong> Start with a clean face using your favorite cleanser</li>
                        <li><strong>Apply:</strong> Use 2-3 drops of serum on your fingertips</li>
                        <li><strong>Massage:</strong> Gently massage into face and neck using upward motions</li>
                        <li><strong>Wait:</strong> Allow 2-3 minutes for complete absorption</li>
                        <li><strong>Moisturize:</strong> Follow with your regular moisturizer</li>
                        <li><strong>Protect:</strong> Always use sunscreen during the day</li>
                    </ol>
                    <p><strong>Usage Tips:</strong></p>
                    <ul>
                        <li>Use twice daily, morning and evening</li>
                        <li>Can be used under makeup</li>
                        <li>Start with once daily if you have sensitive skin</li>
                        <li>Store in a cool, dry place away from direct sunlight</li>
                    </ul>
                `,
                sizes: [
                    { size: '15ml', price: 799, label: 'Travel Size' },
                    { size: '30ml', price: 1299, label: 'Regular Size' },
                    { size: '50ml', price: 1999, label: 'Value Size' }
                ]
            },
            2: {
                id: 2,
                name: 'Vitamin C Brightening Serum',
                description: 'Powerful vitamin C serum that brightens skin tone and reduces dark spots for a luminous complexion.',
                fullDescription: `
                    <p>Our Vitamin C Brightening Serum is a potent anti-aging treatment that helps to brighten your complexion and reduce the appearance of dark spots, hyperpigmentation, and uneven skin tone.</p>
                    <p>This advanced formula contains 20% Vitamin C along with other powerful antioxidants to protect your skin from environmental damage while promoting a brighter, more youthful appearance.</p>
                `,
                price: 1599,
                originalPrice: null,
                discount: 0,
                images: [
                    'images/products/product-2.svg',
                    'images/products/product-2.svg',
                    'images/products/product-2.svg'
                ],
                category: 'Skincare',
                subcategory: 'Serums',
                tags: ['Vitamin C', 'Brightening', 'Anti-Aging', 'Antioxidant'],
                sku: 'SAN-SER-002',
                inStock: true,
                stockQuantity: 18,
                rating: 4.6,
                reviewCount: 89,
                benefits: [
                    'Brightens and evens skin tone',
                    'Reduces dark spots and hyperpigmentation',
                    'Provides antioxidant protection',
                    'Stimulates collagen production',
                    'Gives skin a radiant glow'
                ],
                ingredients: `
                    <strong>Key Ingredients:</strong>
                    <ul>
                        <li><strong>L-Ascorbic Acid (Vitamin C):</strong> Brightens skin and provides antioxidant protection</li>
                        <li><strong>Ferulic Acid:</strong> Stabilizes Vitamin C and enhances its effectiveness</li>
                        <li><strong>Vitamin E:</strong> Works synergistically with Vitamin C for enhanced benefits</li>
                        <li><strong>Hyaluronic Acid:</strong> Provides hydration and plumps the skin</li>
                    </ul>
                `,
                usage: `
                    <ol>
                        <li>Use in the morning after cleansing</li>
                        <li>Apply 2-3 drops to clean skin</li>
                        <li>Gently pat into skin until absorbed</li>
                        <li>Follow with moisturizer and sunscreen</li>
                    </ol>
                    <p><strong>Important:</strong> Always use sunscreen when using Vitamin C products.</p>
                `,
                sizes: [
                    { size: '30ml', price: 1599, label: 'Standard Size' }
                ]
            }
        };

        currentProduct = products[productId] || products[1];
        displayProductData();
        loadRelatedProducts();
        loadProductReviews();
        updateCartDisplay();
    }

    function displayProductData() {
        if (!currentProduct) return;

        // Update page title
        document.title = `${currentProduct.name} - Sanoria.pk`;
        $('#productTitle').text(currentProduct.name);

        // Update breadcrumb
        updateBreadcrumb();

        // Product basic info
        $('#productName').text(currentProduct.name);
        $('#productDescription').text(currentProduct.description);
        $('#fullDescription').html(currentProduct.fullDescription);
        $('#productIngredients').html(currentProduct.ingredients);
        $('#usageInstructions').html(currentProduct.usage);

        // Pricing
        $('#currentPrice').text(`Rs. ${currentProduct.price.toLocaleString()}`);
        if (currentProduct.originalPrice) {
            $('#originalPrice').text(`Rs. ${currentProduct.originalPrice.toLocaleString()}`).show();
            $('#discountBadge').text(`${currentProduct.discount}% OFF`).show();
        }

        // Rating
        displayRating(currentProduct.rating, currentProduct.reviewCount);

        // Product meta
        $('#productSku').text(currentProduct.sku);
        $('#productCategory').text(currentProduct.category);
        $('#productTags').text(currentProduct.tags.join(', '));
        $('#productStock').text(currentProduct.inStock ? 'In Stock' : 'Out of Stock')
            .removeClass('in-stock out-of-stock')
            .addClass(currentProduct.inStock ? 'in-stock' : 'out-of-stock');

        // Benefits
        const benefitsList = currentProduct.benefits.map(benefit => `<li>${benefit}</li>`).join('');
        $('#productBenefits').html(benefitsList);

        // Images
        displayProductImages();

        // Sizes
        if (currentProduct.sizes && currentProduct.sizes.length > 1) {
            displaySizeOptions();
        }

        // Reviews count
        $('#reviewCount').text(currentProduct.reviewCount);
        $('#ratingCount').text(`(${currentProduct.reviewCount} reviews)`);
    }

    function updateBreadcrumb() {
        const breadcrumb = `
            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
            <li class="breadcrumb-item"><a href="category.html">${currentProduct.category}</a></li>
            <li class="breadcrumb-item active">${currentProduct.name}</li>
        `;
        $('#breadcrumbNav').html(breadcrumb);
    }

    function displayRating(rating, count) {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }

        $('#productRating').html(starsHtml);
    }

    function displayProductImages() {
        // Main image
        const mainImage = currentProduct.images[0] || 'images/placeholder.svg';
        $('#mainImage').attr('src', mainImage).attr('alt', currentProduct.name);

        // Thumbnails
        if (currentProduct.images.length > 1) {
            const thumbnailsHtml = currentProduct.images.map((image, index) => `
                <div class="col-3">
                    <img src="${image}" alt="${currentProduct.name} ${index + 1}" 
                         class="thumbnail-image ${index === 0 ? 'active' : ''}" 
                         onclick="changeMainImage('${image}', ${index})"
                         onerror="this.src='images/placeholder.svg'">
                </div>
            `).join('');
            $('#thumbnailImages').html(thumbnailsHtml);
        }
    }

    function displaySizeOptions() {
        const sizesHtml = currentProduct.sizes.map(size => `
            <button class="size-btn" data-size="${size.size}" data-price="${size.price}">
                ${size.size}
                <br><small>${size.label}</small>
            </button>
        `).join('');
        
        $('.size-buttons').html(sizesHtml);
        $('#sizeOptions').show();

        // Set default size
        selectedSize = currentProduct.sizes[1] || currentProduct.sizes[0];
        $(`.size-btn[data-size="${selectedSize.size}"]`).addClass('active');
        $('#currentPrice').text(`Rs. ${selectedSize.price.toLocaleString()}`);

        // Size selection handler
        $('.size-btn').on('click', function() {
            $('.size-btn').removeClass('active');
            $(this).addClass('active');
            
            const size = $(this).data('size');
            const price = $(this).data('price');
            selectedSize = { size, price };
            $('#currentPrice').text(`Rs. ${price.toLocaleString()}`);
        });
    }

    // =====================
    // IMAGE GALLERY
    // =====================
    
    window.changeMainImage = function(imageSrc, index) {
        $('#mainImage').attr('src', imageSrc);
        $('.thumbnail-image').removeClass('active');
        $(`.thumbnail-image:eq(${index})`).addClass('active');
    };

    window.openImageZoom = function() {
        const mainImageSrc = $('#mainImage').attr('src');
        $('#zoomedImage').attr('src', mainImageSrc);
        $('#imageZoomModal').modal('show');
    };

    // =====================
    // QUANTITY CONTROLS
    // =====================
    
    window.increaseQuantity = function() {
        const currentQty = parseInt($('#quantity').val());
        if (currentQty < 10) {
            const newQty = currentQty + 1;
            $('#quantity').val(newQty);
            selectedQuantity = newQty;
        }
    };

    window.decreaseQuantity = function() {
        const currentQty = parseInt($('#quantity').val());
        if (currentQty > 1) {
            const newQty = currentQty - 1;
            $('#quantity').val(newQty);
            selectedQuantity = newQty;
        }
    };

    // =====================
    // PRODUCT ACTIONS
    // =====================
    
    window.addToCart = function() {
        if (!currentProduct) return;

        const cartItem = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: selectedSize ? selectedSize.price : currentProduct.price,
            quantity: selectedQuantity,
            image: currentProduct.images[0] || 'images/placeholder.svg',
            size: selectedSize ? selectedSize.size : null
        };

        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
        
        // Check if item already exists
        const existingItemIndex = cart.findIndex(item => 
            item.id === cartItem.id && item.size === cartItem.size
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            // Add new item
            cart.push(cartItem);
        }

        // Save to localStorage
        localStorage.setItem('sanoria_cart', JSON.stringify(cart));

        // Update cart display
        updateCartDisplay();

        // Show success message
        showAddToCartMessage();

        // Track event
        console.log('Added to cart:', cartItem);
    };

    window.addToWishlist = function() {
        if (!currentProduct) return;

        const wishlistItem = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images[0] || 'images/placeholder.svg',
            dateAdded: new Date().toISOString()
        };

        // Get existing wishlist
        let wishlist = JSON.parse(localStorage.getItem('sanoria_wishlist')) || [];
        
        // Check if item already exists
        const existingItem = wishlist.find(item => item.id === wishlistItem.id);

        if (!existingItem) {
            wishlist.push(wishlistItem);
            localStorage.setItem('sanoria_wishlist', JSON.stringify(wishlist));
            
            // Update wishlist count
            $('.wishlist-count').text(wishlist.length);
            
            // Show success message
            showWishlistMessage();
        } else {
            alert('This item is already in your wishlist!');
        }

        console.log('Added to wishlist:', wishlistItem);
    };

    window.buyNow = function() {
        // Add to cart first
        addToCart();
        
        // Redirect to checkout
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 500);
    };

    // =====================
    // RELATED PRODUCTS
    // =====================
    
    function loadRelatedProducts() {
        // Sample related products
        const relatedProducts = [
            {
                id: 2,
                name: 'Vitamin C Serum',
                price: 1599,
                image: 'images/products/product-2.svg',
                rating: 4.6
            },
            {
                id: 3,
                name: 'Gentle Cleanser',
                price: 899,
                image: 'images/products/product-3.svg',
                rating: 4.4
            },
            {
                id: 4,
                name: 'Night Cream',
                price: 1899,
                image: 'images/products/product-4.svg',
                rating: 4.7
            }
        ];

        const relatedHtml = relatedProducts.map(product => `
            <div class="col-md-4">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.svg'">
                        <div class="product-overlay">
                            <button class="btn btn-primary btn-sm" onclick="viewProduct(${product.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h6>${product.name}</h6>
                        <div class="product-rating">
                            ${generateStars(product.rating)}
                        </div>
                        <div class="product-price">
                            Rs. ${product.price.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        $('#relatedProducts').html(relatedHtml);
    }

    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star text-warning"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star text-warning"></i>';
        }
        return starsHtml;
    }

    window.viewProduct = function(productId) {
        window.location.href = `product.html?id=${productId}`;
    };

    // =====================
    // REVIEWS
    // =====================
    
    function loadProductReviews() {
        // Sample reviews
        const reviews = [
            {
                name: 'Ayesha Khan',
                rating: 5,
                date: '2024-12-10',
                text: 'Amazing product! My skin feels so much more hydrated and looks brighter. Definitely recommend!'
            },
            {
                name: 'Fatima Ali',
                rating: 4,
                date: '2024-12-08',
                text: 'Great serum, noticed improvements in my skin texture after just one week of use.'
            },
            {
                name: 'Sana Ahmed',
                rating: 5,
                date: '2024-12-05',
                text: 'Love this product! It absorbs quickly and doesn\'t leave any sticky residue. Will buy again.'
            }
        ];

        const reviewsHtml = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${formatDate(review.date)}</span>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
                <div class="review-text">
                    ${review.text}
                </div>
            </div>
        `).join('');

        $('#reviewsSection').html(reviewsHtml);
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    
    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
        $('.cart-count').text(cart.length);
    }

    function showAddToCartMessage() {
        // Create a temporary success message
        const message = $(`
            <div class="alert alert-success alert-dismissible fade show position-fixed" 
                 style="top: 100px; right: 20px; z-index: 10000; min-width: 300px;">
                <i class="fas fa-check-circle me-2"></i>
                Product added to cart successfully!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(message);
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            message.alert('close');
        }, 3000);
    }

    function showWishlistMessage() {
        const message = $(`
            <div class="alert alert-info alert-dismissible fade show position-fixed" 
                 style="top: 100px; right: 20px; z-index: 10000; min-width: 300px;">
                <i class="fas fa-heart me-2"></i>
                Product added to wishlist!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(message);
        
        setTimeout(() => {
            message.alert('close');
        }, 3000);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    console.log('✅ Product page loaded successfully');
});