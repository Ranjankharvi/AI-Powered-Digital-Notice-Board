const admin = require('firebase-admin');

let initialized = false;

function initFirebase() {
  if (initialized) return admin;

  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  let credential;

  if (serviceAccountBase64) {
    const json = Buffer.from(serviceAccountBase64, 'base64').toString();
    credential = JSON.parse(json);
  } else if (serviceAccountPath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    credential = require(serviceAccountPath);
  }

  if (!credential) {
    console.warn(
      '⚠️ Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT (base64) or FIREBASE_SERVICE_ACCOUNT_PATH for push notifications.'
    );
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert(credential),
  });

  initialized = true;
  return admin;
}

module.exports = initFirebase;

