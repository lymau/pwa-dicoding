importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded!`);
} else {
  console.log(`Boo! Workbox didn't load :()`);
}

workbox.setConfig({
  debug: true
})

// precache
workbox.precaching.precacheAndRoute([
    { url: 'index.html', revision: '3' },
    { url: 'favicon.ico', revision: '1'},
    { url: 'nav.html', revision: '1' },
    { url: 'favorit.html', revision: '2' },
    { url: 'tim.html', revision: '1' },
    { url: 'manifest.json', revision: '3' },
    { url: 'css/materialize.min.css', revision: '1' },
    { url: 'css/main.css', revision: '1' },
    { url: 'js/materialize.min.js', revision: '1' },
    { url: 'js/vendor/idb.js', revision: '1'},
    { url: 'js/nav.js', revision: '1' },
    { url: 'js/api.js', revision: '2' },
    { url: 'js/db.js', revision: '1' },
    { url: 'js/loadsw.js', revision: '2' }
],
    { ignoreURLParametersMatching: [/.*/] });

// routing untuk gambar aset dari web lokal
workbox.routing.registerRoute(
  /\.(?:png|gif|ico|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
// routing untuk gambar dari api
workbox.routing.registerRoute(
  /^https:\/\/upload\.wikimedia\.org/,
  workbox.strategies.cacheFirst({
    cacheName: 'team-badges',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        maxEntries: 30,
      }),
    ],
  })
);

//routing untuk google fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

//routing untuk data dari api
workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate()
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: '/img/icon-512.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
