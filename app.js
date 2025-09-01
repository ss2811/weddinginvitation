// Enhanced Wedding Invitation JavaScript - Full Animation Version

// PENTING: Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Global variables
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;
let isMainContentVisible = false;
let scrollTicking = false;

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
    setupEventListeners();
    startCountdown();
    loadGuestMessages();
    showMusicEnableButton();
    initializeScrollAnimations();
    initializeEnhancedAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
}

// Setup all event listeners
function setupEventListeners() {
    // Open invitation button
    document.getElementById('openInvitationBtn')?.addEventListener('click', openInvitation);
    
    // Action buttons
    document.getElementById('saveDateBtn')?.addEventListener('click', saveTheDate);
    document.getElementById('shareBtn')?.addEventListener('click', shareInvitation);
    document.getElementById('openMapsBtn')?.addEventListener('click', openMaps);
    document.getElementById('submitRsvpBtn')?.addEventListener('click', handleRsvpSubmission);
    
    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            copyAccount(e.target.dataset.account);
            animateButtonSuccess(e.target);
        });
    });
    
    // Add scroll listener with throttling
    window.addEventListener('scroll', throttle(handleScrollAnimations, 10));
    window.addEventListener('scroll', throttle(updateScrollProgress, 10));
}

// Enhanced opening animation
function openInvitation() {
    const landingPage = document.getElementById('landingPage');
    const mainContent = document.getElementById('mainContent');
    
    // Animate landing page out
    landingPage.style.animation = 'landingFadeOut 1s ease-out forwards';
    
    setTimeout(() => {
        landingPage.style.display = 'none';
        mainContent.style.display = 'block';
        isMainContentVisible = true;
        
        // Animate main content in
        mainContent.style.animation = 'mainContentFadeIn 1s ease-out forwards';
        
        // Start background music
        playBackgroundMusic();
        
        // Trigger initial scroll animations
        handleScrollAnimations();
        
    }, 800);
}

// Enhanced smooth scrolling
function initializeSmoothScrolling() {
    // Add CSS for smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Enhanced scroll behavior for mobile
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

// Initialize enhanced animations
function initializeEnhancedAnimations() {
    // Add intersection observer for better scroll animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add specific animations based on element type
                    if (entry.target.querySelector('.countdown-container')) {
                        animateCountdown();
                    }
                    
                    if (entry.target.querySelector('.couple-photos')) {
                        animateCouplePhotos();
                    }
                    
                    if (entry.target.querySelector('.form-control')) {
                        animateFormElements();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section);
        });
    }
}

// Enhanced scroll animations
function handleScrollAnimations() {
    if (!scrollTicking && isMainContentVisible) {
        requestAnimationFrame(() => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            const windowHeight = window.innerHeight;
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 100;
                
                if (elementTop < windowHeight - elementVisible) {
                    if (!element.classList.contains('animated')) {
                        element.classList.add('animated');
                        
                        // Add staggered animation for child elements
                        const children = element.querySelectorAll('.form-group, .event-item, .bank-item');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.style.animation = `slideInUp 0.6s ease-out forwards`;
                                child.style.animationDelay = `${index * 0.1}s`;
                            }, index * 100);
                        });
                    }
                }
            });
            
            scrollTicking = false;
        });
        
        scrollTicking = true;
    }
}

