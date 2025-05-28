import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../state/appContext';

/**
 * Register page component - Displays the registration form and handles redirects for authenticated users
 * 
 * @returns {JSX.Element} Rendered register page
 */
const Register = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (state.matches('authenticated')) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  return (
    <div className="container" style={{ paddingTop: '100px', maxWidth: '500px', margin: '0 auto' }}>
      <Card
        title="Create an Account"
        subtitle="Sign up to participate in app contests"
      >
        <RegisterForm />
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: 'var(--primary-main, #1976D2)', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
