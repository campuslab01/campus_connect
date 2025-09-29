import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Search, Users, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isDiscover = location.pathname.endsWith('/discover') || location.pathname === '/discover' || location.pathname === 'discover';

  const baseItems = [
    {
      to: '/discover', icon: Compass, label: 'Discover', notifications: 0,
      color: { base: 'text-fuchsia-400', hover: 'group-hover:text-fuchsia-300', active: 'text-fuchsia-300' }
    },
    {
      to: '/search', icon: Search, label: 'Search', notifications: 0,
      color: { base: 'text-cyan-400', hover: 'group-hover:text-cyan-300', active: 'text-cyan-300' }
    },
    {
      to: '/chat', icon: MessageCircle, label: 'Message', notifications: 7,
      color: { base: 'text-sky-400', hover: 'group-hover:text-sky-300', active: 'text-sky-300' }
    },
    {
      to: '/confessions', icon: Users, label: 'Confession', notifications: 2,
      color: { base: 'text-emerald-400', hover: 'group-hover:text-emerald-300', active: 'text-emerald-300' }
    },
    {
      to: '/likes', icon: Heart, label: 'Likes', notifications: 3,
      color: { base: 'text-rose-400', hover: 'group-hover:text-rose-300', active: 'text-rose-300' }
    }
  ] as const;

  const navItems = isDiscover
    ? [
        ...baseItems,
        {
          to: '/profile', icon: User, label: 'Profile', notifications: 1,
          color: { base: 'text-amber-400', hover: 'group-hover:text-amber-300', active: 'text-amber-300' }
        }
      ]
    : baseItems;

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Floating Profile Button (only on non-Discover pages) */}
      {!isDiscover && (
        <NavLink to="/profile" className="group">
          <motion.div
            className="fixed top-4 right-4 md:top-6 md:right-6 z-[60]"
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 blur-md" />
              <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl flex items-center justify-center text-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                <User size={20} />
              </div>
              {/* Tooltip */}
              <motion.div
                className="pointer-events-none absolute -bottom-8 right-1/2 translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-2.5 py-1 text-xs text-white/90 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                Profile
              </motion.div>
            </motion.div>
          </motion.div>
        </NavLink>
      )}
      {/* Full-width tab bar, flush to edges, only top corners rounded */}
      <div className="w-full">
        {/* Dock */}
        <div className="pointer-events-auto relative rounded-t-2xl rounded-b-none border-t border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_-6px_20px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          <div className={`relative grid ${navItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'} items-end gap-1 md:gap-2 px-0 py-2 md:py-3`}>
              {navItems.map(({ to, icon: Icon, label, notifications = 0, color }) => (
          <NavLink
            key={to}
            to={to}
                  className="group relative flex flex-col items-center justify-center py-1 text-white/80 hover:text-white transition-colors"
          >
            {({ isActive }) => (
              <>
                      {/* Active glow behind icon */}
                      <motion.div
                        className="absolute -inset-1 rounded-xl"
                        initial={false}
                        animate={{
                          background:
                            isActive
                              ? 'radial-gradient(60px_60px_at_center, rgba(168,85,247,0.25), rgba(0,0,0,0))'
                              : 'transparent'
                        }}
                        transition={{ duration: 0.3 }}
                      />

                {/* Icon */}
                <motion.div
                        className={`relative md:scale-110 ${isActive ? color.active : color.base} ${color.hover}`}
                        animate={{ scale: isActive ? 1.18 : 1 }}
                        whileHover={{ scale: 1.12 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                      >
                        <Icon size={22} />
                {notifications > 0 && (
                          <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-[10px] leading-none text-white px-1.5 py-0.5 font-semibold shadow">
                    {notifications > 99 ? '99+' : notifications}
                  </div>
                )}
                      </motion.div>

                      {/* Label reveal */}
                      <motion.span
                        className="mt-0.5 text-[10px] md:text-xs font-medium"
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0.75, color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)' }}
                      >
                        {label}
                      </motion.span>

                      {/* Active underline pill */}
                      <motion.div
                        className="absolute -bottom-1 h-1 w-8 md:w-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ transformOrigin: 'center' }}
                      />
              </>
            )}
          </NavLink>
        ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
