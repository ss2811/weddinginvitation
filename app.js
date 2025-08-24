// Wedding Invitation JavaScript - Fixed Version

// PENTING: Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Global variables
let currentSession = 0;
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;

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
    setupNavigation();
    setupActionButtons();
    startCountdown();
    loadGuestMessages();
    showMusicEnableButton();
    
    // Mulai dari sesi 0 (halaman pembuka)
    showSession(0);
}

// Navigation Functions
function setupNavigation() {
    // Navigasi titik
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot) => {
        dot.addEventListener('click', () => navigateToSession(parseInt(dot.dataset.session)));
    });
    
    // Navigasi panah
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn?.addEventListener('click', () => {
        if (currentSession > 0) navigateToSession(currentSession - 1);
    });
    
    nextBtn?.addEventListener('click', () => {
        if (currentSession < 9) navigateToSession(currentSession + 1);
    });
    
    // Navigasi keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && currentSession > 0) {
            navigateToSession(currentSession - 1);
        } else if (e.key === 'ArrowDown' && currentSession < 9) {
            navigateToSession(currentSession + 1);
        }
    });

    updateArrowButtons();
}

function setupActionButtons() {
    document.getElementById('openInvitationBtn')?.addEventListener('click', openInvitation);
    document.getElementById('saveDateBtn')?.addEventListener('click', saveTheDate);
    document.getElementById('shareBtn')?.addEventListener('click', shareInvitation);
    document.getElementById('openMapsBtn')?.addEventListener('click', openMaps);
    document.getElementById('rsvpForm')?.addEventListener('submit', submitRSVP);
    document.getElementById('sendWaBtn')?.addEventListener('click', sendWhatsApp);
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => copyAccount(e.target.dataset.account));
    });
}


function navigateToSession(sessionNumber) {
    if (sessionNumber < 0 || sessionNumber > 9 || sessionNumber === currentSession) return;
    
    const currentSessionElement = document.getElementById(`session${currentSession}`);
    currentSessionElement?.classList.remove('active');
    currentSessionElement?.classList.add('hidden');
    
    const newSessionElement = document.getElementById(`session${sessionNumber}`);
    newSessionElement?.classList.remove('hidden');
    setTimeout(() => {
        newSessionElement?.classList.add('active');
    }, 10);
    
    document.querySelector('.dot.active')?.classList.remove('active');
    document.querySelector(`.dot[data-session='${sessionNumber}']`)?.classList.add('active');
    
    currentSession = sessionNumber;
    updateArrowButtons();
    
    if (sessionNumber === 7) {
        loadGuestMessages();
    }

    if (sessionNumber !== 9 && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
    }
}

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
    
    document.querySelector('.dot.active')?.classList.remove('active');
    document.querySelector(`.dot[data-session='${sessionNumber}']`)?.classList.add('active');
    
    currentSession = sessionNumber;
    updateArrowButtons();
}

function updateArrowButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentSession <= 0;
    if (nextBtn) nextBtn.disabled = currentSession >= 9;
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

function showMusicEnableButton() {
    if (document.querySelector('.music-toggle-btn')) return;
    
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔇';
    musicButton.className = 'btn music-toggle-btn';
    musicButton.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; z-index: 1001;
        background: var(--wedding-gold); color: var(--wedding-black); border: none;
        width: 45px; height: 45px; border-radius: 50%; font-size: 20px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicButton.innerHTML = '🎵';
        } else {
            backgroundMusic.pause();
            musicButton.innerHTML = '🔇';
        }
    });

    document.body.appendChild(musicButton);
}

// Session 0: Landing
function openInvitation() {
    navigateToSession(1);
    playBackgroundMusic();
}

// Session 1: Countdown
function startCountdown() {
    const weddingDate = new Date('2025-09-24T07:00:00+08:00');
    
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate.getTime() - now;
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        hoursEl.textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        minutesEl.textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        secondsEl.textContent = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);
}

// Replace existing saveTheDate() with this improved version
async function saveTheDate() {
    const event = {
        title: 'Wedding Suriansyah & Sonia Agustina Oemar',
        start: '2025-09-24T07:00:00',
        end: '2025-09-24T17:00:00',
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar',
        location: 'Masjid Jabal Rahmah Mandin'
    };

    // Build ICS content
    const dtStart = event.start.replace(/[-:]/g, '') + 'Z';
    const dtEnd = event.end.replace(/[-:]/g, '') + 'Z';
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@example.com
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });

    // Try Web Share API (supports sharing files to apps on mobile)
    try {
        const file = new File([blob], 'wedding-invitation.ics', { type: 'text/calendar' });

        // navigator.canShare may not exist on all browsers
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: event.title,
                text: 'Tambahkan acara ini ke kalender Anda'
            });
            showNotification('Silakan pilih aplikasi Kalender untuk menyimpan acara.');
            return;
        }
    } catch (err) {
        console.warn('Web Share API unavailable or failed:', err);
        // continue to fallback
    }

    // Fallback: open Google Calendar create-event URL in new tab/window
    const gcalBase = 'https://calendar.google.com/calendar/r/eventedit';
    const gStart = encodeURIComponent(event.start.replace(/:\d{2}$/, '') ); // simple fallback
    const gEnd = encodeURIComponent(event.end.replace(/:\d{2}$/, ''));
    const gTitle = encodeURIComponent(event.title);
    const gDetails = encodeURIComponent(`${event.description}\n\nLokasi: ${event.location}`);
    const gLoc = encodeURIComponent(event.location);

    const gcalUrl = `${gcalBase}?text=${gTitle}&details=${gDetails}&location=${gLoc}&dates=${formatForGCal(event.start)}/${formatForGCal(event.end)}`;

    window.open(gcalUrl, '_blank');
    showNotification('Membuka Google Calendar sebagai alternatif. Silakan tambahkan acara.');
}

