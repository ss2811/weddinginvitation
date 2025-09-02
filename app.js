// Enhanced Wedding Invitation JavaScript - Full Animation Version
// PENTING: Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Global variables
let currentSession = 0;
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;
let swiper;
let particleSystem;
let isTransitioning = false;

// Touch/Swipe variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwipeEnabled = true;

// Animation variables
let animationQueue = [];
let isAnimating = false;

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyAbT55NRUO49GQnhN-Uf_yONSpTQBJUgqU",
    authDomain: "weddinginvitationss.firebaseapp.com",
    projectId: "weddinginvitationss",
    storageBucket: "weddinginvitationss.appspot.com",
    messagingSenderId: "348557007083",
    appId: "1:348557007083:web:c966107d29e0dcfcbe86ae"
};

// Inisialisasi Firebase
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    backgroundMusic = document.getElementById('backgroundMusic');
    setupSwipeNavigation();
    setupActionButtons();
    startCountdown();
    loadGuestMessages();
    showMusicEnableButton();
    initParticleSystem();
    initFloatingElements();
    setupSectionAnimations();
    
    // Start from session 0
    showSession(0);
    
    // Add loading animation
    addLoadingAnimation();
}

// ==========================================
// ENHANCED SWIPE NAVIGATION SYSTEM
// ==========================================

function setupSwipeNavigation() {
    const container = document.querySelector('.sessions-container');
    if (!container) return;
    
    // Remove arrow navigation since we're replacing it with swipe
    const arrows = document.querySelector('.nav-arrows');
    if (arrows) arrows.remove();
    
    // Add touch event listeners for swipe detection
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Add mouse support for desktop
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseEnd);
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Setup dots navigation with enhanced animations
    setupDotsNavigation();
}

function handleTouchStart(e) {
    if (!isSwipeEnabled || isTransitioning) return;
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!isSwipeEnabled || isTransitioning) return;
    
    // Prevent default scrolling during horizontal swipes
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const deltaX = Math.abs(touchCurrentX - touchStartX);
    const deltaY = Math.abs(touchCurrentY - touchStartY);
    
    if (deltaX > deltaY) {
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    if (!isSwipeEnabled || isTransitioning) return;
    
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipeGesture();
}

function handleMouseDown(e) {
    if (!isSwipeEnabled || isTransitioning) return;
    
    touchStartX = e.clientX;
    touchStartY = e.clientY;
}

function handleMouseMove(e) {
    if (!isSwipeEnabled || isTransitioning) return;
    // Optional: Add visual feedback during drag
}

function handleMouseEnd(e) {
    if (!isSwipeEnabled || isTransitioning) return;
    
    touchEndX = e.clientX;
    touchEndY = e.clientY;
    handleSwipeGesture();
}

function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0 && currentSession > 0) {
                // Swipe right - go to previous session
                navigateToSession(currentSession - 1, 'right');
            } else if (deltaX < 0 && currentSession < 9) {
                // Swipe left - go to next session  
                navigateToSession(currentSession + 1, 'left');
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0 && currentSession > 0) {
                // Swipe down - go to previous session
                navigateToSession(currentSession - 1, 'down');
            } else if (deltaY < 0 && currentSession < 9) {
                // Swipe up - go to next session
                navigateToSession(currentSession + 1, 'up');
            }
        }
    }
}

function handleKeyNavigation(e) {
    if (isTransitioning) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            if (currentSession > 0) {
                navigateToSession(currentSession - 1, e.key === 'ArrowUp' ? 'up' : 'left');
            }
            break;
        case 'ArrowDown':
        case 'ArrowRight':
            if (currentSession < 9) {
                navigateToSession(currentSession + 1, e.key === 'ArrowDown' ? 'down' : 'right');
            }
            break;
    }
}

// ==========================================
// ENHANCED NAVIGATION WITH SMOOTH TRANSITIONS
// ==========================================

