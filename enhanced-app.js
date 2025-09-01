// Enhanced Wedding Invitation JavaScript - Full Animation Version
// PENTING: Menggunakan import dari URL CDN Firebase + GSAP enhancements
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Global variables
let currentSession = 0;
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;

// Swipe detection variables
let xDown = null;
let yDown = null;
let isSwipeEnabled = true;
let swipeThreshold = 50;

// Animation variables
let masterTimeline;
let isAnimating = false;

// Konfigurasi Firebase
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

// Load GSAP from CDN
const gsapScript = document.createElement('script');
gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
gsapScript.onload = () => {
    console.log('GSAP loaded successfully');
    // Initialize app after GSAP is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
};
document.head.appendChild(gsapScript);

function initApp() {
    backgroundMusic = document.getElementById('backgroundMusic');
    setupNavigation();
    setupActionButtons();
    setupSwipeDetection();
    startCountdown();
    loadGuestMessages();
    showMusicEnableButton();
    createEnhancedBackgroundParticles();
    
    // Start from session 0 with enhanced entrance animation
    showSessionWithAnimation(0);
    
    // Initialize GSAP master timeline
    initializeGSAPAnimations();
}

// Enhanced GSAP Animation System
function initializeGSAPAnimations() {
    // Set initial states for all animated elements
    gsap.set(".session-content", { opacity: 0, y: 50, scale: 0.9 });
    gsap.set(".session-content h1, .session-content h2, .session-content h3", { 
        opacity: 0, 
        y: 30, 
        rotationX: -15 
    });
    gsap.set(".session-content p, .session-content .form-group", { 
        opacity: 0, 
        y: 20 
    });
    gsap.set(".btn", { 
        opacity: 0, 
        scale: 0.8, 
        rotation: -5 
    });
    gsap.set(".countdown-item", { 
        opacity: 0, 
        scale: 0.5, 
        rotation: 10 
    });
    gsap.set(".couple-photo", { 
        opacity: 0, 
        scale: 0, 
        rotation: 45 
    });
    
    // Create master timeline for smooth orchestration
    masterTimeline = gsap.timeline({ paused: true });
}

// Enhanced Session Animation
function showSessionWithAnimation(sessionNumber) {
    if (isAnimating) return;
    isAnimating = true;
    
    const currentSessionElement = document.getElementById(`session${currentSession}`);
    const newSessionElement = document.getElementById(`session${sessionNumber}`);
    
    // Exit animation for current session
    if (currentSessionElement && currentSession !== sessionNumber) {
        gsap.timeline()
            .to(currentSessionElement.querySelector('.session-content'), {
                duration: 0.5,
                opacity: 0,
                y: -30,
                scale: 0.95,
                rotationY: -15,
                ease: "power2.in"
            })
            .set(currentSessionElement, { className: "session hidden" });
    }
    
    // Prepare new session
    if (newSessionElement) {
        newSessionElement.classList.remove('hidden');
        newSessionElement.classList.add('active');
        
        // Entrance animation for new session
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                // Run specific animations for this session
                runSessionSpecificAnimations(sessionNumber);
            }
        });
        
        // Container entrance
        tl.fromTo(newSessionElement.querySelector('.session-content'), {
            opacity: 0,
            y: 50,
            scale: 0.9,
            rotationY: 15
        }, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            ease: "power3.out"
        });
        
        // Staggered content animation
        const contentElements = newSessionElement.querySelectorAll('h1, h2, h3, p, .form-group, .countdown-item, .btn');
        tl.fromTo(contentElements, {
            opacity: 0,
            y: 30,
            rotationX: -10
        }, {
            duration: 0.6,
            opacity: 1,
            y: 0,
            rotationX: 0,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4");
    }
    
    // Update navigation
    currentSession = sessionNumber;
    updateArrowButtons();
    updateDots();
}

