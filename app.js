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
    { time: 38, text: "Berbahagialah suaminya; ia datang berhiaskan mutiara" },
    { time: 43, text: "Padukan Kemurnian dengan puncak dan keindahan yang mempesona" },
    { time: 49, text: "Semua hati dipenuhi dengan sukacita" },
    { time: 53, text: "Dengan kebaikan, dia bersinar dalam kebaikan dan keteguhan hati" },
    { time: 57, text: "Semua hati dipenuhi dengan sukacita" },
    { time: 62, text: "Dengan kebaikan, dia bersinar dalam kebaikan dan keteguhan hati" },
    { time: 68, text: "Di kening kebahagiaanku dan pikiranku" },
    { time: 71, text: "Huruf-huruf mengalir dengan rindu dan bunga-bunga" },
    { time: 76, text: "Hal inilah yang mengantarkan pada kebahagiaan dalam pengharapan" },
    { time: 81, text: "Menceritakan keindahan dengan melodi dan lagu" },
    { time: 87, text: "Nama yang tergambar oleh melodi kesetiaan setiap saat" },
    { time: 91, text: "Tampak menawan dalam kebaikan dan keikhlasan" },
    { time: 96, text: "Dan Maryam, yang dipadamkan oleh cinta, telah diutus" },
    { time: 101, text: "Ucapannya riang, disirami oleh hujan" },
    { time: 106, text: "Demikian pula Syaimaa menyirami jiwa dengan kegembiraannya" },
    { time: 111, text: "Dia memilih cintanya tanpa ragu-ragu" },
    { time: 115, text: "Demikian pula Syaimaa menyirami jiwa dengan kegembiraannya" },
    { time: 120, text: "Dia memilih cintanya tanpa ragu-ragu" },
    { time: 124, text: "Segala ucapan selamat mengalir, wahai Haya, bersamanya" },
    { time: 129, text: "Segala doa tertuju kepada Rabb kita Yang Maha Pengasih, Sang Pencipta" },
    { time: 134, text: "Semoga Allah Mencurahkan Rahmat-Nya Kepadamu" },
    { time: 139, text: "Keturunan yang berkembang indah di semesta yang terus bergerak" },
    { time: 145, text: "Segala ucapan selamat mengalir, wahai Haya, bersamanya" },
    { time: 149, text: "Segala doa tertuju kepada Rabb kita Yang Maha Pengasih, Sang Pencipta" },
    { time: 154, text: "Semoga Allah Mencurahkan Rahmat-Nya Kepadamu" },
    { time: 158, text: "Keturunan yang berkembang indah di semesta yang terus bergerak" },
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
    
    const videoSection = document.getElementById('session-video');
    if(videoSection) videoSection.style.opacity = '0';

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
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔇'; musicButton.className = 'btn music-toggle-btn';
    musicButton.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 1001; background: var(--wedding-primary); color: var(--wedding-bg); border: none; width: 45px; height: 45px; border-radius: 50%; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`;
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) { backgroundMusic.play(); musicButton.innerHTML = '🎵'; } 
        else { backgroundMusic.pause(); musicButton.innerHTML = '🔇'; }
    });
    document.body.appendChild(musicButton);
}

// REPLACE the old openInvitation function with this new one
function openInvitation() {
  const session0 = document.getElementById('session0');
  const videoSection = document.getElementById('session-video');
  const backgroundVideo = document.getElementById('backgroundVideo');
  const mainContent = document.querySelector('.main-content-wrapper');

  // 1. Fade out the initial envelope/cover
  if (session0) {
    session0.classList.add('fade-out');
    setTimeout(() => {
      session0.classList.add('hidden');
    }, 600); // Hides it after the fade-out animation
  }

  // 2. Show the main content and start the video simultaneously
  if (videoSection && backgroundVideo && mainContent) {
    videoSection.classList.remove('hidden'); // Make video container visible
    mainContent.classList.remove('hidden');   // **KEY CHANGE**: Make main content visible now
    
    backgroundVideo.play();

    // 3. When the video finishes, move it to the background using the existing CSS class
    backgroundVideo.addEventListener('ended', () => {
        videoSection.classList.add('video-finished');
    }, { once: true }); // This listener will only run once

  } else {
    // Fallback: If the video elements don't exist, just show the content
    if (mainContent) mainContent.classList.remove('hidden');
  }

  // 4. Enable page scrolling and play the background music
  document.body.classList.remove('no-scroll');
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

// Fungsi lainnya
async function saveTheDate() {
    const event = {
        title: 'Pernikahan Suriansyah & Sonia Agustina Oemar',
        start: '2025-09-24T07:00:00+08:00',
        end: '2025-09-24T17:00:00+08:00',
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar.\\n\\nJangan lupa hadir dan memberikan doa restu.',
        location: 'Masjid Jabal Rahmah Mandin & Rumah Mempelai Wanita'
    };
    const toUTC = (dateString) => {
        const date = new Date(dateString);
        const pad = (num) => num.toString().padStart(2, '0');
        return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
    };

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wedding Invitation//EN\nBEGIN:VEVENT\nUID:${Date.now()}@wedding.com\nDTSTAMP:${toUTC(new Date().toISOString())}\nDTSTART;TZID=Asia/Makassar:${toUTC(event.start)}\nDTEND;TZID=Asia/Makassar:${toUTC(event.end)}\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const file = new File([blob], 'wedding_invitation.ics', { type: 'text/calendar' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: event.title, text: 'Simpan tanggal pernikahan kami.' });
            showNotification('Pilih aplikasi Kalender untuk menyimpan acara.');
            return;
        } catch (error) {
            console.warn('Web Share API dibatalkan atau gagal:', error);
        }
    }

    try {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        showNotification('File kalender (.ics) telah diunduh.');
    } catch (error) {
        showNotification('Gagal membuat file kalender.');
    }
}

async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur, kami mengundang Anda menghadiri pernikahan Suriansyah & Sonia.';
    const shareUrl = window.location.href;
    copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
}

async function handleRsvpSubmission() {
  const nameInput = document.getElementById('guestName');
  const messageInput = document.getElementById('guestMessage');
  const attendanceInput = document.getElementById('attendance');
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  const attendance = attendanceInput.value;

  if (!name || !message || !attendance) {
    showNotification('Mohon lengkapi semua kolom!');
    return;
  }

  const isPublic = await showPrivacyPopup();
  if (isPublic === null) return;

  const success = await submitMessageToFirebase(name, message, attendance, isPublic);
  if (success) {
    showNotification('Ucapan Anda berhasil terkirim. Terima kasih!');
    nameInput.value = '';
    messageInput.value = '';
    attendanceInput.selectedIndex = 0;
    loadGuestMessages();
  }
}

async function submitMessageToFirebase(name, message, attendance, isPublic) {
  if (!db) {
    showNotification("Gagal menyimpan: Database error.");
    return false;
  }
  try {
    await addDoc(collection(db, "messages"), {
      name: name, message: message, attendance: attendance, isPublic: isPublic,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error menyimpan ke Firebase: ", error);
    showNotification("Terjadi kesalahan saat mengirim ucapan.");
    return false;
  }
}

function showPrivacyPopup() {
  return new Promise(resolve => {
    document.getElementById('privacy-popup-container')?.remove();
    const popupContainer = document.createElement('div');
    popupContainer.id = 'privacy-popup-container';
    popupContainer.innerHTML = `
      <div class="popup-overlay"></div>
      <div class="popup-box">
        <h3>Tampilkan Ucapan?</h3>
        <p>Apakah ucapan ini boleh ditampilkan secara publik?</p>
        <div class="popup-buttons">
          <button id="btn-public" class="btn">Tampilkan</button>
          <button id="btn-private" class="btn">Simpan Pribadi</button>
        </div>
      </div>
    `;
    document.body.appendChild(popupContainer);

    const closePopup = () => popupContainer.remove();
    document.getElementById('btn-public').onclick = () => { closePopup(); resolve(true); };
    document.getElementById('btn-private').onclick = () => { closePopup(); resolve(false); };
    popupContainer.querySelector('.popup-overlay').onclick = () => { closePopup(); resolve(null); };
  });
}

function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin!');
}

function openMaps() {
    const mapsUrl = 'https://maps.app.goo.gl/3Vv4uWq5aYvK3bH28';
    window.open(mapsUrl, '_blank');
}

function escapeHtml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

async function loadGuestMessages() {
  const container = document.getElementById('messagesContainer');
  if (!container) return;
  container.innerHTML = '<p class="no-messages">Memuat ucapan...</p>';

  try {
    if (typeof db === 'undefined' || !db) throw new Error('Database belum diinisialisasi.');
    
    const messagesQuery = query(collection(db, 'messages'), where('isPublic', '==', true), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(messagesQuery);

    if (querySnapshot.empty) {
      container.innerHTML = '<p class="no-messages">Jadilah yang pertama memberikan ucapan!</p>';
      return;
    }
    
    container.innerHTML = querySnapshot.docs.map(doc => {
      const msg = doc.data();
      const attendanceText = msg.attendance === 'hadir' ? 'Akan Hadir' : 'Tidak Hadir';
      return `
        <div class="message-item">
            <span class="message-name">${escapeHtml(msg.name)} - <i>(${escapeHtml(attendanceText)})</i></span>
            <p class="message-text">${escapeHtml(msg.message)}</p>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error memuat pesan:', error);
    container.innerHTML = '<p class="no-messages">Gagal memuat ucapan.</p>';
  }
}

// Interaksi dengan Video YouTube
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

function showNotification(message) {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: var(--wedding-primary);
        color: var(--wedding-bg);
        padding: 1rem 1.5rem; border-radius: 0.5rem;
        z-index: 1003; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out forwards;
        max-width: 300px;
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
        showNotification('Gagal menyalin ❌');
    });
}

