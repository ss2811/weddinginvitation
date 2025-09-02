// ====== MERGED FILE ======
// Original file: enhanced-app (1).js
// Appended: enhanced-app-fixed.js adjustments (safe IIFE)

// Wedding Invitation JavaScript - Enhanced Animated & Visual Effects Version

// PENTING: Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Global variables
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;
let animationFrameId;
let particleSystem = [];
let mouseTrail = [];

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
    document.body.classList.add('no-scroll');
    backgroundMusic = document.getElementById('backgroundMusic');
    setupActionButtons();
    startCountdown();
    loadGuestMessages();
    showMusicEnableButton();
    createBackgroundParticles();
    setupScrollAnimations();
    initAdvancedAnimations();
    createFloatingHearts();
    initMouseTrail();
    initTextAnimations();
}

// --- ENHANCED ANIMATION FUNCTIONS ---

/**
 * Initialize advanced animation systems
 */
function initAdvancedAnimations() {
    // Initialize GSAP if available
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initGSAPAnimations();
    }
    
    // Initialize CSS-based animations
    initCSSAnimations();
    
    // Initialize particle physics
    initParticlePhysics();
    
    // Initialize 3D effects
    init3DEffects();
}

/**
 * GSAP-based animations (enhanced version)
 */
function initGSAPAnimations() {
    // Timeline for session transitions
    const sessionTimeline = gsap.timeline({ paused: true });
    
    // Enhanced particle animations with GSAP
    gsap.set('.particle', { 
        scale: 0, 
        opacity: 0, 
        rotation: () => Math.random() * 360 
    });
    
    // Staggered particle appearance
    gsap.to('.particle', {
        scale: () => Math.random() * 0.8 + 0.5,
        opacity: () => Math.random() * 0.6 + 0.2,
        rotation: '+=360',
        duration: () => Math.random() * 3 + 2,
        ease: 'power2.out',
        stagger: {
            each: 0.1,
            from: 'random'
        },
        repeat: -1,
        yoyo: true
    });
    
    // Enhanced text animations
    gsap.fromTo('.shimmer-text', 
        { 
            backgroundPosition: '0% 50%',
            scale: 1
        },
        {
            backgroundPosition: '100% 50%',
            scale: 1.05,
            duration: 3,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
        }
    );
}

/**
 * CSS-based advanced animations
 */
function initCSSAnimations() {
    // Add dynamic classes for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add stagger animation classes
                if (element.classList.contains('stagger-container')) {
                    const children = element.querySelectorAll(':scope > *');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('stagger-animate');
                        }, index * 100);
                    });
                }
                
                // Add scroll animations
                element.classList.add('animate-in');
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });
}

/**
 * Enhanced particle physics system
 */
function initParticlePhysics() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.id = 'particle-physics-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle class with physics
    class PhysicsParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = Math.random() * 4 + 2;
            this.color = this.getRandomColor();
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.005;
            this.gravity = 0.05;
            this.bounce = 0.8;
        }
        
        getRandomColor() {
            const colors = [
                'rgba(230, 191, 132, 0.7)',
                'rgba(244, 194, 194, 0.7)',
                'rgba(32, 201, 151, 0.7)',
                'rgba(255, 255, 255, 0.5)'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.life -= this.decay;
            
            // Bounce off edges
            if (this.x <= 0 || this.x >= canvas.width) {
                this.vx *= -this.bounce;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            
            if (this.y >= canvas.height) {
                this.vy *= -this.bounce;
                this.y = canvas.height;
                this.vx *= 0.9; // Friction
            }
        }
        
        draw(ctx) {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Animate particles
    function animatePhysicsParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add new particles occasionally
        if (Math.random() < 0.1) {
            particleSystem.push(new PhysicsParticle(
                Math.random() * canvas.width,
                0
            ));
        }
        
        // Update and draw particles
        particleSystem = particleSystem.filter(particle => {
            particle.update();
            particle.draw(ctx);
            return particle.life > 0;
        });
        
        animationFrameId = requestAnimationFrame(animatePhysicsParticles);
    }
    
    animatePhysicsParticles();
}

/**
 * 3D CSS effects initialization
 */
function init3DEffects() {
    // Add 3D transform to session content
    document.querySelectorAll('.session-content').forEach(content => {
        content.style.transformStyle = 'preserve-3d';
        
        // Mouse move effect
        content.addEventListener('mousemove', (e) => {
            const rect = content.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = (y / rect.height) * 10;
            const rotateY = (x / rect.width) * 10;
            
            content.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        content.addEventListener('mouseleave', () => {
            content.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

/**
 * Create floating hearts animation
 */
function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.id = 'floating-hearts';
    heartsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
    `;
    document.body.appendChild(heartsContainer);
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: floatUp ${Math.random() * 3 + 4}s linear infinite;
            opacity: ${Math.random() * 0.7 + 0.3};
        `;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 7000);
    }
    
    // Add CSS for heart animation
    const heartStyle = document.createElement('style');
    heartStyle.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(heartStyle);
    
    // Create hearts periodically
    setInterval(createHeart, 2000);
}

/**
 * Mouse trail effect
 */
function initMouseTrail() {
    const trail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });
        
        // Keep trail length manageable
        if (trail.length > trailLength) {
            trail.shift();
        }
        
        updateTrail();
    });
    
    function updateTrail() {
        // Remove existing trail elements
        document.querySelectorAll('.mouse-trail').forEach(el => el.remove());
        
        // Create new trail elements
        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'mouse-trail';
            trailElement.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: ${(index + 1) * 2}px;
                height: ${(index + 1) * 2}px;
                background: radial-gradient(circle, rgba(230, 191, 132, ${(index + 1) * 0.1}) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(trailElement);
            
            setTimeout(() => {
                trailElement.style.opacity = '0';
                setTimeout(() => trailElement.remove(), 300);
            }, 100);
        });
    }
}

