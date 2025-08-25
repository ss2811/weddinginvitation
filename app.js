// Wedding Invitation JavaScript - Animated Version

// PENTING: Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
    createBackgroundParticles(); // Panggil fungsi animasi latar belakang
    
    // Mulai dari sesi 0 (halaman pembuka)
    showSession(0);
    // Jalankan typewriter saat halaman pertama kali dimuat
    runTypewriterSequence();
}

// --- FUNGSI ANIMASI BARU ---

/**
 * Membuat partikel bunga (sakura & daisy) yang berjatuhan di latar belakang.
 * Menggunakan GSAP untuk animasi yang lebih halus dan kontrol yang lebih baik.
 */
function createBackgroundParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    // Ganti URL ini dengan URL gambar PNG Anda di GitHub
    const daisyImgUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/daisy.png'; 
    const sakuraImgUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/sakura.png';

    const particleTypes = [
        { url: daisyImgUrl, count: 15 }, // Jumlah daisy
        { url: sakuraImgUrl, count: 20 }  // Jumlah sakura
    ];

    particleTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundImage = `url(${type.url})`;
            
            const size = Math.random() * 25 + 15; // Ukuran antara 15px - 40px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            container.appendChild(particle);
            animateParticle(particle);
        }
    });
}

/**
 * Menganimasikan satu partikel secara acak dan berulang.
 * @param {HTMLElement} particle - Elemen partikel yang akan dianimasikan.
 */
function animateParticle(particle) {
    // Atur posisi awal acak di atas layar
    gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: -100, // Mulai dari atas layar
        rotation: Math.random() * 360,
        opacity: 0
    });

    const duration = Math.random() * 15 + 10; // Durasi jatuh 10-25 detik
    const delay = Math.random() * 10; // Muncul dengan delay acak

    // Timeline animasi
    const tl = gsap.timeline({
        delay: delay,
        repeat: -1, // Ulangi terus-menerus
        onRepeat: () => {
            // Reset posisi saat animasi diulang
            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: -100,
                opacity: 0
            });
        }
    });

    tl.to(particle, {
        y: window.innerHeight + 100, // Jatuh sampai ke bawah layar
        ease: "none",
        duration: duration
    })
    .to(particle, {
        x: "+=" + (Math.random() * 200 - 100), // Bergerak ke kiri/kanan
        rotation: "+=" + (Math.random() * 720 - 360), // Berputar
        ease: "sine.inOut",
        duration: duration
    }, "<") // Animasikan bersamaan dengan animasi jatuh
    .to(particle, {
        opacity: Math.random() * 0.5 + 0.3, // Fade in ke opacity acak
        duration: duration / 4, // Fade in cepat di awal
        repeat: 1,
        yoyo: true // Fade out di akhir
    }, "<");
}


/**
 * Fungsi untuk efek mengetik (typewriter).
 * @param {string} selector - Selector CSS untuk elemen target.
 * @param {string} text - Teks yang akan diketik.
 * @param {Function} onComplete - Callback setelah selesai.
 */
function typeWriter(selector, text, onComplete) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.innerHTML = ''; // Kosongkan elemen
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 80); // Kecepatan mengetik
        } else {
            // Hapus kursor setelah selesai
            const cursor = element.querySelector('.typing-cursor');
            if (cursor) cursor.remove();
            if (onComplete) onComplete();
        }
    }
    
    // Tambahkan kursor di awal
    element.innerHTML = '<span class="typing-cursor"></span>';
    type();
}

/**
 * Menjalankan urutan animasi typewriter untuk judul.
 */
function runTypewriterSequence() {
    // Teks yang akan ditampilkan
    const titleText = "Wedding Invitation";
    const ofText = "of";
    const namesText = "Suriansyah & Sonia Agustina Oemar";
    const dateText = "24 September 2025";

    // Sembunyikan tombol buka undangan dulu
    const openBtn = document.getElementById('openInvitationBtn');
    if(openBtn) openBtn.style.opacity = '0';


    typeWriter('#typewriter-title', titleText, () => {
        typeWriter('#typewriter-of', ofText, () => {
            typeWriter('#typewriter-names', namesText, () => {
                typeWriter('#typewriter-date', dateText, () => {
                    // Tampilkan tombol setelah semua teks selesai
                    if(openBtn) {
                        gsap.to(openBtn, { opacity: 1, duration: 0.5, delay: 0.5 });
                    }
                });
            });
        });
    });
}


