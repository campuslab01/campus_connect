import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getFCMToken, 
  requestNotificationPermission, 
  checkNotificationPermission,
  onMessageListener 
} from '../config/firebase';
import api from '../config/axios';

interface NotificationContextType {
  notificationPermission: NotificationPermission;
  fcmToken: string | null;
  requestPermission: () => Promise<boolean>;
  updateToken: () => Promise<void>;
  isSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Check browser support
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 
                     'serviceWorker' in navigator && 
                     'Notification' in window &&
                     'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Register service worker
  useEffect(() => {
    if (!isSupported) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [isSupported]);

  // Listen for foreground messages
  useEffect(() => {
    if (!isSupported || !checkNotificationPermission()) return;

    onMessageListener()
      .then((payload) => {
        if (payload) {
          console.log('Foreground notification:', payload);
          
          // Show notification manually in foreground
          if ('Notification' in window && Notification.permission === 'granted') {
            const notificationTitle = payload.notification?.title || 'Campus Connection';
            const notificationOptions: NotificationOptions = {
              body: payload.notification?.body || '',
              icon: payload.notification?.icon || '/images/login.jpeg',
              badge: '/images/login.jpeg',
              image: payload.notification?.image,
              data: payload.data || {},
              tag: payload.data?.type || 'notification',
              vibrate: [200, 100, 200]
            };

            new Notification(notificationTitle, notificationOptions);
          }
        }
      })
      .catch((error) => {
        console.error('Error receiving message:', error);
      });
  }, [isSupported]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    const granted = await requestNotificationPermission();
    setNotificationPermission(Notification.permission);
    
    if (granted) {
      await updateToken();
    }
    
    return granted;
  }, [isSupported]);

  // Get and update FCM token
  const updateToken = useCallback(async () => {
    if (!isSupported || !isAuthenticated || !user) {
      return;
    }

    if (!checkNotificationPermission()) {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const token = await getFCMToken();
      
      if (token) {
        setFcmToken(token);
        
        // Send token to backend
        try {
          await api.post('/notifications/token', { token });
          console.log('FCM token sent to backend');
        } catch (error) {
          console.error('Error sending FCM token to backend:', error);
        }
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }, [isSupported, isAuthenticated, user]);

  // Initialize token when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && checkNotificationPermission()) {
      updateToken();
    }
  }, [isAuthenticated, user, updateToken]);

  // Update token periodically (every hour)
  useEffect(() => {
    if (!isAuthenticated || !checkNotificationPermission()) return;

    const interval = setInterval(() => {
      updateToken();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [isAuthenticated, updateToken]);

  const value: NotificationContextType = {
    notificationPermission,
    fcmToken,
    requestPermission,
    updateToken,
    isSupported
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
