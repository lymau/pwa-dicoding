  // REGISTER SERVICE WORKER

  if (!('serviceWorker' in navigator)) {
    console.log("Service worker tidak didukung browser ini.");
  } else {
    registerServiceWorker();
    requestPermission();
  }
  
  // Register service worker
  function registerServiceWorker() {
    return navigator.serviceWorker.register('./service-worker.js')
      .then(function (registration) {
        console.log('Registrasi service worker berhasil.');
        return registration;
      })
      .catch(function (err) {
        console.error('Registrasi service worker gagal.', err);
      });
  }
  
  function requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(function (result) {
        if (result === "denied") {
          console.log("Fitur notifikasi tidak diijinkan.");
          return;
        } else if (result === "default") {
          console.error("Pengguna menutup kotak dialog permintaan ijin.");
          return;
        }
        if (('PushManager' in window)) {
          navigator.serviceWorker.getRegistration().then(function(registration) {
              registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: "BC-5bKj550WI7WbUmLZFPVPKiWOvhe5kCdDq-NSXLn-8pbTVYf0gyASpebB00qpRMuEm3r89jpZIYINxebL9eyU"
              }).then(function(subscribe) {
                  console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                  console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('p256dh')))));
                  console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('auth')))));
              }).catch(function(e) {
                  console.error('Tidak dapat melakukan subscribe ', e.message);
              });
          });
      }  
      });
    }
  }


  