class WeddingInvitation {
  constructor() {
    this.init();
  }

  init() {
    this.setupFirebase();
    this.setupEventListeners();
    this.setupCountdown();
    this.setupMusic();
    this.setupNavigation();
    this.setupGuestName();
    this.setupAnimations();
    this.createFallingPetals();
  }

  // Firebase Configuration
  setupFirebase() {
    this.mockDatabase = {
      rsvp: [],
      wishes: [
        {
          name: "Contoh Tamu",
          message:
            "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakahu lakuma wa baraka alaikuma wa jama'a fi khair.",
          timestamp: new Date(),
          display: true,
        },
      ],
    };

    this.loadWishes();
  }

  setupEventListeners() {
    // Tombol buka undangan di sesi 1
    const openBtn = document.getElementById("openInvitation");
    if (openBtn) {
      openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Buka Undangan clicked"); // Debug log
        this.startInvitation();
      });
    }

    // Tombol lewati video di sesi 2
    const skipVideo = document.getElementById("skipVideo");
    if (skipVideo) {
      skipVideo.addEventListener("click", () => this.skipVideo());
    }

    // Tombol tambah ke Google Calendar
    const googleCalBtn = document.getElementById("addToGoogleCal");
    if (googleCalBtn) {
      googleCalBtn.addEventListener("click", () => this.addToGoogleCalendar());
    }

    // Tombol social share WhatsApp
    const whatsappBtn = document.getElementById("shareWhatsapp");
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", () => this.shareWhatsApp());
    }

    // Tombol social share Facebook
    const facebookBtn = document.getElementById("shareFacebook");
    if (facebookBtn) {
      facebookBtn.addEventListener("click", () => this.shareFacebook());
    }

    // Tombol social share Twitter
    const twitterBtn = document.getElementById("shareTwitter");
    if (twitterBtn) {
      twitterBtn.addEventListener("click", () => this.shareTwitter());
    }

    // Tombol copy link
    const copyLinkBtn = document.getElementById("copyLink");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => this.copyInvitationLink());
    }

    // Tombol kontrol musik
    const musicToggle = document.getElementById("musicToggle");
    if (musicToggle) {
      musicToggle.addEventListener("click", () => this.toggleMusic());
    }

    // Form RSVP
    const rsvpForm = document.getElementById("rsvpForm");
    if (rsvpForm) {
      rsvpForm.addEventListener("submit", (e) => this.handleRSVP(e));
    }

    // Form Wishes
    const wishesForm = document.getElementById("wishesForm");
    if (wishesForm) {
      wishesForm.addEventListener("submit", (e) => this.handleWishes(e));
    }

    // Tombol copy nomor rekening
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.copyToClipboard(e));
    });

    // Scroll event untuk update navigasi dan cek pause video
    window.addEventListener("scroll", () => {
      this.updateNavigation();
      this.checkVideoPause();
    });
  }

  startInvitation() {
    console.log("Starting invitation flow");
    const section1 = document.getElementById("section1");
    const section2 = document.getElementById("section2");
    if (section1) section1.style.display = "none";
    if (section2) {
      section2.classList.remove("hidden");
      section2.style.display = "flex";
    }
  }

  skipVideo() {
    console.log("Skipping video");
    const section2 = document.getElementById("section2");
    if (section2) section2.style.display = "none";
    this.pauseVideo();
    this.scrollToSection("section3");
    this.startMusic();
  }

  pauseVideo() {
    if (this.music) this.music.pause();
    const video = document.getElementById("cinematicVideo");
    if (video) video.pause();
  }

  checkVideoPause() {
    const section2 = document.getElementById("section2");
    if (section2 && section2.style.display === "none") {
      this.pauseVideo();
    }
  }

  setupCountdown() {
    const weddingDate = new Date("2025-09-24T07:00:00+08:00");
    const updateCountdown = () => {
      const now = new Date();
      const diff = weddingDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.textContent = days.toString().padStart(2, "0");
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");
      } else {
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minutesEl) minutesEl.textContent = "00";
        if (secondsEl) secondsEl.textContent = "00";
      }
    };
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  addToGoogleCalendar() {
    const title = "Pernikahan Suriansyah & Sonia";
    const details =
      "Akad Nikah dan Resepsi Pernikahan\n\nAkad: 07:00-08:00 WITA\nResepsi: 08:00 WITA - selesai\n\nLokasi: Rumah Mempelai Wanita, Samping Masjid Jabal Rahmah, Mandin, Kotabaru";
    const location =
      "Rumah Mempelai Wanita, samping masjid Jabal Rahmah, Mandin, Kotabaru";
    const startDate = "20250924T070000";
    const endDate = "20250924T120000";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}`;

    window.open(url, "_blank");
  }

  shareWhatsApp() {
    const text = `Assalamu'alaikum! Kami mengundang Anda untuk hadir dalam acara pernikahan kami:
    
