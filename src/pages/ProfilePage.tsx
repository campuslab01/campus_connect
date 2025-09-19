import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, Settings, Shield, Star, LogOut, Lock, Users, FileText, Trash2 } from 'lucide-react';

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

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile logic here
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Change password logic here
    console.log('Password changed successfully');
    setShowModal(null);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    // Delete account logic here
    console.log('Account deleted');
    setShowModal(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="max-w-lg mx-auto p-4 pt-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <div className="flex space-x-2">
          <motion.button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings size={20} />
          </motion.button>
          <motion.button 
            className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="flex bg-gray-100 rounded-xl p-1 mb-6"
        variants={itemVariants}
      >
        <motion.button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Profile
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Settings
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div 
            className="space-y-6"
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Photo Grid */}
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Photos</h3>
                <motion.button 
                  className="text-blue-600 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Photo
                </motion.button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {profile.photos.map((photo, index) => (
                  <motion.div 
                    key={index} 
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={photo}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                      whileHover={{ opacity: 1 }}
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </motion.div>
                    {index === 0 && (
                      <motion.div 
                        className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Main
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Profile Information</h3>
                <motion.button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center space-x-1 text-blue-600 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 size={14} />
                  <span>{isEditing ? 'Save' : 'Edit'}</span>
                </motion.button>
              </div>
              
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    {isEditing ? (
                      <motion.input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        whileFocus={{ scale: 1.02 }}
                      />
                    ) : (
                      <p className="text-gray-800">{profile.name}</p>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    {isEditing ? (
                      <motion.input
                        type="number"
                        value={profile.age}
                        onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        whileFocus={{ scale: 1.02 }}
                      />
                    ) : (
                      <p className="text-gray-800">{profile.age}</p>
                    )}
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  {isEditing ? (
                    <motion.input
                      type="text"
                      value={profile.college}
                      onChange={(e) => setProfile(prev => ({ ...prev, college: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      whileFocus={{ scale: 1.02 }}
                    />
                  ) : (
                    <p className="text-gray-800">{profile.college}</p>
                  )}
                </motion.div>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    {isEditing ? (
                      <motion.input
                        type="text"
                        value={profile.department}
                        onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        whileFocus={{ scale: 1.02 }}
                      />
                    ) : (
                      <p className="text-gray-800">{profile.department}</p>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    {isEditing ? (
                      <motion.select
                        value={profile.year}
                        onChange={(e) => setProfile(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        whileFocus={{ scale: 1.02 }}
                      >
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </motion.select>
                    ) : (
                      <p className="text-gray-800">{profile.year}</p>
                    )}
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <motion.textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                      maxLength={200}
                      whileFocus={{ scale: 1.02 }}
                    />
                  ) : (
                    <p className="text-gray-800">{profile.bio}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <motion.span
                        key={index}
                        className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {interest}
                      </motion.span>
                    ))}
                    {isEditing && (
                      <motion.button 
                        className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full border-2 border-dashed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        + Add
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Verification Status */}
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="bg-green-500 rounded-full p-2"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Verification Status</h4>
                    <p className="text-sm text-gray-600">Your profile is verified</p>
                  </div>
                </div>
                <motion.div 
                  className="bg-green-500 text-white p-1 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star size={16} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div 
            className="space-y-4"
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Privacy & Safety</h3>
              
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center justify-between"
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <h4 className="font-medium text-gray-800">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified about matches and messages</p>
                  </div>
                  <motion.button
                    onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      animate={{
                        x: settings.notifications ? 24 : 4
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-between"
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <h4 className="font-medium text-gray-800">Show Distance</h4>
                    <p className="text-sm text-gray-600">Display your distance to other users</p>
                  </div>
                  <motion.button
                    onClick={() => setSettings(prev => ({ ...prev, showDistance: !prev.showDistance }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.showDistance ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      animate={{
                        x: settings.showDistance ? 24 : 4
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-between"
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <h4 className="font-medium text-gray-800">Invisible Mode</h4>
                    <p className="text-sm text-gray-600">Hide your profile from discovery</p>
                  </div>
                  <motion.button
                    onClick={() => setSettings(prev => ({ ...prev, invisibleMode: !prev.invisibleMode }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.invisibleMode ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      animate={{
                        x: settings.invisibleMode ? 24 : 4
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Account</h3>
              
              <div className="space-y-3">
                <motion.button 
                  onClick={() => setShowModal('changePassword')}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lock size={18} className="text-gray-600" />
                  <span className="text-gray-700">Change Password</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => setShowModal('blockedUsers')}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users size={18} className="text-gray-600" />
                  <span className="text-gray-700">Blocked Users</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => setShowModal('privacyPolicy')}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText size={18} className="text-gray-600" />
                  <span className="text-gray-700">Privacy Policy</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => setShowModal('termsOfService')}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText size={18} className="text-gray-600" />
                  <span className="text-gray-700">Terms of Service</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => setShowModal('deleteAccount')}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors"
                  whileHover={{ x: 5, backgroundColor: "#fef2f2" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 size={18} className="text-red-600" />
                  <span className="text-red-600">Delete Account</span>
                </motion.button>
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
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Change Password Modal */}
              {showModal === 'changePassword' && (
                <>
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Change Password
                  </motion.h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </motion.div>
                    <motion.div 
                      className="flex space-x-3 mt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => setShowModal(null)}
                        className="flex-1 bg-gray-100 text-gray-600 font-medium py-3 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="flex-1 bg-blue-500 text-white font-medium py-3 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Update Password
                      </motion.button>
                    </motion.div>
                  </form>
                </>
              )}

              {/* Blocked Users Modal */}
              {showModal === 'blockedUsers' && (
                <>
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Blocked Users
                  </motion.h3>
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No blocked users</p>
                  </motion.div>
                  <motion.button
                    onClick={() => setShowModal(null)}
                    className="w-full bg-gray-100 text-gray-600 font-medium py-3 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Close
                  </motion.button>
                </>
              )}

              {/* Privacy Policy Modal */}
              {showModal === 'privacyPolicy' && (
                <>
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Privacy Policy
                  </motion.h3>
                  <motion.div 
                    className="max-h-60 overflow-y-auto text-sm text-gray-600 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="mb-3">Campus Connection respects your privacy and is committed to protecting your personal information.</p>
                    <p className="mb-3">We collect information you provide when creating your profile, including photos, interests, and academic information.</p>
                    <p className="mb-3">Your data is used to provide matching services and improve your experience on our platform.</p>
                    <p>We do not share your personal information with third parties without your consent.</p>
                  </motion.div>
                  <motion.button
                    onClick={() => setShowModal(null)}
                    className="w-full bg-blue-500 text-white font-medium py-3 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    I Understand
                  </motion.button>
                </>
              )}

              {/* Terms of Service Modal */}
              {showModal === 'termsOfService' && (
                <>
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Terms of Service
                  </motion.h3>
                  <motion.div 
                    className="max-h-60 overflow-y-auto text-sm text-gray-600 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="mb-3">By using Campus Connection, you agree to these terms and conditions.</p>
                    <p className="mb-3">You must be 18 years or older and currently enrolled in a college or university.</p>
                    <p className="mb-3">You are responsible for maintaining the confidentiality of your account.</p>
                    <p className="mb-3">Harassment, inappropriate content, or fake profiles are strictly prohibited.</p>
                    <p>We reserve the right to terminate accounts that violate these terms.</p>
                  </motion.div>
                  <motion.button
                    onClick={() => setShowModal(null)}
                    className="w-full bg-blue-500 text-white font-medium py-3 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    I Agree
                  </motion.button>
                </>
              )}

              {/* Delete Account Modal */}
              {showModal === 'deleteAccount' && (
                <>
                  <motion.h3 
                    className="text-xl font-bold text-red-600 mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Delete Account
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                  </motion.p>
                  <motion.div 
                    className="flex space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.button
                      onClick={() => setShowModal(null)}
                      className="flex-1 bg-gray-100 text-gray-600 font-medium py-3 rounded-xl"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;