/**
 * Enhanced text animations
 */
function initTextAnimations() {
    // Typewriter effect for multiple elements
    document.querySelectorAll('[data-typewriter]').forEach(element => {
        const text = element.dataset.typewriter || element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            typeWriterEffect(element, text, speed);
        }, delay);
    });
    
    // Word by word reveal animation
    document.querySelectorAll('.word-reveal').forEach(element => {
        const words = element.textContent.split(' ');
        element.innerHTML = words.map(word => `<span class="word-item">${word}</span>`).join(' ');
        
        const wordElements = element.querySelectorAll('.word-item');
        wordElements.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(20px)';
            word.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
}

/**
 * Enhanced typewriter effect
 */
function typeWriterEffect(element, text, speed = 50) {
    element.textContent = '';
    element.style.borderRight = '2px solid var(--wedding-gold)';
    
    let index = 0;
    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    type();
}

/**
 * Membuat partikel bunga (sakura & daisy) yang berjatuhan di latar belakang.
 * Enhanced dengan physics dan interactive effects.
 */
function createBackgroundParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    const daisyImgUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/daisy.png';
    const sakuraImgUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/sakura.png';

    const particleTypes = [
        { url: daisyImgUrl, count: 20 },
        { url: sakuraImgUrl, count: 25 }
    ];

    particleTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundImage = `url(${type.url})`;
            
            const size = Math.random() * 30 + 20;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            container.appendChild(particle);
            animateParticleEnhanced(particle, i);
        }
    });
}

/**
 * Enhanced particle animation with physics
 */
function animateParticleEnhanced(particle, index) {
    const randomX = Math.random() * window.innerWidth;
    const randomDelay = Math.random() * 5;
    const randomDuration = Math.random() * 15 + 10;
    const randomDirection = Math.random() > 0.5 ? 1 : -1;
    
    particle.style.left = `${randomX}px`;
    particle.style.top = '-100px';
    
    // Use CSS custom properties for animation
    particle.style.setProperty('--random-x', `${Math.random() * 200 - 100}px`);
    particle.style.setProperty('--random-rotation', `${Math.random() * 720}deg`);
    particle.style.setProperty('--duration', `${randomDuration}s`);
    particle.style.setProperty('--delay', `${randomDelay}s`);
    
    // Add interaction on hover
    particle.addEventListener('mouseenter', () => {
        particle.style.animation = 'particleBurst 0.5s ease-out';
        setTimeout(() => {
            particle.style.animation = `particleFloat var(--duration) ease-in-out infinite`;
        }, 500);
    });
    
    // Apply animation
    particle.style.animation = `particleFloat var(--duration) ease-in-out infinite var(--delay)`;
}

/**
 * Fungsi untuk efek mengetik (typewriter) yang ditingkatkan.
 */
