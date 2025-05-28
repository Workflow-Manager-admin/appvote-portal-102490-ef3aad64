import React, { useState, useEffect } from 'react';
import { Button, Input } from '../ui';
import { useAuth } from '../../state/appContext';

/**
 * PUBLIC_INTERFACE
 * LoginForm component - Renders a login form with email and password inputs
 * 
 * @returns {JSX.Element} Rendered login form
 */
const LoginForm = () => {
  const { state, send } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  
  // Error from auth state machine
  const authError = state.context.error;
  const isLoggingIn = state.matches('unauthenticated.loggingIn');
  
  // Reset form errors when starting a new login attempt
  useEffect(() => {
    if (isLoggingIn) {
      setFormErrors({
        email: '',
        password: '',
      });
    }
  }, [isLoggingIn]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    
    if (Object.values(errors).some(error => error !== '')) {
      setFormErrors(errors);
      return;
    }
    
    // Dispatch login action to state machine
    send({
      type: 'LOGIN',
      email,
      password,
    });
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
    };
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };
  
  // Reset login error when form changes
  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
    
    if (authError) {
      send({ type: 'RESET' }); // Reset auth error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <Input
          id="login-email"
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={formErrors.email}
          required
        />
        
        <Input
          id="login-password"
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={formErrors.password}
          required
        />
      </div>
      
      {authError && (
        <div 
          style={{ 
            color: 'var(--error-color, #F44336)', 
            marginBottom: '16px',
            fontSize: '14px'
          }}
        >
          {authError.message || 'Login failed. Please try again.'}
        </div>
      )}
      
      <Button 
        type="submit"
        fullWidth
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
