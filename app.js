// Wedding Invitation JavaScript - Animated & Scrollable Version

// Menggunakan import dari URL CDN Firebase karena ini adalah modul ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Variabel global
let backgroundMusic;
let countdownInterval;
let isVideoPlaying = false;
let ytPlayer;

const lyricColors = ['var(--wedding-text-main)', 'var(--wedding-primary)', 'var(--color-sakura-pink)'];
let lyricColorIndex = 0;
// Data lirik lagu
const lyricsData = [
    { time: 2, text: "So I sneak out to the garden to see you" },
    { time: 6, text: "We keep quiet 'cause we're dead if they knew" },
    { time: 11, text: "So close your eyes" },
    { time: 15, text: "Escape this town for a little while" },
    { time: 22, text: "'Cause you were Romeo, I was a scarlet letter" },
    { time: 26, text: "And my daddy said, \"Stay away from Juliet\"" },
    { time: 31, text: "But you were everything to me" },
    { time: 34, text: "I was begging you, \"Please don't go,\" and I said" },
    { time: 42, text: "Romeo, take me somewhere we can be alone" },
    { time: 47, text: "I'll be waiting, all there's left to do is run" },
    { time: 52, text: "You'll be the prince and I'll be the princess" },
    { time: 57, text: "It's a love story, baby, just say, \"Yes\"" },
    { time: 62, text: "Romeo, save me, they're trying to tell me how to feel" },
    { time: 67, text: "This love is difficult, but it's real" },
    { time: 72, text: "Don't be afraid, we'll make it out of this mess" },
    { time: 76, text: "It's a love story, baby, just say, \"Yes\"" },
    { time: 100, text: "But I got tired of waiting" },
    { time: 105, text: "Wondering if you were ever coming around" },
    { time: 110, text: "My faith in you was fading" },
    { time: 115, text: "When I met you on the outskirts of town and I said" },
    { time: 121, text: "\"Romeo, save me, I've been feeling so alone\"" },
    { time: 126, text: "\"I keep waiting for you, but you never come\"" },
    { time: 131, text: "\"Is this in my head? I don't know what to think\"" },
    { time: 135, text: "He knelt to the ground and pulled out a ring, and said" },
    { time: 141, text: "\"Marry me, Juliet, you'll never have to be alone\"" },
    { time: 146, text: "\"I love you and that's all I really know\"" },
    { time: 150, text: "\"I talked to your dad, go pick out a white dress\"" },
    { time: 156, text: "\"It's a love story, baby, just say, 'Yes'\"" },
    { time: 176, text: "'Cause we were both young when I first saw you" }
];

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

// app.js

function handleVisibilityChange() {
    // Pastikan variabel backgroundMusic sudah ada
    if (!backgroundMusic) return;

    // Jika halaman menjadi tidak terlihat (ditinggalkan)
    if (document.visibilityState === 'hidden') {
        backgroundMusic.pause();
    } 
    // (Opsional) Jika halaman kembali terlihat
    else if (document.visibilityState === 'visible') {
        // Cek apakah undangan sudah dibuka sebelum melanjutkan musik
        const session0 = document.getElementById('session0');
        if (session0 && session0.classList.contains('fade-out')) {
             backgroundMusic.play().catch(e => console.log('Gagal melanjutkan musik:', e));
        }
    }
}

function setupGiftReveal() {
    const revealBtn = document.getElementById('revealAccountsBtn');
    const accountsWrapper = document.getElementById('bankAccountsWrapper');

    if (revealBtn && accountsWrapper) {
        revealBtn.addEventListener('click', () => {
            // Tampilkan kontainer rekening
            accountsWrapper.classList.remove('hidden');

            // Sembunyikan tombol "Tampilkan" setelah diklik
            revealBtn.style.display = 'none';
        });
    }
}

// Pastikan initApp selalu terdaftar dan dijalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');

    // Logika baru yang lebih bersih
    if (guestName) {
        const formattedName = guestName.replace(/\+/g, ' ');
        const guestNameDisplay = document.getElementById('guestNameDisplay');
        const guestNameDisplayFront = document.getElementById('guestNameDisplayFront');

        if (guestNameDisplay) guestNameDisplay.textContent = formattedName;
        if (guestNameDisplayFront) guestNameDisplayFront.textContent = formattedName;
    }
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
    setupGiftReveal();
    setupShareModal();
    document.addEventListener('visibilitychange', handleVisibilityChange);
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
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => generalObserver.observe(el));
}


