/**
 * Video Animations Controller
 * Background and Foreground Video Effects for Sanoria.pk
 */

$(document).ready(function() {
    'use strict';
    
    // =====================
    // GLOBAL VARIABLES
    // =====================
    
    let isVideoSupported = true;
    let backgroundVideo = null;
    let foregroundVideos = [];
    let isLowPerformanceMode = false;
    
    // =====================
    // INITIALIZATION
    // =====================
    
    try {
        detectPerformanceMode();
        initializeVideoBackground();
        initializeForegroundVideos();
        initializeVideoParticles();
        initializeVideoControls();
        initializeBeautyEffects();
        handleVideoErrors();
    } catch (error) {
        console.warn('Video animation initialization error:', error);
        enableFallbackMode();
    }
    
    // =====================
    // PERFORMANCE DETECTION
    // =====================
    
    function detectPerformanceMode() {
        // Check device performance indicators
        const isMobile = window.innerWidth < 768;
        const isSlowConnection = navigator.connection && navigator.connection.effectiveType.includes('2g');
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        isLowPerformanceMode = isMobile || isSlowConnection || isLowEndDevice;
        
        if (isLowPerformanceMode) {
            console.log('Low performance mode enabled');
            $('body').addClass('low-performance-mode');
        }
    }
    
    // =====================
    // VIDEO BACKGROUND
    // =====================
    
    function initializeVideoBackground() {
        if (isLowPerformanceMode) {
            createStaticBackground();
            return;
        }
        
        // Create video background container
        const videoContainer = $(`
            <div class="video-background-container">
                <div class="video-mesh-bg"></div>
                <video class="video-background" autoplay muted loop playsinline>
                    <source src="videos/beauty-background.mp4" type="video/mp4">
                    <source src="videos/beauty-background.webm" type="video/webm">
                </video>
                <div class="video-overlay"></div>
                <div class="video-particles-overlay"></div>
                <div class="video-loading"></div>
            </div>
        `);
        
        $('body').prepend(videoContainer);
        
        backgroundVideo = $('.video-background')[0];
        
        // Handle video events
        $(backgroundVideo).on('loadstart', function() {
            console.log('Background video loading started');
        }).on('canplay', function() {
            console.log('Background video ready to play');
            $('.video-background-container').addClass('video-loaded');
            createVideoParticles();
        }).on('error', function() {
            console.warn('Background video failed to load');
            createStaticBackground();
        });
        
        // Fallback for missing video files
        setTimeout(() => {
            if (backgroundVideo.readyState === 0) {
                console.warn('Video not loading, using animated gradient background');
                createAnimatedGradientBackground();
            }
        }, 3000);
    }
    
    function createStaticBackground() {
        const staticBg = $(`
            <div class="video-background-container">
                <div class="video-mesh-bg"></div>
                <div class="animated-gradient-bg"></div>
                <div class="video-overlay"></div>
            </div>
        `);
        
        $('body').prepend(staticBg);
        
        // Add animated gradient CSS
        $('<style>').text(`
            .animated-gradient-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, 
                    #FF0066 0%, 
                    #FF3385 25%, 
                    #FF66B3 50%, 
                    #FF0066 75%, 
                    #FF3385 100%);
                background-size: 400% 400%;
                animation: gradientShift 15s ease infinite;
            }
        `).appendTo('head');
    }
    
    function createAnimatedGradientBackground() {
        $('.video-background').hide();
        createStaticBackground();
    }
    
    // =====================
    // FOREGROUND VIDEOS
    // =====================
    
    function initializeForegroundVideos() {
        if (isLowPerformanceMode) {
            console.log('Skipping foreground videos in low performance mode');
            return;
        }
        
        const foregroundVideoData = [
            {
                id: 'video-floating-1',
                class: 'video-floating-1',
                title: 'Skincare Routine',
                icon: '✨'
            },
            {
                id: 'video-floating-2',
                class: 'video-floating-2',
                title: 'Beauty Tips',
                icon: '💄'
            },
            {
                id: 'video-floating-3',
                class: 'video-floating-3',
                title: 'Product Demo',
                icon: '🌟'
            }
        ];
        
        foregroundVideoData.forEach((videoData, index) => {
            setTimeout(() => {
                createForegroundVideo(videoData, index);
            }, index * 1000);
        });
    }
    
    function createForegroundVideo(videoData, index) {
        const videoElement = $(`
            <div class="video-foreground ${videoData.class} video-foreground-container" id="${videoData.id}">
                <video autoplay muted loop playsinline>
                    <source src="videos/beauty-demo-${index + 1}.mp4" type="video/mp4">
                    <source src="videos/beauty-demo-${index + 1}.webm" type="video/webm">
                </video>
                <div class="video-control-overlay">
                    <button class="video-play-btn" onclick="toggleVideo('${videoData.id}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="video-interactive-overlay">${videoData.title}</div>
                <div class="video-beauty-effect">${videoData.icon}</div>
                <div class="beauty-sparkle-effect"></div>
                <div class="skincare-glow-effect"></div>
                <canvas class="canvas-video-effect" width="300" height="200"></canvas>
                <div class="video-loading"></div>
            </div>
        `);
        
        $('body').append(videoElement);
        
        const video = videoElement.find('video')[0];
        foregroundVideos.push(video);
        
        // Handle video events
        $(video).on('canplay', function() {
            videoElement.addClass('video-loaded');
            initializeCanvasEffect(videoElement.find('.canvas-video-effect')[0], video);
        }).on('error', function() {
            console.warn(`Foreground video ${index + 1} failed to load`);
            createFallbackVideoElement(videoElement, videoData);
        });
        
        // Add sparkle effects
        setTimeout(() => {
            addSparkleEffects(videoElement);
        }, 500);
        
        // Fallback for missing video
        setTimeout(() => {
            if (video.readyState === 0) {
                createFallbackVideoElement(videoElement, videoData);
            }
        }, 2000);
    }
    
    function createFallbackVideoElement(container, videoData) {
        const fallback = $(`
            <div class="video-fallback" style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #FF0066, #FF3385);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                border-radius: 18px;
            ">
                <div style="font-size: 2rem; margin-bottom: 10px;">${videoData.icon}</div>
                <div style="font-weight: bold;">${videoData.title}</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">Beauty Animation</div>
            </div>
        `);
        
        container.find('video').replaceWith(fallback);
        container.addClass('video-loaded');
    }
    
    // =====================
    // VIDEO PARTICLES
    // =====================
    
    function createVideoParticles() {
        const particleContainer = $('.video-particles-overlay');
        if (particleContainer.length === 0) return;
        
        const particleCount = isLowPerformanceMode ? 5 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                createSingleParticle(particleContainer);
            }, i * 200);
        }
        
        // Continuously create particles
        setInterval(() => {
            if (Math.random() > 0.7) {
                createSingleParticle(particleContainer);
            }
        }, 2000);
    }
    
    function createSingleParticle(container) {
        const particle = $('<div class="video-particle"></div>');
        
        particle.css({
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 5 + 's',
            animationDuration: (Math.random() * 10 + 10) + 's'
        });
        
        container.append(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 20000);
    }
    
    function initializeVideoParticles() {
        // Initialize particle system if not in low performance mode
        if (!isLowPerformanceMode) {
            setTimeout(createVideoParticles, 1000);
        }
    }
    
    // =====================
    // CANVAS EFFECTS
    // =====================
    
    function initializeCanvasEffect(canvas, video) {
        if (!canvas || !video || isLowPerformanceMode) return;
        
        const ctx = canvas.getContext('2d');
        let animationId;
        
        function drawVideoEffect() {
            if (video.readyState >= 2) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Create a subtle video overlay effect
                ctx.globalAlpha = 0.1;
                ctx.fillStyle = '#FF0066';
                
                // Create floating beauty particles
                for (let i = 0; i < 5; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = Math.random() * 4 + 2;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.globalAlpha = 1;
            }
            
            animationId = requestAnimationFrame(drawVideoEffect);
        }
        
        drawVideoEffect();
        
        // Cleanup on element removal
        $(canvas).closest('.video-foreground').on('remove', function() {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }
    
    // =====================
    // VIDEO CONTROLS
    // =====================
    
    function initializeVideoControls() {
        // Add play/pause functionality
        $('.video-foreground').on('click', function(e) {
            if ($(e.target).hasClass('video-play-btn') || $(e.target).parent().hasClass('video-play-btn')) {
                const video = $(this).find('video')[0];
                toggleVideoPlayback(video, $(this));
            }
        });
        
        // Add hover effects
        $('.video-foreground').hover(
            function() {
                $(this).addClass('video-hovered');
                addHoverEffects($(this));
            },
            function() {
                $(this).removeClass('video-hovered');
            }
        );
    }
    
    function toggleVideoPlayback(video, container) {
        if (!video) return;
        
        const playBtn = container.find('.video-play-btn i');
        
        if (video.paused) {
            video.play();
            playBtn.removeClass('fa-play').addClass('fa-pause');
        } else {
            video.pause();
            playBtn.removeClass('fa-pause').addClass('fa-play');
        }
    }
    
    function addHoverEffects(container) {
        // Add temporary sparkle on hover
        const sparkleCount = 3;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = $('<div class="beauty-sparkle">✨</div>');
            
            sparkle.css({
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 1 + 's'
            });
            
            container.find('.beauty-sparkle-effect').append(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 4000);
        }
    }
    
    // =====================
    // BEAUTY EFFECTS
    // =====================
    
    function initializeBeautyEffects() {
        // Add beauty-specific animations and effects
        addBeautyTransitions();
        initializeProductShowcase();
    }
    
    function addBeautyTransitions() {
        // Create smooth transitions for beauty content
        $(window).scroll(function() {
            const scrollTop = $(this).scrollTop();
            
            $('.video-foreground').each(function() {
                const $this = $(this);
                const elementTop = $this.offset().top;
                const elementHeight = $this.outerHeight();
                const windowHeight = $(window).height();
                
                if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
                    $this.addClass('in-viewport');
                } else {
                    $this.removeClass('in-viewport');
                }
            });
        });
    }
    
    function initializeProductShowcase() {
        // Add product showcase video effects
        setTimeout(() => {
            if ($('.product-showcase-video').length === 0) {
                createProductShowcaseVideos();
            }
        }, 2000);
    }
    
    function createProductShowcaseVideos() {
        const showcaseContainer = $(`
            <div class="product-showcase-container" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                pointer-events: none;
            ">
                <div class="product-showcase-video" style="
                    width: 150px;
                    height: 100px;
                    margin-bottom: 10px;
                    pointer-events: auto;
                ">
                    <div class="product-video-fallback" style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #FF0066, #FF3385);
                        border-radius: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 0.8rem;
                        text-align: center;
                    ">
                        🌟<br>New Products
                    </div>
                    <div class="product-video-overlay"></div>
                </div>
            </div>
        `);
        
        if (window.innerWidth > 768) {
            $('body').append(showcaseContainer);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                showcaseContainer.fadeOut();
            }, 10000);
        }
    }
    
    function addSparkleEffects(container) {
        const sparkleContainer = container.find('.beauty-sparkle-effect');
        
        // Create initial sparkles
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = $('<div class="beauty-sparkle">✨</div>');
                
                sparkle.css({
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 2 + 's'
                });
                
                sparkleContainer.append(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 4000);
            }, i * 500);
        }
        
        // Continuously add sparkles
        setInterval(() => {
            if (Math.random() > 0.8 && sparkleContainer.find('.beauty-sparkle').length < 5) {
                const sparkle = $('<div class="beauty-sparkle">✨</div>');
                
                sparkle.css({
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%'
                });
                
                sparkleContainer.append(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 4000);
            }
        }, 3000);
    }
    
    // =====================
    // ERROR HANDLING
    // =====================
    
    function handleVideoErrors() {
        // Global video error handler
        $(document).on('error', 'video', function() {
            console.warn('Video error detected, enabling fallback mode');
            const container = $(this).closest('.video-foreground, .video-background-container');
            enableVideoFallback(container);
        });
    }
    
    function enableVideoFallback(container) {
        if (container.hasClass('video-background-container')) {
            createAnimatedGradientBackground();
        } else {
            const videoData = {
                title: 'Beauty Animation',
                icon: '✨'
            };
            createFallbackVideoElement(container, videoData);
        }
    }
    
    function enableFallbackMode() {
        console.log('Enabling complete fallback mode');
        isVideoSupported = false;
        
        // Remove all video elements
        $('.video-background-container').remove();
        $('.video-foreground').remove();
        
        // Create static background
        createStaticBackground();
        
        // Add basic beauty effects
        $('body').addClass('fallback-mode');
    }
    
    // =====================
    // PUBLIC FUNCTIONS
    // =====================
    
    // Make functions globally available
    window.toggleVideo = function(videoId) {
        const container = $('#' + videoId);
        const video = container.find('video')[0];
        
        if (video) {
            toggleVideoPlayback(video, container);
        }
    };
    
    window.videoAnimations = {
        isSupported: () => isVideoSupported,
        isLowPerformance: () => isLowPerformanceMode,
        createSparkles: addSparkleEffects,
        toggleAllVideos: function(play) {
            foregroundVideos.forEach(video => {
                if (play) {
                    video.play();
                } else {
                    video.pause();
                }
            });
            
            if (backgroundVideo) {
                if (play) {
                    backgroundVideo.play();
                } else {
                    backgroundVideo.pause();
                }
            }
        }
    };
    
    // =====================
    // CLEANUP
    // =====================
    
    $(window).on('beforeunload', function() {
        // Cleanup videos
        foregroundVideos.forEach(video => {
            if (video) {
                video.pause();
                video.src = '';
            }
        });
        
        if (backgroundVideo) {
            backgroundVideo.pause();
            backgroundVideo.src = '';
        }
    });
    
});

// =====================
// ADDITIONAL CSS ADDITIONS
// =====================

$('<style>').text(`
    .low-performance-mode .video-foreground {
        display: none !important;
    }
    
    .fallback-mode {
        background: linear-gradient(135deg, #FF0066, #FF3385) !important;
    }
    
    .video-foreground.in-viewport {
        animation: videoFadeIn 1s ease-out;
    }
    
    @keyframes videoFadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .video-hovered {
        z-index: 1001 !important;
    }
    
    @media (max-width: 768px) {
        .video-foreground,
        .product-showcase-container {
            display: none !important;
        }
    }
`).appendTo('head');