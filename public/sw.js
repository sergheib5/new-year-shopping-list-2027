// Service Worker for PWA
// Update version to force cache refresh on mobile devices
const CACHE_NAME = 'new-year-shopping-list-v3';

// Get base path from the service worker's scope
// For GitHub Pages, this will be something like '/shopping-list/'
const basePath = self.location.pathname.replace('/sw.js', '') || '/';

const urlsToCache = [
  basePath,
  basePath + 'menu',
  basePath + 'index.html',
  basePath + 'manifest.json'
].map(url => url.replace('//', '/')); // Remove double slashes

self.addEventListener('install', (event) => {
  // Force activation of new service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service worker install error:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const isAsset = url.pathname.match(/\.(js|css|json|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/);
  const isDocument = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html');

  if (isAsset || isDocument) {
    // Serve current pages and code first; keep them cached for offline use.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;
          if (isDocument) return caches.match(basePath + 'index.html');
          return Response.error();
        })
    );
    return;
  }

  // Keep other files cache-first so offline icons and manifest data remain available.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((response) => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

