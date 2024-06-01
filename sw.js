const CACHE_NAME = 'service-worker/v2';

const CACHE_FILES = [
  './index.html',
  './index.js',
  './styles.css',
  './iiitnr-pic.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('activate', (e) => {
  //Clean up useless cache
  caches.keys().then((keyList) => {
    return Promise.all(
      keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    );
  });
});

self.addEventListener('fetch', (e) => {
  //Offline Experience,
  //Whenever a file is requested.
  // 1. Fetch from the netwrok and update my cache
  // 2. Using cache as a fallback
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        //update my cache
        const cloneData = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, cloneData);
        });
        // console.log('Returning from Network');
        return res;
      })
      .catch(() => {
        // console.log('Returning from Cache');
        return caches.match(e.request).then((file) => file);
      })
  );
});
