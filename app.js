// Wedding Invitation JavaScript - Animated & Enhanced Version

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Global variables
let currentSession = 0;
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;
let galleryImages = [];
let currentImageIndex = 0;

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbT55NRUO49GQnhN-Uf_yONSpTQBJUgqU",
  authDomain: "weddinginvitationss.firebaseapp.com",
  projectId: "weddinginvitationss",
  storageBucket: "weddinginvitationss.appspot.com",
  messagingSenderId: "348557007083",
  appId: "1:348557007083:web:c966107d29e0dcfcbe86ae"
};

// Initialize Firebase
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
    createBackgroundParticles();
    setupGallery();
    
    showSession(0);
    animateCover();
}

// --- ANIMATION FUNCTIONS ---

/**
 * Creates falling flower particles using GSAP for smooth animation.
 */
function createBackgroundParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    const daisyImgUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/daisy.png'; 
    const sakuraImgUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/sakura.png';

    const particleTypes = [ { url: daisyImgUrl, count: 15 }, { url: sakuraImgUrl, count: 20 } ];

    particleTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundImage = `url(${type.url})`;
            
            const size = Math.random() * 25 + 15;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            container.appendChild(particle);
            animateParticle(particle);
        }
    });
}

/**
 * Animates a single particle to fall and sway randomly.
 * @param {HTMLElement} particle - The particle element to animate.
 */
function animateParticle(particle) {
    gsap.set(particle, { x: Math.random() * window.innerWidth, y: -100, rotation: Math.random() * 360, opacity: 0 });
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;

    const tl = gsap.timeline({ delay: delay, repeat: -1, onRepeat: () => {
            gsap.set(particle, { x: Math.random() * window.innerWidth, y: -100, opacity: 0 });
        }
    });

    tl.to(particle, { opacity: Math.random() * 0.5 + 0.3, duration: 2 }, 0)
    .to(particle, { y: window.innerHeight + 100, ease: "none", duration: duration }, 0)
    .to(particle, { x: "+=" + (Math.random() * 200 - 100), rotation: "+=" + (Math.random() * 720 - 360), ease: "sine.inOut", duration: duration }, 0);
}

/**
 * Animates the entrance of the cover page elements.
 */
function animateCover() {
    gsap.from(".invitation-title > *", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        stagger: 0.3,
        ease: "power3.out"
    });
    gsap.from("#openInvitationBtn", {
        duration: 1,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        delay: 1.5
    });
}


/**
 * Typewriter effect function.
 * @param {string} selector - CSS selector for the target element.
 * @param {string} text - The text to be typed.
 * @param {Function} onComplete - Callback function on completion.
 */
function typeWriter(selector, text, onComplete) {
    const element = document.querySelector(selector);
    if (!element) return;
    element.innerHTML = ''; 
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            if (onComplete) onComplete();
        }
    }
    type();
}

// --- NAVIGATION & UI ---

function setupNavigation() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot) => dot.addEventListener('click', () => navigateToSession(parseInt(dot.dataset.session))));
    
    document.getElementById('prevBtn')?.addEventListener('click', () => { if (currentSession > 0) navigateToSession(currentSession - 1); });
    document.getElementById('nextBtn')?.addEventListener('click', () => { if (currentSession < 9) navigateToSession(currentSession + 1); });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && currentSession > 0) navigateToSession(currentSession - 1);
        else if (e.key === 'ArrowDown' && currentSession < 9) navigateToSession(currentSession + 1);
    });
    updateArrowButtons();
}

function setupActionButtons() {
    document.getElementById('openInvitationBtn')?.addEventListener('click', openInvitation);
    document.getElementById('saveDateBtn')?.addEventListener('click', saveTheDate);
    document.getElementById('shareBtn')?.addEventListener('click', shareInvitation);
    document.getElementById('openMapsBtn')?.addEventListener('click', openMaps);
    document.getElementById('submitRsvpBtn')?.addEventListener('click', handleRsvpSubmission);
    document.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', (e) => copyAccount(e.target.closest('.copy-btn').dataset.account)));
}