// --- Lirik Berjalan ---
// === BLOK KODE LIRIK BARU (Salin semua di bawah ini) ===

let displayedLyricsIndexes = []; // Untuk mencatat lirik yang sudah muncul

function setupLyrics() {
    if (backgroundMusic) {
        backgroundMusic.addEventListener('timeupdate', updateScrollingLyrics);
    }
}

function updateScrollingLyrics() {
    const currentTime = backgroundMusic.currentTime;
    const container = document.getElementById('lyrics-container');
    if (!container) return;

    // Jika lagu diulang dari awal, reset pelacak lirik
    if (currentTime < 1) {
        container.innerHTML = ''; 
        displayedLyricsIndexes = [];
    }

    // Periksa setiap lirik di dalam data
    // GANTI SELURUH ISI lyricsData.forEach DENGAN INI
    lyricsData.forEach((lyric, index) => {
    // Cek apakah waktunya sudah pas DAN lirik ini BELUM pernah ditampilkan
        if (currentTime >= lyric.time && !displayedLyricsIndexes.includes(index)) {

        // Tandai lirik ini sudah ditampilkan
            displayedLyricsIndexes.push(index);

        // --- LOGIKA BARU UNTUK WARNA BERURUTAN ---
        // 1. Pilih warna dari array berdasarkan urutan saat ini
            const chosenColor = lyricColors[lyricColorIndex];
        // 2. Siapkan index untuk warna berikutnya (akan berputar kembali ke 0 jika sudah mencapai akhir)
            lyricColorIndex = (lyricColorIndex + 1) % lyricColors.length;
        // --- AKHIR LOGIKA BARU ---

        // Buat elemen lirik baru
        const lyricElement = document.createElement('div');
            lyricElement.className = 'lyric-line';
            lyricElement.textContent = lyric.text;
            lyricElement.style.color = chosenColor; // Terapkan warna yang sudah dipilih

        // Tentukan posisi acak di layar
            const randomTop = Math.random() * 65 + 15;
            const randomLeft = Math.random() * 60 + 20;
            lyricElement.style.top = `${randomTop}vh`;
            lyricElement.style.left = `${randomLeft}vw`;
            lyricElement.style.transform = 'translateX(-50%)';

        // Tambahkan lirik ke container
            container.appendChild(lyricElement);

        // Animasikan: muncul, diam sejenak, lalu hilang dan hapus elemen
            const tl = gsap.timeline({
                onComplete: () => lyricElement.remove()
            });
            tl.to(lyricElement, { opacity: 1, duration: 1 })
                .to(lyricElement, { opacity: 0, duration: 1 }, "+=5");
        }
    });
}

// === AKHIR BLOK KODE LIRIK BARU ===

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

// --- Placeholder Ikon Suara (PNG) ---
function showMusicEnableButton() {
    const musicButton = document.createElement('button');
    musicButton.className = 'btn music-toggle-btn';

    // --- SILAKAN ISI URL PNG ANDA DI SINI ---
    const musicOnPngUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/on.png'; // CONTOH
    const musicOffPngUrl = 'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/off.png';  // CONTOH
    
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
  }, 500);

  // Memulai video YouTube secara otomatis (tanpa suara dan akan berulang)
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.playVideo();
  }

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

// GANTI FUNGSI LAMA DENGAN INI
async function shareInvitation(guestName) {
    // Fungsi ini sekarang hanya fokus untuk membagikan
    const baseUrl = window.location.origin + window.location.pathname;
    const personalizedUrl = `${baseUrl}?to=${encodeURIComponent(guestName)}`;
    const shareData = {
        title: 'Undangan Pernikahan: Ancah & Sonia',
        text: `Assalamualaikum 👋\n\nDengan penuh rasa syukur, kami ingin membagikan kabar bahagia dan mengundang ${guestName} untuk hadir di acara pernikahan kami, Ancah & Sonia.\n\nKehadiran dan doa restu Anda sangat berarti bagi kami.\n"Barakallahu laka, wa baraka 'alaika, wa jama'a bainakuma fii khair."\n\nSilakan lihat detail acara di tautan berikut:`,
        url: personalizedUrl
    };
    try {
        await navigator.share(shareData);
    } catch (err) {
        copyToClipboard(personalizedUrl, 'Link undangan personal berhasil disalin!');
    }
}