// Session-specific animations
function runSessionSpecificAnimations(sessionNumber) {
    switch(sessionNumber) {
        case 0:
            animateInvitationTitle();
            break;
        case 1:
            animateCountdown();
            break;
        case 2:
            animateQuranVerse();
            break;
        case 3:
            animateCouplePhotos();
            break;
        case 4:
        case 5:
            animateEventDetails();
            break;
        case 6:
            animateRSVPForm();
            break;
        case 7:
            animateGuestMessages();
            break;
        case 8:
            animateBankAccounts();
            break;
        case 9:
            animateThankYou();
            break;
    }
}

// Specific animation functions
function animateInvitationTitle() {
    const title = document.querySelector('#session0 .invitation-title h1');
    const coupleNames = document.querySelector('#session0 .couple-names');
    const date = document.querySelector('#session0 .wedding-date');
    
    if (title && coupleNames && date) {
        gsap.timeline()
            .fromTo(title, {
                opacity: 0,
                scale: 0.5,
                rotation: -10
            }, {
                duration: 1.2,
                opacity: 1,
                scale: 1,
                rotation: 0,
                ease: "elastic.out(1, 0.8)"
            })
            .fromTo(coupleNames, {
                opacity: 0,
                x: -100,
                skewX: -15
            }, {
                duration: 1,
                opacity: 1,
                x: 0,
                skewX: 0,
                ease: "power3.out"
            }, "-=0.8")
            .fromTo(date, {
                opacity: 0,
                y: 50,
                scale: 0.8
            }, {
                duration: 0.8,
                opacity: 1,
                y: 0,
                scale: 1,
                ease: "back.out(1.7)"
            }, "-=0.6");
    }
}

function animateCountdown() {
    const countdownItems = document.querySelectorAll('#session1 .countdown-item');
    
    gsap.fromTo(countdownItems, {
        opacity: 0,
        scale: 0.3,
        rotation: 45,
        y: 100
    }, {
        duration: 1,
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        stagger: 0.15,
        ease: "elastic.out(1, 0.6)"
    });
}

function animateQuranVerse() {
    const verse = document.querySelector('#session2 .quran-verse');
    if (verse && !verse.classList.contains('animated')) {
        const text = verse.textContent;
        verse.textContent = '';
        verse.classList.add('animated');
        
        // Typewriter effect with GSAP
        let index = 0;
        const typewriterTl = gsap.timeline();
        
        typewriterTl.to({}, {
            duration: text.length * 0.03,
            onUpdate: function() {
                const progress = this.progress();
                const currentIndex = Math.floor(progress * text.length);
                if (currentIndex > index) {
                    verse.textContent = text.substring(0, currentIndex);
                    index = currentIndex;
                }
            },
            ease: "none"
        });
    }
}

function animateCouplePhotos() {
    const photos = document.querySelectorAll('#session3 .couple-photo');
    const divider = document.querySelector('#session3 .couple-divider');
    
    gsap.timeline()
        .fromTo(photos, {
            opacity: 0,
            scale: 0,
            rotation: 180
        }, {
            duration: 1.2,
            opacity: 1,
            scale: 1,
            rotation: 0,
            stagger: 0.3,
            ease: "elastic.out(1, 0.5)"
        })
        .fromTo(divider, {
            opacity: 0,
            scale: 2,
            rotation: 720
        }, {
            duration: 1,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "power3.out"
        }, "-=0.8");
}

function animateEventDetails() {
    const eventItems = document.querySelectorAll('.event-item');
    
    gsap.fromTo(eventItems, {
        opacity: 0,
        x: -100,
        rotationY: -45
    }, {
        duration: 0.8,
        opacity: 1,
        x: 0,
        rotationY: 0,
        stagger: 0.2,
        ease: "power3.out"
    });
}

function animateRSVPForm() {
    const formGroups = document.querySelectorAll('#session6 .form-group');
    const submitBtn = document.querySelector('#session6 .btn--primary');
    
    gsap.timeline()
        .fromTo(formGroups, {
            opacity: 0,
            x: -50,
            skewX: -10
        }, {
            duration: 0.6,
            opacity: 1,
            x: 0,
            skewX: 0,
            stagger: 0.1,
            ease: "power2.out"
        })
        .fromTo(submitBtn, {
            opacity: 0,
            scale: 0.5,
            rotation: -10
        }, {
            duration: 0.8,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "elastic.out(1, 0.6)"
        }, "-=0.3");
}

