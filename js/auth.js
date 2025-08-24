/**
 * Authentication JavaScript for Sanoria.pk
 * Handles login, registration, and password reset functionality
 */

$(document).ready(function() {
    'use strict';

    // =====================
    // GLOBAL VARIABLES
    // =====================
    let isSubmitting = false;

    // =====================
    // INITIALIZATION
    // =====================
    initPasswordToggle();
    initFormValidation();
    initSocialLogin();
    
    // Check if user is already logged in
    checkAuthStatus();

    // =====================
    // PASSWORD TOGGLE
    // =====================
    function initPasswordToggle() {
        $('#togglePassword').on('click', function() {
            const passwordField = $('#password');
            const icon = $(this).find('i');
            
            if (passwordField.attr('type') === 'password') {
                passwordField.attr('type', 'text');
                icon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                passwordField.attr('type', 'password');
                icon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });
    }

    // =====================
    // FORM VALIDATION
    // =====================
    function initFormValidation() {
        // Real-time validation
        $('.form-control').on('blur', function() {
            validateField($(this));
        });

        $('.form-control').on('input', function() {
            if ($(this).hasClass('is-invalid')) {
                validateField($(this));
            }
        });

        // Form submission
        $('#loginForm').on('submit', handleLogin);
        $('#registerForm').on('submit', handleRegister);
        $('#forgotPasswordForm').on('submit', handleForgotPassword);
        $('#resetPasswordForm').on('submit', handleResetPassword);
    }

    function validateField($field) {
        const fieldName = $field.attr('name');
        const value = $field.val().trim();
        let isValid = true;
        let message = '';

        // Clear previous validation
        $field.removeClass('is-valid is-invalid');
        $field.siblings('.invalid-feedback').text('');

        switch (fieldName) {
            case 'email':
                if (!value) {
                    isValid = false;
                    message = 'Email is required';
                } else if (!isValidEmail(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;

            case 'password':
                if (!value) {
                    isValid = false;
                    message = 'Password is required';
                } else if (value.length < 6) {
                    isValid = false;
                    message = 'Password must be at least 6 characters';
                }
                break;

            case 'confirmPassword':
                const password = $('#password').val();
                if (!value) {
                    isValid = false;
                    message = 'Please confirm your password';
                } else if (value !== password) {
                    isValid = false;
                    message = 'Passwords do not match';
                }
                break;

            case 'firstName':
            case 'lastName':
                if (!value) {
                    isValid = false;
                    message = 'This field is required';
                } else if (value.length < 2) {
                    isValid = false;
                    message = 'Must be at least 2 characters';
                }
                break;

            case 'phone':
                if (value && !isValidPhone(value)) {
                    isValid = false;
                    message = 'Please enter a valid phone number';
                }
                break;
        }

        if (isValid) {
            $field.addClass('is-valid');
        } else {
            $field.addClass('is-invalid');
            $field.siblings('.invalid-feedback').text(message);
            
            // Shake animation for invalid fields
            $field.addClass('animate-shake');
            setTimeout(() => {
                $field.removeClass('animate-shake');
            }, 500);
        }

        return isValid;
    }

    function validateForm($form) {
        let isValid = true;
        
        $form.find('.form-control[required]').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });

        return isValid;
    }

    // =====================
    // LOGIN HANDLING
    // =====================
    function handleLogin(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"]');
        
        // Validate form
        if (!validateForm($form)) {
            showAlert('Please correct the errors below', 'danger');
            return;
        }

        const formData = {
            email: $('#email').val().trim(),
            password: $('#password').val(),
            remember: $('#rememberMe').is(':checked')
        };

        isSubmitting = true;
        setButtonLoading($submitBtn, true);

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            authenticateUser(formData)
                .then(response => {
                    if (response.success) {
                        showAlert('Login successful! Redirecting...', 'success');
                        
                        // Store user session
                        storeUserSession(response.user);
                        
                        // Redirect based on user role
                        setTimeout(() => {
                            if (response.user.role === 'admin') {
                                window.location.href = 'admin/dashboard.html';
                            } else {
                                const redirectUrl = getUrlParameter('redirect') || 'index.html';
                                window.location.href = redirectUrl;
                            }
                        }, 1500);
                    } else {
                        showAlert(response.message || 'Invalid credentials', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                    showAlert('An error occurred. Please try again.', 'danger');
                })
                .finally(() => {
                    isSubmitting = false;
                    setButtonLoading($submitBtn, false);
                });
        }, 1000);
    }

    // =====================
    // REGISTRATION HANDLING
    // =====================
    function handleRegister(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"]');
        
        // Validate form
        if (!validateForm($form)) {
            showAlert('Please correct the errors below', 'danger');
            return;
        }

        // Check if terms are accepted
        if (!$('#agreeTerms').is(':checked')) {
            showAlert('Please accept the terms and conditions', 'warning');
            return;
        }

        const formData = {
            firstName: $('#firstName').val().trim(),
            lastName: $('#lastName').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            password: $('#password').val(),
            skinType: $('#skinType').val(),
            agreeTerms: $('#agreeTerms').is(':checked'),
            agreeMarketing: $('#agreeMarketing').is(':checked')
        };

        isSubmitting = true;
        setButtonLoading($submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            registerUser(formData)
                .then(response => {
                    if (response.success) {
                        showAlert('Registration successful! Please check your email for verification.', 'success');
                        
                        setTimeout(() => {
                            window.location.href = 'login.html?message=registration_success';
                        }, 2000);
                    } else {
                        showAlert(response.message || 'Registration failed', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    showAlert('An error occurred. Please try again.', 'danger');
                })
                .finally(() => {
                    isSubmitting = false;
                    setButtonLoading($submitBtn, false);
                });
        }, 1500);
    }

    // =====================
    // PASSWORD RESET HANDLING
    // =====================
    function handleForgotPassword(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"]');
        const email = $('#email').val().trim();

        if (!email || !isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }

        isSubmitting = true;
        setButtonLoading($submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            requestPasswordReset(email)
                .then(response => {
                    if (response.success) {
                        showAlert('Password reset instructions sent to your email', 'success');
                        $form.addClass('d-none');
                        $('.reset-sent-message').removeClass('d-none');
                    } else {
                        showAlert(response.message || 'Error sending reset email', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Password reset error:', error);
                    showAlert('An error occurred. Please try again.', 'danger');
                })
                .finally(() => {
                    isSubmitting = false;
                    setButtonLoading($submitBtn, false);
                });
        }, 1000);
    }

    function handleResetPassword(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"]');
        
        if (!validateForm($form)) {
            showAlert('Please correct the errors below', 'danger');
            return;
        }

        const formData = {
            token: getUrlParameter('token'),
            password: $('#password').val(),
            confirmPassword: $('#confirmPassword').val()
        };

        if (!formData.token) {
            showAlert('Invalid reset token', 'danger');
            return;
        }

        isSubmitting = true;
        setButtonLoading($submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            resetPassword(formData)
                .then(response => {
                    if (response.success) {
                        showAlert('Password reset successful! Redirecting to login...', 'success');
                        
                        setTimeout(() => {
                            window.location.href = 'login.html?message=password_reset_success';
                        }, 2000);
                    } else {
                        showAlert(response.message || 'Password reset failed', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Password reset error:', error);
                    showAlert('An error occurred. Please try again.', 'danger');
                })
                .finally(() => {
                    isSubmitting = false;
                    setButtonLoading($submitBtn, false);
                });
        }, 1000);
    }

    // =====================
    // API SIMULATION FUNCTIONS
    // =====================
    function authenticateUser(credentials) {
        return new Promise((resolve) => {
            // Simulate different user types
            const users = {
                'customer@sanoria.pk': {
                    id: 1,
                    email: 'customer@sanoria.pk',
                    firstName: 'Sarah',
                    lastName: 'Ahmad',
                    role: 'customer',
                    skinType: 'combination'
                },
                'abcd@gmail.com': {
                    id: 2,
                    email: 'abcd@gmail.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'admin'
                }
            };

            const validPasswords = {
                'customer@sanoria.pk': 'password123',
                'abcd@gmail.com': '11223344'
            };

            const user = users[credentials.email];
            const validPassword = validPasswords[credentials.email];

            if (user && credentials.password === validPassword) {
                resolve({
                    success: true,
                    user: user,
                    token: 'simulated-jwt-token-' + Date.now()
                });
            } else {
                resolve({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
        });
    }

    function registerUser(userData) {
        return new Promise((resolve) => {
            // Simulate email checking
            if (userData.email === 'existing@example.com') {
                resolve({
                    success: false,
                    message: 'Email address already exists'
                });
            } else {
                resolve({
                    success: true,
                    message: 'Registration successful'
                });
            }
        });
    }

    function requestPasswordReset(email) {
        return new Promise((resolve) => {
            // Simulate sending reset email
            resolve({
                success: true,
                message: 'Reset email sent'
            });
        });
    }

    function resetPassword(data) {
        return new Promise((resolve) => {
            if (data.token && data.password.length >= 6) {
                resolve({
                    success: true,
                    message: 'Password reset successful'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Invalid token or password'
                });
            }
        });
    }

    // =====================
    // SOCIAL LOGIN
    // =====================
    function initSocialLogin() {
        $('.social-btn').on('click', function() {
            const provider = $(this).find('i').hasClass('fa-google') ? 'google' : 'facebook';
            handleSocialLogin(provider);
        });
    }

    function handleSocialLogin(provider) {
        showAlert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
        
        // In a real implementation, you would:
        // 1. Open OAuth popup
        // 2. Handle OAuth callback
        // 3. Exchange code for token
        // 4. Create user session
    }

    // =====================
    // SESSION MANAGEMENT
    // =====================
    function storeUserSession(user) {
        const sessionData = {
            user: user,
            timestamp: Date.now(),
            expiresIn: 24 * 60 * 60 * 1000 // 24 hours
        };
        
        localStorage.setItem('sanoria_user_session', JSON.stringify(sessionData));
    }

    function getUserSession() {
        try {
            const sessionData = JSON.parse(localStorage.getItem('sanoria_user_session'));
            
            if (sessionData && Date.now() - sessionData.timestamp < sessionData.expiresIn) {
                return sessionData.user;
            } else {
                // Session expired
                localStorage.removeItem('sanoria_user_session');
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    function checkAuthStatus() {
        const user = getUserSession();
        
        if (user) {
            // User is already logged in
            const currentPage = window.location.pathname.split('/').pop();
            
            if (currentPage === 'login.html' || currentPage === 'register.html') {
                // Redirect to appropriate page
                if (user.role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }
        }
        
        // Check for URL messages
        const message = getUrlParameter('message');
        if (message) {
            const messages = {
                'registration_success': { text: 'Registration successful! Please log in.', type: 'success' },
                'password_reset_success': { text: 'Password reset successful! Please log in with your new password.', type: 'success' },
                'session_expired': { text: 'Your session has expired. Please log in again.', type: 'warning' },
                'email_verified': { text: 'Email verified successfully! You can now log in.', type: 'success' }
            };
            
            if (messages[message]) {
                setTimeout(() => {
                    showAlert(messages[message].text, messages[message].type);
                }, 500);
            }
        }
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Pakistani phone number format
        const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/[\s\-]/g, ''));
    }

    function setButtonLoading($button, loading) {
        if (loading) {
            $button.prop('disabled', true);
            $button.find('.btn-text').addClass('d-none');
            $button.find('.btn-loading').removeClass('d-none');
        } else {
            $button.prop('disabled', false);
            $button.find('.btn-text').removeClass('d-none');
            $button.find('.btn-loading').addClass('d-none');
        }
    }

    function showAlert(message, type = 'info', duration = 5000) {
        // Remove existing alerts
        $('.alert').remove();
        
        const alertClass = `alert-${type}`;
        const iconClass = {
            success: 'fa-check-circle',
            danger: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $('.auth-form').prepend(alertHtml);
        
        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                $('.alert').alert('close');
            }, duration);
        }
    }

    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // =====================
    // DEMO HELPER FUNCTIONS
    // =====================
    window.fillDemoCredentials = function(type) {
        if (type === 'customer') {
            $('#email').val('customer@sanoria.pk').trigger('blur');
            $('#password').val('password123').trigger('blur');
        } else if (type === 'admin') {
            $('#email').val('abcd@gmail.com').trigger('blur');
            $('#password').val('11223344').trigger('blur');
        }
        
        showAlert(`Demo ${type} credentials filled`, 'info', 2000);
    };

    // =====================
    // KEYBOARD SHORTCUTS
    // =====================
    $(document).on('keydown', function(e) {
        // Enter key in form fields
        if (e.key === 'Enter' && $(e.target).hasClass('form-control')) {
            const $form = $(e.target).closest('form');
            if ($form.length) {
                $form.trigger('submit');
            }
        }
    });

    // =====================
    // ACCESSIBILITY ENHANCEMENTS
    // =====================
    
    // Announce form errors to screen readers
    $('.form-control').on('invalid', function() {
        const $field = $(this);
        const fieldName = $field.attr('name') || 'Field';
        const message = $field.siblings('.invalid-feedback').text() || 'Invalid input';
        
        // Create announcement for screen readers
        const announcement = `${fieldName}: ${message}`;
        $('body').append(`<div role="status" aria-live="polite" class="sr-only">${announcement}</div>`);
        
        setTimeout(() => {
            $('[role="status"]').remove();
        }, 1000);
    });

    console.log('🔐 Authentication system initialized');
});