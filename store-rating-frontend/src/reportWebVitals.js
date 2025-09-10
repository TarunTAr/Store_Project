// src/reportWebVitals.js
// Lightweight web-vitals wrapper for Vite/CRA style projects.
// Export a single default function to avoid duplicate-export problems.

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      try {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      } catch (e) {
        // swallow errors to avoid breaking app init
        // you can log e to monitoring if desired
        // console.warn('web-vitals error', e);
      }
    }).catch((err) => {
      // optional: web-vitals dynamic import failed
      // console.warn('Failed to load web-vitals', err);
    });
  }
};

export default reportWebVitals;
