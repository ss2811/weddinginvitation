// Wedding Invitation JavaScript - Fixed Version

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
    
    // UBAH BAGIAN INI: Arahkan tombol submit baru ke fungsi yang tepat
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
// ---------- Robust startCountdown() - REPLACE existing function ----------
function startCountdown() {
    try {
        // Pastikan tidak ada interval lama berjalan
        if (typeof countdownInterval !== 'undefined' && countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        // Target tanggal acara (cek timezone)
        const weddingDate = new Date('2025-09-24T07:00:00+08:00');
        console.log('[countdown] init. weddingDate =', weddingDate.toString());

        // Elemen target
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        // Jika elemen belum ada di DOM (mungkin berbeda timing), tunggu sampai muncul
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            console.warn('[countdown] salah satu elemen countdown tidak ditemukan. Menunggu elemen muncul di DOM...');
            // Pasang observer sederhana untuk menunggu elemen muncul
            const observer = new MutationObserver((mutations, obs) => {
                const d = document.getElementById('days');
                const h = document.getElementById('hours');
                const m = document.getElementById('minutes');
                const s = document.getElementById('seconds');
                if (d && h && m && s) {
                    obs.disconnect();
                    console.log('[countdown] elemen ditemukan oleh MutationObserver, memulai countdown sekarang.');
                    // panggil ulang startCountdown setelah elemen ada
                    startCountdown();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        // Fungsi update satu kali dan setiap detik
        function update() {
            const now = Date.now();
            const distance = weddingDate.getTime() - now;

            // Debug: log jarak (ms)
            // console.log('[countdown] distance (ms):', distance);

            if (distance <= 0) {
                // Jika sudah lewat
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                console.log('[countdown] acara sudah lewat atau sama dengan sekarang.');
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

        // Jalankan update segera lalu set interval
        update();
        countdownInterval = setInterval(update, 1000);
        console.log('[countdown] started. interval id:', countdownInterval);
    } catch (err) {
        console.error('[countdown] error saat memulai:', err);
    }
}

// Ganti fungsi saveTheDate dan formatForGCal yang lama dengan ini
async function saveTheDate() {
    const event = {
        title: 'Pernikahan Suriansyah & Sonia Agustina Oemar',
        start: '2025-09-24T07:00:00+08:00', // Waktu Mulai (WITA)
        end: '2025-09-24T17:00:00+08:00',   // Waktu Selesai (WITA)
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar. \\n\\nJangan lupa hadir dan memberikan doa restu.',
        location: 'Masjid Jabal Rahmah Mandin & Rumah Mempelai Wanita'
    };

    // Helper untuk mengubah tanggal ke format UTC yang dibutuhkan ICS
    // Formatnya YYYYMMDDTHHMMSSZ
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

    // 1. Coba gunakan Web Share API (terbaik untuk mobile)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: event.title,
                text: 'Simpan tanggal pernikahan kami di kalender Anda.'
            });
            showNotification('Pilih aplikasi Kalender untuk menyimpan acara.');
            return; // Hentikan eksekusi jika berhasil
        } catch (error) {
            console.warn('Web Share API dibatalkan atau gagal:', error);
            // Jika pengguna membatalkan dialog share, kita lanjutkan ke metode fallback.
        }
    }

    // 2. Fallback: Unduh file .ics secara langsung
    try {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = file.name;

        // Trik untuk memicu klik tanpa terlihat oleh pengguna
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Membersihkan URL objek setelah diunduh untuk menghemat memori
        URL.revokeObjectURL(link.href);
        
        showNotification('File kalender (.ics) telah diunduh. Silakan buka file tersebut.');
    } catch (error) {
        console.error('Gagal membuat link unduhan:', error);
        showNotification('Gagal membuat file kalender. Silakan coba lagi.');
    }
}

// Ganti / tambahkan fungsi shareInvitation() dengan versi ini
async function shareInvitation() {
    const shareText = 'Assalamualaikum Wr. Wb.\nDengan penuh syukur kepada Allah SWT, kami mengundang Bapak/Ibu/Saudara(i) menghadiri pernikahan Suriansyah & Sonia. Barakallahu lakuma wa baraka ‘alaikuma.';
    const shareTitle = 'Undangan Pernikahan | Suriansyah & Sonia';
    const shareUrl = window.location.href;
    const imageUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/pemisah.jpeg';

    // Utility: fallback share hanya teks/url
    const fallbackTextShare = () => {
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText + '\n\n' + shareUrl,
                url: shareUrl
            }).catch(err => {
                console.log('Fallback text share gagal:', err);
                // Jika semua gagal, copy teks ke clipboard
                copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
            });
        } else {
            // Browser lama: salin ke clipboard sebagai jaminan
            copyToClipboard(`${shareText}\n\n${shareUrl}`, 'Teks undangan disalin ke clipboard.');
        }
    };

    try {
        // Ambil gambar
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Gagal memuat gambar');

        const imageBlob = await response.blob();
        const imageFile = new File([imageBlob], 'undangan.jpg', { type: imageBlob.type || 'image/jpeg' });

        // Buat file teks yang berisi teks undangan + link (agar penerima pasti punya teks)
        const textBlob = new Blob([shareText + '\n\n' + shareUrl], { type: 'text/plain' });
        const textFile = new File([textBlob], 'undangan.txt', { type: 'text/plain' });

        const filesToShare = [imageFile, textFile];

        // Jika browser mendukung share file dan bisa share filesToShare
        if (navigator.canShare && navigator.canShare({ files: filesToShare })) {
            await navigator.share({
                title: shareTitle,
                text: shareText, // beberapa platform mungkin abaikan ini saat file ada, tapi tetap kita sertakan
                files: filesToShare,
                url: shareUrl
            });
            return;
        }

        // Jika browser tidak mendukung share file, fallback ke text-only share
        fallbackTextShare();
    } catch (error) {
        console.warn('Gagal share dengan gambar, mencoba fallback teks:', error);
        fallbackTextShare();
    }
}

