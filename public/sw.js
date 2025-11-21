// Service Worker for Grid My Life - Offline-First PWA
const CACHE_NAME = 'grid-my-life-v2';
const RUNTIME_CACHE = 'grid-my-life-runtime-v2';

// Resources to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/manifest.webmanifest',
    '/icon-192x192.png',
    '/icon-512x512.png',
];

// Install event - precache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        }).then((cachesToDelete) => {
            return Promise.all(cachesToDelete.map((cacheToDelete) => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network First, falling back to Cache
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // For navigation requests (HTML pages)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache the new version
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // If network fails, try cache
                    return caches.match(event.request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // If no cached response, return the offline page or index
                            return caches.match('/');
                        });
                })
        );
        return;
    }

    // For all other requests - Cache First, falling back to Network
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version and update cache in background
                    fetch(event.request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(RUNTIME_CACHE).then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                            }
                        })
                        .catch(() => {
                            // Network failed, but we already have cached version
                        });
                    return cachedResponse;
                }

                // Not in cache, fetch from network and cache it
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache if not a success response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Network request failed and no cache available
                        // For API requests, we could return a custom offline response
                        return new Response(
                            JSON.stringify({ error: 'Offline', message: 'Network request failed and no cached data available' }),
                            {
                                headers: { 'Content-Type': 'application/json' },
                                status: 503
                            }
                        );
                    });
            })
    );
});

// Handle messages from the application
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
