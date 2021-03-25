// Define CACHE
const CACHE_NAME = "version-1";

// Assets to be Cached
const cacheAssets = ["telemetry-app/index.html", "telemetry-app/offline.html","telemetry-app/images/logo.png", "telemetry-app/src/data.html", "telemetry-app/src/diagnosticsManager.html", "telemetry-app/src/state.html", "telemetry-app/src/app.js"];

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
                .catch(() => caches.match("telemetry-app/offline.html"))
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