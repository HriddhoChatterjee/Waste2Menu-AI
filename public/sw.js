/**
 * Waste2Menu-AI Community Kiosk Service Worker
 * Strategy: Cache-First for static assets, Network-First with Cache Fallback for dynamic requests,
 * and Background Synchronization for offline surplus logs.
 */

const CACHE_NAME = 'waste2menu-kiosk-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './icons.svg',
  './manifest.json',
  './404.html'
];

// Install Event: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline app shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First with Network Revalidation
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Skip non-http/https (e.g. chrome-extension, data URIs)
  if (!requestUrl.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately, and fetch in background to revalidate cache if online
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {
          // Ignore background fetch error when offline
        });
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache for future offline use
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If offline and request is an HTML navigation, return cached index.html
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});

// Background Sync Event: Process queued surplus alerts when connection resumes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-surplus-alerts') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SYNC_SURPLUS_QUEUE',
            timestamp: Date.now()
          });
        });
      })
    );
  }
});
