import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../state/appContext';

/**
 * Login page component - Displays the login form and handles redirects for authenticated users
 * 
 * @returns {JSX.Element} Rendered login page
 */
const Login = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // If user is already authenticated, redirect to the intended page
  useEffect(() => {
    if (state.matches('authenticated')) {
      navigate(from, { replace: true });
    }
  }, [state, navigate, from]);

  return (
    <div className="container" style={{ paddingTop: '100px', maxWidth: '500px', margin: '0 auto' }}>
      <Card
        title="Login to AppVote"
        subtitle="Enter your credentials to access your account"
      >
        <LoginForm />
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: 'var(--primary-main, #1976D2)', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
