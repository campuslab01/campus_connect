import React, { useMemo, useState } from 'react';
import { Bell } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext';

const NotificationBell: React.FC = () => {
  const { notifications, markAllRead, clearNotifications, removeNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const toggleOpen = () => setIsOpen((v) => !v);

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="w-10 h-10 rounded-full border-2 border-pink-500/30 shadow-md cursor-pointer flex items-center justify-center bg-white/10 text-white"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60"></div>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              className="relative w-full max-w-md mx-4 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="text-white/90 text-sm font-semibold">Notifications</div>
                <div className="flex gap-2">
                  <button onClick={markAllRead} className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/20">Mark all read</button>
                  <button onClick={clearNotifications} className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/20">Clear</button>
                </div>
              </div>
              <div className="max-h-[65vh] overflow-auto p-4 space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-sm text-white/70">No notifications yet.</div>
                ) : (
                  notifications.map((n) => {
                    const date = new Date(n.receivedAt);
                    const ts = isNaN(date.getTime()) ? n.receivedAt : date.toLocaleString();
                    return (
                      <div key={n.id} className={`border rounded-xl p-3 ${n.read ? 'bg-white/5' : 'bg-indigo-50/10 border-pink-500/30'}`}>
                        <div className="flex items-center justify-between">
                          <div className="text-white font-medium text-sm">{n.title}</div>
                          <div className="text-xs text-white/60">{ts}</div>
                        </div>
                        <div className="text-sm text-white/80 mt-1">{n.body}</div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => removeNotification(n.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Remove</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;