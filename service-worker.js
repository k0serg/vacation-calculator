const CACHE_NAME = 'vacation-calculator-cache-v9';
const ASSETS_TO_CACHE = [
  '/vacation-calculator/',
  '/vacation-calculator/index.html',
  '/vacation-calculator/manifest.json',
  '/vacation-calculator/service-worker.js',
  '/vacation-calculator/icons/icon-192x192.png',
  '/vacation-calculator/icons/icon-512x512.png'
];

// При установке — загружаем статические ресурсы в кэш
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Активировать нового SW сразу
});

// При активации — удалить старые версии кэша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Перехватываем запросы и отдаём из кэша, если возможно
self.addEventListener('fetch', event => {
  const { request } = event;

  // Игнорируем не-GET запросы (например, API)
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(response => {
      // Если есть кэшированный ответ — возвращаем его
      if (response) return response;

      // Иначе делаем сетевой запрос
      return fetch(request).then(networkResponse => {
        // Кэшируем только HTML, CSS, JS, изображения и т.д.
        if (networkResponse && networkResponse.ok) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
    })
  );
});