// HAPUS fungsi sendWhatsApp() dan submitRSVP() yang lama.
// GANTI dengan TIGA fungsi baru di bawah ini.

/**
 * Fungsi utama yang dipanggil saat tombol Kirim Ucapan diklik.
 * Mengambil data, validasi, lalu memanggil popup.
 */
async function handleRsvpSubmission() {
  const nameInput = document.getElementById('guestName');
  const messageInput = document.getElementById('guestMessage');
  const attendanceInput = document.getElementById('attendance');

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  const attendance = attendanceInput.value;

  // 1. Validasi input
  if (!name || !message || !attendance) {
    showNotification('Mohon lengkapi nama, ucapan, dan konfirmasi kehadiran! ⚠️');
    return;
  }

  // 2. Tampilkan popup dan tunggu pilihan tamu
  const isPublic = await showPrivacyPopup();

  // Jika tamu menutup popup (isPublic === null), hentikan proses
  if (isPublic === null) return;

  // 3. Simpan ke Firebase berdasarkan pilihan tamu
  const success = await submitMessageToFirebase(name, message, attendance, isPublic);

  // 4. Jika berhasil, bersihkan form dan tampilkan notifikasi
  if (success) {
    showNotification('Ucapan Anda berhasil terkirim. Terima kasih!');
    nameInput.value = '';
    messageInput.value = '';
    attendanceInput.selectedIndex = 0;

    // BARIS DI BAWAH INI TELAH DIHAPUS
    // setTimeout(() => {
    //   navigateToSession(7);
    // }, 1500); 
  }
}

/**
 * Menyimpan ucapan ke Firebase dengan tambahan flag privasi.
 * @param {boolean} isPublic - True jika ucapan boleh ditampilkan, false jika tidak.
 */
