import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Database, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import api from '../config/axios';
import { requestNotificationPermission, getFCMToken } from '../config/firebase';

interface PermissionPopupProps {
  onComplete: () => void;
}

export const PermissionPopup: React.FC<PermissionPopupProps> = ({ onComplete }) => {
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean | null>(null);
  const [storageAllowed, setStorageAllowed] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleRequestNotifications = async () => {
    try {
      const permission = await requestNotificationPermission();
      setNotificationsAllowed(permission);
      
      if (permission) {
        // Get FCM token and send to backend
        const token = await getFCMToken();
        if (token) {
          try {
            await api.post('/notifications/token', { token });
          } catch (err) {
            console.error('Error saving FCM token:', err);
          }
        }
        showToast({
          type: 'success',
          message: 'Notifications enabled!',
          duration: 2000
        });
      } else {
        showToast({
          type: 'error',
          message: 'Notifications were denied. You can enable them later in settings.',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setNotificationsAllowed(false);
      showToast({
        type: 'error',
        message: 'Failed to request notification permission',
        duration: 3000
      });
    }
  };

  const handleRequestStorage = async () => {
    try {
      // Test localStorage access
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      setStorageAllowed(true);
      showToast({
        type: 'success',
        message: 'Local storage enabled!',
        duration: 2000
      });
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setStorageAllowed(false);
      showToast({
        type: 'error',
        message: 'Local storage access denied. Some features may not work.',
        duration: 3000
      });
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Save preferences to backend
      await api.put('/auth/profile', {
        notificationsEnabled: notificationsAllowed === true,
        localStorageEnabled: storageAllowed === true,
        permissionsSet: true
      });
      
      // Save to localStorage
      if (storageAllowed) {
        localStorage.setItem('notificationsEnabled', String(notificationsAllowed === true));
        localStorage.setItem('localStorageEnabled', String(storageAllowed === true));
        localStorage.setItem('permissionsCompleted', 'true');
      }
      
      showToast({
        type: 'success',
        message: 'Preferences saved successfully!',
        duration: 2000
      });
      
      onComplete();
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save preferences',
        duration: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Save that user skipped
      await api.put('/auth/profile', {
        permissionsSet: false
      });
      try { localStorage.setItem('permissionsCompleted', 'true'); } catch {}
      onComplete();
    } catch (error) {
      console.error('Error saving skip:', error);
      try { localStorage.setItem('permissionsCompleted', 'true'); } catch {}
      onComplete(); // Continue anyway
    }
  };

  const bothCompleted = notificationsAllowed !== null && storageAllowed !== null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Welcome to Campus Connection!
            </h2>
            <p className="text-white/80 text-sm">
              Enable permissions to get the best experience
            </p>
          </div>

          {/* Notifications Permission */}
          <motion.div
            className="mb-6 p-4 rounded-xl bg-white/10 border border-white/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Push Notifications</h3>
                  <p className="text-white/70 text-xs">Get notified about matches and messages</p>
                </div>
              </div>
              {notificationsAllowed !== null && (
                notificationsAllowed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )
              )}
            </div>
            {notificationsAllowed === null && (
              <button
                onClick={handleRequestNotifications}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Allow Notifications
              </button>
            )}
          </motion.div>

          {/* Local Storage Permission */}
          <motion.div
            className="mb-6 p-4 rounded-xl bg-white/10 border border-white/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Local Storage</h3>
                  <p className="text-white/70 text-xs">Store your preferences and settings</p>
                </div>
              </div>
              {storageAllowed !== null && (
                storageAllowed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )
              )}
            </div>
            {storageAllowed === null && (
              <button
                onClick={handleRequestStorage}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Allow Local Storage
              </button>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 rounded-xl bg-white/10 text-white/80 font-medium hover:bg-white/20 transition-colors"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSavePreferences}
              disabled={!bothCompleted || isSaving}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                bothCompleted && !isSaving
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

