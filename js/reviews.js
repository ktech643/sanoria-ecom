/**
 * Product Reviews System for Sanoria.pk
 * Handles review submission, display, and moderation
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // GLOBAL VARIABLES
    // =====================
    let currentProductId = null;
    let userReviews = JSON.parse(localStorage.getItem('sanoria_user_reviews')) || [];
    let productReviews = JSON.parse(localStorage.getItem('sanoria_product_reviews')) || {};

    // =====================
    // INITIALIZATION
    // =====================
    initReviewSystem();
    loadProductReviews();
    initReviewSubmission();
    initReviewFilters();

    // =====================
    // REVIEW SYSTEM INITIALIZATION
    // =====================
    function initReviewSystem() {
        // Get product ID from URL or data attribute
        const urlParams = new URLSearchParams(window.location.search);
        currentProductId = urlParams.get('id') || $('#productReviews').data('product-id');
        
        if (currentProductId) {
            loadReviewsForProduct(currentProductId);
            checkUserReviewEligibility(currentProductId);
        }
    }

    // =====================
    // REVIEW DISPLAY
    // =====================
    function loadReviewsForProduct(productId) {
        const reviews = getProductReviews(productId);
        displayReviews(reviews);
        updateReviewSummary(reviews);
    }

    function getProductReviews(productId) {
        // Sample reviews data (in real app, this would come from API)
        const sampleReviews = {
            '1': [
                {
                    id: 1,
                    userId: 'user1',
                    userName: 'Sarah A.',
                    rating: 5,
                    title: 'Amazing hydration!',
                    comment: 'This serum has transformed my dry skin. I noticed a difference after just one week of use. Highly recommend!',
                    date: '2024-12-10',
                    verified: true,
                    helpful: 15,
                    images: []
                },
                {
                    id: 2,
                    userId: 'user2',
                    userName: 'Fatima K.',
                    rating: 4,
                    title: 'Good product',
                    comment: 'Nice texture and absorbs well. Good value for money. Will purchase again.',
                    date: '2024-12-08',
                    verified: true,
                    helpful: 8,
                    images: []
                },
                {
                    id: 3,
                    userId: 'user3',
                    userName: 'Aisha M.',
                    rating: 5,
                    title: 'Perfect for sensitive skin',
                    comment: 'I have very sensitive skin and this serum works perfectly without any irritation. Love it!',
                    date: '2024-12-05',
                    verified: false,
                    helpful: 12,
                    images: []
                }
            ]
        };

        return sampleReviews[productId] || [];
    }

    function displayReviews(reviews) {
        const $reviewsContainer = $('#reviewsList');
        
        if (reviews.length === 0) {
            $reviewsContainer.html(`
                <div class="no-reviews text-center py-5">
                    <i class="fas fa-star-half-alt text-muted mb-3" style="font-size: 3rem;"></i>
                    <h5>No reviews yet</h5>
                    <p class="text-muted">Be the first to review this product!</p>
                </div>
            `);
            return;
        }

        const reviewsHtml = reviews.map(review => createReviewHTML(review)).join('');
        $reviewsContainer.html(reviewsHtml);
        
        // Initialize review interactions
        initReviewInteractions();
    }

    function createReviewHTML(review) {
        const starsHtml = generateStarsHTML(review.rating);
        const verifiedBadge = review.verified ? 
            '<span class="verified-badge"><i class="fas fa-check-circle text-success me-1"></i>Verified Purchase</span>' : '';
        
        const imagesHtml = review.images && review.images.length > 0 ? 
            `<div class="review-images mt-3">
                ${review.images.map(img => `<img src="${img}" alt="Review image" class="review-image" onclick="openImageModal('${img}')">`).join('')}
            </div>` : '';

        return `
            <div class="review-item" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="reviewer-details">
                            <h6 class="reviewer-name">${review.userName}</h6>
                            <div class="review-meta">
                                <div class="review-rating">${starsHtml}</div>
                                <span class="review-date">${formatDate(review.date)}</span>
                                ${verifiedBadge}
                            </div>
                        </div>
                    </div>
                    <div class="review-actions">
                        <button class="btn btn-sm btn-outline-secondary helpful-btn" data-review-id="${review.id}">
                            <i class="fas fa-thumbs-up me-1"></i>
                            Helpful (${review.helpful})
                        </button>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="reportReview(${review.id})">
                                    <i class="fas fa-flag me-2"></i>Report
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="review-content">
                    <h6 class="review-title">${review.title}</h6>
                    <p class="review-comment">${review.comment}</p>
                    ${imagesHtml}
                </div>
            </div>
        `;
    }

    function updateReviewSummary(reviews) {
        if (reviews.length === 0) return;

        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        // Update overall rating
        $('.overall-rating').text(averageRating.toFixed(1));
        $('.total-reviews').text(`${totalReviews} review${totalReviews !== 1 ? 's' : ''}`);
        $('.overall-stars').html(generateStarsHTML(averageRating));
        
        // Update rating breakdown
        updateRatingBreakdown(reviews);
    }

    function updateRatingBreakdown(reviews) {
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            ratingCounts[review.rating]++;
        });

        const totalReviews = reviews.length;
        
        for (let rating = 5; rating >= 1; rating--) {
            const count = ratingCounts[rating];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            $(`.rating-breakdown .rating-${rating} .rating-count`).text(count);
            $(`.rating-breakdown .rating-${rating} .rating-bar`).css('width', `${percentage}%`);
        }
    }

    // =====================
    // REVIEW SUBMISSION
    // =====================
    function initReviewSubmission() {
        // Initialize star rating selection
        initStarRating();
        
        // Handle review form submission
        $('#reviewForm').on('submit', handleReviewSubmission);
        
        // Handle image upload
        $('#reviewImages').on('change', handleImageUpload);
        
        // Character counter for review text
        $('#reviewComment').on('input', updateCharacterCount);
    }

    function initStarRating() {
        $('.star-rating .star').on('click', function() {
            const rating = $(this).data('rating');
            setStarRating(rating);
        });

        $('.star-rating .star').on('mouseenter', function() {
            const rating = $(this).data('rating');
            highlightStars(rating);
        });

        $('.star-rating').on('mouseleave', function() {
            const currentRating = $('#reviewRating').val();
            highlightStars(currentRating);
        });
    }

    function setStarRating(rating) {
        $('#reviewRating').val(rating);
        highlightStars(rating);
        updateRatingText(rating);
    }

    function highlightStars(rating) {
        $('.star-rating .star').each(function(index) {
            if (index < rating) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    function updateRatingText(rating) {
        const ratingTexts = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        $('.rating-text').text(ratingTexts[rating] || '');
    }

    function handleReviewSubmission(e) {
        e.preventDefault();
        
        const formData = {
            productId: currentProductId,
            rating: parseInt($('#reviewRating').val()),
            title: $('#reviewTitle').val().trim(),
            comment: $('#reviewComment').val().trim(),
            images: $('#reviewImages')[0].files
        };

        // Validate form
        if (!validateReviewForm(formData)) {
            return;
        }

        // Check if user is logged in
        const user = getUserSession();
        if (!user) {
            showLoginPrompt();
            return;
        }

        // Submit review
        submitReview(formData, user);
    }

    function validateReviewForm(formData) {
        const errors = [];

        if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
            errors.push('Please select a rating');
        }

        if (!formData.title || formData.title.length < 5) {
            errors.push('Review title must be at least 5 characters');
        }

        if (!formData.comment || formData.comment.length < 20) {
            errors.push('Review comment must be at least 20 characters');
        }

        if (formData.comment && formData.comment.length > 1000) {
            errors.push('Review comment must be less than 1000 characters');
        }

        if (errors.length > 0) {
            showValidationErrors(errors);
            return false;
        }

        return true;
    }

    function submitReview(formData, user) {
        // Show loading state
        const $submitBtn = $('#reviewForm button[type="submit"]');
        const originalText = $submitBtn.html();
        $submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...').prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            const newReview = {
                id: Date.now(),
                userId: user.id,
                userName: user.firstName + ' ' + user.lastName.charAt(0) + '.',
                rating: formData.rating,
                title: formData.title,
                comment: formData.comment,
                date: new Date().toISOString().split('T')[0],
                verified: checkVerifiedPurchase(user.id, currentProductId),
                helpful: 0,
                images: [] // In real app, would handle image upload
            };

            // Add to reviews
            addReviewToProduct(currentProductId, newReview);
            
            // Refresh display
            loadReviewsForProduct(currentProductId);
            
            // Reset form
            resetReviewForm();
            
            // Show success message
            showNotification('Thank you! Your review has been submitted and is pending approval.', 'success');
            
            // Restore button
            $submitBtn.html(originalText).prop('disabled', false);
            
            // Scroll to reviews
            $('html, body').animate({
                scrollTop: $('#reviewsList').offset().top - 100
            }, 500);
        }, 2000);
    }

    function addReviewToProduct(productId, review) {
        if (!productReviews[productId]) {
            productReviews[productId] = [];
        }
        
        productReviews[productId].unshift(review);
        localStorage.setItem('sanoria_product_reviews', JSON.stringify(productReviews));
        
        // Also add to user reviews
        userReviews.push({
            productId: productId,
            reviewId: review.id,
            date: review.date
        });
        localStorage.setItem('sanoria_user_reviews', JSON.stringify(userReviews));
    }

    function resetReviewForm() {
        $('#reviewForm')[0].reset();
        $('#reviewRating').val('');
        $('.star-rating .star').removeClass('active');
        $('.rating-text').text('');
        updateCharacterCount();
        $('#imagePreview').empty().addClass('d-none');
    }

    // =====================
    // REVIEW INTERACTIONS
    // =====================
    function initReviewInteractions() {
        // Helpful button
        $('.helpful-btn').on('click', function() {
            const reviewId = $(this).data('review-id');
            markReviewHelpful(reviewId, $(this));
        });
        
        // Load more reviews
        $('#loadMoreReviews').on('click', loadMoreReviews);
    }

    function markReviewHelpful(reviewId, $button) {
        // Check if user already marked this review as helpful
        const helpfulReviews = JSON.parse(localStorage.getItem('sanoria_helpful_reviews')) || [];
        
        if (helpfulReviews.includes(reviewId)) {
            showNotification('You have already marked this review as helpful', 'info');
            return;
        }

        // Add to helpful reviews
        helpfulReviews.push(reviewId);
        localStorage.setItem('sanoria_helpful_reviews', JSON.stringify(helpfulReviews));
        
        // Update button
        const currentCount = parseInt($button.text().match(/\d+/)[0]);
        $button.html(`<i class="fas fa-thumbs-up me-1"></i>Helpful (${currentCount + 1})`);
        $button.addClass('marked-helpful').prop('disabled', true);
        
        showNotification('Thank you for your feedback!', 'success', 2000);
    }

    // =====================
    // REVIEW FILTERS
    // =====================
    function initReviewFilters() {
        // Rating filter
        $('.rating-filter').on('change', function() {
            const selectedRating = $(this).val();
            filterReviewsByRating(selectedRating);
        });
        
        // Sort options
        $('#reviewSort').on('change', function() {
            const sortOption = $(this).val();
            sortReviews(sortOption);
        });
        
        // Verified purchases only
        $('#verifiedOnly').on('change', function() {
            const verifiedOnly = $(this).is(':checked');
            filterVerifiedReviews(verifiedOnly);
        });
    }

    function filterReviewsByRating(rating) {
        if (rating === 'all') {
            $('.review-item').show();
        } else {
            $('.review-item').each(function() {
                const reviewRating = $(this).find('.review-rating .star.active').length;
                if (reviewRating == rating) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        
        updateFilteredCount();
    }

    function sortReviews(sortOption) {
        const $reviews = $('.review-item');
        const $container = $('#reviewsList');
        
        const sortedReviews = $reviews.sort(function(a, b) {
            switch(sortOption) {
                case 'newest':
                    return new Date($(b).find('.review-date').text()) - new Date($(a).find('.review-date').text());
                case 'oldest':
                    return new Date($(a).find('.review-date').text()) - new Date($(b).find('.review-date').text());
                case 'highest':
                    return $(b).find('.review-rating .star.active').length - $(a).find('.review-rating .star.active').length;
                case 'lowest':
                    return $(a).find('.review-rating .star.active').length - $(b).find('.review-rating .star.active').length;
                case 'helpful':
                    const helpfulA = parseInt($(a).find('.helpful-btn').text().match(/\d+/)[0]);
                    const helpfulB = parseInt($(b).find('.helpful-btn').text().match(/\d+/)[0]);
                    return helpfulB - helpfulA;
                default:
                    return 0;
            }
        });
        
        $container.html(sortedReviews);
        initReviewInteractions();
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    function generateStarsHTML(rating, interactive = false) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += interactive ? 
                `<i class="fas fa-star star" data-rating="${i + 1}"></i>` : 
                '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += interactive ? 
                `<i class="far fa-star star" data-rating="${fullStars + (hasHalfStar ? 1 : 0) + i + 1}"></i>` : 
                '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function checkVerifiedPurchase(userId, productId) {
        // In real app, check if user purchased this product
        return Math.random() > 0.3; // 70% chance of verified purchase
    }

    function checkUserReviewEligibility(productId) {
        const user = getUserSession();
        if (!user) return;
        
        // Check if user already reviewed this product
        const existingReview = userReviews.find(review => 
            review.productId === productId && review.userId === user.id
        );
        
        if (existingReview) {
            $('#reviewForm').hide();
            $('#existingReviewMessage').show();
        }
    }

    function getUserSession() {
        try {
            const sessionData = JSON.parse(localStorage.getItem('sanoria_user_session'));
            if (sessionData && Date.now() - sessionData.timestamp < sessionData.expiresIn) {
                return sessionData.user;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    function showLoginPrompt() {
        if (confirm('Please log in to submit a review. Would you like to go to the login page?')) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }
    }

    function showValidationErrors(errors) {
        const errorsHTML = errors.map(error => `<li>${error}</li>`).join('');
        $('.review-errors').html(`
            <div class="alert alert-danger">
                <ul class="mb-0">${errorsHTML}</ul>
            </div>
        `).show();
    }

    function showNotification(message, type = 'info', duration = 4000) {
        // Use existing notification system
        if (typeof window.showToast === 'function') {
            window.showToast('Review', message, type, duration);
        } else {
            alert(message);
        }
    }

    function updateCharacterCount() {
        const text = $('#reviewComment').val();
        const count = text.length;
        const maxLength = 1000;
        
        $('#characterCount').text(`${count}/${maxLength}`);
        
        if (count > maxLength) {
            $('#characterCount').addClass('text-danger');
        } else {
            $('#characterCount').removeClass('text-danger');
        }
    }

    function handleImageUpload() {
        const files = this.files;
        const $preview = $('#imagePreview');
        
        $preview.empty();
        
        if (files.length > 0) {
            $preview.removeClass('d-none');
            
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        $preview.append(`
                            <div class="image-preview-item">
                                <img src="${e.target.result}" alt="Preview">
                                <button type="button" class="btn btn-sm btn-danger remove-image">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `);
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            $preview.addClass('d-none');
        }
    }

    // Global functions
    window.reportReview = function(reviewId) {
        if (confirm('Are you sure you want to report this review?')) {
            showNotification('Review reported. Thank you for helping us maintain quality.', 'info');
        }
    };

    console.log('📝 Reviews system initialized');
});

// =====================
// REVIEW SYSTEM HTML TEMPLATE
// =====================
function getReviewSystemHTML() {
    return `
        <!-- Reviews Section -->
        <div class="reviews-section mt-5" id="productReviews" data-product-id="1">
            <div class="reviews-header">
                <h3>Customer Reviews</h3>
                <div class="reviews-summary">
                    <div class="overall-rating-display">
                        <div class="overall-stars"></div>
                        <span class="overall-rating">0</span>
                        <span class="total-reviews">0 reviews</span>
                    </div>
                </div>
            </div>
            
            <!-- Rating Breakdown -->
            <div class="rating-breakdown">
                <div class="rating-row rating-5">
                    <span class="rating-label">5 stars</span>
                    <div class="rating-bar-container">
                        <div class="rating-bar"></div>
                    </div>
                    <span class="rating-count">0</span>
                </div>
                <!-- Repeat for 4, 3, 2, 1 stars -->
            </div>
            
            <!-- Review Form -->
            <div class="review-form-section">
                <h4>Write a Review</h4>
                <form id="reviewForm">
                    <div class="mb-3">
                        <label class="form-label">Rating *</label>
                        <div class="star-rating">
                            <i class="far fa-star star" data-rating="1"></i>
                            <i class="far fa-star star" data-rating="2"></i>
                            <i class="far fa-star star" data-rating="3"></i>
                            <i class="far fa-star star" data-rating="4"></i>
                            <i class="far fa-star star" data-rating="5"></i>
                        </div>
                        <span class="rating-text"></span>
                        <input type="hidden" id="reviewRating" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="reviewTitle" class="form-label">Review Title *</label>
                        <input type="text" class="form-control" id="reviewTitle" required maxlength="100">
                    </div>
                    
                    <div class="mb-3">
                        <label for="reviewComment" class="form-label">Your Review *</label>
                        <textarea class="form-control" id="reviewComment" rows="4" required maxlength="1000"></textarea>
                        <small class="form-text text-muted">
                            <span id="characterCount">0/1000</span> characters
                        </small>
                    </div>
                    
                    <div class="mb-3">
                        <label for="reviewImages" class="form-label">Add Photos (Optional)</label>
                        <input type="file" class="form-control" id="reviewImages" multiple accept="image/*">
                        <div id="imagePreview" class="image-preview d-none"></div>
                    </div>
                    
                    <div class="review-errors"></div>
                    
                    <button type="submit" class="btn btn-primary">Submit Review</button>
                </form>
            </div>
            
            <!-- Reviews List -->
            <div class="reviews-list-section">
                <div class="reviews-filters">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <select class="form-select" id="reviewSort">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest">Highest Rated</option>
                                <option value="lowest">Lowest Rated</option>
                                <option value="helpful">Most Helpful</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="verifiedOnly">
                                <label class="form-check-label" for="verifiedOnly">
                                    Verified Purchases Only
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="reviewsList"></div>
                
                <button id="loadMoreReviews" class="btn btn-outline-primary mt-3 d-none">
                    Load More Reviews
                </button>
            </div>
        </div>
    `;
}