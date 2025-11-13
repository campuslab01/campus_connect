import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext';

interface NotificationItemProps {
  id: string;
  title: string;
  body: string;
  receivedAt: string;
  read: boolean;
}

const NotificationCenterModal: React.FC = () => {
  const { notifications, markAllRead, clearNotifications, removeNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const toggleOpen = () => setIsOpen((v) => !v);

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}
        className="rounded-full bg-indigo-600 text-white shadow-lg px-4 py-3"
      >
        <span>Notifications</span>
        {unreadCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white text-indigo-600 text-xs px-2 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl p-6 bg-white"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <div className="flex gap-2">
                  <button onClick={() => markAllRead()} className="text-sm px-3 py-1 rounded bg-indigo-100 text-indigo-700">Mark all read</button>
                  <button onClick={() => clearNotifications()} className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-700">Clear</button>
                  <button onClick={toggleOpen} className="text-sm px-3 py-1 rounded bg-gray-200">Close</button>
                </div>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-auto">
                {notifications.length === 0 ? (
                  <div className="text-sm text-gray-600">No notifications yet.</div>
                ) : (
                  notifications.map((n) => (
                    <NotificationRow
                      key={n.id}
                      id={n.id}
                      title={n.title}
                      body={n.body}
                      receivedAt={n.receivedAt}
                      read={n.read}
                    >
                      <button
                        onClick={() => removeNotification(n.id)}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-700"
                      >
                        Remove
                      </button>
                    </NotificationRow>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NotificationRow: React.FC<NotificationItemProps & { children?: React.ReactNode }> = ({ id, title, body, receivedAt, read, children }) => {
  const date = new Date(receivedAt);
  const ts = isNaN(date.getTime()) ? receivedAt : date.toLocaleString();
  return (
    <div className={`border rounded-lg p-3 ${read ? 'bg-gray-50' : 'bg-indigo-50'}`}
      data-id={id}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-600">{ts}</div>
      </div>
      <div className="text-sm text-gray-800 mt-1">{body}</div>
      <div className="mt-2 flex gap-2">{children}</div>
    </div>
  );
};

export default NotificationCenterModal;