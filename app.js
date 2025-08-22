// Wedding Invitation JavaScript - Optimized without Swipe/Mouse Navigation

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
        this.tutorialTimeout = null;
        this.isFormInteracting = false;
        this.swipeDisabledZones = new Set();
        
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
        this.createFallingPetals(); // Updated to use only white daisies
        this.initializeFirebase();
        this.hideLoadingScreen();
        this.updateProgressIndicator();
        this.initializeSections();
        this.setupTutorial();
        this.setupFormSafeZones();
        this.updateArrowVisibility();
        // Setup event listeners after DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }
    
    // MOBILE VIDEO OPTIMIZATION - Stop heavy animations during video play
    hideHeavyEffectsDuringVideoPlay() {
        console.log('Stopping heavy animations for video optimization');
        const petalsContainer = document.getElementById('petalsContainer');
        const videoSection = document.getElementById('section1');
        
        if (petalsContainer) {
            petalsContainer.style.display = 'none';
        }
        
        if (videoSection) {
            videoSection.classList.add('playing');
        }
        
        // Stop other heavy animations
        document.body.style.setProperty('--animation-play-state', 'paused');
    }

    showHeavyEffectsAfterVideoPauseOrEnd() {
        console.log('Resuming heavy animations after video');
        const petalsContainer = document.getElementById('petalsContainer');
        const videoSection = document.getElementById('section1');
        
        if (petalsContainer) {
            petalsContainer.style.display = 'block';
        }
        
        if (videoSection) {
            videoSection.classList.remove('playing');
        }
        
        // Resume animations
        document.body.style.setProperty('--animation-play-state', 'running');
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
                setTimeout(() => {
                    if (!document.activeElement || !this.isFormElement(document.activeElement)) {
                        this.isFormInteracting = false;
                        console.log('Form interaction ended');
                    }
                }, 100);
            });
            
            element.addEventListener('touchstart', (e) => {
                this.isFormInteracting = true;
                e.stopPropagation();
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
    
    initializeSections() {
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
            
            if (navPulseGuide) {
                navPulseGuide.style.opacity = '1';
                setTimeout(() => {
                    if (navPulseGuide) navPulseGuide.style.opacity = '0';
                }, 5000);
            }
            
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
        
        const tutorialOverlay = document.getElementById('tutorialOverlay');
        if (tutorialOverlay) {
            tutorialOverlay.addEventListener('click', (e) => {
                if (e.target === tutorialOverlay) {
                    this.hideTutorial();
                }
            });
        }
        
        // Open invitation button
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
        
        // Skip video button
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
        
        // Video controls
        const volumeBtn = document.getElementById('volumeBtn');
        if (volumeBtn) {
            volumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleVideoVolume();
            });
        }
        
        // Navigation dots
        const navDots = document.querySelectorAll('.nav-dot');
        console.log(`Found ${navDots.length} navigation dots`);
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Navigation dot ${index} clicked, going to section ${index}`);
                this.goToSection(index);
            });
            
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
        
        // Video section handling - ENHANCED FOR MOBILE OPTIMIZATION
        const video = document.getElementById('cinematicVideo');
        if (video) {
            // Mobile optimization
            video.preload = 'metadata';
            
            // Video event listeners for performance optimization
            video.addEventListener('loadeddata', () => {
                this.startSkipCountdown();
            });
            
            video.addEventListener('play', () => {
                console.log('Video started playing - optimizing performance');
                this.hideHeavyEffectsDuringVideoPlay();
                this.isVideoPlaying = true;
            });
            
            video.addEventListener('pause', () => {
                console.log('Video paused - resuming effects');
                this.showHeavyEffectsAfterVideoPauseOrEnd();
                this.isVideoPlaying = false;
            });
            
            video.addEventListener('ended', () => {
                console.log('Video ended - resuming effects');
                this.showHeavyEffectsAfterVideoPauseOrEnd();
                this.isVideoPlaying = false;
            });
            
            // Mobile-specific optimizations
            if (this.isMobileDevice()) {
                video.muted = true;
                video.playsInline = true;
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('x5-playsinline', 'true');
                
                // Additional mobile video optimizations
                video.style.willChange = 'auto';
                video.style.transform = 'translateZ(0)';
            }
            
            // Start countdown immediately if video exists
            setTimeout(() => {
                this.startSkipCountdown();
            }, 1000);
        }
        
        // Keyboard navigation only (no mouse wheel or touch gestures)
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
        
        console.log('All event listeners setup complete');
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }
    
    // REMOVED: setupMouseWheelNavigation() - per user request
    // REMOVED: setupTouchGestures() - per user request
    
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
    
    // UPDATED: Only white daisy petals
    createFallingPetals() {
        const container = document.getElementById('petalsContainer');
        if (!container) return;

        const petalSymbols = ['🌼']; // Only white daisy as requested
        
        const createPetal = () => {
            if (Math.random() > 0.3) return; // 70% chance to not create a petal
            
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.innerHTML = petalSymbols[0]; // Always white daisy
            
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
                    <button class="heart-btn" onclick="this.classList.toggle('liked')">
                        ❤️ ${wish.likes}
                    </button>
                </div>
            `;
            container.appendChild(wishCard);
        });
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2000);
    }
    
    updateProgressIndicator() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = ((this.currentSection + 1) / this.totalSections) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    updateNavigation() {
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            if (index === this.currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        this.updateProgressIndicator();
        this.updateArrowVisibility();
    }
    
    goToSection(sectionIndex, direction = 'up') {
        if (this.isTransitioning || sectionIndex < 0 || sectionIndex >= this.totalSections) {
            return;
        }
        
        this.isTransitioning = true;
        
        // Hide current section
        const currentSection = document.getElementById(`section${this.currentSection}`);
        if (currentSection) {
            currentSection.classList.add('hidden');
            currentSection.classList.remove('visible');
            currentSection.style.display = 'none';
        }
        
        // Show new section
        const newSection = document.getElementById(`section${sectionIndex}`);
        if (newSection) {
            newSection.style.display = 'flex';
            newSection.classList.remove('hidden');
            newSection.classList.add('visible');
            
            // Add transition class based on direction
            if (direction === 'up') {
                newSection.classList.add('section-transition-up');
            } else {
                newSection.classList.add('section-transition-down');
            }
            
            // Remove transition class after animation
            setTimeout(() => {
                newSection.classList.remove('section-transition-up', 'section-transition-down');
            }, 600);
        }
        
        this.currentSection = sectionIndex;
        this.updateNavigation();
        
        // Handle section-specific logic
        this.handleSectionChange(sectionIndex);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    handleSectionChange(sectionIndex) {
        switch(sectionIndex) {
            case 1: // Video section
                setTimeout(() => {
                    this.playVideo();
                }, 500);
                break;
            case 2: // Countdown section
                this.startCountdown();
                break;
            case 8: // Wishes section
                this.loadWishes();
                break;
        }
    }
    
    playVideo() {
        const video = document.getElementById('cinematicVideo');
        if (video) {
            console.log('Attempting to play video with mobile optimizations');
            
            // Mobile optimization before play
            if (this.isMobileDevice()) {
                this.hideHeavyEffectsDuringVideoPlay();
            }
            
            video.play().catch(error => {
                console.error('Video play failed:', error);
                this.showHeavyEffectsAfterVideoPauseOrEnd();
            });
        }
    }
    
    skipVideo() {
        const video = document.getElementById('cinematicVideo');
        if (video) {
            video.pause();
            this.showHeavyEffectsAfterVideoPauseOrEnd();
        }
        
        if (this.skipTimer) {
            clearTimeout(this.skipTimer);
        }
        
        this.goToSection(2);
    }
    
    startSkipCountdown() {
        // Simplified skip functionality without countdown
        const skipBtn = document.getElementById('skipVideoBtn');
        if (skipBtn) {
            skipBtn.style.display = 'flex';
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
        const music = document.getElementById('backgroundMusic');
        const musicToggle = document.getElementById('musicToggle');
        
        if (music && musicToggle) {
            if (music.paused) {
                music.play();
                musicToggle.classList.add('playing');
            } else {
                music.pause();
                musicToggle.classList.remove('playing');
            }
        }
    }
    
    startCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
        
        this.countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = this.weddingDate.getTime() - now;
            
            if (distance < 0) {
                clearInterval(this.countdownTimer);
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }
    
    loadWishes() {
        // In a real implementation, this would load wishes from Firebase
        console.log('Loading wishes...');
    }
    
    handleRSVPSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const rsvpData = {
            name: formData.get('rsvpName') || document.getElementById('rsvpName').value,
            guestCount: document.getElementById('guestCount').value,
            attendance: document.querySelector('input[name="attendance"]:checked')?.value,
            wishMessage: document.getElementById('wishMessage').value,
            displayWish: document.getElementById('displayWish').checked
        };
        
        console.log('RSVP Data:', rsvpData);
        
        // Validation
        if (!rsvpData.name || !rsvpData.attendance) {
            this.showToast('Mohon lengkapi semua field yang wajib diisi', 'error');
            return;
        }
        
        // In a real implementation, this would save to Firebase
        this.showToast('RSVP berhasil dikirim! Terima kasih.', 'success');
        
        // Clear form
        e.target.reset();
        
        // If wish should be displayed, add it to wishes
        if (rsvpData.displayWish && rsvpData.wishMessage) {
            this.addNewWish({
                name: rsvpData.name,
                message: rsvpData.wishMessage,
                date: new Date().toLocaleDateString('id-ID'),
                likes: 0
            });
        }
    }
    
    addNewWish(wishData) {
        const container = document.getElementById('wishesContainer');
        if (!container) return;
        
        const wishCard = document.createElement('div');
        wishCard.className = 'wish-card';
        wishCard.innerHTML = `
            <div class="wish-header">
                <div class="wish-name">${wishData.name}</div>
                <div class="wish-date">${wishData.date}</div>
            </div>
            <div class="wish-message">${wishData.message}</div>
            <div class="wish-actions">
                <button class="heart-btn" onclick="this.classList.toggle('liked')">
                    ❤️ ${wishData.likes}
                </button>
            </div>
        `;
        
        // Add to beginning of container
        container.insertBefore(wishCard, container.firstChild);
    }
    
    copyAccountNumber(accountId) {
        const accountElement = document.getElementById(accountId);
        if (!accountElement) return;
        
        const accountNumber = accountElement.textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(accountNumber).then(() => {
            this.showToast('Nomor rekening berhasil disalin!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = accountNumber;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showToast('Nomor rekening berhasil disalin!', 'success');
        });
    }
    
    addToCalendar() {
        const title = 'Pernikahan Suriansyah & Sonia Agustina';
        const details = 'Akad Nikah dan Resepsi Pernikahan';
        const location = 'Masjid Jabal Rahmah Mandin, Kotabaru';
        const startDate = '20250924T070000Z';
        const endDate = '20250924T120000Z';
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
        
        window.open(googleCalendarUrl, '_blank');
    }
    
    shareInvitation() {
        const shareData = {
            title: 'Undangan Pernikahan Suriansyah & Sonia Agustina',
            text: 'Kami mengundang Anda untuk hadir dalam acara pernikahan kami pada 24 September 2025',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('Link undangan berhasil disalin!', 'success');
            });
        }
    }
    
    handleKeyNavigation(e) {
        // Don't navigate if user is typing in form
        if (this.isFormInteracting) {
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                if (this.currentSection > 0) {
                    this.goToSection(this.currentSection - 1, 'down');
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                if (this.currentSection < this.totalSections - 1) {
                    this.goToSection(this.currentSection + 1, 'up');
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.hideTutorial();
                break;
        }
    }
    
    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// Initialize the wedding invitation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Wedding Invitation...');
    new WeddingInvitation();
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Fallback: DOM loaded, initializing Wedding Invitation...');
        new WeddingInvitation();
    });
} else {
    console.log('DOM already loaded, initializing Wedding Invitation immediately...');
    new WeddingInvitation();
}
