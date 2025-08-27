/**
 * Header & Footer Animations
 * Advanced JavaScript & jQuery Animations for Sanoria.pk
 */

$(document).ready(function() {
    'use strict';
    
    // =====================
    // INITIALIZATION
    // =====================
    
    initHeaderAnimations();
    initFooterAnimations();
    initScrollAnimations();
    initParticleEffects();
    initTypingEffect();
    initFloatingElements();
    
    // =====================
    // HEADER ANIMATIONS
    // =====================
    
    function initHeaderAnimations() {
        
        // Navbar scroll effect with enhanced animation
        let lastScrollTop = 0;
        $(window).scroll(function() {
            const scrollTop = $(this).scrollTop();
            const header = $('.main-header');
            
            if (scrollTop > 100) {
                header.addClass('scrolled');
                
                // Add parallax effect to header elements
                const scrolled = scrollTop * 0.5;
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
                animateNavIcon($(this), index);
            }).on('mouseleave', function() {
                $(this).removeClass('nav-hover');
            });
        });
        
        // Header icons animation
        $('.header-icon').each(function(index) {
            $(this).on('mouseenter', function() {
                animateHeaderIcon($(this), index);
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
        
        // Footer wave effect
        createFooterWave();
        
        // Copyright text typewriter effect
        initCopyrightTypewriter();
    }
    
    // =====================
    // SCROLL ANIMATIONS
    // =====================
    
    function initScrollAnimations() {
        
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
            const speed = scrolled * 0.5;
            
            parallax.css('transform', `translateY(${speed}px)`);
        });
    }
    
    // =====================
    // PARTICLE EFFECTS
    // =====================
    
    function initParticleEffects() {
        
        // Create floating particles in header
        createFloatingParticles('.main-header', 10);
        
        // Create floating particles in footer
        createFloatingParticles('.main-footer', 15);
    }
    
    function createFloatingParticles(container, count) {
        const $container = $(container);
        
        for (let i = 0; i < count; i++) {
            const particle = $('<div class="floating-particle"></div>');
            
            particle.css({
                position: 'absolute',
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: `rgba(255, 0, 102, ${Math.random() * 0.5 + 0.1})`,
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                pointerEvents: 'none',
                zIndex: 1
            });
            
            $container.append(particle);
            
            animateParticle(particle, i);
        }
    }
    
    function animateParticle(particle, index) {
        const duration = Math.random() * 3000 + 2000;
        const delay = index * 200;
        
        setTimeout(() => {
            particle.animate({
                top: '+=50px',
                opacity: 0
            }, duration, 'linear', function() {
                $(this).css({
                    top: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.5 + 0.1
                });
                animateParticle(particle, index);
            });
        }, delay);
    }
    
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
            const currentText = texts[textIndex];
            const taglineElement = $('.brand-tagline');
            
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
        
        // Floating logo effect
        setInterval(() => {
            $('.logo-img').css({
                transform: `translateY(${Math.sin(Date.now() * 0.002) * 5}px) rotate(${Math.sin(Date.now() * 0.001) * 2}deg)`
            });
        }, 50);
        
        // Floating social icons
        $('.social-link').each(function(index) {
            const offset = index * 0.5;
            setInterval(() => {
                $(this).css({
                    transform: `translateY(${Math.sin((Date.now() + offset * 1000) * 0.003) * 3}px)`
                });
            }, 50);
        });
    }
    
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
    
    function animateNavIcon(element, index) {
        const icon = element.find('i');
        if (icon.length) {
            icon.css({
                animation: `pulse 0.6s ease-in-out ${index * 0.1}s`
            });
        }
    }
    
    function animateHeaderIcon(element, index) {
        const delay = index * 100;
        
        setTimeout(() => {
            element.addClass('icon-bounce');
            setTimeout(() => {
                element.removeClass('icon-bounce');
            }, 600);
        }, delay);
    }
    
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
    
    function createRippleEffect(element) {
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
    
    function createFooterWave() {
        const wave = $('<div class="footer-wave"></div>');
        
        wave.css({
            position: 'absolute',
            top: '-1px',
            left: '0',
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF0066, transparent)',
            animation: 'wave 3s infinite linear'
        });
        
        $('.main-footer').prepend(wave);
    }
    
    function initCopyrightTypewriter() {
        const copyrightText = $('.copyright-text');
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
        const originalText = banner.html();
        
        setInterval(() => {
            banner.fadeOut(500, function() {
                // You can add different promotional texts here
                const promoTexts = [
                    '<i class="fas fa-gift me-2"></i><strong>SPECIAL OFFER:</strong> Free shipping on orders over Rs. 2000 | Free samples with every order',
                    '<i class="fas fa-star me-2"></i><strong>NEW ARRIVALS:</strong> Discover our latest skincare collection | Premium quality guaranteed',
                    '<i class="fas fa-heart me-2"></i><strong>CUSTOMER LOVE:</strong> Over 10,000 happy customers | Join our beauty community',
                    '<i class="fas fa-truck me-2"></i><strong>FAST DELIVERY:</strong> Same day delivery in Karachi | COD available nationwide'
                ];
                
                const randomText = promoTexts[Math.floor(Math.random() * promoTexts.length)];
                banner.html(randomText).fadeIn(500);
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
    
    // =====================
    // CSS ADDITIONS
    // =====================
    
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
        
        @keyframes wave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
    `).appendTo('head');
    
});

    // =====================
    // ADVANCED EFFECTS
    // =====================
    
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
    
    // Initialize text reveal
    initTextReveal();
    
    // Add vibration effect on mobile
    function addVibrationSupport() {
        $('.bounce-click').on('touchstart', function() {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    }
    
    addVibrationSupport();
    
    // Weather-based animations (rain effect)
    function createRainEffect() {
        for (let i = 0; i < 50; i++) {
            const drop = $('<div class="rain-drop"></div>');
            
            drop.css({
                position: 'fixed',
                left: Math.random() * 100 + '%',
                top: '-10px',
                width: '2px',
                height: '20px',
                background: 'linear-gradient(to bottom, transparent, rgba(255, 0, 102, 0.3))',
                pointerEvents: 'none',
                zIndex: 1,
                animation: `rain ${Math.random() * 3 + 2}s linear infinite`
            });
            
            $('body').append(drop);
            
            setTimeout(() => {
                drop.remove();
            }, 5000);
        }
    }
    
    // Constellation effect for header
    function createConstellationEffect() {
        const stars = [];
        const numStars = 20;
        
        for (let i = 0; i < numStars; i++) {
            const star = $('<div class="constellation-star"></div>');
            
            star.css({
                position: 'absolute',
                width: '2px',
                height: '2px',
                background: '#FF0066',
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`
            });
            
            $('.main-header').append(star);
            stars.push(star);
        }
        
        // Connect nearby stars with lines
        setInterval(() => {
            $('.constellation-line').remove();
            
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const star1 = stars[i];
                    const star2 = stars[j];
                    
                    const pos1 = star1.position();
                    const pos2 = star2.position();
                    
                    const distance = Math.sqrt(
                        Math.pow(pos2.left - pos1.left, 2) + 
                        Math.pow(pos2.top - pos1.top, 2)
                    );
                    
                    if (distance < 100) {
                        const line = $('<div class="constellation-line"></div>');
                        
                        const angle = Math.atan2(pos2.top - pos1.top, pos2.left - pos1.left);
                        
                        line.css({
                            position: 'absolute',
                            left: pos1.left + 'px',
                            top: pos1.top + 'px',
                            width: distance + 'px',
                            height: '1px',
                            background: 'rgba(255, 0, 102, 0.2)',
                            transform: `rotate(${angle}rad)`,
                            transformOrigin: 'left center',
                            pointerEvents: 'none'
                        });
                        
                        $('.main-header').append(line);
                    }
                }
            }
        }, 2000);
    }
    
    // Initialize constellation effect
    createConstellationEffect();
    
    // Voice-activated animations (experimental)
    function initVoiceAnimations() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            
            recognition.onresult = function(event) {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript.toLowerCase();
                    
                    if (transcript.includes('animate') || transcript.includes('dance')) {
                        $('.logo-img').addClass('wobble');
                        setTimeout(() => $('.logo-img').removeClass('wobble'), 2000);
                    }
                    
                    if (transcript.includes('sparkle') || transcript.includes('magic')) {
                        $('.sparkle-effect').css('animation', 'sparkle 0.5s ease-in-out 3');
                    }
                }
            };
            
            // Start voice recognition on user gesture
            $(document).one('click', function() {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Voice recognition not available');
                }
            });
        }
    }
    
    initVoiceAnimations();
    
});

// =====================
// MOUSE TRAIL EFFECT
// =====================

$(document).mousemove(function(e) {
    // Create mouse trail particles in header and footer areas
    const headerBottom = $('.main-header').offset().top + $('.main-header').outerHeight();
    const footerTop = $('.main-footer').offset().top;
    
    if (e.pageY <= headerBottom || e.pageY >= footerTop) {
        createMouseTrail(e.pageX, e.pageY);
    }
});

function createMouseTrail(x, y) {
    const trail = $('<div class="mouse-trail"></div>');
    
    trail.css({
        position: 'absolute',
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
// ADDITIONAL CSS KEYFRAMES
// =====================

$('<style>').text(`
    @keyframes rain {
        to {
            top: 100vh;
            transform: translateX(20px);
        }
    }
    
    @keyframes twinkle {
        0% { opacity: 0.2; transform: scale(1); }
        100% { opacity: 1; transform: scale(1.5); }
    }
    
    .main-header {
        position: relative;
        overflow: hidden;
    }
    
    .constellation-star {
        z-index: 1;
    }
    
    .constellation-line {
        z-index: 1;
    }
`).appendTo('head');