function navigateToSession(sessionNumber, direction = 'left') {
    if (sessionNumber < 0 || sessionNumber > 9 || sessionNumber === currentSession || isTransitioning) return;
    
    isTransitioning = true;
    
    const currentSessionElement = document.getElementById(`session${currentSession}`);
    const newSessionElement = document.getElementById(`session${sessionNumber}`);
    
    if (!currentSessionElement || !newSessionElement) {
        isTransitioning = false;
        return;
    }
    
    // Add transition animations based on direction
    animateSessionTransition(currentSessionElement, newSessionElement, direction, () => {
        currentSession = sessionNumber;
        updateDotsNavigation();
        triggerSectionAnimations(sessionNumber);
        isTransitioning = false;
        
        // Load content for specific sessions
        if (sessionNumber === 7) {
            loadGuestMessages();
        }
        
        // Run typewriter effect for session 2
        if (sessionNumber === 2) {
            runQuranTypewriter();
        }
        
        // Pause video when leaving video session
        if (currentSession !== 9 && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
            ytPlayer.pauseVideo();
        }
    });
}

function animateSessionTransition(currentEl, newEl, direction, callback) {
    // Create GSAP timeline for smooth transitions
    const tl = gsap.timeline({
        onComplete: callback
    });
    
    // Set initial states
    gsap.set(newEl, getInitialTransformForDirection(direction));
    newEl.classList.remove('hidden');
    newEl.classList.add('active');
    
    // Animate out current session
    tl.to(currentEl.querySelector('.session-content'), {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in"
    })
    .to(currentEl, {
        ...getFinalTransformForDirection(getOppositeDirection(direction)),
        duration: 0.5,
        ease: "power2.inOut"
    }, 0.1);
    
    // Animate in new session
    tl.fromTo(newEl, 
        getInitialTransformForDirection(direction),
        {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut"
        }, 0.3)
    .fromTo(newEl.querySelector('.session-content'), {
        opacity: 0,
        scale: 0.9
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
    }, 0.5);
    
    // Clean up current session after animation
    tl.call(() => {
        currentEl.classList.remove('active');
        currentEl.classList.add('hidden');
        gsap.set(currentEl, { clearProps: "all" });
    });
}

function getInitialTransformForDirection(direction) {
    const distance = window.innerWidth;
    switch(direction) {
        case 'left': return { x: distance, opacity: 0 };
        case 'right': return { x: -distance, opacity: 0 };
        case 'up': return { y: window.innerHeight, opacity: 0 };
        case 'down': return { y: -window.innerHeight, opacity: 0 };
        default: return { x: distance, opacity: 0 };
    }
}

function getFinalTransformForDirection(direction) {
    const distance = window.innerWidth;
    switch(direction) {
        case 'left': return { x: -distance, opacity: 0 };
        case 'right': return { x: distance, opacity: 0 };
        case 'up': return { y: -window.innerHeight, opacity: 0 };
        case 'down': return { y: window.innerHeight, opacity: 0 };
        default: return { x: -distance, opacity: 0 };
    }
}

function getOppositeDirection(direction) {
    switch(direction) {
        case 'left': return 'right';
        case 'right': return 'left';
        case 'up': return 'down';
        case 'down': return 'up';
        default: return 'right';
    }
}

// ==========================================
// ENHANCED PARTICLE SYSTEM
// ==========================================

function initParticleSystem() {
    createAdvancedParticles();
    createFloatingHearts();
    createSparkleEffect();
}

function createAdvancedParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    // Enhanced particle configuration
    const particleConfig = {
        sakura: {
            url: 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/sakura.png',
            count: 25,
            speed: { min: 8, max: 15 },
            size: { min: 15, max: 30 },
            rotation: true,
            sway: true
        },
        daisy: {
            url: 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/daisy.png',
            count: 20,
            speed: { min: 10, max: 18 },
            size: { min: 12, max: 25 },
            rotation: true,
            sway: true
        },
        rose: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2Qzk0Ii8+Cjwvc3ZnPgo=',
            count: 15,
            speed: { min: 5, max: 12 },
            size: { min: 8, max: 20 },
            rotation: false,
            sway: false
        }
    };
    
    Object.keys(particleConfig).forEach(type => {
        const config = particleConfig[type];
        for (let i = 0; i < config.count; i++) {
            createAdvancedParticle(container, config, type);
        }
    });
}

