// Wedding Invitation JavaScript - Enhanced with Mobile Fixes and Optimizations

class WeddingInvitation {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 10;
        this.isVideoPlaying = false;
        this.skipTimer = null;
        this.countdownTimer = null;
        this.weddingDate = new Date('2025-09-24T07:00:00+08:00');
        this.tutorialShown = false;
        this.isTransitioning = false;
        this.swipeStartY = 0;
        this.swipeEndY = 0;
        this.swipeStartTime = 0;
        this.tutorialTimeout = null;
        this.isFormInteracting = false; // Track form interaction state
        this.swipeDisabledZones = new Set(); // Track swipe-disabled zones
        
        // Firebase placeholder - Replace with actual config
        this.firebaseConfig = {
            // PLACEHOLDER_FIREBASE_CONFIG
            // apiKey: "your-api-key",
            // authDomain: "your-project.firebaseapp.com",
            // projectId: "your-project-id",
            // storageBucket: "your-project.appspot.com",
            // messagingSenderId: "123456789",
            // appId: "your-app-id"
        };
        
        this.init();
    }
    
    init() {
        this.extractGuestName();
        this.createFallingPetals();
        this.initializeFirebase();
        this.hideLoadingScreen();
        this.updateProgressIndicator();
        this.initializeSections();
        this.setupTutorial();
        this.setupFormSafeZones(); // Set up swipe-safe zones for forms
        this.updateArrowVisibility(); // Initialize arrow visibility
        // Setup event listeners after DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }
    
    hideHeavyEffectsDuringVideoPlay() {
      // Sembunyikan overlay dan animasi yang berat
      const overlays = document.querySelectorAll('.video-overlay, .petals-container, .some-other-heavy-animation');
      overlays.forEach(el => {
        if (!el.classList.contains('hidden')) {
          el.classList.add('hidden');
        }
      });
    }

    showHeavyEffectsAfterVideoPauseOrEnd() {
      const overlays = document.querySelectorAll('.video-overlay, .petals-container, .some-other-heavy-animation');
      overlays.forEach(el => {
        el.classList.remove('hidden');
      });
    }
    
    setupFormSafeZones() {
        // Mark all form safe zones
        const safeZones = document.querySelectorAll('[data-no-swipe], .form-safe-zone');
        safeZones.forEach(zone => {
            this.swipeDisabledZones.add(zone);
        });
        
        // Add form interaction listeners
        const formElements = document.querySelectorAll('input, textarea, select, button[type="submit"]');
        formElements.forEach(element => {
            element.addEventListener('focus', () => {
                this.isFormInteracting = true;
                console.log('Form interaction started');
            });
            
            element.addEventListener('blur', () => {
                // Delay to allow for quick focus switches
                setTimeout(() => {
                    if (!document.activeElement || !this.isFormElement(document.activeElement)) {
                        this.isFormInteracting = false;
                        console.log('Form interaction ended');
                    }
                }, 100);
            });
            
            // Handle touch events on form elements
            element.addEventListener('touchstart', (e) => {
                this.isFormInteracting = true;
                e.stopPropagation(); // Prevent parent touch handlers
            });
        });
    }
    
    isFormElement(element) {
        return element && (
            element.tagName === 'INPUT' ||
            element.tagName === 'TEXTAREA' ||
            element.tagName === 'SELECT' ||
            (element.tagName === 'BUTTON' && element.type === 'submit')
        );
    }
    
    isInSwipeDisabledZone(x, y) {
        const element = document.elementFromPoint(x, y);
        if (!element) return false;
        
        // Check if element or any parent has swipe disabled
        let current = element;
        while (current && current !== document.body) {
            if (current.hasAttribute('data-no-swipe') || 
                current.classList.contains('form-safe-zone') ||
                this.swipeDisabledZones.has(current)) {
                return true;
            }
            current = current.parentElement;
        }
        
        return false;
    }
    
    initializeSections() {
        // Show only the first section initially
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index === 0) {
                section.classList.remove('hidden');
                section.classList.add('visible');
                section.style.display = 'flex';
            } else {
                section.classList.add('hidden');
                section.classList.remove('visible');
                section.style.display = 'none';
            }
        });
    }
    
    setupTutorial() {
        // Show tutorial after 2 seconds on first visit
        this.tutorialTimeout = setTimeout(() => {
            if (!this.tutorialShown && this.currentSection === 0) {
                this.showTutorial();
            }
        }, 2000);
    }
    
    showTutorial() {
        const tutorialOverlay = document.getElementById('tutorialOverlay');
        const navPulseGuide = document.getElementById('navPulseGuide');
        
        if (tutorialOverlay) {
            tutorialOverlay.classList.remove('hidden');
            this.tutorialShown = true;
            
            // Add navigation pulse guide
            if (navPulseGuide) {
                navPulseGuide.style.opacity = '1';
                setTimeout(() => {
                    if (navPulseGuide) navPulseGuide.style.opacity = '0';
                }, 5000);
            }
            
            // Add body scroll lock
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideTutorial() {
        const tutorialOverlay = document.getElementById('tutorialOverlay');
        if (tutorialOverlay) {
            tutorialOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    updateArrowVisibility() {
        const arrowUp = document.getElementById('arrowNavUp');
        const arrowDown = document.getElementById('arrowNavDown');
        
        if (arrowUp) {
            if (this.currentSection === 0) {
                arrowUp.classList.add('hidden');
            } else {
                arrowUp.classList.remove('hidden');
            }
        }
        
        if (arrowDown) {
            if (this.currentSection === this.totalSections - 1) {
                arrowDown.classList.add('hidden');
            } else {
                arrowDown.classList.remove('hidden');
            }
        }
    }
    
    showArrows() {
        const arrowUp = document.getElementById('arrowNavUp');
        const arrowDown = document.getElementById('arrowNavDown');
        
        if (arrowUp && this.currentSection > 0) {
            arrowUp.classList.add('show');
        }
        if (arrowDown && this.currentSection < this.totalSections - 1) {
            arrowDown.classList.add('show');
        }
        
        // Hide arrows after 3 seconds
        setTimeout(() => {
            if (arrowUp) arrowUp.classList.remove('show');
            if (arrowDown) arrowDown.classList.remove('show');
        }, 3000);
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Arrow Navigation Buttons
        const arrowUpBtn = document.getElementById('arrowUpBtn');
        const arrowDownBtn = document.getElementById('arrowDownBtn');
        
        if (arrowUpBtn) {
            arrowUpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Arrow up clicked');
                if (this.currentSection > 0) {
                    this.goToSection(this.currentSection - 1, 'down');
                }
            });
            
            // Show arrow on hover/touch
            const arrowNavUp = document.getElementById('arrowNavUp');
            if (arrowNavUp) {
                arrowNavUp.addEventListener('mouseenter', () => {
                    if (this.currentSection > 0) {
                        arrowNavUp.classList.add('show');
                    }
                });
                arrowNavUp.addEventListener('mouseleave', () => {
                    arrowNavUp.classList.remove('show');
                });
                arrowNavUp.addEventListener('touchstart', () => {
                    if (this.currentSection > 0) {
                        arrowNavUp.classList.add('show', 'touched');
                    }
                });
                arrowNavUp.addEventListener('touchend', () => {
                    setTimeout(() => {
                        arrowNavUp.classList.remove('show', 'touched');
                    }, 1000);
                });
            }
        }
        
        if (arrowDownBtn) {
            arrowDownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Arrow down clicked');
                if (this.currentSection < this.totalSections - 1) {
                    this.goToSection(this.currentSection + 1, 'up');
                }
            });
            
            // Show arrow on hover/touch
            const arrowNavDown = document.getElementById('arrowNavDown');
            if (arrowNavDown) {
                arrowNavDown.addEventListener('mouseenter', () => {
                    if (this.currentSection < this.totalSections - 1) {
                        arrowNavDown.classList.add('show');
                    }
                });
                arrowNavDown.addEventListener('mouseleave', () => {
                    arrowNavDown.classList.remove('show');
                });
                arrowNavDown.addEventListener('touchstart', () => {
                    if (this.currentSection < this.totalSections - 1) {
                        arrowNavDown.classList.add('show', 'touched');
                    }
                });
                arrowNavDown.addEventListener('touchend', () => {
                    setTimeout(() => {
                        arrowNavDown.classList.remove('show', 'touched');
                    }, 1000);
                });
            }
        }
        
        // Tutorial controls
        const tutorialClose = document.getElementById('tutorialClose');
        const tutorialUnderstand = document.getElementById('tutorialUnderstand');
        const helpButton = document.getElementById('helpButton');
        
        if (tutorialClose) {
            tutorialClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Tutorial close clicked');
                this.hideTutorial();
            });
        }
        
        if (tutorialUnderstand) {
            tutorialUnderstand.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Tutorial understand clicked');
                this.hideTutorial();
            });
        }
        
        if (helpButton) {
            helpButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Help button clicked');
                this.showTutorial();
            });
        }
        
        // Close tutorial on overlay click
        const tutorialOverlay = document.getElementById('tutorialOverlay');
        if (tutorialOverlay) {
            tutorialOverlay.addEventListener('click', (e) => {
                if (e.target === tutorialOverlay) {
                    this.hideTutorial();
                }
            });
        }
        
        // Open invitation button - FIXED
        const openBtn = document.getElementById('openInvitationBtn');
        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Open invitation button clicked');
                if (this.tutorialTimeout) {
                    clearTimeout(this.tutorialTimeout);
                }
                this.goToSection(1);
            });
            console.log('Open invitation button listener attached');
        } else {
            console.error('Open invitation button not found');
        }
        
        // Skip video button - UPDATED to remove countdown
        const skipBtn = document.getElementById('skipVideoBtn');
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.skipVideo();
            });
        }
        
        // Music player
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMusic();
            });
        }
        
        // Video controls - REMOVED fullscreen button functionality
        const volumeBtn = document.getElementById('volumeBtn');
        if (volumeBtn) {
            volumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleVideoVolume();
            });
        }
        
        // Navigation dots - FIXED with better selector
        const navDots = document.querySelectorAll('.nav-dot');
        console.log(`Found ${navDots.length} navigation dots`);
        
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Navigation dot ${index} clicked, going to section ${index}`);
                this.goToSection(index);
            });
            
            // Add hover effect for better UX
            dot.addEventListener('mouseenter', () => {
                if (!dot.classList.contains('active')) {
                    dot.style.transform = 'scale(1.2)';
                }
            });
            
            dot.addEventListener('mouseleave', () => {
                if (!dot.classList.contains('active')) {
                    dot.style.transform = 'scale(1)';
                }
            });
            
            console.log(`Navigation dot ${index} listener attached`);
        });
        
        // RSVP form
        const rsvpForm = document.getElementById('rsvpForm');
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', (e) => {
                this.handleRSVPSubmission(e);
            });
        }
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.copyAccountNumber(e.target.dataset.account);
            });
        });
        
        // Save date button
        const saveDateBtn = document.getElementById('saveDateBtn');
        if (saveDateBtn) {
            saveDateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addToCalendar();
            });
        }
        
        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.shareInvitation();
            });
        }
        
        // Video section handling - UPDATED for mobile optimization
        const video = document.getElementById('cinematicVideo');
        if (video) {
            // Optimize video loading for mobile
            video.preload = 'metadata'; // Only load metadata initially
            video.addEventListener('loadeddata', () => {
                this.startSkipCountdown();
            });
            
            // Add mobile-specific optimizations
            if (this.isMobileDevice()) {
                video.muted = true;
                video.playsInline = true;
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('x5-playsinline', 'true');
            }
            // Request fullscreen when video plays
            video.addEventListener('play', () => {
                if (video.requestFullscreen) {
                  video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                  video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                  video.msRequestFullscreen();
                }
            });
            // Start countdown immediately if video exists
            setTimeout(() => {
                this.startSkipCountdown();
            }, 1000);
        }
        
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
        
        // Enhanced touch gestures for mobile with form protection
        this.setupTouchGestures();
        
        // Mouse wheel navigation
        this.setupMouseWheelNavigation();
        
        // Prevent default touch behaviors that might interfere
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        console.log('All event listeners setup complete');
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    setupMouseWheelNavigation() {
        let wheelTimeout = null;
        
        document.addEventListener('wheel', (e) => {
            // Don't navigate if user is interacting with forms
            if (this.isFormInteracting) {
                return;
            }
            
            // Prevent default scrolling
            e.preventDefault();
            
            // Debounce wheel events
            if (wheelTimeout) return;
            
            wheelTimeout = setTimeout(() => {
                wheelTimeout = null;
            }, 300);
            
            if (this.isTransitioning) return;
            
            const delta = e.deltaY;
            const threshold = 80;
            
            if (delta > threshold && this.currentSection < this.totalSections - 1) {
                // Scroll down - next section
                console.log('Wheel scroll down detected');
                this.goToSection(this.currentSection + 1, 'up');
            } else if (delta < -threshold && this.currentSection > 0) {
                // Scroll up - previous section
                console.log('Wheel scroll up detected');
                this.goToSection(this.currentSection - 1, 'down');
            }
        }, { passive: false });
    }
    
    setupTouchGestures() {
        let startY = 0;
        let startX = 0;
        let startTime = 0;
        let isScrolling = false;
        let touchStartElement = null;
        
        const handleTouchStart = (e) => {
            // Only handle single touch
            if (e.touches.length !== 1) return;
            
            const touch = e.touches[0];
            startY = touch.clientY;
            startX = touch.clientX;
            startTime = Date.now();
            isScrolling = false;
            touchStartElement = e.target;
            
            this.swipeStartY = startY;
            this.swipeStartTime = startTime;
            
            // Check if touch started in a swipe-disabled zone
            if (this.isInSwipeDisabledZone(touch.clientX, touch.clientY)) {
                console.log('Touch started in swipe-disabled zone');
                return;
            }
        };
        
        const handleTouchMove = (e) => {
            if (e.touches.length !== 1) return;
            
            const touch = e.touches[0];
            const currentY = touch.clientY;
            const currentX = touch.clientX;
            const deltaY = Math.abs(currentY - startY);
            const deltaX = Math.abs(currentX - startX);
            
            // Check if we're in a form interaction area
            if (this.isFormInteracting || 
                this.isInSwipeDisabledZone(touch.clientX, touch.clientY)) {
                return; // Allow normal scrolling/interaction
            }
            
            // Determine if this is a vertical or horizontal scroll
            if (!isScrolling && (deltaY > 10 || deltaX > 10)) {
                isScrolling = deltaY > deltaX;
                
                // If it's a vertical swipe and delta is significant, prevent default
                if (isScrolling && deltaY > 30) {
                    e.preventDefault();
                }
            }
        };
        
        const handleTouchEnd = (e) => {
            if (e.changedTouches.length !== 1) return;
            
            const touch = e.changedTouches[0];
            const endY = touch.clientY;
            const endTime = Date.now();
            const deltaY = startY - endY;
            const deltaTime = endTime - startTime;
            const velocity = Math.abs(deltaY) / deltaTime;
            
            this.swipeEndY = endY;
            
            // Don't process swipes if:
            // 1. User is interacting with forms
            // 2. Touch started or ended in swipe-disabled zone
            // 3. Touch started on a form element
            if (this.isFormInteracting || 
                this.isInSwipeDisabledZone(touch.clientX, touch.clientY) ||
                this.isFormElement(touchStartElement)) {
                console.log('Swipe blocked due to form interaction');
                return;
            }
            
            // Only process swipes that are:
            // 1. Primarily vertical (not horizontal scrolling)
            // 2. Have sufficient distance (>80px for mobile) OR sufficient velocity (>0.4px/ms)
            // 3. Completed within reasonable time (<800ms)
            const minDistance = this.isMobileDevice() ? 100 : 65;
            const minVelocity = 0.6;
            const maxTime = 800;
            
            if (isScrolling && 
                (Math.abs(deltaY) > minDistance || velocity > minVelocity) &&
                deltaTime < maxTime &&
                !this.isTransitioning) {
                
                console.log(`Swipe detected: deltaY=${deltaY}, velocity=${velocity}`);
                this.handleSwipe(deltaY);
                
                // Haptic feedback if available
                this.triggerHapticFeedback();
            }
        };
        
        // Add touch event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Store references for potential cleanup
        this.touchHandlers = {
            touchstart: handleTouchStart,
            touchmove: handleTouchMove,
            touchend: handleTouchEnd
        };
    }
    
    handleSwipe(deltaY) {
        const swipeThreshold = this.isMobileDevice() ? 80 : 50;
        
        if (Math.abs(deltaY) > swipeThreshold) {
            if (deltaY > 0 && this.currentSection < this.totalSections - 1) {
                // Swipe up - next section
                console.log('Swiping to next section');
                this.goToSection(this.currentSection + 1, 'up');
                this.showSwipeIndicator('next');
            } else if (deltaY < 0 && this.currentSection > 0) {
                // Swipe down - previous section
                console.log('Swiping to previous section');
                this.goToSection(this.currentSection - 1, 'down');
                this.showSwipeIndicator('prev');
            }
        }
    }
    
    showSwipeIndicator(direction) {
    }
    
    triggerHapticFeedback() {
        // Haptic feedback for supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // iOS haptic feedback
        if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
            // Light haptic feedback
            if ('hapticFeedback' in navigator) {
                navigator.hapticFeedback.impact('light');
            }
        }
    }
    
    extractGuestName() {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('guest') || urlParams.get('to') || '[Nama Tamu]';
        const guestDisplay = document.getElementById('guestNameDisplay');
        const rsvpName = document.getElementById('rsvpName');
        
        if (guestDisplay) {
            guestDisplay.textContent = guestName;
        }
        if (rsvpName && guestName !== '[Nama Tamu]') {
            rsvpName.value = guestName;
        }
    }
    
    createFallingPetals() {
        const container = document.getElementById('petalsContainer');
        if (!container) return;
        
        const petalSymbols = ['🌼'];
        
        const createPetal = () => {
            if (Math.random() > 0.3) return; // 70% chance to not create a petal
            
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.innerHTML = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
            
            // Random horizontal position
            petal.style.left = Math.random() * 100 + '%';
            
            // Random animation duration and delay
            const duration = 5 + Math.random() * 5; // 5-10 seconds
            const delay = Math.random() * 2; // 0-2 seconds delay
            
            petal.style.animation = `fall ${duration}s linear ${delay}s forwards`;
            
            container.appendChild(petal);
            
            // Remove petal after animation
            setTimeout(() => {
                if (petal.parentNode) {
                    petal.parentNode.removeChild(petal);
                }
            }, (duration + delay) * 1000);
        };
        
        // Create petals at intervals
        setInterval(createPetal, 300);
    }
    
    initializeFirebase() {
        // Firebase initialization placeholder
        // Mock data for demonstration
        this.loadMockWishes();
    }
    
    loadMockWishes() {
        const mockWishes = [
            {
                name: "Ahmad & Siti",
                message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
                date: new Date().toLocaleDateString('id-ID'),
                likes: 5
            },
            {
                name: "Keluarga Besar Rahman",
                message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair. Selamat menempuh hidup baru!",
                date: new Date().toLocaleDateString('id-ID'),
                likes: 8
            },
            {
                name: "Teman Kerja",
                message: "Selamat menikah! Semoga pernikahan kalian dipenuhi kebahagiaan dan berkah dari Allah SWT.",
                date: new Date().toLocaleDateString('id-ID'),
                likes: 3
            }
        ];
        
        setTimeout(() => {
            this.displayWishes(mockWishes);
        }, 1000);
    }
    
    displayWishes(wishes) {
        const container = document.getElementById('wishesContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        wishes.forEach(wish => {
            const wishCard = document.createElement('div');
            wishCard.className = 'wish-card';
            wishCard.innerHTML = `
                <div class="wish-header">
                    <div class="wish-name">${wish.name}</div>
                    <div class="wish-date">${wish.date}</div>
                </div>
                <div class="wish-message">${wish.message}</div>
                <div class="wish-actions">
                    <button class="heart-btn" data-likes="${wish.likes}">
                        ❤️ <span class="like-count">${wish.likes}</span>
                    </button>
                </div>
            `;
            
            const heartBtn = wishCard.querySelector('.heart-btn');
            heartBtn.addEventListener('click', () => {
                this.toggleWishLike(heartBtn);
            });
            
            container.appendChild(wishCard);
        });
    }
    
    toggleWishLike(button) {
        const likeCountSpan = button.querySelector('.like-count');
        let currentLikes = parseInt(button.dataset.likes);
        
        if (button.classList.contains('liked')) {
            currentLikes--;
            button.classList.remove('liked');
        } else {
            currentLikes++;
            button.classList.add('liked');
        }
        
        button.dataset.likes = currentLikes;
        likeCountSpan.textContent = currentLikes;
        
        // Haptic feedback
        this.triggerHapticFeedback();
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2000);
    }
    
    goToSection(sectionIndex, direction = null) {
        if (sectionIndex < 0 || sectionIndex >= this.totalSections) return;
        
        if (this.isTransitioning) {
            console.log('Navigation blocked - transition in progress');
            return;
        }
        
        console.log(`Navigating to section ${sectionIndex} from ${this.currentSection}`);
        
        this.isTransitioning = true;
        
        // Clear form interaction state when navigating
        this.isFormInteracting = false;
        
        // Clear tutorial timeout if navigating away from welcome
        if (this.tutorialTimeout && sectionIndex !== 0) {
            clearTimeout(this.tutorialTimeout);
        }
        
        // Handle video section special behavior
        if (this.currentSection === 1 && sectionIndex !== 1) {
            this.pauseVideo();
        } else if (sectionIndex === 1) {
            setTimeout(() => {
                this.playVideo();
            }, 300);
        }
        
        // Determine transition direction if not provided
        if (!direction) {
            direction = sectionIndex > this.currentSection ? 'up' : 'down';
        }
        
        // Hide all sections first
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('visible', 'section-transition-up', 'section-transition-down');
            section.style.display = 'none';
        });
        
        // Show target section with animation
        const targetSection = document.getElementById(`section${sectionIndex}`);
        if (targetSection) {
            targetSection.style.display = 'flex';
            
            // Force reflow
            targetSection.offsetHeight;
            
            setTimeout(() => {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('visible');
                
                // Add transition animation
                if (direction === 'up') {
                    targetSection.classList.add('section-transition-up');
                } else {
                    targetSection.classList.add('section-transition-down');
                }
                
                // Remove transition class after animation
                setTimeout(() => {
                    targetSection.classList.remove('section-transition-up', 'section-transition-down');
                    this.isTransitioning = false;
                    console.log(`Navigation to section ${sectionIndex} complete`);
                }, 600);
            }, 50);
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            console.error(`Section ${sectionIndex} not found`);
            this.isTransitioning = false;
        }
        
        // Update navigation
        this.updateNavigation(sectionIndex);
        this.currentSection = sectionIndex;
        
        // Update arrow visibility based on new section
        this.updateArrowVisibility();
        
        // Start countdown if on countdown section
        if (sectionIndex === 2) {
            setTimeout(() => {
                this.startCountdown();
            }, 500);
        } else {
            this.stopCountdown();
        }
        
        this.updateProgressIndicator();
        
        // Haptic feedback for navigation
        this.triggerHapticFeedback();
        
        // REMOVED: Navigation toast notifications are no longer shown
    }
    
    updateNavigation(activeIndex) {
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    updateProgressIndicator() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = (this.currentSection / (this.totalSections - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    // UPDATED: Remove countdown timer display, only show "Skip" text
    startSkipCountdown() {
        const skipBtn = document.getElementById('skipVideoBtn');
        
        if (!skipBtn) return;
        
        // Make skip button available immediately
        skipBtn.style.opacity = '1';
        skipBtn.style.pointerEvents = 'auto';
        skipBtn.classList.add('ready');
        
        // Remove any countdown elements if they exist
        const countdownElement = skipBtn.querySelector('.countdown');
        if (countdownElement) {
            countdownElement.remove();
        }
        
        // Ensure only "Skip" text is shown
        const skipText = skipBtn.querySelector('span');
        if (skipText) {
            skipText.textContent = 'Skip';
        }
    }
    
    skipVideo() {
        if (this.skipTimer) {
            clearInterval(this.skipTimer);
        }
        this.goToSection(2, 'up');
    }
    
    playVideo() {
        const video = document.getElementById('cinematicVideo');
        if (video) {
            // Mobile optimization: lower quality settings if possible
            if (this.isMobileDevice()) {
                video.preload = 'metadata';
                video.load(); // Reload with new settings
            }
            
            video.play().catch(console.error);
            this.isVideoPlaying = true;
        }
    }
    
    pauseVideo() {
        const video = document.getElementById('cinematicVideo');
        if (video) {
            video.pause();
            this.isVideoPlaying = false;
        }
    }
    
    toggleVideoVolume() {
        const video = document.getElementById('cinematicVideo');
        const volumeBtn = document.getElementById('volumeBtn');
        
        if (video && volumeBtn) {
            video.muted = !video.muted;
            volumeBtn.textContent = video.muted ? '🔇' : '🔊';
        }
    }
    
    toggleMusic() {
        const audio = document.getElementById('backgroundMusic');
        const toggleBtn = document.getElementById('musicToggle');
        
        if (audio && toggleBtn) {
            if (audio.paused) {
                audio.play().then(() => {
                    toggleBtn.classList.add('playing');
                    toggleBtn.innerHTML = '<span class="music-icon">🎵</span>';
                }).catch(console.error);
            } else {
                audio.pause();
                toggleBtn.classList.remove('playing');
                toggleBtn.innerHTML = '<span class="music-icon">🔇</span>';
            }
        }
    }
    
    startCountdown() {
        this.stopCountdown(); // Clear any existing countdown
        
        this.countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = this.weddingDate.getTime() - now;
            
            if (distance < 0) {
                this.stopCountdown();
                this.showCountdownComplete();
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            this.updateCountdownDisplay(days, hours, minutes, seconds);
        }, 1000);
    }
    
    stopCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }
    
    updateCountdownDisplay(days, hours, minutes, seconds) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    showCountdownComplete() {
        const countdownSection = document.querySelector('.countdown-timer');
        if (countdownSection) {
            countdownSection.innerHTML = `
                <div class="countdown-complete">
                    <h3 class="gradient-text">Hari Bahagia Telah Tiba! 🎉</h3>
                    <p>Terima kasih telah menjadi bagian dari perjalanan cinta kami</p>
                </div>
            `;
        }
    }
    
    // UPDATED: Simplified RSVP form without "Acara yang dihadiri"
    handleRSVPSubmission(e) {
        e.preventDefault();
        
        const rsvpData = {
            name: document.getElementById('rsvpName')?.value,
            guestCount: document.getElementById('guestCount')?.value,
            attendance: document.querySelector('input[name="attendance"]:checked')?.value,
            message: document.getElementById('wishMessage')?.value,
            displayWish: document.getElementById('displayWish')?.checked,
            timestamp: new Date()
        };
        
        if (!rsvpData.name || !rsvpData.attendance) {
            this.showToast('Mohon lengkapi data yang diperlukan', 'error');
            return;
        }
        
        // Handle wish submission
        if (rsvpData.message) {
            if (rsvpData.displayWish) {
                this.submitWishToFirebase(rsvpData);
            } else {
                this.redirectToWhatsApp(rsvpData);
                return;
            }
        }
        
        this.submitRSVP(rsvpData);
    }
    
    submitRSVP(data) {
        // Mock submission
        setTimeout(() => {
            this.showToast('RSVP berhasil dikirim!', 'success');
            this.clearRSVPForm();
            if (data.displayWish && data.message) {
                this.addWishToDisplay(data);
            }
        }, 1000);
    }
    
    submitWishToFirebase(data) {
        // Firebase wish submission placeholder
    }
    
    addWishToDisplay(data) {
        const container = document.getElementById('wishesContainer');
        if (!container) return;
        
        const wishCard = document.createElement('div');
        wishCard.className = 'wish-card';
        wishCard.innerHTML = `
            <div class="wish-header">
                <div class="wish-name">${data.name}</div>
                <div class="wish-date">${new Date().toLocaleDateString('id-ID')}</div>
            </div>
            <div class="wish-message">${data.message}</div>
            <div class="wish-actions">
                <button class="heart-btn" data-likes="0">
                    ❤️ <span class="like-count">0</span>
                </button>
            </div>
        `;
        
        const heartBtn = wishCard.querySelector('.heart-btn');
        heartBtn.addEventListener('click', () => {
            this.toggleWishLike(heartBtn);
        });
        
        container.insertBefore(wishCard, container.firstChild);
    }
    
    // UPDATED: Simplified WhatsApp message without event selection
    redirectToWhatsApp(data) {
        const message = `Halo Suriansyah & Sonia Agustina,