function typeWriter(selector, text, onComplete) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.innerHTML = '';
    element.style.position = 'relative';
    
    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);
    
    let i = 0;
    function type() {
        if (i < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
            
            // Random typing speed for more realistic effect
            const speed = Math.random() * 100 + 30;
            setTimeout(type, speed);
        } else {
            // Remove cursor and call completion callback
            setTimeout(() => {
                cursor.remove();
                if (onComplete) onComplete();
            }, 1000);
        }
    }
    
    // Add initial delay
    setTimeout(type, 500);
}

// Enhanced scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Add enhanced animations based on data attributes
                if (target.dataset.animation) {
                    target.classList.add(target.dataset.animation);
                }
                
                // Typewriter for Quran verse
                if (target.id === 'session2') {
                    const targetElement = document.getElementById('quran-verse-typewriter');
                    if (targetElement && !targetElement.classList.contains('typed')) {
                        const quranText = `"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."`;
                        const citation = `<cite>QS. Ar-Rum: 21</cite>`;
                        
                        targetElement.innerHTML = '';
                        typeWriter('#quran-verse-typewriter', quranText, () => {
                            targetElement.innerHTML += citation;
                        });
                        targetElement.classList.add('typed');
                        observer.unobserve(target);
                    }
                }
                
                // Enhanced stagger animation for children
                if (target.classList.contains('stagger-parent')) {
                    const children = target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 150);
                    });
                }
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all sections and special elements
    document.querySelectorAll('.session, [data-animation], .stagger-parent').forEach(section => {
        observer.observe(section);
    });
}

// Enhanced action button setup
function setupActionButtons() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    document.getElementById('openInvitationBtn')?.addEventListener('click', openInvitationEnhanced);
    document.getElementById('saveDateBtn')?.addEventListener('click', saveTheDate);
    document.getElementById('shareBtn')?.addEventListener('click', shareInvitation);
    document.getElementById('openMapsBtn')?.addEventListener('click', openMaps);
    document.getElementById('submitRsvpBtn')?.addEventListener('click', handleRsvpSubmission);
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => copyAccountEnhanced(e.target.dataset.account));
    });
}

/**
 * Create ripple effect for buttons
 */
function createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple keyframe if not exists
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Enhanced copy function with visual feedback
 */
async function copyAccountEnhanced(account) {
    try {
        await navigator.clipboard.writeText(account);
        
        // Create floating notification
        const notification = document.createElement('div');
        notification.textContent = 'Nomor rekening tersalin!';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--wedding-gold);
            color: var(--wedding-black);
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: copyNotification 2s ease-out forwards;
        `;
        
        // Add animation styles
        if (!document.querySelector('#copy-notification-style')) {
            const style = document.createElement('style');
            style.id = 'copy-notification-style';
            style.textContent = `
                @keyframes copyNotification {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    40% { transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -70%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
        
    } catch (err) {
        console.error('Gagal menyalin:', err);
        showNotification('Gagal menyalin nomor rekening');
    }
}

// Audio Functions (enhanced)
function playBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3; // Set volume
        backgroundMusic.play().catch(error => {
            console.log('Auto-play dicegah:', error);
        });
        
        // Add visual indicator
        updateMusicButton(true);
    }
}

function pauseBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        updateMusicButton(false);
    }
}

function resumeBackgroundMusic() {
    if (backgroundMusic?.paused && !isVideoPlaying) {
        backgroundMusic.play().catch(error => console.log('Gagal melanjutkan musik:', error));
        updateMusicButton(true);
    }
}

function updateMusicButton(isPlaying) {
    const musicButton = document.querySelector('.music-toggle-btn');
    if (musicButton) {
        musicButton.innerHTML = isPlaying ? '🎵' : '🔇';
        musicButton.classList.toggle('playing', isPlaying);
    }
}

function showMusicEnableButton() {
    if (document.querySelector('.music-toggle-btn')) return;

    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔇';
    musicButton.className = 'btn music-toggle-btn';
    musicButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1001;
        background: var(--wedding-gold);
        color: var(--wedding-black);
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;

    // Enhanced hover effects
    musicButton.addEventListener('mouseenter', () => {
        musicButton.style.transform = 'scale(1.1) translateY(-2px)';
        musicButton.style.boxShadow = '0 6px 25px rgba(230, 191, 132, 0.5)';
    });
    
    musicButton.addEventListener('mouseleave', () => {
        musicButton.style.transform = 'scale(1) translateY(0)';
        musicButton.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    });

    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            playBackgroundMusic();
        } else {
            pauseBackgroundMusic();
        }
    });

    document.body.appendChild(musicButton);
}

