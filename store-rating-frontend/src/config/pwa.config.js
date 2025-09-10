// ==========================================================================
// PWA CONFIGURATION - Store Rating Platform
// Progressive Web App setup for offline functionality and installability
// ==========================================================================

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// PWA Configuration
export const pwaConfig = {
  // Service Worker settings
  serviceWorker: {
    // Enable service worker
    enabled: process.env.REACT_APP_PWA_ENABLED !== 'false',
    
    // Service worker file path
    swSrc: '/sw.js',
    
    // Service worker scope
    scope: '/',
    
    // Update strategy
    updateStrategy: 'prompt', // 'immediate', 'prompt', 'manual'
    
    // Skip waiting on update
    skipWaiting: false,
    
    // Claim clients immediately
    clientsClaim: true,
    
    // Background sync
    backgroundSync: {
      enabled: true,
      // Sync queue names
      queues: [
        'rating-sync',     // Offline rating submissions
        'profile-sync',    // Profile updates
        'image-sync',      // Image uploads
      ],
    },
    
    // Periodic sync (for background updates)
    periodicSync: {
      enabled: isProduction,
      interval: 24 * 60 * 60 * 1000, // 24 hours
      tags: ['update-ratings', 'sync-profile'],
    },
  },
  
  // Caching strategies
  caching: {
    // Runtime caching
    runtimeCaching: [
      {
        // Cache API responses
        urlPattern: /^https:\/\/api\.storerating\.com\/api\//,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 5 * 60, // 5 minutes
          },
          cacheKeyWillBeUsed: async ({ request }) => {
            // Remove auth headers from cache key
            const url = new URL(request.url);
            return url.href;
          },
        },
      },
      {
        // Cache images
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        // Cache Cloudinary images
        urlPattern: /^https:\/\/res\.cloudinary\.com\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-cache',
          expiration: {
            maxEntries: 300,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        // Cache Google Fonts
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts-stylesheets',
        },
      },
      {
        // Cache Google Fonts files
        urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
    ],
    
    // Precaching
    precaching: {
      // Files to precache
      include: [
        '/static/js/**/*.js',
        '/static/css/**/*.css',
        '/static/media/**/*.{png,jpg,jpeg,svg,gif,webp}',
        '/manifest.json',
        '/favicon.ico',
      ],
      
      // Files to exclude from precaching
      exclude: [
        /\.map$/,
        /asset-manifest\.json$/,
        /LICENSE/,
        /\.htaccess$/,
      ],
      
      // Ignore URL parameters for precaching
      ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    },
    
    // Cache strategies by route
    routes: {
      // App shell (always cache first)
      shell: {
        pattern: '/',
        strategy: 'CacheFirst',
        cacheName: 'app-shell',
      },
      
      // Store listings (stale while revalidate)
      stores: {
        pattern: '/stores',
        strategy: 'StaleWhileRevalidate',
        cacheName: 'stores-cache',
        expiration: 5 * 60, // 5 minutes
      },
      
      // User dashboard (network first)
      dashboard: {
        pattern: '/dashboard',
        strategy: 'NetworkFirst',
        cacheName: 'dashboard-cache',
        networkTimeoutSeconds: 3,
      },
    },
  },
  
  // Offline functionality
  offline: {
    // Enable offline pages
    enabled: true,
    
    // Offline fallback page
    fallbackPage: '/offline.html',
    
    // Offline indicator
    indicator: {
      enabled: true,
      position: 'top', // 'top', 'bottom'
      message: 'You are currently offline. Some features may be limited.',
    },
    
    // Offline data storage
    storage: {
      // IndexedDB settings
      indexedDB: {
        name: 'StoreRatingDB',
        version: 1,
        stores: [
          'ratings',        // Offline rating submissions
          'stores',         // Cached store data
          'user_data',      // User profile and preferences
          'sync_queue',     // Data pending sync
        ],
      },
      
      // Cleanup old data
      cleanup: {
        enabled: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        interval: 24 * 60 * 60 * 1000,    // Check daily
      },
    },
    
    // Sync strategies
    sync: {
      // Immediate sync when back online
      immediate: ['ratings', 'profile_updates'],
      
      // Background sync (when convenient)
      background: ['analytics', 'preferences'],
      
      // Retry configuration
      retry: {
        maxAttempts: 5,
        backoffFactor: 2,
        initialDelay: 1000,
      },
    },
  },
  
  // App installation
  installation: {
    // Enable install prompt
    enabled: true,
    
    // Install prompt criteria
    criteria: {
      // Minimum visits before showing prompt
      minVisits: 3,
      
      // Days between prompts
      promptInterval: 7,
      
      // Minimum time spent on site (minutes)
      minTimeSpent: 5,
      
      // Specific pages to show prompt
      showOnPages: ['/stores', '/dashboard'],
      
      // Don't show on mobile browsers (they handle it automatically)
      hideOnMobile: false,
    },
    
    // Custom install UI
    customPrompt: {
      enabled: true,
      title: 'Install Store Rating App',
      message: 'Get quick access to store ratings and reviews. Works offline!',
      installButton: 'Install',
      cancelButton: 'Maybe Later',
    },
    
    // Installation tracking
    tracking: {
      enabled: true,
      events: {
        promptShown: 'pwa_prompt_shown',
        promptAccepted: 'pwa_prompt_accepted',
        promptDismissed: 'pwa_prompt_dismissed',
        installed: 'pwa_installed',
        uninstalled: 'pwa_uninstalled',
      },
    },
  },
  
  // Push notifications
  pushNotifications: {
    // Enable push notifications
    enabled: process.env.REACT_APP_PUSH_NOTIFICATIONS === 'true',
    
    // VAPID keys (for web push)
    vapidKeys: {
      publicKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
      privateKey: process.env.REACT_APP_VAPID_PRIVATE_KEY, // Server-side only
    },
    
    // Notification settings
    settings: {
      // Default notification options
      defaultOptions: {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        requireInteraction: true,
        renotify: false,
        silent: false,
      },
      
      // Notification types
      types: {
        'new_rating': {
          title: 'New Rating Received',
          icon: '/icons/rating-notification.png',
          tag: 'rating',
        },
        'rating_response': {
          title: 'Rating Response',
          icon: '/icons/response-notification.png',
          tag: 'response',
        },
        'store_update': {
          title: 'Store Update',
          icon: '/icons/store-notification.png',
          tag: 'store',
        },
        'system_message': {
          title: 'System Message',
          icon: '/icons/system-notification.png',
          tag: 'system',
        },
      },
    },
    
    // Subscription management
    subscription: {
      // Auto-subscribe on install
      autoSubscribe: false,
      
      // Subscription endpoint
      endpoint: '/api/notifications/subscribe',
      
      // Subscription options
      options: {
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
      },
    },
  },
  
  // App updates
  updates: {
    // Check for updates interval
    checkInterval: 60 * 60 * 1000, // 1 hour
    
    // Force update threshold
    forceUpdateAfter: 7 * 24 * 60 * 60 * 1000, // 7 days
    
    // Update notification
    notification: {
      enabled: true,
      title: 'App Update Available',
      message: 'A new version of Store Rating is available. Update now?',
      updateButton: 'Update',
      laterButton: 'Later',
    },
    
    // Update strategies
    strategies: {
      // Background update (default)
      background: {
        enabled: true,
        downloadInBackground: true,
        activateAfterPrompt: true,
      },
      
      // Immediate update (critical updates)
      immediate: {
        enabled: true,
        criticalUpdates: ['security', 'data-corruption'],
        forceReload: true,
      },
    },
  },
  
  // Analytics for PWA features
  analytics: {
    enabled: process.env.REACT_APP_PWA_ANALYTICS !== 'false',
    
    // Events to track
    events: {
      serviceWorkerInstalled: 'sw_installed',
      serviceWorkerUpdated: 'sw_updated',
      offlineUsage: 'offline_usage',
      onlineRestored: 'online_restored',
      backgroundSync: 'background_sync',
      pushNotificationReceived: 'push_received',
      pushNotificationClicked: 'push_clicked',
    },
    
    // Performance metrics
    performance: {
      cacheHitRate: true,
      loadTimes: true,
      offlineTime: true,
    },
  },
  
  // Development settings
  development: {
    // Enable detailed logging
    verbose: isDevelopment,
    
    // Show PWA debug info
    showDebugInfo: isDevelopment,
    
    // Mock offline mode
    mockOffline: process.env.REACT_APP_MOCK_OFFLINE === 'true',
    
    // Development service worker
    devServiceWorker: {
      enabled: isDevelopment,
      updateOnReload: true,
      skipWaiting: true,
    },
  },
};