function navigateToSession(sessionNumber) {
    if (sessionNumber < 0 || sessionNumber > 9 || sessionNumber === currentSession) return;
    
    const currentContent = document.querySelector(`#session${currentSession} .session-content`);
    const newContent = document.querySelector(`#session${sessionNumber} .session-content`);
    const tl = gsap.timeline();

    tl.to(currentContent, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
      .call(() => {
          document.getElementById(`session${currentSession}`)?.classList.add('hidden');
          document.getElementById(`session${currentSession}`)?.classList.remove('active');
          document.getElementById(`session${sessionNumber}`)?.classList.remove('hidden');
          document.getElementById(`session${sessionNumber}`)?.classList.add('active');
          document.querySelector('.dot.active')?.classList.remove('active');
          document.querySelector(`.dot[data-session='${sessionNumber}']`)?.classList.add('active');
          currentSession = sessionNumber;
          updateArrowButtons();
      })
      .from(newContent, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });

    // Handle session-specific logic
    if (sessionNumber === 2 && !newContent.querySelector('.quran-verse').classList.contains('typed')) {
        const quranText = `"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."`;
        const citation = `<cite>QS. Ar-Rum: 21</cite>`;
        typeWriter('#quran-verse-typewriter', quranText, () => {
            newContent.querySelector('.quran-verse').innerHTML += citation;
        });
        newContent.querySelector('.quran-verse').classList.add('typed');
    }
    
    if (sessionNumber === 8) loadGuestMessages();

    if (sessionNumber !== 5 && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
    }
}


function showSession(sessionNumber) {
    document.querySelectorAll('.session').forEach((session, index) => {
        session.classList.toggle('active', index === sessionNumber);
        session.classList.toggle('hidden', index !== sessionNumber);
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

function openInvitation() {
    navigateToSession(1);
    playBackgroundMusic();
}

// --- FEATURE FUNCTIONS ---

/**
 * Creates and downloads a universal .ics file for calendar integration.
 * Includes both Akad Nikah and Resepsi as separate events.
 */
function saveTheDate() {
    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // WITA is UTC+8
    const akadStartDate = new Date('2025-09-24T07:00:00+08:00');
    const akadEndDate = new Date('2025-09-24T08:00:00+08:00');
    const resepsiStartDate = new Date('2025-09-24T08:00:00+08:00');
    const resepsiEndDate = new Date('2025-09-24T17:00:00+08:00'); // Assuming 'Selesai' is 5 PM

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WeddingInvitation//Suriansyah&Sonia//EN
BEGIN:VEVENT
UID:${Date.now()}-akad@wedding.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(akadStartDate)}
DTEND:${formatDate(akadEndDate)}
SUMMARY:Akad Nikah: Suriansyah & Sonia
DESCRIPTION:Akad Nikah Suriansyah & Sonia. Mohon doa restunya.
LOCATION:Masjid Jabal Rahmah Mandin
END:VEVENT
BEGIN:VEVENT
UID:${Date.now()}-resepsi@wedding.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(resepsiStartDate)}
DTEND:${formatDate(resepsiEndDate)}
SUMMARY:Resepsi Pernikahan: Suriansyah & Sonia
DESCRIPTION:Resepsi Pernikahan Suriansyah & Sonia. Kehadiran Anda adalah kebahagiaan kami.
LOCATION:Rumah Mempelai Wanita, Samping Masjid Jabal Rahmah Mandin
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Pernikahan_Suriansyah_&_Sonia.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('File kalender (.ics) telah diunduh.');
}

async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur, kami mengundang Anda ke pernikahan kami, Suriansyah & Sonia.';
    const shareTitle = 'Undangan Pernikahan | Suriansyah & Sonia';
    const shareUrl = window.location.href;

    try {
        if (navigator.share) {
            await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        } else {
            throw new Error('Web Share API not supported.');
        }
    } catch (error) {
        copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Link undangan disalin ke clipboard.');
    }
}

function startCountdown() {
    const weddingDate = new Date('2025-09-24T07:00:00+08:00').getTime();
    const els = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    if (!els.days) return;

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            Object.values(els).forEach(el => el.textContent = '00');
            return;
        }

        els.days.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        els.hours.textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        els.minutes.textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        els.seconds.textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }, 1000);
}

// --- GALLERY & LIGHTBOX ---

function setupGallery() {
    const galleryContainer = document.querySelector('.photo-gallery');
    if (!galleryContainer) return;
    
    galleryImages = Array.from(galleryContainer.querySelectorAll('img'));
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev')?.addEventListener('click', showPrevImage);
    document.querySelector('.lightbox-next')?.addEventListener('click', showNextImage);
}

function openLightbox(index) {
    currentImageIndex = index;
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (!modal || !img) return;

    img.src = galleryImages[currentImageIndex].src;
    modal.classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox-modal')?.classList.add('hidden');
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    document.getElementById('lightbox-img').src = galleryImages[currentImageIndex].src;
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    document.getElementById('lightbox-img').src = galleryImages[currentImageIndex].src;
}


