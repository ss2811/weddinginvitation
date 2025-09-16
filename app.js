// Wedding Invitation JavaScript - Animated & Scrollable Version

// Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Variabel global
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;

// Data lirik lagu
const lyricsData = [
    { time: 10, text: "Di kening kebahagiaanku dan pikiranku" },
    { time: 15, text: "Huruf-huruf mengalir dengan rindu dan bunga-bunga" },
    { time: 19, text: "Hal inilah yang mengantarkan pada kebahagiaan dalam pengharapan" },
    { time: 24, text: "Menceritakan keindahan dengan melodi dan lagu" },
    { time: 28, text: "Ah, pengantin cahaya; mahkota bulan purnama menampakkannya" },
    { time: 34, text: "Sebagai bintang yang memancar cahaya demi cahaya" },
    // ... (lirik lainnya tetap sama)
];
let currentLyricIndex = -1; 

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

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    document.body.classList.add('no-scroll');
    backgroundMusic = document.getElementById('backgroundMusic');
    
    // Sembunyikan video pembuka di awal agar tidak flash
    const videoSection = document.getElementById('session-video');
    if(videoSection) videoSection.style.opacity = '0';

    setupActionButtons();
    startCountdown();
    loadGuestMessages();
    showMusicEnableButton();
    createBackgroundParticles();
    setupGenericScrollAnimations(); // Setup animasi untuk semua elemen
    setupLyrics();
}

// --- FUNGSI ANIMASI PARTIKEL BUNGA ---
function createBackgroundParticles() {
    // ... (fungsi ini tidak diubah, tetap sama)
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
function animateParticle(particle) {
    // ... (fungsi ini tidak diubah, tetap sama)
    gsap.set(particle, { x: Math.random() * window.innerWidth, y: -100, rotation: Math.random() * 360, opacity: 0 });
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const tl = gsap.timeline({
        delay: delay,
        repeat: -1,
        onRepeat: () => { gsap.set(particle, { x: Math.random() * window.innerWidth, y: -100, opacity: 0 }); }
    });
    tl.to(particle, { opacity: Math.random() * 0.5 + 0.3, duration: 2 }, 0)
    .to(particle, { y: window.innerHeight + 100, ease: "none", duration: duration }, 0)
    .to(particle, { x: "+=" + (Math.random() * 200 - 100), rotation: "+=" + (Math.random() * 720 - 360), ease: "sine.inOut", duration: duration }, 0);
}

// Efek mengetik (typewriter)
function typeWriter(selector, text, onComplete) {
    const element = document.querySelector(selector);
    if (!element) return;
    element.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i); i++;
            setTimeout(type, 50);
        } else if (onComplete) onComplete();
    }
    type();
}

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

// --- PERUBAHAN: Setup Animasi Scroll Generik ---
function setupGenericScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    // Observer untuk ayat suci yang diketik
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = document.getElementById('quran-verse-typewriter');
                if (targetElement && !targetElement.classList.contains('typed')) {
                    const quranText = `"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang..."`;
                    const citation = `<cite>QS. Ar-Rum: 21</cite>`;
                    typeWriter('#quran-verse-typewriter', quranText, () => {
                        targetElement.innerHTML += citation;
                    });
                    targetElement.classList.add('typed');
                    typewriterObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    const session2 = document.getElementById('session2');
    if (session2) typewriterObserver.observe(session2);

    // Observer untuk animasi fade-in-up umum
    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                generalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    animatedElements.forEach(el => generalObserver.observe(el));
}


// --- Lirik Berjalan ---
function setupLyrics() {
    if (backgroundMusic) {
        backgroundMusic.addEventListener('timeupdate', updateScrollingLyrics);
    }
}
function updateScrollingLyrics() {
    // ... (fungsi ini tidak diubah, tetap sama)
    const currentTime = backgroundMusic.currentTime;
    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) return;
    let nextLyricIndex = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) { nextLyricIndex = i; } else { break; }
    }
    if (nextLyricIndex > currentLyricIndex) {
        currentLyricIndex = nextLyricIndex;
        const lyricElement = document.createElement('div');
        lyricElement.className = 'lyric-line';
        lyricElement.textContent = lyricsData[currentLyricIndex].text;
        lyricsContainer.appendChild(lyricElement);
        gsap.fromTo(lyricElement,
            { top: '-10vh', opacity: 1, x: '-50%' },
            { top: '110vh', duration: 15, ease: 'none', onComplete: () => lyricElement.remove() }
        );
    }
}

