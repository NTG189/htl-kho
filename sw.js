/* Service worker: cho phép "cài" ứng dụng ra màn hình điện thoại và mở được khi mạng chập chờn.
   Ưu tiên tải bản mới từ mạng; mất mạng thì dùng bản đã lưu. Chỉ áp dụng cho file của chính ứng dụng. */
const CACHE = 'htl-kho-v3';
const FILES = ['./', 'index.html', 'app.js', 'db.js', 'config.js', 'manifest.webmanifest', 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
