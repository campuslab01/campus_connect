import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import ConfessionPage from './pages/ConfessionPage';
import LikesPage from './pages/LikesPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { useLenis } from './hooks/useLenis';

function App() {
  // Initialize isAuthenticated from localStorage, default to false
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Update localStorage when isAuthenticated changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  // Initialize Lenis smooth scrolling
  useLenis();

  const handleGetStarted = () => {
    const basePath = process.env.NODE_ENV === 'production' ? '/onboarding' : '';
    window.location.href = `${basePath}/auth`;
  };

  return (
    <AuthProvider>
      <ChatProvider>
        <Router basename={process.env.NODE_ENV === 'production' ? '/onboarding' : '/'}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {isAuthenticated ? (
              <>
                <Navigation />
                <main className="pb-20">
                  <Routes>
                    <Route path="/" element={<Navigate to="/discover" />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/confessions" element={<ConfessionPage />} />
                    <Route path="/likes" element={<LikesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </main>
              </>
            ) : (
              <Routes>
                <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
                <Route
                  path="/auth"
                  element={<AuthPage onAuth={() => setIsAuthenticated(true)} />}
                />
                <Route path="/discover" element={<Navigate to="/auth" />} />
                <Route path="/chat" element={<Navigate to="/auth" />} />
                <Route path="/search" element={<Navigate to="/auth" />} />
                <Route path="/confessions" element={<Navigate to="/auth" />} />
                <Route path="/likes" element={<Navigate to="/auth" />} />
                <Route path="/profile" element={<Navigate to="/auth" />} />
              </Routes>
            )}
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;