/**
 * Animation Disable Script
 * Disables all JavaScript animations and effects
 */

$(document).ready(function() {
    'use strict';
    
    console.log('🚫 Disabling all animations...');
    
    // =====================
    // DISABLE ANIMATION FUNCTIONS
    // =====================
    
    // Override jQuery animate function
    $.fn.animate = function(prop, speed, easing, callback) {
        // Instead of animating, just set the final properties immediately
        if (typeof prop === 'object') {
            this.css(prop);
        }
        
        // Call callback immediately if provided
        if (typeof callback === 'function') {
            callback.call(this);
        } else if (typeof easing === 'function') {
            easing.call(this);
        } else if (typeof speed === 'function') {
            speed.call(this);
        }
        
        return this;
    };
    
    // Override fadeIn, fadeOut, slideUp, slideDown
    $.fn.fadeIn = function(speed, callback) {
        this.show();
        if (typeof callback === 'function') callback.call(this);
        return this;
    };
    
    $.fn.fadeOut = function(speed, callback) {
        this.hide();
        if (typeof callback === 'function') callback.call(this);
        return this;
    };
    
    $.fn.slideUp = function(speed, callback) {
        this.hide();
        if (typeof callback === 'function') callback.call(this);
        return this;
    };
    
    $.fn.slideDown = function(speed, callback) {
        this.show();
        if (typeof callback === 'function') callback.call(this);
        return this;
    };
    
    $.fn.slideToggle = function(speed, callback) {
        this.toggle();
        if (typeof callback === 'function') callback.call(this);
        return this;
    };
    
    // Disable requestAnimationFrame
    window.requestAnimationFrame = function(callback) {
        // Execute callback immediately instead of on next frame
        callback();
        return 0;
    };
    
    window.cancelAnimationFrame = function(id) {
        // Do nothing
    };
    
    // =====================
    // DISABLE INTERVALS AND TIMEOUTS FOR ANIMATIONS
    // =====================
    
    // Keep track of original functions
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    
    // Override setInterval to prevent animation loops
    window.setInterval = function(callback, delay) {
        // Only allow intervals with delays > 5000ms (5 seconds)
        // This prevents animation loops but allows functional intervals
        if (delay && delay > 5000) {
            return originalSetInterval(callback, delay);
        }
        return 0;
    };
    
    // Override setTimeout for animation-related timeouts
    window.setTimeout = function(callback, delay) {
        // Execute animation callbacks immediately
        if (delay && delay < 2000) {
            callback();
            return 0;
        }
        return originalSetTimeout(callback, delay);
    };
    
    // =====================
    // DISABLE SPECIFIC ANIMATION SYSTEMS
    // =====================
    
    // Disable particle systems
    if (window.createFloatingParticles) {
        window.createFloatingParticles = function() { /* disabled */ };
    }
    
    if (window.createParticleExplosion) {
        window.createParticleExplosion = function() { /* disabled */ };
    }
    
    if (window.createVideoParticleEffects) {
        window.createVideoParticleEffects = function() { /* disabled */ };
    }
    
    // Disable video animations
    if (window.videoAnimations) {
        window.videoAnimations.createSparkles = function() { /* disabled */ };
        window.videoAnimations.toggleAllVideos = function() { /* disabled */ };
    }
    
    if (window.enhancedVideoAnimations) {
        window.enhancedVideoAnimations.changeTheme = function() { /* disabled */ };
        window.enhancedVideoAnimations.createParticles = function() { /* disabled */ };
    }
    
    // =====================
    // REMOVE EXISTING ANIMATED ELEMENTS
    // =====================
    
    // Remove particle elements
    $('.floating-particle, .beauty-particle, .explosion-particle, .mouse-trail').remove();
    $('.video-particle, .video-particles-overlay, .beauty-sparkle-effect').remove();
    $('.ripple-effect, .search-glow, .scene-transition').remove();
    
    // Remove video canvas effects
    $('.video-effect-canvas, .canvas-video-effect').remove();
    
    // Remove loading screens
    $('.loading-screen, .video-loading').remove();
    
    // Remove floating video elements
    $('.enhanced-video-foreground, .video-foreground').remove();
    
    // Remove video background
    $('.video-background-container').hide();
    
    // =====================
    // DISABLE EVENT-BASED ANIMATIONS
    // =====================
    
    // Remove scroll-based animations
    $(window).off('scroll.animations');
    
    // Disable hover animations by removing classes
    $('.animate-on-scroll').removeClass('animate-on-scroll').addClass('no-animate');
    $('.container-animated').removeClass('container-animated');
    $('.container-float').removeClass('container-float');
    $('.container-pulse').removeClass('container-pulse');
    $('.container-rotate').removeClass('container-rotate');
    $('.container-glow').removeClass('container-glow');
    $('.container-sparkle').removeClass('container-sparkle');
    
    // Remove animation delay classes
    $('.delay-1, .delay-2, .delay-3, .delay-4, .delay-5')
        .removeClass('delay-1 delay-2 delay-3 delay-4 delay-5');
    
    // Remove floating and animation classes
    $('.floating-logo, .wobble, .scale-hover, .rotate-icon, .bounce-click')
        .removeClass('floating-logo wobble scale-hover rotate-icon bounce-click');
    
    // Remove sparkle and glow effects
    $('.sparkle-effect, .neon-glow').removeClass('sparkle-effect neon-glow');
    
    // =====================
    // DISABLE CSS ANIMATIONS VIA JAVASCRIPT
    // =====================
    
    // Add no-animation class to body
    $('body').addClass('no-animations');
    
    // Set CSS to disable animations
    $('*').css({
        'animation': 'none !important',
        'transition': 'none !important',
        'transform': 'none !important'
    });
    
    // =====================
    // DISABLE INTERSECTION OBSERVER ANIMATIONS
    // =====================
    
    // Override IntersectionObserver for scroll animations
    if (window.IntersectionObserver) {
        const OriginalIntersectionObserver = window.IntersectionObserver;
        window.IntersectionObserver = function(callback, options) {
            // Create observer but make all elements immediately visible
            const observer = new OriginalIntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    // Make everything appear as "in view" immediately
                    entry.isIntersecting = true;
                    $(entry.target).addClass('in-view no-animate');
                });
                callback(entries);
            }, options);
            
            return observer;
        };
    }
    
    // =====================
    // DISABLE VIDEO AUTOPLAY AND EFFECTS
    // =====================
    
    // Stop all videos
    $('video').each(function() {
        this.pause();
        this.removeAttribute('autoplay');
        this.muted = true;
    });
    
    // Remove video event listeners
    $('video').off();
    
    // =====================
    // DISABLE MOUSE TRAIL AND HOVER EFFECTS
    // =====================
    
    // Remove mouse event listeners for trails
    $(document).off('mousemove.trail');
    $(document).off('mousemove.particles');
    
    // Disable hover particle creation
    $('.video-foreground, .enhanced-video-foreground, .showcase-card').off('mouseenter mouseleave');
    
    // =====================
    // RESTORE ESSENTIAL FUNCTIONALITY
    // =====================
    
    // Keep essential click handlers but remove animations
    $('.video-play-btn').off('click').on('click', function() {
        const video = $(this).closest('.video-foreground, .enhanced-video-foreground').find('video')[0];
        if (video) {
            if (video.paused) {
                video.play();
                $(this).find('i').removeClass('fa-play').addClass('fa-pause');
            } else {
                video.pause();
                $(this).find('i').removeClass('fa-pause').addClass('fa-play');
            }
        }
    });
    
    // Keep theme selector functionality but remove animations
    $('.theme-btn').off('click').on('click', function() {
        $('.theme-btn').removeClass('active');
        $(this).addClass('active');
        
        // Change colors immediately without animation
        const themeName = $(this).data('theme');
        updateThemeWithoutAnimation(themeName);
    });
    
    // Keep navigation functionality
    $('.navbar-toggler').off('click').on('click', function() {
        $('.navbar-collapse').toggle();
    });
    
    // Keep dropdown functionality
    $('.dropdown-toggle').off('click').on('click', function(e) {
        e.preventDefault();
        $(this).next('.dropdown-menu').toggle();
    });
    
    // =====================
    // HELPER FUNCTIONS
    // =====================
    
    function updateThemeWithoutAnimation(themeName) {
        const themeColors = {
            'neon-orange': ['#FF6B35', '#F7931E', '#FF8C00'],
            'neon-blue': ['#00D2FF', '#3A7BD5', '#00F5FF'],
            'electric-pink': ['#FF0080', '#FF8C00', '#FF1493'],
            'cyber-green': ['#32CD32', '#00FF7F', '#00E676'],
            'neon-purple': ['#8360C3', '#2EBAB0', '#8A2BE2']
        };
        
        const colors = themeColors[themeName];
        if (!colors) return;
        
        // Update container backgrounds immediately
        $('.showcase-card').each(function(index) {
            const colorIndex = index % colors.length;
            $(this).css({
                background: `linear-gradient(135deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})`
            });
        });
        
        // Update other themed elements
        $('.video-overlay').css({
            background: `linear-gradient(45deg, ${colors[0]}30, ${colors[1]}20, ${colors[2]}30)`
        });
    }
    
    // =====================
    // FINAL CLEANUP
    // =====================
    
    // Clear any remaining animation intervals
    for (let i = 1; i < 99999; i++) {
        window.clearInterval(i);
        window.clearTimeout(i);
    }
    
    // Remove animation-related CSS classes from all elements
    $('*').each(function() {
        const element = $(this);
        const classes = element.attr('class');
        if (classes) {
            const cleanedClasses = classes
                .split(' ')
                .filter(cls => !cls.includes('animate') && 
                              !cls.includes('float') && 
                              !cls.includes('pulse') && 
                              !cls.includes('rotate') && 
                              !cls.includes('glow') && 
                              !cls.includes('sparkle') && 
                              !cls.includes('delay'))
                .join(' ');
            element.attr('class', cleanedClasses);
        }
    });
    
    // Show all hidden elements that were waiting for animations
    $('.animate-on-scroll, .scroll-animate').css({
        'opacity': '1',
        'visibility': 'visible',
        'display': 'block'
    });
    
    // Ensure videos are visible but static
    $('.video-fallback-enhanced').show();
    
    console.log('✅ All animations disabled successfully');
    
    // =====================
    // GLOBAL DISABLE FLAG
    // =====================
    
    // Set global flag to indicate animations are disabled
    window.ANIMATIONS_DISABLED = true;
    
    // Override any future animation attempts
    window.createAnimation = function() { return false; };
    window.startAnimation = function() { return false; };
    window.initAnimations = function() { return false; };
    
});

// =====================
// CSS OVERRIDE INJECTION
// =====================

// Inject additional CSS to ensure animations are disabled
const disableAnimationsCSS = `
    <style id="disable-animations-override">
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        .no-animations * {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
        }
        
        @keyframes none {
            0%, 100% { transform: none; }
        }
    </style>
`;

$(document).ready(function() {
    $('head').append(disableAnimationsCSS);
});