// Advanced CSS and JavaScript Animations
// Enhanced user experience with performant animations

class AnimationController {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    init() {
        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Performance optimization
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        
        // Throttle and debounce utilities
        this.throttle = this.createThrottle();
        this.debounce = this.createDebounce();
        
        // Animation frame request ID for cleanup
        this.animationFrameId = null;
        
        // Intersection Observer for scroll animations
        this.setupIntersectionObserver();
        
        // Loading state management
        this.loadingComplete = false;
    }

    createThrottle() {
        return (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
    }

    createDebounce() {
        return (func, wait, immediate) => {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    }

    setupEventListeners() {
        // Loading animations
        window.addEventListener('load', () => this.handlePageLoad());
        
        // Scroll events with throttling for performance
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
            this.updateParallax();
            this.updateProgressBar();
        }, 16)); // ~60fps
        
        // Resize events with debouncing
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                this.toggleNavigation(navToggle, navMenu);
            });
        }
        
        // Smooth scrolling for navigation links
        this.setupSmoothScrolling();
        
        // Scroll to top button
        this.setupScrollToTop();
        
        // Form animations
        this.setupFormAnimations();
        
        // Hover animations for interactive elements
        this.setupHoverAnimations();
    }

    handlePageLoad() {
        // Simulate loading time for demonstration
        setTimeout(() => {
            this.hideLoadingScreen();
            this.loadingComplete = true;
            this.animatePageEntrance();
        }, 2000);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const skeletonContainer = document.getElementById('skeleton-container');
        
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (skeletonContainer) {
            skeletonContainer.style.opacity = '0';
            setTimeout(() => {
                skeletonContainer.style.display = 'none';
            }, 300);
        }
    }

    animatePageEntrance() {
        // Stagger animation of main content sections
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleScroll() {
        if (!this.loadingComplete) return;
        
        const scrolled = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        
        // Navbar scroll effect
        if (navbar) {
            if (scrolled > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Scroll to top button visibility
        if (scrollToTopBtn) {
            if (scrolled > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateParallax() {
        if (this.prefersReducedMotion) return;
        
        const parallaxBg = document.getElementById('parallax-bg');
        if (!parallaxBg) return;
        
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        // Use transform3d for hardware acceleration
        parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
    }

    updateProgressBar() {
        // Optional: Add a reading progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // You can add a progress bar element and update it here
        document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation data attributes
        const animateElements = document.querySelectorAll('[data-animation]');
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        if (this.prefersReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }
        
        const animationType = element.getAttribute('data-animation');
        element.classList.add('animated');
        
        // Add specific animation class based on data attribute
        if (animationType) {
            element.classList.add(animationType);
        }
        
        // Unobserve after animation to improve performance
        this.observer.unobserve(element);
    }

    toggleNavigation(toggle, menu) {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        
        // Prevent body scroll when mobile menu is open
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // Add smooth animation
        if (!this.prefersReducedMotion) {
            toggle.style.transform = toggle.classList.contains('active') 
                ? 'rotate(90deg)' 
                : 'rotate(0deg)';
        }
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    const navToggle = document.getElementById('nav-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    // Smooth scroll with easing
                    this.smoothScrollTo(offsetPosition, 800);
                }
            });
        });
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const easeInOutQuart = (t) => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        };
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuart(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                this.animationFrameId = requestAnimationFrame(animation);
            }
        };
        
        this.animationFrameId = requestAnimationFrame(animation);
    }

    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                this.smoothScrollTo(0, 600);
            });
        }
    }

    setupFormAnimations() {
        const formInputs = document.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // Focus animations
            input.addEventListener('focus', () => {
                if (!this.prefersReducedMotion) {
                    input.style.transform = 'scale(1.02)';
                    input.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
                }
            });
            
            input.addEventListener('blur', () => {
                if (!this.prefersReducedMotion) {
                    input.style.transform = 'scale(1)';
                    input.style.boxShadow = '';
                }
            });
            
            // Label animation for floating labels (if implemented)
            input.addEventListener('input', () => {
                if (input.value.length > 0) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
        
        // Form submission animation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.animateFormSubmission(form);
            });
        });
    }

    animateFormSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        
        // Add loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        if (!this.prefersReducedMotion) {
            submitBtn.style.transform = 'scale(0.95)';
        }
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitBtn.style.background = '#28a745';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.transform = '';
                form.reset();
            }, 2000);
        }, 1500);
    }

    setupHoverAnimations() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (!this.prefersReducedMotion && !this.isIOS) {
                    this.createRippleEffect(btn);
                }
            });
        });
        
        // Card hover effects
        const cards = document.querySelectorAll('.feature-card, .service-item, .portfolio-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.prefersReducedMotion) {
                    this.animateCardHover(card, true);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.prefersReducedMotion) {
                    this.animateCardHover(card, false);
                }
            });
        });
        
        // Social media icons special effects
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!this.prefersReducedMotion) {
                    this.animateSocialIcon(link);
                }
            });
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        // Ensure button has relative positioning
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Add CSS animation if not already present
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    animateCardHover(card, isEntering) {
        const scale = isEntering ? 'scale(1.05)' : 'scale(1)';
        const shadow = isEntering ? '0 20px 60px rgba(0, 0, 0, 0.15)' : '';
        
        card.style.transform = scale;
        card.style.boxShadow = shadow;
        
        // Animate inner elements
        const icon = card.querySelector('.feature-icon, .service-icon');
        if (icon) {
            icon.style.transform = isEntering ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)';
        }
    }

    animateSocialIcon(icon) {
        // Create floating particles effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createFloatingParticle(icon);
            }, i * 100);
        }
    }

    createFloatingParticle(parent) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#667eea';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const rect = parent.getBoundingClientRect();
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }

    handleResize() {
        // Recalculate animation parameters on resize
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Reset any size-dependent animations
        this.debounce(() => {
            this.updateParallax();
        }, 100)();
    }

    // Performance monitoring
    initializeAnimations() {
        // Only run advanced animations on capable devices
        if (this.isLowEndDevice()) {
            document.body.classList.add('reduced-animations');
            return;
        }
        
        // Initialize advanced features
        this.initFloatingElements();
        this.initParticleSystem();
    }

    isLowEndDevice() {
        // Simple heuristic for low-end device detection
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowConnection = connection && connection.effectiveType && 
                              (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        
        const limitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const limitedCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        return slowConnection || limitedMemory || limitedCores;
    }

    initFloatingElements() {
        // Add subtle floating animation to hero elements
        const floatingElements = document.querySelectorAll('.floating-card, .hero-image');
        
        floatingElements.forEach((element, index) => {
            if (!this.prefersReducedMotion) {
                element.style.animationDelay = `${index * 0.5}s`;
                element.style.animationDuration = `${6 + index}s`;
            }
        });
    }

    initParticleSystem() {
        // Optional: Advanced particle system for hero section
        if (this.prefersReducedMotion || this.isLowEndDevice()) return;
        
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        // Create subtle floating particles
        setInterval(() => {
            if (document.hidden) return; // Don't animate when tab is not visible
            
            this.createHeroParticle(hero);
        }, 3000);
    }

    createHeroParticle(container) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        
        const startX = Math.random() * container.offsetWidth;
        const startY = container.offsetHeight;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        container.appendChild(particle);
        
        // Animate upward float
        particle.animate([
            {
                transform: 'translateY(0) scale(1)',
                opacity: 0
            },
            {
                transform: 'translateY(-100px) scale(1.5)',
                opacity: 0.8
            },
            {
                transform: 'translateY(-200px) scale(0)',
                opacity: 0
            }
        ], {
            duration: 8000,
            easing: 'linear'
        }).onfinish = () => {
            particle.remove();
        };
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize the animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Make it globally accessible for debugging
    window.animationController = animationController;
});

// Handle visibility change to pause animations when tab is not active
document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    
    animatedElements.forEach(element => {
        if (isHidden) {
            element.style.animationPlayState = 'paused';
        } else {
            element.style.animationPlayState = 'running';
        }
    });
});

// Additional utility functions for advanced animations
const AnimationUtils = {
    // Easing functions
    easing: {
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    
    // Create custom animations
    animate: (element, properties, duration = 300, easing = 'easeInOutQuad') => {
        const start = performance.now();
        const initialValues = {};
        
        // Get initial values
        Object.keys(properties).forEach(prop => {
            initialValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
        });
        
        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const easedProgress = AnimationUtils.easing[easing](progress);
            
            Object.keys(properties).forEach(prop => {
                const initial = initialValues[prop];
                const target = properties[prop];
                const current = initial + (target - initial) * easedProgress;
                
                if (prop === 'opacity') {
                    element.style[prop] = current;
                } else if (prop.includes('transform')) {
                    element.style.transform = `${prop}(${current}px)`;
                } else {
                    element.style[prop] = current + 'px';
                }
            });
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, AnimationUtils };
}