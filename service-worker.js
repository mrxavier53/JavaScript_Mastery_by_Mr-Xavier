const CACHE_NAME = 'javascript-mastery-xavier-v1.1';
const ASSETS = [
  './', './index.html', './learn.html', './quiz.html', './tasks.html', './projects.html', './notes.html', './badges.html', './progress.html', './settings.html',
  './css/style.css', './js/app.js', './js/course-data.js', './js/learn.js', './js/quiz.js', './js/tasks.js', './js/projects.js', './js/notes.js', './js/badges.js', './js/progress.js', './js/settings.js', './js/speech-reader.js',
  './manifest.webmanifest', './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    if (response.ok && new URL(event.request.url).origin === location.origin) caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
