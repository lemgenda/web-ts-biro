// service-worker.js - Enhanced with offline capabilities
const CACHE_NAME = 'ts-biro-v6'; // Increment version
const CRITICAL_URLS = [
    './',
    './index.html',
    './css/critical.css',
    './js/script.js',
    './images/TS-Biro-Circle-logo.svg',
    './images/icons/favicon.ico',
    './manifest.json'  // Updated path
];

const NON_CRITICAL_URLS = [
    './css/non-critical.css',
    './knjigovodstvo-racunovodstvo.html',
    './place-kadrovska-evidencija.html',
    './financijsko-poslovno-savjetovanje.html',
    './sudsko-vjestacenje.html',
    './404.html',
    './uvjeti.html',
    './privatnost.html',
    './fonts/Figtree-VariableFont_wght.ttf',
    './fonts/Domine-VariableFont_wght.ttf'
];

// Font Awesome CDN
const EXTERNAL_URLS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2'
];

self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching critical resources');
                // Cache critical resources
                return Promise.all(
                    CRITICAL_URLS.map(url => {
                        return cache.add(url).catch(error => {
                            console.warn(`Failed to cache: ${url}`, error);
                        });
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Claim clients immediately
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip browser extensions
    if (event.request.url.startsWith('chrome-extension://')) return;

    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the page
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone));
                    return response;
                })
                .catch(() => {
                    // Offline fallback
                    return caches.match('./index.html');
                })
        );
        return;
    }

    // Handle image requests
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request)
                        .then(response => {
                            // Cache successful image responses
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, responseClone));
                            }
                            return response;
                        })
                        .catch(() => {
                            // Return placeholder for failed images
                            return caches.match('./images/TS-Biro-Circle-logo.svg');
                        });
                })
        );
        return;
    }

    // Handle font requests
    if (event.request.destination === 'font') {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
        return;
    }

    // Default strategy: Cache First, then Network
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Update cache in background
                    fetchAndCache(event.request);
                    return cachedResponse;
                }
                return fetchAndCache(event.request);
            })
            .catch(() => {
                // Network fallback for specific file types
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
                if (event.request.destination === 'style') {
                    return caches.match('./css/critical.css');
                }
                return new Response('Offline content not available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
});

async function fetchAndCache(request) {
    try {
        const response = await fetch(request);

        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }

        // Cache the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
            .then(cache => {
                cache.put(request, responseToCache);
            });

        return response;
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
}

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-forms') {
        console.log('Background sync for forms');
        event.waitUntil(syncForms());
    }
});

async function syncForms() {
    // Implement form sync logic here
    // This would sync any pending form submissions when back online
}

// Push notifications (optional)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Novosti od TS-Biro',
        icon: './images/icons/android-chrome-192x192.png',
        badge: './images/icons/android-chrome-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Otvori stranicu',
                icon: './images/icons/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Zatvori',
                icon: './images/icons/icon-72x72.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('TS-Biro', options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('Notification click received.', event.notification.data);
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});