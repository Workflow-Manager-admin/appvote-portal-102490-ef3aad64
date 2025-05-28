import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/appContext';
import { useSupabase } from '../services/SupabaseContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute component - Protects routes that require authentication and optional role-based access
 * Redirects to login if user is not authenticated
 * Redirects to home if user doesn't have the required role
 * 
 * @param {object} props Component props
 * @param {React.ReactNode} props.children Child components to render if access is allowed
 * @param {string} [props.requiredRole] Optional role required to access this route (e.g., 'admin')
 * @param {string} [props.redirectTo='/'] Path to redirect to if authenticated but not authorized (default: home)
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/' }) => {
  const { state } = useAuth();
  const { userProfile, isAdmin } = useSupabase();
  const location = useLocation();
  
  // Check if the user is authenticated
  const isAuthenticated = state.matches('authenticated');
  const isLoading = state.matches('checking');
  
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
  
  // If a specific role is required, check if user has that role
  if (requiredRole && requiredRole === 'admin') {
    const userIsAdmin = isAdmin();
    if (!userIsAdmin) {
      // User doesn't have required role, redirect to specified path
      return <Navigate to={redirectTo} replace />;
    }
  } else if (requiredRole && userProfile?.role !== requiredRole) {
    // For any other role check
    return <Navigate to={redirectTo} replace />;
  }
  
  // If authenticated and has required role (if any), render the protected content
  return children;
};

export default ProtectedRoute;
