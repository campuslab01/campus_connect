import { useState, useEffect } from 'react';
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

// Layout for authenticated users
function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <main>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
}

// Layout for public pages
function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Outlet /> {/* Child routes will render here */}
    </div>
  );
}

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

  // Show splash screen on every app start
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Routes>
      {/* Authenticated Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <AuthenticatedLayout /> : <Navigate to="/landing" />}
      >
        <Route index element={<Navigate to="discover" />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="confessions" element={<ConfessionPage />} />
        <Route path="likes" element={<LikesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Public Routes */}
      <Route 
        path="/landing" 
        element={!isAuthenticated ? <PublicLayout /> : <Navigate to="/discover" />}
      >
        <Route 
          index 
          element={
            isFirstLaunch ? (
              <LandingPage onGetStarted={handleGetStarted} />
            ) : (
              <Navigate to="/auth" replace />
            )
          } />
      </Route>
      <Route path="/auth" element={!isAuthenticated ? <AuthPage onAuth={() => {}} /> : <Navigate to="/discover" />} />
    </Routes>
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