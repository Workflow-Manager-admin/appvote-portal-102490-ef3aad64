import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/appContext';
import { useSupabase } from '../services/SupabaseContext';

/**
 * PUBLIC_INTERFACE
 * AdminRoute component - Protects routes that require admin role
 * Redirects to home if user is not authenticated or not an admin
 * 
 * @param {object} props Component props
 * @param {React.ReactNode} props.children Child components to render if authenticated and admin
 * @returns {JSX.Element} Protected route that redirects non-admin users
 */
const AdminRoute = ({ children }) => {
  const { state } = useAuth();
  const { isAdmin } = useSupabase();
  const location = useLocation();
  
  // Check if the user is authenticated
  const isAuthenticated = state.matches('authenticated');
  const isLoading = state.matches('checking');
  const userIsAdmin = isAdmin();
  
  // If auth is still checking, show a loading state
  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 20px' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated but not admin, redirect to home
  if (!userIsAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and admin, render the protected content
  return children;
};

export default AdminRoute;
