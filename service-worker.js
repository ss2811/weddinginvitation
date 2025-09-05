// Nama cache unik untuk versi aplikasi Anda
const CACHE_NAME = 'wedding-invitation-cache-v1';

// Daftar file yang akan disimpan di cache untuk akses offline
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'app.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Amiri:wght@400;700&display=swap',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/backgroundbiru.jpeg',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/backgroundhitam.jpeg',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/refs/heads/main/envelope.jpg',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/refs/heads/main/groom.jpeg',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/refs/heads/main/bride.jpeg',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/daisy.png',
  'https://raw.githubusercontent.com/ss2811/weddinginvitation/main/sakura.png',
  'https://github.com/ss2811/weddinginvitation/raw/refs/heads/main/backgroundmusic.mp3',
  'https://i.imgur.com/BTJ9T4v.png',
  'https://i.imgur.com/sSgS3yv.png'
  // Catatan: Video pre-wedding tidak di-cache karena ukurannya besar.
];

// Event 'install': Dipanggil saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  // Tunggu hingga proses caching selesai
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka dan file-file penting disimpan');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Dipanggil setiap kali halaman meminta file (misal: CSS, gambar, dll.)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ditemukan di cache, langsung berikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari internet
        return fetch(event.request);
      }
    )
  );
});
