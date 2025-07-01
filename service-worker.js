const CACHE_NAME = 'vacation-calculator-cache-v1';
const ASSETS_TO_CACHE = [
  './vacation-calculator/index.html',
  './vacation-calculator/manifest.json',
  './vacation-calculator/icons/icon-192x192.png',
  './vacation-calculator/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
