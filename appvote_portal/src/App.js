import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { SupabaseProvider } from './services/SupabaseContext';
import { AppStateProvider } from './state/appContext';
import { Button, Card, Input, Modal } from './components/ui';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SupabaseProvider>
      <AppStateProvider>
        <Router>
          <div className="app">
            <nav className="navbar">
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div className="logo">
                    <span className="logo-symbol">*</span> AppVote Portal
                  </div>
                  <Button onClick={() => setShowModal(true)}>Login</Button>
                </div>
              </div>
            </nav>

            <main>
              <Routes>
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
                      
                      <Button size="large">Submit Your App</Button>
                      
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
                                id="email" 
                                name="email" 
                                label="Email" 
                                type="email" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                              <Input 
                                id="password" 
                                name="password" 
                                label="Password" 
                                type="password" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                {/* Additional routes will be added here */}
              </Routes>
            </main>
            
            {/* Login Modal */}
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Login"
              size="small"
              footer={
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={() => setShowModal(false)}>Login</Button>
                </div>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input 
                  id="modal-email" 
                  name="email" 
                  label="Email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input 
                  id="modal-password" 
                  name="password" 
                  label="Password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div style={{ textAlign: 'right' }}>
                  <Button variant="text">Forgot password?</Button>
                </div>
              </div>
            </Modal>
          </div>
        </Router>
      </AppStateProvider>
    </SupabaseProvider>
  );
}

export default App;