// Animate countdown digits
function animateCountdown() {
    const countdownItems = document.querySelectorAll('.countdown-item');
    countdownItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = `countdownBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
        }, index * 150);
    });
}

// Animate couple photos
function animateCouplePhotos() {
    const photoContainers = document.querySelectorAll('.photo-container');
    const divider = document.querySelector('.couple-divider');
    
    photoContainers.forEach((container, index) => {
        setTimeout(() => {
            container.style.animation = `photoSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        }, index * 300);
    });
    
    setTimeout(() => {
        if (divider) {
            divider.style.animation = `heartPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
        }
    }, 600);
}

// Animate form elements
function animateFormElements() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        setTimeout(() => {
            group.style.animation = `formSlideIn 0.5s ease-out forwards`;
        }, index * 100);
    });
}

// Animate button success
function animateButtonSuccess(button) {
    const originalText = button.textContent;
    button.textContent = '✓';
    button.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    button.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.transform = '';
    }, 1500);
}

// Enhanced music button
function showMusicEnableButton() {
    if (document.querySelector('.music-toggle-btn')) return;
    
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔇';
    musicButton.className = 'music-toggle-btn';
    
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicButton.innerHTML = '🎵';
            musicButton.style.animation = 'musicButtonPulse 0.6s ease-out';
        } else {
            backgroundMusic.pause();
            musicButton.innerHTML = '🔇';
            musicButton.style.animation = 'musicButtonShake 0.6s ease-out';
        }
        
        // Reset animation
        setTimeout(() => {
            musicButton.style.animation = '';
        }, 600);
    });
    
    document.body.appendChild(musicButton);
}

// Audio Functions
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

// Enhanced countdown with flip animation
function startCountdown() {
    try {
        if (typeof countdownInterval !== 'undefined' && countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        const weddingDate = new Date('2025-09-24T07:00:00+08:00');
        console.log('[countdown] init. weddingDate =', weddingDate.toString());

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            console.warn('[countdown] countdown elements not found. Setting up observer...');
            const observer = new MutationObserver((mutations, obs) => {
                const d = document.getElementById('days');
                const h = document.getElementById('hours');
                const m = document.getElementById('minutes');
                const s = document.getElementById('seconds');
                
                if (d && h && m && s) {
                    obs.disconnect();
                    console.log('[countdown] elements found, starting countdown.');
                    startCountdown();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        function updateWithAnimation(element, newValue) {
            const currentValue = element.textContent;
            if (currentValue !== newValue) {
                element.style.animation = 'digitFlip 0.6s ease-in-out';
                setTimeout(() => {
                    element.textContent = newValue;
                    element.style.animation = '';
                }, 300);
            }
        }

        function update() {
            const now = Date.now();
            const distance = weddingDate.getTime() - now;

            if (distance <= 0) {
                updateWithAnimation(daysEl, '00');
                updateWithAnimation(hoursEl, '00');
                updateWithAnimation(minutesEl, '00');
                updateWithAnimation(secondsEl, '00');
                
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

            updateWithAnimation(daysEl, String(days).padStart(2, '0'));
            updateWithAnimation(hoursEl, String(hours).padStart(2, '0'));
            updateWithAnimation(minutesEl, String(minutes).padStart(2, '0'));
            updateWithAnimation(secondsEl, String(seconds).padStart(2, '0'));
        }

        update();
        countdownInterval = setInterval(update, 1000);
        console.log('[countdown] started. interval id:', countdownInterval);
    } catch (err) {
        console.error('[countdown] error:', err);
    }
}

// Enhanced save date function
async function saveTheDate() {
    const button = document.getElementById('saveDateBtn');
    const originalText = button.textContent;
    
    button.textContent = 'Menyimpan...';
    button.style.animation = 'pulse 1s infinite';

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

    try {
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const file = new File([blob], 'wedding_invitation.ics', { type: 'text/calendar' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: event.title,
                text: 'Simpan tanggal pernikahan kami di kalender Anda.'
            });
            showEnhancedNotification('Pilih aplikasi Kalender untuk menyimpan acara.', 'success');
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            showEnhancedNotification('File kalender (.ics) telah diunduh.', 'success');
        }
    } catch (error) {
        console.error('Error saving date:', error);
        showEnhancedNotification('Gagal membuat file kalender.', 'error');
    }

    button.textContent = originalText;
    button.style.animation = '';
}

// Enhanced share invitation
async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur kepada Allah SWT, kami mengundang Bapak/Ibu/Saudara(i) menghadiri pernikahan Suriansyah & Sonia. Barakallahu lakuma wa baraka alaikuma.';
    const shareTitle = 'Undangan Pernikahan | Suriansyah & Sonia';
    const shareUrl = window.location.href;

    const button = document.getElementById('shareBtn');
    const originalText = button.textContent;
    
    button.textContent = 'Berbagi...';
    button.style.animation = 'pulse 1s infinite';

    try {
        if (navigator.share) {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareUrl
            });
            showEnhancedNotification('Berhasil membagikan undangan!', 'success');
        } else {
            await copyToClipboard(`${shareText}\n\n${shareUrl}`);
            showEnhancedNotification('Link undangan disalin ke clipboard!', 'success');
        }
    } catch (error) {
        console.warn('Share failed:', error);
        await copyToClipboard(`${shareText}\n\n${shareUrl}`);
        showEnhancedNotification('Link undangan disalin ke clipboard!', 'success');
    }

    button.textContent = originalText;
    button.style.animation = '';
}

// Enhanced RSVP submission
async function handleRsvpSubmission() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const attendanceInput = document.getElementById('attendance');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    const attendance = attendanceInput.value;

    if (!name || !message || !attendance) {
        showEnhancedNotification('Mohon lengkapi semua field!', 'warning');
        
        // Highlight empty fields with animation
        [nameInput, messageInput, attendanceInput].forEach(input => {
            if (!input.value.trim()) {
                input.style.animation = 'shake 0.6s ease-in-out';
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.animation = '';
                    input.style.borderColor = '';
                }, 600);
            }
        });
        return;
    }

    const button = document.getElementById('submitRsvpBtn');
    const originalText = button.textContent;
    
    button.textContent = 'Mengirim...';
    button.disabled = true;
    button.style.animation = 'pulse 1s infinite';

    try {
        const isPublic = await showEnhancedPrivacyPopup();
        if (isPublic === null) {
            button.textContent = originalText;
            button.disabled = false;
            button.style.animation = '';
            return;
        }

        const success = await submitMessageToFirebase(name, message, attendance, isPublic);
        
        if (success) {
            showEnhancedNotification('Ucapan berhasil terkirim! Terima kasih 💝', 'success');
            
            // Clear form with animation
            [nameInput, messageInput].forEach(input => {
                input.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => {
                    input.value = '';
                    input.style.animation = 'fadeIn 0.5s ease-out';
                }, 500);
            });
            
            attendanceInput.selectedIndex = 0;
            
            // Reload messages
            setTimeout(() => {
                loadGuestMessages();
            }, 1000);
        }
    } catch (error) {
        console.error('RSVP submission error:', error);
        showEnhancedNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }

    button.textContent = originalText;
    button.disabled = false;
    button.style.animation = '';
}

// Enhanced privacy popup
function showEnhancedPrivacyPopup() {
    return new Promise(resolve => {
        document.getElementById('privacy-popup-container')?.remove();
        
        const popupContainer = document.createElement('div');
        popupContainer.id = 'privacy-popup-container';
        popupContainer.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-box">
                <h3>🔒 Privasi Ucapan</h3>
                <p>Apakah Anda ingin ucapan ini ditampilkan di halaman undangan?</p>
                <div class="popup-buttons">
                    <button id="btn-public" class="btn btn--primary">📢 Tampilkan</button>
                    <button id="btn-private" class="btn btn--outline">🔒 Simpan Pribadi</button>
                </div>
            </div>
        `;
        
        // Add enhanced styles
        const style = document.createElement('style');
        style.textContent = `
            #privacy-popup-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: popupFadeIn 0.3s ease-out;
            }
            
            .popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }
            
            .popup-box {
                position: relative;
                z-index: 2001;
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                border: 2px solid var(--wedding-gold);
                border-radius: 20px;
                padding: 40px;
                width: 90%;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                animation: popupSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .popup-buttons {
                display: flex;
                gap: 16px;
                justify-content: center;
                margin-top: 24px;
            }
            
            @keyframes popupFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes popupSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.7) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(popupContainer);

        const closePopup = () => {
            popupContainer.style.animation = 'popupFadeOut 0.3s ease-out';
            setTimeout(() => {
                popupContainer.remove();
                style.remove();
            }, 300);
        };

        document.getElementById('btn-public').onclick = () => {
            closePopup();
            resolve(true);
        };

        document.getElementById('btn-private').onclick = () => {
            closePopup();
            resolve(false);
        };

        popupContainer.querySelector('.popup-overlay').onclick = () => {
            closePopup();
            resolve(null);
        };
    });
}

// Submit message to Firebase
async function submitMessageToFirebase(name, message, attendance, isPublic) {
    if (!db) {
        console.error("Database not connected.");
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
        console.log("Message saved successfully.");
        return true;
    } catch (error) {
        console.error("Error saving to Firebase:", error);
        return false;
    }
}

// Load guest messages with animations
async function loadGuestMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;

    let noMessagesEl = container.querySelector('.no-messages') || document.getElementById('noMessages');
    
    if (!noMessagesEl) {
        noMessagesEl = document.createElement('p');
        noMessagesEl.className = 'no-messages';
        noMessagesEl.id = 'noMessages';
        noMessagesEl.textContent = 'Belum ada ucapan dari tamu';
        container.appendChild(noMessagesEl);
    }

    container.innerHTML = '';
    container.appendChild(noMessagesEl);

    try {
        if (!db) throw new Error('Database not initialized.');
        
        const messagesRef = collection(db, 'messages');
        const messagesQuery = query(messagesRef, where('isPublic', '==', true), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(messagesQuery);

        if (querySnapshot.empty) {
            noMessagesEl.classList.remove('hidden');
            return;
        }

        noMessagesEl.classList.add('hidden');
        
        const messagesHtml = querySnapshot.docs.map((doc, index) => {
            const msg = doc.data();
            const attendanceText = msg.attendance === 'hadir' ? '✅ Akan Hadir' : '❌ Tidak Hadir';
            
            return `
                <div class="message-item animate-on-scroll" style="animation-delay: ${index * 0.1}s">
                    <div class="message-name">${escapeHtml(msg.name)}</div>
                    <div class="message-attendance">${escapeHtml(attendanceText)}</div>
                    <div class="message-text">${escapeHtml(msg.message)}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = messagesHtml;
        
        // Animate messages in
        const messageItems = container.querySelectorAll('.message-item');
        messageItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'messageSlideIn 0.6s ease-out forwards';
            }, index * 100);
        });
        
    } catch (error) {
        console.error('Error loading messages:', error);
        container.innerHTML = '';
        container.appendChild(noMessagesEl);
        noMessagesEl.classList.remove('hidden');
    }
}

