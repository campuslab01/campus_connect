import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Filter, MapPin, GraduationCap, Heart, X, Sparkles, MessageCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Link } from 'react-router-dom';
import { User, mockUsers } from '../data/mockUsers';
import bgImage from "/images/login.jpeg";
import { Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';






const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    gender: 'all',
    year:'all',
    department: 'all',
    lookingFor: 'all',
    interests: [] as string[]
  });

  const [showFilters, setShowFilters] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
    // 🔠 Typewriter placeholder animation with blinking cursor
    const placeholders = [
      "Find by name...",
      "Find by department...",
    ];
  
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
  
    useEffect(() => {
      const current = placeholders[index];
      const typingSpeed = deleting ? 60 : 100;
  
      const timeout = setTimeout(() => {
        if (!deleting && charIndex < current.length) {
          setDisplayText(current.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else if (deleting && charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else if (!deleting && charIndex === current.length) {
          setTimeout(() => setDeleting(true), 1500);
        } else if (deleting && charIndex === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % placeholders.length);
        }
      }, typingSpeed);
  
      return () => clearTimeout(timeout);
    }, [charIndex, deleting, index]);
  
    // 🔁 Blinking cursor toggle
    useEffect(() => {
      const cursorBlink = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorBlink);
    }, []);
  

  // Keyboard shortcut: press / to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const allInterests = ['Sports', 'Music', 'Travel', 'Photography', 'Art', 'Books', 'Gaming', 'Movies', 'Cooking', 'Dancing'];

  const debouncedQuery = useDebounce(searchQuery, 200);
  const filteredUsers = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return mockUsers.filter(user => {
      const matchesSearch = q.length === 0 ||
        user.name.toLowerCase().includes(q) ||
        user.college.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q);

      const matchesGender = filters.gender === 'all' || user.gender === filters.gender;
      const matchesDepartment = filters.department === 'all' || user.department === filters.department;
      const matchesInterests = filters.interests.length === 0 ||
        filters.interests.some(interest => user.interests.includes(interest));
      const matchesLookingFor = filters.lookingFor === 'all' || user.lookingFor.includes(filters.lookingFor as any);
      return matchesSearch && matchesGender && matchesDepartment && matchesInterests && matchesLookingFor;
    });
  }, [debouncedQuery, filters]);

  const toggleInterest = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const clearFilters = () => {
    setFilters({ gender: 'all', year:'all', department: 'all', lookingFor: 'all', interests: [] });
  };

  const toggleLike = (id: string) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

 

  function handleAction(arg0: string) {
    throw new Error('Function not implemented.');
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>
      <div className="relative z-10 max-w-3xl mx-auto px-2">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 -mx-4 px-4 pt-4 pb-3 bg-black/40 backdrop-blur-md border-b border-white/10">
  <div className="flex items-center justify-between">
    {/* Left: Title stays the same */}
    <div className="flex items-center gap-2 text-white">
      {/* <Sparkles className="h-5 w-5 text-pink-400" /> */}
      <h2 className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
 bg-clip-text text-transparent text-xl font-semibold tracking-wide">
        Search & Discover
      </h2>
    </div>

    {/* Right: Profile Button */}
    <button
      onClick={() => navigate('/profile')}
      className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/30 shadow-md"
    >
      <img
        src="/images/login.jpeg" // replace with dynamic user avatar if available
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </button>
  </div>

  {/* Search Input */}
  <div className="relative mt-3">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
    <input
      ref={inputRef}
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={`${displayText}${showCursor ? " |" : " "}`}
      className="w-full pl-12 pr-24 py-2.5 md:py-3 rounded-2xl bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50 shadow-lg transition-all duration-300"
    />
    <button
      onClick={() => setShowFilters((s) => !s)}
      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium transition-all hover:scale-105"
    >
      <Sliders size={18} />
    </button>
  </div>
</div>


       {/* Filters Section */}
<AnimatePresence initial={false}>
  {showFilters && (
    <motion.div
      style={{ position: 'absolute', zIndex: 50 }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl p-4 bg-black/40 backdrop-blur-lg border border-white/10 shadow-xl mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-white/90">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-xs px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-all font-medium"
        >
          Reset
        </button>
      </div>

      {/* Gender + Year Row */}
      <div className="flex gap-4 mb-4">
        {/* Gender */}
        <div className="w-1/2">
          <label className="block text-xs text-white/70 mb-2 capitalize">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Year */}
        <div className="w-1/2">
          <label className="block text-xs text-white/70 mb-2 capitalize">Year</label>
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      {/* Department + LookingFor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Department */}
        <div>
          <label className="block text-xs text-white/70 mb-2 capitalize">Department</label>
          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none"
          >
            <option value="" disabled className="text-gray-400">
                        Department
                      </option>
                      <option value="B.Com">B.Com</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MBA">MBA</option>
                      <option value="LLB">LLB</option>
                      <option value="LLM">LLM</option>
                      <option value="B.Tech CSE">B.Tech CSE</option>
                      <option value="B.Tech IT">B.Tech IT</option>
                      <option value="B.Tech ME">B.Tech ME</option>
                      <option value="B.Tech CE">B.Tech CE</option>
                      <option value="B.Tech EE">B.Tech EE</option>
                      <option value="B.Tech ECE">B.Tech ECE</option>
                      <option value="B.Sc Physics">B.Sc Physics</option>
                      <option value="B.Sc Chemistry">B.Sc Chemistry</option>
                      <option value="B.Sc Maths">B.Sc Maths</option>
                      <option value="B.Sc Biotech">B.Sc Biotech</option>
                      <option value="B.Sc Forensic">B.Sc Forensic</option>
                      <option value="B.Pharm">B.Pharm</option>
                      <option value="M.Pharm">M.Pharm</option>
                      <option value="B.Sc Agri">B.Sc Agri</option>
                      <option value="BA Eng/Hindi">BA Eng/Hindi</option>
                      <option value="BA Social Sci">BA Social Sci</option>
                      <option value="Other">Other</option>
          </select>
        </div>

        {/* Looking For */}
        <div>
          <label className="block text-xs text-white/70 mb-2 capitalize">Looking For</label>
          <select
            value={filters.lookingFor}
            onChange={(e) => setFilters(prev => ({ ...prev, lookingFor: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="Long term">Long term</option>
            <option value="Short term">Short term</option>
            <option value="Friendship">Friendship</option>
          </select>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-3">
        <label className="block text-xs text-white/70 mb-2">Interests</label>
        <div className="flex flex-wrap gap-2">
          {allInterests.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filters.interests.includes(interest)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-transparent'
                  : 'bg-white/5 text-white/70 hover:text-white border-white/10'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>



        {/* Results List */}
        <div className="space-y-2 max-h-[calc(100vh-170px)] overflow-y-auto pt-4 pb-8 px-1">
          <div className="flex justify-between items-center text-white/80">
            <h3 className="text-sm z-20">{filteredUsers.length} results</h3>
            {debouncedQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs flex items-center gap-1 text-white/60 hover:text-white">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>

          <AnimatePresence>
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id ?? user.name}
                onClick={() => { setSelectedUser(user); setCurrentPhotoIndex(0); setShowProfileModal(true); }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-2xl p-5 md:p-6 bg-black/40 backdrop-blur-lg border border-white/10 hover:shadow-pink-500/30 transition-all"
              >
                <div className="flex gap-4">
                <div className="relative">
  <img
    src={user.photos[0]}
    alt={user.name}
    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-pink-500/30"
  />
  {user.verified && (
    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</div>
  )}
</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-white truncate">{user.name}, {user.age}</h4>
                      <button onClick={() => toggleLike(String(user.id ?? user.name))} className={`${liked[String(user.id ?? user.name)] ? 'text-pink-400' : 'text-white/60 hover:text-white'} transition-colors`}>
                        <Heart size={20} fill={liked[String(user.id ?? user.name)] ? '#ec4899' : 'none'} />
                      </button>
                    </div>
                    <div className="mt-1 space-y-1 text-xs text-white/70">
                      <div className="flex items-center gap-2"><GraduationCap size={14} /><span className="truncate">{user.department} • {user.year}</span></div>
                      <div className="flex items-center gap-2"><MapPin size={14} /><span className="truncate">{user.college}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-pink-300 text-[10px] px-2 py-1 rounded-full">{interest}</span>
                      ))}
                      {user.interests.length > 3 && (
                        <span className="text-white/60 text-[10px]">+{user.interests.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Profile Details Modal */}
       <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-3xl p-6 max-w-md w-full max-h-[75vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <img
                    src={selectedUser?.photos[currentPhotoIndex]}
                    alt={selectedUser?.name}
                    className="w-full h-full rounded-full object-cover border-2 border-pink-400 shadow-lg"
                  />
                  {selectedUser?.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                      <Star size={12} />
                    </div>
                  )}
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-white mb-1 drop-shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {selectedUser?.name}, {selectedUser?.age}
                </motion.h2>
                <motion.p 
                  className="text-white/80 text-sm drop-shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {selectedUser?.college} • {selectedUser?.department}
                </motion.p>
              </div>

              {/* Profile Details */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Bio */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mt-[1.2rem]">
  <h3 className="text-white font-semibold mb-3 flex items-center">
    <Sparkles size={16} className="mr-2 text-pink-400" />
    Bio
  </h3>
  <div className="text-white/80 drop-shadow-sm leading-relaxed">
    Love coding, hiking, and good coffee. Always up for exploring new places around campus!
  </div>
</div>

                {/* Academic Info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <GraduationCap size={16} className="mr-2 text-purple-400" />
                    Academic Info
                  </h3>
                  <div className="space-y-2">
                  <div className="flex justify-between mt-[1.2rem]">
  <span className="text-white/80 font-medium drop-shadow-sm">Department:</span>
  <span className="text-white drop-shadow-sm">{selectedUser?.department}</span>
</div>
<div className="flex justify-between mt-[1.2rem]">
      <span className="text-white/80 font-medium drop-shadow-sm">Year:</span>
      <span className="text-white drop-shadow-sm">{selectedUser?.year}</span>
    </div>
                  </div>
                </div>
                         {/* Relationship & Interests */}
<div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
  <h3 className="text-white font-semibold mb-3 flex items-center">
    <Heart size={16} className="mr-2 text-pink-400" />
    Preferences
  </h3>
  <div className="space-y-2">
                  <div className="flex justify-between mt-[1.2rem]">
  <span className="text-white/80 font-medium drop-shadow-sm">Looking For:</span>
  <span className="text-white drop-shadow-sm">{selectedUser?.lookingFor}</span>
</div>
<div className="space-y-2">
                  <div className="flex justify-between mt-[1.2rem]">
  <span className="text-white/80 font-medium drop-shadow-sm">RelationShip Status:</span>
  <span className="text-white drop-shadow-sm">{selectedUser?.relationshipStatus}</span>
</div>
</div>
</div>
  </div>
   {/* Interests */}
   <div>
    <span className="text-white/80 text-sm font-medium block mb-2">Interests:</span>
    <div className="flex flex-wrap gap-2">
      {selectedUser?.interests.map((interest: string, index: number) => (
        <span
          key={index}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white text-xs px-3 py-1 rounded-full border border-white/20 shadow-sm hover:scale-105 transition-transform duration-200"
        >
          {interest}
        </span>
      ))}
    </div>
  </div>


                
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex space-x-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={() => {
                    setShowProfileModal(false);
                    handleAction('like');
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={16} className="inline mr-2" />
                  Like
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowProfileModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={16} className="inline mr-2" />
                  Message
                </motion.button>
              </motion.div>


              {/* Close Button */}
              <motion.button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// Debounce
function useDebounce<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