// TAMBAHKAN BLOK KODE BARU INI
function setupShareModal() {
    const shareBtn = document.getElementById('shareBtn');
    const overlay = document.getElementById('shareModalOverlay');
    const guestNameInput = document.getElementById('shareGuestNameInput');
    const cancelBtn = document.getElementById('cancelShareBtn');
    const confirmBtn = document.getElementById('confirmShareBtn');

    // Saat tombol "Bagikan Undangan" utama diklik -> Buka popup
    shareBtn?.addEventListener('click', () => {
        overlay?.classList.remove('hidden');
        guestNameInput.focus(); // Langsung fokus ke kolom input
    });

    // Fungsi untuk menutup popup
    const closeModal = () => {
        overlay?.classList.add('hidden');
        guestNameInput.value = ''; // Kosongkan input
    };

    // Tutup popup jika klik Batal atau area gelap di belakang
    cancelBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Saat tombol "Bagikan" di dalam popup diklik -> jalankan fungsi share
    confirmBtn?.addEventListener('click', () => {
        const guestName = guestNameInput.value.trim();
        if (guestName) {
            shareInvitation(guestName);
            closeModal();
        } else {
            showNotification('Mohon isi nama tamu terlebih dahulu.');
        }
    });
}

// GANTI FUNGSI LAMA DENGAN VERSI BARU INI
async function handleRsvpSubmission() {
    const nameEl = document.getElementById('guestName');
    const messageEl = document.getElementById('guestMessage');
    const attendanceEl = document.getElementById('attendance');
    const visibility = document.querySelector('input[name="messageVisibility"]:checked').value;

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
        // Kirim data ke Firebase seperti biasa
        await submitMessageToFirebase(name, message, attendance, visibility);
        
        showNotification("Terima kasih atas ucapan dan konfirmasinya!");

        // === LOGIKA BARU UNTUK TAMPIL INSTAN ===
        if (visibility === 'public') {
            const container = document.getElementById('messagesContainer');
            const noMessagesEl = document.getElementById('noMessages');
            
            // Sembunyikan pesan "Belum ada ucapan" jika ada
            if (noMessagesEl) noMessagesEl.style.display = 'none';

            // Tentukan warna dan teks status kehadiran
            const attendanceStatus = attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir';
            const statusColor = attendance === 'hadir' ? 'var(--wedding-primary)' : 'rgba(0, 0, 0, 0.6)';

            // Buat elemen HTML untuk pesan baru
            const newMessageElement = document.createElement('div');
            newMessageElement.innerHTML = `
                <div class="message-item">
                    <p class="message-name shimmer-text">${escapeHtml(name)} 
                        <span style="font-size: 0.8em; color: ${statusColor}; font-weight: bold;">
                            (${attendanceStatus})
                        </span>
                    </p>
                    <p class="message-text">${escapeHtml(message) || '<i>Tidak ada pesan.</i>'}</p>
                </div>
            `;
            
            // Masukkan pesan baru di paling atas daftar
            container.prepend(newMessageElement.firstChild);
        }
        // ==========================================

        // Kosongkan form setelah berhasil
        nameEl.value = '';
        messageEl.value = '';
        attendanceEl.value = '';
        
        // Hapus pemanggilan loadGuestMessages() dari sini untuk mencegah refresh ganda
        // loadGuestMessages(); 

    } catch (error) {
        console.error("Error submitting RSVP:", error);
        showNotification("Maaf, terjadi kesalahan saat mengirim ucapan.");
    }
}

async function submitMessageToFirebase(name, message, attendance, visibility) {
    if (!db) {
        console.error("Firestore is not initialized.");
        return;
    }
    await addDoc(collection(db, "guestbook"), {
        name: name,
        message: message,
        attendance: attendance,
        timestamp: serverTimestamp(),
	visibility: visibility
    });
}

function copyAccount(accountNumber) {
    copyToClipboard(accountNumber, `Nomor rekening ${accountNumber} berhasil disalin!`);
}

