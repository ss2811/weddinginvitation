// Wedding Invitation JavaScript

/**
 * FIREBASE SETUP INSTRUCTIONS
 * 
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select existing project
 * 3. Enable Firestore Database:
 *    - Go to Firestore Database in the left sidebar
 *    - Click "Create database"
 *    - Choose "Start in test mode" for development
 *    - Select your preferred location
 * 
 * 4. Get your Firebase config:
 *    - Go to Project Settings (gear icon)
 *    - Scroll down to "Your apps" section
 *    - Click "Web" icon to add a web app
 *    - Register your app with a nickname
 *    - Copy the firebaseConfig object
 * 
 * 5. Replace the firebaseConfig below with your actual config
 * 
 * 6. Set up Firestore Security Rules:
 *    Go to Firestore Database > Rules and replace with:
 *    
 *    rules_version = '2';
 *    service cloud.firestore {
 *      match /databases/{database}/documents {
 *        match /rsvp/{document} {
 *          allow read, write: if true;
 *        }
 *        match /messages/{document} {
 *          allow read, write: if true;
 *        }
 *      }
 *    }
 * 
 * 7. Database Structure:
 *    Collection: 'rsvp'
 *    Documents: auto-generated IDs
 *    Fields: {
 *      name: string,
 *      attendance: string ('ya' or 'tidak'),
 *      message: string,
 *      messageOption: string ('display' or 'whatsapp'),
 *      timestamp: timestamp,
 *      phoneNumber: string (optional)
 *    }
 */

// Firebase Configuration - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id-here",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "your-app-id-here"
};

// Initialize Firebase (only if config is properly set)
let db = null;
let isFirebaseEnabled = false;

