import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Filter, MapPin, GraduationCap, Heart, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockUsers } from '../data/mockUsers';
import bgImage from "/images/login.jpeg";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: 'all',
    department: 'all',
    minAge: 18,
    maxAge: 30,
    interests: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Debounce query for smoother UX
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
      const matchesAge = user.age >= filters.minAge && user.age <= filters.maxAge;
      const matchesInterests = filters.interests.length === 0 ||
        filters.interests.some(interest => user.interests.includes(interest));

      return matchesSearch && matchesGender && matchesDepartment && matchesAge && matchesInterests;
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
    setFilters({ gender: 'all', department: 'all', minAge: 18, maxAge: 30, interests: [] });
  };

  const toggleLike = (id: string) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>
      <div className="relative z-10 max-w-3xl mx-auto p-4">
      {/* Sticky header: row 1 (title + profile), row 2 (search input) */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-4 pb-3 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neon-cyan">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-base md:text-lg font-semibold tracking-wide">Search & Discover</h2>
          </div>
          <Link to="/profile" className="text-white/80 hover:text-white text-sm underline underline-offset-4"></Link>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300/70 h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find by name, college, or department (press /)"
            className="w-full pl-12 pr-24 py-2.5 md:py-3 rounded-2xl bg-glass/60 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 shadow-neon backdrop-blur-xs"
          />
          <button
            onClick={() => setShowFilters(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-200 border border-white/10 transition-colors"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 shadow-neonPink mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white/90">Filters</h3>
                <button onClick={clearFilters} className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white/70 hover:text-white border border-white/10">Reset</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-white/70 mb-2">Gender</label>
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
                <div>
                  <label className="block text-xs text-white/70 mb-2">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none"
                  >
                    <option value="all">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-2">Age Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minAge}
                      onChange={(e) => setFilters(prev => ({ ...prev, minAge: parseInt(e.target.value || '18', 10) }))}
                      className="w-1/2 px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none"
                      min={18}
                      max={30}
                    />
                    <input
                      type="number"
                      value={filters.maxAge}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxAge: parseInt(e.target.value || '30', 10) }))}
                      className="w-1/2 px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none"
                      min={18}
                      max={30}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs text-white/70 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        filters.interests.includes(interest)
                          ? 'bg-neon-fuchsia/20 text-fuchsia-200 border-fuchsia-400/30 shadow-neonPink'
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
      </div>

      {/* Scrollable results area with bottom padding for nav */}
      <div className="space-y-4 max-h-[calc(100vh-170px)] overflow-y-auto pt-4 pb-28 px-1">
        <div className="flex justify-between items-center text-white/80">
          <h3 className="text-sm z-20">
            {filteredUsers.length} results
          </h3>
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl p-5 md:p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md hover:shadow-neon transition-shadow"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <img src={user.photos[0]} alt={user.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover" />
                  {user.verified && (
                    <div className="absolute -top-1 -right-1 bg-neon-cyan text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-white truncate">{user.name}, {user.age}</h4>
                    <button onClick={() => toggleLike(String(user.id ?? user.name))} className={`${liked[String(user.id ?? user.name)] ? 'text-rose-400' : 'text-white/60 hover:text-white'} transition-colors`}>
                      <Heart size={20} fill={liked[String(user.id ?? user.name)] ? '#fb7185' : 'none'} />
                    </button>
                  </div>
                  <div className="mt-1 space-y-1 text-xs text-white/70">
                    <div className="flex items-center gap-2"><GraduationCap size={14} /><span className="truncate">{user.department} • {user.year}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={14} /><span className="truncate">{user.college}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="bg-neon-blue/20 text-blue-200 text-[10px] px-2 py-1 rounded-full">{interest}</span>
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-white/70">
            <div className="mb-4"><Search size={48} className="mx-auto text-white/40" /></div>
            <h3 className="text-base font-medium mb-1">No results found</h3>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      </div>
  );
};

export default SearchPage;

// Local debounce hook for this file
function useDebounce<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}