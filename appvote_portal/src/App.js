import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { SupabaseProvider } from './services/SupabaseContext';
import { AppStateProvider } from './state/appContext';
import { Modal } from './components/ui';
import { Navbar, Footer } from './components/layout';
import { ALL_ROUTES } from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import ActorErrorBoundary from './components/ActorErrorBoundary';

// AppWrapper component to wrap the app with Navbar
const AppWrapper = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          {ALL_ROUTES.map((route, index) => (
            <Route 
              key={index}
              path={route.path}
              element={route.element}
              exact={route.exact}
            />
          ))}
        </Routes>
      </main>

      <Footer />
      
      {/* Modal for demo purposes */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modal Example"
        size="small"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn" onClick={() => setShowModal(false)}>Confirm</button>
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
    <ErrorBoundary>
      <Router>
        <SupabaseProvider>
          <ActorErrorBoundary>
            <AppStateProvider>
              <React.Suspense 
                fallback={
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' 
                  }}>
                    <p>Loading application state...</p>
                  </div>
                }
              >
                <AppWrapper />
              </React.Suspense>
            </AppStateProvider>
          </ActorErrorBoundary>
        </SupabaseProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
