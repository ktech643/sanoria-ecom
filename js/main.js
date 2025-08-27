/**
 * Sanoria.pk - Main JavaScript File
 * Handles all interactive functionality for the e-commerce website
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // GLOBAL VARIABLES
    // =====================
    let cart = JSON.parse(localStorage.getItem('sanoria_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('sanoria_wishlist')) || [];
    let userSession = JSON.parse(localStorage.getItem('sanoria_user')) || null;

    // =====================
    // INITIALIZATION
    // =====================
    
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize navigation
    initNavigation();
    // Initialize header scroll/parallax and interactions
    initHeaderAnimations();
    
    // Initialize product functionality
    initProductFunctionality();
    
    // Initialize chatbot
    initChatbot();
    
    // Initialize QR scanner
    initQRScanner();
    
    // Initialize search functionality
    initSearch();
    initMobileSearch();
    // Initialize global fade-ins and image lazy-load effects
    initRevealAnimations();
    initLazyImages();
    
    // Initialize cart and wishlist
    updateCartDisplay();
    updateWishlistDisplay();
    
    // Initialize notifications
    initNotifications();
    
    // Initialize notification tracking
    initNotificationTracking();

    // Initialize footer animations and scroll-to-top
    initFooterAnimations();
    initScrollToTop();
    injectTechBadges();

    // =====================
    // LOADING SCREEN
    // =====================
    function initLoadingScreen() {
        // Simulate loading time
        setTimeout(function() {
            $('#loading-screen').fadeOut(500, function() {
                $(this).remove();
                // Initialize AOS animations after loading
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 600,
                        easing: 'ease-in-out',
                        once: true,
                        mirror: false
                    });
                }
                // After loading screen, reveal elements with fade-in class
                $('.fade-in').each(function(index) {
                    const element = $(this);
                    setTimeout(() => element.addClass('is-visible'), 80 * index);
                });
            });
        }, 2000);
    }

    // =====================
    // NAVIGATION
    // =====================
    function initNavigation() {
        // Hamburger menu animation
        $('.hamburger-menu').on('click', function() {
            $(this).toggleClass('active');
        });

        // Navbar scroll effect
        $(window).on('scroll', throttle(function() {
            const scrolled = $(window).scrollTop() > 100;
            $('.main-header').toggleClass('scrolled', scrolled);
        }, 100));

        // Smooth scrolling for anchor links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            
            const target = $($(this).attr('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 600);
            }
        });

        // Active navigation highlighting
        highlightActiveNavigation();
    }

    // =====================
    // HEADER PARALLAX & INTERACTIONS
    // =====================
    function initHeaderAnimations() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const $hero = $('.hero-section');
        if ($hero.length === 0) return;

        const $slides = $hero.find('.hero-slide');
        const $image = $hero.find('.hero-image img');
        const $content = $hero.find('.hero-content');

        $(window).on('scroll', throttle(function() {
            const scrollY = window.scrollY || window.pageYOffset;
            const parallaxY = Math.min(scrollY * 0.25, 120);
            const imageY = Math.min(scrollY * 0.15, 80);

            // Background parallax
            $slides.css('background-position', `center calc(50% + ${parallaxY}px)`);
            // Foreground image slight parallax
            $image.css('transform', `translateY(${imageY}px) scale(1.02)`);
            // Content easing upward slightly
            $content.css('transform', `translateY(${Math.max(0, 40 - scrollY * 0.1)}px)`);
        }, 16));
    }

    // =====================
    // REVEAL ON VIEWPORT & LAZY IMAGES
    // =====================
    function initRevealAnimations() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const $elements = $('.fade-in');
        if ($elements.length === 0) return;

        if (prefersReduced || !('IntersectionObserver' in window)) {
            $elements.addClass('is-visible');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

        $elements.each(function() { observer.observe(this); });
    }

    function initLazyImages() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const $lazy = $('img.lazy-image');
        if ($lazy.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            $lazy.each(function() { $(this).addClass('is-loaded'); });
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const $img = $(img);
                    const src = $img.data('src');
                    if (src) {
                        $img.attr('src', src);
                    }
                    $img.on('load', function() { $img.addClass('is-loaded'); });
                    if (prefersReduced) $img.addClass('is-loaded');
                    io.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        $lazy.each(function() { io.observe(this); });
    }

    // =====================
    // FOOTER REVEAL & SCROLL TO TOP
    // =====================
    function initFooterAnimations() {
        const $targets = $('.main-footer .footer-section, .main-footer .footer-links-inline, .main-footer .payment-item');
        if ($targets.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            $targets.addClass('is-visible');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        $targets.each(function() { observer.observe(this); });
    }

    function initScrollToTop() {
        if ($('#scrollToTopBtn').length === 0) {
            $('body').append('<button id="scrollToTopBtn" aria-label="Scroll to top" title="Scroll to top"><i class="fas fa-arrow-up"></i></button>');
        }
        const $btn = $('#scrollToTopBtn');

        $(window).on('scroll', throttle(function() {
            const show = window.scrollY > 400;
            $btn.toggleClass('show', show);
        }, 100));

        $btn.on('click', function() {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) {
                window.scrollTo(0, 0);
            } else {
                $('html, body').animate({ scrollTop: 0 }, 500);
            }
        });
    }

    // =====================
    // UTILITIES (throttle/debounce)
    // =====================
    function throttle(fn, wait) {
        let previous = 0; let timeout = null; let storedArgs = null; let storedThis = null;
        return function throttled() {
            const now = Date.now();
            storedArgs = arguments; storedThis = this;
            const remaining = wait - (now - previous);
            if (remaining <= 0) {
                clearTimeout(timeout); timeout = null; previous = now;
                fn.apply(storedThis, storedArgs);
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    previous = Date.now(); timeout = null;
                    fn.apply(storedThis, storedArgs);
                }, remaining);
            }
        };
    }

    // =====================
    // INJECT ANIMATED TECH BADGES IN FOOTER
    // =====================
    function injectTechBadges() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const $footer = $('.main-footer .container');
        if ($footer.length === 0) return;

        if ($('.tech-badges').length) return; // prevent duplicates

        const badgesHtml = `
            <div class="tech-badges" aria-label="Built with technologies">
                <div class="tech-badge js" tabindex="0" title="JavaScript">
                    <img class="icon" alt="JS" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23f7df1e'/%3E%3Cpath fill='%233A3A3A' d='M20.4 24.7c.6 1 1.3 1.8 2.7 1.8 1.1 0 1.8-.6 1.8-1.5 0-1-.7-1.4-2-2l-.7-.3c-2-.9-3.3-2-3.3-4.3 0-2.1 1.6-3.7 4.1-3.7 1.8 0 3.1.6 4 2.2l-2.2 1.4c-.5-.9-1-1.2-1.8-1.2-.8 0-1.3.5-1.3 1.2 0 .9.5 1.3 1.7 1.9l.7.3c2.3 1 3.6 2.1 3.6 4.5 0 2.6-2 4-4.7 4-2.6 0-4.2-1.2-5-2.8l2.4-1.5ZM11.3 25c.4.7.8 1.2 1.7 1.2.9 0 1.4-.3 1.4-1.6v-8.8h2.7v8.9c0 2.8-1.6 4-3.9 4-2.1 0-3.3-1-3.9-2.3l2-1.4Z'/%3E%3C/svg%3E"/>
                    <span>JavaScript</span>
                </div>
                <div class="tech-badge jquery" tabindex="0" title="jQuery">
                    <img class="icon" alt="jQuery" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%230769ad' d='M52 64c12 36 38 64 74 82c-24-14-42-35-52-62c-9-24-7-47 3-68C64 28 58 45 52 64Zm57-36c9 36 27 64 57 82c-21-14-36-35-45-62c-8-24-7-47 2-68c-7 14-11 31-14 48Zm54-36c6 35 20 63 44 82c-16-14-28-34-35-61c-6-24-5-47 2-68c-5 14-8 30-11 47Z'/%3E%3C/svg%3E"/>
                    <span>jQuery</span>
                </div>
                <div class="tech-badge css" tabindex="0" title="CSS3">
                    <img class="icon" alt="CSS" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Cpath fill='%23264de4' d='M19 0l9 100l36 10l36-10l9-100H19Zm73 26l-1 8l-36 15l1 9l34-14l-2 19l-24 7l-23-7l-1-12l9 3l-1-10l-9-3l-1-8h54Z'/%3E%3C/svg%3E"/>
                    <span>CSS3</span>
                </div>
            </div>`;

        const $row = $('<div class="row mt-3"><div class="col-12 text-center"></div></div>');
        $row.find('.col-12').append(badgesHtml);

        // Append near bottom above copyright
        const $footerRows = $footer.find('.row');
        if ($footerRows.length) {
            $($footerRows[$footerRows.length - 1]).before($row);
        } else {
            $footer.append($row);
        }

        // Stagger in
        const $badges = $row.find('.tech-badge');
        $badges.each(function(index) {
            const el = $(this);
            setTimeout(() => el.addClass('show'), prefersReduced ? 0 : 100 * index);
        });

        // Hover/Focus lift
        $footer.on('mouseenter focusin', '.tech-badge', function() {
            if (prefersReduced) return;
            $(this).css('transform', 'translateY(-3px)');
        });
        $footer.on('mouseleave focusout', '.tech-badge', function() {
            if (prefersReduced) return;
            $(this).css('transform', 'translateY(0)');
        });
    }

    function highlightActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        $('.nav-link').each(function() {
            const linkHref = $(this).attr('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                $(this).addClass('active');
            }
        });
    }

    // =====================
    // PRODUCT FUNCTIONALITY
    // =====================
    function initProductFunctionality() {
        // Add to cart functionality
        $(document).on('click', '.add-to-cart-btn', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            addToCart(productId);
        });

        // Wishlist functionality
        $(document).on('click', '.wishlist-btn', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            toggleWishlist(productId);
        });

        // Quick view functionality
        $(document).on('click', '.quick-view-btn', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            showQuickView(productId);
        });

        // Product image hover effects
        $('.product-image img').on('mouseenter', function() {
            $(this).closest('.product-card').addClass('hovered');
        }).on('mouseleave', function() {
            $(this).closest('.product-card').removeClass('hovered');
        });
    }

    function addToCart(productId) {
        // Sample product data (in real app, this would come from API)
        const product = getProductById(productId);
        
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }

        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`${product.name} quantity updated in cart`, 'success');
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            showNotification(`${product.name} added to cart`, 'success');
        }

        // Update cart display and save to localStorage
        updateCartDisplay();
        saveCartToStorage();
        
        // Add visual feedback
        animateCartIcon();
    }

    function toggleWishlist(productId) {
        const product = getProductById(productId);
        const existingIndex = wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            showNotification(`${product.name} removed from wishlist`, 'info');
            $(`.wishlist-btn[data-product-id="${productId}"]`).removeClass('active');
        } else {
            wishlist.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                dateAdded: new Date().toISOString()
            });
            showNotification(`${product.name} added to wishlist`, 'success');
            $(`.wishlist-btn[data-product-id="${productId}"]`).addClass('active');
        }

        updateWishlistDisplay();
        saveWishlistToStorage();
    }

    function showQuickView(productId) {
        const product = getProductById(productId);
        
        if (!product) return;

        // Create and show quick view modal
        const quickViewModal = `
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
                                    <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
                                </div>
                                <div class="col-md-6">
                                    <h4>${product.name}</h4>
                                    <div class="product-rating mb-3">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star-half-alt"></i>
                                        <span class="rating-count">(${product.reviews} reviews)</span>
                                    </div>
                                    <div class="product-price mb-3">
                                        <span class="current-price h4 text-primary">Rs. ${product.price.toLocaleString()}</span>
                                        ${product.originalPrice ? `<span class="original-price text-muted text-decoration-line-through ms-2">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
                                    </div>
                                    <p class="product-description">${product.description}</p>
                                    <div class="product-actions">
                                        <button class="btn btn-primary me-2 add-to-cart-btn" data-product-id="${productId}">
                                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                        </button>
                                        <button class="btn btn-outline-primary wishlist-btn" data-product-id="${productId}">
                                            <i class="fas fa-heart me-2"></i>Add to Wishlist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal and add new one
        $('#quickViewModal').remove();
        $('body').append(quickViewModal);
        $('#quickViewModal').modal('show');
    }

    // =====================
    // CART MANAGEMENT
    // =====================
    function updateCartDisplay() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        $('.cart-count').text(cartCount);
        
        if (cartCount > 0) {
            $('.cart-count').show();
        } else {
            $('.cart-count').hide();
        }
    }

    function updateWishlistDisplay() {
        const wishlistCount = wishlist.length;
        $('.header-icon .badge').first().text(wishlistCount);
        
        if (wishlistCount > 0) {
            $('.header-icon .badge').first().show();
        } else {
            $('.header-icon .badge').first().hide();
        }
    }

    function saveCartToStorage() {
        localStorage.setItem('sanoria_cart', JSON.stringify(cart));
    }

    function saveWishlistToStorage() {
        localStorage.setItem('sanoria_wishlist', JSON.stringify(wishlist));
    }

    function animateCartIcon() {
        $('.header-icon:has(.cart-count)').addClass('bounce');
        setTimeout(() => {
            $('.header-icon:has(.cart-count)').removeClass('bounce');
        }, 600);
    }

    // =====================
    // SEARCH FUNCTIONALITY
    // =====================
    function initSearch() {
        const searchInputs = $('.search-input, .mobile-search input');
        
        searchInputs.on('keyup', debounce(function() {
            const query = $(this).val().trim();
            const $searchContainer = $(this).closest('.search-container');
            
            if (query.length >= 2) {
                performSearch(query, $searchContainer);
            } else {
                hideSearchResults();
            }
        }, 300));

        $('.btn-search').on('click', function() {
            const query = $(this).siblings('.search-input').val().trim();
            if (query.length >= 2) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        });

        // Handle Enter key
        searchInputs.on('keypress', function(e) {
            if (e.which === 13) {
                const query = $(this).val().trim();
                if (query.length >= 2) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });

        // Hide search results when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.search-container').length) {
                hideSearchResults();
            }
        });

        // Handle search result clicks
        $(document).on('click', '.search-result-item', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            window.location.href = `product.html?id=${productId}`;
        });
    }

    function performSearch(query, $searchContainer) {
        // Show loading state
        showSearchLoading($searchContainer);
        
        // Simulate API search (replace with real API call)
        setTimeout(() => {
            const results = searchProducts(query);
            displaySearchResults(results, $searchContainer, query);
        }, 300);
    }

    function searchProducts(query) {
        // Enhanced sample search results with more products
        const sampleProducts = [
            { id: 1, name: 'Hydrating Facial Serum', price: 1299, category: 'Skincare', image: 'images/products/product-1.jpg' },
            { id: 2, name: 'Vitamin C Brightening Serum', price: 1599, category: 'Skincare', image: 'images/products/product-2.jpg' },
            { id: 3, name: 'Gentle Foaming Cleanser', price: 899, category: 'Skincare', image: 'images/products/product-3.jpg' },
            { id: 4, name: 'Anti-Aging Night Cream', price: 1899, category: 'Skincare', image: 'images/products/product-4.jpg' },
            { id: 5, name: 'Facial Cleansing Brush', price: 799, category: 'Beauty Tools', image: 'images/products/tool-1.jpg' },
            { id: 6, name: 'Moisturizing Day Cream', price: 1199, category: 'Skincare', image: 'images/products/product-5.jpg' },
            { id: 7, name: 'Retinol Night Serum', price: 2199, category: 'Skincare', image: 'images/products/product-6.jpg' },
            { id: 8, name: 'Jade Roller Set', price: 599, category: 'Beauty Tools', image: 'images/products/tool-2.jpg' },
            { id: 9, name: 'Hyaluronic Acid Toner', price: 1399, category: 'Skincare', image: 'images/products/product-7.jpg' },
            { id: 10, name: 'Vitamin E Face Mask', price: 999, category: 'Skincare', image: 'images/products/product-8.jpg' },
            { id: 11, name: 'Exfoliating Scrub', price: 699, category: 'Skincare', image: 'images/products/product-9.jpg' },
            { id: 12, name: 'Makeup Brush Set', price: 1499, category: 'Beauty Tools', image: 'images/products/tool-3.jpg' }
        ];

        return sampleProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    function displaySearchResults(results, $searchContainer, query) {
        let $existingResults = $searchContainer.find('.search-results');
        
        if ($existingResults.length === 0) {
            $searchContainer.append('<div class="search-results"></div>');
            $existingResults = $searchContainer.find('.search-results');
        }

        if (results.length === 0) {
            $existingResults.html(`
                <div class="search-no-results">
                    <i class="fas fa-search text-muted mb-2" style="font-size: 2rem;"></i>
                    <p>No products found for "${query}"</p>
                    <small>Try searching for something else</small>
                </div>
            `);
        } else {
            const maxResults = 6; // Limit to 6 results
            const displayResults = results.slice(0, maxResults);
            
            const resultsHtml = displayResults.map(product => `
                <div class="search-result-item" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.svg'">
                    <div class="search-result-content">
                        <h6>${highlightQuery(product.name, query)}</h6>
                        <div class="category">${product.category}</div>
                        <div class="price">Rs. ${product.price.toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
            
            let viewAllHtml = '';
            if (results.length > maxResults) {
                viewAllHtml = `
                    <div class="search-view-all">
                        <a href="search.html?q=${encodeURIComponent(query)}">
                            View all ${results.length} results for "${query}"
                        </a>
                    </div>
                `;
            }
            
            $existingResults.html(resultsHtml + viewAllHtml);
        }

        $existingResults.addClass('show');
    }

    function showSearchLoading($searchContainer) {
        let $existingResults = $searchContainer.find('.search-results');
        
        if ($existingResults.length === 0) {
            $searchContainer.append('<div class="search-results"></div>');
            $existingResults = $searchContainer.find('.search-results');
        }

        $existingResults.html(`
            <div class="search-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span class="ms-2">Searching...</span>
            </div>
        `).addClass('show');
    }

    function hideSearchResults() {
        $('.search-results').removeClass('show').hide();
    }

    function highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    // =====================
    // CHATBOT FUNCTIONALITY
    // =====================
    function initChatbot() {
        const chatbotToggle = $('#chatbotToggle');
        const chatbotWindow = $('#chatbotWindow');
        const chatbotClose = $('#chatbotClose');
        const chatbotInput = $('#chatbotInput');
        const chatbotSend = $('#chatbotSend');
        const chatbotMessages = $('#chatbotMessages');

        // Toggle chatbot window
        chatbotToggle.on('click', function() {
            chatbotWindow.toggleClass('active');
            if (chatbotWindow.hasClass('active')) {
                chatbotInput.focus();
            }
        });

        // Close chatbot
        chatbotClose.on('click', function() {
            chatbotWindow.removeClass('active');
        });

        // Send message
        chatbotSend.on('click', sendChatMessage);
        chatbotInput.on('keypress', function(e) {
            if (e.which === 13) {
                sendChatMessage();
            }
        });

        function sendChatMessage() {
            const message = chatbotInput.val().trim();
            if (message === '') return;

            // Add user message
            addChatMessage(message, 'user');
            chatbotInput.val('');

            // Simulate bot response
            setTimeout(() => {
                const botResponse = generateBotResponse(message);
                addChatMessage(botResponse, 'bot');
            }, 1000);
        }

        function addChatMessage(message, sender) {
            const messageClass = sender === 'user' ? 'user-message' : 'bot-message';
            const messageHtml = `
                <div class="chatbot-message ${messageClass}">
                    <p>${message}</p>
                </div>
            `;
            
            chatbotMessages.append(messageHtml);
            chatbotMessages.scrollTop(chatbotMessages[0].scrollHeight);
        }

        function generateBotResponse(userMessage) {
            const responses = {
                'hello': 'Hello! Welcome to Sanoria.pk. How can I help you find the perfect beauty products today?',
                'help': 'I can help you with product recommendations, skin type analysis, order tracking, and general beauty advice. What would you like to know?',
                'skin type': 'Our skin type quiz can help you find the perfect products! You can access it from our "Shop by Skin Type" section. Would you like me to guide you there?',
                'shipping': 'We offer free shipping on orders over Rs. 2000. Orders are typically delivered within 2-5 business days via Leopard, TCS, or PkDex.',
                'return': 'We have a 14-day easy return policy. You can return any unused products in their original packaging for a full refund.',
                'payment': 'We accept JazzCash, EasyPaisa, bank transfers, and cash on delivery for your convenience.',
                'default': 'Thank you for your question! Our beauty experts are here to help. Could you please be more specific about what you\'re looking for?'
            };

            const lowercaseMessage = userMessage.toLowerCase();
            
            for (const [key, response] of Object.entries(responses)) {
                if (lowercaseMessage.includes(key)) {
                    return response;
                }
            }
            
            return responses.default;
        }
    }

    // =====================
    // QR CODE SCANNER
    // =====================
    function initQRScanner() {
        let html5QrcodeScanner;

        // QR Scanner modal trigger
        $(document).on('click', '[data-bs-target="#qrScannerModal"]', function() {
            initQRScannerModal();
        });

        $('#qrScannerModal').on('shown.bs.modal', function() {
            startQRScanner();
        });

        $('#qrScannerModal').on('hidden.bs.modal', function() {
            stopQRScanner();
        });

        function initQRScannerModal() {
            if (!$('#qrScannerModal').length) {
                // Modal HTML is already in the main HTML file
                return;
            }
        }

        function startQRScanner() {
            if (typeof Html5Qrcode !== 'undefined') {
                html5QrcodeScanner = new Html5QrcodeScanner(
                    "qr-reader",
                    { 
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    false
                );

                html5QrcodeScanner.render(onScanSuccess, onScanFailure);
            }
        }

        function stopQRScanner() {
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear();
            }
        }

        function onScanSuccess(decodedText, decodedResult) {
            // Process the scanned QR code
            processQRCode(decodedText);
            $('#qrScannerModal').modal('hide');
        }

        function onScanFailure(error) {
            // Handle scan failure (optional)
            console.warn('QR Code scan failed:', error);
        }

        function processQRCode(qrData) {
            // Process different types of QR codes
            try {
                const data = JSON.parse(qrData);
                
                if (data.type === 'discount') {
                    applyDiscount(data.code, data.percentage);
                } else if (data.type === 'product') {
                    window.location.href = `product.html?id=${data.productId}`;
                } else {
                    showNotification('QR code scanned successfully!', 'success');
                }
            } catch (e) {
                // If not JSON, treat as discount code
                applyDiscount(qrData, 10); // Default 10% discount
            }
        }

        function applyDiscount(code, percentage) {
            showNotification(`Discount code "${code}" applied! You get ${percentage}% off your next purchase.`, 'success');
            // Store discount in session/localStorage
            sessionStorage.setItem('discountCode', JSON.stringify({
                code: code,
                percentage: percentage,
                expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }));
        }
    }

    // =====================
    // NOTIFICATIONS
    // =====================
    function initNotifications() {
        // Check for stored notifications
        checkStoredNotifications();
        
        // Handle notification icon click
        $('.notification-icon').on('click', function() {
            showNotificationsPanel();
        });
    }

    function showNotification(message, type = 'info', duration = 5000) {
        const notificationTypes = {
            success: { icon: 'fa-check-circle', class: 'alert-success' },
            error: { icon: 'fa-exclamation-circle', class: 'alert-danger' },
            warning: { icon: 'fa-exclamation-triangle', class: 'alert-warning' },
            info: { icon: 'fa-info-circle', class: 'alert-info' }
        };

        const notificationType = notificationTypes[type] || notificationTypes.info;
        
        const notificationHtml = `
            <div class="alert ${notificationType.class} alert-dismissible fade show notification-toast" role="alert">
                <i class="fas ${notificationType.icon} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Create notification container if it doesn't exist
        if (!$('.notification-container').length) {
            $('body').append('<div class="notification-container"></div>');
        }

        const $notification = $(notificationHtml);
        $('.notification-container').append($notification);

        // Auto-remove notification
        if (duration > 0) {
            setTimeout(() => {
                $notification.alert('close');
            }, duration);
        }

        // Update notification badge
        updateNotificationBadge();
    }

    function checkStoredNotifications() {
        const notifications = JSON.parse(localStorage.getItem('sanoria_notifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            $('.notification-badge').text(unreadCount).show();
        }
    }

    function updateNotificationBadge() {
        const currentCount = parseInt($('.notification-badge').text()) || 0;
        $('.notification-badge').text(currentCount + 1).show();
    }

    function showNotificationsPanel() {
        // Create and show notifications panel
        const notificationsPanel = `
            <div class="modal fade" id="notificationsModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Notifications</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="notification-list">
                                <div class="notification-item">
                                    <i class="fas fa-gift text-primary me-3"></i>
                                    <div>
                                        <h6>Welcome Offer!</h6>
                                        <p class="mb-0 text-muted">Get 20% off on your first order</p>
                                        <small class="text-muted">2 hours ago</small>
                                    </div>
                                </div>
                                <div class="notification-item">
                                    <i class="fas fa-star text-warning me-3"></i>
                                    <div>
                                        <h6>New Products Added</h6>
                                        <p class="mb-0 text-muted">Check out our latest skincare collection</p>
                                        <small class="text-muted">1 day ago</small>
                                    </div>
                                </div>
                                <div class="notification-item">
                                    <i class="fas fa-truck text-success me-3"></i>
                                    <div>
                                        <h6>Free Shipping Alert</h6>
                                        <p class="mb-0 text-muted">Free shipping on orders over Rs. 2000</p>
                                        <small class="text-muted">3 days ago</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Mark All Read</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#notificationsModal').remove();
        $('body').append(notificationsPanel);
        $('#notificationsModal').modal('show');
        
        // Reset notification badge
        $('.notification-badge').text('0').hide();
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    function getProductById(productId) {
        // Sample product data (replace with real API call)
        const products = {
            1: {
                id: 1,
                name: 'Hydrating Facial Serum',
                price: 1299,
                originalPrice: 1599,
                image: 'images/product-1.jpg',
                description: 'A deeply hydrating serum that plumps and moisturizes your skin for a youthful glow.',
                reviews: 127,
                rating: 4.5
            },
            2: {
                id: 2,
                name: 'Anti-Aging Night Cream',
                price: 1899,
                originalPrice: 2299,
                image: 'images/product-2.jpg',
                description: 'Rejuvenating night cream that repairs and regenerates skin while you sleep.',
                reviews: 89,
                rating: 4.7
            },
            3: {
                id: 3,
                name: 'Vitamin C Moisturizer',
                price: 1599,
                image: 'images/product-3.jpg',
                description: 'Brightening moisturizer with Vitamin C to even skin tone and boost radiance.',
                reviews: 156,
                rating: 4.6
            },
            4: {
                id: 4,
                name: 'Gentle Cleansing Foam',
                price: 899,
                image: 'images/product-4.jpg',
                description: 'Gentle yet effective cleansing foam suitable for all skin types.',
                reviews: 203,
                rating: 4.4
            }
        };

        return products[productId] || null;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // =====================
    // ADDITIONAL CSS FOR NOTIFICATIONS
    // =====================
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
            }
            
            .notification-toast {
                margin-bottom: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: none;
                border-radius: 8px;
            }
            
            .notification-item {
                display: flex;
                align-items: flex-start;
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .notification-item:last-child {
                border-bottom: none;
            }
            
            .notification-item h6 {
                margin-bottom: 5px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .notification-item p {
                font-size: 0.85rem;
                line-height: 1.4;
            }
            
            .bounce {
                animation: bounce 0.6s ease;
            }
            
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
            
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 300px;
                overflow-y: auto;
                display: none;
            }
            
            .search-result-item {
                display: flex;
                align-items: center;
                padding: 12px 15px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .search-result-item:hover {
                background-color: #f8f9fa;
            }
            
            .search-result-item:last-child {
                border-bottom: none;
            }
            
            .search-result-item img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 12px;
            }
            
            .search-result-content h6 {
                margin: 0 0 2px 0;
                font-size: 0.9rem;
                font-weight: 500;
            }
        `)
        .appendTo('head');

    // =====================
    // PAGE SPECIFIC FUNCTIONS
    // =====================
    
    // Handle skin type selection
    if (window.location.pathname.includes('skin-type.html')) {
        initSkinTypeQuiz();
    }
    
    // Handle product pages
    if (window.location.pathname.includes('product.html')) {
        initProductPage();
    }
    
    // Handle cart page
    if (window.location.pathname.includes('cart.html')) {
        initCartPage();
    }

    function initSkinTypeQuiz() {
        // Skin type quiz functionality would go here
        console.log('Skin type quiz initialized');
    }

    function initProductPage() {
        // Product page specific functionality
        console.log('Product page initialized');
    }

    function initCartPage() {
        // Cart page specific functionality
        console.log('Cart page initialized');
    }

    // =====================
    // GLOBAL EVENT HANDLERS
    // =====================
    
    // Handle clicks outside search results
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-container').length) {
            hideSearchResults();
        }
    });

    // Handle window resize
    $(window).on('resize', debounce(function() {
        // Responsive adjustments
        if ($(window).width() > 992) {
            $('.offcanvas').offcanvas('hide');
        }
    }, 250));

    // Console welcome message
    console.log('%c🌟 Welcome to Sanoria.pk! 🌟', 'color: #d4af37; font-size: 16px; font-weight: bold;');
    console.log('%cElevating your beauty experience with premium skincare solutions.', 'color: #2c3e50; font-size: 12px;');
});

// =====================
// EXTERNAL API INTEGRATIONS
// =====================

// Payment gateway integration helpers
window.SanoriaPayment = {
    initJazzCash: function(amount, orderId) {
        // JazzCash integration logic
        console.log('Initializing JazzCash payment...', { amount, orderId });
    },
    
    initEasyPaisa: function(amount, orderId) {
        // EasyPaisa integration logic
        console.log('Initializing EasyPaisa payment...', { amount, orderId });
    },
    
    processCOD: function(orderData) {
        // Cash on Delivery processing
        console.log('Processing COD order...', orderData);
    }
};

// Analytics tracking
window.SanoriaAnalytics = {
    trackPageView: function(pageName) {
        // Google Analytics or custom analytics
        console.log('Page view tracked:', pageName);
    },
    
    trackPurchase: function(orderData) {
        // E-commerce tracking
        console.log('Purchase tracked:', orderData);
    },
    
    trackAddToCart: function(productData) {
        // Add to cart tracking
        console.log('Add to cart tracked:', productData);
    }
};

// =====================
// CONTACT & COMMUNICATION
// =====================

// WhatsApp Contact Function
function openWhatsApp() {
    const phoneNumber = '+923001234567'; // Pakistan number format
    const message = encodeURIComponent('Hi! I need help with Sanoria.pk products. Can you assist me?');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Add success animation
    const whatsappBtn = document.querySelector('.whatsapp-contact');
    if (whatsappBtn) {
        whatsappBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            whatsappBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    window.open(whatsappURL, '_blank');
    
    // Track analytics
    console.log('WhatsApp contact opened');
}

// Enhanced Chatbot Toggle
function toggleChatbot() {
    const chatWidget = document.getElementById('chatWidget');
    const chatbotBtn = document.querySelector('.chatbot-contact');
    
    if (chatWidget && chatWidget.style.display === 'block') {
        // Hide chatbot
        chatWidget.style.display = 'none';
        if (chatbotBtn) {
            chatbotBtn.querySelector('.contact-info strong').textContent = 'AI Assistant';
            chatbotBtn.querySelector('.contact-info small').textContent = 'Instant help & support';
        }
    } else {
        // Show chatbot
        if (!chatWidget) {
            createChatWidget();
        } else {
            chatWidget.style.display = 'block';
        }
        if (chatbotBtn) {
            chatbotBtn.querySelector('.contact-info strong').textContent = 'Hide Assistant';
            chatbotBtn.querySelector('.contact-info small').textContent = 'Click to close chat';
        }
    }
    
    // Add button animation
    if (chatbotBtn) {
        chatbotBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            chatbotBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

// Create Enhanced Chat Widget
function createChatWidget() {
    const chatHTML = `
        <div id="chatWidget" class="chat-widget">
            <div class="chat-header">
                <div class="chat-avatar">
                    <img src="images/chatbot-avatar.svg" alt="AI Assistant">
                </div>
                <div class="chat-info">
                    <h6>Sanoria AI Assistant</h6>
                    <span class="chat-status online">Online</span>
                </div>
                <button class="chat-close" onclick="toggleChatbot()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot-message">
                    <div class="message-avatar">
                        <img src="images/chatbot-avatar.svg" alt="Bot">
                    </div>
                    <div class="message-content">
                        <p>Hi! I'm Sanoria's AI assistant. How can I help you today? 😊</p>
                        <div class="quick-actions">
                            <button class="quick-btn" onclick="askAboutProducts()">
                                <i class="fas fa-box me-1"></i>Products
                            </button>
                            <button class="quick-btn" onclick="askAboutOrders()">
                                <i class="fas fa-truck me-1"></i>Orders
                            </button>
                            <button class="quick-btn" onclick="askAboutSkincare()">
                                <i class="fas fa-spa me-1"></i>Skincare Tips
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-input-container">
                <div class="typing-indicator" id="typingIndicator" style="display: none;">
                    <span></span><span></span><span></span>
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Type your message..." onkeypress="handleChatKeyPress(event)">
                    <button onclick="sendChatMessage()" class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
}

// Enhanced Chat Functions
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addChatMessage(response, 'bot');
    }, 1500 + Math.random() * 1000); // Realistic typing delay
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageHTML = `
        <div class="chat-message ${sender}-message">
            <div class="message-avatar">
                <img src="${sender === 'user' ? 'images/user-avatar.svg' : 'images/chatbot-avatar.svg'}" alt="${sender}">
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const responses = {
        'products': [
            "We have amazing skincare products! Our best sellers include hydrating serums, vitamin C treatments, and anti-aging creams. Which skin concern would you like to address?",
            "Our product range includes cleansers, serums, moisturizers, and beauty tools. Would you like recommendations based on your skin type?",
            "I'd love to help you find the perfect products! Are you looking for skincare, beauty tools, or specific treatments?"
        ],
        'orders': [
            "I can help with order tracking! Please provide your order number (format: SAN20241215001) and I'll check the status for you.",
            "For order assistance, you can also visit your Order History page or contact our WhatsApp support for immediate help.",
            "Having trouble with an order? I can help with tracking, returns, or order modifications. What do you need assistance with?"
        ],
        'skincare': [
            "Great question! For healthy skin, I recommend: 1) Cleanse daily 2) Use vitamin C serum in the morning 3) Apply moisturizer 4) Always use sunscreen. What's your current routine?",
            "Skincare tips: Start with basics (cleanser, moisturizer, sunscreen), introduce new products gradually, and be consistent. What's your skin type?",
            "For best results: Use products consistently for 4-6 weeks, patch test new products, and adjust routine based on seasons. Need specific product recommendations?"
        ],
        'price': [
            "Our products range from Rs. 599 for tools to Rs. 2,199 for premium serums. We often have promotions - check our current offers!",
            "Pricing varies by product category. Would you like to know about specific items? I can also tell you about our current discounts!"
        ],
        'shipping': [
            "We offer fast shipping via TCS, Leopard, and PkDex couriers. Delivery takes 2-5 business days depending on your location. Free shipping on orders over Rs. 3,000!",
            "Shipping is Rs. 200 nationwide, or free on orders over Rs. 3,000. We ship Monday-Saturday and provide tracking numbers."
        ],
        'return': [
            "We have a 14-day easy return policy! Items must be unused and in original packaging. Contact support to initiate a return.",
            "Returns are hassle-free within 14 days. Keep your receipt and original packaging. Need help with a specific return?"
        ]
    };
    
    const lowerMessage = message.toLowerCase();
    
    // Smart keyword matching
    if (lowerMessage.includes('product') || lowerMessage.includes('serum') || lowerMessage.includes('cream')) {
        return responses.products[Math.floor(Math.random() * responses.products.length)];
    } else if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
        return responses.orders[Math.floor(Math.random() * responses.orders.length)];
    } else if (lowerMessage.includes('skin') || lowerMessage.includes('routine') || lowerMessage.includes('care')) {
        return responses.skincare[Math.floor(Math.random() * responses.skincare.length)];
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
        return responses.price[Math.floor(Math.random() * responses.price.length)];
    } else if (lowerMessage.includes('ship') || lowerMessage.includes('deliver')) {
        return responses.shipping[Math.floor(Math.random() * responses.shipping.length)];
    } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return responses.return[Math.floor(Math.random() * responses.return.length)];
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm here to help with any questions about Sanoria products, orders, or skincare advice. What would you like to know?";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're very welcome! Is there anything else I can help you with today? 😊";
    } else {
        return "I'd be happy to help! You can ask me about our products, order tracking, skincare tips, shipping, or returns. What would you like to know more about?";
    }
}

// Quick Action Functions
function askAboutProducts() {
    addChatMessage("Tell me about your products", 'user');
    setTimeout(() => {
        const response = generateAIResponse('products');
        addChatMessage(response, 'bot');
    }, 800);
}

function askAboutOrders() {
    addChatMessage("I need help with my order", 'user');
    setTimeout(() => {
        const response = generateAIResponse('orders');
        addChatMessage(response, 'bot');
    }, 800);
}

function askAboutSkincare() {
    addChatMessage("Give me skincare tips", 'user');
    setTimeout(() => {
        const response = generateAIResponse('skincare');
        addChatMessage(response, 'bot');
    }, 800);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'block';
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Other Contact Functions
function callSupport() {
    const phoneNumber = '+92-300-1234567';
    if (confirm(`Call ${phoneNumber}?`)) {
        window.location.href = `tel:${phoneNumber}`;
    }
}

function emailSupport() {
    const email = 'info@sanoria.pk';
    const subject = encodeURIComponent('Support Request - Sanoria.pk');
    const body = encodeURIComponent('Hi Sanoria Team,\\n\\nI need assistance with:\\n\\n[Please describe your question or concern]\\n\\nThank you!');
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// =====================
// NOTIFICATION SYSTEM
// =====================

function initNotifications() {
    // Mark all read functionality
    $('.mark-all-read').on('click', function() {
        $('.notification-item.unread').removeClass('unread').addClass('read');
        updateNotificationCount();
    });
    
    // Notification click handlers
    $('.notification-item').on('click', function() {
        if ($(this).hasClass('unread')) {
            $(this).removeClass('unread').addClass('read');
            updateNotificationCount();
        }
    });
}

function updateNotificationCount() {
    try {
        const stored = localStorage.getItem('sanoria_notifications');
        let unreadCount = 0;
        
        if (stored) {
            const notifications = JSON.parse(stored);
            unreadCount = notifications.filter(n => !n.read).length;
        }
        
        // Update all notification count elements
        const countElements = $('.notification-count, .notification-badge, [data-notification-count]');
        countElements.text(unreadCount);
        
        if (unreadCount === 0) {
            countElements.hide();
            // Remove animation classes when no notifications
            $('.fa-bell').removeClass('notification-alert');
        } else {
            countElements.show();
            // Add subtle animation to bell icon
            $('.fa-bell').addClass('notification-alert');
        }
        
        // Update document title with count
        updateDocumentTitle(unreadCount);
        
        // Load quick notifications in dropdown
        loadQuickNotifications();
        
        // Update notification stats if on notifications page
        if (typeof updateNotificationStats === 'function') {
            updateNotificationStats();
        }
        
        console.log(`📊 Notification count updated: ${unreadCount} unread`);
        
    } catch (error) {
        console.error('❌ Error updating notification count:', error);
        // Fallback: hide count if there's an error
        $('.notification-count, .notification-badge').hide();
    }
}

function updateDocumentTitle(unreadCount) {
    const baseTitle = 'Sanoria.pk - Premium Beauty & Skincare';
    
    if (unreadCount > 0) {
        document.title = `(${unreadCount}) ${baseTitle}`;
    } else {
        document.title = baseTitle;
    }
}

function loadQuickNotifications() {
    const stored = localStorage.getItem('sanoria_notifications');
    let notifications = [];
    
    if (stored) {
        notifications = JSON.parse(stored);
    } else {
        // Default notifications
        notifications = [
            {
                id: 1,
                type: 'promotion',
                title: 'New Year Special!',
                message: 'Get 30% off on all skincare products',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 2,
                type: 'order',
                title: 'Order Shipped!',
                message: 'Your order #SAN20241215001 is on the way',
                time: new Date(Date.now() - 5 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 3,
                type: 'system',
                title: 'Welcome to Sanoria!',
                message: 'Complete your profile for recommendations',
                time: new Date(Date.now() - 24 * 60 * 60 * 1000),
                read: false
            }
        ];
        localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
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
    container.empty();
    
    if (quickNotifications.length === 0) {
        container.html(`
            <div class="dropdown-item text-center text-muted">
                <i class="fas fa-check-circle me-2"></i>
                All caught up!
            </div>
        `);
    } else {
        quickNotifications.forEach(notification => {
            const timeAgo = getTimeAgoShort(notification.time);
            const iconClass = getNotificationIconClass(notification.type);
            
            container.append(`
                <div class="dropdown-item notification-item-quick" onclick="markNotificationRead(${notification.id})">
                    <div class="d-flex align-items-start">
                        <div class="notification-icon-small ${notification.type}-icon me-2">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fs-6">${notification.title}</h6>
                            <p class="mb-1 small text-muted">${notification.message}</p>
                            <small class="text-muted">${timeAgo}</small>
                        </div>
                    </div>
                </div>
            `);
        });
    }
}

function getTimeAgoShort(time) {
    const now = new Date();
    const diff = now - time;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}

function getNotificationIconClass(type) {
    const icons = {
        promotion: 'fas fa-tag',
        order: 'fas fa-box',
        system: 'fas fa-cog',
        shipping: 'fas fa-truck',
        welcome: 'fas fa-star'
    };
    return icons[type] || 'fas fa-bell';
}

function markNotificationRead(notificationId) {
    const stored = localStorage.getItem('sanoria_notifications');
    if (stored) {
        const notifications = JSON.parse(stored);
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
            updateNotificationCount();
            
            // Trigger custom event for cross-page updates
            window.dispatchEvent(new CustomEvent('notificationUpdated', {
                detail: { notificationId, action: 'read' }
            }));
        }
    }
}

// =====================
// NOTIFICATION TRACKING SYSTEM
// =====================

function initNotificationTracking() {
    // Initialize default notifications if none exist
    initializeDefaultNotifications();
    
    // Update count on page load
    updateNotificationCount();
    
    // Listen for storage changes from other tabs/pages
    window.addEventListener('storage', function(e) {
        if (e.key === 'sanoria_notifications') {
            updateNotificationCount();
        }
    });
    
    // Listen for custom notification events
    window.addEventListener('notificationUpdated', function(e) {
        updateNotificationCount();
    });
    
    // Periodically check for notification updates
    setInterval(updateNotificationCount, 30000); // Check every 30 seconds
    
    console.log('✅ Notification tracking system initialized');
}

function initializeDefaultNotifications() {
    const stored = localStorage.getItem('sanoria_notifications');
    if (!stored) {
        const defaultNotifications = [
            {
                id: 1,
                type: 'promotion',
                title: 'Welcome to Sanoria!',
                message: 'Get 25% off on your first order with code WELCOME25',
                time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
                read: false,
                priority: 'high',
                category: 'promotion'
            },
            {
                id: 2,
                type: 'system',
                title: 'Complete Your Profile',
                message: 'Add your skin type and preferences for personalized recommendations',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                read: false,
                priority: 'medium',
                category: 'system'
            },
            {
                id: 3,
                type: 'promotion',
                title: 'Free Shipping Available',
                message: 'Enjoy free shipping on orders over Rs. 2000. No code needed!',
                time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
                read: false,
                priority: 'low',
                category: 'promotion'
            }
        ];
        
        localStorage.setItem('sanoria_notifications', JSON.stringify(defaultNotifications));
        console.log('✅ Default notifications initialized');
    }
}

function addNotification(notification) {
    const stored = localStorage.getItem('sanoria_notifications');
    const notifications = stored ? JSON.parse(stored) : [];
    
    // Add timestamp and ID if not provided
    const newNotification = {
        id: notification.id || Date.now(),
        type: notification.type || 'system',
        title: notification.title,
        message: notification.message,
        time: notification.time || new Date().toISOString(),
        read: false,
        priority: notification.priority || 'medium',
        category: notification.category || notification.type || 'system',
        actions: notification.actions || []
    };
    
    // Add to beginning of array (newest first)
    notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications.splice(50);
    }
    
    localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
    updateNotificationCount();
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('notificationAdded', {
        detail: newNotification
    }));
    
    console.log('✅ New notification added:', newNotification.title);
    return newNotification;
}

function markAllNotificationsRead() {
    const stored = localStorage.getItem('sanoria_notifications');
    if (stored) {
        const notifications = JSON.parse(stored);
        notifications.forEach(n => n.read = true);
        localStorage.setItem('sanoria_notifications', JSON.stringify(notifications));
        updateNotificationCount();
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('notificationUpdated', {
            detail: { action: 'markAllRead' }
        }));
        
        console.log('✅ All notifications marked as read');
    }
}

function clearAllNotifications() {
    localStorage.removeItem('sanoria_notifications');
    updateNotificationCount();
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('notificationUpdated', {
        detail: { action: 'clearAll' }
    }));
    
    console.log('✅ All notifications cleared');
}

function getNotificationStats() {
    const stored = localStorage.getItem('sanoria_notifications');
    if (!stored) return { total: 0, unread: 0, today: 0 };
    
    const notifications = JSON.parse(stored);
    const today = new Date().toDateString();
    
    return {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        today: notifications.filter(n => {
            const notificationDate = new Date(n.time).toDateString();
            return notificationDate === today;
        }).length
    };
}

// Initialize notifications when page loads
$(document).ready(function() {
    initNotifications();
});

// =====================
// MOBILE SEARCH FUNCTIONALITY
// =====================

function initMobileSearch() {
    const $mobileSearchInput = $('#mobileSearchInput');
    const $mobileSearchResults = $('#mobileSearchResults');
    const $mobileSearchBtn = $('#mobileSearchBtn');
    
    if ($mobileSearchInput.length === 0) return;
    
    let mobileSearchTimeout;
    
    // Mobile search input handler
    $mobileSearchInput.on('input', function() {
        const query = $(this).val().trim();
        
        clearTimeout(mobileSearchTimeout);
        
        if (query.length === 0) {
            hideMobileSearchResults();
            return;
        }
        
        if (query.length >= 2) {
            showMobileSearchLoading();
            
            mobileSearchTimeout = setTimeout(() => {
                performMobileSearch(query);
            }, 300);
        }
    });
    
    // Mobile search button handler
    $mobileSearchBtn.on('click', function() {
        const query = $mobileSearchInput.val().trim();
        if (query.length >= 2) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
    
    // Mobile search enter key handler
    $mobileSearchInput.on('keypress', function(e) {
        if (e.which === 13) {
            const query = $(this).val().trim();
            if (query.length >= 2) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
    
    // Hide mobile search results when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.mobile-search').length) {
            hideMobileSearchResults();
        }
    });
    
    console.log('✅ Mobile search functionality initialized');
}

function performMobileSearch(query) {
    // Use the same search data as desktop search
    const allProducts = [
        { id: 1, name: 'Hydrating Facial Serum', price: 1299, category: 'Serum', image: 'images/products/product-1.svg' },
        { id: 2, name: 'Vitamin C Brightening Serum', price: 1599, category: 'Serum', image: 'images/products/product-2.svg' },
        { id: 3, name: 'Gentle Daily Cleanser', price: 899, category: 'Cleanser', image: 'images/products/product-3.svg' },
        { id: 4, name: 'Anti-Aging Night Cream', price: 1899, category: 'Cream', image: 'images/products/product-4.svg' },
        { id: 5, name: 'Nourishing Face Mask', price: 799, category: 'Mask', image: 'images/placeholder.svg' },
        { id: 6, name: 'Exfoliating Scrub', price: 699, category: 'Scrub', image: 'images/placeholder.svg' },
        { id: 7, name: 'Hydrating Toner', price: 599, category: 'Toner', image: 'images/placeholder.svg' },
        { id: 8, name: 'Eye Repair Cream', price: 1199, category: 'Eye Care', image: 'images/placeholder.svg' }
    ];
    
    const lowerQuery = query.toLowerCase();
    const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.category.toLowerCase().includes(lowerQuery)
    );
    
    displayMobileSearchResults(results, query);
}

function showMobileSearchLoading() {
    const $results = $('#mobileSearchResults');
    const $loading = $results.find('.search-loading');
    
    $results.removeClass('d-none');
    $loading.removeClass('d-none');
    $results.find('.search-items').empty();
}

function displayMobileSearchResults(results, query) {
    const $results = $('#mobileSearchResults');
    const $loading = $results.find('.search-loading');
    const $items = $results.find('.search-items');
    
    $loading.addClass('d-none');
    
    if (results.length === 0) {
        $items.html(`
            <div class="search-no-results p-3 text-center">
                <i class="fas fa-search text-muted mb-2" style="font-size: 2rem;"></i>
                <p class="mb-1">No products found for "${query}"</p>
                <small class="text-muted">Try different keywords or browse our categories</small>
            </div>
        `);
        return;
    }
    
    // Limit mobile results to 4 items for better mobile UX
    const limitedResults = results.slice(0, 4);
    
    const resultsHtml = limitedResults.map(product => `
        <div class="search-result-item" onclick="window.location.href='product.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="search-result-image" onerror="this.src='images/placeholder.svg'">
            <div class="search-result-details">
                <h6 class="search-result-title">${highlightQuery(product.name, query)}</h6>
                <div class="search-result-meta">
                    <span class="search-result-category">${product.category}</span>
                    <span class="search-result-price">Rs. ${product.price.toLocaleString()}</span>
                </div>
            </div>
            <i class="fas fa-chevron-right search-result-arrow"></i>
        </div>
    `).join('');
    
    let viewAllButton = '';
    if (results.length > 4) {
        viewAllButton = `
            <div class="search-view-all" onclick="window.location.href='search.html?q=${encodeURIComponent(query)}'">
                <span>View all ${results.length} results</span>
                <i class="fas fa-arrow-right ms-2"></i>
            </div>
        `;
    }
    
    $items.html(resultsHtml + viewAllButton);
    $results.removeClass('d-none');
}

function hideMobileSearchResults() {
    $('#mobileSearchResults').addClass('d-none');
}

console.log('🎉 Enhanced contact system loaded successfully');