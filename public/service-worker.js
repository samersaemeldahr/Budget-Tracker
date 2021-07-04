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

// Install request
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log('Pre-cache successful')
            return cache.addAll(FILES_TO_CACHE)
        })
    )
    self.skipWaiting();
});

// Delete cache
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key!== CACHE_NAME && key !==DATA_CACHE_NAME){
                        console.log("removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            )
        })
    );
    self.clients.claim();
})

// Fetch request
self.addEventListener('fetch', function (e) {
    if (e.request.url.includes('/api/')){
        e.respondWith(
            caches
            .open(DATA_CACHE_NAME)
            .then(cache => {
                return fetch(e.request)
                .then(response => {
                    if (response.status === 200){
                        cache.put(e.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                return cache.match(e.request);
                });
            })
            .catch(err => console.log(err))
        );

        return;
    }

    e.respondWith(
        fetch(e.request).catch(function(){
            return caches.match(e.request).then(function(response){
                if(response){
                    return response;
                }
                else if (e.request.headers.get('accept').includes('text/html')){
                    return caches.match('/');
                }
            })
        })
    )
});