const CACHE = 'panstwa-miasta-v8'
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/balbina.png', '/balbina-thinking.png', '/balbina-confident.png', '/balbina-defeated.png', '/pwa-192.png', '/pwa-512.png']
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())))
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())))
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return
  event.respondWith(fetch(event.request).then((response) => { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); return response }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html'))))
})
