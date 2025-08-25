/**
 * Feedback Page JavaScript for Sanoria.pk
 * Handles feedback form submission, validation, and interactions
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // INITIALIZATION
    // =====================
    
    initFeedbackPage();
    initFormValidation();
    initCharacterCount();
    initRatingSystem();

    function initFeedbackPage() {
        // Initialize feedback type selection
        $('.feedback-type-card').on('click', function() {
            const feedbackType = $(this).data('type');
            selectFeedbackType(feedbackType);
        });

        // Initialize form submission
        $('#feedbackForm').on('submit', function(e) {
            e.preventDefault();
            submitFeedback();
        });

        // Load saved customer info if available
        loadSavedCustomerInfo();
        
        console.log('✅ Feedback page initialized');
    }

    // =====================
    // FEEDBACK TYPE SELECTION
    // =====================
    
    function selectFeedbackType(type) {
        // Update UI
        $('.feedback-type-card').removeClass('active');
        $(`.feedback-type-card[data-type="${type}"]`).addClass('active');
        
        // Update hidden input
        $('#feedbackType').val(type);
        
        // Show/hide relevant sections
        showRelevantSections(type);
        
        // Update form labels and placeholders
        updateFormForType(type);
    }

    function showRelevantSections(type) {
        // Hide all optional sections first
        $('#productSection, #categorySection').addClass('d-none');
        
        // Show relevant sections
        switch(type) {
            case 'product':
                $('#productSection').removeClass('d-none');
                $('#ratingSection').show();
                break;
            case 'suggestion':
            case 'complaint':
                $('#categorySection').removeClass('d-none');
                $('#ratingSection').show();
                break;
            case 'general':
                $('#ratingSection').show();
                break;
        }
    }

    function updateFormForType(type) {
        const updates = {
            general: {
                subject: 'Share your overall experience with Sanoria.pk',
                message: 'Tell us about your experience with our website, products, or services...',
                title: 'General Feedback'
            },
            product: {
                subject: 'Review your purchased product',
                message: 'Share your experience with this specific product...',
                title: 'Product Review'
            },
            suggestion: {
                subject: 'Suggest an improvement or new feature',
                message: 'Tell us what improvements or new features you\'d like to see...',
                title: 'Suggestion'
            },
            complaint: {
                subject: 'Describe the issue you experienced',
                message: 'Please describe the problem you encountered and how we can help...',
                title: 'Complaint'
            }
        };

        const update = updates[type];
        if (update) {
            $('#feedbackSubject').attr('placeholder', update.subject);
            $('#feedbackMessage').attr('placeholder', update.message);
            $('.section-title').first().text(`What would you like to share? - ${update.title}`);
        }
    }

    // =====================
    // FORM VALIDATION
    // =====================
    
    function initFormValidation() {
        // Real-time validation
        $('#customerEmail').on('blur', validateEmail);
        $('#customerPhone').on('blur', validatePhone);
        $('#feedbackSubject').on('blur', validateSubject);
        $('#feedbackMessage').on('blur', validateMessage);
        
        // Clear validation on input
        $('.form-control').on('input', function() {
            $(this).removeClass('is-valid is-invalid');
        });
    }

    function validateEmail() {
        const email = $('#customerEmail').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            $('#customerEmail').addClass('is-invalid').removeClass('is-valid');
            return false;
        } else if (email) {
            $('#customerEmail').addClass('is-valid').removeClass('is-invalid');
        }
        return true;
    }

    function validatePhone() {
        const phone = $('#customerPhone').val().trim();
        const phoneRegex = /^(\+92|0)?3[0-9]{2}[-\s]?[0-9]{7}$/;
        
        if (phone && !phoneRegex.test(phone)) {
            $('#customerPhone').addClass('is-invalid').removeClass('is-valid');
            return false;
        } else if (phone) {
            $('#customerPhone').addClass('is-valid').removeClass('is-invalid');
        }
        return true;
    }

    function validateSubject() {
        const subject = $('#feedbackSubject').val().trim();
        
        if (subject.length < 5) {
            $('#feedbackSubject').addClass('is-invalid').removeClass('is-valid');
            return false;
        } else {
            $('#feedbackSubject').addClass('is-valid').removeClass('is-invalid');
        }
        return true;
    }

    function validateMessage() {
        const message = $('#feedbackMessage').val().trim();
        
        if (message.length < 10) {
            $('#feedbackMessage').addClass('is-invalid').removeClass('is-valid');
            return false;
        } else if (message.length > 1000) {
            $('#feedbackMessage').addClass('is-invalid').removeClass('is-valid');
            return false;
        } else {
            $('#feedbackMessage').addClass('is-valid').removeClass('is-invalid');
        }
        return true;
    }

    function validateForm() {
        let isValid = true;

        // Required fields
        const requiredFields = ['customerName', 'customerEmail', 'feedbackSubject', 'feedbackMessage'];
        
        requiredFields.forEach(fieldId => {
            const field = $(`#${fieldId}`);
            if (!field.val().trim()) {
                field.addClass('is-invalid').removeClass('is-valid');
                isValid = false;
            }
        });

        // Specific validations
        if (!validateEmail()) isValid = false;
        if (!validatePhone()) isValid = false;
        if (!validateSubject()) isValid = false;
        if (!validateMessage()) isValid = false;

        // Privacy agreement
        if (!$('#privacyAgreement').is(':checked')) {
            alert('Please agree to the privacy policy to continue.');
            isValid = false;
        }

        return isValid;
    }

    // =====================
    // CHARACTER COUNT
    // =====================
    
    function initCharacterCount() {
        $('#feedbackMessage').on('input', function() {
            const length = $(this).val().length;
            $('#messageCharCount').text(length);
            
            if (length > 1000) {
                $(this).addClass('is-invalid');
                $('#messageCharCount').parent().addClass('text-danger');
            } else {
                $(this).removeClass('is-invalid');
                $('#messageCharCount').parent().removeClass('text-danger');
            }
        });
    }

    // =====================
    // RATING SYSTEM
    // =====================
    
    function initRatingSystem() {
        $('.rating-input-large input[type="radio"]').on('change', function() {
            const rating = $(this).val();
            const descriptions = {
                '1': 'Poor - Needs significant improvement',
                '2': 'Fair - Below expectations',
                '3': 'Good - Meets expectations',
                '4': 'Very Good - Exceeds expectations',
                '5': 'Excellent - Outstanding experience!'
            };
            $('.rating-description-large small').text(descriptions[rating]);
        });
    }

    // =====================
    // FORM SUBMISSION
    // =====================
    
    function submitFeedback() {
        // Validate form
        if (!validateForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Show loading state
        const $submitBtn = $('#feedbackForm button[type="submit"]');
        const originalText = $submitBtn.html();
        $submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...').prop('disabled', true);

        // Collect form data
        const feedbackData = {
            type: $('#feedbackType').val(),
            customer: {
                name: $('#customerName').val().trim(),
                email: $('#customerEmail').val().trim(),
                phone: $('#customerPhone').val().trim(),
                status: $('#customerStatus').val()
            },
            rating: $('input[name="overallRating"]:checked').val(),
            product: {
                id: $('#productSelect').val(),
                purchaseDate: $('#purchaseDate').val()
            },
            subject: $('#feedbackSubject').val().trim(),
            message: $('#feedbackMessage').val().trim(),
            category: $('#feedbackCategory').val(),
            priority: $('#feedbackPriority').val(),
            timestamp: new Date().toISOString(),
            reference: generateReferenceId()
        };

        // Simulate form submission
        setTimeout(() => {
            // In real application, this would be an AJAX call to the server
            saveFeedback(feedbackData);
            
            // Show success modal
            showSuccessModal(feedbackData.reference);
            
            // Reset form
            resetForm();
            
            // Restore button
            $submitBtn.html(originalText).prop('disabled', false);
            
            console.log('Feedback submitted:', feedbackData);
        }, 2000);
    }

    function saveFeedback(feedbackData) {
        // Save to localStorage (in real app, this would go to server)
        let feedbacks = JSON.parse(localStorage.getItem('sanoria_feedbacks')) || [];
        feedbacks.push(feedbackData);
        localStorage.setItem('sanoria_feedbacks', JSON.stringify(feedbacks));
        
        // Save customer info for future use
        const customerInfo = {
            name: feedbackData.customer.name,
            email: feedbackData.customer.email,
            phone: feedbackData.customer.phone
        };
        localStorage.setItem('sanoria_customer_info', JSON.stringify(customerInfo));
    }

    function generateReferenceId() {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `FB${timestamp}${random}`;
    }

    function showSuccessModal(referenceId) {
        $('#feedbackReference').text(`#${referenceId}`);
        $('#feedbackSuccessModal').modal('show');
    }

    function resetForm() {
        // Reset form fields
        $('#feedbackForm')[0].reset();
        
        // Reset feedback type selection
        $('.feedback-type-card').removeClass('active');
        $('.feedback-type-card').first().addClass('active');
        
        // Reset validation classes
        $('.form-control').removeClass('is-valid is-invalid');
        
        // Reset character count
        $('#messageCharCount').text('0');
        
        // Reset rating description
        $('.rating-description-large small').text('Click to rate your overall experience');
        
        // Hide optional sections
        $('#productSection, #categorySection').addClass('d-none');
        
        // Reset feedback type
        selectFeedbackType('general');
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    
    function loadSavedCustomerInfo() {
        const savedInfo = JSON.parse(localStorage.getItem('sanoria_customer_info'));
        
        if (savedInfo) {
            $('#customerName').val(savedInfo.name || '');
            $('#customerEmail').val(savedInfo.email || '');
            $('#customerPhone').val(savedInfo.phone || '');
        }
    }

    // =====================
    // ANALYTICS & TRACKING
    // =====================
    
    function trackFeedbackInteraction(action, data = {}) {
        // In real application, this would track user interactions
        console.log('Feedback interaction:', action, data);
    }

    // Track feedback type selection
    $('.feedback-type-card').on('click', function() {
        const type = $(this).data('type');
        trackFeedbackInteraction('feedback_type_selected', { type });
    });

    // Track rating selection
    $('.rating-input-large input[type="radio"]').on('change', function() {
        const rating = $(this).val();
        trackFeedbackInteraction('rating_selected', { rating });
    });

    // Initialize with general feedback selected
    selectFeedbackType('general');
    
    console.log('✅ Feedback system loaded successfully');
});