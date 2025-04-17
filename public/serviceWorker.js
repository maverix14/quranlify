const CACHE_NAME = 'quranlify-v1';
const AUDIO_CACHE_NAME = 'quranlify-audio-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/quran-icon-192.png',
  '/quran-icon-512.png'
];

// Install the service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch resources
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Special handling for audio files
  if (url.pathname.includes('.mp3') || url.pathname.includes('/audio/')) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME)
        .then((cache) => {
          return cache.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              
              return fetch(event.request)
                .then((networkResponse) => {
                  if (networkResponse && networkResponse.status === 200) {
                    cache.put(event.request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  return new Response('Audio not available offline');
                });
            });
        })
    );
  } else {
    // Network first, fallback to cache strategy for other resources
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
  }
});

// Update the service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, AUDIO_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for downloading content when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'download-audio') {
    event.waitUntil(downloadPendingAudio());
  }
});

// Placeholder function for background sync
async function downloadPendingAudio() {
  // In a real implementation, this would:
  // 1. Check IndexedDB for a list of audio files to download
  // 2. Download them and update the cache
  // 3. Update IndexedDB to mark them as downloaded
  console.log('Background sync: downloading audio files');
}