// Fungsi Audio
function playBackgroundMusic() {
    backgroundMusic?.play().catch(e => console.log('Auto-play dicegah:', e));
}
function pauseBackgroundMusic() {
    backgroundMusic?.pause();
}
function resumeBackgroundMusic() {
    if (backgroundMusic?.paused && !isVideoPlaying) {
        backgroundMusic.play().catch(e => console.log('Gagal melanjutkan musik:', e));
    }
}
function showMusicEnableButton() {
    // ... (fungsi ini tidak diubah, tetap sama)
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔇'; musicButton.className = 'btn music-toggle-btn';
    musicButton.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 1001; background: var(--wedding-primary); color: var(--wedding-bg); border: none; width: 45px; height: 45px; border-radius: 50%; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`;
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) { backgroundMusic.play(); musicButton.innerHTML = '🎵'; } 
        else { backgroundMusic.pause(); musicButton.innerHTML = '🔇'; }
    });
    document.body.appendChild(musicButton);
}

// --- PERUBAHAN: Fungsi Buka Undangan ---
function openInvitation() {
  const session0 = document.getElementById('session0');
  const videoSection = document.getElementById('session-video');
  const backgroundVideo = document.getElementById('backgroundVideo');
  const mainContent = document.querySelector('.main-content-wrapper');

  session0?.classList.add('fade-out');
  
  if (videoSection && backgroundVideo) {
    videoSection.style.opacity = '1';
    backgroundVideo.currentTime = 0;
    backgroundVideo.play();

    backgroundVideo.addEventListener('ended', () => {
        mainContent?.classList.remove('hidden');
        document.body.classList.remove('no-scroll');
        // Video tidak di-hidden, hanya dibuat menghilang secara visual
        videoSection.classList.add('video-finished');
    }, { once: true });
  } else {
    // Fallback jika video tidak ada
    mainContent?.classList.remove('hidden');
    document.body.classList.remove('no-scroll');
  }

  playBackgroundMusic();
}

// Hitung Mundur
function startCountdown() {
    // ... (fungsi ini tidak diubah, tetap sama)
    const weddingDate = new Date('2025-09-24T07:00:00+08:00');
    const els = {
        d: document.getElementById('days'), h: document.getElementById('hours'),
        m: document.getElementById('minutes'), s: document.getElementById('seconds')
    };
    if (!els.d || !els.h || !els.m || !els.s) return;
    function update() {
        const distance = weddingDate.getTime() - Date.now();
        if (distance <= 0) {
            Object.values(els).forEach(el => el.textContent = '00');
            clearInterval(countdownInterval); return;
        }
        els.d.textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
        els.h.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
        els.m.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
        els.s.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
    }
    update();
    countdownInterval = setInterval(update, 1000);
}

// Fungsi lainnya (Save Date, Share, RSVP, dll.)
async function saveTheDate() { /* ... tidak berubah ... */ }
async function shareInvitation() { /* ... tidak berubah ... */ }
async function handleRsvpSubmission() { /* ... tidak berubah ... */ }
async function submitMessageToFirebase(name, message, attendance, isPublic) { /* ... tidak berubah ... */ }
function showPrivacyPopup() { /* ... tidak berubah ... */ }
function copyAccount(accountNumber) { /* ... tidak berubah ... */ }
function openMaps() { /* ... tidak berubah ... */ }
function escapeHtml(unsafe) { /* ... tidak berubah ... */ }
async function loadGuestMessages() { /* ... tidak berubah ... */ }

// --- PERUBAHAN: Interaksi dengan Video YouTube ---
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('weddingVideo', {
    events: { 
      'onReady': onPlayerReady, // Event saat player siap
      'onStateChange': onPlayerStateChange 
    }
  });
}

// Fungsi ini akan dipanggil saat player siap
function onPlayerReady(event) {
  event.target.mute(); // Langsung buat video tanpa suara
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    pauseBackgroundMusic();
    isVideoPlaying = true;
  } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
    isVideoPlaying = false;
    // Beri jeda sedikit sebelum melanjutkan musik
    setTimeout(() => {
        if (!isVideoPlaying) resumeBackgroundMusic();
    }, 500);
  }
}

// Fungsi Notifikasi
function showNotification(message) { /* ... tidak berubah ... */ }
function copyToClipboard(text, successMessage) { /* ... tidak berubah ... */ }
