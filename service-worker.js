const CACHE_NAME = 'vacation-calculator-cache-v1';
const ASSETS_TO_CACHE = [
  '/vacation-calculator/',
  'vacation-calculator/index.html',
  'vacation-calculator/manifest.json',
  'vacation-calculator/service-worker.js',
  'vacation-calculator/icons/icon-192x192.png',
  'vacation-calculator/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