function animateGuestMessages() {
    const messages = document.querySelectorAll('#session7 .message-item');
    
    if (messages.length > 0) {
        gsap.fromTo(messages, {
            opacity: 0,
            y: 30,
            scale: 0.9
        }, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
}

function animateBankAccounts() {
    const bankItems = document.querySelectorAll('#session8 .bank-item');
    
    gsap.fromTo(bankItems, {
        opacity: 0,
        rotationX: -45,
        y: 50
    }, {
        duration: 0.8,
        opacity: 1,
        rotationX: 0,
        y: 0,
        stagger: 0.15,
        ease: "power3.out"
    });
}

function animateThankYou() {
    const content = document.querySelector('#session9 .thank-you-content');
    const signature = document.querySelector('#session9 .signature');
    
    gsap.timeline()
        .fromTo(content, {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            duration: 1,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out"
        })
        .fromTo(signature, {
            opacity: 0,
            scale: 0.5,
            rotation: -5
        }, {
            duration: 0.8,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "back.out(1.7)"
        }, "-=0.5");
}

// Enhanced Particle System
function createEnhancedBackgroundParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    // Placeholder images - use base64 or simple CSS shapes
    const particleTypes = [
        { 
            type: 'daisy',
            count: 20,
            color: '#F4C2C2'
        },
        { 
            type: 'sakura',
            count: 25,
            color: '#E6BF84'
        },
        {
            type: 'heart',
            count: 15,
            color: '#FF69B4'
        }
    ];

    particleTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${type.type}`;
            
            // Create CSS-based shapes as placeholders
            if (type.type === 'heart') {
                particle.style.background = `radial-gradient(circle, ${type.color} 60%, transparent 60%)`;
                particle.style.clipPath = 'polygon(50% 20%, 0% 0%, 0% 50%, 50% 100%, 100% 50%, 100% 0%)';
            } else {
                particle.style.background = `radial-gradient(circle, ${type.color} 40%, transparent 70%)`;
                particle.style.borderRadius = type.type === 'sakura' ? '50% 20% 50% 20%' : '50%';
            }
            
            const size = Math.random() * 20 + 10;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            container.appendChild(particle);
            animateEnhancedParticle(particle);
        }
    });
}

function animateEnhancedParticle(particle) {
    // Enhanced particle animation with GSAP
    gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: -100,
        rotation: Math.random() * 360,
        opacity: 0
    });

    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;

    gsap.timeline({ 
        delay: delay, 
        repeat: -1,
        onRepeat: () => {
            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: -100,
                opacity: 0
            });
        }
    })
    .to(particle, {
        opacity: Math.random() * 0.6 + 0.2,
        duration: 2,
        ease: "power2.out"
    })
    .to(particle, {
        y: window.innerHeight + 100,
        x: "+=" + (Math.random() * 300 - 150),
        rotation: "+=" + (Math.random() * 1080 - 540),
        ease: "none",
        duration: duration
    }, 0)
    .to(particle, {
        opacity: 0,
        duration: 3,
        ease: "power2.in"
    }, duration - 3);
}

// Enhanced Swipe Detection System
function setupSwipeDetection() {
    let startTime;
    let isTouch = false;
    
    // Touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse events for desktop testing
    document.addEventListener('mousedown', handleMouseStart, { passive: false });
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseEnd, { passive: false });
    
    function handleTouchStart(evt) {
        if (!isSwipeEnabled || isAnimating) return;
        evt.preventDefault();
        isTouch = true;
        const firstTouch = evt.touches[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
        startTime = Date.now();
    }
    
    function handleTouchMove(evt) {
        if (!xDown || !yDown || !isSwipeEnabled || isAnimating) return;
        evt.preventDefault();
    }
    
    function handleTouchEnd(evt) {
        if (!isSwipeEnabled || isAnimating || !isTouch) return;
        evt.preventDefault();
        isTouch = false;
        
        const touch = evt.changedTouches[0];
        processSwipe(touch.clientX, touch.clientY);
    }
    
    function handleMouseStart(evt) {
        if (!isSwipeEnabled || isAnimating || isTouch) return;
        xDown = evt.clientX;
        yDown = evt.clientY;
        startTime = Date.now();
    }
    
    function handleMouseMove(evt) {
        if (!xDown || !yDown || !isSwipeEnabled || isAnimating || isTouch) return;
    }
    
    function handleMouseEnd(evt) {
        if (!isSwipeEnabled || isAnimating || isTouch) return;
        processSwipe(evt.clientX, evt.clientY);
    }
    
    function processSwipe(xUp, yUp) {
        if (!xDown || !yDown) return;
        
        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;
        const timeDiff = Date.now() - startTime;
        
        // Minimum swipe distance and maximum time for swipe detection
        if (Math.abs(xDiff) < swipeThreshold && Math.abs(yDiff) < swipeThreshold) {
            resetSwipeValues();
            return;
        }
        
        if (timeDiff > 1000) { // Too slow to be a swipe
            resetSwipeValues();
            return;
        }
        
        // Determine swipe direction
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Horizontal swipe
            if (xDiff > 0) {
                // Swipe left - next session
                if (currentSession < 9) {
                    navigateToSessionWithSwipe(currentSession + 1);
                }
            } else {
                // Swipe right - previous session
                if (currentSession > 0) {
                    navigateToSessionWithSwipe(currentSession - 1);
                }
            }
        } else {
            // Vertical swipe
            if (yDiff > 0) {
                // Swipe up - next session
                if (currentSession < 9) {
                    navigateToSessionWithSwipe(currentSession + 1);
                }
            } else {
                // Swipe down - previous session
                if (currentSession > 0) {
                    navigateToSessionWithSwipe(currentSession - 1);
                }
            }
        }
        
        resetSwipeValues();
    }
    
    function resetSwipeValues() {
        xDown = null;
        yDown = null;
        startTime = null;
    }
}

function navigateToSessionWithSwipe(sessionNumber) {
    if (sessionNumber < 0 || sessionNumber > 9 || sessionNumber === currentSession || isAnimating) return;
    
    // Add swipe visual feedback
    createSwipeFeedback();
    
    // Navigate with animation
    setTimeout(() => {
        showSessionWithAnimation(sessionNumber);
    }, 100);
}

function createSwipeFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'swipe-feedback';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: var(--wedding-gold);
        border-radius: 50%;
        z-index: 10000;
        pointer-events: none;
    `;
    
    document.body.appendChild(feedback);
    
    gsap.fromTo(feedback, {
        scale: 0,
        opacity: 1
    }, {
        scale: 1.5,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
            document.body.removeChild(feedback);
        }
    });
}

