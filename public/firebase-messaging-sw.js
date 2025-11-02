// Service Worker for Firebase Cloud Messaging
// This file must be in the public folder

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// Config is injected at build time - check vite.config.ts
// The config below uses a placeholder that gets replaced during build
const firebaseConfig = {
  apiKey: '{{VITE_FIREBASE_API_KEY}}',
  authDomain: '{{VITE_FIREBASE_AUTH_DOMAIN}}',
  projectId: '{{VITE_FIREBASE_PROJECT_ID}}',
  storageBucket: '{{VITE_FIREBASE_STORAGE_BUCKET}}',
  messagingSenderId: '{{VITE_FIREBASE_MESSAGING_SENDER_ID}}',
  appId: '{{VITE_FIREBASE_APP_ID}}'
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Campus Connection';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/images/login.jpeg',
    badge: '/images/login.jpeg',
    image: payload.notification?.image,
    data: payload.data || {},
    requireInteraction: true,
    tag: payload.data?.type || 'notification',
    vibrate: [200, 100, 200],
    actions: payload.data?.actions || []
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // Handle different notification types
  const data = event.notification.data;
  let url = '/';

  if (data?.type === 'message') {
    url = data.chatId ? `/chat?chatId=${data.chatId}` : '/chat';
  } else if (data?.type === 'match') {
    url = '/likes';
  } else if (data?.type === 'like') {
    url = '/likes';
  } else if (data?.type === 'confession') {
    url = '/confessions';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
