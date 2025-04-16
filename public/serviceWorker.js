
const CACHE_NAME = 'focus-quran-v1';
const AUDIO_CACHE_NAME = 'focus-quran-audio-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx',
  // Add more app assets here
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
                // Return cached audio
                return response;
              }
              
              // Fetch from network if not in cache
              return fetch(event.request)
                .then((networkResponse) => {
                  if (networkResponse && networkResponse.status === 200) {
                    // Clone the response to store in cache
                    const clonedResponse = networkResponse.clone();
                    cache.put(event.request, clonedResponse);
                  }
                  return networkResponse;
                })
                .catch(() => {
                  // If both cache and network fail, return a fallback
                  return new Response('Audio not available offline');
                });
            });
        })
    );
  } else {
    // Regular caching strategy for non-audio files
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request).then(
            (networkResponse) => {
              // Check if we received a valid response
              if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
              }

              // Clone the response
              const responseToCache = networkResponse.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return networkResponse;
            }
          );
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
