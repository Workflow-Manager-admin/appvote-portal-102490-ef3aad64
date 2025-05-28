import React, { useState, useEffect } from 'react';
import { Button, Input } from '../ui';
import { useAuth } from '../../state/appContext';

/**
 * PUBLIC_INTERFACE
 * RegisterForm component - Renders a registration form with email, username and password inputs
 * 
 * @returns {JSX.Element} Rendered registration form
 */
const RegisterForm = () => {
  const { state, send } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  // Error from auth state machine
  const authError = state.context.error;
  const isRegistering = state.matches('unauthenticated.registering');
  
  // Reset form errors when starting a new registration attempt
  useEffect(() => {
    if (isRegistering) {
      setFormErrors({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [isRegistering]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    
    if (Object.values(errors).some(error => error !== '')) {
      setFormErrors(errors);
      return;
    }
    
    // Dispatch register action to state machine
    send({
      type: 'REGISTER',
      email,
      password,
      username,
    });
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!username) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  // Reset registration error when form changes
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
    
    if (authError) {
      send({ type: 'RESET' }); // Reset auth error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <Input
          id="register-email"
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
          id="register-username"
          name="username"
          label="Username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          error={formErrors.username}
          required
        />
        
        <Input
          id="register-password"
          name="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={formErrors.password}
          helperText="Must be at least 6 characters"
          required
        />
        
        <Input
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={formErrors.confirmPassword}
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
          {authError.message || 'Registration failed. Please try again.'}
        </div>
      )}
      
      <Button 
        type="submit"
        fullWidth
        disabled={isRegistering}
      >
        {isRegistering ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default RegisterForm;