// Helper to format date to YYYYMMDDTHHMMSSZ for Google Calendar 'dates' param
function formatForGCal(iso) {
    // iso like '2025-09-24T07:00:00' -> 20250924T070000Z
    const d = new Date(iso);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur kepada Allah SWT, kami mengundang Bapak/Ibu/Saudara(i) menghadiri pernikahan\nSuriansyah, S.Kep., Ners & Sonia Agustina Oemar, S.Farm\nBarakallahu lakuma wa baraka ‘alaikuma wa jama‘a bainakuma fii khair.';
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Wedding Invitation',
            text: shareText,
            url: shareUrl
        }).catch(error => console.log('Error sharing:', error));
    } else {
        copyToClipboard(shareUrl, 'Link undangan disalin!');
    }
}

// Session 4: Maps
function openMaps() {
    window.open('https://maps.app.goo.gl/TvD12aGBA8WGaKQX8', '_blank');
}

// Session 5: RSVP
async function submitRSVP(e) {
    e.preventDefault();
    const name = document.getElementById('guestName').value.trim();
    const message = document.getElementById('guestMessage').value.trim();
    const attendance = document.getElementById('attendance').value;
    const displayMessage = document.getElementById('displayMessage').checked;
    
    if (!name || !message || !attendance) {
        showNotification('Mohon lengkapi semua kolom! ⚠️');
        return;
    }
    
    const rsvpData = { name, message, attendance, displayMessage, timestamp: serverTimestamp() };
    
    try {
        if (!db) throw new Error("Database not initialized");
        await addDoc(collection(db, 'rsvp'), rsvpData);
        
        if (displayMessage) {
            await addDoc(collection(db, 'messages'), { name, message, timestamp: serverTimestamp() });
            loadGuestMessages(); // Refresh messages
        }
        
        showNotification('Terima kasih atas konfirmasi dan ucapannya! 💝');
        document.getElementById('rsvpForm').reset();
        
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi. ❌');
    }
}

function sendWhatsApp() {
    const name = document.getElementById('guestName').value.trim();
    const message = document.getElementById('guestMessage').value.trim();
    const attendance = document.getElementById('attendance').value;

    if (!name || !message || !attendance) {
        showNotification('Mohon lengkapi nama, ucapan, dan konfirmasi kehadiran! ⚠️');
        return;
    }

    const attendanceText = attendance === 'hadir' ? 'Akan Hadir' : 'Tidak Dapat Hadir';
    const whatsappMessage = `Halo, saya ${name}.\n\n*Konfirmasi Kehadiran:* ${attendanceText}\n\n*Ucapan & Doa:*\n${message}`;
    
    window.open(`https://wa.me/6285251815099?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
}

// Session 6: Copy Account
function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin! 📋');
}

// Session 7: Guest Messages
async function loadGuestMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    try {
        if (!db) throw new Error("Database not initialized");
        const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(messagesQuery);
        
        if (querySnapshot.empty) {
            container.innerHTML = '<p class="no-messages">Belum ada ucapan dari tamu</p>';
            return;
        }
        
        container.innerHTML = querySnapshot.docs.map(doc => {
            const msg = doc.data();
            return `
                <div class="message-item">
                    <div class="message-name">${escapeHtml(msg.name)}</div>
                    <div class="message-text">${escapeHtml(msg.message)}</div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading messages:', error);
        container.innerHTML = '<p class="no-messages">Gagal memuat ucapan</p>';
    }
}

// Session 9: YouTube Video
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('weddingVideo', {
    events: { 'onStateChange': onPlayerStateChange }
  });
}

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

// Utility Functions
function showNotification(message) {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
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
    
    const styleId = 'notification-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes slideIn { from { transform: translateX(110%); } to { transform: translateX(0); } }
            @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(110%); } }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(successMessage || 'Teks berhasil disalin!');
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        showNotification('Gagal menyalin ❌');
    });
}

function escapeHtml(text) {
    return text
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Cleanup
window.addEventListener('beforeunload', () => {
    if (countdownInterval) clearInterval(countdownInterval);
});
