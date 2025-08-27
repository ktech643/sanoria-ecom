/**
 * Enhanced Video Animations with Container Color Integration
 * Advanced video effects synchronized with container colors
 */

$(document).ready(function() {
    'use strict';
    
    // =====================
    // ENHANCED VIDEO SYSTEM
    // =====================
    
    let videoSyncSystem = {
        containers: [],
        activeVideo: null,
        colorThemes: [
            { name: 'neon-orange', colors: ['#FF6B35', '#F7931E', '#FF8C00'] },
            { name: 'neon-blue', colors: ['#00D2FF', '#3A7BD5', '#00F5FF'] },
            { name: 'electric-pink', colors: ['#FF0080', '#FF8C00', '#FF1493'] },
            { name: 'cyber-green', colors: ['#32CD32', '#00FF7F', '#00E676'] },
            { name: 'neon-purple', colors: ['#8360C3', '#2EBAB0', '#8A2BE2'] }
        ],
        currentTheme: 0
    };
    
    // Initialize enhanced video system
    initEnhancedVideoSystem();
    createVideoContainerSync();
    addVideoTransitionEffects();
    createInteractiveVideoElements();
    initColorSynchronization();
    
    // =====================
    // ENHANCED VIDEO INITIALIZATION
    // =====================
    
    function initEnhancedVideoSystem() {
        console.log('🎬 Initializing Enhanced Video Animation System');
        
        // Create multiple video layers
        createVideoLayers();
        
        // Add video-container synchronization
        syncVideoWithContainers();
        
        // Create dynamic video overlays
        createDynamicVideoOverlays();
        
        // Initialize video transitions
        initVideoTransitions();
    }
    
    function createVideoLayers() {
        // Background video with enhanced effects
        const backgroundLayer = $(`
            <div class="enhanced-video-background">
                <video class="video-layer-1" autoplay muted loop playsinline>
                    <source src="videos/beauty-background-layer1.mp4" type="video/mp4">
                    <source src="videos/beauty-background-layer1.webm" type="video/webm">
                </video>
                <video class="video-layer-2" autoplay muted loop playsinline>
                    <source src="videos/beauty-background-layer2.mp4" type="video/mp4">
                    <source src="videos/beauty-background-layer2.webm" type="video/webm">
                </video>
                <div class="video-color-overlay"></div>
                <div class="video-particle-system"></div>
                <canvas class="video-blend-canvas" width="1920" height="1080"></canvas>
            </div>
        `);
        
        $('.video-background-container').append(backgroundLayer);
        
        // Initialize layered video effects
        initVideoLayerEffects();
    }
    
    function initVideoLayerEffects() {
        const canvas = $('.video-blend-canvas')[0];
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const video1 = $('.video-layer-1')[0];
        const video2 = $('.video-layer-2')[0];
        
        function blendVideos() {
            if (video1.readyState >= 2 && video2.readyState >= 2) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw first video layer
                ctx.globalAlpha = 0.7;
                ctx.drawImage(video1, 0, 0, canvas.width, canvas.height);
                
                // Blend second video layer
                ctx.globalCompositeOperation = 'multiply';
                ctx.globalAlpha = 0.5;
                ctx.drawImage(video2, 0, 0, canvas.width, canvas.height);
                
                // Add color theme overlay
                ctx.globalCompositeOperation = 'overlay';
                ctx.globalAlpha = 0.3;
                const theme = videoSyncSystem.colorThemes[videoSyncSystem.currentTheme];
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, theme.colors[0]);
                gradient.addColorStop(0.5, theme.colors[1]);
                gradient.addColorStop(1, theme.colors[2]);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Reset composite operation
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            }
            
            requestAnimationFrame(blendVideos);
        }
        
        // Add fallback for missing videos
        video1.onerror = video2.onerror = function() {
            createAnimatedCanvasBackground(canvas, ctx);
        };
        
        blendVideos();
    }
    
    function createAnimatedCanvasBackground(canvas, ctx) {
        let frame = 0;
        
        function animateBackground() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const theme = videoSyncSystem.colorThemes[videoSyncSystem.currentTheme];
            
            // Create flowing gradient
            const gradient = ctx.createLinearGradient(
                Math.sin(frame * 0.01) * canvas.width,
                Math.cos(frame * 0.01) * canvas.height,
                Math.cos(frame * 0.01) * canvas.width,
                Math.sin(frame * 0.01) * canvas.height
            );
            
            gradient.addColorStop(0, theme.colors[0] + '80');
            gradient.addColorStop(0.5, theme.colors[1] + '60');
            gradient.addColorStop(1, theme.colors[2] + '80');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add floating beauty particles
            for (let i = 0; i < 20; i++) {
                const x = (Math.sin(frame * 0.005 + i) * 300) + canvas.width / 2;
                const y = (Math.cos(frame * 0.007 + i * 0.3) * 200) + canvas.height / 2;
                const size = Math.sin(frame * 0.01 + i) * 8 + 12;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add sparkle center
                ctx.fillStyle = theme.colors[1];
                ctx.beginPath();
                ctx.arc(x, y, size / 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            frame++;
            requestAnimationFrame(animateBackground);
        }
        
        animateBackground();
    }
    
    // =====================
    // CONTAINER-VIDEO SYNCHRONIZATION
    // =====================
    
    function createVideoContainerSync() {
        // Sync container colors with video themes
        $('.container').each(function(index) {
            const container = $(this);
            const theme = videoSyncSystem.colorThemes[index % videoSyncSystem.colorThemes.length];
            
            // Add data attribute for theme
            container.attr('data-video-theme', theme.name);
            
            // Create color sync animation
            container.hover(
                function() {
                    syncContainerWithVideo($(this), theme);
                },
                function() {
                    resetContainerSync($(this));
                }
            );
        });
    }
    
    function syncContainerWithVideo(container, theme) {
        // Change video overlay to match container
        $('.video-color-overlay').css({
            background: `linear-gradient(45deg, ${theme.colors[0]}40, ${theme.colors[1]}30, ${theme.colors[2]}40)`,
            animation: 'colorSync 2s ease-in-out'
        });
        
        // Update foreground videos
        $('.video-foreground').each(function(index) {
            $(this).css({
                borderColor: theme.colors[index % theme.colors.length],
                boxShadow: `0 20px 40px ${theme.colors[index % theme.colors.length]}50`
            });
        });
        
        // Trigger video theme change
        changeVideoTheme(theme);
    }
    
    function resetContainerSync(container) {
        // Reset to default theme
        const defaultTheme = videoSyncSystem.colorThemes[0];
        changeVideoTheme(defaultTheme);
    }
    
    function changeVideoTheme(theme) {
        videoSyncSystem.currentTheme = videoSyncSystem.colorThemes.findIndex(t => t.name === theme.name);
        
        // Update particle colors
        updateParticleColors(theme);
        
        // Update video overlays
        updateVideoOverlays(theme);
        
        // Trigger container color changes
        updateContainerColors(theme);
    }
    
    // =====================
    // ENHANCED FOREGROUND VIDEOS
    // =====================
    
    function createInteractiveVideoElements() {
        const videoConfigs = [
            { 
                id: 'beauty-tutorial-1', 
                title: 'Skincare Routine', 
                icon: '🔥',
                position: { top: '15%', right: '5%' },
                size: { width: '320px', height: '240px' },
                theme: 'neon-orange'
            },
            { 
                id: 'beauty-tutorial-2', 
                title: 'Makeup Application', 
                icon: '💧',
                position: { bottom: '15%', left: '5%' },
                size: { width: '280px', height: '210px' },
                theme: 'neon-blue'
            },
            { 
                id: 'beauty-tutorial-3', 
                title: 'Product Showcase', 
                icon: '⚡',
                position: { top: '45%', right: '10%' },
                size: { width: '240px', height: '180px' },
                theme: 'electric-pink'
            },
            { 
                id: 'beauty-tutorial-4', 
                title: 'Beauty Tips', 
                icon: '🌿',
                position: { bottom: '45%', left: '10%' },
                size: { width: '200px', height: '150px' },
                theme: 'cyber-green'
            },
            { 
                id: 'beauty-tutorial-5', 
                title: 'Trending Looks', 
                icon: '🔮',
                position: { top: '25%', left: '50%' },
                size: { width: '260px', height: '195px' },
                theme: 'neon-purple'
            }
        ];
        
        videoConfigs.forEach((config, index) => {
            setTimeout(() => {
                createEnhancedVideoElement(config, index);
            }, index * 800);
        });
    }
    
    function createEnhancedVideoElement(config, index) {
        const theme = videoSyncSystem.colorThemes.find(t => t.name === config.theme);
        
        const videoElement = $(`
            <div class="enhanced-video-foreground" id="${config.id}" style="
                position: fixed;
                top: ${config.position.top || 'auto'};
                bottom: ${config.position.bottom || 'auto'};
                left: ${config.position.left || 'auto'};
                right: ${config.position.right || 'auto'};
                width: ${config.size.width};
                height: ${config.size.height};
                z-index: 1000;
                pointer-events: auto;
            ">
                <div class="video-container-enhanced">
                    <video autoplay muted loop playsinline>
                        <source src="videos/beauty-enhanced-${index + 1}.mp4" type="video/mp4">
                        <source src="videos/beauty-enhanced-${index + 1}.webm" type="video/webm">
                    </video>
                    <div class="video-fallback-enhanced">
                        <div class="fallback-content">
                            <div class="fallback-icon">${config.icon}</div>
                            <div class="fallback-title">${config.title}</div>
                            <div class="fallback-subtitle">Beauty Animation</div>
                        </div>
                    </div>
                    <div class="video-controls-enhanced">
                        <button class="video-btn-play"><i class="fas fa-play"></i></button>
                        <button class="video-btn-fullscreen"><i class="fas fa-expand"></i></button>
                        <button class="video-btn-theme"><i class="fas fa-palette"></i></button>
                    </div>
                    <div class="video-info-overlay">
                        <div class="video-title">${config.title}</div>
                        <div class="video-icon">${config.icon}</div>
                    </div>
                    <div class="video-progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <canvas class="video-effect-canvas" width="320" height="240"></canvas>
                    <div class="video-particle-container"></div>
                </div>
            </div>
        `);
        
        $('body').append(videoElement);
        
        // Style the video container with theme colors
        const container = videoElement.find('.video-container-enhanced');
        container.css({
            background: `linear-gradient(135deg, ${theme.colors[0]}20, ${theme.colors[1]}15, ${theme.colors[2]}20)`,
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            height: '100%',
            border: `2px solid ${theme.colors[1]}60`,
            boxShadow: `0 15px 35px ${theme.colors[0]}40`,
            backdropFilter: 'blur(10px)'
        });
        
        // Initialize video interactions
        initVideoInteractions(videoElement, config, theme);
        
        // Add floating animation
        videoElement.css({
            animation: `floatVideo${index + 1} ${8 + index * 2}s ease-in-out infinite`
        });
        
        // Initialize particle effects
        createVideoParticleEffects(videoElement, theme);
        
        // Handle video loading
        const video = videoElement.find('video')[0];
        video.onerror = function() {
            videoElement.find('video').hide();
            videoElement.find('.video-fallback-enhanced').show();
        };
    }
    
    // =====================
    // VIDEO INTERACTIONS
    // =====================
    
    function initVideoInteractions(videoElement, config, theme) {
        const video = videoElement.find('video')[0];
        const playBtn = videoElement.find('.video-btn-play');
        const fullscreenBtn = videoElement.find('.video-btn-fullscreen');
        const themeBtn = videoElement.find('.video-btn-theme');
        
        // Play/Pause functionality
        playBtn.on('click', function() {
            if (video.paused) {
                video.play();
                $(this).find('i').removeClass('fa-play').addClass('fa-pause');
            } else {
                video.pause();
                $(this).find('i').removeClass('fa-pause').addClass('fa-play');
            }
        });
        
        // Fullscreen functionality
        fullscreenBtn.on('click', function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        });
        
        // Theme change functionality
        themeBtn.on('click', function() {
            cycleVideoTheme(videoElement, config);
        });
        
        // Hover effects
        videoElement.hover(
            function() {
                $(this).css({
                    transform: 'scale(1.05)',
                    zIndex: 1001
                });
                createHoverParticles($(this), theme);
            },
            function() {
                $(this).css({
                    transform: 'scale(1)',
                    zIndex: 1000
                });
            }
        );
        
        // Video progress tracking
        if (video) {
            video.addEventListener('timeupdate', function() {
                const progress = (video.currentTime / video.duration) * 100;
                videoElement.find('.progress-fill').css('width', progress + '%');
            });
        }
    }
    
    function cycleVideoTheme(videoElement, config) {
        const currentThemeIndex = videoSyncSystem.colorThemes.findIndex(t => t.name === config.theme);
        const nextThemeIndex = (currentThemeIndex + 1) % videoSyncSystem.colorThemes.length;
        const newTheme = videoSyncSystem.colorThemes[nextThemeIndex];
        
        config.theme = newTheme.name;
        
        // Animate theme change
        const container = videoElement.find('.video-container-enhanced');
        container.css({
            background: `linear-gradient(135deg, ${newTheme.colors[0]}20, ${newTheme.colors[1]}15, ${newTheme.colors[2]}20)`,
            borderColor: `${newTheme.colors[1]}60`,
            boxShadow: `0 15px 35px ${newTheme.colors[0]}40`
        });
        
        // Update particle colors
        updateVideoParticles(videoElement, newTheme);
    }
    
    // =====================
    // PARTICLE SYSTEMS
    // =====================
    
    function createVideoParticleEffects(videoElement, theme) {
        const particleContainer = videoElement.find('.video-particle-container');
        
        // Create floating beauty particles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createBeautyParticle(particleContainer, theme, i);
            }, i * 300);
        }
        
        // Continuous particle generation
        setInterval(() => {
            if (Math.random() > 0.7 && particleContainer.find('.beauty-particle').length < 8) {
                createBeautyParticle(particleContainer, theme, Math.random() * 10);
            }
        }, 2000);
    }
    
    function createBeautyParticle(container, theme, index) {
        const particles = ['✨', '💎', '🌟', '💫', '⭐'];
        const particle = $(`<div class="beauty-particle">${particles[index % particles.length]}</div>`);
        
        particle.css({
            position: 'absolute',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            fontSize: Math.random() * 8 + 12 + 'px',
            color: theme.colors[Math.floor(Math.random() * theme.colors.length)],
            pointerEvents: 'none',
            zIndex: 10,
            textShadow: `0 0 10px ${theme.colors[1]}`,
            animation: `beautyParticleFloat ${3 + Math.random() * 2}s ease-in-out infinite`
        });
        
        container.append(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }
    
    function createHoverParticles(videoElement, theme) {
        const particleContainer = videoElement.find('.video-particle-container');
        
        for (let i = 0; i < 3; i++) {
            const particle = $('<div class="hover-particle">✨</div>');
            
            particle.css({
                position: 'absolute',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                fontSize: '16px',
                color: theme.colors[i % theme.colors.length],
                pointerEvents: 'none',
                zIndex: 15,
                animation: 'hoverParticleExplode 1s ease-out forwards'
            });
            
            particleContainer.append(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    // =====================
    // ENHANCED TRANSITIONS
    // =====================
    
    function addVideoTransitionEffects() {
        // Scene transition effects
        createSceneTransitions();
        
        // Color transition effects
        createColorTransitions();
        
        // Container morph effects
        createContainerMorphEffects();
    }
    
    function createSceneTransitions() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                triggerSceneTransition();
            }
        }, 10000);
    }
    
    function triggerSceneTransition() {
        const transition = $('<div class="scene-transition"></div>');
        
        transition.css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
            zIndex: 9999,
            pointerEvents: 'none',
            transform: 'translateX(-100%)',
            animation: 'sceneWipe 2s ease-in-out'
        });
        
        $('body').append(transition);
        
        setTimeout(() => {
            transition.remove();
        }, 2000);
    }
    
    // =====================
    // COLOR SYNCHRONIZATION
    // =====================
    
    function initColorSynchronization() {
        // Sync container colors with video themes
        $(window).scroll(function() {
            const scrollPercent = $(window).scrollTop() / ($(document).height() - $(window).height());
            const themeIndex = Math.floor(scrollPercent * videoSyncSystem.colorThemes.length);
            
            if (themeIndex !== videoSyncSystem.currentTheme && themeIndex < videoSyncSystem.colorThemes.length) {
                const newTheme = videoSyncSystem.colorThemes[themeIndex];
                changeVideoTheme(newTheme);
            }
        });
    }
    
    function updateParticleColors(theme) {
        $('.beauty-particle').each(function() {
            $(this).css({
                color: theme.colors[Math.floor(Math.random() * theme.colors.length)],
                textShadow: `0 0 10px ${theme.colors[1]}`
            });
        });
    }
    
    function updateVideoOverlays(theme) {
        $('.video-color-overlay').css({
            background: `linear-gradient(45deg, ${theme.colors[0]}30, ${theme.colors[1]}20, ${theme.colors[2]}30)`
        });
    }
    
    function updateContainerColors(theme) {
        $('.container[data-video-theme]').each(function() {
            const container = $(this);
            container.css({
                background: `linear-gradient(135deg, ${theme.colors[0]}10, ${theme.colors[1]}05, ${theme.colors[2]}10)`,
                borderColor: `${theme.colors[1]}30`
            });
        });
    }
    
    function updateVideoParticles(videoElement, theme) {
        videoElement.find('.beauty-particle').each(function() {
            $(this).css({
                color: theme.colors[Math.floor(Math.random() * theme.colors.length)],
                textShadow: `0 0 10px ${theme.colors[1]}`
            });
        });
    }
    
    // =====================
    // PUBLIC API
    // =====================
    
    window.enhancedVideoAnimations = {
        changeTheme: changeVideoTheme,
        syncColors: initColorSynchronization,
        createParticles: createVideoParticleEffects,
        getThemes: () => videoSyncSystem.colorThemes,
        getCurrentTheme: () => videoSyncSystem.colorThemes[videoSyncSystem.currentTheme]
    };
    
});