Suri & Osi
Tanggal 24 September 2025
Lokasi Rumah Mempelai Wanita,
samping Masjid Jabal Rahmah Mandin, Kotabaru
    
Selengkapnya lihat di ${window.location.href}
`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  shareFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank");
  }

  shareTwitter() {
    const text = "Pernikahan Suri & Osi pada 24 September 2025";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  }

  async copyInvitationLink() {
    const button = document.getElementById("copyLink");
    if (!button) return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Link Tersalin';
      button.style.background = "var(--color-success)";
      button.style.borderColor = "var(--color-success)";
      button.style.color = "white";

      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = "";
        button.style.borderColor = "";
        button.style.color = "";
      }, 2000);
    } catch {
      alert("Gagal menyalin tautan. Silakan salin secara manual.");
    }
  }

  handleRSVP(e) {
    e.preventDefault();

    const name = document.getElementById("rsvpName")?.value || "";
    const attendance = document.getElementById("attendance")?.value || "";

    if (!name || !attendance) {
      alert("Silakan lengkapi semua field yang diperlukan.");
      return;
    }

    this.mockDatabase.rsvp.push({
      name,
      attendance,
      timestamp: new Date(),
    });

    this.showSuccessMessage("Terima kasih! Konfirmasi kehadiran Anda telah diterima.");
    e.target.reset();
    this.showConfetti();
  }

  handleWishes(e) {
    e.preventDefault();

    const name = document.getElementById("wishName")?.value || "";
    const message = document.getElementById("wishMessage")?.value || "";
    const option = document.querySelector('input[name="wishOption"]:checked')?.value || "display";

    if (!name || !message) {
      alert("Silakan lengkapi nama dan ucapan.");
      return;
    }

    if (option === "whatsapp") {
      const url = `https://wa.me/085251815099?text=${encodeURIComponent(
        `Ucapan Pernikahan dari: ${name}\n\n${message}`
      )}`;
      window.open(url, "_blank");
    } else {
      this.mockDatabase.wishes.unshift({
        name,
        message,
        timestamp: new Date(),
        display: true,
      });
      this.displayNewWish({ name, message, timestamp: new Date() });
    }

    this.showSuccessMessage("Terima kasih atas ucapan dan doa Anda!");
    e.target.reset();
    this.showConfetti();
  }

  displayNewWish(wish) {
    const container = document.getElementById("wishesContainer");
    if (!container) return;

    const elem = document.createElement("div");
    elem.className = "wish-item";
    elem.innerHTML = `
      <div class="wish-header">
        <h4>${this.escapeHtml(wish.name)}</h4>
        <span class="wish-time">${this.formatTime(wish.timestamp)}</span>
      </div>
      <p class="wish-text">${this.escapeHtml(wish.message)}</p>
    `;

    container.prepend(elem);
  }

  formatTime(date) {
    const diff = new Date() - new Date(date);
    if (diff < 60000) return "Baru saja";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} menit yang lalu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam yang lalu`;
    return `${Math.floor(diff / 86400000)} hari yang lalu`;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  copyToClipboard(e) {
    const btn = e.target.closest(".copy-btn");
    const text = btn?.dataset.copy;
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin';
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove("copied");
        }, 2000);
      })
      .catch(() => {
        alert("Gagal menyalin, silakan salin secara manual: " + text);
      });
  }

  setupMusic() {
    this.music = document.getElementById("backgroundMusic");
    this.musicButton = document.getElementById("musicToggle");
    this.isPlaying = false;
  }

  startMusic() {
    if (this.musicButton && !this.isPlaying) {
      this.isPlaying = true;
      this.musicButton.classList.remove("muted");
      if (this.music) this.music.play();
    }
  }

  toggleMusic() {
    if (!this.musicButton || !this.music) return;
    if (this.isPlaying) {
      this.music.pause();
      this.musicButton.classList.add("muted");
      this.isPlaying = false;
    } else {
      this.music.play();
      this.musicButton.classList.remove("muted");
      this.isPlaying = true;
    }
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.getAttribute("href").substring(1);
        this.scrollToSection(id);
      });
    });
  }

  scrollToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;

    section.classList.remove("hidden");
    section.style.display = "flex";

    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 60;
    const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  }

  updateNavigation() {
    const sections = document.querySelectorAll(".section:not(.hidden)");
    const navLinks = document.querySelectorAll(".nav-link");

    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 60;
    let currentSection = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navbarHeight + 100 && rect.bottom > navbarHeight + 100) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === currentSection) {
        link.classList.add("active");
      }
    });
  }

  setupGuestName() {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get("to") || params.get("guest") || "Tamu Terhormat";

    const guestNameElem = document.getElementById("guestName");
    if (guestNameElem) {
      guestNameElem.textContent = guestName;
    }
  }

  createFallingPetals() {
    setInterval(() => {
      if (window.scrollY > window.innerHeight * 2) {
        this.createDaisy();
      }
    }, 3000);
  }

  createDaisy() {
    const daisy = document.createElement("div");
    daisy.style.cssText = `
      position: fixed;
      top: -50px;
      left: ${Math.random() * 100}vw;
      width: ${Math.random() * 15 + 10}px;
      height: ${Math.random() * 15 + 10}px;
      background: white;
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      box-shadow:
        -4px 0 0 white,
        4px 0 0 white,
        0 -4px 0 white,
        0 4px 0 white,
        -3px -3px 0 white,
        3px -3px 0 white,
        -3px 3px 0 white,
        3px 3px 0 white;
      animation: fall ${Math.random() * 3 + 5}s linear forwards;
    `;
    document.body.appendChild(daisy);
    setTimeout(() => {
      daisy.remove();
    }, 8000);
  }

  showSuccessMessage(message) {
    const div = document.createElement("div");
    div.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--color-success);
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      text-align: center;
      font-weight: 600;
    `;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  showConfetti() {
    const overlay = document.getElementById("confettiOverlay");
    if (!overlay) return;

    overlay.classList.add("active");

    const colors = ["#1FB8CD", "#FFC185", "#B4413C", "#ECEBD5", "#5D878F"];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        this.createConfettiParticle(overlay, colors);
      }, i * 50);
    }

    setTimeout(() => {
      overlay.classList.remove("active");
      overlay.innerHTML = "";
    }, 3000);
  }

  createConfettiParticle(container, colors) {
    const particle = document.createElement("div");
    particle.className = "confetti-particle";
    particle.style.cssText = `
      left: ${Math.random() * 100}vw;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: 0s;
      animation-duration: ${Math.random() * 2 + 2}s;
    `;
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 4000);
  }
}

document.addEventListener("DOMContentLoaded", () => new WeddingInvitation());

// Additional smooth scroll behavior for older browsers
if (!CSS.supports("scroll-behavior", "smooth")) {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 60;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let start = null;

      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    });
  });
}
