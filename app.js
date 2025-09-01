// Wedding Invitation JavaScript - Versi Scroll Sederhana
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// === VARIABEL GLOBAL ===
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;

// === KONFIGURASI FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyAbT55NRUO49GQnhN-Uf_yONSpTQBJUgqU",
  authDomain: "weddinginvitationss.firebaseapp.com",
  projectId: "weddinginvitationss",
  storageBucket: "weddinginvitationss.appspot.com",
  messagingSenderId: "348557007083",
  appId: "1:348557007083:web:c966107d29e0dcfcbe86ae"
};

// === INISIALISASI ===
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    backgroundMusic = document.getElementById('backgroundMusic');
    setupEventListeners();
    startCountdown();
    createMusicButton(); // Buat tombol musik saat aplikasi dimuat
}

// === PENGATUR EVENT LISTENER ===
function setupEventListeners() {
    document.getElementById('openInvitationBtn')?.addEventListener('click', openInvitation);
    document.getElementById('saveDateBtn')?.addEventListener('click', saveTheDate);
    document.getElementById('shareBtn')?.addEventListener('click', shareInvitation);
    document.getElementById('openMapsBtn')?.addEventListener('click', openMaps);
    document.getElementById('submitRsvpBtn')?.addEventListener('click', handleRsvpSubmission);
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => copyAccount(e.target.dataset.account));
    });
}


// === FUNGSI UTAMA: MEMBUKA UNDANGAN ===
function openInvitation() {
    const landingPage = document.getElementById('landingPage');
    const mainContent = document.getElementById('mainContent');
    const musicButton = document.querySelector('.music-toggle-btn');

    // 1. Putar musik & update ikon
    backgroundMusic.play().catch(e => console.log("Autoplay musik dicegah browser."));
    if (musicButton) {
        musicButton.innerHTML = '🎵';
        musicButton.classList.add('playing');
        musicButton.style.borderColor = 'var(--wedding-tosca)';
        musicButton.style.color = 'var(--wedding-tosca)';
    }

    // 2. Hilangkan halaman pembuka dengan fade out
    landingPage.style.opacity = '0';
    setTimeout(() => {
        landingPage.style.display = 'none';
    }, 800); // Sesuaikan dengan durasi transisi di CSS

    // 3. Tampilkan konten utama dan aktifkan scroll
    mainContent.style.display = 'block';
    document.body.style.overflow = 'auto';

    // 4. Muat pesan dari tamu
    loadGuestMessages();
}

// === FUNGSI MUSIK ===
function createMusicButton() {
    if (document.querySelector('.music-toggle-btn')) return;
    
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔇';
    musicButton.className = 'music-toggle-btn';
    
    // Tambahkan style langsung di sini
    Object.assign(musicButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '1001',
        background: 'rgba(0, 0, 0, 0.4)', // Background semi-transparan
        color: 'var(--wedding-gold)',
        border: '2px solid var(--wedding-gold)',
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(5px)',
        transition: 'all 0.3s ease'
    });
    
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicButton.innerHTML = '🎵';
            musicButton.style.borderColor = 'var(--wedding-tosca)';
            musicButton.style.color = 'var(--wedding-tosca)';
        } else {
            backgroundMusic.pause();
            musicButton.innerHTML = '🔇';
            musicButton.style.borderColor = 'var(--wedding-gold)';
            musicButton.style.color = 'var(--wedding-gold)';
        }
    });

    document.body.appendChild(musicButton);
}


// === FUNGSI-FUNGSI LAINNYA (COUNTDOWN, RSVP, DLL) ===

function startCountdown() {
    const weddingDate = new Date('2025-09-24T07:00:00+08:00');
    const els = {
        d: document.getElementById('days'),
        h: document.getElementById('hours'),
        m: document.getElementById('minutes'),
        s: document.getElementById('seconds')
    };
    if (!els.d || !els.h || !els.m || !els.s) return;

    const update = () => {
        const distance = weddingDate.getTime() - Date.now();
        if (distance <= 0) {
            clearInterval(countdownInterval);
            Object.values(els).forEach(el => el.textContent = '00');
            return;
        }
        els.d.textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
        els.h.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
        els.m.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
        els.s.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
    };
    update();
    countdownInterval = setInterval(update, 1000);
}

async function handleRsvpSubmission() {
    const inputs = {
        name: document.getElementById('guestName'),
        message: document.getElementById('guestMessage'),
        attendance: document.getElementById('attendance')
    };
    const data = {
        name: inputs.name.value.trim(),
        message: inputs.message.value.trim(),
        attendance: inputs.attendance.value
    };
    if (!data.name || !data.message || !data.attendance) {
        showNotification('Mohon lengkapi semua isian!');
        return;
    }
    const isPublic = await showPrivacyPopup();
    if (isPublic === null) return;

    if (await submitMessageToFirebase({...data, isPublic})) {
        showNotification('Ucapan Anda berhasil terkirim. Terima kasih!');
        Object.values(inputs).forEach(input => input.value = '');
        loadGuestMessages();
    }
}

