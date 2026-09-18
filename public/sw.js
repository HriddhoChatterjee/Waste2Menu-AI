/**
 * Waste2Menu-AI Community Kiosk Service Worker
 * Strategy: Cache-First for static assets, Network-First with Cache Fallback for dynamic requests,
 * and Background Synchronization for offline surplus logs.
 */

const CACHE_NAME = 'waste2menu-kiosk-v3';
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
      console.log('[ServiceWorker] Pre-caching offline app shell v3');
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

// Fetch Event: Network-First for HTML/Navigation & Assets when online; Cache fallback when offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (!requestUrl.protocol.startsWith('http')) return;

  // In local development, always fetch fresh from network to never serve stale dev builds
  if (requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1') {
    return;
  }

  const isNavigation = event.request.mode === 'navigate' || 
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    // Network-First for HTML: always get the freshest version if online
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cached) => cached || caches.match('./index.html') || caches.match('./'));
      })
    );
    return;
  }

  // Network-First for static assets when online, cache fallback when offline
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
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
