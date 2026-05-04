const CACHE_NAME = "game-cache-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./js/game.js",
    "./js/sprite.js",
    "./js/controls.js",
    "./assets/images/player.png"
];

// instala
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// responde offline
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});