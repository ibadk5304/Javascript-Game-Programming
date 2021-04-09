var cacheName = 'phaser-v1';
var filesToCache = [
  './',
  './index.html',
  './assets/bomb.png',
  './assets/dude.png',
  './assets/platform.png',
  './assets/star.png',

  
  './assets/icon-192.png',
  './assets/icon-256.png',
  './assets/icon-512.png',
  '/js/main.js',
  '/css/styles.css',
  '//cdn.jsdelivr.net/npm/phaser@3.52.0/dist/phaser.min.js'
];
 
self.addEventListener('install', function(event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function(err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});