// Manifest Configuration (for manifest.json)
export const manifestConfig = {
  name: 'Store Rating Platform',
  short_name: 'StoreRating',
  description: 'Rate and review stores with our comprehensive platform',
  
  // App identity
  id: '/store-rating-app',
  start_url: '/',
  scope: '/',
  
  // Display settings
  display: 'standalone', // 'fullscreen', 'standalone', 'minimal-ui', 'browser'
  orientation: 'portrait-primary',
  
  // Theme colors
  theme_color: '#4f46e5',
  background_color: '#ffffff',
  
  // Icons
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any'
    }
  ],
  
  // Categories
  categories: ['business', 'shopping', 'lifestyle', 'productivity'],
  
  // Language
  lang: 'en-US',
  dir: 'ltr',
  
  // Related applications
  prefer_related_applications: false,
  related_applications: [
    {
      platform: 'webapp',
      url: 'https://storerating.com/manifest.json'
    }
  ],
  
  // Shortcuts (app shortcuts in supported browsers)
  shortcuts: [
    {
      name: 'Find Stores',
      short_name: 'Stores',
      description: 'Browse and search for stores',
      url: '/stores',
      icons: [
        {
          src: '/icons/shortcut-stores.png',
          sizes: '96x96',
          type: 'image/png'
        }
      ]
    },
    {
      name: 'My Ratings',
      short_name: 'Ratings',
      description: 'View your submitted ratings',
      url: '/profile/ratings',
      icons: [
        {
          src: '/icons/shortcut-ratings.png',
          sizes: '96x96',
          type: 'image/png'
        }
      ]
    },
    {
      name: 'Dashboard',
      short_name: 'Dashboard',
      description: 'Access your dashboard',
      url: '/dashboard',
      icons: [
        {
          src: '/icons/shortcut-dashboard.png',
          sizes: '96x96',
          type: 'image/png'
        }
      ]
    }
  ],
  
  // Screenshots (for app stores)
  screenshots: [
    {
      src: '/screenshots/desktop-1.png',
      sizes: '1280x720',
      type: 'image/png',
      platform: 'wide'
    },
    {
      src: '/screenshots/mobile-1.png',
      sizes: '375x667',
      type: 'image/png',
      platform: 'narrow'
    }
  ],
  
  // Share target (for sharing to the app)
  share_target: {
    action: '/share',
    method: 'POST',
    enctype: 'multipart/form-data',
    params: {
      title: 'title',
      text: 'text',
      url: 'url',
      files: [
        {
          name: 'files',
          accept: ['image/*']
        }
      ]
    }
  },
  
  // File handlers (for opening files with the app)
  file_handlers: [
    {
      action: '/open-csv',
      accept: {
        'text/csv': ['.csv']
      }
    }
  ],
  
  // Protocol handlers
  protocol_handlers: [
    {
      protocol: 'web+storerating',
      url: '/handle?url=%s'
    }
  ],
  
  // Launch handler
  launch_handler: {
    client_mode: ['auto', 'focus-existing', 'navigate-new']
  }
};

