import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

// Firebase configuration
// TODO: Replace with your Firebase project config from Firebase Console
// Get it from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging: Messaging | null = null;

// Check if browser supports service workers and notifications
const isSupported = typeof window !== 'undefined' && 
                   'serviceWorker' in navigator && 
                   'Notification' in window &&
                   'PushManager' in window;

if (isSupported) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase messaging not available:', error);
  }
}

// Get FCM registration token
export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging || !isSupported) {
    console.warn('FCM not supported in this browser');
    return null;
  }

  try {
    // Get the registration token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || ''
    });

    if (token) {
      console.log('FCM Registration token:', token);
      return token;
    } else {
      console.warn('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isSupported) {
    console.warn('Notifications not supported');
    return false;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Notification permission granted');
    return true;
  } else {
    console.warn('Notification permission denied');
    return false;
  }
};

// Check notification permission
export const checkNotificationPermission = (): boolean => {
  if (!isSupported) {
    return false;
  }
  return Notification.permission === 'granted';
};

// Listen for foreground messages (when app is open)
export const onMessageListener = (): Promise<any> => {
  if (!messaging || !isSupported) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
    });
  });
};

export { messaging };
export default app;
