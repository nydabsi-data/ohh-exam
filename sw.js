/* Service worker: network first, cache as offline fallback. */
const CACHE = 'ohh-exam-v133';
const SHELL = ['./', './index.html', './login.html', './css/login-dune.css?v=3', './js/login.js', './js/i18n.js', './css/style.css', './css/pages.css', './css/theme.css?v=72', './css/buttons.css', './css/desktop.css', './js/aptitude.js', './css/aptitude.css', './js/app.js?v=92', './data/project-magenta.js?v=3', './js/config.js', './data/questions.js', './data/pilot-basics.js', './data/pilot-wind-geo.js', './data/physics.js?v=2', './data/more.js', './data/chemistry.js', './data/biology.js', './data/figs.js', './data/avia/aircraft.js', './data/avia/aero.js', './data/avia/met.js', './data/avia/nav.js', './data/avia/atc.js', './data/avia/ops.js', './data/avia/more.js', './data/toeic/book-01.js', './data/toeic/book-02.js', './data/toeic/book-03.js', './data/toeic/book-04.js', './data/toeic/book-05.js', './data/toeic/book-06.js', './data/toeic/book-07.js', './data/toeic/book-08.js', './data/toeic/book-09.js', './data/toeic/book-10.js', './data/english/grammar.js', './data/english/vocab.js?v=3', './data/math-a.js', './data/math-b.js', './data/extra/pilot-a.js', './data/extra/pilot-b.js', './data/extra/physics-a.js', './data/extra/physics-b.js', './data/extra/chemistry.js', './data/extra/biology.js', './data/tips/pilot.js?v=1', './data/tips/english.js?v=1', './data/primers/math.js?v=1', './data/primers/math-figs.js?v=1', './icon.svg', './img/logo.png', './img/wordmark.png', './img/clock.png', './img/pilot-icons-flat.jpg', './img/project-magenta/mcp737.jpg', './img/project-magenta/pbgc1-300x167.jpg', './img/project-magenta/pcdu4-191x300.jpg', './img/project-magenta/pfcu.jpg', './img/project-magenta/pabgc-300x150.jpg', './img/project-magenta/pmcdu-191x300.jpg', './img/project-magenta/ios-map-faa-chart-900.jpg', './img/project-magenta/ios-environment-900.jpg', './img/project-magenta/ios-load-fuel-900.jpg', './img/project-magenta/ios-data-logger-900.jpg', './img/pilot-icons-iso.png', './img/topics/basic.png', './img/topics/hist.png', './img/topics/nav.png', './img/topics/law.png', './img/topics/agk.png', './img/topics/hfr.png', './img/topics/geo.png', './img/topics/ticket.png', './img/topics/airport.png', './img/topics/seatbelt.png', './img/tabs/home.png', './img/tabs/missions.png', './img/tabs/practice.png', './img/tabs/stats.png', './img/tabs/profile.png', './img/chars/c1.png', './img/chars/c2.png', './img/chars/c3.png', './img/chars/c4.png', './img/chars/c5.png', './img/chars/c8.png', './manifest.webmanifest'];

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
  const url = new URL(req.url);
  const versionedData = url.pathname.startsWith(new URL('./data/', self.registration.scope).pathname)
    && url.searchParams.has('v') && req.cache !== 'reload';

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (versionedData) {
      const cached = await cache.match(req);
      if (cached) return cached;
    }
    try {
      const response = await fetch(req, { cache: 'no-cache' });
      if (response.ok) e.waitUntil(cache.put(req, response.clone()).catch(() => {}));
      return response;
    } catch (error) {
      const cached = await cache.match(req) || await cache.match(new URL(url.pathname, url.origin).href);
      if (cached) return cached;
      throw error;
    }
  })());
});
