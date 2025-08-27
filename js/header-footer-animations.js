/**
 * Header & Footer Animations
 * Advanced JavaScript & jQuery Animations for Sanoria.pk
 */

$(document).ready(function() {
    'use strict';
    
    // Error handling
    try {
    
    // =====================
    // GLOBAL VARIABLES
    // =====================
    
    let lastScrollTop = 0;
    let isAnimating = false;
    
    // =====================
    // HELPER FUNCTIONS
    // =====================
    
    function createParticleExplosion(element) {
        const rect = element[0].getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = $('<div class="explosion-particle"></div>');
            
            particle.css({
                position: 'fixed',
                left: centerX + 'px',
                top: centerY + 'px',
                width: '4px',
                height: '4px',
                background: '#FF0066',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999
            });
            
            $('body').append(particle);
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 100;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.animate({
                left: endX + 'px',
                top: endY + 'px',
                opacity: 0
            }, 800, function() {
                $(this).remove();
            });
        }
    }
    
    function createSearchGlow(element) {
        if (element.parent().find('.search-glow').length > 0) return;
        
        const glowEffect = $('<div class="search-glow"></div>');
        
        glowEffect.css({
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            right: '-5px',
            bottom: '-5px',
            background: 'linear-gradient(45deg, #FF0066, #FF3385, #FF66B3, #FF0066)',
            borderRadius: '12px',
            opacity: 0,
            zIndex: -1,
            filter: 'blur(10px)'
        });
        
        element.parent().css('position', 'relative').append(glowEffect);
        
        glowEffect.animate({ opacity: 0.6 }, 300);
        
        setTimeout(() => {
            glowEffect.animate({ opacity: 0 }, 300, function() {
                $(this).remove();
            });
        }, 2000);
    }
    
    function createRippleEffect(element) {
        if (element.find('.ripple-effect').length > 0) return;
        
        const ripple = $('<div class="ripple-effect"></div>');
        
        ripple.css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
        });
        
        element.css('position', 'relative').append(ripple);
        
        ripple.animate({
            width: '100px',
            height: '100px',
            opacity: 0
        }, 600, function() {
            $(this).remove();
        });
    }
    
    function createMouseTrail(x, y) {
        if (isAnimating) return;
        
        const trail = $('<div class="mouse-trail"></div>');
        
        trail.css({
            position: 'fixed',
            left: x + 'px',
            top: y + 'px',
            width: '6px',
            height: '6px',
            background: 'rgba(255, 0, 102, 0.7)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'translate(-50%, -50%)'
        });
        
        $('body').append(trail);
        
        trail.animate({
            opacity: 0,
            width: '20px',
            height: '20px'
        }, 800, function() {
            $(this).remove();
        });
    }
    
    // =====================
    // HEADER ANIMATIONS
    // =====================
    
    function initHeaderAnimations() {
        
        // Navbar scroll effect with enhanced animation
        $(window).scroll(function() {
            const scrollTop = $(this).scrollTop();
            const header = $('.main-header');
            
            if (scrollTop > 100) {
                header.addClass('scrolled');
                
                // Add parallax effect to header elements
                const scrolled = scrollTop * 0.3;
                $('.top-banner').css('transform', `translateY(${scrolled}px)`);
                
                // Hide header on scroll down, show on scroll up
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    header.addClass('hidden');
                } else {
                    header.removeClass('hidden');
                }
            } else {
                header.removeClass('scrolled hidden');
                $('.top-banner').css('transform', 'translateY(0)');
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Logo hover effect with particle explosion
        $('.logo-img').hover(
            function() {
                $(this).addClass('logo-hover');
                createParticleExplosion($(this));
            },
            function() {
                $(this).removeClass('logo-hover');
            }
        );
        
        // Search bar focus effects
        $('.search-input').on('focus', function() {
            $(this).parent().addClass('search-active');
            createSearchGlow($(this));
        }).on('blur', function() {
            $(this).parent().removeClass('search-active');
        });
        
        // Navigation menu hover effects
        $('.navbar-nav .nav-link').each(function(index) {
            $(this).on('mouseenter', function() {
                $(this).addClass('nav-hover');
            }).on('mouseleave', function() {
                $(this).removeClass('nav-hover');
            });
        });
        
        // Header icons animation
        $('.header-icon').each(function(index) {
            $(this).on('mouseenter', function() {
                const delay = index * 100;
                setTimeout(() => {
                    $(this).addClass('icon-bounce');
                    setTimeout(() => {
                        $(this).removeClass('icon-bounce');
                    }, 600);
                }, delay);
            });
        });
        
        // Cart icon bounce on update
        $(document).on('cartUpdated', function() {
            $('.cart-icon').addClass('cart-bounce');
            setTimeout(() => $('.cart-icon').removeClass('cart-bounce'), 600);
        });
        
        // Top banner auto-scroll text
        initBannerTextScroll();
    }
    
    // =====================
    // FOOTER ANIMATIONS
    // =====================
    
    function initFooterAnimations() {
        
        // Footer reveal animation on scroll
        const footer = $('.main-footer');
        
        $(window).scroll(function() {
            if (footer.length === 0) return;
            
            const footerTop = footer.offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (windowBottom > footerTop - 100) {
                footer.addClass('footer-revealed');
                animateFooterSections();
            }
        });
        
        // Social links hover effects
        $('.social-link').each(function(index) {
            $(this).on('mouseenter', function() {
                animateSocialIcon($(this), index);
                createRippleEffect($(this));
            });
        });
        
        // Footer links stagger animation
        $('.footer-links li').each(function(index) {
            $(this).css('animation-delay', `${index * 0.1}s`);
        });
        
        // Payment methods hover animation
        $('.payment-item').on('mouseenter', function() {
            animatePaymentMethod($(this));
        });
        
        // Copyright text typewriter effect
        initCopyrightTypewriter();
    }
    
    // =====================
    // SCROLL ANIMATIONS
    // =====================
    
    function initScrollAnimations() {
        
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            $('.animate-on-scroll').addClass('in-view');
            return;
        }
        
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('in-view');
                    
                    // Trigger specific animations based on element
                    if ($(entry.target).hasClass('footer-section')) {
                        animateFooterSection($(entry.target));
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        $('.animate-on-scroll, .footer-section').each(function() {
            observer.observe(this);
        });
        
        // Parallax scrolling for header background
        $(window).scroll(function() {
            const scrolled = $(this).scrollTop();
            const parallax = $('.parallax-header');
            const speed = scrolled * 0.2;
            
            if (parallax.length > 0) {
                parallax.css('transform', `translateY(${speed}px)`);
            }
        });
    }
    
    // =====================
    // PARTICLE EFFECTS
    // =====================
    
    function initParticleEffects() {
        // Create floating particles in header
        createFloatingParticles('.main-header', 5);
        
        // Create floating particles in footer
        createFloatingParticles('.main-footer', 8);
    }
    
    function createFloatingParticles(container, count) {
        const $container = $(container);
        if ($container.length === 0 || window.innerWidth < 768) return; // Skip on mobile
        
        // Reduce particle count for performance
        const particleCount = Math.min(count, 3);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = $('<div class="floating-particle"></div>');
            
            particle.css({
                position: 'absolute',
                width: '3px',
                height: '3px',
                background: `rgba(255, 0, 102, 0.3)`,
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                pointerEvents: 'none',
                zIndex: 1
            });
            
            $container.append(particle);
            
            // Simple fade animation instead of complex movement
            particle.animate({
                opacity: 0
            }, 3000 + Math.random() * 2000, function() {
                $(this).css('opacity', 0.3);
                createFloatingParticles(container, 1); // Recreate one particle
                $(this).remove();
            });
        }
    }
    
    // Removed complex animateParticle function for better performance
    
    // =====================
    // TYPING EFFECT
    // =====================
    
    function initTypingEffect() {
        const texts = [
            'The Essence Of TimeLess Glow',
            'Premium Beauty & Skincare',
            'Your Trusted Beauty Partner',
            'Discover Your Perfect Glow'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const taglineElement = $('.brand-tagline');
            if (taglineElement.length === 0) return;
            
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                taglineElement.text(currentText.substring(0, charIndex - 1));
                charIndex--;
            } else {
                taglineElement.text(currentText.substring(0, charIndex + 1));
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 3000);
    }
    
    // =====================
    // FLOATING ELEMENTS
    // =====================
    
    function initFloatingElements() {
        // Skip floating animations on mobile for better performance
        if (window.innerWidth < 768) return;
        
        // Simple CSS-based floating for logo
        $('.logo-img').addClass('floating-logo');
        
        // Simple hover effects for social icons instead of continuous animation
        $('.social-link').hover(
            function() {
                $(this).css('transform', 'translateY(-3px)');
            },
            function() {
                $(this).css('transform', 'translateY(0)');
            }
        );
    }
    
    // =====================
    // HELPER ANIMATION FUNCTIONS
    // =====================
    
    function animateFooterSections() {
        $('.footer-section').each(function(index) {
            const $this = $(this);
            setTimeout(() => {
                $this.addClass('section-reveal');
            }, index * 200);
        });
    }
    
    function animateSocialIcon(element, index) {
        const colors = ['#1877f2', '#E4405F', '#1DA1F2', '#FF0000', '#0077B5'];
        const color = colors[index % colors.length];
        
        element.css({
            background: `linear-gradient(135deg, ${color}, #FF0066)`,
            transform: 'scale(1.2) translateY(-5px)'
        });
        
        setTimeout(() => {
            element.css({
                background: 'linear-gradient(135deg, #FF0066, #FF3385)',
                transform: 'scale(1) translateY(0)'
            });
        }, 300);
    }
    
    function animatePaymentMethod(element) {
        element.css({
            transform: 'translateY(-3px) scale(1.05)',
            boxShadow: '0 10px 25px rgba(255, 0, 102, 0.3)'
        });
        
        setTimeout(() => {
            element.css({
                transform: 'translateY(0) scale(1)',
                boxShadow: 'none'
            });
        }, 300);
    }
    
    function initCopyrightTypewriter() {
        const copyrightText = $('.copyright-text');
        if (copyrightText.length === 0) return;
        
        const originalText = copyrightText.text();
        copyrightText.text('');
        
        let i = 0;
        function typeChar() {
            if (i < originalText.length) {
                copyrightText.text(copyrightText.text() + originalText.charAt(i));
                i++;
                setTimeout(typeChar, 50);
            }
        }
        
        // Start typing after footer is visible
        setTimeout(typeChar, 1000);
    }
    
    function initBannerTextScroll() {
        const banner = $('.top-banner p');
        if (banner.length === 0) return;
        
        const promoTexts = [
            '<i class="fas fa-gift me-2"></i><strong>SPECIAL OFFER:</strong> Free shipping on orders over Rs. 2000 | Free samples with every order',
            '<i class="fas fa-star me-2"></i><strong>NEW ARRIVALS:</strong> Discover our latest skincare collection | Premium quality guaranteed',
            '<i class="fas fa-heart me-2"></i><strong>CUSTOMER LOVE:</strong> Over 10,000 happy customers | Join our beauty community',
            '<i class="fas fa-truck me-2"></i><strong>FAST DELIVERY:</strong> Same day delivery in Karachi | COD available nationwide'
        ];
        
        let currentIndex = 0;
        
        setInterval(() => {
            banner.fadeOut(500, function() {
                currentIndex = (currentIndex + 1) % promoTexts.length;
                banner.html(promoTexts[currentIndex]).fadeIn(500);
            });
        }, 5000);
    }
    
    function animateFooterSection(section) {
        section.find('.footer-links li').each(function(index) {
            const $this = $(this);
            setTimeout(() => {
                $this.addClass('link-reveal');
            }, index * 100);
        });
    }
    
    // Text reveal animation for footer tagline
    function initTextReveal() {
        $('.text-reveal').each(function() {
            const text = $(this).text();
            const words = text.split(' ');
            let html = '';
            
            words.forEach(word => {
                html += `<span>${word}</span> `;
            });
            
            $(this).html(html);
        });
    }
    
    // Add vibration effect on mobile
    function addVibrationSupport() {
        $('.bounce-click').on('touchstart', function() {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    }
    
    // =====================
    // MOUSE TRAIL EFFECT
    // =====================
    
    $(document).mousemove(function(e) {
        // Throttle mouse trail creation
        if (Math.random() > 0.3) return;
        
        // Create mouse trail particles in header and footer areas
        const header = $('.main-header');
        const footer = $('.main-footer');
        
        if (header.length === 0 || footer.length === 0) return;
        
        const headerBottom = header.offset().top + header.outerHeight();
        const footerTop = footer.offset().top;
        
        if (e.pageY <= headerBottom || e.pageY >= footerTop) {
            createMouseTrail(e.pageX, e.pageY);
        }
    });
    
    // =====================
    // INITIALIZATION CALLS
    // =====================
    
    // Initialize all animations
    initHeaderAnimations();
    initFooterAnimations();
    initScrollAnimations();
    initParticleEffects();
    initTypingEffect();
    initFloatingElements();
    initTextReveal();
    addVibrationSupport();
    
    // Add dynamic CSS for animations
    $('<style>').text(`
        .header-icon.icon-bounce {
            animation: logoBounce 0.6s ease-in-out;
        }
        
        .search-container.search-active .search-input {
            border-color: #FF0066;
            box-shadow: 0 0 0 3px rgba(255, 0, 102, 0.1);
        }
        
        .main-header.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .main-header.hidden {
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        
        .footer-section.section-reveal {
            animation: fadeInUp 0.8s ease-out both;
        }
        
        .footer-links li.link-reveal {
            animation: slideInLeft 0.5s ease-out both;
        }
        
        .cart-icon.cart-bounce {
            animation: logoBounce 0.6s ease-in-out;
        }
        
        .main-header {
            position: relative;
            overflow: hidden;
        }
        
        .floating-particle {
            transition: all 0.3s ease;
        }
        
        .explosion-particle {
            transition: all 0.8s ease-out;
        }
        
        .mouse-trail {
            transition: all 0.8s ease-out;
        }
        
        .search-glow {
            transition: opacity 0.3s ease;
        }
        
        .ripple-effect {
            transition: all 0.6s ease;
        }
    `).appendTo('head');
    
    } catch (error) {
        console.warn('Animation initialization error:', error);
        // Fallback: add basic visibility to animated elements
        $('.animate-on-scroll').addClass('in-view');
        $('.footer-section').addClass('section-reveal');
    }
    
});

// =====================
// PERFORMANCE OPTIMIZATION
// =====================

// Debounce function for scroll events
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

// Optimize scroll events
$(window).on('scroll', debounce(function() {
    // Additional scroll optimizations can be added here
}, 10));

// Preload animations for better performance
$(window).on('load', function() {
    // Trigger initial animations
    $('.animate-on-scroll').first().addClass('in-view');
});