try {
  if (firebaseConfig.apiKey !== "your-api-key-here") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    isFirebaseEnabled = true;
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase not configured. Using demo mode.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Daisy SVG Template (Peaceminusone style)
const daisySVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <g>
    <!-- Petals -->
    <ellipse cx="20" cy="8" rx="3" ry="8" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9"/>
    <ellipse cx="32" cy="20" rx="8" ry="3" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9"/>
    <ellipse cx="20" cy="32" rx="3" ry="8" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9"/>
    <ellipse cx="8" cy="20" rx="8" ry="3" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9"/>
    <ellipse cx="27.5" cy="12.5" rx="3" ry="6" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9" transform="rotate(45 27.5 12.5)"/>
    <ellipse cx="27.5" cy="27.5" rx="6" ry="3" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9" transform="rotate(45 27.5 27.5)"/>
    <ellipse cx="12.5" cy="27.5" rx="3" ry="6" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9" transform="rotate(45 12.5 27.5)"/>
    <ellipse cx="12.5" cy="12.5" rx="6" ry="3" fill="#ffffff" stroke="#ffffff" stroke-width="0.5" opacity="0.9" transform="rotate(45 12.5 12.5)"/>
    <!-- Center -->
    <circle cx="20" cy="20" r="4" fill="#FFD700" stroke="#FFA500" stroke-width="0.5"/>
  </g>
</svg>
`;

// Application State
class WeddingInvitation {
  constructor() {
    this.currentSession = 0;
    this.totalSessions = 10;
    this.isAnimating = false;
    this.weddingDate = new Date('2025-09-24T07:00:00+08:00'); // WITA timezone
    this.countdownInterval = null;
    this.daisyInterval = null;
    this.activeDaisies = [];
    this.sessionsWithDaisies = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Sessions 0-8 only
    
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded before setting up event listeners
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupEventListeners();
        this.hideLoading();
        this.startCountdown();
        this.loadGuestMessages();
        this.startDaisyAnimation();
      });
    } else {
      this.setupEventListeners();
      this.hideLoading();
      this.startCountdown();
      this.loadGuestMessages();
      this.startDaisyAnimation();
    }
  }

  hideLoading() {
    setTimeout(() => {
      const loading = document.getElementById('loading');
      const navigation = document.getElementById('navigation');
      
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }
      
      if (navigation) {
        navigation.classList.remove('hidden');
      }
    }, 2000);
  }

  // Daisy Animation System
  startDaisyAnimation() {
    const container = document.getElementById('daisyContainer');
    if (!container) return;

    // Create initial daisies
    if (this.sessionsWithDaisies.includes(this.currentSession)) {
      this.createDaisy();
    }
    
    // Create new daisies at intervals
    this.daisyInterval = setInterval(() => {
      if (this.sessionsWithDaisies.includes(this.currentSession)) {
        this.createDaisy();
      }
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
  }

  createDaisy() {
    const container = document.getElementById('daisyContainer');
    if (!container || !this.sessionsWithDaisies.includes(this.currentSession)) return;

    const daisy = document.createElement('div');
    daisy.className = 'daisy';
    daisy.innerHTML = daisySVG;

    // Random size (small, medium, large)
    const sizes = [16, 20, 24, 28, 32];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    daisy.style.width = size + 'px';
    daisy.style.height = size + 'px';

    // Random starting position
    const startX = Math.random() * (window.innerWidth - size);
    daisy.style.left = startX + 'px';
    daisy.style.top = '-100px';

    // Random animation class
    const animations = ['daisy-fall-1', 'daisy-fall-2', 'daisy-fall-3', 'daisy-fall-4', 'daisy-fall-5'];
    const animationClass = animations[Math.floor(Math.random() * animations.length)];
    daisy.classList.add(animationClass);

    container.appendChild(daisy);
    this.activeDaisies.push(daisy);

    // Remove daisy after animation completes
    const animationDuration = {
      'daisy-fall-1': 8000,
      'daisy-fall-2': 10000,
      'daisy-fall-3': 12000,
      'daisy-fall-4': 9000,
      'daisy-fall-5': 11000
    };

    setTimeout(() => {
      if (container.contains(daisy)) {
        container.removeChild(daisy);
      }
      const index = this.activeDaisies.indexOf(daisy);
      if (index > -1) {
        this.activeDaisies.splice(index, 1);
      }
    }, animationDuration[animationClass]);
  }

  updateDaisyVisibility() {
    const container = document.getElementById('daisyContainer');
    if (!container) return;

    // Show/hide daisies based on current session
    if (this.sessionsWithDaisies.includes(this.currentSession)) {
      container.style.display = 'block';
      container.style.visibility = 'visible';
    } else {
      container.style.display = 'none';
      container.style.visibility = 'hidden';
      // Clear existing daisies when hiding
      this.clearAllDaisies();
    }
    
    console.log(`Session ${this.currentSession}: Daisies ${this.sessionsWithDaisies.includes(this.currentSession) ? 'visible' : 'hidden'}`);
  }

  clearAllDaisies() {
    const container = document.getElementById('daisyContainer');
    if (container) {
      // Remove all existing daisies
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    this.activeDaisies = [];
  }

  setupEventListeners() {
    // Keyboard navigation only (no touch/swipe)
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Arrow navigation - Fixed selectors and added error handling
    const arrowUp = document.getElementById('arrowUp');
    const arrowDown = document.getElementById('arrowDown');
    
    if (arrowUp) {
      arrowUp.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Arrow up clicked');
        this.navigateToSession(this.currentSession - 1);
      });
    }
    
    if (arrowDown) {
      arrowDown.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Arrow down clicked');
        this.navigateToSession(this.currentSession + 1);
      });
    }
    
    // Dot navigation - Fixed event handling
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Dot ${index} clicked`);
        this.navigateToSession(index);
      });
    });

    // Welcome screen button - Fixed selector and event handling
    const openInvitationBtn = document.getElementById('openInvitation');
    if (openInvitationBtn) {
      openInvitationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Open invitation clicked');
        this.navigateToSession(1);
      });
    }

    // Countdown actions
    const saveDate = document.getElementById('saveDate');
    const shareInvitation = document.getElementById('shareInvitation');
    
    if (saveDate) {
      saveDate.addEventListener('click', () => this.saveDate());
    }
    
    if (shareInvitation) {
      shareInvitation.addEventListener('click', () => this.shareInvitation());
    }

    // RSVP form
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
      rsvpForm.addEventListener('submit', (e) => this.handleRSVP(e));
    }

    // Prevent default scroll behavior except for specific elements
    document.body.addEventListener('touchmove', (e) => {
      if (e.target.closest('.guest-messages') || e.target.closest('textarea')) {
        return; // Allow scrolling in messages and textarea
      }
      e.preventDefault();
    }, { passive: false });

    // Video controls
    this.setupVideoControls();

    // Initialize navigation state
    this.updateNavigationState();
    this.updateDaisyVisibility();
  }

  handleKeyboard(e) {
    if (this.isAnimating) return;
    
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.navigateToSession(this.currentSession - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.navigateToSession(this.currentSession + 1);
        break;
      case 'Home':
        e.preventDefault();
        this.navigateToSession(0);
        break;
      case 'End':
        e.preventDefault();
        this.navigateToSession(this.totalSessions - 1);
        break;
    }
  }

  navigateToSession(sessionIndex) {
    console.log(`Navigating from ${this.currentSession} to ${sessionIndex}`);
    
    if (this.isAnimating || sessionIndex < 0 || sessionIndex >= this.totalSessions || sessionIndex === this.currentSession) {
      console.log('Navigation blocked:', { isAnimating: this.isAnimating, sessionIndex, totalSessions: this.totalSessions, currentSession: this.currentSession });
      return;
    }

    this.isAnimating = true;
    
    // Update current session
    const currentSessionEl = document.querySelector(`.session[data-session="${this.currentSession}"]`);
    const nextSessionEl = document.querySelector(`.session[data-session="${sessionIndex}"]`);
    
    console.log('Session elements:', { current: currentSessionEl, next: nextSessionEl });
    
    if (!currentSessionEl || !nextSessionEl) {
      console.error('Session elements not found');
      this.isAnimating = false;
      return;
    }
    
    // Remove active class from current session
    currentSessionEl.classList.remove('active');
    
    // Add active class to next session with proper timing
    setTimeout(() => {
      nextSessionEl.classList.add('active');
      this.currentSession = sessionIndex;
      this.updateNavigationState();
      this.updateDaisyVisibility();
      
      console.log('Navigation completed to session:', sessionIndex);
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }, 100);
  }

  updateNavigationState() {
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === this.currentSession) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update arrow buttons
    const arrowUp = document.getElementById('arrowUp');
    const arrowDown = document.getElementById('arrowDown');
    
    if (arrowUp) {
      arrowUp.disabled = this.currentSession === 0;
      arrowUp.style.opacity = this.currentSession === 0 ? '0.3' : '1';
    }
    
    if (arrowDown) {
      arrowDown.disabled = this.currentSession === this.totalSessions - 1;
      arrowDown.style.opacity = this.currentSession === this.totalSessions - 1 ? '0.3' : '1';
    }
  }

  startCountdown() {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.weddingDate.getTime() - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (distance < 0) {
      const countdownEl = document.getElementById('countdown');
      if (countdownEl) {
        countdownEl.innerHTML = '<div class="countdown-finished">Hari Pernikahan Telah Tiba! 🎉</div>';
      }
      clearInterval(this.countdownInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  async saveDate() {
    try {
      // Create calendar event
      const event = {
        title: 'Pernikahan Suriansyah & Sonia Agustina Oemar',
        start: '20250924T070000',
        end: '20250924T120000',
        description: 'Akad Nikah dan Resepsi Pernikahan',
        location: 'Mesjid Jabal Rahmah Mandin'
      };

      const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

      const link = document.createElement('a');
      link.href = calendarUrl;
      link.download = 'wedding-suriansyah-sonia.ics';
      link.click();

      this.showToast('Event berhasil disimpan ke kalender!');
    } catch (error) {
      console.error('Error saving date:', error);
      this.showToast('Gagal menyimpan event. Coba lagi nanti.');
    }
  }

  shareInvitation() {
    if (navigator.share) {
      navigator.share({
        title: 'Wedding Invitation - Suriansyah & Sonia',
        text: 'Anda diundang ke pernikahan Suriansyah & Sonia Agustina Oemar pada 24 September 2025',
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showToast('Link undangan berhasil disalin!');
      }).catch(() => {
        this.showToast('Gagal membagikan undangan.');
      });
    }
  }

  async handleRSVP(e) {
    e.preventDefault();
    
    const guestName = document.getElementById('guestName');
    const attendance = document.getElementById('attendance');
    const message = document.getElementById('message');
    const messageOption = document.querySelector('input[name="messageOption"]:checked');

    if (!guestName || !attendance || !messageOption) {
      this.showToast('Form elements not found.');
      return;
    }

    const name = guestName.value.trim();
    const attendanceValue = attendance.value;
    const messageValue = message ? message.value.trim() : '';
    const messageOptionValue = messageOption.value;

    if (!name || !attendanceValue) {
      this.showToast('Mohon lengkapi nama dan kehadiran.');
      return;
    }

    try {
      const rsvpData = {
        name: name,
        attendance: attendanceValue,
        message: messageValue,
        messageOption: messageOptionValue,
        timestamp: isFirebaseEnabled ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
      };

      if (messageOptionValue === 'whatsapp') {
        // Send via WhatsApp
        const whatsappMessage = `Assalamu'alaikum,

Saya ${name} ${attendanceValue === 'ya' ? 'akan hadir' : 'tidak bisa hadir'} di acara pernikahan Suriansyah & Sonia pada 24 September 2025.

${messageValue ? `Ucapan: ${messageValue}` : ''}

Terima kasih.`;

        const whatsappUrl = `https://wa.me/6285251815099?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        // Save to Firebase for display
        if (isFirebaseEnabled && db) {
          await db.collection('rsvp').add(rsvpData);
        } else {
          // Demo mode - just show success
          console.log('Demo mode: RSVP data:', rsvpData);
        }
      }

      // Also save basic RSVP info to Firebase regardless of message option
      if (isFirebaseEnabled && db) {
        await db.collection('rsvp').add({
          name: name,
          attendance: attendanceValue,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      // Show success
      const rsvpForm = document.getElementById('rsvpForm');
      const rsvpSuccess = document.getElementById('rsvpSuccess');
      
      if (rsvpForm) rsvpForm.classList.add('hidden');
      if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');
      
      this.showToast('RSVP berhasil dikirim!');
      
      // Refresh messages if display option was chosen
      if (messageOptionValue === 'display') {
        setTimeout(() => this.loadGuestMessages(), 2000);
      }

    } catch (error) {
      console.error('Error submitting RSVP:', error);
      this.showToast('Gagal mengirim RSVP. Coba lagi nanti.');
    }
  }

  async loadGuestMessages() {
    const messagesContainer = document.getElementById('guestMessages');
    if (!messagesContainer) return;
    
    try {
      if (isFirebaseEnabled && db) {
        // Real Firebase data
        const snapshot = await db.collection('rsvp')
          .where('messageOption', '==', 'display')
          .where('message', '>', '')
          .orderBy('message')
          .orderBy('timestamp', 'desc')
          .limit(20)
          .get();

        if (snapshot.empty) {
          messagesContainer.innerHTML = '<div class="loading-messages">Belum ada ucapan yang ditampilkan.</div>';
          return;
        }

        let messagesHTML = '';
        snapshot.forEach(doc => {
          const data = doc.data();
          messagesHTML += this.createMessageCard(data);
        });

        messagesContainer.innerHTML = messagesHTML;

        // Set up real-time listener
        db.collection('rsvp')
          .where('messageOption', '==', 'display')
          .where('message', '>', '')
          .orderBy('message')
          .orderBy('timestamp', 'desc')
          .limit(20)
          .onSnapshot(snapshot => {
            let messagesHTML = '';
            snapshot.forEach(doc => {
              const data = doc.data();
              messagesHTML += this.createMessageCard(data);
            });
            messagesContainer.innerHTML = messagesHTML || '<div class="loading-messages">Belum ada ucapan yang ditampilkan.</div>';
          });

      } else {
        // Demo data for testing
        const demoMessages = [
          {
            name: 'Ahmad Rizki',
            message: 'Selamat untuk Suriansyah dan Sonia! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fi khair.',
            attendance: 'ya'
          },
          {
            name: 'Siti Nurhaliza',
            message: 'Alhamdulillah, akhirnya kalian menikah juga! Semoga langgeng sampai maut memisahkan. Semoga dimudahkan rezekinya dan diberi keturunan yang sholeh sholehah.',
            attendance: 'ya'
          },
          {
            name: 'Budi Santoso',
            message: 'Congratulations! Wishing you both a lifetime of love and happiness. May your marriage be filled with all the right ingredients: a heap of love, a dash of humor, a touch of romance, and a spoonful of understanding.',
            attendance: 'tidak'
          }
        ];

        let messagesHTML = '';
        demoMessages.forEach(data => {
          messagesHTML += this.createMessageCard(data);
        });
        messagesContainer.innerHTML = messagesHTML;
      }

    } catch (error) {
      console.error('Error loading messages:', error);
      messagesContainer.innerHTML = '<div class="loading-messages">Gagal memuat ucapan. Coba refresh halaman.</div>';
    }
  }

  createMessageCard(data) {
    const attendanceText = data.attendance === 'ya' ? 'Akan hadir' : 'Tidak bisa hadir';
    return `
      <div class="message-card">
        <div class="message-name">${this.escapeHtml(data.name)}</div>
        <div class="message-text">${this.escapeHtml(data.message)}</div>
        <div class="message-attendance">${attendanceText}</div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupVideoControls() {
    const video = document.getElementById('weddingVideo');
    if (!video) return;

    // Auto-fullscreen functionality
    video.addEventListener('load', () => {
      const iframe = video.contentWindow;
      if (iframe) {
        iframe.addEventListener('play', () => {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
          }
        });
      }
    });
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 300);
    }, 3000);
  }

  // Cleanup function
  destroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.daisyInterval) {
      clearInterval(this.daisyInterval);
    }
    this.clearAllDaisies();
  }
}

