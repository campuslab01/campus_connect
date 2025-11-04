import { useState, useCallback } from 'react'; // Import useCallback
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Removed Outlet as it's not directly used here
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
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useLenis } from './hooks/useLenis';
import { ToastProvider } from './contexts/ToastContext';
import Toaster from './components/Toaster';
import { useGlobalSocketUpdates } from './hooks/useGlobalSocketUpdates';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, isBootstrapping } = useAuth();

  // Initialize Lenis smooth scrolling
  useLenis();
  
  // Setup global socket listeners for real-time updates
  useGlobalSocketUpdates();

  const navigate = useNavigate();

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleGetStarted = useCallback(() => { // Wrap in useCallback
    // Mark that the app has been launched before when user clicks "Get Started"
    localStorage.setItem('hasLaunchedBefore', 'true');
    navigate('auth');
  }, [navigate]); // navigate is a stable function from react-router-dom

  // Show splash screen on every app start, and a loading indicator while auth status is being determined
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (isBootstrapping) {
    // Minimal on-brand loader background
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="h-8 w-8 rounded-full border-4 border-purple-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {isAuthenticated && <Navigation />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={!isAuthenticated ? <LandingPage onGetStarted={handleGetStarted} /> : <Navigate to="/discover" replace />} />
          <Route path="/auth" element={!isAuthenticated ? <AuthPage onAuth={() => {}} /> : <Navigate to="/discover" replace />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
    
          {/* Authenticated Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/confessions" element={<ConfessionPage />} />
            <Route path="/likes" element={<LikesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Redirect root and any other authenticated paths to discover */}
            <Route path="/" element={<Navigate to="/discover" replace />} />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Route>
          
          {/* Catch-all route for unauthenticated users - check hasLaunchedBefore */}
          <Route path="*" element={
            !isAuthenticated ? (
              localStorage.getItem('hasLaunchedBefore') === 'true' ? (
                <Navigate to="/auth" replace />
              ) : (
                <Navigate to="/landing" replace />
              )
            ) : (
              <Navigate to="/discover" replace />
            )
          } />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <ChatProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </ChatProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;