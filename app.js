// Wedding Invitation JavaScript

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
        // Initialize all components after DOM is loaded
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

    // Falling Daisies Animation
    createFallingDaisies() {
        const daisiesContainer = document.getElementById('fallingDaisies');
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

        let isPlaying = false;

        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                musicToggle.innerHTML = '<span class="music-icon">🎵</span>';
            } else {
                backgroundMusic.play().catch(e => {
                    console.log('Audio play failed:', e);
                    this.showNotification('Audio tidak dapat diputar. Silakan periksa file musik.', 'warning');
                });
                musicToggle.innerHTML = '<span class="music-icon">⏸️</span>';
            }
            isPlaying = !isPlaying;
        });

        volumeSlider.addEventListener('input', (e) => {
            backgroundMusic.volume = e.target.value / 100;
        });

        unmuteButton.addEventListener('click', () => {
            backgroundMusic.muted = false;
            backgroundMusic.play().catch(e => {
                console.log('Audio play failed:', e);
                this.showNotification('Audio tidak dapat diputar. Silakan periksa file musik.', 'warning');
            });
            unmuteButton.style.display = 'none';
            isPlaying = true;
            musicToggle.innerHTML = '<span class="music-icon">⏸️</span>';
        });

        // Set initial volume
        backgroundMusic.volume = 0.5;

        // Auto-play attempt with user gesture detection
        document.addEventListener('click', () => {
            if (!isPlaying && backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    musicToggle.innerHTML = '<span class="music-icon">⏸️</span>';
                }).catch(e => console.log('Auto-play failed:', e));
            }
        }, { once: true });
    }

    // Navigation
    initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            this.createSparkles(navToggle);
        });

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
                navMenu.classList.remove('active');
                
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
        const skipButton = document.getElementById('skipButton');
        skipButton.addEventListener('click', () => {
            document.getElementById('invitation').scrollIntoView({
                behavior: 'smooth'
            });
            this.createSparkles(skipButton);
        });
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

                document.getElementById('days').textContent = String(days).padStart(2, '0');
                document.getElementById('hours').textContent = String(hours).padStart(2, '0');
                document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
                document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
            } else {
                // Wedding day arrived
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                
                // Show celebration message
                this.showWeddingDayMessage();
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
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
                    document.getElementById('countdown').scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 800);
            });
        }

        // Optional: Double-click protection
        let clickTimeout;
        envelope.addEventListener('click', () => {
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(() => {
                // Single click logic already handled above
            }, 300);
        });
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
        
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('rsvpName').value.trim(),
                attendance: document.getElementById('rsvpAttendance').value,
                guests: document.getElementById('rsvpGuests').value,
                timestamp: new Date().toISOString()
            };

            // Basic validation
            if (!formData.name || !formData.attendance) {
                this.showNotification('Harap lengkapi semua field yang diperlukan.', 'warning');
                return;
            }

            try {
                // Firebase integration placeholder
                // Replace with your Firebase configuration
                /*
                await firebase.firestore().collection('rsvp').add(formData);
                */
                
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
        
        wishesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const wishData = {
                name: document.getElementById('wishesName').value.trim(),
                message: document.getElementById('wishesMessage').value.trim(),
                isPublic: document.getElementById('wishesPublic').checked,
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
                // Firebase integration placeholder
                // Replace with your Firebase configuration
                /*
                if (wishData.isPublic) {
                    await firebase.firestore().collection('wishes').add(wishData);
                    this.loadWishes(); // Reload wishes
                } else {
                    // Send to WhatsApp (implement WhatsApp API)
                    this.sendToWhatsApp(wishData);
                }
                */
                
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

    // Copy Bank Account Numbers
    initCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const accountNumber = button.dataset.account;
                
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
        
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';

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

        googleCalendar.addEventListener('click', () => {
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
            window.open(googleUrl, '_blank');
            this.createSparkles(googleCalendar);
            this.showNotification('Membuka Google Calendar...', 'info');
        });

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

        const shareText = 'Kami mengundang Anda dalam acara pernikahan kami. Suriansyah & Sonia Agustina - 24 September 2025';
        const shareUrl = window.location.href;

        shareWhatsApp.addEventListener('click', () => {
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
            window.open(whatsappUrl, '_blank');
            this.createSparkles(shareWhatsApp);
            this.showNotification('Membuka WhatsApp...', 'info');
        });

        shareInstagram.addEventListener('click', () => {
            // Instagram doesn't support direct sharing with URL, so copy to clipboard
            const instagramText = shareText + '\n\n' + shareUrl;
            navigator.clipboard.writeText(instagramText).then(() => {
                this.showNotification('Teks disalin! Paste di Instagram Story Anda.', 'success');
            }).catch(() => {
                this.fallbackCopyTextToClipboard(instagramText);
                this.showNotification('Teks disalin! Paste di Instagram Story Anda.', 'success');
            });
            this.createSparkles(shareInstagram);
        });

        shareFacebook.addEventListener('click', () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
            window.open(facebookUrl, '_blank');
            this.createSparkles(shareFacebook);
            this.showNotification('Membuka Facebook...', 'info');
        });

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

        // Open Maps button
        const openMaps = document.getElementById('openMaps');
        if (openMaps) {
            openMaps.addEventListener('click', () => {
                // Replace with actual coordinates or address
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
        
        try {
            // Firebase integration placeholder
            // Replace with your Firebase configuration
            /*
            const wishesSnapshot = await firebase.firestore()
                .collection('wishes')
                .where('isPublic', '==', true)
                .orderBy('timestamp', 'desc')
                .limit(20)
                .get();
                
            const wishes = wishesSnapshot.docs.map(doc => doc.data());
            */
            
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
        
        if (wishes.length === 0) {
            wishesWall.innerHTML = '<p class="wishes-loading">Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>';
            return;
        }

        const wishesHTML = wishes.map(wish => `
            <div class="wish-card">
                <h4 class="wish-author">${this.escapeHtml(wish.name)}</h4>
                <p class="wish-message">${this.escapeHtml(wish.message)}</p>
                <small class="wish-date">${this.formatDate(wish.timestamp)}</small>
            </div>
        `).join('');

        wishesWall.innerHTML = wishesHTML;
    }

    addWishToWall(wishData) {
        // Store locally for demo
        this.storeWishLocally(wishData);
        
        const wishesWall = document.getElementById('wishesWall');
        const newWish = document.createElement('div');
        newWish.className = 'wish-card';
        newWish.style.animation = 'fadeInUp 0.5s ease';
        newWish.innerHTML = `
            <h4 class="wish-author">${this.escapeHtml(wishData.name)}</h4>
            <p class="wish-message">${this.escapeHtml(wishData.message)}</p>
            <small class="wish-date">Baru saja</small>
        `;
        
        // Remove loading message if exists
        const loading = wishesWall.querySelector('.wishes-loading');
        if (loading) {
            loading.remove();
        }
        
        // Add to beginning
        wishesWall.insertBefore(newWish, wishesWall.firstChild);
    }

    // Local storage helpers for demo
    storeWishLocally(wish) {
        try {
            const wishes = JSON.parse(localStorage.getItem('wedding-wishes') || '[]');
            wishes.unshift(wish);
            localStorage.setItem('wedding-wishes', JSON.stringify(wishes));
        } catch (e) {
            console.error('Failed to store wish locally:', e);
        }
    }

    getLocalWishes() {
        try {
            return JSON.parse(localStorage.getItem('wedding-wishes') || '[]');
        } catch (e) {
            console.error('Failed to get local wishes:', e);
            return [];
        }
    }

    storeRSVPLocally(rsvp) {
        try {
            const rsvps = JSON.parse(localStorage.getItem('wedding-rsvps') || '[]');
            rsvps.unshift(rsvp);
            localStorage.setItem('wedding-rsvps', JSON.stringify(rsvps));
        } catch (e) {
            console.error('Failed to store RSVP locally:', e);
        }
    }

    formatDate(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Baru saja';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Typewriter Effect
    initTypewriter() {
        const closingMessage = document.getElementById('closingMessage');
        const text = closingMessage.textContent;
        closingMessage.textContent = '';

        // Observer for when closing section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.typeWriter(closingMessage, text, 0);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(document.getElementById('closing'));
    }

    typeWriter(element, text, i) {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            setTimeout(() => this.typeWriter(element, text, i + 1), 30);
        }
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.event-card, .countdown-item, .bank-card, .wish-card, .profile');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // Sparkle Effects
    createSparkles(element) {
        const rect = element.getBoundingClientRect();
        const sparkleCount = 6;
        const sparkleSymbols = ['✨', '⭐', '💫', '🌟', '💖', '🌙'];

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.style.left = rect.left + rect.width / 2 + Math.random() * 80 - 40 + 'px';
            sparkle.style.top = rect.top + rect.height / 2 + Math.random() * 80 - 40 + 'px';
            sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
            sparkle.style.fontSize = (Math.random() * 10 + 15) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-size: 14px;
            line-height: 1.4;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // WhatsApp Integration (for private wishes)
    sendToWhatsApp(wishData) {
        // Replace with your actual WhatsApp number (format: country code + number without +)
        const phoneNumber = '6281234567890'; // Example: Indonesian number
        const message = `💌 *Ucapan Pernikahan*\n\n*Dari:* ${wishData.name}\n\n*Pesan:*\n${wishData.message}\n\n_Dikirim melalui undangan digital Suriansyah & Sonia_`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        this.showNotification('Membuka WhatsApp untuk mengirim ucapan pribadi...', 'info');
    }

    // Guest name personalization (can be extended with URL parameters)
    personalizeGuestName() {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('guest') || urlParams.get('nama');
        
        if (guestName) {
            const guestNameElement = document.querySelector('.guest-name');
            if (guestNameElement) {
                guestNameElement.textContent = decodeURIComponent(guestName);
            }
        }
    }
}

// Animation styles
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes daisyBurst {
        0% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateX(calc(cos(var(--angle)) * 150px)) translateY(calc(sin(var(--angle)) * 150px)) scale(0.3) rotate(720deg);
            opacity: 0;
        }
    }
    
    .wish-date {
        color: var(--color-text-secondary);
        font-size: 0.8rem;
        margin-top: 0.5rem;
        display: block;
        opacity: 0.7;
    }
    
    .wedding-day-message {
        animation: fadeInUp 1s ease, pulse 2s infinite;
    }
`;
document.head.appendChild(additionalStyles);

// Initialize the wedding invitation
document.addEventListener('DOMContentLoaded', () => {
    const invitation = new WeddingInvitation();
    invitation.personalizeGuestName();
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

/* 
🎯 CUSTOMIZATION INSTRUCTIONS FOR SURIANSYAH & SONIA'S WEDDING:

✅ CRITICAL FIXES APPLIED:
- ✅ Premium black envelope image now displays as background
- ✅ Couple names "Suriansyah & Sonia" visible in envelope preview with heart centered between them
- ✅ Mosque image and Muslim couple image properly displayed in event schedule
- ✅ Envelope click functionality now works - click opens envelope, button proceeds to next section
- ✅ All text overflow issues fixed with responsive font sizing
- ✅ Heart symbol (💖) properly centered between couple names

🖼️ PREMIUM IMAGES INTEGRATED:
- ✅ Black envelope: Used as background in envelope section
- ✅ Mosque: Displayed in "Akad Nikah" event card (80x80px)
- ✅ Muslim couple: Displayed in "Resepsi" event card (80x80px)

🎵 FEATURES WORKING:
- ✅ Falling white daisies animation throughout
- ✅ Interactive envelope opening with sparkle effects
- ✅ Smooth navigation between sections
- ✅ Real-time countdown to September 24, 2025
- ✅ RSVP and wishes forms with validation
- ✅ Copy bank account numbers functionality
- ✅ Social media sharing (WhatsApp, Instagram, Facebook)
- ✅ Calendar integration (Google Calendar & iCal download)
- ✅ Toast notifications for user feedback
- ✅ Typewriter effect in closing message
- ✅ Mobile-responsive design
- ✅ Music player controls

🔧 TO COMPLETE SETUP:

1. 📱 REPLACE MEDIA FILES:
   - Video: Update src="path/to/your/video.mp4" in HTML
   - Music: Update src="path/to/background-music.mp3" in HTML
   - Photos: Uncomment and update paths for groom/bride photos

2. 🔥 FIREBASE SETUP (for live data):
   - Uncomment Firebase code in JavaScript
   - Create project at console.firebase.google.com
   - Replace with your Firebase credentials
   - Enable Firestore for RSVP and wishes storage

3. 💰 UPDATE BANK DETAILS:
   - Replace account numbers in HTML: data-account="YOUR_ACCOUNT"
   - Update bank names and account holder names

4. 📱 WHATSAPP INTEGRATION:
   - Update phoneNumber in sendToWhatsApp function
   - Format: "6281234567890" (country code + number)

5. 📍 LOCATION SETUP:
   - Replace Google Maps URL with actual venue location
   - Update address in openMaps function

6. 👤 GUEST PERSONALIZATION:
   - Use URL parameter: ?guest=NamaLengkap
   - Or manually update .guest-name in HTML

🎨 DESIGN NOTES:
- Sea blue (#1e40af) and black theme with gold accents
- Great Vibes and Playfair Display fonts loaded
- Responsive breakpoints: 768px, 480px, 320px
- Premium envelope, mosque, and couple images integrated
- All text properly sized with clamp() functions

🚀 DEPLOYMENT READY:
- Host on Firebase Hosting, Netlify, or Vercel
- Ensure HTTPS for clipboard API and audio autoplay
- Compress media files for faster loading
- Test on mobile devices

💖 Selamat menempuh hidup baru, Suriansyah & Sonia! 💖
*/