// Enhanced Session 0: Landing
function openInvitationEnhanced() {
    const session0 = document.getElementById('session0');
    const mainContent = document.querySelector('.main-content-wrapper');
    
    // Enhanced transition effect
    if (session0) {
        session0.style.transform = 'scale(1.05)';
        session0.style.filter = 'blur(5px)';
        
        setTimeout(() => {
            session0.classList.add('fade-out');
            setTimeout(() => {
                session0.classList.add('hidden');
            }, 600);
        }, 300);
    }

    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'all 0.8s ease-out';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 600);
    }

    document.body.classList.remove('no-scroll');
    playBackgroundMusic();
    
    // Trigger celebration animation
    createCelebrationBurst();
}

/**
 * Create celebration burst effect
 */
function createCelebrationBurst() {
    const colors = ['#E6BF84', '#F4C2C2', '#20c997', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: 50%;
            top: 50%;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: confettiBurst 3s ease-out forwards;
        `;
        
        // Random direction and distance
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = Math.random() * 300 + 200;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        
        confetti.style.setProperty('--x', `${x}px`);
        confetti.style.setProperty('--y', `${y}px`);
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
    
    // Add confetti animation styles
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiBurst {
                0% {
                    transform: translate(-50%, -50%) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced Session 1: Countdown
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
                
                // Trigger celebration when countdown reaches zero
                createCelebrationBurst();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Enhanced number animation
            updateCountdownNumber(daysEl, String(days).padStart(2, '0'));
            updateCountdownNumber(hoursEl, String(hours).padStart(2, '0'));
            updateCountdownNumber(minutesEl, String(minutes).padStart(2, '0'));
            updateCountdownNumber(secondsEl, String(seconds).padStart(2, '0'));
        }

        function updateCountdownNumber(element, newValue) {
            if (element.textContent !== newValue) {
                element.style.transform = 'scale(1.2)';
                element.style.color = 'var(--wedding-pink)';
                
                setTimeout(() => {
                    element.textContent = newValue;
                    element.style.transform = 'scale(1)';
                    element.style.color = 'var(--wedding-gold)';
                }, 150);
            }
        }

        update();
        countdownInterval = setInterval(update, 1000);

    } catch (err) {
        console.error('[countdown] error saat memulai:', err);
    }
}

// Rest of the functions remain the same but with enhanced visual effects...
// (continuing with the same structure as the original file)

async function saveTheDate() {
    const event = {
        title: 'Pernikahan Suriansyah & Sonia Agustina Oemar',
        start: '2025-09-24T07:00:00+08:00',
        end: '2025-09-24T17:00:00+08:00',
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar.\\n\\nJangan lupa hadir dan memberikan doa restu.',
        location: 'Masjid Jabal Rahmah Mandin & Rumah Mempelai Wanita'
    };

    const toUTC = (dateString) => {
        const date = new Date(dateString);
        const pad = (num) => num.toString().padStart(2, '0');
        return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@wedding.com
DTSTAMP:${toUTC(new Date().toISOString())}
DTSTART;TZID=Asia/Makassar:${toUTC(event.start)}
DTEND;TZID=Asia/Makassar:${toUTC(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const file = new File([blob], 'wedding_invitation.ics', { type: 'text/calendar' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: event.title,
                text: 'Simpan tanggal pernikahan kami di kalender Anda.'
            });
            showNotificationEnhanced('Pilih aplikasi Kalender untuk menyimpan acara.', 'success');
            return;
        } catch (error) {
            console.warn('Web Share API dibatalkan atau gagal:', error);
        }
    }

    try {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        showNotificationEnhanced('File kalender (.ics) telah diunduh. Silakan buka file tersebut.', 'success');
    } catch (error) {
        console.error('Gagal membuat link unduhan:', error);
        showNotificationEnhanced('Gagal membuat file kalender. Silakan coba lagi.', 'error');
    }
}

async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur kepada Allah SWT, kami mengundang Bapak/Ibu/Saudara(i) menghadiri pernikahan Suriansyah & Sonia. Barakallahu lakuma wa baraka \'alaikuma.';
    const shareTitle = 'Undangan Pernikahan | Suriansyah & Sonia';
    const shareUrl = window.location.href;

    copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
}

async function handleRsvpSubmission() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const attendanceInput = document.getElementById('attendance');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    const attendance = attendanceInput.value;

    if (!name || !message || !attendance) {
        showNotificationEnhanced('Mohon lengkapi nama, ucapan, dan konfirmasi kehadiran! ⚠️', 'warning');
        return;
    }

    const isPublic = await showPrivacyPopup();
    if (isPublic === null) return;

    const success = await submitMessageToFirebase(name, message, attendance, isPublic);
    if (success) {
        showNotificationEnhanced('Ucapan Anda berhasil terkirim. Terima kasih!', 'success');
        nameInput.value = '';
        messageInput.value = '';
        attendanceInput.selectedIndex = 0;
        loadGuestMessages();
        
        // Trigger celebration
        createCelebrationBurst();
    }
}

async function submitMessageToFirebase(name, message, attendance, isPublic) {
    if (!db) {
        showNotificationEnhanced("Gagal menyimpan ucapan: Database error.", 'error');
        return false;
    }

    try {
        await addDoc(collection(db, "messages"), {
            name: name,
            message: message,
            attendance: attendance,
            isPublic: isPublic,
            timestamp: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error menyimpan ke Firebase: ", error);
        showNotificationEnhanced("Terjadi kesalahan saat mengirim ucapan.", 'error');
        return false;
    }
}

function showPrivacyPopup() {
    return new Promise(resolve => {
        document.getElementById('privacy-popup-container')?.remove();

        const popupContainer = document.createElement('div');
        popupContainer.id = 'privacy-popup-container';
        popupContainer.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-box">
                <h3>🔒 Pengaturan Privasi</h3>
                <p>Apakah Anda ingin ucapan ini ditampilkan secara publik di halaman undangan?</p>
                <div class="popup-buttons">
                    <button class="btn" id="popup-public">Ya, Publik</button>
                    <button class="btn" id="popup-private">Tidak, Privat</button>
                </div>
            </div>
        `;

        document.body.appendChild(popupContainer);

        // Add enhanced popup animation
        setTimeout(() => {
            popupContainer.querySelector('.popup-box').style.transform = 'scale(1) rotate(0deg)';
        }, 10);

        document.getElementById('popup-public').onclick = () => {
            popupContainer.remove();
            resolve(true);
        };

        document.getElementById('popup-private').onclick = () => {
            popupContainer.remove();
            resolve(false);
        };

        popupContainer.querySelector('.popup-overlay').onclick = () => {
            popupContainer.remove();
            resolve(null);
        };
    });
}

