// Service Worker for SafeNow PWA
// Basic offline support and caching strategy

const CACHE_NAME = "safenow-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.jsx",
  "/src/App.jsx",
  "/src/index.css",
];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// Background sync for offline SOS requests
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-sos-requests") {
    event.waitUntil(syncSOSRequests());
  }
});

async function syncSOSRequests() {
  // Implementation for syncing queued SOS requests when back online
  // This would retrieve queued requests from IndexedDB and send to backend
  console.log("Syncing offline SOS requests");
}
