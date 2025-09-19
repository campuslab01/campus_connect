import React, { useState } from 'react';
import { Heart, X, MessageCircle, Star, Crown } from 'lucide-react';
import { mockLikes } from '../data/mockLikes';

const LikesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'likes' | 'matches'>('likes');
  const [showPremium, setShowPremium] = useState(false);

  const handleAction = (userId: number, action: 'like' | 'dislike' | 'dm') => {
    // Handle the action
    console.log(`Action: ${action} for user ${userId}`);
  };

  return (
    <div className="max-w-lg mx-auto p-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Likes & Matches</h2>
        <button
          onClick={() => setShowPremium(true)}
          className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-medium px-3 py-2 rounded-xl hover:shadow-lg transition-all"
        >
          <Crown size={16} />
          <span className="text-sm">Premium</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('likes')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'likes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Likes ({mockLikes.likes.length})
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'matches'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Matches ({mockLikes.matches.length})
        </button>
      </div>

      {/* Likes Tab */}
      {activeTab === 'likes' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">See who likes you!</h3>
                <p className="text-sm text-gray-600">Upgrade to Premium to see all your likes</p>
              </div>
              <button
                onClick={() => setShowPremium(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-2 rounded-xl"
              >
                Upgrade
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mockLikes.likes.map((like, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative">
                  <img
                    src={like.photo}
                    alt={like.name}
                    className={`w-full h-48 object-cover ${!like.isPremiumVisible ? 'blur-sm' : ''}`}
                  />
                  {!like.isPremiumVisible && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                      <div className="text-center text-white">
                        <Heart className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Premium Required</p>
                      </div>
                    </div>
                  )}
                  {like.verified && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <Star size={12} />
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h4 className="font-medium text-gray-800 mb-1">
                    {like.isPremiumVisible ? `${like.name}, ${like.age}` : 'Someone'}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {like.isPremiumVisible ? like.college : 'Liked your profile'}
                  </p>
                  
                  {like.isPremiumVisible ? (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleAction(like.id, 'dislike')}
                        className="bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full p-2 transition-all"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => handleAction(like.id, 'dm')}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-2 transition-all"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleAction(like.id, 'like')}
                        className="bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full p-2 transition-all"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPremium(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 rounded-lg text-sm"
                    >
                      View Profile
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          {mockLikes.matches.map((match, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1">
                    <Heart size={12} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">
                      {match.name}, {match.age}
                    </h4>
                    <span className="text-xs text-gray-500">{match.matchedAt}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{match.college}</p>
                  
                  {match.compatibilityScore && (
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                        {match.compatibilityScore}% Match
                      </div>
                      <span className="text-xs text-gray-500">{match.mutualInterests} mutual interests</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleAction(match.id, 'dm')}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          ))}

          {mockLikes.matches.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Heart size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No matches yet</h3>
              <p className="text-gray-500">Keep swiping to find your perfect match!</p>
            </div>
          )}
        </div>
      )}

      {/* Premium Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-4 w-fit mx-auto mb-4">
                <Crown className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600">Unlock all features and see who likes you!</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">See who likes you</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Unlimited swipes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Advanced filters</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Priority matching</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl">
                Start Premium - $9.99/month
              </button>
              <button
                onClick={() => setShowPremium(false)}
                className="w-full bg-gray-100 text-gray-600 font-medium py-3 rounded-xl"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikesPage;