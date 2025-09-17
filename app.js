// Wedding Invitation JavaScript - Animated & Scrollable Version

// Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Pastikan initApp selalu terdaftar dan dijalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    document.body.classList.add('no-scroll');
    backgroundMusic = document.getElementById('backgroundMusic');
    
    const videoSection = document.getElementById('session-video');
    if (videoSection) {
      videoSection.style.opacity = '0';
      videoSection.style.pointerEvents = 'none';
    }

    setupActionButtons();
    startCountdown();
    loadGuestMessages();
    showMusicEnableButton();
    createBackgroundParticles();
    setupGenericScrollAnimations();
    setupLyrics();
}

// --- FUNGSI ANIMASI PARTIKEL BUNGA ---
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
function animateParticle(particle) {
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

// --- Setup Animasi Scroll Generik ---
function setupGenericScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                // Opsi: hapus kelas agar animasi bisa berulang saat scroll ke atas
                // entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => generalObserver.observe(el));
}


// --- Lirik Berjalan ---
function setupLyrics() {
    if (backgroundMusic) {
        backgroundMusic.addEventListener('timeupdate', updateScrollingLyrics);
    }
}
function updateScrollingLyrics() {
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

// --- PERUBAHAN: Placeholder Ikon Suara (PNG) ---
function showMusicEnableButton() {
    const musicButton = document.createElement('button');
    musicButton.className = 'btn music-toggle-btn';

    // --- SILAKAN ISI URL PNG ANDA DI SINI ---
    const musicOnPngUrl = 'URL_PNG_MUSIK_MENYALA.png'; // Ganti dengan URL PNG Anda
    const musicOffPngUrl = 'URL_PNG_MUSIK_MATI.png';  // Ganti dengan URL PNG Anda
    
    const musicIcon = document.createElement('img');
    musicIcon.src = musicOffPngUrl; // Kondisi awal, musik mati
    musicIcon.alt = 'Ikon Kontrol Musik';
    
    musicButton.appendChild(musicIcon);
    
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) { 
            backgroundMusic.play();
        } else { 
            backgroundMusic.pause();
        }
    });
    
    backgroundMusic.addEventListener('play', () => {
        musicIcon.src = musicOnPngUrl;
    });
    backgroundMusic.addEventListener('pause', () => {
        musicIcon.src = musicOffPngUrl;
    });

    document.body.appendChild(musicButton);
}

// --- Fungsi Buka Undangan ---
function openInvitation() {
  const session0 = document.getElementById('session0');
  const videoSection = document.getElementById('session-video');
  const backgroundVideo = document.getElementById('backgroundVideo');
  const mainContent = document.querySelector('.main-content-wrapper');

  session0?.classList.add('fade-out');
  
  // Tunda pemutaran video agar fade-out session0 terlihat
  setTimeout(() => {
    if (videoSection && backgroundVideo) {
      videoSection.style.opacity = '1';
      videoSection.style.pointerEvents = 'auto';
      backgroundVideo.currentTime = 0;
      backgroundVideo.play();

      backgroundVideo.addEventListener('ended', () => {
          mainContent?.classList.remove('hidden');
          document.body.classList.remove('no-scroll');
          videoSection.classList.add('video-finished');
      }, { once: true });
    } else {
      mainContent?.classList.remove('hidden');
      document.body.classList.remove('no-scroll');
    }
  }, 500); // 500ms delay

  playBackgroundMusic();
}

