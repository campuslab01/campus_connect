import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { 
  getFCMToken, 
  requestNotificationPermission, 
  checkNotificationPermission,
  onMessageListener 
} from '../config/firebase';
import api from '../config/axios';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data: Record<string, string>;
  receivedAt: string;
  read: boolean;
}

interface NotificationContextType {
  notificationPermission: NotificationPermission;
  fcmToken: string | null;
  requestPermission: () => Promise<boolean>;
  updateToken: () => Promise<void>;
  isSupported: boolean;
  notifications: NotificationItem[];
  markAllRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
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
  const { showToast } = useToast();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const raw = localStorage.getItem('notifications');
      return raw ? (JSON.parse(raw) as NotificationItem[]) : [];
    } catch {
      return [];
    }
  });

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

  // Register service worker (wait for window load to avoid invalid state)
  useEffect(() => {
    if (!isSupported) return;

    const registerSW = () => {
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
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      const onLoad = () => {
        registerSW();
        window.removeEventListener('load', onLoad);
      };
      window.addEventListener('load', onLoad);
    }
  }, [isSupported]);

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Listen for foreground messages and show fallback toast if notifications denied
  useEffect(() => {
    if (!isSupported) return;

    onMessageListener()
      .then((payload) => {
        if (payload) {
          console.log('Foreground notification:', payload);

          const title = payload.notification?.title || 'Campus Connection';
          const body = payload.notification?.body || '';
          const data: Record<string, string> = payload.data ? (payload.data as Record<string, string>) : {};
          const item: NotificationItem = {
            id: payload.messageId || `${Date.now()}`,
            title,
            body,
            data,
            receivedAt: new Date().toISOString(),
            read: false
          };
          setNotifications((prev) => [item, ...prev].slice(0, 100));

          // Show browser notification if granted
          if ('Notification' in window && Notification.permission === 'granted') {
            const baseOptions: NotificationOptions = {
              body,
              icon: '/images/login.jpeg',
              badge: '/images/login.jpeg',
              data,
              tag: payload.data?.type || 'notification',
            };

            const notificationOptions = payload.notification?.image
              ? ({ ...baseOptions, image: payload.notification.image } as unknown as NotificationOptions)
              : baseOptions;

            navigator.serviceWorker.ready
              .then((registration) => {
                registration.showNotification(title, notificationOptions);
              })
              .catch(() => {
                showToast({ type: 'info', title, message: body || 'You have a new update.' });
              });
          } else {
            // Fallback toast when permission is denied/not granted
            showToast({ type: 'info', title, message: body || 'You have a new update.' });
          }
        }
      })
      .catch((error) => {
        console.error('Error receiving message:', error);
      });
  }, [isSupported, onMessageListener, showToast]);

  // Get and update FCM token
  const updateToken = useCallback(async () => {
    if (!isSupported || !isAuthenticated || !user) {
      return;
    }

    if (!checkNotificationPermission()) {
      console.warn('Notification permission not granted');
      // Provide a gentle reminder toast once per attempt
      showToast({ type: 'info', message: 'Enable notifications in browser settings to receive alerts.' });
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
      showToast({ type: 'success', message: 'Notifications enabled!' });
    } else {
      showToast({ type: 'error', message: 'Notifications denied. You can enable them later in settings.' });
    }
    
    return granted;
  }, [isSupported, updateToken, showToast]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);


  // Initialize token when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && checkNotificationPermission()) {
      updateToken();
    }
  }, [isAuthenticated, user, updateToken]);

  // Update token periodically (every hour)
  useEffect(() => {
    if (!isAuthenticated) return;

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
    isSupported,
    notifications,
    markAllRead,
    clearNotifications,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