// Other utility functions
function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin! 📋');
}

function openMaps() {
    const mapsUrl = 'https://maps.app.goo.gl/TvD12aGBA8WGaKQX8';
    window.open(mapsUrl, '_blank');
    showEnhancedNotification('Membuka Google Maps...', 'info');
}

function escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Enhanced notification system
function showEnhancedNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification notification--${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `${icons[type] || icons.info} ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

async function copyToClipboard(text, successMessage = 'Berhasil disalin!') {
    try {
        await navigator.clipboard.writeText(text);
        showEnhancedNotification(successMessage, 'success');
    } catch (err) {
        console.error('Copy failed:', err);
        showEnhancedNotification('Gagal menyalin', 'error');
    }
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Update scroll progress (optional feature)
function updateScrollProgress() {
    if (!isMainContentVisible) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // You can use this to show a progress bar or other scroll-based animations
    document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
}

// YouTube Video Integration
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('weddingVideo', {
        events: { 'onStateChange': onPlayerStateChange }
    });
};

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        pauseBackgroundMusic();
        isVideoPlaying = true;
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        isVideoPlaying = false;
        setTimeout(() => {
            if (!isVideoPlaying) resumeBackgroundMusic();
        }, 500);
    }
}

// Cleanup
window.addEventListener('beforeunload', () => {
    if (countdownInterval) clearInterval(countdownInterval);
});

// Export functions for potential external use
window.WeddingInvitation = {
    openInvitation,
    playBackgroundMusic,
    pauseBackgroundMusic,
    showEnhancedNotification
};