function createAdvancedParticle(container, config, type) {
    const particle = document.createElement('div');
    particle.className = `particle particle-${type}`;
    
    const size = gsap.utils.random(config.size.min, config.size.max);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundImage = `url(${config.url})`;
    particle.style.backgroundSize = 'contain';
    particle.style.backgroundRepeat = 'no-repeat';
    particle.style.position = 'absolute';
    particle.style.pointerEvents = 'none';
    
    container.appendChild(particle);
    animateAdvancedParticle(particle, config);
}

function animateAdvancedParticle(particle, config) {
    const startX = gsap.utils.random(0, window.innerWidth);
    const endX = startX + gsap.utils.random(-100, 100);
    const duration = gsap.utils.random(config.speed.min, config.speed.max);
    const delay = gsap.utils.random(0, 5);
    
    gsap.set(particle, {
        x: startX,
        y: -100,
        opacity: 0,
        rotation: config.rotation ? gsap.utils.random(0, 360) : 0
    });
    
    const tl = gsap.timeline({
        repeat: -1,
        delay: delay,
        onRepeat: () => {
            gsap.set(particle, {
                x: gsap.utils.random(0, window.innerWidth),
                y: -100,
                opacity: 0
            });
        }
    });
    
    tl.to(particle, {
        opacity: gsap.utils.random(0.3, 0.8),
        duration: 1,
        ease: "power2.out"
    })
    .to(particle, {
        y: window.innerHeight + 100,
        x: endX,
        rotation: config.rotation ? `+=${gsap.utils.random(180, 720)}` : 0,
        duration: duration,
        ease: "none"
    }, 0)
    .to(particle, {
        opacity: 0,
        duration: 2,
        ease: "power2.in"
    }, duration - 2);
    
    if (config.sway) {
        tl.to(particle, {
            x: `+=${gsap.utils.random(-50, 50)}`,
            duration: duration / 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        }, 0);
    }
}

function createFloatingHearts() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    for (let i = 0; i < 8; i++) {
        createFloatingHeart(container);
    }
}

function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = 'â™¥';
    heart.style.cssText = `
        position: absolute;
        font-size: ${gsap.utils.random(16, 28)}px;
        color: rgba(255, 182, 193, 0.6);
        pointer-events: none;
        z-index: 1;
    `;
    
    container.appendChild(heart);
    
    const tl = gsap.timeline({ repeat: -1 });
    
    gsap.set(heart, {
        x: gsap.utils.random(0, window.innerWidth),
        y: window.innerHeight + 50,
        scale: 0
    });
    
    tl.to(heart, {
        y: -50,
        scale: 1,
        duration: gsap.utils.random(15, 25),
        ease: "none"
    })
    .to(heart, {
        x: `+=${gsap.utils.random(-200, 200)}`,
        duration: gsap.utils.random(8, 12),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    }, 0);
}

function createSparkleEffect() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            createSparkle(container);
        }
    }, 2000);
}

function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = 'âœ¨';
    sparkle.style.cssText = `
        position: absolute;
        font-size: ${gsap.utils.random(12, 20)}px;
        pointer-events: none;
        z-index: 2;
    `;
    
    const x = gsap.utils.random(50, window.innerWidth - 50);
    const y = gsap.utils.random(50, window.innerHeight - 50);
    
    gsap.set(sparkle, { x, y, scale: 0, rotation: 0 });
    container.appendChild(sparkle);
    
    gsap.timeline()
        .to(sparkle, {
            scale: 1,
            rotation: 360,
            duration: 0.5,
            ease: "back.out(1.7)"
        })
        .to(sparkle, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            delay: 1,
            onComplete: () => sparkle.remove()
        });
}

// ==========================================
// FLOATING ELEMENTS SYSTEM
// ==========================================

function initFloatingElements() {
    createFloatingElements();
    createMorphingShapes();
}

