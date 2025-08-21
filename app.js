// Wedding Invitation JavaScript
class WeddingInvitation {
    constructor() {
        this.init();
    }

    init() {
        this.setupFirebase();
        this.setupEventListeners();
        this.setupCountdown();
        this.setupMusic();
        this.setupNavigation();
        this.setupGuestName();
        this.setupAnimations();
        this.createFallingPetals();
    }

    // Firebase Configuration
    setupFirebase() {
        // Mock database for demo purposes
        this.mockDatabase = {
            rsvp: [],
            wishes: [
                {
                    name: "Contoh Tamu",
                    message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair.",
                    timestamp: new Date(),
                    display: true
                }
            ]
        };
        
        this.loadWishes();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Simple opening - no envelope animation - FIX: Make sure button works
        const openBtn = document.getElementById('openInvitation');
        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Buka Undangan clicked'); // Debug log
                this.startInvitation();
            });
        }

        // Video section
        const skipVideo = document.getElementById('skipVideo');
        if (skipVideo) {
            skipVideo.addEventListener('click', () => this.skipVideo());
        }

        // Calendar buttons - Only Google Calendar
        const googleCalBtn = document.getElementById('addToGoogleCal');
        if (googleCalBtn) {
            googleCalBtn.addEventListener('click', () => this.addToGoogleCalendar());
        }

        // Social share buttons
        const whatsappBtn = document.getElementById('shareWhatsapp');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => this.shareWhatsApp());
        }

        const facebookBtn = document.getElementById('shareFacebook');
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.shareFacebook());
        }

        const twitterBtn = document.getElementById('shareTwitter');
        if (twitterBtn) {
            twitterBtn.addEventListener('click', () => this.shareTwitter());
        }

        const copyLinkBtn = document.getElementById('copyLink');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => this.copyInvitationLink());
        }

        // Music control
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.toggleMusic());
        }

        // Forms
        const rsvpForm = document.getElementById('rsvpForm');
        const wishesForm = document.getElementById('wishesForm');
        
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', (e) => this.handleRSVP(e));
        }
        
        if (wishesForm) {
            wishesForm.addEventListener('submit', (e) => this.handleWishes(e));
        }

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.copyToClipboard(e));
        });

        // Scroll event for navigation
        window.addEventListener('scroll', () => this.updateNavigation());
    }

    // FIX: Simple start invitation (no envelope animation)
    startInvitation() {
        console.log('Starting invitation flow'); // Debug log
        // Hide section 1 and show section 2
        const section1 = document.getElementById('section1');
        const section2 = document.getElementById('section2');
        
        if (section1) {
            section1.style.display = 'none';
            console.log('Section 1 hidden');
        }
        if (section2) {
            section2.classList.remove('hidden');
            section2.style.display = 'flex';
            console.log('Section 2 shown');
        }
        
        // Auto skip video after 3 seconds
        setTimeout(() => {
            this.skipVideo();
        }, 3000);
    }

    skipVideo() {
        console.log('Skipping video'); // Debug log
        const section2 = document.getElementById('section2');
        if (section2) {
            section2.style.display = 'none';
        }
        
        this.scrollToSection('section3');
        this.startMusic();
    }

    // FIX: Countdown Timer - Fixed to September 24, 2025
    setupCountdown() {
        // Create the wedding date in WITA timezone (UTC+8)
        const weddingDate = new Date('2025-09-24T07:00:00+08:00');
        console.log('Wedding date set to:', weddingDate); // Debug log
        
        const updateCountdown = () => {
            const now = new Date();
            const diff = weddingDate - now;
            
            console.log('Time difference:', diff); // Debug log
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');
                
                if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
                
                console.log(`Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`); // Debug log
            } else {
                // Wedding day has passed or is today
                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');
                
                if (daysEl) daysEl.textContent = '00';
                if (hoursEl) hoursEl.textContent = '00';
                if (minutesEl) minutesEl.textContent = '00';
                if (secondsEl) secondsEl.textContent = '00';
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Calendar Integration - Only Google Calendar
    addToGoogleCalendar() {
        const title = 'Pernikahan Suriansyah & Sonia';
        const details = 'Akad Nikah dan Resepsi Pernikahan\n\nAkad Nikah: 07:00-08:00 WITA\nResepsi: 08:00 WITA - Selesai\n\nLokasi: Rumah Mempelai Wanita, samping masjid Jabal Rahmah Mandin, pulau laut utara, Kotabaru';
        const location = 'Rumah Mempelai Wanita, samping masjid Jabal Rahmah Mandin, pulau laut utara, Kotabaru';
        const startDate = '20250924T070000';
        const endDate = '20250924T120000';
        
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
        window.open(url, '_blank');
    }

    // Social Media Sharing
    shareWhatsApp() {
        const text = `Assalamu'alaikum! Kami mengundang Anda untuk hadir di pernikahan kami:\n\n*Suriansyah & Sonia*\n📅 24 September 2025\n⏰ 07:00 WITA\n📍 Rumah Mempelai Wanita\nsamping masjid Jabal Rahmah Mandin, pulau laut utara, Kotabaru\n\nLihat undangan lengkap: ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    shareFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    }

    shareTwitter() {
        const text = 'Kami mengundang Anda di pernikahan Suriansyah & Sonia - 24 September 2025';
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    }

    // Copy Link Functionality
    async copyInvitationLink() {
        const button = document.getElementById('copyLink');
        const textToCopy = window.location.href;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            
            if (button) {
                const originalContent = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Link Tersalin';
                button.style.background = 'var(--color-success)';
                button.style.borderColor = 'var(--color-success)';
                button.style.color = 'white';
                
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.style.background = '';
                    button.style.borderColor = '';
                    button.style.color = '';
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to copy link:', error);
            // Fallback - show user the link was copied
            if (button) {
                const originalContent = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Link Tersalin';
                setTimeout(() => {
                    button.innerHTML = originalContent;
                }, 2000);
            }
        }
    }

    // Music Controls
    setupMusic() {
        this.music = document.getElementById('backgroundMusic');
        this.musicButton = document.getElementById('musicToggle');
        this.isPlaying = false;
    }

    startMusic() {
        if (this.musicButton && !this.isPlaying) {
            // Simulate music playing
            this.isPlaying = true;
            this.musicButton.classList.remove('muted');
        }
    }

    toggleMusic() {
        if (this.musicButton) {
            if (this.isPlaying) {
                this.musicButton.classList.add('muted');
                this.isPlaying = false;
            } else {
                this.musicButton.classList.remove('muted');
                this.isPlaying = true;
            }
        }
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href')?.substring(1);
                if (targetId) {
                    this.scrollToSection(targetId);
                }
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Remove hidden class if present
            section.classList.remove('hidden');
            section.style.display = 'flex'; // Ensure it's visible
            
            // Calculate offset for fixed navbar
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 60;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateNavigation() {
        const sections = document.querySelectorAll('.section:not(.hidden)');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 60;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            if (rect.top <= navbarHeight + 100 && rect.bottom > navbarHeight + 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Guest Name from URL
    setupGuestName() {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to') || urlParams.get('guest') || 'Tamu Terhormat';
        
        const guestNameElement = document.getElementById('guestName');
        if (guestNameElement) {
            guestNameElement.textContent = guestName;
        }
    }

    // FIX: Form Handlers
    async handleRSVP(e) {
        e.preventDefault();
        
        const rsvpName = document.getElementById('rsvpName')?.value;
        const attendance = document.getElementById('attendance')?.value;
        
        if (!rsvpName || !attendance) {
            alert('Silakan lengkapi semua field yang diperlukan.');
            return;
        }
        
        const rsvpData = {
            name: rsvpName,
            attendance: attendance,
            timestamp: new Date()
        };
        
        try {
            // In real app: await this.db.collection('rsvp').add(rsvpData);
            this.mockDatabase.rsvp.push(rsvpData);
            
            // FIX: Show confetti without persistent overlay
            this.showConfetti();
            
            // Show success message
            this.showSuccessMessage('Terima kasih! Konfirmasi kehadiran Anda telah diterima.');
            
            // Reset form
            e.target.reset();
        } catch (error) {
            console.error('Error submitting RSVP:', error);
            alert('Maaf, terjadi kesalahan. Silakan coba lagi.');
        }
    }

    async handleWishes(e) {
        e.preventDefault();
        
        const wishName = document.getElementById('wishName')?.value;
        const wishMessage = document.getElementById('wishMessage')?.value;
        const wishOption = document.querySelector('input[name="wishOption"]:checked')?.value;
        
        if (!wishName || !wishMessage) {
            alert('Silakan lengkapi nama dan ucapan.');
            return;
        }
        
        const wishData = {
            name: wishName,
            message: wishMessage,
            option: wishOption || 'display',
            timestamp: new Date(),
            display: (wishOption || 'display') === 'display'
        };
        
        try {
            if (wishData.option === 'whatsapp') {
                this.sendWishViaWhatsApp(wishData);
            } else {
                // In real app: await this.db.collection('wishes').add(wishData);
                this.mockDatabase.wishes.push(wishData);
                this.displayNewWish(wishData);
            }
            
            this.showConfetti();
            this.showSuccessMessage('Terima kasih atas ucapan dan doa Anda!');
            e.target.reset();
        } catch (error) {
            console.error('Error submitting wish:', error);
            alert('Maaf, terjadi kesalahan. Silakan coba lagi.');
        }
    }

    // FIX: Add success message function instead of persistent overlay
    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--color-success);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            z-index: 10000;
            text-align: center;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    sendWishViaWhatsApp(wishData) {
        const message = `Ucapan Pernikahan dari ${wishData.name}:\n\n${wishData.message}`;
        const phoneNumber = '085251815099';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Wishes Display
    async loadWishes() {
        try {
            const wishes = this.mockDatabase.wishes.filter(w => w.display);
            this.displayWishes(wishes);
        } catch (error) {
            console.error('Error loading wishes:', error);
        }
    }

    displayWishes(wishes) {
        const container = document.getElementById('wishesContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        wishes.forEach(wish => {
            this.displayNewWish(wish);
        });
        
        if (wishes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Belum ada ucapan yang ditampilkan.</p>';
        }
    }

    displayNewWish(wish) {
        const container = document.getElementById('wishesContainer');
        if (!container) return;
        
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-item';
        wishElement.innerHTML = `
            <div class="wish-header">
                <h4>${this.escapeHtml(wish.name)}</h4>
                <span class="wish-time">${this.formatTime(wish.timestamp)}</span>
            </div>
            <p class="wish-text">${this.escapeHtml(wish.message)}</p>
        `;
        
        container.insertBefore(wishElement, container.firstChild);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Baru saja';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} menit yang lalu`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam yang lalu`;
        return `${Math.floor(diff / 86400000)} hari yang lalu`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Copy to Clipboard
    async copyToClipboard(e) {
        const button = e.target.closest('.copy-btn');
        const textToCopy = button?.dataset.copy;
        
        if (!textToCopy) return;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Tersalin';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Tersalin';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                alert('Gagal menyalin. Silakan salin secara manual: ' + textToCopy);
            }
            document.body.removeChild(textArea);
        }
    }

    // Animations
    setupAnimations() {
        this.setupTypingAnimation();
        this.observeAnimations();
    }

    setupTypingAnimation() {
        const thankYouText = document.getElementById('thankYouText');
        if (thankYouText) {
            const text = 'Terima Kasih';
            thankYouText.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    thankYouText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 200);
                }
            };
            
            // Start typing animation when section is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            const section = thankYouText.closest('.section');
            if (section) {
                observer.observe(section);
            }
        }
    }

    observeAnimations() {
        const animatedElements = document.querySelectorAll('.wish-item, .schedule-item, .photo-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0s';
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    }

    // White Daisy Falling Particles
    createFallingPetals() {
        setInterval(() => {
            if (window.scrollY > window.innerHeight * 2) { // Only after section 2
                this.createWhiteDaisy();
            }
        }, 3000);
    }

    createWhiteDaisy() {
        const daisy = document.createElement('div');
        daisy.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}vw;
            width: ${Math.random() * 15 + 10}px;
            height: ${Math.random() * 15 + 10}px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            box-shadow: 
                -4px 0 0 white,
                4px 0 0 white,
                0 -4px 0 white,
                0 4px 0 white,
                -3px -3px 0 white,
                3px -3px 0 white,
                -3px 3px 0 white,
                3px 3px 0 white;
            animation: fall ${Math.random() * 3 + 5}s linear forwards;
        `;
        
        document.body.appendChild(daisy);
        
        setTimeout(() => {
            daisy.remove();
        }, 8000);
    }

    // FIX: Confetti Animation - Non-blocking
    showConfetti() {
        const overlay = document.getElementById('confettiOverlay');
        if (!overlay) return;
        
        overlay.classList.add('active');
        
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfettiParticle(overlay, colors);
            }, i * 50);
        }
        
        // FIX: Automatically hide confetti after animation
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.innerHTML = '';
        }, 3000);
    }

    createConfettiParticle(container, colors) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}vw;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-delay: 0s;
            animation-duration: ${Math.random() * 2 + 2}s;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeddingInvitation();
});

// Additional smooth scroll behavior for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}
