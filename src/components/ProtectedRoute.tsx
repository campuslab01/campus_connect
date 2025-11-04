import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait until the authentication status is determined
  if (isLoading) {
    // You can show a global spinner here if you like
    return null; 
  }

  // If authenticated, render the child route content.
  if (isAuthenticated) {
    return <Outlet />;
  }

  // If not authenticated, check if user has launched before
  // If they have, redirect to auth page (skip landing page)
  // If they haven't, redirect to landing page (first time)
  const hasLaunchedBefore = localStorage.getItem('hasLaunchedBefore') === 'true';
  return <Navigate to={hasLaunchedBefore ? '/auth' : '/landing'} replace />;
};

export default ProtectedRoute;