RSVP dari: ${data.name}
Jumlah tamu: ${data.guestCount}
Kehadiran: ${data.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir'}

Ucapan: ${data.message}

Terima kasih! 🙏`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/085251815099?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        this.showToast('Mengalihkan ke WhatsApp...', 'info');
        this.clearRSVPForm();
    }
    
    clearRSVPForm() {
        const form = document.getElementById('rsvpForm');
        const rsvpName = document.getElementById('rsvpName');
        const guestDisplay = document.getElementById('guestNameDisplay');
        
        if (form) form.reset();
        if (rsvpName && guestDisplay && guestDisplay.textContent !== '[Nama Tamu]') {
            rsvpName.value = guestDisplay.textContent;
        }
        
        // Reset form interaction state
        this.isFormInteracting = false;
    }
    
    copyAccountNumber(accountId) {
        const accountElement = document.getElementById(accountId);
        if (!accountElement) return;
        
        const accountNumber = accountElement.textContent;
        
        navigator.clipboard.writeText(accountNumber).then(() => {
            this.showToast('Nomor rekening berhasil disalin!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = accountNumber;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showToast('Nomor rekening berhasil disalin!', 'success');
            } catch (err) {
                this.showToast('Gagal menyalin nomor rekening', 'error');
            }
            
            document.body.removeChild(textArea);
        });
        
        // Haptic feedback
        this.triggerHapticFeedback();
    }
    
    addToCalendar() {
        const startDate = new Date('2025-09-24T07:00:00+08:00');
        const endDate = new Date('2025-09-24T17:00:00+08:00');
        
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const eventDetails = {
            title: 'Pernikahan Suriansyah & Sonia Agustina',
            start: formatDate(startDate),
            end: formatDate(endDate),
            description: 'Akad Nikah: 07.00-08.00 WITA di Masjid Jabal Rahmah Mandin, Kotabaru\\nResepsi: 08.00 WITA di Rumah Mempelai Wanita',
            location: 'Masjid Jabal Rahmah Mandin, Kotabaru'
        };
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        
        window.open(googleCalendarUrl, '_blank');
        this.showToast('Mengarahkan ke Google Calendar...', 'info');
    }
    
    shareInvitation() {
        const shareData = {
            title: 'Undangan Pernikahan Suriansyah & Sonia Agustina',
            text: 'Kami mengundang Anda dalam pernikahan kami pada 24 September 2025',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('Link undangan berhasil disalin!', 'success');
            }).catch(() => {
                this.showToast('Gagal membagikan undangan', 'error');
            });
        }
    }
    
    handleKeyNavigation(e) {
        // Don't handle keys if tutorial is open or user is interacting with forms
        if (!document.getElementById('tutorialOverlay').classList.contains('hidden') || 
            this.isFormInteracting) {
            if (e.key === 'Escape') {
                this.hideTutorial();
            }
            return;
        }
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // Spacebar
                e.preventDefault();
                if (this.currentSection < this.totalSections - 1) {
                    this.goToSection(this.currentSection + 1, 'up');
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (this.currentSection > 0) {
                    this.goToSection(this.currentSection - 1, 'down');
                }
                break;
            case 'Home':
                e.preventDefault();
                this.goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSection(this.totalSections - 1);
                break;
            case 'Escape':
                if (this.currentSection === 1) {
                    this.skipVideo();
                }
                break;
            case 'h':
            case 'H':
            case '?':
                e.preventDefault();
                this.showTutorial();
                break;
        }
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
    
    // Cleanup method for potential memory leaks
    destroy() {
        // Clear timers
        if (this.skipTimer) clearInterval(this.skipTimer);
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        if (this.tutorialTimeout) clearTimeout(this.tutorialTimeout);
        
        // Remove event listeners if needed
        if (this.touchHandlers) {
            document.removeEventListener('touchstart', this.touchHandlers.touchstart);
            document.removeEventListener('touchmove', this.touchHandlers.touchmove);
            document.removeEventListener('touchend', this.touchHandlers.touchend);
        }
    }
}

// Additional utility functions
const Utils = {
    // Format date for Indonesian locale
    formatDateID: (date) => {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if device is mobile
    isMobile: () => {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },
    
    // Smooth scroll to element
    smoothScrollTo: (element, offset = 0) => {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    // Check if device supports touch
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Get swipe direction
    getSwipeDirection: (startX, startY, endX, endY) => {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing wedding invitation...');
    const invitation = new WeddingInvitation();
    
    // Make invitation instance globally available for debugging
    window.weddingInvitation = invitation;
    
    // Add viewport meta tag adjustment for mobile
    if (Utils.isMobile()) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }
    
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service Worker can be added here for offline capabilities
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeddingInvitation, Utils };
}
