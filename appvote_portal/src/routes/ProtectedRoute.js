import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/appContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute component - Protects routes that require authentication
 * Redirects to login if user is not authenticated
 * 
 * @param {object} props Component props
 * @param {React.ReactNode} props.children Child components to render if authenticated
 * @returns {JSX.Element} Protected route that redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
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
  
  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
