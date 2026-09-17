var CACHE = 'portfolio-v1';

// Rutas relativas al scope (./ = /Portfolio/ en Pages).
// Solo lo crítico para abrir sin conexión. El PDF (92 KB) NO va
// en precache: se guarda en runtime la primera vez que se pide.
var ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './site.webmanifest',
  './favicon.ico',
  './favicon.svg',
  './404.html',
  './assets/favicon-32.png',
  './assets/apple-touch-icon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/maskable-512.png',
  './assets/foto-perfil.png', // foto del hero (16 KB: entra en precache sin lastrar el install)
  './assets/og-cover.png'
];

// Instalación: precachea y toma el control cuanto antes.
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activación: borra cachés viejas y reclama las pestañas abiertas.
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
          return null;
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Activación inmediata bajo demanda (la página puede enviar 'SKIP_WAITING').
self.addEventListener('message', function (event) {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// Peticiones: solo GET del mismo origen.
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Navegación (HTML): red primero, si falla tira de caché.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(req, copy);
        });
        return res;
      }).catch(function () {
        // Sin conexión: la página pedida si está en caché, si no el inicio.
        return caches.match(req).then(function (page) {
          return page || caches.match('./index.html');
        });
      })
    );
    return;
  }

  // PDF del CV (pesado): red primero, guarda copia en runtime.
  // Así el install es rápido y el CV queda offline tras abrirlo una vez.
  if (req.url.indexOf('.pdf') !== -1) {
    event.respondWith(
      fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return res;
      }).catch(function () {
        return caches.match(req);
      })
    );
    return;
  }

  // Estáticos: stale-while-revalidate (sirve caché al instante y
  // actualiza en segundo plano: nunca CSS/JS viejos tras un deploy).
  event.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (res) {
        // Solo cachea respuestas válidas (evita opacas de error).
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return res;
      }).catch(function () {
        return cached;
      });
      return cached || network;
    })
  );
});