function createFloatingElements() {
    const elements = [
        { type: 'ring', symbol: 'ðŸ’', count: 3 },
        { type: 'dove', symbol: 'ðŸ•Šï¸', count: 2 },
        { type: 'flower', symbol: 'ðŸŒ¸', count: 4 },
        { type: 'star', symbol: 'â­', count: 5 }
    ];
    
    elements.forEach(({ type, symbol, count }) => {
        for (let i = 0; i < count; i++) {
            createFloatingElement(type, symbol);
        }
    });
}

function createFloatingElement(type, symbol) {
    const element = document.createElement('div');
    element.className = `floating-element floating-${type}`;
    element.innerHTML = symbol;
    element.style.cssText = `
        position: fixed;
        font-size: ${gsap.utils.random(20, 35)}px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.7;
    `;
    
    document.body.appendChild(element);
    
    const x = gsap.utils.random(0, window.innerWidth - 50);
    const y = gsap.utils.random(0, window.innerHeight - 50);
    
    gsap.set(element, { x, y });
    
    // Float animation with physics
    gsap.to(element, {
        y: `+=${gsap.utils.random(-30, 30)}`,
        x: `+=${gsap.utils.random(-20, 20)}`,
        rotation: gsap.utils.random(-15, 15),
        duration: gsap.utils.random(3, 6),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Occasional random movement
    setInterval(() => {
        gsap.to(element, {
            x: gsap.utils.random(0, window.innerWidth - 50),
            y: gsap.utils.random(0, window.innerHeight - 50),
            duration: gsap.utils.random(8, 15),
            ease: "power2.inOut"
        });
    }, gsap.utils.random(10000, 20000));
}

function createMorphingShapes() {
    for (let i = 0; i < 3; i++) {
        createMorphingShape();
    }
}

function createMorphingShape() {
    const shape = document.createElement('div');
    shape.className = 'morphing-shape';
    shape.style.cssText = `
        position: fixed;
        width: ${gsap.utils.random(40, 80)}px;
        height: ${gsap.utils.random(40, 80)}px;
        background: linear-gradient(45deg, rgba(255,182,193,0.3), rgba(255,192,203,0.3));
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        filter: blur(1px);
    `;
    
    document.body.appendChild(shape);
    
    const x = gsap.utils.random(0, window.innerWidth);
    const y = gsap.utils.random(0, window.innerHeight);
    
    gsap.set(shape, { x, y, scale: 0 });
    
    // Morphing animation
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(shape, {
        scale: gsap.utils.random(0.5, 1.5),
        duration: 2,
        ease: "sine.inOut"
    })
    .to(shape, {
        borderRadius: gsap.utils.random(20, 80) + '%',
        duration: 3,
        ease: "sine.inOut"
    }, 0)
    .to(shape, {
        x: `+=${gsap.utils.random(-200, 200)}`,
        y: `+=${gsap.utils.random(-100, 100)}`,
        duration: gsap.utils.random(8, 12),
        ease: "sine.inOut"
    }, 0);
}

// ==========================================
// SECTION ANIMATIONS SYSTEM
// ==========================================

function setupSectionAnimations() {
    // Pre-setup animations for each section
    for (let i = 0; i <= 9; i++) {
        prepareSectionAnimation(i);
    }
}

function prepareSectionAnimation(sessionNumber) {
    const session = document.getElementById(`session${sessionNumber}`);
    if (!session) return;
    
    const content = session.querySelector('.session-content');
    if (!content) return;
    
    // Set initial states
    gsap.set(content.children, {
        opacity: 0,
        y: 30,
        scale: 0.95
    });
}

function triggerSectionAnimations(sessionNumber) {
    const session = document.getElementById(`session${sessionNumber}`);
    if (!session) return;
    
    const content = session.querySelector('.session-content');
    if (!content) return;
    
    // Animate in all child elements
    gsap.fromTo(content.children, {
        opacity: 0,
        y: 30,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.3
    });
    
    // Special animations for specific sessions
    switch(sessionNumber) {
        case 0:
            animateWelcomeSection();
            break;
        case 1:
            animateCountdownSection();
            break;
        case 2:
            animateBismillahSection();
            break;
        case 3:
            animateCoupleSection();
            break;
        default:
            animateGenericSection(sessionNumber);
    }
}

function animateWelcomeSection() {
    const title = document.querySelector('.invitation-title h1');
    const names = document.querySelector('.couple-names');
    const date = document.querySelector('.wedding-date');
    
    if (title) {
        gsap.fromTo(title, {
            scale: 0.5,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            delay: 0.5
        });
    }
    
    if (names) {
        gsap.fromTo(names.children || [names], {
            x: -100,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            delay: 1
        });
    }
    
    if (date) {
        gsap.fromTo(date, {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "bounce.out",
            delay: 1.5
        });
    }
}

function animateCountdownSection() {
    const countdownItems = document.querySelectorAll('.countdown-item');
    
    countdownItems.forEach((item, index) => {
        gsap.fromTo(item, {
            rotateY: 180,
            opacity: 0
        }, {
            rotateY: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2 + 0.5,
            ease: "back.out(1.7)"
        });
    });
}

function animateBismillahSection() {
    const arabicText = document.querySelector('.arabic-text');
    const translation = document.querySelector('.translation');
    
    if (arabicText) {
        gsap.fromTo(arabicText, {
            opacity: 0,
            scale: 0.8
        }, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.5
        });
    }
    
    if (translation) {
        gsap.fromTo(translation, {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: 1.2
        });
    }
}

function animateCoupleSection() {
    const photos = document.querySelectorAll('.photo-frame');
    const divider = document.querySelector('.couple-divider');
    
    photos.forEach((photo, index) => {
        gsap.fromTo(photo, {
            scale: 0,
            rotation: 180
        }, {
            scale: 1,
            rotation: 0,
            duration: 1,
            delay: index * 0.3 + 0.5,
            ease: "back.out(1.7)"
        });
    });
    
    if (divider) {
        gsap.fromTo(divider, {
            scale: 0,
            rotation: 360
        }, {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay: 0.8,
            ease: "elastic.out(1, 0.5)"
        });
    }
}

function animateGenericSection(sessionNumber) {
    const session = document.getElementById(`session${sessionNumber}`);
    if (!session) return;
    
    const elements = session.querySelectorAll('h2, h3, p, .btn, .form-group');
    
    gsap.fromTo(elements, {
        opacity: 0,
        x: gsap.utils.random(-50, 50),
        y: gsap.utils.random(20, 40)
    }, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3
    });
}