// Navigation Functions
function setupNavigation() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot) => {
        dot.addEventListener('click', () => navigateToSession(parseInt(dot.dataset.session)));
    });
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn?.addEventListener('click', () => {
        if (currentSession > 0) navigateToSession(currentSession - 1);
    });
    
    nextBtn?.addEventListener('click', () => {
        if (currentSession < 9) navigateToSession(currentSession + 1);
    });
    
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
    document.getElementById('submitRsvpBtn')?.addEventListener('click', handleRsvpSubmission);

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
    try {
        if (typeof countdownInterval !== 'undefined' && countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        const weddingDate = new Date('2025-09-24T07:00:00+08:00');
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.getElementById('days')) {
                    obs.disconnect();
                    startCountdown();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        function update() {
            const now = Date.now();
            const distance = weddingDate.getTime() - now;

            if (distance <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
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

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        update();
        countdownInterval = setInterval(update, 1000);
    } catch (err) {
        console.error('[countdown] error saat memulai:', err);
    }
}

async function saveTheDate() {
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

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const file = new File([blob], 'wedding_invitation.ics', { type: 'text/calendar' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: event.title,
                text: 'Simpan tanggal pernikahan kami di kalender Anda.'
            });
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
        showNotification('File kalender (.ics) telah diunduh. Silakan buka file tersebut.');
    } catch (error) {
        console.error('Gagal membuat link unduhan:', error);
        showNotification('Gagal membuat file kalender. Silakan coba lagi.');
    }
}

async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur kepada Allah SWT, kami mengundang Bapak/Ibu/Saudara(i) menghadiri pernikahan Suriansyah & Sonia. Barakallahu lakuma wa baraka ‘alaikuma.';
    const shareTitle = 'Undangan Pernikahan | Suriansyah & Sonia';
    const shareUrl = window.location.href;
    const imageUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/pemisah.jpeg';

    const fallbackTextShare = () => {
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText + '\n\n' + shareUrl,
                url: shareUrl
            }).catch(err => {
                copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
            });
        } else {
            copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
        }
    };

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Gagal memuat gambar');
        const imageBlob = await response.blob();
        const imageFile = new File([imageBlob], 'undangan.jpg', { type: 'image/jpeg' });
        const textBlob = new Blob([shareText + '\n\n' + shareUrl], { type: 'text/plain' });
        const textFile = new File([textBlob], 'undangan.txt', { type: 'text/plain' });
        const filesToShare = [imageFile, textFile];

        if (navigator.canShare && navigator.canShare({ files: filesToShare })) {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                files: filesToShare,
                url: shareUrl
            });
        } else {
            fallbackTextShare();
        }
    } catch (error) {
        console.warn('Gagal share dengan gambar, mencoba fallback teks:', error);
        fallbackTextShare();
    }
}

async function handleRsvpSubmission() {
  const nameInput = document.getElementById('guestName');
  const messageInput = document.getElementById('guestMessage');
  const attendanceInput = document.getElementById('attendance');

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  const attendance = attendanceInput.value;

  if (!name || !message || !attendance) {
    showNotification('Mohon lengkapi nama, ucapan, dan konfirmasi kehadiran! ⚠️');
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
  }
}

async function submitMessageToFirebase(name, message, attendance, isPublic) {
  if (!db) {
    showNotification("Gagal menyimpan ucapan: Database error.");
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
        <p>Apakah Anda ingin ucapan ini ditampilkan ?</p>
        <div class="popup-buttons">
          <button id="btn-public" class="btn btn--primary">Tampilkan</button>
          <button id="btn-private" class="btn btn--outline">Simpan Pribadi</button>
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
    copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin! 📋');
}

function openMaps() {
    const mapsUrl = 'https://maps.app.goo.gl/TvD12aGBA8WGaKQX8';
    window.open(mapsUrl, '_blank');
    showNotification('Membuka lokasi di Google Maps...');
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
    if (typeof db === 'undefined' || !db) throw new Error('Database belum diinisialisasi.');
    const messagesRef = collection(db, 'messages');
    const messagesQuery = query(messagesRef, where('isPublic', '==', true), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(messagesQuery);

    if (querySnapshot.empty) {
      noMessagesEl.classList.remove('hidden');
      return;
    }
    noMessagesEl.classList.add('hidden');

    const messagesHtml = querySnapshot.docs.map(doc => {
      const msg = doc.data();
      const attendanceText = msg.attendance === 'hadir' ? 'Akan Hadir' : 'Tidak Hadir';
      return `
        <div class="message-item">
            <span class="message-name">${escapeHtml(msg.name)} - <i>(${escapeHtml(attendanceText)})</i></span>
            <p class="message-text">${escapeHtml(msg.message)}</p>
        </div>
      `;
    }).join('');
    container.innerHTML = messagesHtml;
  } catch (error) {
    console.error('Error loading messages:', error);
    container.innerHTML = '';
    container.appendChild(noMessagesEl);
    noMessagesEl.classList.remove('hidden');
  }
}

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

window.addEventListener('beforeunload', () => {
    if (countdownInterval) clearInterval(countdownInterval);
});
