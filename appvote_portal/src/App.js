import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { SupabaseProvider } from './services/SupabaseContext';
import { AppStateProvider } from './state/appContext';
import { Button, Card, Input, Modal } from './components/ui';
import { Navbar, Footer } from './components/layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';

// AppWrapper component to wrap the app with Navbar
const AppWrapper = () => {
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPassword, setDemoPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <div className="container">
              <div className="hero">
                <div className="subtitle">App Submission & Voting Platform</div>
                
                <h1 className="title">AppVote Portal</h1>
                
                <div className="description">
                  Submit your app, participate in contests, and vote for your favorites!
                  <br />
                  <small>Backend powered by Supabase</small>
                </div>
                
                <Button size="large" as={Link} to="/submit-app">Submit Your App</Button>
                
                {/* UI Components Showcase */}
                <div style={{ marginTop: '80px', textAlign: 'left', width: '100%' }}>
                  <h2>UI Components</h2>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                    <Card 
                      title="Button Variants" 
                      style={{ flex: '1 1 300px' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button>Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="outline">Outline Button</Button>
                        <Button variant="text">Text Button</Button>
                        <Button disabled>Disabled Button</Button>
                      </div>
                    </Card>
                    
                    <Card 
                      title="Input Component" 
                      style={{ flex: '1 1 300px' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Input 
                          id="demo-email" 
                          name="email" 
                          label="Email" 
                          type="email" 
                          placeholder="Enter your email"
                          value={demoEmail}
                          onChange={(e) => setDemoEmail(e.target.value)}
                          required
                        />
                        <Input 
                          id="demo-password" 
                          name="password" 
                          label="Password" 
                          type="password" 
                          placeholder="Enter your password"
                          value={demoPassword}
                          onChange={(e) => setDemoPassword(e.target.value)}
                          helperText="Password must be at least 8 characters"
                          required
                        />
                        <Input 
                          id="disabled-input" 
                          name="disabled" 
                          label="Disabled Input" 
                          disabled
                          value="Cannot edit this"
                        />
                        <Input 
                          id="error-input" 
                          name="error" 
                          label="Error Input" 
                          error="This field has an error"
                        />
                      </div>
                    </Card>
                  </div>
                  
                  <div style={{ marginTop: '20px' }}>
                    <Card 
                      title="Card Component"
                      subtitle="This is a card component"
                      footer={
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <Button variant="secondary">Cancel</Button>
                          <Button>Save</Button>
                        </div>
                      }
                    >
                      <p>This is a card with a title, content, and footer.</p>
                      <p>Cards can be used to group related content and actions.</p>
                    </Card>
                  </div>
                  
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                  </div>
                </div>
              </div>
            </div>
          } />
          
          {/* Protected route example - can only access when authenticated */}
          <Route 
            path="/submit-app" 
            element={
              <ProtectedRoute>
                <div className="container" style={{ paddingTop: '100px' }}>
                  <Card title="Submit Your App">
                    <p>This is a protected route accessible only to authenticated users.</p>
                    <p>Here you would implement the app submission form.</p>
                  </Card>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Additional routes will be added here */}
        </Routes>
      </main>
      
      {/* Modal for demo purposes */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modal Example"
        size="small"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Confirm</Button>
          </div>
        }
      >
        <p>This is a simple modal dialog example.</p>
        <p>You can customize its content, size, and footer actions.</p>
      </Modal>
    </div>
  );
};

function App() {
  return (
    <SupabaseProvider>
      <AppStateProvider>
        <Router>
          <AppWrapper />
        </Router>
      </AppStateProvider>
    </SupabaseProvider>
  );
}

export default App;
