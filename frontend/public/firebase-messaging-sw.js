/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

function getConfig() {
  const params = new URLSearchParams(self.location.search);
  const encoded = params.get('config');
  if (!encoded) {
    console.warn('[Firebase SW] Missing config query param');
    return null;
  }

  try {
    return JSON.parse(atob(encoded));
  } catch (err) {
    console.error('[Firebase SW] Failed to decode config', err);
    return null;
  }
}

const firebaseConfig = getConfig();

if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification || {};
    self.registration.showNotification(title, { body });
  });
}

