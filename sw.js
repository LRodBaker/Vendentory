// Vendentory Service Worker — forces fresh fetch on every load
// Version auto-updates on each deploy: 1781026504
const VERSION = '1781026504';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: always try network, never serve stale cache
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  // Only intercept same-origin requests (not Supabase, fonts, etc.)
  const url = new URL(e.request.url);
  if(url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request, {cache: 'no-store'})
      .catch(() => caches.match(e.request))
  );
});