// ==========================================
// ENHANCED DOTS NAVIGATION
// ==========================================

function setupDotsNavigation() {
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSession && !isTransitioning) {
                const direction = index > currentSession ? 'left' : 'right';
                navigateToSession(index, direction);
            }
        });
        
        // Add hover effects
        dot.addEventListener('mouseenter', () => {
            if (index !== currentSession) {
                gsap.to(dot, {
                    scale: 1.3,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        dot.addEventListener('mouseleave', () => {
            if (index !== currentSession) {
                gsap.to(dot, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });
    });
}

function updateDotsNavigation() {
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        if (index === currentSession) {
            dot.classList.add('active');
            gsap.to(dot, {
                scale: 1.4,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        } else {
            dot.classList.remove('active');
            gsap.to(dot, {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        }
    });
}

// ==========================================
// ENHANCED MUSIC SYSTEM
// ==========================================

function showMusicEnableButton() {
    if (document.querySelector('.music-toggle-btn')) return;
    
    const musicButton = document.createElement('button');
    musicButton.innerHTML = 'ðŸ”‡';
    musicButton.className = 'btn music-toggle-btn';
    musicButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1001;
        background: rgba(230, 191, 132, 0.2);
        backdrop-filter: blur(10px);
        color: var(--wedding-gold);
        border: 2px solid var(--wedding-gold);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicButton.innerHTML = 'ðŸŽµ';
            gsap.to(musicButton, {
                rotation: 360,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        } else {
            backgroundMusic.pause();
            musicButton.innerHTML = 'ðŸ”‡';
            gsap.to(musicButton, {
                rotation: -360,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        }
    });
    
    // Floating animation
    gsap.to(musicButton, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    document.body.appendChild(musicButton);
}

// ==========================================
// TYPEWRITER EFFECTS
// ==========================================

function runQuranTypewriter() {
    const targetElement = document.getElementById('quran-verse-typewriter');
    if (targetElement && !targetElement.classList.contains('typed')) {
        const quranText = `"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."`;
        const citation = `\n\nQS. Ar-Rum: 21`;
        
        targetElement.innerHTML = '';
        typeWriter(targetElement, quranText + citation);
        targetElement.classList.add('typed');
    }
}

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ==========================================
// LOADING ANIMATION
// ==========================================

function addLoadingAnimation() {
    // Create loading overlay
    const loader = document.createElement('div');
    loader.id = 'loading-overlay';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--wedding-black);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;
    
    loader.innerHTML = `
        <div class="loader-hearts">
            <div class="heart">â™¥</div>
            <div class="heart">â™¥</div>
            <div class="heart">â™¥</div>
        </div>
        <div class="loader-text">Loading...</div>
    `;
    
    document.body.appendChild(loader);
    
    // Animate hearts
    const hearts = loader.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.style.cssText = `
            font-size: 2rem;
            color: var(--wedding-gold);
            margin: 0 10px;
            opacity: 0.3;
        `;
        
        gsap.to(heart, {
            opacity: 1,
            scale: 1.2,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            delay: index * 0.2,
            ease: "power2.inOut"
        });
    });
    
    // Remove loader after delay
    setTimeout(() => {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            onComplete: () => loader.remove()
        });
    }, 3000);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showSession(sessionNumber) {
    document.querySelectorAll('.session').forEach((session, index) => {
        if (index === sessionNumber) {
            session.classList.remove('hidden');
            session.classList.add('active');
        } else {
            session.classList.remove('active');
            session.classList.add('hidden');
        }
    });
    
    updateDotsNavigation();
    currentSession = sessionNumber;
}

function setupActionButtons() {
    document.getElementById('openInvitationBtn')?.addEventListener('click', openInvitation);
    document.getElementById('saveDateBtn')?.addEventListener('click', saveTheDate);
    document.getElementById('shareBtn')?.addEventListener('click', shareInvitation);
    document.getElementById('openMapsBtn')?.addEventListener('click', openMaps);
    document.getElementById('submitRsvpBtn')?.addEventListener('click', handleRsvpSubmission);
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => copyAccount(e.target.dataset.account));
    });
}

function startCountdown() {
    try {
        if (typeof countdownInterval !== 'undefined' && countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        
        const weddingDate = new Date('2025-09-24T07:00:00+08:00');
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.getElementById('days')) {
                    obs.disconnect();
                    startCountdown();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }
        
        function update() {
            const now = Date.now();
            const distance = weddingDate.getTime() - now;
            
            if (distance <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }
        
        update();
        countdownInterval = setInterval(update, 1000);
    } catch (err) {
        console.error('[countdown] error saat memulai:', err);
    }
}

function openInvitation() {
    navigateToSession(1, 'left');
    playBackgroundMusic();
}

function playBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.log('Auto-play dicegah:', error);
        });
    }
}

async function saveTheDate() {
    const event = {
        title: 'Pernikahan Suriansyah & Sonia Agustina Oemar',
        start: '2025-09-24T07:00:00+08:00',
        end: '2025-09-24T17:00:00+08:00',
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar. \n\nJangan lupa hadir dan memberikan doa restu.',
        location: 'Masjid Jabal Rahmah Mandin & Rumah Mempelai Wanita'
    };
    
    console.log('Save the date functionality');
}

async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur kepada Allah SWT, kami mengundang Bapak/Ibu/Saudara(i) menghadiri pernikahan Suriansyah & Sonia. Barakallahu lakuma wa baraka \'alaikuma.';
    console.log('Share invitation functionality');
}

function handleRsvpSubmission() {
    console.log('RSVP submission functionality');
}

function loadGuestMessages() {
    console.log('Load guest messages functionality');
}

function copyAccount(account) {
    console.log('Copy account functionality');
}

function showNotification(message) {
    console.log('Notification:', message);
}

function openMaps() {
    console.log('Open maps functionality');
}