// PWA Utility Functions
export const pwaUtils = {
  // Check if running as PWA
  isStandalone: () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  },
  
  // Check if PWA is installable
  canInstall: () => {
    return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
  },
  
  // Check if service worker is supported
  supportsServiceWorker: () => {
    return 'serviceWorker' in navigator;
  },
  
  // Check if push notifications are supported
  supportsPushNotifications: () => {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  },
  
  // Check if background sync is supported
  supportsBackgroundSync: () => {
    return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
  },
  
  // Check if periodic sync is supported
  supportsPeriodicSync: () => {
    return 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype;
  },
  
  // Get installation source
  getInstallationSource: () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || 'unknown';
  },
  
  // Track PWA metrics
  trackMetric: (metric, value, labels = {}) => {
    if (pwaConfig.analytics.enabled && window.gtag) {
      window.gtag('event', metric, {
        custom_parameter_1: value,
        ...labels
      });
    }
  },
};

// PWA Event Handlers
export const pwaEventHandlers = {
  // Handle beforeinstallprompt event
  onBeforeInstallPrompt: (event) => {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    
    // Save the event for later use
    window.deferredPrompt = event;
    
    // Track the event
    pwaUtils.trackMetric('pwa_prompt_available');
    
    // Show custom install UI if enabled
    if (pwaConfig.installation.customPrompt.enabled) {
      // Implement custom install prompt logic here
      console.log('PWA install prompt available');
    }
  },
  
  // Handle app installation
  onAppInstalled: () => {
    // Clear the deferredPrompt
    window.deferredPrompt = null;
    
    // Track installation
    pwaUtils.trackMetric('pwa_installed', {
      source: pwaUtils.getInstallationSource()
    });
    
    console.log('PWA installed successfully');
  },
  
  // Handle service worker updates
  onServiceWorkerUpdate: (registration) => {
    if (pwaConfig.updates.notification.enabled) {
      // Show update notification
      console.log('Service worker update available');
      
      // You can implement a custom update UI here
      if (confirm(pwaConfig.updates.notification.message)) {
        // Skip waiting and reload
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      }
    }
  },
  
  // Handle offline/online status
  onOffline: () => {
    console.log('App went offline');
    pwaUtils.trackMetric('offline_mode_entered');
    
    // Show offline indicator
    if (pwaConfig.offline.indicator.enabled) {
      // Implement offline indicator UI
    }
  },
  
  onOnline: () => {
    console.log('App came back online');
    pwaUtils.trackMetric('online_mode_restored');
    
    // Hide offline indicator and trigger sync
    if (pwaConfig.offline.indicator.enabled) {
      // Hide offline indicator UI
    }
    
    // Trigger background sync
    if (pwaUtils.supportsBackgroundSync()) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('background-sync');
      });
    }
  },
};

// Export default configuration
export default {
  config: pwaConfig,
  manifest: manifestConfig,
  utils: pwaUtils,
  eventHandlers: pwaEventHandlers,
};

// Environment validation
if (isDevelopment) {
  console.log('📱 PWA Configuration:', {
    enabled: pwaConfig.serviceWorker.enabled,
    offline: pwaConfig.offline.enabled,
    pushNotifications: pwaConfig.pushNotifications.enabled,
    installation: pwaConfig.installation.enabled,
  });
}

// Initialize PWA event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', pwaEventHandlers.onBeforeInstallPrompt);
  window.addEventListener('appinstalled', pwaEventHandlers.onAppInstalled);
  window.addEventListener('offline', pwaEventHandlers.onOffline);
  window.addEventListener('online', pwaEventHandlers.onOnline);
}

// Validate required PWA configuration
if (pwaConfig.pushNotifications.enabled && !pwaConfig.pushNotifications.vapidKeys.publicKey) {
  console.warn('⚠️ VAPID public key is required for push notifications');
}
