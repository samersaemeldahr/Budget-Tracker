const CACHE_NAME = 'budget-cache-version-1';
const DATA_CACHE_NAME = 'budget-data-cache-version-1';
const FILES_TO_CACHE = [
    '/',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/index.html',
    '/index.js',
    '/styles.css',
    '/idb.js',
    '/manifest.json'
];

// Fetch request
self.addEventListener('fetch', event => {
    console.log('fetch request : ' + event.request.url)
    event.respondWith(
        caches.match(event.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + event.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + event.request.url)
                return fetch(event.request)
            }
        })
    )
});

// Install request
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// Delete cache
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});