// src/App.jsx
import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

// Contexts (assumed present)
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

// Lightweight components (local)
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorFallback from './components/common/ErrorFallback';
import OfflineIndicator from './components/common/OfflineIndicator';
import UpdatePrompt from './components/common/UpdatePrompt';
import InstallPrompt from './components/common/InstallPrompt';

// Lazy pages (keep as lazy to reduce initial bundle)
/* If any lazy import fails Vite will report it in console — you'll know which page to fix */
const HomePage = React.lazy(() => import('./pages/public/Home'));
const LoginPage = React.lazy(() => import('./pages/public/Login'));
const RegisterPage = React.lazy(() => import('./pages/public/Register'));
const NotFoundPage = React.lazy(() => import('./pages/public/NotFound'));

// Fallback UI used while loading lazy pages
const SuspenseLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>
      <div style={{ width: 36, height: 36, borderRadius: 18, border: '4px solid rgba(0,0,0,0.08)', borderLeftColor: '#6366f1', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
      <p style={{ textAlign: 'center', color: '#475569' }}>Loading…</p>
    </div>
  </div>
);

// Small inline style for spinner animation
const injectSpinnerStyle = () => {
  if (!document.getElementById('app-spinner-style')) {
    const s = document.createElement('style');
    s.id = 'app-spinner-style';
    s.innerHTML = `@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`;
    document.head.appendChild(s);
  }
};

// Global error handler for ErrorBoundary
const GlobalErrorBoundary = ({ children }) => {
  const handleError = useCallback((error, info) => {
    console.error('Global error caught:', error, info);
    // optional: send to analytics
    if (window.gtag) {
      window.gtag('event', 'exception', { description: error.toString(), fatal: false });
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError} onReset={() => window.location.reload()}>
      {children}
    </ErrorBoundary>
  );
};

// Main App component
export default function App() {
  // state to hold the dynamically imported Redux store (if available)
  const [storeBundle, setStoreBundle] = useState(null);
  const [storeLoadError, setStoreLoadError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // attempt to dynamically import the store module (safest: avoid static import-analysis failures)
  useEffect(() => {
    let mounted = true;
    injectSpinnerStyle();

    const loadStore = async () => {
      try {
        // dynamic import so the app can still mount even if ./store has issues
        const mod = await import('./store'); // expects ./store/index.js to export { store, persistor }
        if (!mounted) return;
        const store = mod?.store || mod?.default?.store;
        const persistor = mod?.persistor || mod?.default?.persistor || null;
        if (store) {
          setStoreBundle({ store, persistor });
          if (import.meta.env.MODE === 'development') {
            console.log('✅ Redux store loaded dynamically');
          }
        } else {
          // store didn't export the expected things
          setStoreLoadError(new Error('Store loaded but did not export {store, persistor}'));
          console.warn('Store module did not export store/persistor');
        }
      } catch (err) {
        // gracefully handle store import failure
        console.warn('Could not load ./store dynamically:', err && (err.message || err.toString()));
        setStoreLoadError(err);
      }
    };

    loadStore();

    // online/offline listeners
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      mounted = false;
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Remove index.html loading-screen if present
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => loadingScreen.remove(), 350);
    }
  }, []);

  // Minimal App Shell (the UI that renders whether or not Redux is available)
  const AppShell = (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <GlobalErrorBoundary>
            <div className="App" data-testid="app">
              {!isOnline && <OfflineIndicator />}
              <Suspense fallback={<SuspenseLoader />}>
                <Router>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Router>
              </Suspense>

              {/* PWA helpers (non-blocking) */}
              <UpdatePrompt />
              <InstallPrompt />
            </div>
          </GlobalErrorBoundary>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );

  // If store loaded successfully, render AppShell inside Redux Provider + PersistGate
  if (storeBundle?.store) {
    const { store, persistor } = storeBundle;
    // If persistor exists, use PersistGate; otherwise render provider directly
    if (persistor) {
      return (
        <ReduxProvider store={store}>
          <PersistGate loading={<LoadingSpinner message="Restoring session..." />} persistor={persistor}>
            {AppShell}
          </PersistGate>
        </ReduxProvider>
      );
    }
    return <ReduxProvider store={store}>{AppShell}</ReduxProvider>;
  }

  // If store failed to load, show a non-blocking warning in console and render AppShell (app still functional without Redux)
  if (storeLoadError) {
    // show a small console-level warning, but do not block UI
    if (import.meta.env.MODE === 'development') {
      console.warn('Running without Redux store due to load error:', storeLoadError);
    }
    // still render AppShell (so dev can debug pages and contexts)
    return AppShell;
  }

  // While dynamic import is still in-flight, render AppShell (so mounting occurs immediately)
  return AppShell;
}
