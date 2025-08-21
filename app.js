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
    // Mock database for demo purposes
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

    // Calendar buttons
    const googleCalBtn = document.getElementById("addToGoogleCal");
    if (googleCalBtn) {
      googleCalBtn.addEventListener("click", () => this.addToGoogleCalendar());
    }

    // Social share buttons
    const whatsappBtn = document.getElementById("shareWhatsapp");
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", () => this.shareWhatsapp());
    }
    const facebookBtn = document.getElementById("shareFacebook");
    if (facebookBtn) {
      facebookBtn.addEventListener("click", () => this.shareFacebook());
    }
    const twitterBtn = document.getElementById("shareTwitter");
    if (twitterBtn) {
      twitterBtn.addEventListener("click", () => this.shareTwitter());
    }
    const copyLinkBtn = document.getElementById("copyLink");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => this.copyInvitationLink());
    }

    // Music control
    const musicToggle = document.getElementById("musicToggle");
    if (musicToggle) {
      musicToggle.addEventListener("click", () => this.toggleMusic());
    }

    // Forms
    const rsvpForm = document.getElementById("rsvpForm");
    if (rsvpForm) {
      rsvpForm.addEventListener("submit", (e) => this.handleRSVP(e));
    }
    const wishesForm = document.getElementById("wishesForm");
    if (wishesForm) {
      wishesForm.addEventListener("submit", (e) => this.handleWishes(e));
    }

    // Copy buttons
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.copyToClipboard(e));
    });

    // Scroll event
    window.addEventListener("scroll", () => {
      this.updateNavigation();
      this.checkVideoPause();
    });
  } // end setupEventListeners

  startInvitation() {
    console.log("Starting invitation flow"); // Debug log
    const section1 = document.getElementById("section1");
    const section2 = document.getElementById("section2");

    if (section1) {
      section1.style.display = "none";
      console.log("Section 1 hidden");
    }
    if (section2) {
      section2.classList.remove("hidden");
      section2.style.display = "flex";
      console.log("Section 2 shown");
    }
  }

  skipVideo() {
    console.log("Skipping video"); // Debug log
    const section2 = document.getElementById("section2");
    if (section2) {
      section2.style.display = "none";
    }
    this.pauseVideo();
    this.scrollToSection("section3");
    this.startMusic();
  }

  pauseVideo() {
    if (this.music) {
      this.music.pause();
    }
    const video = document.getElementById("cinematicVideo");
    if (video) {
      video.pause();
    }
  }

  checkVideoPause() {
    const section2 = document.getElementById("section2");
    if (section2 && section2.style.display === "none") {
      this.pauseVideo();
    }
  }

  setupCountdown() {
    const weddingDate = new Date("2025-09-24T07:00:00+08:00");
    console.log("Wedding date set to:", weddingDate); // Debug log

    const updateCountdown = () => {
      const now = new Date();
      const diff = weddingDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.textContent = days.toString().padStart(2, "0");
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");

        console.log(`Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`);
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
    const location = "Rumah Mempelai Wanita, samping masjid Jabal Rahmah, Mandin, Kotabaru";
    const startDate = "20250924T070000";
    const endDate = "20250924T120000";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}`;

    window.open(url, "_blank");
  }

  shareWhatsapp() {
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

  copyInvitationLink() {
    const button = document.getElementById("copyLink");
    if (!button) return;

    const textToCopy = window.location.href;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Link Tersalin';
        button.style.background = "var(--success)";
        button.style.color = "white";
        button.style.borderColor = "var(--success)";
        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.background = "";
          button.style.color = "";
          button.style.borderColor = "";
        }, 2000);
      })
      .catch(() => {
        alert("Gagal menyalin tautan, silakan salin secara manual: " + textToCopy);
      });
  }

  handleRSVP(e) {
    e.preventDefault();

    const name = document.getElementById("rsvpName").value;
    const attendance = document.getElementById("attendance").value;

    if (!name || !attendance) {
      alert("Harap isi semua kolom.");
      return;
    }

    this.mockDatabase.rsvp.push({
      name: name,
      attendance: attendance,
      timestamp: new Date(),
    });

    this.showSuccessMessage("Terima kasih atas konfirmasinya!");
    e.target.reset();
    this.showConfetti();
  }

  handleWishes(e) {
    e.preventDefault();

    const name = document.getElementById("wishName").value;
    const message = document.getElementById("wishMessage").value;
    const option = document.querySelector('input[name="wishOption"]:checked').value;

    if (!name || !message) {
      alert("Harap isi semua kolom.");
      return;
    }

    if (option === "whatsapp") {
      const url = `https://wa.me/085251815099?text=${encodeURIComponent(
        `Ucapan dari: ${name}\n\n${message}`
      )}`;
      window.open(url, "_blank");
    } else {
      this.mockDatabase.wishes.unshift({
        name: name,
        message: message,
        timestamp: new Date(),
        display: true,
      });
      this.displayNewWish({
        name: name,
        message: message,
        timestamp: new Date(),
      });
    }

    this.showSuccessMessage("Terima kasih atas doanya!");
    e.target.reset();
    this.showConfetti();
  }

  displayNewWish(wish) {
    const container = document.getElementById("wishesContainer");
    if (!container) return;

    const wishElem = document.createElement("div");
    wishElem.className = "wish-item";
    wishElem.innerHTML = `
      <div class="wish-header">
        <h4>${this.escapeHtml(wish.name)}</h4>
        <span class="wish-time">${this.formatTime(wish.timestamp)}</span>
      </div>
      <p class="wish-text">${this.escapeHtml(wish.message)}</p>
    `;
    container.prepend(wishElem);
  }

  formatTime(time) {
    const diff = new Date() - new Date(time);

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
    const button = e.target.closest(".copy-btn");
    const textToCopy = button.dataset.copy;
    if (!textToCopy) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Tersalin';
        button.classList.add("copied");
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove("copied");
        }, 2000);
      })
      .catch(() => {
        alert("Gagal menyalin, silakan salin secara manual: " + textToCopy);
      });
  }

  setupAnimations() {
    this.setupTypingAnimation();
    this.observeAnimations();
  }

  setupTypingAnimation() {
    const thankYouText = document.getElementById("thankYouText");
    if (!thankYouText) return;

    thankYouText.textContent = "";
    let i = 0;
    const text = "Terima kasih";

    const typeWriter = () => {
      if (i < text.length) {
        thankYouText.textContent += text.charAt(i);
        i += 1;
        setTimeout(typeWriter, 200);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(typeWriter, 500);
          observer.unobserve(entry.target);
        }
      });
    });

    const section = thankYouText.closest(".section");
    if (!section) return;

    observer.observe(section);
  }

  observeAnimations() {
    const animatedElements = document.querySelectorAll(
      ".wish-item, .schedule-item, .photo-container"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = "0s";
            entry.target.style.animation = "fadeInUp 0.6s ease-out forwards";
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  createFallingPetals() {
    setInterval(() => {
      if (window.scrollY > window.innerHeight * 2) {
        this.createDaisy();
      }
    }, 3000);
  }

  createDaisy() {
    const daisy = document.createElement