async function loadGuestMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer || !db) return;

    try {
        const q = query(
            collection(db, "messages"),
            where("isPublic", "==", true),
            orderBy("timestamp", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        messagesContainer.innerHTML = '';

        if (querySnapshot.empty) {
            messagesContainer.innerHTML = '<div class="no-messages">Belum ada ucapan yang ditampilkan.</div>';
            return;
        }

        querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item';
            messageElement.style.animationDelay = `${index * 0.1}s`;
            messageElement.innerHTML = `
                <div class="message-name">${data.name}</div>
                <div class="message-text">${data.message}</div>
                <div class="message-attendance" style="color: var(--wedding-gold); font-size: 0.8rem; margin-top: 8px;">
                    ${data.attendance === 'hadir' ? '✅ Akan hadir' : '❌ Tidak dapat hadir'}
                </div>
            `;
            messagesContainer.appendChild(messageElement);
        });

    } catch (error) {
        console.error("Error loading messages:", error);
        messagesContainer.innerHTML = '<div class="no-messages">Gagal memuat ucapan.</div>';
    }
}

async function openMaps() {
    const mapsUrl = "https://maps.google.com/maps?q=Masjid+Jabal+Rahmah+Mandin";
    window.open(mapsUrl, '_blank');
    showNotificationEnhanced('Membuka Google Maps...', 'info');
}

async function copyToClipboard(text, successMessage) {
    try {
        await navigator.clipboard.writeText(text);
        showNotificationEnhanced(successMessage, 'success');
    } catch (err) {
        console.error('Gagal menyalin:', err);
        showNotificationEnhanced('Gagal menyalin ke clipboard', 'error');
    }
}

/**
 * Enhanced notification system with better animations
 */
