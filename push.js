var webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BC-5bKj550WI7WbUmLZFPVPKiWOvhe5kCdDq-NSXLn-8pbTVYf0gyASpebB00qpRMuEm3r89jpZIYINxebL9eyU",
    "privateKey": "AITnfI_H2oMFe9URfFoSy8wHW5yepoy2KebZdYygD2M"
};
 
 
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fxC4821lHpw:APA91bGxxFl023qkrioNH2ay5TyOKLfOFejvV1MtTibEwEnjLMt0mkUgCgLYboBOQrFcwhg1Oej4dFQ7R5c1l-nwRi23SQPy14sT1gIak3Nf8EXBT9QJV3XSwqC9_nU5BeL-hrwmViEr",
    "keys": {
        "p256dh": "BH6uO97q9Bsw/0Qg/tCtvrPahlHbYaknDK9TDKkbtRNnWoKPXJyS72wb0JP43f1qjXpdhhL1nDlwhg7+m2O40GE=",
        "auth": "W6VwiQ3abC6xaNKH7aerqw=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
var options = {
    gcmAPIKey: '658279561829',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);