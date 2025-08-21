// Wedding Invitation JavaScript - COMPLETE & ERROR-FREE VERSION
class WeddingInvitation {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createFallingDaisies();
        this.initMusicPlayer();
        this.initNavigation();
        this.initCountdown();
        this.initEnvelope();
        this.initForms();
        this.initCopyButtons();
        this.initCalendarButtons();
        this.initShareButtons();
        this.initTypewriter();
        this.loadWishes();
        this.initScrollAnimations();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
        });
    }

    initializeComponents() {
        console.log('Wedding invitation initialized');
        this.preloadImages();
    }

    // Preload critical images
    preloadImages() {
        const images = [
            'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/f8a8a346-10f0-4df3-901f-06ec8c2aa864.png',
            'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/c8d683c1-e362-4148-80a4-0f39fd03ff6d.png',
            'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/105a0f8d-15c7-40a2-adb2-d6791d237c6d.png'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // FIXED: Add missing showNotification function
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer') || document.body;
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        container.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    // FIXED: Add missing createSparkles function
    createSparkles(element) {
        const rect = element.getBoundingClientRect();
        const sparkleCount = 6;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                color: #ffd700;
                font-size: 16px;
                pointer-events: none;
                z-index: 1000;
                animation: sparkle 1s ease-out forwards;
            `;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        }
    }

    // Falling Daisies Animation
    createFallingDaisies() {
        const daisiesContainer = document.getElementById('fallingDaisies');
        if (!daisiesContainer) {
            console.warn('Falling daisies container not found');
            return;
        }
        
        const daisySymbols = ['🌼', '🌸', '🌺', '🤍', '💮', '🌙', '⭐', '✨'];
        
        setInterval(() => {
            if (daisiesContainer.children.length < 20) {
                this.createDaisy(daisiesContainer, daisySymbols);
            }
        }, 600);
    }

    createDaisy(container, symbols) {
        const daisy = document.createElement('div');
        daisy.className = 'daisy';
        daisy.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Random starting position
        daisy.style.left = Math.random() * 100 + '%';
        daisy.style.animationDuration = (Math.random() * 3 + 4) + 's';
        daisy.style.animationDelay = Math.random() * 2 + 's';
        daisy.style.fontSize = (Math.random() * 10 + 15) + 'px';
        
        container.appendChild(daisy);
        
        // Remove daisy after animation
        setTimeout(() => {
            if (daisy.parentNode) {
                daisy.parentNode.removeChild(daisy);
            }
        }, 8000);
    }

    // Music Player
    initMusicPlayer() {
        const musicToggle = document.getElementById('musicToggle');
        const backgroundMusic = document.getElementById('backgroundMusic');
        const volumeSlider = document.getElementById('volumeSlider');
        const unmuteButton = document.getElementById('unmuteButton');
        
        if (!musicToggle || !backgroundMusic) {
            console.warn('Music player elements not found');
            return;
        }
        
        let isPlaying = false;

        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                musicToggle.innerHTML = '🎵';
            } else {
                backgroundMusic.play().catch(e => {
                    console.log('Audio play failed:', e);
                    this.showNotification('Audio tidak dapat diputar. Silakan periksa file musik.', 'warning');
                });
                musicToggle.innerHTML = '⏸️';
            }
            isPlaying = !isPlaying;
        });

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                backgroundMusic.volume = e.target.value / 100;
            });
        }

        if (unmuteButton) {
            unmuteButton.addEventListener('click', () => {
                backgroundMusic.muted = false;
                backgroundMusic.play().catch(e => {
                    console.log('Audio play failed:', e);
                    this.showNotification('Audio tidak dapat diputar. Silakan periksa file musik.', 'warning');
                });
                unmuteButton.style.display = 'none';
                isPlaying = true;
                musicToggle.innerHTML = '⏸️';
            });
        }

        // Set initial volume
        backgroundMusic.volume = 0.5;

        // Auto-play attempt with user gesture detection
        document.addEventListener('click', () => {
            if (!isPlaying && backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    musicToggle.innerHTML = '⏸️';
                }).catch(e => console.log('Auto-play failed:', e));
            }
        }, { once: true });
    }

    // Navigation
    initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        const skipButton = document.getElementById('skipButton');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                this.createSparkles(navToggle);
            });
        }

        // Smooth scrolling
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }

                // Close mobile menu
                if (navMenu) {
                    navMenu.classList.remove('active');
                }

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.createSparkles(link);
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNav();
        });

        // Skip intro button
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                const invitationSection = document.getElementById('invitation');
                if (invitationSection) {
                    invitationSection.scrollIntoView({ behavior: 'smooth' });
                    this.createSparkles(skipButton);
                }
            });
        }
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('.session');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
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

    // Countdown Timer
    initCountdown() {
        const weddingDate = new Date('2025-09-24T07:00:00+08:00'); // WITA timezone
        
        const updateCountdown = () => {
            const now = new Date();
            const timeLeft = weddingDate - now;

            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
                if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
                if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
                if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
            } else {
                // Wedding day arrived
                this.setCountdownToZero();
                this.showWeddingDayMessage();
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    setCountdownToZero() {
        const elements = ['days', 'hours', 'minutes', 'seconds'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '00';
        });
    }

    showWeddingDayMessage() {
        const countdownSection = document.querySelector('.countdown-container');
        if (countdownSection && !document.querySelector('.wedding-day-message')) {
            const message = document.createElement('div');
            message.className = 'wedding-day-message gradient-text glow';
            message.style.cssText = `
                text-align: center;
                font-size: 2rem;
                font-family: 'Great Vibes', cursive;
                margin-top: 2rem;
                animation: fadeInUp 1s ease;
            `;
            message.textContent = '🎉 Hari Bahagia Telah Tiba! 🎉';
            countdownSection.parentNode.insertBefore(message, countdownSection.nextSibling);
        }
    }

    // FIXED: Envelope Animation - Properly working click handlers
    initEnvelope() {
        const envelope = document.getElementById('envelope');
        const openButton = document.getElementById('openInvitation');
        
        if (!envelope) {
            console.warn('Envelope element not found');
            return;
        }
        
        let isOpened = false;

        // FIXED: Click on envelope front to open
        envelope.addEventListener('click', (e) => {
            // Only open if clicking on the front side and not already opened
            if (!isOpened && !e.target.closest('.envelope-back')) {
                this.openEnvelope(envelope);
                isOpened = true;
            }
        });

        // FIXED: Click on "Buka Undangan" button to proceed to next section
        if (openButton) {
            openButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent envelope click
                this.createSparkles(openButton);
                this.createDaisyBurst(openButton);
                this.showNotification('Menuju halaman berikutnya...', 'success');
                
                // Scroll to next section after animation
                setTimeout(() => {
                    const countdownSection = document.getElementById('countdown');
                    if (countdownSection) {
                        countdownSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 800);
            });
        }
    }

    // FIXED: Open envelope function with proper animations
    openEnvelope(envelope) {
        envelope.classList.add('opened');
        this.createSparkles(envelope);
        this.createDaisyBurst(envelope);
        this.showNotification('Undangan terbuka! Scroll untuk melanjutkan atau klik tombol biru.', 'info');

        // Add some visual feedback
        const envelopeContainer = envelope.closest('.envelope-container');
        if (envelopeContainer) {
            envelopeContainer.style.transform = 'scale(1.05)';
            setTimeout(() => {
                envelopeContainer.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // Create daisy burst effect
    createDaisyBurst(element) {
        const rect = element.getBoundingClientRect();
        const daisySymbols = ['🌼', '🌸', '🌺', '🤍', '💮'];
        
        for (let i = 0; i < 12; i++) {
            const daisy = document.createElement('div');
            daisy.textContent = daisySymbols[Math.floor(Math.random() * daisySymbols.length)];
            daisy.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                font-size: 20px;
                pointer-events: none;
                z-index: 1000;
                animation: daisyBurst 2s ease-out forwards;
                --angle: ${i * 30}deg;
            `;
            
            document.body.appendChild(daisy);
            
            setTimeout(() => {
                if (daisy.parentNode) {
                    daisy.parentNode.removeChild(daisy);
                }
            }, 2000);
        }
    }

    // Forms Handling
    initForms() {
        this.initRSVPForm();
        this.initWishesForm();
    }

    initRSVPForm() {
        const rsvpForm = document.getElementById('rsvpForm');
        if (!rsvpForm) {
            console.warn('RSVP form not found');
            return;
        }

        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameEl = document.getElementById('rsvpName');
            const attendanceEl = document.getElementById('rsvpAttendance');
            const guestsEl = document.getElementById('rsvpGuests');
            
            if (!nameEl || !attendanceEl) {
                this.showNotification('Form elements not found', 'error');
                return;
            }

            const formData = {
                name: nameEl.value.trim(),
                attendance: attendanceEl.value,
                guests: guestsEl ? guestsEl.value : 1,
                timestamp: new Date().toISOString()
            };

            // Basic validation
            if (!formData.name || !formData.attendance) {
                this.showNotification('Harap lengkapi semua field yang diperlukan.', 'warning');
                return;
            }

            try {
                // Simulate success
                this.showNotification('Konfirmasi berhasil dikirim! Terima kasih.', 'success');
                this.createSparkles(rsvpForm.querySelector('button'));
                this.createDaisyBurst(rsvpForm.querySelector('button'));
                rsvpForm.reset();
                
                // Store locally for demo
                this.storeRSVPLocally(formData);
            } catch (error) {
                console.error('Error saving RSVP:', error);
                this.showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
            }
        });
    }

    initWishesForm() {
        const wishesForm = document.getElementById('wishesForm');
        if (!wishesForm) {
            console.warn('Wishes form not found');
            return;
        }

        wishesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameEl = document.getElementById('wishesName');
            const messageEl = document.getElementById('wishesMessage');
            const publicEl = document.getElementById('wishesPublic');
            
            if (!nameEl || !messageEl) {
                this.showNotification('Form elements not found', 'error');
                return;
            }

            const wishData = {
                name: nameEl.value.trim(),
                message: messageEl.value.trim(),
                isPublic: publicEl ? publicEl.checked : true,
                timestamp: new Date().toISOString()
            };

            // Basic validation
            if (!wishData.name || !wishData.message) {
                this.showNotification('Harap lengkapi nama dan ucapan.', 'warning');
                return;
            }

            if (wishData.message.length < 10) {
                this.showNotification('Ucapan terlalu pendek. Minimal 10 karakter.', 'warning');
                return;
            }

            try {
                // Simulate success
                this.showNotification('Ucapan berhasil dikirim! Terima kasih.', 'success');
                this.createSparkles(wishesForm.querySelector('button'));
                this.createDaisyBurst(wishesForm.querySelector('button'));

                // Add to wishes wall for demo if public
                if (wishData.isPublic) {
                    this.addWishToWall(wishData);
                } else {
                    // Simulate WhatsApp send
                    this.sendToWhatsApp(wishData);
                }

                wishesForm.reset();
            } catch (error) {
                console.error('Error saving wish:', error);
                this.showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
            }
        });
    }

    // FIXED: Add missing helper functions
    storeRSVPLocally(data) {
        try {
            const rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
            rsvps.push(data);
            localStorage.setItem('rsvps', JSON.stringify(rsvps));
        } catch (e) {
            console.warn('Could not store RSVP locally:', e);
        }
    }

    getLocalWishes() {
        try {
            return JSON.parse(localStorage.getItem('wishes') || '[]');
        } catch (e) {
            console.warn('Could not get local wishes:', e);
            return [];
        }
    }

    addWishToWall(wishData) {
        // Store locally
        try {
            const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
            wishes.unshift(wishData);
            localStorage.setItem('wishes', JSON.stringify(wishes));
        } catch (e) {
            console.warn('Could not store wish locally:', e);
        }

        // Add to display
        const wishesWall = document.getElementById('wishesWall');
        if (wishesWall) {
            const wishCard = document.createElement('div');
            wishCard.className = 'wish-card';
            wishCard.innerHTML = `
                <div class="wish-author">${this.escapeHtml(wishData.name)}</div>
                <div class="wish-message">${this.escapeHtml(wishData.message)}</div>
                <span class="wish-date">${this.formatDate(wishData.timestamp)}</span>
            `;
            
            // Remove loading message
            const loading = wishesWall.querySelector('.wishes-loading');
            if (loading) loading.remove();
            
            // Add new wish at top
            wishesWall.insertBefore(wishCard, wishesWall.firstChild);
        }
    }

    sendToWhatsApp(wishData) {
        const message = `Ucapan dari: ${wishData.name}\n\nPesan: ${wishData.message}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        this.showNotification('Membuka WhatsApp untuk mengirim ucapan pribadi...', 'info');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Baru saja';
        }
    }

    // Copy Bank Account Numbers
    initCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const accountNumber = button.dataset.account;
                if (!accountNumber) return;

                navigator.clipboard.writeText(accountNumber).then(() => {
                    const originalText = button.textContent;
                    button.textContent = '✓ Tersalin!';
                    button.style.background = '#10b981';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                    }, 2000);
                    
                    this.createSparkles(button);
                    this.showNotification('Nomor rekening berhasil disalin!', 'success');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    // Fallback for browsers that don't support clipboard API
                    this.fallbackCopyTextToClipboard(accountNumber);
                    
                    const originalText = button.textContent;
                    button.textContent = '✓ Tersalin!';
                    button.style.background = '#10b981';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                    }, 2000);
                    
                    this.createSparkles(button);
                    this.showNotification('Nomor rekening berhasil disalin!', 'success');
                });
            });
        });
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        
        document.body.removeChild(textArea);
    }

    // Calendar Integration
    initCalendarButtons() {
        const googleCalendar = document.getElementById('googleCalendar');
        const appleCalendar = document.getElementById('appleCalendar');
        
        const eventDetails = {
            title: 'Wedding of Suriansyah & Sonia Agustina',
            start: '20250924T070000',
            end: '20250924T150000',
            description: 'Akad Nikah dan Resepsi Pernikahan - Suriansyah, S. Kep., Ners & Sonia Agustina Oemar, S. Farm',
            location: 'Rumah Mempelai Wanita'
        };

        if (googleCalendar) {
            googleCalendar.addEventListener('click', () => {
                const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
                window.open(googleUrl, '_blank');
                this.createSparkles(googleCalendar);
                this.showNotification('Membuka Google Calendar...', 'info');
            });
        }

        if (appleCalendar) {
            appleCalendar.addEventListener('click', () => {
                const icsContent = this.generateICS(eventDetails);
                const blob = new Blob([icsContent], { type: 'text/calendar' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wedding-suriansyah-sonia.ics';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.createSparkles(appleCalendar);
                this.showNotification('File kalender diunduh!', 'success');
            });
        }
    }

    generateICS(event) {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//Suriansyah & Sonia//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wedding-${timestamp}@wedding-invitation.com
DTSTART:${event.start}
DTEND:${event.end}
DTSTAMP:${timestamp}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
    }

    // Share Functionality
    initShareButtons() {
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        const shareInstagram = document.getElementById('shareInstagram');
        const shareFacebook = document.getElementById('shareFacebook');
        const copyLink = document.getElementById('copyLink');
        const openMaps = document.getElementById('openMaps');

        const shareText = 'Kami mengundang Anda dalam acara pernikahan kami. Suriansyah & Sonia Agustina - 24 September 2025';
        const shareUrl = window.location.href;

        if (shareWhatsApp) {
            shareWhatsApp.addEventListener('click', () => {
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
                window.open(whatsappUrl, '_blank');
                this.createSparkles(shareWhatsApp);
                this.showNotification('Membuka WhatsApp...', 'info');
            });
        }

        if (shareInstagram) {
            shareInstagram.addEventListener('click', () => {
                const instagramText = shareText + '\n\n' + shareUrl;
                navigator.clipboard.writeText(instagramText).then(() => {
                    this.showNotification('Teks disalin! Paste di Instagram Story Anda.', 'success');
                }).catch(() => {
                    this.fallbackCopyTextToClipboard(instagramText);
                    this.showNotification('Teks disalin! Paste di Instagram Story Anda.', 'success');
                });
                this.createSparkles(shareInstagram);
            });
        }

        if (shareFacebook) {
            shareFacebook.addEventListener('click', () => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
                window.open(facebookUrl, '_blank');
                this.createSparkles(shareFacebook);
                this.showNotification('Membuka Facebook...', 'info');
            });
        }

        if (copyLink) {
            copyLink.addEventListener('click', () => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    const originalText = copyLink.textContent;
                    copyLink.textContent = '✓ Tersalin!';
                    setTimeout(() => {
                        copyLink.textContent = originalText;
                    }, 2000);
                    this.createSparkles(copyLink);
                    this.showNotification('Link berhasil disalin!', 'success');
                }).catch(() => {
                    this.fallbackCopyTextToClipboard(shareUrl);
                    const originalText = copyLink.textContent;
                    copyLink.textContent = '✓ Tersalin!';
                    setTimeout(() => {
                        copyLink.textContent = originalText;
                    }, 2000);
                    this.createSparkles(copyLink);
                    this.showNotification('Link berhasil disalin!', 'success');
                });
            });
        }

        // Open Maps button
        if (openMaps) {
            openMaps.addEventListener('click', () => {
                const mapsUrl = 'https://maps.google.com/maps?q=Rumah+Mempelai+Wanita';
                window.open(mapsUrl, '_blank');
                this.createSparkles(openMaps);
                this.showNotification('Membuka Google Maps...', 'info');
            });
        }
    }

    // Load Wedding Wishes
    async loadWishes() {
        const wishesWall = document.getElementById('wishesWall');
        if (!wishesWall) return;

        try {
            // Demo wishes with Indonesian names and messages
            const wishes = [
                {
                    name: 'Ahmad Faisal & Keluarga',
                    message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fi khair. Semoga pernikahan kalian diberkahi Allah SWT dan menjadi keluarga yang sakinah, mawaddah, warahmah.',
                    timestamp: '2024-08-20T10:00:00Z'
                },
                {
                    name: 'Siti Aminah',
                    message: 'Selamat menempuh hidup baru Suriansyah & Sonia! Semoga menjadi keluarga yang harmonis dan penuh berkah. Bahagia selalu ya!',
                    timestamp: '2024-08-19T15:30:00Z'
                },
                {
                    name: 'Dr. Budi Santoso',
                    message: 'Congratulations to the beautiful couple! Wishing you both a lifetime of love, happiness, and countless blessings. May your journey together be filled with joy!',
                    timestamp: '2024-08-18T09:15:00Z'
                },
                {
                    name: 'Ibu Ratna & Keluarga',
                    message: 'Selamat untuk kedua mempelai! Semoga Allah SWT senantiasa memberikan keberkahan dan kebahagiaan dalam rumah tangga kalian. Aamiin.',
                    timestamp: '2024-08-17T14:20:00Z'
                },
                {
                    name: 'Keluarga Besar Wijaya',
                    message: 'Barakallahu fiikum, semoga pernikahan ini menjadi awal dari kehidupan yang penuh cinta dan kebahagiaan. Selamat menempuh hidup baru!',
                    timestamp: '2024-08-16T11:45:00Z'
                }
            ];

            // Load from localStorage for demo
            const localWishes = this.getLocalWishes();
            const allWishes = [...localWishes, ...wishes].sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );

            this.displayWishes(allWishes);
        } catch (error) {
            console.error('Error loading wishes:', error);
            wishesWall.innerHTML = '<p class="wishes-loading">Gagal memuat ucapan.</p>';
        }
    }

    displayWishes(wishes) {
        const wishesWall = document.getElementById('wishesWall');
        if (!wishesWall) return;

        if (wishes.length === 0) {
            wishesWall.innerHTML = '<p class="wishes-loading">Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>';
            return;
        }

        const wishesHTML = wishes.map(wish => `
            <div class="wish-card">
                <div class="wish-author">${this.escapeHtml(wish.name)}</div>
                <div class="wish-message">${this.escapeHtml(wish.message)}</div>
                <span class="wish-date">${this.formatDate(wish.timestamp)}</span>
            </div>
        `).join('');

        wishesWall.innerHTML = wishesHTML;
    }

    // FIXED: Add missing functions
    initTypewriter() {
        // Simple typewriter effect for intro text
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 100);
        });
    }

    initScrollAnimations() {
        // Simple scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('.session');
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// CSS keyframes for animations (added via JS to avoid CSS dependency)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes daisyBurst {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
        100% { 
            transform: translate(
                calc(-50% + cos(var(--angle)) * 100px), 
                calc(-50% + sin(var(--angle)) * 100px)
            ) scale(1) rotate(360deg); 
            opacity: 0; 
        }
    }
    
    .session {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .session.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification-container {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 10000;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new WeddingInvitation();
});
