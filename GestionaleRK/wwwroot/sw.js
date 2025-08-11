// Service Worker per PWA
const CACHE_NAME = 'gestionaleRK-v2';
const urlsToCache = [
  '/',
  '/css/app.css',
  '/css/bootstrap/bootstrap.min.css',
  '/js/indexeddb.js',
  '/js/filehelper.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png'
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Attivazione del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestione delle richieste (cache first strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se troviamo la risorsa in cache, la ritorniamo
        if (response) {
          return response;
        }
        
        // Altrimenti facciamo una richiesta di rete
        return fetch(event.request)
          .then(response => {
            // Se la richiesta fallisce, ritorniamo l'errore
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloniamo la risposta
            const responseToCache = response.clone();

            // Aggiungiamo la risposta alla cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});