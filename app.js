// Wedding Invitation JavaScript - Fixed Version

// Global variables
let currentSession = 0;
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;

// Firebase configuration and initialization
// FIREBASE INTEGRATION SETUP:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or use existing one
// 3. Enable Firestore Database
// 4. Get your Firebase config object from Project Settings > General > Your apps
// 5. Replace the config object below with your actual Firebase config
// 6. Enable Firestore rules for read/write access:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document} {
      allow read, write: if true;
    }
    match /rsvp/{document} {
      allow read, write: if true;
    }
  }
}
*/

// Uncomment and configure when ready to use Firebase
/*
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config object goes here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
*/

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    backgroundMusic = document.getElementById('backgroundMusic');
    setupNavigation();
    startCountdown();
    loadGuestMessages();
    setupVideoControls();
    
    // Start with session 0 (landing page) and make it active
    showSession(0);
    
    // Auto-play background music with user gesture fallback
    playBackgroundMusic();
}

// Navigation Functions
function setupNavigation() {
    // Dot navigation
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => navigateToSession(index));
    });
    
    // Arrow navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSession > 0) {
                navigateToSession(currentSession - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSession < 9) {
                navigateToSession(currentSession + 1);
            }
        });
    }
    
    // Update arrow button states
    updateArrowButtons();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && currentSession > 0) {
            navigateToSession(currentSession - 1);
        } else if (e.key === 'ArrowDown' && currentSession < 9) {
            navigateToSession(currentSession + 1);
        }
    });
}

function navigateToSession(sessionNumber) {
    if (sessionNumber < 0 || sessionNumber > 9 || sessionNumber === currentSession) return;
    
    console.log(`Navigating from session ${currentSession} to session ${sessionNumber}`);
    
    // Hide current session
    const currentSessionElement = document.getElementById(`session${currentSession}`);
    if (currentSessionElement) {
        currentSessionElement.classList.remove('active');
        currentSessionElement.classList.add('hidden');
    }
    
    // Show new session
    const newSessionElement = document.getElementById(`session${sessionNumber}`);
    if (newSessionElement) {
        newSessionElement.classList.remove('hidden');
        // Use setTimeout to ensure the display change takes effect before adding active
        setTimeout(() => {
            newSessionElement.classList.add('active');
        }, 10);
    }
    
    // Update navigation dots
    const dots = document.querySelectorAll('.dot');
    if (dots[currentSession]) {
        dots[currentSession].classList.remove('active');
    }
    if (dots[sessionNumber]) {
        dots[sessionNumber].classList.add('active');
    }
    
    // Update current session
    currentSession = sessionNumber;
    
    // Update arrow button states
    updateArrowButtons();
    
    // Handle session-specific actions
    if (sessionNumber === 7) {
        setTimeout(() => loadGuestMessages(), 100);
    }
}

function showSession(sessionNumber) {
    console.log(`Showing session ${sessionNumber}`);
    
    const sessions = document.querySelectorAll('.session');
    sessions.forEach((session, index) => {
        if (index === sessionNumber) {
            session.classList.remove('hidden');
            session.classList.add('active');
        } else {
            session.classList.remove('active');
            session.classList.add('hidden');
        }
    });
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === sessionNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    currentSession = sessionNumber;
    updateArrowButtons();
}

function updateArrowButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        if (currentSession <= 0) {
            prevBtn.disabled = true;
            prevBtn.style.opacity = '0.5';
        } else {
            prevBtn.disabled = false;
            prevBtn.style.opacity = '1';
        }
    }
    
    if (nextBtn) {
        if (currentSession >= 9) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.5';
        } else {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
        }
    }
}

// Audio Functions
function playBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.log('Auto-play prevented:', error);
            // Show a button to enable music if auto-play fails
            showMusicEnableButton();
        });
    }
}

function pauseBackgroundMusic() {
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
    }
}

function resumeBackgroundMusic() {
    if (backgroundMusic && backgroundMusic.paused && !isVideoPlaying) {
        backgroundMusic.play().catch(error => {
            console.log('Failed to resume music:', error);
        });
    }
}

