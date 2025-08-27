// Performance optimization: Use requestAnimationFrame for smooth animations
const raf = window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60); };

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const skeletonScreen = document.getElementById('skeletonScreen');
const mainHeader = document.getElementById('mainHeader');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const scrollToTopBtn = document.getElementById('scrollToTop');
const parallaxElements = document.querySelectorAll('[data-speed]');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');

// Loading Animation
let loadingProgress = 0;
const loadingDuration = 2000; // 2 seconds
let loadingStartTime = null;

function animateLoading(timestamp) {
    if (!loadingStartTime) loadingStartTime = timestamp;
    const elapsed = timestamp - loadingStartTime;
    loadingProgress = Math.min(elapsed / loadingDuration, 1);

    if (loadingProgress < 1) {
        raf(animateLoading);
    } else {
        hideLoadingScreen();
    }
}

function hideLoadingScreen() {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Trigger entrance animations for visible content
        checkVisibleSections();
    }, 500);
}

// Start loading animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!prefersReducedMotion) {
        raf(animateLoading);
    } else {
        hideLoadingScreen();
    }
});

// Alternative: Show skeleton screen (can be toggled)
function showSkeletonScreen() {
    loadingScreen.style.display = 'none';
    skeletonScreen.style.display = 'block';
    
    setTimeout(() => {
        skeletonScreen.style.opacity = '0';
        setTimeout(() => {
            skeletonScreen.style.display = 'none';
        }, 300);
    }, 2000);
}

// Header Scroll Effects
let lastScrollY = 0;
let isScrolling = false;
let scrollTimeout;

function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class for header styling
            if (currentScrollY > 100) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
            
            // Show/hide scroll to top button
            if (currentScrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
            
            // Parallax effect
            if (!prefersReducedMotion) {
                updateParallax(currentScrollY);
            }
            
            // Check visible sections for animations
            checkVisibleSections();
            
            lastScrollY = currentScrollY;
            isScrolling = false;
        });
        isScrolling = true;
    }
    
    // Clear and reset scroll timeout
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 100);
}

// Parallax Scrolling Effect
function updateParallax(scrollY) {
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
}

// Intersection Observer for Section Animations
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger any child animations
            const cards = entry.target.querySelectorAll('.feature-card, .service-item');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animationPlayState = 'running';
                }, index * 100);
            });
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

function checkVisibleSections() {
    contentSections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = mainHeader.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Smooth scroll to target
            smoothScrollTo(targetPosition, 800);
        }
    });
});

// Custom smooth scroll function
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const easeInOutCubic = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (timeElapsed < duration) {
            raf(animation);
        }
    }
    
    if (!prefersReducedMotion) {
        raf(animation);
    } else {
        window.scrollTo(0, targetPosition);
    }
}

// Hamburger Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate menu items
    const navItems = navMenu.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        if (navMenu.classList.contains('active')) {
            item.style.animation = `slideInFromLeft 0.3s ease-out ${index * 0.1}s both`;
        } else {
            item.style.animation = 'none';
        }
    });
});

// Scroll to Top Button
scrollToTopBtn.addEventListener('click', () => {
    smoothScrollTo(0, 800);
});

// Enhanced hover effects for touch devices
if ('ontouchstart' in window) {
    document.querySelectorAll('.feature-card, .service-item, .social-link').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-hover');
            }, 300);
        });
    });
}

// Performance optimization: Throttle scroll events
let scrollThrottle = false;
window.addEventListener('scroll', () => {
    if (!scrollThrottle) {
        scrollThrottle = true;
        setTimeout(() => {
            handleScroll();
            scrollThrottle = false;
        }, 16); // ~60fps
    }
});

// Resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reset mobile menu on desktop resize
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }, 250);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    // Tab navigation improvements
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse click
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Progressive Enhancement: Add animation classes only if JS is enabled
document.documentElement.classList.add('js-enabled');

// Preload critical animations
if ('IntersectionObserver' in window) {
    // Modern browser - use Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                imageObserver.unobserve(entry.target);
            }
        });
    });
    
    // Observe images for lazy loading animations
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize AOS-like animations for elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.dataset.animate;
                entry.target.classList.add('animated', animationType);
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Call initialization functions
window.addEventListener('load', () => {
    initScrollAnimations();
    
    // Add loaded class for CSS animations
    document.body.classList.add('loaded');
    
    // Initialize tooltips or other UI enhancements
    initializeUIEnhancements();
});

// UI Enhancement Functions
function initializeUIEnhancements() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhance form inputs with floating labels
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Performance monitoring (optional)
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            // Log slow animations for optimization
            if (entry.duration > 100) {
                console.warn('Slow animation detected:', entry.name, entry.duration);
            }
        }
    });
    
    // Observe animation performance
    perfObserver.observe({ entryTypes: ['measure'] });
}

// Export functions for external use
window.animationUtils = {
    smoothScrollTo,
    showSkeletonScreen,
    updateParallax
};