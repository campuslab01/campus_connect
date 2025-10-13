// ProfilePage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Edit2,
  Settings,
  Shield,
  Star,
  LogOut,
  Lock,
  Users,
  FileText,
  Trash2
} from 'lucide-react';
import bgImage from "/images/login.jpeg";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    age: 21,
    college: 'Stanford University',
    department: 'Computer Science',
    year: 'Junior',
    bio: 'Love coding, hiking, and good coffee. Looking for someone to explore the Bay Area with!',
    relationshipStatus: 'Single',
    interests: ['Programming', 'Hiking', 'Coffee', 'Travel', 'Photography'],
    photos: [
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  });

  const [settings, setSettings] = useState({
    notifications: true,
    showDistance: true,
    invisibleMode: false,
    autoMatch: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handlers
  const handleSaveProfile = () => {
    // here you can send profile to API
    setIsEditing(false);
    console.log('profile saved', profile);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Password changed successfully');
    setShowModal(null);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    // delete logic
    console.log('Account deleted');
    setShowModal(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <motion.div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* cinematic gradient overlay + heavy blur for glass effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>


      {/* Fixed header + tabs */}
  <div className="relative z-10 max-w-lg w-full mx-auto">
    <div className="sticky top-0 bg-black/60 backdrop-blur-lg pt-8 px-6 pb-4 z-20">
      {/* Header */}
      <motion.div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        bg-clip-text text-transparent drop-shadow-md">
          Profile
        </h2>
        <div className="flex z-50 space-x-3">
          
        <motion.button
  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-pink-300 shadow-inner transition-all"
  onClick={() => setShowModal('logoutConfirm')}
>
  <LogOut size={20} />
</motion.button>

        </div>
      </motion.div>

      {/* Tabs */}
<motion.div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20 shadow-lg">
  <motion.button
    onClick={() => setActiveTab('profile')}
    className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
      activeTab === 'profile'
        ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white shadow-md'
        : 'text-white/70 hover:text-white'
    }`}
  >
    Profile
  </motion.button>

  <motion.button
    onClick={() => setActiveTab('settings')}
    className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
      activeTab === 'settings'
        ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white shadow-md'
        : 'text-white/70 hover:text-white'
    }`}
  >
    Settings
  </motion.button>
</motion.div>

    </div>

        {/* Main content container */}
        <div className="overflow-y-auto max-h-[calc(100vh-120px)] px-6 pb-32 pt-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              className="space-y-6"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35 }}
            >
              {/* Photos */}
              <motion.div className="bg-white/8 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg" variants={itemVariants}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Photos</h3>
                  <motion.button className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-medium px-4 py-1 rounded-full shadow-md hover:opacity-95">
                    Add Photo
                  </motion.button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {profile.photos.map((photo, index) => (
                    <motion.div key={index} className="relative group overflow-hidden rounded-lg">
                      <img src={photo} alt={`Profile ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <Camera className="h-5 w-5 text-white" />
                      </motion.div>
                      {index === 0 && (
                        <motion.div className="absolute top-1 right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                          Main
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Profile Info */}
              <motion.div className="bg-white/8 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg" variants={itemVariants}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Profile Information</h3>
                  <motion.button
                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                    className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md hover:opacity-95"
                  >
                    <Edit2 size={14} />
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </motion.button>
                </div>

                <motion.div className="space-y-4" variants={containerVariants}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Name" value={profile.name} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, name: v })} />
                    <Field
                      label="Age"
                      type="number"
                      value={String(profile.age)}
                      editable={isEditing}
                      onChange={(v: string) => setProfile({ ...profile, age: Number(v) })}
                    />
                  </div>

                  <Field label="College" value={profile.college} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, college: v })} />

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Department" value={profile.department} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, department: v })} />
                    <SelectField
                      label="Year"
                      value={profile.year}
                      editable={isEditing}
                      onChange={(v: string) => setProfile({ ...profile, year: v })}
                    />
                  </div>

                  <Field label="Bio" type="textarea" value={profile.bio} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, bio: v })} />

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-white/80 mb-2">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, i) => (
                        <motion.span
                          key={i}
                          className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white text-sm px-3 py-1 rounded-full shadow-inner backdrop-blur-md"
                        >
                          {interest}
                        </motion.span>
                      ))}
                      {isEditing && (
                        <motion.button
                          onClick={() => setProfile(prev => ({ ...prev, interests: [...prev.interests, 'New'] }))}
                          className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-dashed border-white/10"
                          whileHover={{ scale: 1.03 }}
                        >
                          + Add
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Verification */}
              <motion.div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 backdrop-blur-lg rounded-xl p-4 border border-pink-400/30 shadow-lg" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Verified Profile</h4>
                      <p className="text-sm text-white/70">Your profile is verified</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1 rounded-full">
                    <Star size={16} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              className="space-y-4"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div className="bg-white/8 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg" variants={itemVariants}>
                <h3 className="font-semibold text-white mb-4">Privacy & Safety</h3>

                <div className="space-y-4">
                  <ToggleRow
                    title="Push Notifications"
                    subtitle="Get notified about matches and messages"
                    checked={settings.notifications}
                    onToggle={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                  />

                  <ToggleRow
                    title="Show Distance"
                    subtitle="Display your distance to other users"
                    checked={settings.showDistance}
                    onToggle={() => setSettings(prev => ({ ...prev, showDistance: !prev.showDistance }))}
                  />

                  <ToggleRow
                    title="Invisible Mode"
                    subtitle="Hide your profile from discovery"
                    checked={settings.invisibleMode}
                    onToggle={() => setSettings(prev => ({ ...prev, invisibleMode: !prev.invisibleMode }))}
                  />
                </div>
              </motion.div>

              <motion.div className="bg-white/8 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg" variants={itemVariants} whileHover={{ y: -4 }}>
                <h3 className="font-semibold text-white mb-4">Account</h3>

                <div className="space-y-3">
                  <ActionRow title="Change Password" icon={<Lock size={18} />} onClick={() => setShowModal('changePassword')} />
                  <ActionRow title="Blocked Users" icon={<Users size={18} />} onClick={() => setShowModal('blockedUsers')} />
                  <ActionRow title="Privacy Policy" icon={<FileText size={18} />} onClick={() => setShowModal('privacyPolicy')} />
                  <ActionRow title="Terms of Service" icon={<FileText size={18} />} onClick={() => setShowModal('termsOfService')} />
                  <ActionRow title="Delete Account" icon={<Trash2 size={18} />} onClick={() => setShowModal('deleteAccount')} danger />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md rounded-2xl p-6"
                initial={{ scale: 0.9, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                {/* Modal inner glass box */}
                <div className="bg-white/6 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 shadow-lg">
                  {/* Change Password */}
                  {showModal === 'changePassword' && (
                    <>
                      <motion.h3 className="text-xl font-bold text-white mb-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                        Change Password
                      </motion.h3>

                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <label className="block text-sm font-medium text-white/80 mb-1">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
                          <label className="block text-sm font-medium text-white/80 mb-1">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                          />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                          <label className="block text-sm font-medium text-white/80 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                          />
                        </motion.div>

                        <motion.div className="flex space-x-3 mt-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                          <motion.button
                            type="button"
                            onClick={() => setShowModal(null)}
                            className="flex-1 bg-white/10 text-white/80 font-medium py-3 rounded-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-medium py-3 rounded-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Update Password
                          </motion.button>
                        </motion.div>
                      </form>
                    </>
                  )}

                  {/* Blocked Users */}
                  {showModal === 'blockedUsers' && (
                    <>
                      <motion.h3 className="text-xl font-bold text-white mb-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                        Blocked Users
                      </motion.h3>

                      <motion.div className="text-center py-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <Users size={48} className="mx-auto text-white/60 mb-4" />
                        <p className="text-white/70">No blocked users</p>
                      </motion.div>

                      <motion.button
                        onClick={() => setShowModal(null)}
                        className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-medium py-3 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.04 } }}
                      >
                        Close
                      </motion.button>
                    </>
                  )}

                  {/* Privacy Policy */}
                  {showModal === 'privacyPolicy' && (
                    <>
                      <motion.h3 className="text-xl font-bold text-white mb-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                        Privacy Policy
                      </motion.h3>

                      <motion.div className="max-h-60 overflow-y-auto text-sm text-white/70 mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="mb-3">Campus Connection respects your privacy and is committed to protecting your personal information.</p>
                        <p className="mb-3">We collect information you provide when creating your profile, including photos, interests, and academic information.</p>
                        <p className="mb-3">Your data is used to provide matching services and improve your experience on our platform.</p>
                        <p>We do not share your personal information with third parties without your consent.</p>
                      </motion.div>

                      <motion.button
                        onClick={() => setShowModal(null)}
                        className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-medium py-3 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.04 } }}
                      >
                        I Understand
                      </motion.button>
                    </>
                  )}

                  {/* Terms of Service */}
                  {showModal === 'termsOfService' && (
                    <>
                      <motion.h3 className="text-xl font-bold text-white mb-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                        Terms of Service
                      </motion.h3>

                      <motion.div className="max-h-60 overflow-y-auto text-sm text-white/70 mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="mb-3">By using Campus Connection, you agree to these terms and conditions.</p>
                        <p className="mb-3">You must be 18 years or older and currently enrolled in a college or university.</p>
                        <p className="mb-3">You are responsible for maintaining the confidentiality of your account.</p>
                        <p className="mb-3">Harassment, inappropriate content, or fake profiles are strictly prohibited.</p>
                        <p>We reserve the right to terminate accounts that violate these terms.</p>
                      </motion.div>

                      <motion.button
                        onClick={() => setShowModal(null)}
                        className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-medium py-3 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.04 } }}
                      >
                        I Agree
                      </motion.button>
                    </>
                  )}

                  {/* Delete Account */}
                  {showModal === 'deleteAccount' && (
                    <>
                      <motion.h3 className="text-xl font-bold text-red-400 mb-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                        Delete Account
                      </motion.h3>

                      <motion.p className="text-white/70 mb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                      </motion.p>

                      <motion.div className="flex space-x-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <motion.button
                          onClick={() => setShowModal(null)}
                          className="flex-1 bg-white/10 text-white/80 font-medium py-3 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          onClick={handleDeleteAccount}
                          className="flex-1 bg-red-500 text-white font-medium py-3 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Delete Account
                        </motion.button>
                      </motion.div>
                    </>
                  )}

                  {/* Logout Confirm */}
                  {showModal === 'logoutConfirm' && (
                    <>
                      <motion.h3 className="text-xl font-bold text-white mb-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                        Confirm Logout
                      </motion.h3>
                      <motion.p className="text-white/70 mb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        Are you sure you want to logout? You can login anytime with your credentials.
                      </motion.p>

                      <motion.div className="flex space-x-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <motion.button
                          onClick={() => setShowModal(null)}
                          className="flex-1 bg-white/10 text-white/80 font-medium py-3 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          onClick={() => { setShowModal(null); console.log('Logged out'); }}
                          className="flex-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-medium py-3 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Logout
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </motion.div>
  );
};

/* ---------- Reusable small components ---------- */

const Field = ({ label, type = 'text', value, editable, onChange }: any) => {
  return (
    <motion.div>
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      {editable ? (
        type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows={4}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        )
      ) : (
        <p className="text-white/90">{value}</p>
      )}
    </motion.div>
  );
};

const SelectField = ({ label, value, editable, onChange }: any) => {
  return (
    <motion.div>
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      {editable ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option>Freshman</option>
          <option>Sophomore</option>
          <option>Junior</option>
          <option>Senior</option>
          <option>Graduate</option>
        </select>
      ) : (
        <p className="text-white/90">{value}</p>
      )}
    </motion.div>
  );
};

const ToggleRow = ({ title, subtitle, checked, onToggle }: any) => {
  return (
    <motion.div className="flex items-center justify-between" whileHover={{ x: 4 }}>
      <div>
        <h4 className="font-medium text-white/90">{title}</h4>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>

      <motion.button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-white/12'}`}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
          animate={{ x: checked ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );
};

const ActionRow = ({ title, icon, onClick, danger = false }: any) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${danger ? 'hover:bg-red-600/10' : 'hover:bg-white/6'}`}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`${danger ? 'text-red-400' : 'text-white/80'}`}>{icon}</div>
      <span className={`${danger ? 'text-red-400' : 'text-white/80'}`}>{title}</span>
    </motion.button>
  );
};

export default ProfilePage;