// Hitung Mundur
function startCountdown() {
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

// --- FUNGSI UTAMA TOMBOL-TOMBOL ---

function saveTheDate() {
    const event = {
        title: "Pernikahan Suriansyah & Sonia",
        startDate: "2025-09-24",
        startTime: "07:00",
        endDate: "2025-09-24",
        endTime: "17:00",
        location: "Masjid Jabal Rahmah Mandin, Banjarmasin",
        description: "Acara Pernikahan Suriansyah & Sonia Agustina Oemar"
    };
    const content = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `URL:${document.location.href}`,
        `DTSTART:${event.startDate.replace(/-/g, "")}T${event.startTime.replace(/:/g, "")}00`,
        `DTEND:${event.endDate.replace(/-/g, "")}T${event.endTime.replace(/:/g, "")}00`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pernikahan-sonia-ancah.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Kalender telah diunduh!");
}

async function shareInvitation() {
    const shareData = {
        title: 'Undangan Pernikahan: Sonia & Ancah',
        text: 'Kami mengundang Anda untuk menghadiri hari bahagia kami.',
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            throw new Error('Web Share API not supported');
        }
    } catch (err) {
        copyToClipboard(window.location.href, 'Link undangan berhasil disalin!');
    }
}

async function handleRsvpSubmission() {
    const nameEl = document.getElementById('guestName');
    const messageEl = document.getElementById('guestMessage');
    const attendanceEl = document.getElementById('attendance');

    const name = nameEl.value.trim();
    const message = messageEl.value.trim();
    const attendance = attendanceEl.value;

    if (!name) {
        showNotification("Mohon isi nama Anda.");
        return;
    }
    if (!attendance) {
        showNotification("Mohon pilih konfirmasi kehadiran.");
        return;
    }

    try {
        await submitMessageToFirebase(name, message, attendance);
        showNotification("Terima kasih atas ucapan dan konfirmasinya!");
        nameEl.value = '';
        messageEl.value = '';
        attendanceEl.value = '';
        loadGuestMessages();
    } catch (error) {
        console.error("Error submitting RSVP:", error);
        showNotification("Maaf, terjadi kesalahan saat mengirim ucapan.");
    }
}

async function submitMessageToFirebase(name, message, attendance) {
    if (!db) {
        console.error("Firestore is not initialized.");
        return;
    }
    await addDoc(collection(db, "guestbook"), {
        name: name,
        message: message,
        attendance: attendance,
        timestamp: serverTimestamp()
    });
}

function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, `Nomor rekening ${accountNumber} berhasil disalin!`);
}

function openMaps() {
    const locationQuery = "Masjid Jabal Rahmah Mandin";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;
    window.open(url, '_blank');
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

async function loadGuestMessages() {
    const container = document.getElementById('messagesContainer');
    const noMessagesEl = document.getElementById('noMessages');
    if (!container || !db) return;

    try {
        const q = query(collection(db, "guestbook"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        container.innerHTML = ''; // Kosongkan kontainer
        if (querySnapshot.empty) {
            noMessagesEl.style.display = 'block';
        } else {
            noMessagesEl.style.display = 'none';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const attendanceStatus = data.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir';
                const messageItem = `
                    <div class="message-item">
                        <p class="message-name">${escapeHtml(data.name)} <span style="font-size: 0.8em; color: #aaa;">(${attendanceStatus})</span></p>
                        <p class="message-text">${escapeHtml(data.message) || '<i>Tidak ada pesan.</i>'}</p>
                    </div>
                `;
                container.innerHTML += messageItem;
            });
        }
    } catch (error) {
        console.error("Error loading messages: ", error);
        container.innerHTML = '<p>Gagal memuat ucapan.</p>';
    }
}


// --- INTERAKSI VIDEO YOUTUBE ---
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('weddingVideo', {
    events: { 
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange 
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
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

// --- FUNGSI NOTIFIKASI & UTILITAS ---
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--wedding-primary);
        color: var(--wedding-bg);
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, bottom 0.3s ease;
        font-family: var(--font-family-base);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.bottom = '90px';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.bottom = '80px';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function copyToClipboard(text, successMessage) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage);
        }).catch(err => {
            console.error('Failed to copy using navigator: ', err);
            fallbackCopyTextToClipboard(text, successMessage);
        });
    } else {
        fallbackCopyTextToClipboard(text, successMessage);
    }
}

function fallbackCopyTextToClipboard(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; 
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification(successMessage);
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        showNotification('Gagal menyalin teks.');
    }
    document.body.removeChild(textArea);
}

