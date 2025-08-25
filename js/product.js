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
        // Enhanced sample reviews
        const reviews = [
            {
                id: 1,
                name: 'Ayesha Khan',
                rating: 5,
                date: '2024-12-10',
                title: 'Amazing hydrating serum!',
                text: 'This serum has completely transformed my skin! I\'ve been using it for 3 weeks now and the difference is incredible. My skin feels softer, looks brighter, and fine lines are less visible. The texture is perfect - not too thick or thin, and it absorbs quickly without leaving any residue.',
                verified: true,
                recommend: true,
                skinType: 'Dry',
                helpful: 15,
                userHelpful: false
            },
            {
                id: 2,
                name: 'Fatima Ali',
                rating: 4,
                date: '2024-12-08',
                title: 'Great results after one week',
                text: 'Really impressed with this serum. I have combination skin and was worried it might be too heavy, but it\'s perfect. Noticed improvements in my skin texture after just one week of use. The only reason I\'m not giving 5 stars is the price point, but the quality justifies it.',
                verified: true,
                recommend: true,
                skinType: 'Combination',
                helpful: 12,
                userHelpful: false
            },
            {
                id: 3,
                name: 'Sana Ahmed',
                rating: 5,
                date: '2024-12-05',
                title: 'Perfect for sensitive skin',
                text: 'I have very sensitive skin and most products cause irritation, but this serum is gentle and effective. No breakouts, no redness, just healthy, glowing skin. Love that it\'s fragrance-free. Will definitely repurchase!',
                verified: false,
                recommend: true,
                skinType: 'Sensitive',
                helpful: 8,
                userHelpful: false
            },
            {
                id: 4,
                name: 'Maria Hussain',
                rating: 4,
                date: '2024-12-03',
                title: 'Good product, slow shipping',
                text: 'The serum itself is excellent - lightweight, hydrating, and doesn\'t clog pores. I\'ve been using it for 2 weeks and already see improvements. Only complaint is the shipping took longer than expected, but the product quality makes up for it.',
                verified: true,
                recommend: true,
                skinType: 'Oily',
                helpful: 6,
                userHelpful: false
            },
            {
                id: 5,
                name: 'Zara Sheikh',
                rating: 3,
                date: '2024-11-28',
                title: 'Okay but not amazing',
                text: 'It\'s a decent serum but didn\'t see the dramatic results I was expecting based on other reviews. My skin feels more moisturized but no significant improvement in fine lines or brightness. Might work better for others.',
                verified: false,
                recommend: false,
                skinType: 'Normal',
                helpful: 3,
                userHelpful: false
            }
        ];

        // Store reviews globally for filtering
        window.allReviews = reviews;
        window.displayedReviews = reviews.slice(0, 3); // Show first 3 initially

        displayReviews(window.displayedReviews);
        updateReviewsSummary();
        initReviewFilters();
    }

    function displayReviews(reviews) {
        const reviewsHtml = reviews.map(review => `
            <div class="review-item" data-rating="${review.rating}" data-verified="${review.verified}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="reviewer-details">
                            <h6>${review.name}</h6>
                            <div class="reviewer-meta">
                                <span>${review.skinType} Skin</span>
                                ${review.verified ? '<span class="verified-badge">Verified Purchase</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="review-date">${formatDate(review.date)}</div>
                        <div class="review-rating">
                            ${generateStars(review.rating)}
                        </div>
                    </div>
                </div>
                
                <div class="review-title">${review.title}</div>
                <div class="review-text">${review.text}</div>
                
                <div class="review-footer">
                    <div class="review-recommendation ${review.recommend ? 'recommendation-yes' : 'recommendation-no'}">
                        <i class="fas fa-thumbs-${review.recommend ? 'up' : 'down'}"></i>
                        <span>${review.recommend ? 'Recommends this product' : 'Does not recommend'}</span>
                    </div>
                    <div class="review-actions">
                        <div class="review-action ${review.userHelpful ? 'active' : ''}" onclick="markHelpful(${review.id})">
                            <i class="fas fa-thumbs-up"></i>
                            <span>Helpful (${review.helpful})</span>
                        </div>
                        <div class="review-action" onclick="reportReview(${review.id})">
                            <i class="fas fa-flag"></i>
                            <span>Report</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        $('#reviewsSection').html(reviewsHtml);
    }

    function updateReviewsSummary() {
        const reviews = window.allReviews || [];
        const totalReviews = reviews.length;
        const avgRating = reviews.length > 0 ? 
            (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

        $('#overallRating').text(avgRating);
        $('#totalReviews').text(totalReviews);
        $('#reviewCount').text(totalReviews);
        $('#overallStars').html(generateStars(parseFloat(avgRating)));

        // Update rating breakdown
        const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
        reviews.forEach(review => {
            ratingCounts[review.rating - 1]++;
        });

        $('.rating-bar-item').each(function(index) {
            const starLevel = 5 - index; // 5 stars, 4 stars, etc.
            const count = ratingCounts[starLevel - 1];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            $(this).find('.rating-fill').css('width', `${percentage}%`);
            $(this).find('.rating-count').text(count);
        });
    }

    function initReviewFilters() {
        // Filter buttons
        $('.filter-buttons .btn').on('click', function() {
            $('.filter-buttons .btn').removeClass('active');
            $(this).addClass('active');
            
            const filter = $(this).data('filter');
            filterReviews(filter);
        });

        // Sort dropdown
        $('.review-sort select').on('change', function() {
            const sortBy = $(this).val();
            sortReviews(sortBy);
        });

        // Load more button
        $('#loadMoreReviews').on('click', function() {
            loadMoreReviews();
        });

        // Initialize load more button visibility
        updateLoadMoreButton();
    }

    function filterReviews(filter) {
        let filteredReviews = [...window.allReviews];

        if (filter === 'verified') {
            filteredReviews = filteredReviews.filter(review => review.verified);
        } else if (filter !== 'all') {
            const rating = parseInt(filter);
            filteredReviews = filteredReviews.filter(review => review.rating === rating);
        }

        window.displayedReviews = filteredReviews.slice(0, 3);
        displayReviews(window.displayedReviews);
        updateLoadMoreButton(filteredReviews.length);
    }

    function sortReviews(sortBy) {
        let sortedReviews = [...window.displayedReviews];

        switch(sortBy) {
            case 'newest':
                sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'highest':
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                sortedReviews.sort((a, b) => b.helpful - a.helpful);
                break;
        }

        displayReviews(sortedReviews);
    }

    function loadMoreReviews() {
        const currentFilter = $('.filter-buttons .btn.active').data('filter');
        let allFilteredReviews = [...window.allReviews];

        if (currentFilter === 'verified') {
            allFilteredReviews = allFilteredReviews.filter(review => review.verified);
        } else if (currentFilter !== 'all') {
            const rating = parseInt(currentFilter);
            allFilteredReviews = allFilteredReviews.filter(review => review.rating === rating);
        }

        const currentCount = window.displayedReviews.length;
        const newReviews = allFilteredReviews.slice(currentCount, currentCount + 3);
        
        window.displayedReviews = [...window.displayedReviews, ...newReviews];
        displayReviews(window.displayedReviews);
        updateLoadMoreButton(allFilteredReviews.length);
    }

    function updateLoadMoreButton(totalAvailable = null) {
        const total = totalAvailable || window.allReviews.length;
        const displayed = window.displayedReviews.length;
        
        if (displayed >= total) {
            $('#loadMoreReviews').hide();
        } else {
            $('#loadMoreReviews').show().text(`Load More Reviews (${total - displayed} remaining)`);
        }
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

// =====================
// REVIEW MODAL FUNCTIONS
// =====================

window.openReviewModal = function() {
    if (!currentProduct) return;
    
    // Populate product info in modal
    $('#reviewProductImage').attr('src', currentProduct.images[0]).attr('alt', currentProduct.name);
    $('#reviewProductName').text(currentProduct.name);
    
    // Reset form
    $('#reviewForm')[0].reset();
    $('.star-label').removeClass('active');
    $('#charCount').text('0');
    $('.rating-description').text('Click to rate this product');
    
    // Show modal
    $('#reviewModal').modal('show');
};

// Initialize review modal functionality
$(document).ready(function() {
    // Character count for review text
    $('#reviewText').on('input', function() {
        const length = $(this).val().length;
        $('#charCount').text(length);
        
        if (length > 500) {
            $(this).addClass('is-invalid');
            $('#charCount').parent().addClass('text-danger');
        } else {
            $(this).removeClass('is-invalid');
            $('#charCount').parent().removeClass('text-danger');
        }
    });

    // Rating input functionality
    $('.rating-input input[type="radio"]').on('change', function() {
        const rating = $(this).val();
        const descriptions = {
            '1': 'Poor - I do not recommend this product',
            '2': 'Fair - Below average, has some issues',
            '3': 'Good - Average product, meets expectations',
            '4': 'Very Good - Above average, would recommend',
            '5': 'Excellent - Outstanding product, highly recommend!'
        };
        $('.rating-description').text(descriptions[rating]);
    });

    // Submit review
    $('#submitReview').on('click', function() {
        submitProductReview();
    });
});

function submitProductReview() {
    // Validate form
    const rating = $('input[name="rating"]:checked').val();
    const title = $('#reviewTitle').val().trim();
    const text = $('#reviewText').val().trim();
    const name = $('#reviewerName').val().trim();
    const recommend = $('input[name="recommend"]:checked').val();
    const agreeTerms = $('#agreeTerms').is(':checked');

    if (!rating || !title || !text || !name || !recommend || !agreeTerms) {
        alert('Please fill in all required fields and accept the terms.');
        return;
    }

    if (text.length > 500) {
        alert('Review text must be 500 characters or less.');
        return;
    }

    // Create review object
    const newReview = {
        id: Date.now(),
        name: name,
        rating: parseInt(rating),
        date: new Date().toISOString().split('T')[0],
        title: title,
        text: text,
        verified: false, // Would be true for actual purchases
        recommend: recommend === 'yes',
        skinType: $('#skinType').val() || 'Not specified',
        helpful: 0,
        userHelpful: false,
        email: $('#reviewerEmail').val().trim()
    };

    // Add to reviews (in real app, this would be sent to server)
    if (window.allReviews) {
        window.allReviews.unshift(newReview);
        window.displayedReviews.unshift(newReview);
        
        // Update display
        displayReviews(window.displayedReviews);
        updateReviewsSummary();
        updateLoadMoreButton();
        
        // Update product rating count
        $('#reviewCount').text(window.allReviews.length);
        
        // Show success message
        $('#reviewModal').modal('hide');
        showReviewSuccessMessage();
        
        // Scroll to reviews section
        setTimeout(() => {
            $('button[data-bs-target="#reviews-tab"]').click();
            $('html, body').animate({
                scrollTop: $('#reviews-tab').offset().top - 100
            }, 500);
        }, 1000);
        
        console.log('Review submitted:', newReview);
    }
}

function showReviewSuccessMessage() {
    const message = $(`
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 100px; right: 20px; z-index: 10000; min-width: 350px;">
            <h6><i class="fas fa-check-circle me-2"></i>Review Submitted Successfully!</h6>
            <p class="mb-0">Thank you for sharing your experience. Your review helps other customers make informed decisions.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(message);
    
    setTimeout(() => {
        message.alert('close');
    }, 5000);
}

// =====================
// REVIEW INTERACTION FUNCTIONS
// =====================

window.markHelpful = function(reviewId) {
    const review = window.allReviews.find(r => r.id === reviewId);
    if (review) {
        if (!review.userHelpful) {
            review.helpful++;
            review.userHelpful = true;
            
            // Update display
            const reviewElement = $(`.review-item`).filter(function() {
                return $(this).find('.review-action').first().attr('onclick').includes(reviewId);
            });
            
            reviewElement.find('.review-action').first()
                .addClass('active')
                .find('span').text(`Helpful (${review.helpful})`);
        }
    }
};

window.reportReview = function(reviewId) {
    if (confirm('Are you sure you want to report this review as inappropriate?')) {
        // In real app, this would send a report to the server
        alert('Thank you for reporting. We will review this feedback.');
        console.log('Review reported:', reviewId);
    }
};