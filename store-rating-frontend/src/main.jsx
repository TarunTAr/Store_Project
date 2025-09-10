// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css'; // correct relative import

// Optional: lightweight startup logging
if (import.meta.env.MODE === 'development') {
  console.log('📦 Starting (main.jsx) - mode:', import.meta.env.MODE);
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element not found! Make sure <div id="root"></div> exists in index.html');
}

const root = createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