// Navigation Functions (Enhanced)
function setupNavigation() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            if (!isAnimating) {
                navigateToSessionWithSwipe(parseInt(dot.dataset.session));
            }
        });
    });

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn?.addEventListener('click', () => {
        if (currentSession > 0 && !isAnimating) {
            navigateToSessionWithSwipe(currentSession - 1);
        }
    });
    
    nextBtn?.addEventListener('click', () => {
        if (currentSession < 9 && !isAnimating) {
            navigateToSessionWithSwipe(currentSession + 1);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        
        if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && currentSession > 0) {
            navigateToSessionWithSwipe(currentSession - 1);
        } else if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && currentSession < 9) {
            navigateToSessionWithSwipe(currentSession + 1);
        }
    });

    updateArrowButtons();
}

function updateDots() {
    document.querySelector('.dot.active')?.classList.remove('active');
    document.querySelector(`.dot[data-session='${currentSession}']`)?.classList.add('active');
}

function updateArrowButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentSession <= 0;
    if (nextBtn) nextBtn.disabled = currentSession >= 9;
}

// Enhanced Music Button (Transparent Background)
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
        background: rgba(230, 191, 132, 0.2);
        backdrop-filter: blur(10px);
        border: 2px solid var(--wedding-gold);
        color: var(--wedding-white);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    // Hover effect
    musicButton.addEventListener('mouseenter', () => {
        musicButton.style.background = 'rgba(230, 191, 132, 0.4)';
        musicButton.style.transform = 'scale(1.1)';
    });
    
    musicButton.addEventListener('mouseleave', () => {
        musicButton.style.background = 'rgba(230, 191, 132, 0.2)';
        musicButton.style.transform = 'scale(1)';
    });
    
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicButton.innerHTML = '🎵';
            
            // Animate button
            gsap.fromTo(musicButton, {
                scale: 1.1,
                rotation: 0
            }, {
                scale: 1,
                rotation: 360,
                duration: 0.6,
                ease: "back.out(1.7)"
            });
        } else {
            backgroundMusic.pause();
            musicButton.innerHTML = '🔇';
            
            // Animate button
            gsap.fromTo(musicButton, {
                scale: 1.1
            }, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    document.body.appendChild(musicButton);
    
    // Entrance animation for music button
    gsap.fromTo(musicButton, {
        scale: 0,
        rotation: -180,
        opacity: 0
    }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.6)",
        delay: 1
    });
}

