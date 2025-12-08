// ProfilePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Edit2,
  Shield,
  Star,
  LogOut,
  Lock,
  Users,
  FileText,
  Trash2
} from 'lucide-react';
import bgImage from "/images/login.jpeg";
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import VerifyProfileModal from '../components/VerifyProfileModal';
// Notification bell removed per requirement

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  type Profile = {
    name: string;
    age: number;
    college: string;
    department: string;
    year: string;
    bio: string;
    relationshipStatus: string;
    interests: string[];
    photos: string[];
    lookingFor: string[];
  };

  const [profile, setProfile] = useState<Profile>({
    name: '',
    age: 18,
    college: '',
    department: '',
    year: 'Freshman',
    bio: '',
    relationshipStatus: 'Single',
    interests: [],
    photos: [],
    lookingFor: []
  });

  // Initialize from authenticated user without changing existing fields
  useEffect(() => {
    if (!user) return;
    
    // Process photos to ensure full URLs
    const processPhotos = (photos: any[] | undefined, profileImage: string | undefined) => {
      if (Array.isArray(photos) && photos.length > 0) {
        return photos.map((photo: string) => {
          if (!photo) return null;
          if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
          if (photo.startsWith('/uploads')) {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
            const baseUrl = apiUrl.replace('/api', '');
            return `${baseUrl}${photo}`;
          }
          return photo;
        }).filter((p: any) => p !== null);
      }
      if (profileImage) {
        if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
          return [profileImage];
        }
        if (profileImage.startsWith('/uploads')) {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
          const baseUrl = apiUrl.replace('/api', '');
          return [`${baseUrl}${profileImage}`];
        }
        return [profileImage];
      }
      return [];
    };
    
    const processedPhotos = processPhotos((user as any).photos, (user as any).profileImage);
    
    setProfile(prev => ({
      ...prev,
      name: user.name || prev.name,
      age: (user as any).age ?? prev.age,
      college: (user as any).college || prev.college,
      department: (user as any).department || prev.department,
      year: (user as any).year || prev.year,
      bio: (user as any).bio ?? prev.bio,
      relationshipStatus: (user as any).relationshipStatus || prev.relationshipStatus,
      interests: Array.isArray((user as any).interests) && (user as any).interests.length > 0 ? (user as any).interests : prev.interests,
      photos: processedPhotos.length > 0 ? processedPhotos.filter((p): p is string => p !== null) : prev.photos,
      lookingFor: Array.isArray((user as any).lookingFor) && (user as any).lookingFor.length > 0 ? (user as any).lookingFor : prev.lookingFor
    }));
  }, [user]);

  const [settings, setSettings] = useState({
    notifications: true,
    invisibleMode: false,
    autoMatch: false
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isPremiumActive, setIsPremiumActive] = useState<boolean>(false);
  const fileInputId = 'add-photo-input';
  const replaceInputId = (idx: number) => `replace-photo-input-${idx}`;
  
  // Refs for file inputs to ensure reliable clicking
  const addPhotoInputRef = useRef<HTMLInputElement>(null);
  const replacePhotoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleAddPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = Math.max(0, 3 - (profile.photos?.length || 0));
    const selected = Array.from(files).slice(0, remaining);
    if (selected.length === 0) return;
    const form = new FormData();
    selected.forEach((f) => form.append('images', f));
    setIsUploading(true);
    try {
      const res = await api.post('/upload/images', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data?.data?.user;
      if (updated) {
        setProfile((prev) => ({
          ...prev,
          photos: Array.isArray(updated.photos) && updated.photos.length > 0 ? updated.photos : prev.photos,
        }));
        
        // Update AuthContext
        if (updateUser) {
          updateUser(updated);
        }
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        
        showToast({
          type: 'success',
          message: 'Photos uploaded successfully',
          duration: 2000
        });
      }
    } catch (e: any) {
      console.error('Photo upload failed', e);
      showToast({
        type: 'error',
        message: e.response?.data?.message || 'Failed to upload photos',
        duration: 3000
      });
    } finally {
      setIsUploading(false);
      const inp = document.getElementById(fileInputId) as HTMLInputElement | null;
      if (inp) inp.value = '';
    }
  };

  const handleReplacePhoto = async (index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const form = new FormData();
    form.append('image', file);
    setIsUploading(true);
    try {
      const res = await api.put(`/upload/images/${index}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data?.data?.user;
      if (updated) {
        setProfile((prev) => ({ ...prev, photos: updated.photos || prev.photos }));
        
        // Update AuthContext
        if (updateUser) {
          updateUser(updated);
        }
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        
        showToast({
          type: 'success',
          message: 'Photo updated successfully',
          duration: 2000
        });
      }
    } catch (e: any) {
      console.error('Photo replace failed', e);
      showToast({
        type: 'error',
        message: e.response?.data?.message || 'Failed to update photo',
        duration: 3000
      });
    } finally {
      setIsUploading(false);
      const inp = document.getElementById(replaceInputId(index)) as HTMLInputElement | null;
      if (inp) inp.value = '';
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const suggestedInterests = [
    'Music', 'Movies', 'Reading', 'Photography', 'Travel', 'Coding', 'Gaming', 'Sports', 'Fitness', 'Art', 'Cooking', 'Dance', 'Meditation', 'Startups', 'Tech', 'AI', 'Design', 'Writing', 'Volunteering', 'Entrepreneurship'
  ];

  const initialProfile = useRef<any | null>(null);
  useEffect(() => {
    if (!initialProfile.current && user) {
      initialProfile.current = {
        name: profile.name,
        age: profile.age,
        bio: profile.bio || '',
        interests: profile.interests || [],
        relationshipStatus: profile.relationshipStatus || '',
        lookingFor: profile.lookingFor || [],
        college: profile.college || '',
        department: profile.department || '',
        year: profile.year || ''
      };
    }
  }, [user]);

  const isProfileDirty = () => {
    const init = initialProfile.current;
    if (!init) return false;
    const curr = {
      name: profile.name,
      age: profile.age,
      bio: profile.bio || '',
      interests: profile.interests || [],
      relationshipStatus: profile.relationshipStatus || '',
      lookingFor: profile.lookingFor || [],
      college: profile.college || '',
      department: profile.department || '',
      year: profile.year || ''
    };
    const sameArrays = (a: any[], b: any[]) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    };
    if (init.name !== curr.name) return true;
    if (init.age !== curr.age) return true;
    if (init.bio !== curr.bio) return true;
    if (!sameArrays(init.interests, curr.interests)) return true;
    if (init.relationshipStatus !== curr.relationshipStatus) return true;
    if (!sameArrays(init.lookingFor, curr.lookingFor)) return true;
    if (init.college !== curr.college) return true;
    if (init.department !== curr.department) return true;
    if (init.year !== curr.year) return true;
    return false;
  };
  

  // Handlers
  const handleSaveProfile = async () => {
    try {
      const updateData: any = {
        name: profile.name,
        age: profile.age,
        bio: profile.bio || '',
        interests: profile.interests,
        relationshipStatus: profile.relationshipStatus,
        lookingFor: profile.lookingFor
      };

      // Only include college/department/year if they exist
      if (profile.college) updateData.college = profile.college;
      if (profile.department) updateData.department = profile.department;
      if (profile.year) updateData.year = profile.year;

      const response = await api.put('/auth/profile', updateData);
      
      if (response.data.status === 'success') {
        setIsEditing(false);
        
        // Update local profile state with new data
        if (response.data.data?.user) {
          const updatedUser = response.data.data.user;
          setProfile(prev => ({
            ...prev,
            ...updatedUser
          }));
          
          // Update AuthContext user
          if (updateUser) {
            updateUser(updatedUser);
          }

          initialProfile.current = {
            name: updatedUser.name ?? profile.name,
            age: (updatedUser as any).age ?? profile.age,
            bio: (updatedUser as any).bio ?? (profile.bio || ''),
            interests: Array.isArray((updatedUser as any).interests) ? (updatedUser as any).interests : (profile.interests || []),
            relationshipStatus: (updatedUser as any).relationshipStatus ?? (profile.relationshipStatus || ''),
            lookingFor: Array.isArray((updatedUser as any).lookingFor) ? (updatedUser as any).lookingFor : (profile.lookingFor || []),
            college: (updatedUser as any).college ?? (profile.college || ''),
            department: (updatedUser as any).department ?? (profile.department || ''),
            year: (updatedUser as any).year ?? (profile.year || '')
          };
        }
        
        // Show success toast
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Profile updated successfully',
          duration: 3000
        });
        
        // Invalidate user queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['userSuggestions'] });
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.message || 'Failed to update profile',
        duration: 4000
      });
    }
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

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const { data } = await api.get('/payment/premium-status');
        setIsPremiumActive(Boolean(data?.active));
      } catch (e) {
        // ignore
      }
    };
    fetchPremiumStatus();
  }, []);

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
        <div className="flex z-50 space-x-3 items-center">
          {Boolean(user?.isVerified || (user as any)?.verified) && (
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-sm inline-flex items-center gap-1">Verified Profile</span>
          )}
          {/* Show Verify button until Face++ verification completes */}
          {!Boolean(user?.isVerified) && (
            <motion.button
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition shadow"
              onClick={() => setShowVerifyModal(true)}
            >
              Verify My Profile
            </motion.button>
          )}
          
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
              <motion.div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/15 backdrop-blur-2xl rounded-2xl p-4 shadow-xl" variants={itemVariants}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                    Photos
                  </h3>
                  <div className="flex items-center gap-3">
                    {isUploading && <span className="text-xs text-white/70">Uploading...</span>}
                    <motion.button
                      onClick={() => {
                        if (addPhotoInputRef.current) {
                          addPhotoInputRef.current.click();
                        } else {
                          document.getElementById(fileInputId)?.click();
                        }
                      }}
                      className={`bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-medium px-4 py-1 rounded-full shadow-md ${isUploading || (profile.photos?.length||0) >= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95'}`}
                      disabled={isUploading || (profile.photos?.length||0) >= 3}
                    >
                      {(profile.photos?.length||0) >= 3 ? 'Max 3 photos' : 'Add Photo'}
                    </motion.button>
                    <input
                      ref={addPhotoInputRef}
                      id={fileInputId}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAddPhotos(e.target.files)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[0,1,2].map((index) => {
                    const photo = profile.photos?.[index];
                    // Get full image URL - ensure it includes base URL if relative
                    const getImageUrl = (url: string | undefined) => {
                      if (!url) return null;
                      // If it's already a full URL (http/https), use as is
                      if (url.startsWith('http://') || url.startsWith('https://')) {
                        return url;
                      }
                      // If it starts with /uploads, prepend server URL
                      if (url.startsWith('/uploads')) {
                        const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com';
                        return `${apiUrl.replace('/api', '')}${url}`;
                      }
                      // Otherwise assume it's already complete or return as is
                      return url;
                    };
                    
                    const imageUrl = photo ? getImageUrl(photo) : null;
                    
                    return (
                      <motion.div key={index} className="relative group overflow-hidden rounded-lg">
                        {imageUrl ? (
                          <>
                            <img 
                              src={imageUrl} 
                              alt={`Profile ${index + 1}`} 
                              className="w-full h-24 object-cover rounded-lg cursor-pointer" 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Allow editing for all images using ref
                                const inputRef = replacePhotoInputRefs.current[index];
                                if (inputRef) {
                                  inputRef.click();
                                } else {
                                  // Fallback to getElementById if ref not available
                                  const input = document.getElementById(replaceInputId(index)) as HTMLInputElement | null;
                                  input?.click();
                                }
                              }}
                              onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).src = '/images/login.jpeg';
                              }}
                            />
                            <>
                              <input 
                                ref={(el) => {
                                  replacePhotoInputRefs.current[index] = el;
                                }}
                                id={replaceInputId(index)} 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleReplacePhoto(index, e.target.files)} 
                              />
                              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all pointer-events-none">
                                <Camera className="h-5 w-5 text-white" />
                              </motion.div>
                            </>
                            {index === 0 && (
                              <motion.div className="absolute top-1 right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                                Main
                              </motion.div>
                            )}
                            {index > 0 && (
                              <motion.div className="absolute top-1 left-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                                Editable
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              // Only allow adding to slots 1 and 2 (index 1, 2)
                              if (index > 0 && profile.photos?.length < index + 1) {
                                if (addPhotoInputRef.current) {
                                  addPhotoInputRef.current.click();
                                } else {
                                  document.getElementById(fileInputId)?.click();
                                }
                              }
                            }}
                            disabled={index === 0 || (profile.photos?.length || 0) >= 3}
                            className={`w-full h-24 flex items-center justify-center rounded-lg border border-dashed border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-white/5 ${
                              index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {index === 0 ? 'Registration Photo' : '+ Add'}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Profile Info */}
              <motion.div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/15 backdrop-blur-2xl rounded-2xl p-5 shadow-xl" variants={itemVariants}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
                    Profile Information
                  </h3>
                  <motion.button
                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                    className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md hover:opacity-95"
                  >
                    <Edit2 size={14} />
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </motion.button>
                </div>

                <motion.div className="space-y-5" variants={containerVariants}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Name" value={profile.name} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, name: v })} />
                    <Field label="Age" type="number" value={String(profile.age)} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, age: Number(v) })} />
                  </div>

                  <Field label="College" value={profile.college} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, college: v })} />

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Department" value={profile.department} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, department: v })} />
                    <SelectField label="Year" value={profile.year} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, year: v })} />
                  </div>

                  <Field label="Bio" type="textarea" value={profile.bio} editable={isEditing} onChange={(v: string) => setProfile({ ...profile, bio: v })} />

                  {/* Relationship Status */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-white/80 mb-2">Relationship Status</label>
                    {isEditing ? (
                      <select
                        value={profile.relationshipStatus}
                        onChange={(e) => setProfile({ ...profile, relationshipStatus: e.target.value })}
                        className="w-full bg-white/10 border border-white/12 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="Single">Single</option>
                        <option value="In a relationship">In a relationship</option>
                        <option value="Married">Married</option>
                        <option value="It's complicated">It's complicated</option>
                      </select>
                    ) : (
                      <div className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white/90">{profile.relationshipStatus || 'Not specified'}</div>
                    )}
                  </motion.div>

                  {/* Looking For */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-white/80 mb-2">Looking For</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {['Long term', 'Short term', 'Friendship'].map((option) => (
                          <label key={option} className="flex items-center text-white/90">
                            <input
                              type="checkbox"
                              checked={profile.lookingFor?.includes(option) || false}
                              onChange={(e) => {
                                const current = profile.lookingFor || [];
                                if (e.target.checked) {
                                  setProfile({ ...profile, lookingFor: [...current, option] });
                                } else {
                                  setProfile({ ...profile, lookingFor: current.filter((o: string) => o !== option) });
                                }
                              }}
                              className="mr-2 rounded"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white/90">{profile.lookingFor?.join(', ') || 'Not specified'}</div>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-white/80 mb-2">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, i) => (
                        <motion.span 
                          key={i} 
                          className="bg-white/10 border border-white/10 text-white text-sm px-3 py-1 rounded-full shadow-inner flex items-center gap-2"
                        >
                          {interest}
                          {isEditing && (
                            <button
                              onClick={() => setProfile(prev => ({ ...prev, interests: prev.interests.filter((_, idx) => idx !== i) }))}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          )}
                        </motion.span>
                      ))}
                      {isEditing && (
                        <motion.input
                          type="text"
                          placeholder="Type and press Enter"
                          onKeyPress={(e: any) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              const newInterest = e.target.value.trim();
                              if (!profile.interests.includes(newInterest)) {
                                setProfile(prev => ({ ...prev, interests: [...prev.interests, newInterest] }));
                              }
                              e.target.value = '';
                            }
                          }}
                          className="bg-white/10 border border-dashed border-white/20 text-white text-sm px-3 py-1 rounded-full placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-[150px]"
                        />
                      )}
                    </div>
                    {isEditing && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {suggestedInterests.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              if (!profile.interests.includes(tag)) {
                                setProfile(prev => ({ ...prev, interests: [...prev.interests, tag] }));
                              }
                            }}
                            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white text-xs px-3 py-1 rounded-full border border-white/20 hover:scale-105 transition-transform"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 backdrop-blur-lg rounded-xl p-4 border border-pink-400/30 shadow-lg" variants={itemVariants}>
                {Boolean(user?.isVerified || (user as any)?.verified) ? (
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
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Profile Verification</h4>
                        <p className="text-sm text-white/70">Not verified</p>
                      </div>
                    </div>
                    <motion.button
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      onClick={() => setShowVerifyModal(true)}
                    >
                      Verify
                    </motion.button>
                  </div>
                )}
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
                    onToggle={async () => {
                      const newValue = !settings.notifications;
                      setSettings(prev => ({ ...prev, notifications: newValue }));
                      
                      // Save to backend
                      try {
                        await api.put('/auth/profile', {
                          notificationsEnabled: newValue
                        });
                        showToast({
                          type: 'success',
                          message: 'Notification preferences updated',
                          duration: 2000
                        });
                      } catch (err: any) {
                        console.error('Error updating notification settings:', err);
                        // Revert on error
                        setSettings(prev => ({ ...prev, notifications: !newValue }));
                        showToast({
                          type: 'error',
                          message: 'Failed to update notification settings',
                          duration: 3000
                        });
                      }
                    }}
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
        {/* Verification Modal */}
        <VerifyProfileModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          onVerifiedSuccess={async () => {
            try {
              const resp = await api.put('/auth/profile', { isVerified: true });
              const updated = resp?.data?.data?.user || { isVerified: true };
              updateUser && updateUser(updated);
            } catch {
              if (user) {
                
                updateUser && updateUser({ ...user, isVerified: true });
              }
            }
          }}
        />
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
                          onClick={() => { setShowModal(null); logout(); }}
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
  const commonStyles = "w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white";
  return (
    <motion.div>
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      {editable ? (
        type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${commonStyles} placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400`}
            rows={4}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${commonStyles} placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400`}
          />
        )
      ) : (
        <div className={`${commonStyles} text-white/90`}>{value || 'Not specified'}</div>
      )}
    </motion.div>
  );
};

const SelectField = ({ label, value, editable, onChange }: any) => {
  const commonStyles = "w-full px-3 py-2 bg-white/10 border border-white/12 rounded-lg text-white";
  return (
    <motion.div>
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      {editable ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${commonStyles} focus:outline-none focus:ring-2 focus:ring-pink-400`}
        >
          <option>Freshman</option>
          <option>Sophomore</option>
          <option>Junior</option>
          <option>Senior</option>
          <option>Graduate</option>
        </select>
      ) : (
        <div className={`${commonStyles} text-white/90`}>{value || 'Not specified'}</div>
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
