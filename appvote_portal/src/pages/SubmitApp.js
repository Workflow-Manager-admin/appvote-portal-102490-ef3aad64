import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { useAuth, useAppMachine } from '../state/appContext';

/**
 * SubmitApp page component - Form for users to submit their app to a contest
 * 
 * @returns {JSX.Element} Rendered submit app form
 */
const SubmitApp = () => {
  const { state: authState } = useAuth();
  const { state: appState, send } = useAppMachine();
  
  // Guard against undefined state
  if (!appState) {
    return (
      <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }
  
  const [appName, setAppName] = useState('');
  const [appLink, setAppLink] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [appImage, setAppImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const isSubmitting = appState.matches('ready.creatingApp');

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAppImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!appName.trim()) {
      errors.appName = 'App name is required';
    }
    
    if (!appLink.trim()) {
      errors.appLink = 'App link is required';
    } else if (!/^https?:\/\//.test(appLink)) {
      errors.appLink = 'App link must be a valid URL starting with http:// or https://';
    }
    
    if (!appDescription.trim()) {
      errors.appDescription = 'App description is required';
    } else if (appDescription.length < 20) {
      errors.appDescription = 'Description must be at least 20 characters';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // In a complete implementation, we would get the active contest ID and submit
    // const activeContestId = '...';
    // send({
    //   type: 'CREATE_APP',
    //   appName,
    //   appLink,
    //   appDescription, 
    //   appImage,
    //   contestId: activeContestId
    // });
    
    // For now, let's just log the data
    console.log('App submission data:', { appName, appLink, appDescription, appImage });
  };

  return (
    <div className="container" style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto' }}>
      <Card
        title="Submit Your App"
        subtitle="Share your app with the community and enter the current contest"
      >
        <form onSubmit={handleSubmit}>
          <Input
            id="app-name"
            name="appName"
            label="App Name"
            placeholder="Enter your app name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            error={formErrors.appName}
            required
          />
          
          <Input
            id="app-link"
            name="appLink"
            label="App Link"
            placeholder="https://yourapp.com"
            value={appLink}
            onChange={(e) => setAppLink(e.target.value)}
            error={formErrors.appLink}
            required
          />
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="app-description" style={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}>
              App Description <span style={{ color: 'var(--status-error, #F44336)' }}>*</span>
            </label>
            <textarea
              id="app-description"
              name="appDescription"
              placeholder="Describe your app (features, purpose, etc.)"
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: formErrors.appDescription 
                  ? '1px solid var(--status-error, #F44336)' 
                  : '1px solid var(--border-main, #D1D5DB)',
                minHeight: '120px',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
            />
            {formErrors.appDescription && (
              <div style={{ fontSize: '0.75rem', color: 'var(--status-error, #F44336)', marginTop: '4px' }}>
                {formErrors.appDescription}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="app-image" style={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}>
              App Screenshot (Optional)
            </label>
            <input
              type="file"
              id="app-image"
              name="appImage"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button 
                variant="secondary"
                onClick={() => document.getElementById('app-image').click()}
                type="button"
              >
                Choose Image
              </Button>
              <span style={{ color: 'var(--text-secondary)' }}>
                {appImage ? appImage.name : 'No image selected'}
              </span>
            </div>
            
            {imagePreview && (
              <div style={{ marginTop: '16px' }}>
                <img 
                  src={imagePreview} 
                  alt="App preview" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)'
                  }}
                />
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit App'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SubmitApp;