async function submitMessageToFirebase(data) {
    if (!db) {
        showNotification("Gagal: Database error.");
        return false;
    }
    try {
        await addDoc(collection(db, "messages"), { ...data, timestamp: serverTimestamp() });
        return true;
    } catch (error) {
        console.error("Firebase Error: ", error);
        showNotification("Terjadi kesalahan saat mengirim.");
        return false;
    }
}

function showPrivacyPopup() {
    return new Promise(resolve => {
        document.getElementById('privacy-popup-container')?.remove();
        const popup = document.createElement('div');
        popup.id = 'privacy-popup-container';
        popup.innerHTML = `
          <div class="popup-overlay"></div>
          <div class="popup-box">
            <h3>Tampilkan Ucapan?</h3>
            <p>Apakah ucapan ini boleh ditampilkan untuk tamu lain?</p>
            <div class="popup-buttons">
              <button id="btn-public" class="btn btn--primary">Tampilkan</button>
              <button id="btn-private" class="btn btn--outline">Simpan Pribadi</button>
            </div>
          </div>
        `;
        document.body.appendChild(popup);
        const close = () => popup.remove();
        popup.querySelector('#btn-public').onclick = () => { close(); resolve(true); };
        popup.querySelector('#btn-private').onclick = () => { close(); resolve(false); };
        popup.querySelector('.popup-overlay').onclick = () => { close(); resolve(null); };
    });
}

async function loadGuestMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    try {
        if (!db) throw new Error('DB not initialized');
        const q = query(collection(db, "messages"), where('isPublic', '==', true), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            container.innerHTML = '<p class="no-messages">Jadilah yang pertama memberi ucapan!</p>';
            return;
        }
        container.innerHTML = snapshot.docs.map(doc => {
            const msg = doc.data();
            const attendanceText = msg.attendance === 'hadir' ? 'Akan Hadir' : 'Tidak Hadir';
            return `
              <div class="message-item">
                <div class="message-header">
                  <span class="message-name">${escapeHtml(msg.name)}</span>
                  <span class="message-attendance message-attendance--${escapeHtml(msg.attendance)}">${escapeHtml(attendanceText)}</span>
                </div>
                <p class="message-text">${escapeHtml(msg.message)}</p>
              </div>`;
        }).join('');
    } catch (error) {
        console.error("Error loading messages:", error);
        container.innerHTML = '<p class="no-messages">Gagal memuat ucapan.</p>';
    }
}

// === FUNGSI BANTU (HELPERS) ===
function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, 'Nomor rekening berhasil disalin!');
}

function openMaps() {
    window.open('https://maps.app.goo.gl/TvD12aGBA8WGaKQX8', '_blank');
}

function saveTheDate() {
    const event = {
        title: 'Pernikahan Suriansyah & Sonia Agustina Oemar',
        start: '2025-09-24T07:00:00+08:00', end: '2025-09-24T17:00:00+08:00',
        description: 'Acara Pernikahan Suriansyah & Sonia Agustina Oemar.',
        location: 'Masjid Jabal Rahmah Mandin & Rumah Mempelai Wanita'
    };
    const toUTC = d => new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${Date.now()}\nDTSTAMP:${toUTC(new Date())}\nDTSTART;TZID=Asia/Makassar:${toUTC(event.start)}\nDTEND;TZID=Asia/Makassar:${toUTC(event.end)}\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pernikahan_suriansyah_sonia.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('File kalender (.ics) telah diunduh.');
}


function shareInvitation() {
    const shareData = {
        title: 'Undangan Pernikahan | Suriansyah & Sonia',
        text: 'Dengan penuh syukur, kami mengundang Anda untuk menghadiri pernikahan kami, Suriansyah & Sonia.',
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        copyToClipboard(shareData.text + '\n' + shareData.url, 'Link undangan disalin ke clipboard!');
    }
}


function showNotification(message) {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.textContent = message;
    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px', background: 'var(--wedding-gold)',
        color: 'var(--wedding-black)', padding: '12px 20px', borderRadius: '8px',
        zIndex: '2002', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transform: 'translateX(120%)', transition: 'transform 0.4s ease-out'
    });
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 50);
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(successMessage || 'Teks berhasil disalin!');
    }).catch(err => {
        showNotification('Gagal menyalin ❌');
    });
}

function escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('weddingVideo', {
        events: { 'onStateChange': onPlayerStateChange }
    });
};

function onPlayerStateChange(event) {
    const musicButton = document.querySelector('.music-toggle-btn');
    isVideoPlaying = (event.data == YT.PlayerState.PLAYING);
    if (isVideoPlaying) {
        backgroundMusic.pause();
    } else {
        if (musicButton && musicButton.classList.contains('playing')) {
             if (backgroundMusic.paused) {
                 backgroundMusic.play().catch(e => {});
             }
        }
    }
}

