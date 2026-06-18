const CACHE_NAME = "durak-sefer-sorgu-v10-20260618-revize";
const ASSETS = ["./", "./index.html", "./app.js?v=v10-20260618-revize", "./data.js?v=v10-20260618-revize", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function(event) {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(ASSETS); }).catch(function(){}));
});
self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(key) { if (key !== CACHE_NAME) return caches.delete(key); }));
  }).then(function() { return self.clients.claim(); }));
});
self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then(function(response) {
    var copy = response.clone();
    caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); }).catch(function(){});
    return response;
  }).catch(function() { return caches.match(event.request); }));
});
