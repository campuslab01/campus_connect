import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  MagnifyingGlass,
  ChatCircleDots,
  UsersThree,
  HeartStraight,
  UserCircle
} from 'phosphor-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isDiscover =
    location.pathname.endsWith('/discover') ||
    location.pathname === '/discover' ||
    location.pathname === 'discover';

  const baseItems = [
    { to: '/discover', icon: Compass, label: 'Discover', notifications: 0 },
    { to: '/search', icon: MagnifyingGlass, label: 'Search', notifications: 0 },
    { to: '/chat', icon: ChatCircleDots, label: 'Message', notifications: 7 },
    { to: '/confessions', icon: UsersThree, label: 'Confession', notifications: 2 },
    { to: '/likes', icon: HeartStraight, label: 'Likes', notifications: 3 }
  ] as const;

  const navItems = isDiscover
    ? [...baseItems, { to: '/profile', icon: UserCircle, label: 'Profile', notifications: 1 }]
    : baseItems;

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="w-full">
        <div className="pointer-events-auto relative rounded-t-3xl border-t-2 border-white/20 bg-white/5 backdrop-blur-md shadow-[0_-8px_32px_rgba(0,0,0,0.4)] before:absolute before:inset-0 before:rounded-t-3xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none">
          <div
            className={`relative grid ${
              navItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'
            } items-end gap-1 md:gap-2 px-0 py-2 md:py-3`}
          >
            {navItems.map(({ to, icon: Icon, label, notifications = 0 }) => (
              <NavLink
                key={to}
                to={to}
                className="group relative flex flex-col items-center justify-center py-1 transition-all duration-300"
              >
                {({ isActive }) => (
                  <>
                    {/* Icon with gradient */}
                    <motion.div
  className="relative inline-block"
  animate={{
    y: isActive ? [0, -6, 0, 6, 0] : 0, // floating motion
    scale: isActive ? [1, 1.1, 1, 1.1, 1] : 1, // subtle pulsate
  }}
  transition={{
    duration: 2.5,
    repeat: Infinity,
    repeatType: 'loop',
    ease: 'easeInOut',
  }}
  whileHover={{ scale: 1.18 }}
  whileTap={{ scale: 0.92 }}
>
                      <div 
                        className={isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 p-[1px] rounded-lg' 
                          : ''
                        }
                      >
                        <Icon 
                          size={24} 
                          weight={isActive ? 'fill' : 'regular'}
                          className={`${
                            isActive 
                              ? 'text-white' 
                              : 'text-gray-300 group-hover:text-blue-400'
                          }`}
                        />
                      </div>

                      {/* Notification badge */}
                      {notifications > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 
                                   bg-gradient-to-r from-pink-500 to-purple-600 
                                   rounded-full flex items-center justify-center 
                                   text-white text-[10px] font-bold shadow-lg"
                        >
                          {notifications > 9 ? '9+' : notifications}
                        </motion.div>
                      )}

                    </motion.div>

                    {/* Label with gradient */}
                    <motion.span
                      className={`mt-0.5 text-[11px] md:text-xs font-medium ${
                        isActive
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600'
                          : 'text-gray-300 group-hover:text-blue-400'
                      }`}
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0.7 }}
                      transition={{ duration: 0.2 }}
                    >
                      {label}
                    </motion.span>
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