import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { SupabaseProvider } from './services/SupabaseContext';
import { AppStateProvider } from './state/appContext';

function App() {
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
                  <button className="btn">Login</button>
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
                      
                      <button className="btn btn-large">Submit Your App</button>
                    </div>
                  </div>
                } />
                {/* Additional routes will be added here */}
              </Routes>
            </main>
          </div>
        </Router>
      </AppStateProvider>
    </SupabaseProvider>
  );
}

export default App;