function showNotificationEnhanced(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-text">${message}</span>
    `;
    
    const colors = {
        success: 'var(--wedding-tosca)',
        error: 'var(--color-red-500)',
        warning: 'var(--color-orange-500)',
        info: 'var(--wedding-gold)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.style.color = type === 'info' || type === 'warning' ? 'var(--wedding-black)' : 'white';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Cleanup function for when page unloads
window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Clean up particles
    document.querySelectorAll('.particle, .mouse-trail, #floating-hearts, #particle-physics-canvas').forEach(el => {
        el.remove();
    });
});

// Export functions for potential external use
window.WeddingInvitation = {
    playBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    createCelebrationBurst,
    showNotificationEnhanced
};


// ====== ENHANCED APP FIXED (Appended) ======
// This block was prepared to fix null .paused errors, make audio toggles robust,
// add safe fallbacks for missing DOM elements, and improve RSVP/message handling.
// It is intentionally wrapped in an IIFE to avoid leaking globals and to safely
// augment an existing script by attaching resilient event handlers.

(() => {
  'use strict';

  // ====== Config ======
  const WEDDING_DATE_ISO = '2025-09-24T07:00:00+08:00';
  const NOTIF_TIMEOUT = 2500;

  // State
  let backgroundMusic = null;
  let audioButton = null;
  let countdownTimer = null;

  // Helpers
  function $(sel, ctx = document) { return ctx.querySelector(sel); }
  function $all(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

  function safeGetAudio() {
    return document.getElementById('backgroundMusic')
      || document.getElementById('wedding-audio')
      || document.querySelector('audio');
  }

  function showNotificationEnhanced(text = 'Tindakan selesai', type = 'info') {
    const elId = 'copy-notification';
    const el = document.getElementById(elId);
    if (!el) { alert(text); return; }
    el.textContent = text;
    el.classList.remove('show', 'warning', 'error', 'success');
    el.classList.add('show');
    if (type === 'warning') el.classList.add('warning');
    if (type === 'error') el.classList.add('error');
    if (type === 'success') el.classList.add('success');
    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => el.classList.remove('show'), NOTIF_TIMEOUT);
  }

  function updateMusicButtonUI(isPlaying) {
    audioButton = audioButton || document.getElementById('audio-toggle') || document.querySelector('.music-toggle-btn');
    if (!audioButton) return;
    const icon = audioButton.querySelector('i') || audioButton;
    if (isPlaying) {
      audioButton.classList.add('is-playing');
      icon.classList.remove('fa-compact-disc');
      icon.classList.add('fa-volume-up');
      audioButton.setAttribute('aria-pressed', 'true');
    } else {
      audioButton.classList.remove('is-playing');
      icon.classList.remove('fa-volume-up');
      icon.classList.add('fa-compact-disc');
      audioButton.setAttribute('aria-pressed', 'false');
    }
  }

  function playBackgroundMusic() {
    backgroundMusic = backgroundMusic || safeGetAudio();
    if (!backgroundMusic) return;
    const p = backgroundMusic.play();
    if (p && p.then) {
      p.then(() => updateMusicButtonUI(true)).catch(err => {
        console.warn('Audio play prevented:', err);
        showNotificationEnhanced('Browser memblokir pemutaran otomatis. Tekan tombol musik untuk memulai.', 'warning');
      });
    } else {
      updateMusicButtonUI(!backgroundMusic.paused);
    }
    localStorage.setItem('wedding_audio_playing', '1');
  }

  function pauseBackgroundMusic() {
    backgroundMusic = backgroundMusic || safeGetAudio();
    if (!backgroundMusic) return;
    try { backgroundMusic.pause(); } catch (e) { console.warn(e); }
    updateMusicButtonUI(false);
    localStorage.setItem('wedding_audio_playing', '0');
  }

  function toggleMusic() {
    backgroundMusic = backgroundMusic || safeGetAudio();
    if (!backgroundMusic) {
      showNotificationEnhanced('Audio tidak ditemukan pada halaman ini.', 'warning');
      return;
    }
    const isPaused = typeof backgroundMusic.paused !== 'undefined' ? backgroundMusic.paused : true;
    if (isPaused) playBackgroundMusic(); else pauseBackgroundMusic();
  }

  function attachAudioToggle() {
    audioButton = document.getElementById('audio-toggle') || document.querySelector('.music-toggle-btn');
    backgroundMusic = safeGetAudio();
    if (audioButton) {
      audioButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMusic();
      });
    }
    const saved = localStorage.getItem('wedding_audio_playing');
    if (saved === '1') {
      setTimeout(() => {
        backgroundMusic = safeGetAudio();
        if (backgroundMusic) { playBackgroundMusic(); }
      }, 600);
    } else {
      updateMusicButtonUI(false);
    }
  }

  function openInvitationEnhanced(e) {
    if (e) e.preventDefault();
    const cover = document.getElementById('cover-page');
    const main = document.getElementById('main-content');
    if (cover) cover.classList.remove('active');
    if (main) main.classList.remove('hidden');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      backgroundMusic = safeGetAudio();
      if (backgroundMusic && backgroundMusic.paused) {
        playBackgroundMusic();
      }
    }, 250);
  }

  function startCountdown(targetIso = WEDDING_DATE_ISO) {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    const target = new Date(targetIso);
    function tick() {
      const now = new Date();
      let diff = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);
      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
      if (target.getTime() - Date.now() <= 0) clearInterval(countdownTimer);
    }
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function copyAccountEnhanced(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showNotificationEnhanced('Berhasil disalin!', 'success');
      }).catch(err => {
        console.warn('Clipboard write failed', err);
        showFallbackCopy(text);
      });
    } else {
      showFallbackCopy(text);
    }
  }

  function showFallbackCopy(text) {
    const tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed'; tmp.style.left = '-9999px';
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy'); showNotificationEnhanced('Berhasil disalin!', 'success'); }
    catch (e) { console.warn(e); alert('Salin: ' + text); }
    document.body.removeChild(tmp);
  }

  function handleRsvpSubmission() {
    const form = document.getElementById('rsvp-form');
    if (!form) return;
    const nameEl = form.querySelector('#guest-name') || form.querySelector('input[placeholder=\"Nama Anda\"]');
    const attendanceEl = form.querySelector('#attendance');
    const countEl = form.querySelector('#guest-count');
    const msgEl = form.querySelector('#guest-message');
    const payload = {
      name: nameEl ? nameEl.value.trim() : 'Anonim',
      attendance: attendanceEl ? attendanceEl.value : '',
      count: countEl ? countEl.value : '1',
      message: msgEl ? msgEl.value.trim() : '',
      timestamp: new Date().toISOString()
    };
    saveRsvpToFirestoreIfPossible(payload)
      .then(() => {
        showNotificationEnhanced('Terima kasih! Ucapan Anda telah terkirim.', 'success');
        form.reset();
        openWhatsAppConfirmation(payload);
      })
      .catch(err => {
        console.warn('Simpan RSVP gagal, akan coba kirim via WhatsApp', err);
        openWhatsAppConfirmation(payload);
      });
  }

  function openWhatsAppConfirmation(payload) {
    const number = '6285842614010';
    const text = `Konfirmasi%20Kehadiran%20-%20${encodeURIComponent(payload.name)}%0AStatus:%20${encodeURIComponent(payload.attendance)}%0AJumlah:%20${encodeURIComponent(payload.count)}%0AMessage:%20${encodeURIComponent(payload.message)}`;
    const url = `https://api.whatsapp.com/send?phone=${number}&text=${text}`;
    window.open(url, '_blank');
  }

  function saveRsvpToFirestoreIfPossible(payload) {
    return new Promise((resolve, reject) => {
      if (typeof getFirestore === 'function' && typeof collection === 'function' && typeof addDoc === 'function') {
        try {
          const db = getFirestore();
          addDoc(collection(db, 'rsvps'), payload).then(resolve).catch(reject);
          return;
        } catch (e) { console.warn('Firestore modular save failed', e); }
      }
      if (window.firebase && firebase.firestore) {
        try {
          firebase.firestore().collection('rsvps').add(payload).then(resolve).catch(reject);
          return;
        } catch (e) { console.warn('Firestore v8 save failed', e); }
      }
      try {
        const cache = JSON.parse(localStorage.getItem('rsvp_cache') || '[]');
        cache.unshift(payload);
        localStorage.setItem('rsvp_cache', JSON.stringify(cache.slice(0, 20)));
        resolve();
      } catch (e) { reject(e); }
    });
  }

  async function loadGuestMessages() {
    const container = document.getElementById('messages-list') || document.getElementById('messagesContainer');
    if (!container) return;
    try {
      if (typeof getFirestore === 'function' && typeof collection === 'function' && typeof query === 'function') {
        const db = getFirestore();
        const q = query(collection(db, 'messages'));
        const snap = await getDocs(q);
        if (!snap || snap.empty) { container.innerHTML = '<div class=\"no-messages\">Belum ada ucapan.</div>'; return; }
        container.innerHTML = '';
        snap.forEach(doc => {
          const d = doc.data();
          container.appendChild(renderMessageItem(d));
        });
        return;
      }
    } catch (e) { console.warn('Firestore modular read failed', e); }
    try {
      if (window.firebase && firebase.firestore) {
        const snap = await firebase.firestore().collection('messages').orderBy('timestamp', 'desc').get();
        if (!snap) { container.innerHTML = '<div class=\"no-messages\">Belum ada ucapan.</div>'; return; }
        container.innerHTML = '';
        snap.forEach(doc => container.appendChild(renderMessageItem(doc.data())));
        return;
      }
    } catch (e) { console.warn('Firestore v8 read failed', e); }
    const cache = JSON.parse(localStorage.getItem('rsvp_cache') || '[]');
    if (cache.length === 0) {
      container.innerHTML = '<div class=\"no-messages\">Belum ada ucapan yang dapat ditampilkan.</div>';
      return;
    }
    container.innerHTML = '';
    cache.forEach(item => container.appendChild(renderMessageItem(item)));
  }

  function renderMessageItem(data = {}) {
    const el = document.createElement('div');
    el.className = 'message-item';
    const name = escapeHtml(data.name || 'Anonim');
    const msg = escapeHtml(data.message || '');
    const attendance = data.attendance === 'hadir' ? 'Hadir' : (data.attendance || '-');
    el.innerHTML = `<div class=\"message-name\">${name}</div><div class=\"message-text\">${msg}</div><div class=\"message-meta\">${attendance}</div>`;
    return el;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function createRippleEffect(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.left = `${e.clientX - rect.left}px`;
    r.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 800);
  }

  function makeImagesFallback() {
    $all('img').forEach(img => {
      img.addEventListener('error', () => {
        if (!img.dataset._fallback) {
          img.dataset._fallback = '1';
          img.src = '/assets/placeholder.jpg';
        }
      });
    });
  }

  window.openMaps = function(nameOrAddress) {
    try {
      const q = encodeURIComponent(nameOrAddress || 'Masjid');
      const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
      window.open(url, '_blank');
    } catch (e) { console.warn(e); }
  };

  function initAnimations() {
    try { if (window.AOS && typeof AOS.init === 'function') AOS.init(); } catch (e) { console.warn('AOS not init', e); }
    try { if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); } catch (e) {}
  }

  function attachUIInteractions() {
    $all('.btn').forEach(b => b.addEventListener('click', createRippleEffect));
    $all('.copy-btn').forEach(b => b.addEventListener('click', (ev) => {
      const acc = ev.currentTarget.dataset.account || ev.currentTarget.getAttribute('data-account');
      if (acc) copyAccountEnhanced(acc);
    }));
    const openBtn = document.getElementById('open-invitation-btn') || document.querySelector('.open-invitation-btn');
    if (openBtn) openBtn.addEventListener('click', openInvitationEnhanced);
    const saveBtn = document.getElementById('save-date-btn');
    if (saveBtn) saveBtn.addEventListener('click', (e) => { e.preventDefault(); addEventToCalendar(); });
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) rsvpForm.addEventListener('submit', (e) => { e.preventDefault(); handleRsvpSubmission(); });
    attachAudioToggle();
    const showGift = document.getElementById('show-gift-btn');
    const hideGift = document.getElementById('hide-gift-btn');
    const giftDetails = document.getElementById('gift-details');
    if (showGift && giftDetails) showGift.addEventListener('click', () => { giftDetails.classList.remove('hidden'); showGift.classList.add('hidden'); hideGift.classList.remove('hidden'); });
    if (hideGift && giftDetails) hideGift.addEventListener('click', () => { giftDetails.classList.add('hidden'); showGift.classList.remove('hidden'); hideGift.classList.add('hidden'); });
  }

  function addEventToCalendar() {
    const start = new Date(WEDDING_DATE_ISO);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//INVIEE//Wedding Invite//ID',
      'BEGIN:VEVENT',
      `DTSTAMP:${toICSDate(new Date())}`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      'SUMMARY:Akad & Resepsi - Suriansyah & Sonia',
      'DESCRIPTION:Undangan Pernikahan - Terima kasih atas doa & kehadiran Anda',
      'LOCATION:Masjid Jabal Rahmah Mandin',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\\r\\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'wedding-invite.ics';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function toICSDate(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
  }

  function initApp() {
    document.documentElement.classList.remove('no-js');
    makeImagesFallback();
    attachUIInteractions();
    initAnimations();
    startCountdown();
    loadGuestMessages();
    const openBtn = document.getElementById('open-invitation-btn');
    if (openBtn) openBtn.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    setTimeout(initApp, 20);
  }

})();
