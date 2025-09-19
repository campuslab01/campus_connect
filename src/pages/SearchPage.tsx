import React, { useState } from 'react';
import { Search, Filter, MapPin, GraduationCap, Heart } from 'lucide-react';
import { mockUsers } from '../data/mockUsers';

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

  const allInterests = ['Sports', 'Music', 'Travel', 'Photography', 'Art', 'Books', 'Gaming', 'Movies', 'Cooking', 'Dancing'];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = filters.gender === 'all' || user.gender === filters.gender;
    const matchesDepartment = filters.department === 'all' || user.department === filters.department;
    const matchesAge = user.age >= filters.minAge && user.age <= filters.maxAge;
    const matchesInterests = filters.interests.length === 0 || 
                            filters.interests.some(interest => user.interests.includes(interest));

    return matchesSearch && matchesGender && matchesDepartment && matchesAge && matchesInterests;
  });

  const toggleInterest = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-4 pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search & Discover</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, college, or department..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 mb-4">
            <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>
            
            <div className="space-y-4">
              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Medicine">Medicine</option>
                </select>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAge: parseInt(e.target.value) }))}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="18"
                    max="30"
                  />
                  <input
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAge: parseInt(e.target.value) }))}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="18"
                    max="30"
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        filters.interests.includes(interest)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            {filteredUsers.length} Results
          </h3>
        </div>

        {filteredUsers.map((user, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={user.photos[0]}
                  alt={user.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                {user.verified && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800 text-lg">{user.name}, {user.age}</h4>
                  <button className="text-pink-500 hover:text-pink-600 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <GraduationCap size={14} />
                    <span>{user.department} • {user.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} />
                    <span>{user.college} • {user.distance} away</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.interests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                  {user.interests.length > 3 && (
                    <span className="text-gray-500 text-xs">+{user.interests.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;