// All other existing functions remain the same, but with enhanced animations
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

function openInvitation() {
    navigateToSessionWithSwipe(1);
    playBackgroundMusic();
}

function playBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.log('Auto-play dicegah:', error);
        });
    }
}

function pauseBackgroundMusic() {
    backgroundMusic?.pause();
}

function resumeBackgroundMusic() {
    if (backgroundMusic?.paused && !isVideoPlaying) {
        backgroundMusic.play().catch(error => console.log('Gagal melanjutkan musik:', error));
    }
}

// Session 1: Enhanced Countdown
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

            // Animate number changes
            animateNumberChange(daysEl, String(days).padStart(2, '0'));
            animateNumberChange(hoursEl, String(hours).padStart(2, '0'));
            animateNumberChange(minutesEl, String(minutes).padStart(2, '0'));
            animateNumberChange(secondsEl, String(seconds).padStart(2, '0'));
        }

        update();
        countdownInterval = setInterval(update, 1000);
    } catch (err) {
        console.error('[countdown] error saat memulai:', err);
    }
}

function animateNumberChange(element, newValue) {
    if (element.textContent !== newValue) {
        gsap.timeline()
            .to(element, {
                scale: 1.2,
                duration: 0.1,
                ease: "power2.out"
            })
            .set(element, { textContent: newValue })
            .to(element, {
                scale: 1,
                duration: 0.2,
                ease: "elastic.out(1, 0.6)"
            });
    }
}

// Keep all other existing functions but add animation enhancements where appropriate
async function saveTheDate() {
    const event = {
        title: 'Pernikahan Suriansyah & Sonia Agustina Oemar',
        start: '2025-09-24T07:00:00+08:00',
        end: '2025-09-24T17:00:00+08:00',
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar. \\n\\nJangan lupa hadir dan memberikan doa restu.',
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
            showNotification('Pilih aplikasi Kalender untuk menyimpan acara.');
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
        showNotification('File kalender (.ics) telah diunduh. Silakan buka file tersebut.');
    } catch (error) {
        console.error('Gagal membuat link unduhan:', error);
        showNotification('Gagal membuat file kalender. Silakan coba lagi.');
    }
}

async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur kepada Allah SWT, kami mengundang Bapak/Ibu/Saudara(i) menghadiri pernikahan Suriansyah & Sonia. Barakallahu lakuma wa baraka alaikuma.';
    const shareTitle = 'Undangan Pernikahan | Suriansyah & Sonia';
    const shareUrl = window.location.href;
    const imageUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/pemisah.jpeg';

    const fallbackTextShare = () => {
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText + '\n\n' + shareUrl,
                url: shareUrl
            }).catch(err => {
                copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
            });
        } else {
            copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
        }
    };

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Gagal memuat gambar');
        
        const imageBlob = await response.blob();
        const imageFile = new File([imageBlob], 'undangan.jpg', { type: 'image/jpeg' });
        const textBlob = new Blob([shareText + '\n\n' + shareUrl], { type: 'text/plain' });
        const textFile = new File([textBlob], 'undangan.txt', { type: 'text/plain' });
        const filesToShare = [imageFile, textFile];

        if (navigator.canShare && navigator.canShare({ files: filesToShare })) {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                files: filesToShare,
                url: shareUrl
            });
        } else {
            fallbackTextShare();
        }
    } catch (error) {
        console.warn('Gagal share dengan gambar, mencoba fallback teks:', error);
        fallbackTextShare();
    }
}

