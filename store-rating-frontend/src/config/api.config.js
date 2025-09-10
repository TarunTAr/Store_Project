// ==========================================================================
// API CONFIGURATION - Store Rating Platform
// Comprehensive API setup with environment-based configuration
// ==========================================================================

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'test';

// API Base URLs by environment
const API_BASE_URLS = {
  development: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  production: process.env.REACT_APP_API_BASE_URL || 'https://api.storerating.com/api',
  test: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
};

// WebSocket URLs by environment
const WS_BASE_URLS = {
  development: process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:3001',
  production: process.env.REACT_APP_WS_BASE_URL || 'wss://api.storerating.com',
  test: process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:3001',
};

// Get current environment's API base URL
const getApiBaseUrl = () => {
  if (isTesting) return API_BASE_URLS.test;
  if (isProduction) return API_BASE_URLS.production;
  return API_BASE_URLS.development;
};

// Get current environment's WebSocket URL
const getWsBaseUrl = () => {
  if (isTesting) return WS_BASE_URLS.test;
  if (isProduction) return WS_BASE_URLS.production;
  return WS_BASE_URLS.development;
};

// API Configuration
export const apiConfig = {
  // Base URLs
  baseURL: getApiBaseUrl(),
  wsURL: getWsBaseUrl(),
  
  // Timeout configurations
  timeout: {
    default: 30000,      // 30 seconds
    upload: 120000,      // 2 minutes for file uploads
    longRunning: 300000, // 5 minutes for long operations
  },
  
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,      // Initial delay in ms
    backoffFactor: 2, // Exponential backoff multiplier
    maxDelay: 10000,  // Maximum delay between retries
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },
  
  // Request interceptors
  interceptors: {
    request: {
      // Add authentication token
      auth: true,
      // Add request ID for tracing
      requestId: true,
      // Add timestamp
      timestamp: true,
      // Add user agent
      userAgent: true,
      // Add CSRF token for state-changing operations
      csrf: true,
    },
    response: {
      // Transform response data
      transform: true,
      // Handle errors globally
      errorHandling: true,
      // Log responses in development
      logging: isDevelopment,
    },
  },
  
  // Headers
  headers: {
    common: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    development: {
      'X-Debug-Mode': 'true',
    },
    production: {
      'X-API-Version': process.env.REACT_APP_API_VERSION || 'v1',
    },
  },
  
  // Cache configuration
  cache: {
    enabled: true,
    defaultTTL: 300000, // 5 minutes
    maxSize: 100,       // Maximum cached requests
    storage: 'memory',  // 'memory', 'localStorage', 'sessionStorage'
    keyGenerator: (url, params) => `${url}?${JSON.stringify(params)}`,
  },
  
  // Rate limiting
  rateLimit: {
    enabled: true,
    maxRequests: isProduction ? 1000 : 10000, // Requests per window
    windowMs: 60000, // 1 minute window
    skipSuccessfulRequests: false,
  },
  
  // Security
  security: {
    // HTTPS enforcement in production
    httpsOnly: isProduction,
    // Enable request/response encryption for sensitive data
    encryption: {
      enabled: isProduction,
      algorithm: 'AES-256-GCM',
    },
    // API key configuration
    apiKey: {
      enabled: Boolean(process.env.REACT_APP_API_KEY),
      key: process.env.REACT_APP_API_KEY,
      header: 'X-API-Key',
    },
  },
  
  // Feature flags
  features: {
    // Real-time updates via WebSocket
    realTimeUpdates: process.env.REACT_APP_ENABLE_REAL_TIME !== 'false',
    // File upload support
    fileUpload: process.env.REACT_APP_ENABLE_FILE_UPLOAD !== 'false',
    // Push notifications
    pushNotifications: process.env.REACT_APP_ENABLE_PUSH_NOTIFICATIONS === 'true',
    // Offline support
    offlineSupport: process.env.REACT_APP_ENABLE_OFFLINE === 'true',
    // Analytics tracking
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    // Debug logging
    debugLogging: isDevelopment || process.env.REACT_APP_DEBUG_LOGGING === 'true',
  },
  
  // Environment-specific settings
  environment: {
    current: process.env.NODE_ENV,
    isDevelopment,
    isProduction,
    isTesting,
    version: process.env.REACT_APP_VERSION || '1.0.0',
    buildDate: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
    gitCommit: process.env.REACT_APP_GIT_COMMIT || 'unknown',
  },
};

