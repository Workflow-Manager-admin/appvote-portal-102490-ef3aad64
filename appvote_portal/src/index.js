import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap the entire app in StrictMode to catch potential issues early
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading root...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