// --- UTILITY & HELPER FUNCTIONS ---

function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin!');
}

function openMaps() {
    window.open('https://maps.app.goo.gl/TvD12aGBA8WGaKQX8', '_blank');
}

function playBackgroundMusic() {
    backgroundMusic?.play().catch(e => console.log("Autoplay prevented"));
}

function showMusicEnableButton() {
    if (document.querySelector('.music-toggle-btn')) return;
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔇';
    musicButton.className = 'btn music-toggle-btn';
    musicButton.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 1001; background: var(--wedding-gold); color: var(--wedding-black); width: 45px; height: 45px; border-radius: 50%; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`;
    
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

// --- FIREBASE & RSVP ---

async function handleRsvpSubmission() {
    const name = document.getElementById('guestName').value.trim();
    const message = document.getElementById('guestMessage').value.trim();
    const attendance = document.getElementById('attendance').value;

    if (!name || !message || !attendance) {
        showNotification('Mohon lengkapi semua isian!');
        return;
    }
    const isPublic = await showPrivacyPopup();
    if (isPublic === null) return;
    if (await submitMessageToFirebase(name, message, attendance, isPublic)) {
        showNotification('Ucapan Anda berhasil terkirim. Terima kasih!');
        document.getElementById('guestName').value = '';
        document.getElementById('guestMessage').value = '';
        document.getElementById('attendance').selectedIndex = 0;
        loadGuestMessages(); // Refresh messages
    }
}

async function submitMessageToFirebase(name, message, attendance, isPublic) {
    if (!db) {
        showNotification("Gagal: Database error.");
        return false;
    }
    try {
        await addDoc(collection(db, "messages"), { name, message, attendance, isPublic, timestamp: serverTimestamp() });
        return true;
    } catch (error) {
        showNotification("Gagal mengirim ucapan.");
        return false;
    }
}

async function loadGuestMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    container.innerHTML = `<p class="no-messages">Memuat ucapan...</p>`;

    try {
        if (!db) throw new Error('Database not initialized.');
        const q = query(collection(db, "messages"), where('isPublic', '==', true), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = `<p class="no-messages">Jadilah yang pertama memberikan ucapan!</p>`;
        } else {
            container.innerHTML = querySnapshot.docs.map(doc => {
                const msg = doc.data();
                return `<div class="message-item"><span class="message-name">${escapeHtml(msg.name)}</span><p class="message-text">${escapeHtml(msg.message)}</p></div>`;
            }).join('');
        }
    } catch (error) {
        container.innerHTML = `<p class="no-messages">Gagal memuat ucapan.</p>`;
    }
}

// --- VIDEO PLAYER HANDLING ---

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('weddingVideo', { events: { 'onStateChange': onPlayerStateChange } });
}

function onPlayerStateChange(event) {
  isVideoPlaying = (event.data == YT.PlayerState.PLAYING);
  if (isVideoPlaying) backgroundMusic?.pause();
  else if (!isVideoPlaying) backgroundMusic?.play();
}

// --- HELPERS ---

function escapeHtml(unsafe) {
  return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function showPrivacyPopup() {
  return new Promise(resolve => {
    document.getElementById('privacy-popup-container')?.remove();
    const popupHTML = `<div id="privacy-popup-container"><div class="popup-overlay"></div><div class="popup-box"><h3>Tampilkan Ucapan?</h3><p>Apakah ucapan Anda boleh ditampilkan untuk tamu lain?</p><div class="popup-buttons"><button id="btn-public" class="btn">Tampilkan</button><button id="btn-private" class="btn">Simpan Pribadi</button></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    const close = () => document.getElementById('privacy-popup-container')?.remove();
    document.getElementById('btn-public').onclick = () => { close(); resolve(true); };
    document.getElementById('btn-private').onclick = () => { close(); resolve(false); };
    document.querySelector('.popup-overlay').onclick = () => { close(); resolve(null); };
  });
}

function showNotification(message) {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: var(--wedding-gold); color: var(--wedding-black); padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1003; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideIn 0.3s ease-out forwards;`;
    document.body.appendChild(notification);
    const styleId = 'notification-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `@keyframes slideIn { from { transform: translateX(110%); } to { transform: translateX(0); } } @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(110%); } }`;
        document.head.appendChild(style);
    }
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(successMessage || 'Teks berhasil disalin!');
    }).catch(() => showNotification('Gagal menyalin ❌'));
}
