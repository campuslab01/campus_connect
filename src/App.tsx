import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
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
  const { isAuthenticated, isLoading } = useAuth();

  // Initialize Lenis smooth scrolling
  useLenis();

  const navigate = useNavigate();

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleGetStarted = () => {
    // Mark that the app has been launched before when user clicks "Get Started"
    localStorage.setItem('hasLaunchedBefore', 'true');
    navigate('auth');
  };

  // Show splash screen on every app start, and a loading indicator while auth status is being determined
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (isLoading) {
    // You can replace this with a proper loading spinner component
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {isAuthenticated && <Navigation />}
      <main>
        <Routes>
          {/* Authenticated Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/discover" replace />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/confessions" element={<ConfessionPage />} />
            <Route path="/likes" element={<LikesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
    
          {/* Public Routes */}
          <Route path="/landing" element={!isAuthenticated ? <LandingPage onGetStarted={handleGetStarted} /> : <Navigate to="/discover" replace />} />
          <Route path="/auth" element={!isAuthenticated ? <AuthPage onAuth={() => {}} /> : <Navigate to="/discover" replace />} />
    
          {/* Fallback Route for unauthenticated users */}
          <Route path="*" element={!isAuthenticated ? <Navigate to="/landing" replace /> : <Navigate to="/discover" replace />} />
        </Routes>
      </main>
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