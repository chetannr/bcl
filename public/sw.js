// Service Worker for BCL 2026 PWA
const CACHE_NAME = 'bcl-2025-v1';
const RUNTIME_CACHE = 'bcl-runtime-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for same-origin)
  if (url.origin !== location.origin && !url.href.startsWith('https://')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    // Static assets: Cache-first strategy
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request.url)) {
    // API requests: Network-first strategy (for Convex)
    event.respondWith(networkFirst(request));
  } else {
    // HTML pages: Network-first with cache fallback
    event.respondWith(networkFirst(request));
  }
});

// Cache-first strategy: Check cache first, fallback to network
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first fetch failed:', error);
    // Return offline fallback if available
    if (request.destination === 'document') {
      const cached = await caches.match('/index.html');
      if (cached) return cached;
    }
    throw error;
  }
}

// Network-first strategy: Try network first, fallback to cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // For navigation requests, return cached index.html
    if (request.mode === 'navigate') {
      const cached = await caches.match('/index.html');
      if (cached) return cached;
    }

    throw error;
  }
}

// Check if request is for a static asset
function isStaticAsset(url) {
  return (
    url.includes('/assets/') ||
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.svg') ||
    url.endsWith('.woff') ||
    url.endsWith('.woff2') ||
    url.endsWith('.ttf') ||
    url.includes('/favicon')
  );
}

// Check if request is an API request
function isAPIRequest(url) {
  return (
    url.includes('/api/') ||
    url.includes('convex.cloud') ||
    url.includes('convex.dev')
  );
}

// Handle background sync (if needed in future)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  // Can be used for offline actions that need to sync when online
});

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  // Can be used for match updates, notifications, etc.
});