// =====================
// ADDITIONAL CSS ANIMATIONS
// =====================

$('<style>').text(`
    @keyframes colorSync {
        0% { opacity: 0.3; }
        50% { opacity: 0.7; }
        100% { opacity: 0.5; }
    }
    
    @keyframes sceneWipe {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes beautyParticleFloat {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        100% { transform: translateY(-40px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes hoverParticleExplode {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        100% { transform: scale(2) rotate(360deg); opacity: 0; }
    }
    
    .enhanced-video-foreground {
        transition: all 0.3s ease;
    }
    
    .video-container-enhanced {
        transition: all 0.5s ease;
        position: relative;
    }
    
    .video-controls-enhanced {
        position: absolute;
        bottom: 10px;
        right: 10px;
        display: flex;
        gap: 5px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .enhanced-video-foreground:hover .video-controls-enhanced {
        opacity: 1;
    }
    
    .video-controls-enhanced button {
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .video-controls-enhanced button:hover {
        background: rgba(255, 0, 102, 0.9);
        color: white;
        transform: scale(1.1);
    }
    
    .video-info-overlay {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .video-progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #FF0066, #FF3385);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .video-fallback-enhanced {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
    }
    
    .fallback-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
    
    .fallback-title {
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .fallback-subtitle {
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    @media (max-width: 768px) {
        .enhanced-video-foreground {
            display: none !important;
        }
    }
`).appendTo('head');