async function submitMessageToFirebase(name, message, attendance, isPublic) {
  if (!db) {
    console.error("Database tidak terhubung.");
    showNotification("Gagal menyimpan ucapan: Database error.");
    return false;
  }
  try {
    await addDoc(collection(db, "messages"), {
      name: name,
      message: message,
      attendance: attendance,
      isPublic: isPublic, // Menyimpan pilihan privasi tamu
      timestamp: serverTimestamp()
    });
    console.log("Ucapan berhasil disimpan ke Firebase.");
    return true;
  } catch (error) {
    console.error("Error menyimpan ke Firebase: ", error);
    showNotification("Terjadi kesalahan saat mengirim ucapan.");
    return false;
  }
}

/**
 * Membuat dan menampilkan popup/modal untuk pilihan privasi.
 * @returns {Promise<boolean|null>} - Resolves: true (Tampilkan), false (Pribadi), null (Tutup).
 */
function showPrivacyPopup() {
  return new Promise(resolve => {
    // Hapus popup lama jika ada
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

    const closePopup = () => {
      popupContainer.remove();
    };
    
    document.getElementById('btn-public').onclick = () => {
      closePopup();
      resolve(true); // Pilihan: Tampilkan
    };
    document.getElementById('btn-private').onclick = () => {
      closePopup();
      resolve(false); // Pilihan: Simpan Pribadi
    };
    popupContainer.querySelector('.popup-overlay').onclick = () => {
      closePopup();
      resolve(null); // Pengguna menutup popup
    };
  });
}

// Session 6: Copy Account
function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin! 📋');
}

function openMaps() {
    // URL Google Maps bisa disesuaikan dengan query pencarian atau link langsung.
    // Query ini akan mencari "Masjid Jabal Rahmah Mandin" di Google Maps.
    const mapsUrl = 'https://maps.app.goo.gl/TvD12aGBA8WGaKQX8';
    window.open(mapsUrl, '_blank');
    showNotification('Membuka lokasi di Google Maps...');
}

// Session 7: Guest Messages
// Helper kecil untuk mencegah XSS (jika belum ada)
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
  if (!container) {
    console.warn('[loadGuestMessages] messagesContainer tidak ditemukan.');
    return;
  }

  // Coba cari elemen "no messages" secara fleksibel
  let noMessagesEl = container.querySelector('.no-messages') || document.getElementById('noMessages');

  // Jika tidak ada, buat satu sebagai fallback
  if (!noMessagesEl) {
    noMessagesEl = document.createElement('p');
    noMessagesEl.className = 'no-messages';
    noMessagesEl.id = 'noMessages';
    noMessagesEl.textContent = 'Belum ada ucapan dari tamu';
    container.appendChild(noMessagesEl);
  }

  // Kosongkan container lalu re-append fallback (biar konsisten)
  container.innerHTML = '';
  container.appendChild(noMessagesEl);

  try {
    // Pastikan db (Firestore) sudah diinisialisasi sebelumnya
    if (typeof db === 'undefined' || !db) throw new Error('Database belum diinisialisasi.');

    const messagesRef = collection(db, 'messages');
    // Ambil hanya yang public, urut dari terbaru
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
          <div class="message-header">
            <span class="message-name">${escapeHtml(msg.name)}</span>
            <span class="message-attendance message-attendance--${escapeHtml(msg.attendance)}">${escapeHtml(attendanceText)}</span>
          </div>
          <p class="message-text">${escapeHtml(msg.message)}</p>
        </div>
      `;
    }).join('');

    container.innerHTML = messagesHtml;
  } catch (error) {
    console.error('Error loading messages:', error);
    // Tampilkan fallback
    container.innerHTML = '';
    container.appendChild(noMessagesEl);
    noMessagesEl.classList.remove('hidden');
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


// Cleanup
window.addEventListener('beforeunload', () => {
    if (countdownInterval) clearInterval(countdownInterval);
});