function openMaps() {
    const location = 'Masjid Jabal Rahmah Mandin';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
}

async function handleRsvpSubmission() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const attendanceInput = document.getElementById('attendance');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    const attendance = attendanceInput.value;

    if (!name || !message || !attendance) {
        showNotification('Mohon lengkapi nama, ucapan, dan konfirmasi kehadiran! ⚠️');
        return;
    }

    const isPublic = await showPrivacyPopup();
    if (isPublic === null) return;

    const success = await submitMessageToFirebase(name, message, attendance, isPublic);
    if (success) {
        showNotification('Ucapan Anda berhasil terkirim. Terima kasih!');
        nameInput.value = '';
        messageInput.value = '';
        attendanceInput.selectedIndex = 0;
    }
}

async function submitMessageToFirebase(name, message, attendance, isPublic) {
    if (!db) {
        showNotification("Gagal menyimpan ucapan: Database error.");
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
        showNotification("Terjadi kesalahan saat mengirim ucapan.");
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
                <h3>Apakah Anda ingin ucapan ini ditampilkan?</h3>
                <p>Ucapan Anda akan terlihat oleh tamu lain jika memilih "Ya"</p>
                <div class="popup-buttons">
                    <button class="btn btn--outline" id="privacy-no">Tidak</button>
                    <button class="btn btn--primary" id="privacy-yes">Ya</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popupContainer);
        
        // Animate popup entrance
        gsap.fromTo(popupContainer.querySelector('.popup-box'), {
            scale: 0.8,
            opacity: 0,
            y: 50
        }, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)"
        });
        
        document.getElementById('privacy-yes').onclick = () => {
            animatePopupExit(() => resolve(true));
        };
        
        document.getElementById('privacy-no').onclick = () => {
            animatePopupExit(() => resolve(false));
        };
        
        popupContainer.querySelector('.popup-overlay').onclick = () => {
            animatePopupExit(() => resolve(null));
        };
        
        function animatePopupExit(callback) {
            gsap.to(popupContainer.querySelector('.popup-box'), {
                scale: 0.8,
                opacity: 0,
                y: -50,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    document.body.removeChild(popupContainer);
                    callback();
                }
            });
        }
    });
}

async function loadGuestMessages() {
    if (!db) return;
    
    try {
        const q = query(
            collection(db, "messages"),
            where("isPublic", "==", true),
            orderBy("timestamp", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const messagesContainer = document.getElementById('guestMessages');
        
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            if (querySnapshot.empty) {
                messagesContainer.innerHTML = '<div class="no-messages">Belum ada ucapan dari tamu</div>';
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message-item';
                    messageDiv.innerHTML = `
                        <div class="message-name">${data.name}</div>
                        <div class="message-text">${data.message}</div>
                    `;
                    messagesContainer.appendChild(messageDiv);
                });
                
                // Animate messages if on messages session
                if (currentSession === 7) {
                    animateGuestMessages();
                }
            }
        }
    } catch (error) {
        console.error("Error loading messages: ", error);
    }
}

function copyAccount(accountNumber) {
    if (accountNumber) {
        copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin!');
    }
}

function copyToClipboard(text, successMessage) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage);
        }).catch(err => {
            fallbackCopyTextToClipboard(text, successMessage);
        });
    } else {
        fallbackCopyTextToClipboard(text, successMessage);
    }
}

function fallbackCopyTextToClipboard(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification(successMessage);
    } catch (err) {
        showNotification('Gagal menyalin teks');
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--wedding-gold);
        color: var(--wedding-black);
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        font-weight: 600;
        max-width: 300px;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Animate notification
    gsap.fromTo(notification, {
        opacity: 0,
        y: -50,
        scale: 0.8
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
    
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            y: -20,
            scale: 0.9,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }
        });
    }, 3000);
}
