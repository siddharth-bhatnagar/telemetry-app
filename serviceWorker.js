// Define CACHE
const CACHE_NAME = "version-1";

// Assets to be Cached
const cacheAssets = ["index.html", "offline.html","images/logo.png", "src/data.html", "src/diagnosticsManager.html", "src/state.html", "src/app.js"];

const self = this;

// Install SW
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Opened Cache");
                return cache.addAll(cacheAssets);
            })
    )
});

// Listen for Requests
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                .catch(() => caches.match("offline.html"))
            })
    )
});

// Activate the SW
self.addEventListener("activate", (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhiteList.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});