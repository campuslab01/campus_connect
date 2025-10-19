import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import ConfessionPage from './pages/ConfessionPage';
import LikesPage from './pages/LikesPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { useLenis } from './hooks/useLenis';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const { isAuthenticated } = useAuth();

  // Initialize Lenis smooth scrolling
  useLenis();

  const navigate = useNavigate();

  // Check if this is the first launch
  useEffect(() => {
    const hasLaunchedBefore = localStorage.getItem('hasLaunchedBefore');
    console.log('hasLaunchedBefore:', hasLaunchedBefore);
    console.log('isFirstLaunch:', isFirstLaunch);
    if (hasLaunchedBefore) {
      setIsFirstLaunch(false);
    }
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);

  };

  const handleGetStarted = () => {
    // Mark that the app has been launched before when user clicks "Get Started"
    localStorage.setItem('hasLaunchedBefore', 'true');
    navigate('auth');
  };

  const handleBackToLanding = () => {
    // Allow users to go back to landing page
    navigate('/landing');
  };

  // Show splash screen on every app start
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // After splash, check authentication and first launch status
  if (isAuthenticated) {
    // User is logged in, show main app
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="discover" />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="confessions" element={<ConfessionPage />} />
            <Route path="likes" element={<LikesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    );
  }

  // Not authenticated - show appropriate page based on first launch
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            (() => {
              console.log('Rendering route /, isFirstLaunch:', isFirstLaunch);
              // Flow 1: New user (first launch) -> Landing Page
              // Flow 2: Registered but not logged in -> Auth Page
              return isFirstLaunch ? (
                <LandingPage onGetStarted={handleGetStarted} />
              ) : (
                <Navigate to="auth" />
              );
            })()
          } 
        />
        <Route
          path="landing"
          element={<LandingPage onGetStarted={handleGetStarted} />}
        />
        <Route
          path="auth"
          element={<AuthPage onAuth={() => {}} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;