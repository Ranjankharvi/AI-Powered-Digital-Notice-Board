import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messagingInstance;
let swRegistrationPromise;

function isBrowser() {
  return typeof window !== 'undefined';
}

export function initFirebase() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase config missing. Push notifications disabled.');
    console.warn('Please set NEXT_PUBLIC_FIREBASE_* environment variables in .env.local');
    return null;
  }

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging();
  }

  return messagingInstance;
}

async function registerServiceWorker() {
  if (!isBrowser() || !('serviceWorker' in navigator)) {
    console.warn('Service workers not supported in this browser.');
    return null;
  }

  if (swRegistrationPromise) return swRegistrationPromise;

  const query = encodeURIComponent(
    btoa(
      JSON.stringify({
        apiKey: firebaseConfig.apiKey,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
        messagingSenderId: firebaseConfig.messagingSenderId,
        appId: firebaseConfig.appId,
      })
    )
  );

  swRegistrationPromise = navigator.serviceWorker.register(`/firebase-messaging-sw.js?config=${query}`);
  await swRegistrationPromise;
  return swRegistrationPromise;
}

// Development mode: Generate a mock token when Firebase is not configured
function generateMockToken() {
  // Generate a consistent mock token for development
  const mockToken = `dev-mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.warn('⚠️ Using mock FCM token (Firebase not configured). Real notifications will not work.');
  console.warn('⚠️ To enable real push notifications, configure Firebase in .env.local');
  return mockToken;
}

export async function requestFcmToken() {
  const messaging = initFirebase();
  
  // Development mode: return mock token if Firebase is not configured
  if (!messaging) {
    if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return generateMockToken();
    }
    throw new Error('Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* environment variables.');
  }

  try {
    const registration = await registerServiceWorker();
    if (!registration) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Service worker registration failed, using mock token');
        return generateMockToken();
      }
      throw new Error('Service worker registration failed. Make sure you are using HTTPS or localhost.');
    }
    
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('VAPID key missing, using mock token');
        return generateMockToken();
      }
      throw new Error('NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing. Please configure it in .env.local');
    }
    
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to get real token, using mock token');
        return generateMockToken();
      }
      throw new Error('Failed to get FCM token. Please check browser console for details.');
    }
    return token;
  } catch (err) {
    console.error('FCM token retrieval failed', err);
    // In development, fall back to mock token
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to mock token in development mode');
      return generateMockToken();
    }
    throw err;
  }
}

export function onForegroundMessage(callback) {
  const messaging = initFirebase();
  if (!messaging) return () => {};

  return onMessage(messaging, callback);
}