function openMaps() {
    const url = 'https://maps.app.goo.gl/1BLjCXhxktJSdVJG6?g_st=aw';
    window.open(url, '_blank');
}

// GANTI FUNGSI LAMA DENGAN VERSI AMAN INI
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// GANTI SELURUH FUNGSI LAMA DENGAN VERSI BARU YANG REAL-TIME INI
function loadGuestMessages() {
    const container = document.getElementById('messagesContainer');
    const noMessagesEl = document.getElementById('noMessages');
    if (!container || !db) return;

    const q = query(collection(db, "guestbook"), orderBy("timestamp", "desc"));

    // INI BAGIAN UTAMA: onSnapshot menggantikan getDocs untuk pembaruan real-time
    onSnapshot(q, (querySnapshot) => {
        container.innerHTML = ''; // Kosongkan kontainer setiap kali ada pembaruan
        let publicMessagesCount = 0;

        if (querySnapshot.empty) {
            noMessagesEl.style.display = 'block';
            return; // Hentikan jika tidak ada dokumen sama sekali
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Hanya proses dan tampilkan pesan yang visibilitasnya 'public'
            if (data.visibility === 'public') {
                publicMessagesCount++;

                const attendanceStatus = data.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir';
                const statusColor = data.attendance === 'hadir' ? 'var(--wedding-primary)' : 'rgba(0, 0, 0, 0.6)';

                const messageItem = `
                    <div class="message-item">
                        <p class="message-name shimmer-text">${escapeHtml(data.name)} 
                            <span style="font-size: 0.8em; color: ${statusColor}; font-weight: bold;">
                                (${attendanceStatus})
                            </span>
                        </p>
                        <p class="message-text">${escapeHtml(data.message) || '<i>Tidak ada pesan.</i>'}</p>
                    </div>
                `;
                container.innerHTML += messageItem;
            }
        });

        // Tampilkan atau sembunyikan pesan "Belum ada ucapan" berdasarkan jumlah pesan publik
        if (publicMessagesCount === 0) {
            noMessagesEl.style.display = 'block';
        } else {
            noMessagesEl.style.display = 'none';
        }

    }, (error) => {
        // Fungsi ini akan berjalan jika ada error koneksi ke Firebase
        console.error("Error listening to messages: ", error);
        container.innerHTML = '<p>Gagal memuat ucapan. Cek koneksi internet Anda.</p>';
    });
}

// --- INTERAKSI VIDEO YOUTUBE ---
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('weddingVideo', {
    height: '360',
    width: '640',
    
    // PENTING: Ganti 'YOUR_YOUTUBE_VIDEO_ID' dengan ID video YouTube Anda
    videoId: '-xhKVu8uzIo', 
    
    playerVars: {
      'autoplay': 1,        // Mainkan otomatis
      'controls': 0,        // Sembunyikan kontrol pemutar
      'loop': 1,            // Ulangi video
      'mute': 1,            // Harus di-mute agar autoplay berfungsi
      'playsinline': 1,     // Penting untuk autoplay di mobile
      'modestbranding': 1,  // Sembunyikan logo YouTube
      'showinfo': 0,        // Sembunyikan judul video
      'rel': 0,             // Jangan tampilkan video terkait
      
      // PENTING: Agar 'loop' berfungsi, 'playlist' harus diisi dengan videoId yang sama
      'playlist': '-xhKVu8uzIo' 
    },
    events: { 
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange 
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();
}

// app.js
function onPlayerStateChange(event) {
  // ===> TAMBAHKAN BLOK INI <===
  // Jika video selesai (ENDED), putar lagi dari awal.
  if (event.data == YT.PlayerState.ENDED) {
    ytPlayer.playVideo(); 
  }
  // ============================

  if (event.data == YT.PlayerState.PLAYING) {
    pauseBackgroundMusic();
    isVideoPlaying = true;
  } else if (event.data == YT.PlayerState.PAUSED) { // Dihapus: || event.data == YT.PlayerState.ENDED
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
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--wedding-primary);
        color: var(--wedding-bg);
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, top 0.3s ease;
        font-family: var(--font-family-base);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.top = '30px';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.top = '20px';
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