function showMusicEnableButton() {
    // Check if button already exists
    if (document.querySelector('.music-enable-btn')) return;
    
    // Create and show a button to enable music
    const musicButton = document.createElement('button');
    musicButton.textContent = '🎵 ';
    musicButton.className = 'btn btn--outline music-enable-btn';
    musicButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: auto;
	right: 20px;
        transform: none;
        z-index: 1001;
        background: var(--wedding-gold);
        color: var(--wedding-black);
        border: none;
    `;
    
    musicButton.addEventListener('click', () => {
        backgroundMusic.play().then(() => {
            musicButton.remove();
        }).catch(error => {
            console.log('Failed to play music:', error);
        });
    });
    
    document.body.appendChild(musicButton);
}

// Session 0 Functions
function openInvitation() {
    console.log('Opening invitation - navigating to session 1');
    navigateToSession(1);
    // Ensure music is playing when invitation is opened
    playBackgroundMusic();
}

// Session 1 Functions - Countdown
function startCountdown() {
    const weddingDate = new Date('2025-09-24T07:00:00+08:00'); // WITA timezone
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate.getTime() - now;
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            return;
        }
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

function saveTheDate() {
    const event = {
        title: 'Wedding Suriansyah & Sonia Agustina Oemar',
        start: '20250924T070000Z',
        end: '20250924T120000Z',
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar',
        location: 'Masjid Jabal Rahmah Mandin'
    };
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@weddinginvitation.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-invitation.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Calendar event saved! 📅');
}

function shareInvitation() {
    const shareText = 'Anda diundang ke pernikahan Suriansyah & Sonia Agustina Oemar - 24 September 2025';
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Wedding Invitation',
            text: shareText,
            url: shareUrl
        }).catch(error => {
            console.log('Error sharing:', error);
            fallbackShare(shareText, shareUrl);
        });
    } else {
        fallbackShare(shareText, shareUrl);
    }
}

function fallbackShare(shareText, shareUrl) {
    // Fallback for browsers that don't support Web Share API
    const shareMenu = document.createElement('div');
    shareMenu.className = 'share-menu';
    shareMenu.innerHTML = `
        <div class="share-content">
            <h3>Bagikan Undangan</h3>
            <div class="share-buttons">
                <button onclick="shareToWhatsApp('${encodeURIComponent(shareText + ' ' + shareUrl)}')" class="btn btn--primary">WhatsApp</button>
                <button onclick="shareToFacebook('${encodeURIComponent(shareUrl)}')" class="btn btn--primary">Facebook</button>
                <button onclick="copyToClipboard('${shareUrl}')" class="btn btn--outline">Copy Link</button>
            </div>
            <button onclick="closeShareMenu()" class="btn btn--outline">Tutup</button>
        </div>
    `;
    shareMenu.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 1002; display: flex;
        align-items: center; justify-content: center;
    `;
    shareMenu.querySelector('.share-content').style.cssText = `
        background: var(--wedding-black); padding: 2rem; border-radius: 1rem;
        text-align: center; max-width: 300px; width: 90%;
        border: 2px solid var(--wedding-gold);
    `;
    shareMenu.querySelector('.share-buttons').style.cssText = `
        display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0;
    `;
    
    document.body.appendChild(shareMenu);
}

function shareToWhatsApp(text) {
    window.open(`https://wa.me/?text=${text}`, '_blank');
    closeShareMenu();
}

function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    closeShareMenu();
}

function closeShareMenu() {
    const shareMenu = document.querySelector('.share-menu');
    if (shareMenu) {
        shareMenu.remove();
    }
}

// Session 4 Functions
function openMaps() {
    window.open('https://maps.app.goo.gl/TvD12aGBA8WGaKQX8', '_blank');
}

// Session 5 Functions - RSVP
function setupRSVPForm() {
    const form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRSVP();
        });
    }
}

// Call this after DOM is loaded
setTimeout(setupRSVPForm, 100);