// API Endpoints Configuration
export const apiEndpoints = {
  // Authentication endpoints (Challenge requirements)
  auth: {
    login: '/auth/login',
    register: '/auth/register',      // Normal users can sign up
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    changePassword: '/auth/change-password', // All users can update password
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
  
  // User management endpoints (Challenge requirements)
  users: {
    list: '/users',                  // System Admin: view all users
    create: '/users',                // System Admin: add new users
    getById: (id) => `/users/${id}`, // System Admin: view user details
    update: (id) => `/users/${id}`,  // Update user info
    delete: (id) => `/users/${id}`,  // System Admin: delete users
    search: '/users/search',         // System Admin: search users
    byRole: (role) => `/users/role/${role}`, // Filter by role
    profile: '/users/profile',       // Get current user profile
    stats: (id) => `/users/${id}/stats`,
    activity: (id) => `/users/${id}/activity`,
  },
  
  // Store management endpoints (Challenge requirements)
  stores: {
    list: '/stores',                 // All users: view stores
    create: '/stores',               // System Admin: add new stores
    getById: (id) => `/stores/${id}`,
    update: (id) => `/stores/${id}`, // System Admin: update store info
    delete: (id) => `/stores/${id}`, // System Admin: delete stores
    search: '/stores/search',        // Normal users: search stores by name/address
    nearby: '/stores/nearby',        // Find stores by location
    popular: '/stores/popular',
    featured: '/stores/featured',
    categories: '/stores/categories',
    images: {
      upload: (id) => `/stores/${id}/images`,
      delete: (id, imageId) => `/stores/${id}/images/${imageId}`,
    },
  },
  
  // Rating management endpoints (Challenge requirements - core feature)
  ratings: {
    list: '/ratings',
    create: '/ratings',              // Normal users: submit rating (1-5)
    getById: (id) => `/ratings/${id}`,
    update: (id) => `/ratings/${id}`, // Normal users: modify their rating
    delete: (id) => `/ratings/${id}`,
    byStore: (storeId) => `/stores/${storeId}/ratings`, // Store owners: view ratings for their store
    byUser: (userId) => `/users/${userId}/ratings`,     // User's submitted ratings
    stats: (storeId) => `/stores/${storeId}/ratings/stats`, // Store owner: average rating
    analytics: (storeId) => `/stores/${storeId}/ratings/analytics`,
    moderate: (id) => `/ratings/${id}/moderate`, // Admin moderation
  },
  
  // Dashboard endpoints (Challenge requirements)
  dashboard: {
    admin: '/dashboard/admin',       // System Admin dashboard: total users, stores, ratings
    storeOwner: (storeId) => `/dashboard/store/${storeId}`, // Store owner dashboard
    user: '/dashboard/user',         // User dashboard
    stats: '/dashboard/stats',
    analytics: '/dashboard/analytics',
  },
  
  // Category management
  categories: {
    list: '/categories',
    create: '/categories',
    getById: (id) => `/categories/${id}`,
    update: (id) => `/categories/${id}`,
    delete: (id) => `/categories/${id}`,
    search: '/categories/search',
    popular: '/categories/popular',
    featured: '/categories/featured',
    hierarchy: '/categories/hierarchy',
    stores: (id) => `/categories/${id}/stores`,
  },
  
  // Notification endpoints
  notifications: {
    list: '/notifications',
    create: '/notifications',
    getById: (id) => `/notifications/${id}`,
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    preferences: '/notifications/preferences',
    subscribe: '/notifications/subscribe',
    unsubscribe: '/notifications/unsubscribe',
    history: '/notifications/history',
    unreadCount: '/notifications/unread-count',
  },
  
  // File upload endpoints
  uploads: {
    image: '/uploads/image',
    document: '/uploads/document',
    avatar: '/uploads/avatar',
    multiple: '/uploads/multiple',
    presigned: '/uploads/presigned-url',
  },
  
  // Analytics endpoints
  analytics: {
    events: '/analytics/events',
    track: '/analytics/track',
    dashboard: '/analytics/dashboard',
    reports: '/analytics/reports',
    export: '/analytics/export',
  },
  
  // System endpoints
  system: {
    health: '/system/health',
    status: '/system/status',
    version: '/system/version',
    metrics: '/system/metrics',
  },
};

// HTTP Status Codes
export const httpStatusCodes = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Error Messages
export const apiErrorMessages = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMITED: 'Too many requests. Please slow down.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Request/Response transformers
export const apiTransformers = {
  request: {
    // Transform request data before sending
    transformData: (data, headers) => {
      // Add common transformations here
      if (headers['Content-Type'] === 'application/json') {
        return JSON.stringify(data);
      }
      return data;
    },
    
    // Add authentication token
    addAuthToken: (config, token) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    
    // Add request metadata
    addMetadata: (config) => {
      config.metadata = {
        timestamp: Date.now(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userAgent: navigator.userAgent,
      };
      return config;
    },
  },
  
  response: {
    // Transform response data
    transformData: (response) => {
      // Handle different response structures
      if (response.data) {
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data,
            message: response.data.message,
            errors: response.data.errors || [],
            meta: response.data.meta || {},
          };
        }
        return response.data;
      }
      return response;
    },
    
    // Handle pagination
    handlePagination: (response) => {
      if (response.data && response.data.pagination) {
        return {
          ...response.data,
          pagination: {
            currentPage: response.data.pagination.currentPage || 1,
            totalPages: response.data.pagination.totalPages || 1,
            totalItems: response.data.pagination.totalItems || 0,
            itemsPerPage: response.data.pagination.itemsPerPage || 20,
            hasNextPage: response.data.pagination.hasNextPage || false,
            hasPreviousPage: response.data.pagination.hasPreviousPage || false,
          },
        };
      }
      return response;
    },
  },
};

