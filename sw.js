
// ========================================
// BLOCKVERSE - SERVICE WORKER
// ========================================

const CACHE_NAME = "blockverse-v1";

const CORE_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

// Install and cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_FILES);
    })
  );

  self.skipWaiting();
});

// Activate and remove old Blockverse caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name =>
            name.startsWith("blockverse-") &&
            name !== CACHE_NAME
          )
          .map(name => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

// Serve cached files when available
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only handle this site's requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(response => {
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const responseCopy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseCopy);
          });
        }

        return response;
      });
    })
  );
});