async function submitRSVP() {
    const nameEl = document.getElementById('guestName');
    const messageEl = document.getElementById('guestMessage');
    const attendanceEl = document.getElementById('attendance');
    const displayMessageEl = document.getElementById('displayMessage');
    
    if (!nameEl || !messageEl || !attendanceEl) {
        showNotification('Form elements not found! ⚠️');
        return;
    }
    
    const name = nameEl.value.trim();
    const message = messageEl.value.trim();
    const attendance = attendanceEl.value;
    const displayMessage = displayMessageEl ? displayMessageEl.checked : false;
    
    if (!name || !message || !attendance) {
        showNotification('Mohon lengkapi semua field! ⚠️');
        return;
    }
    
    const rsvpData = {
        name: name,
        message: message,
        attendance: attendance,
        displayMessage: displayMessage,
        timestamp: new Date(),
        createdAt: new Date().toISOString()
    };
    
    try {
        // Firebase Integration - Uncomment when Firebase is configured
        /*
        await addDoc(collection(db, 'rsvp'), rsvpData);
        
        if (displayMessage) {
            await addDoc(collection(db, 'messages'), {
                name: name,
                message: message,
                timestamp: new Date(),
                createdAt: new Date().toISOString()
            });
        }
        */
        
        // Temporary local storage fallback (remove when Firebase is active)
        const existingRSVP = JSON.parse(localStorage.getItem('weddingRSVP') || '[]');
        existingRSVP.push(rsvpData);
        localStorage.setItem('weddingRSVP', JSON.stringify(existingRSVP));
        
        if (displayMessage) {
            const existingMessages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
            existingMessages.push({
                name: name,
                message: message,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('weddingMessages', JSON.stringify(existingMessages));
        }
        
        showNotification('Terima kasih atas konfirmasi dan ucapannya! 💝');
        
        // Reset form
        if (nameEl) nameEl.value = '';
        if (messageEl) messageEl.value = '';
        if (attendanceEl) attendanceEl.value = '';
        if (displayMessageEl) displayMessageEl.checked = false;
        
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi. ❌');
    }
}

function sendWhatsApp() {
    const nameEl = document.getElementById('guestName');
    const messageEl = document.getElementById('guestMessage');
    const attendanceEl = document.getElementById('attendance');
    
    if (!nameEl || !messageEl || !attendanceEl) {
        showNotification('Form elements not found! ⚠️');
        return;
    }
    
    const name = nameEl.value.trim();
    const message = messageEl.value.trim();
    const attendance = attendanceEl.value;
    
    if (!name || !message || !attendance) {
        showNotification('Mohon lengkapi semua field terlebih dahulu! ⚠️');
        return;
    }
    
    const attendanceText = attendance === 'hadir' ? 'Akan Hadir' : 'Tidak Dapat Hadir';
    const whatsappMessage = `Halo, saya ${name}.\n\nKonfirmasi: ${attendanceText}\n\nUcapan: ${message}`;
    
    // Phone number is hidden as requested (085251815099)
    window.open(`https://wa.me/6285251815099?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
}

// Session 6 Functions - Copy Account Numbers
function copyAccount(accountNumber) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountNumber).then(() => {
            showNotification('Nomor rekening berhasil disalin! 📋');
        }).catch(() => {
            fallbackCopyTextToClipboard(accountNumber);
        });
    } else {
        fallbackCopyTextToClipboard(accountNumber);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position: fixed; top: 0; left: 0; opacity: 0;';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Nomor rekening berhasil disalin! 📋');
        } else {
            showNotification('Gagal menyalin nomor rekening ❌');
        }
    } catch (err) {
        showNotification('Gagal menyalin nomor rekening ❌');
        console.error('Copy failed:', err);
    }
    
    document.body.removeChild(textArea);
}

// Session 7 Functions - Load Guest Messages
async function loadGuestMessages() {
    const container = document.getElementById('messagesContainer');
    
    if (!container) {
        console.error('Messages container not found');
        return;
    }
    
    try {
        // Firebase Integration - Uncomment when Firebase is configured
        /*
        const messagesQuery = query(
            collection(db, 'messages'),
            orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(messagesQuery);
        const messages = [];
        querySnapshot.forEach((doc) => {
            messages.push(doc.data());
        });
        */
        
        // Temporary local storage fallback (remove when Firebase is active)
        const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (messages.length === 0) {
            container.innerHTML = '<p class="no-messages">Belum ada ucapan dari tamu</p>';
            return;
        }
        
        container.innerHTML = messages.map(msg => `
            <div class="message-item">
                <div class="message-name">${escapeHtml(msg.name)}</div>
                <div class="message-text">${escapeHtml(msg.message)}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading messages:', error);
        container.innerHTML = '<p class="no-messages">Gagal memuat ucapan</p>';
    }
}

// Session 9 Functions - Video Controls
function setupVideoControls() {
    const iframe = document.getElementById('weddingVideo');
    if (!iframe) return;
    
    // Listen for messages from YouTube iframe
    window.addEventListener('message', function(event) {
        if (event.origin !== 'https://www.youtube.com') return;
        
        try {
            const data = JSON.parse(event.data);
            if (data.event === 'video-play') {
                isVideoPlaying = true;
                pauseBackgroundMusic();
            } else if (data.event === 'video-pause' || data.event === 'video-stop') {
                isVideoPlaying = false;
                setTimeout(() => {
                    if (!isVideoPlaying) {
                        resumeBackgroundMusic();
                    }
                }, 500);
            }
        } catch (e) {
            // Ignore parsing errors
        }
    });
    
    // Enable YouTube API
    if (iframe.src.indexOf('enablejsapi=1') === -1) {
        iframe.src += '&enablejsapi=1&origin=' + encodeURIComponent(window.location.origin);
    }
}

// Utility Functions
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: var(--wedding-gold);
        color: var(--wedding-black); padding: 1rem 1.5rem; border-radius: 0.5rem;
        z-index: 1003; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out forwards; max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Add animation keyframes if not already present
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Link berhasil disalin! 📋');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Touch gesture handling for mobile (disabled as requested)
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    // Swipe gestures disabled as per user request
    // handleSwipe();
});

function handleSwipe() {
    // Function kept for potential future use but disabled
    // Swipe gestures are not implemented as per user request
}

// Cleanup function
window.addEventListener('beforeunload', function() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

// Export functions for global access
window.openInvitation = openInvitation;
window.saveTheDate = saveTheDate;
window.shareInvitation = shareInvitation;
window.shareToWhatsApp = shareToWhatsApp;
window.shareToFacebook = shareToFacebook;
window.closeShareMenu = closeShareMenu;
window.copyToClipboard = copyToClipboard;
window.openMaps = openMaps;
window.sendWhatsApp = sendWhatsApp;
window.copyAccount = copyAccount;