// Development helpers
export const devHelpers = {
  // Mock API responses for development
  enableMocking: isDevelopment && process.env.REACT_APP_ENABLE_API_MOCKING === 'true',
  
  // API request logging
  logging: {
    enabled: isDevelopment || process.env.REACT_APP_API_LOGGING === 'true',
    logRequests: true,
    logResponses: true,
    logErrors: true,
    logLevel: process.env.REACT_APP_LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
  },
  
  // Development endpoints
  dev: {
    seed: '/dev/seed',           // Seed database with test data
    reset: '/dev/reset',         // Reset database
    fixtures: '/dev/fixtures',   // Load test fixtures
    status: '/dev/status',       // Development status
  },
};

// Export default configuration
export default {
  ...apiConfig,
  endpoints: apiEndpoints,
  statusCodes: httpStatusCodes,
  errorMessages: apiErrorMessages,
  transformers: apiTransformers,
  devHelpers,
};

// Utility functions
export const createApiUrl = (endpoint, params = {}) => {
  let url = `${apiConfig.baseURL}${endpoint}`;
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });
  
  return url;
};

export const createQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};

// Environment validation
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseURL: apiConfig.baseURL,
    wsURL: apiConfig.wsURL,
    environment: apiConfig.environment.current,
    features: apiConfig.features,
  });
}

// Validate required environment variables in production
if (isProduction) {
  const requiredEnvVars = [
    'REACT_APP_API_BASE_URL',
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  );
  
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
  }
}
