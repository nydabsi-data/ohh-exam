/* Service worker: network first, cache as offline fallback. */
const CACHE = 'ohh-exam-v32';
const SHELL = ['./', './index.html', './login.html', './js/login.js', './js/i18n.js', './css/style.css', './css/pages.css', './css/theme.css', './css/buttons.css', './css/desktop.css', './js/aptitude.js', './css/aptitude.css', './js/app.js', './js/config.js', './data/questions.js', './data/pilot-basics.js', './data/physics.js', './data/more.js', './data/chemistry.js', './data/biology.js', './data/math-a.js', './data/math-b.js', './data/extra/pilot-a.js', './data/extra/pilot-b.js', './data/extra/physics-a.js', './data/extra/physics-b.js', './data/extra/chemistry.js', './data/extra/biology.js', './icon.svg', './img/logo.png', './img/clock.png', './img/tabs/home.png', './img/tabs/missions.png', './img/tabs/practice.png', './img/tabs/stats.png', './img/tabs/profile.png', './img/chars/c1.png', './img/chars/c2.png', './img/chars/c3.png', './img/chars/c4.png', './img/chars/c5.png', './img/chars/c8.png', './manifest.webmanifest'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
