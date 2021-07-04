const CACHE_NAME = 'budget-cache-version-1';
const DATA_CACHE_NAME = 'budget-data-cache-version-1';
const FILES_TO_CACHE = [
    '/',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/index.html',
    '/js/index.js',
    '/styles.css',
    '/js/idb.js',
    '/manifest.json'
];

// Fetch request
self.addEventListener('fetch', e => {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { 
                console.log('responding with cache : ' + e.request.url)
                return request
            } else { 
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
});

// Install request
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// Delete cache
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Removing cache', key);
                        return caches.delete(key);
                }
            }));
        })
    );
});