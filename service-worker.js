const CACHE_NAME = 'game-portal-v7';
const ASSETS = [
  './',
  './index.html',
  './src/styles/main.css',
  './src/styles/chess.css',
  './src/styles/loa.css',
  './src/styles/xiangqi.css',
  './src/scripts/app.js',
  './src/games/chess/logic.js',
  './src/games/chess/ui.js',
  './src/games/loa/logic.js',
  './src/games/loa/ui.js',
  './src/games/xiangqi/logic.js',
  './src/games/xiangqi/ui.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  // Claim clients immediately
  event.waitUntil(clients.claim());
  // Remove old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
