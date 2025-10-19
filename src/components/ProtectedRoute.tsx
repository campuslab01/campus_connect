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
  // If not, redirect to the landing page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/landing" replace />;
};

export default ProtectedRoute;