// Copy to Clipboard Function
function copyToClipboard(text, bank) {
  navigator.clipboard.writeText(text).then(() => {
    const status = document.getElementById(`${bank}-status`);
    if (status) {
      status.textContent = 'Nomor rekening berhasil disalin!';
      status.classList.add('show');
      
      setTimeout(() => {
        status.classList.remove('show');
      }, 3000);
    }
  }).catch(err => {
    console.error('Failed to copy: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      const status = document.getElementById(`${bank}-status`);
      if (status) {
        status.textContent = 'Nomor rekening berhasil disalin!';
        status.classList.add('show');
        
        setTimeout(() => {
          status.classList.remove('show');
        }, 3000);
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  });
}

// Initialize Application
let weddingApp;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing wedding app...');
  weddingApp = new WeddingInvitation();
});

// Fallback initialization
if (document.readyState !== 'loading') {
  console.log('Document already loaded, initializing wedding app...');
  weddingApp = new WeddingInvitation();
}

// Prevent context menu and text selection for better mobile experience
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => {
  if (!e.target.matches('input, textarea')) {
    e.preventDefault();
  }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 500);
});

// Performance optimization: Preload images
const imagesToPreload = [
  'https://github.com/ss2811/weddinginvitation/blob/main/backgroundhitam.jpeg?raw=true',
  'https://github.com/ss2811/weddinginvitation/blob/main/backgroundbiru.jpeg?raw=true',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/refs/heads/main/bride.jpeg',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/refs/heads/main/groom.jpeg'
];

imagesToPreload.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(registrationError => console.log('SW registration failed'));
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (weddingApp) {
    weddingApp.destroy();
  }
});
