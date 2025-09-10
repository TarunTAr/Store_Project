// ==========================================================================
// WEBSOCKET CONFIGURATION - Store Rating Platform
// Real-time communication setup for live updates and notifications
// ==========================================================================

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'test';

// WebSocket URLs by environment
const WS_URLS = {
  development: process.env.REACT_APP_WS_URL || 'ws://localhost:3001',
  production: process.env.REACT_APP_WS_URL || 'wss://api.storerating.com',
  test: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/test',
};

// Get WebSocket URL for current environment
const getWebSocketUrl = () => {
  if (isTesting) return WS_URLS.test;
  if (isProduction) return WS_URLS.production;
  return WS_URLS.development;
};

// WebSocket Configuration
export const websocketConfig = {
  // Connection settings
  connection: {
    url: getWebSocketUrl(),
    protocols: ['store-rating-v1'],
    
    // Connection options
    options: {
      // Maximum number of connection attempts
      maxRetries: isProduction ? 10 : 5,
      
      // Initial retry delay (ms)
      retryDelay: 1000,
      
      // Maximum retry delay (ms)
      maxRetryDelay: 30000,
      
      // Retry delay multiplier
      retryDelayMultiplier: 1.5,
      
      // Connection timeout (ms)
      connectionTimeout: 10000,
      
      // Enable automatic reconnection
      autoReconnect: true,
      
      // Heartbeat/ping interval (ms)
      heartbeatInterval: 30000,
      
      // Heartbeat timeout (ms)
      heartbeatTimeout: 5000,
    },
  },
  
  // Authentication
  auth: {
    // Enable authentication
    enabled: true,
    
    // Authentication method
    method: 'bearer', // 'bearer', 'query', 'header'
    
    // Token refresh settings
    tokenRefresh: {
      enabled: true,
      refreshBeforeExpiry: 300000, // 5 minutes
      maxRefreshAttempts: 3,
    },
    
    // Authentication timeout
    timeout: 5000,
  },
  
  // Message handling
  messaging: {
    // Message format
    format: 'json', // 'json', 'msgpack', 'protobuf'
    
    // Message compression
    compression: {
      enabled: isProduction,
      algorithm: 'gzip',
      threshold: 1024, // Compress messages larger than 1KB
    },
    
    // Message queuing for offline scenarios
    queue: {
      enabled: true,
      maxSize: 100,
      persistToStorage: true,
      storageKey: 'websocket_message_queue',
    },
    
    // Message acknowledgment
    acknowledgment: {
      enabled: true,
      timeout: 10000, // 10 seconds
      maxRetries: 3,
    },
  },
  
  // Event subscriptions (Challenge specific features)
  subscriptions: {
    // Real-time rating updates
    ratings: {
      enabled: true,
      events: [
        'rating.created',     // New rating submitted
        'rating.updated',     // Rating modified
        'rating.deleted',     // Rating removed
        'rating.moderated',   // Admin moderation
      ],
      rooms: [
        'store:{storeId}',    // Store-specific rating updates
        'user:{userId}',      // User's rating updates
      ],
    },
    
    // Store updates
    stores: {
      enabled: true,
      events: [
        'store.created',      // New store added
        'store.updated',      // Store information changed
        'store.deleted',      // Store removed
        'store.verified',     // Store verification status
      ],
      rooms: [
        'stores.all',         // All store updates
        'store:{storeId}',    // Specific store updates
      ],
    },
    
    // User notifications
    notifications: {
      enabled: true,
      events: [
        'notification.new',   // New notification
        'notification.read',  // Notification marked as read
        'notification.deleted', // Notification removed
      ],
      rooms: [
        'user:{userId}',      // User-specific notifications
        'role:{role}',        // Role-based notifications
      ],
    },
    
    // System events
    system: {
      enabled: true,
      events: [
        'system.maintenance', // Maintenance mode
        'system.alert',       // System alerts
        'system.broadcast',   // Admin broadcasts
      ],
      rooms: [
        'system.global',      // Global system events
      ],
    },
    
    // Dashboard updates
    dashboard: {
      enabled: true,
      events: [
        'dashboard.stats',    // Dashboard statistics update
        'dashboard.activity', // Recent activity updates
      ],
      rooms: [
        'admin.dashboard',    // Admin dashboard
        'owner:{storeId}',    // Store owner dashboard
      ],
    },
  },
  
  // Rate limiting
  rateLimit: {
    enabled: true,
    
    // Messages per time window
    maxMessages: isProduction ? 100 : 1000,
    
    // Time window (ms)
    window: 60000, // 1 minute
    
    // Action when rate limit exceeded
    onExceeded: 'throttle', // 'throttle', 'disconnect', 'ignore'
    
    // Throttle delay when exceeded (ms)
    throttleDelay: 1000,
  },
  
  // Security settings
  security: {
    // Enable message validation
    validateMessages: true,
    
    // Maximum message size (bytes)
    maxMessageSize: 64 * 1024, // 64KB
    
    // Allowed origins
    allowedOrigins: isProduction
      ? [process.env.REACT_APP_DOMAIN]
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    
    // CSRF protection
    csrf: {
      enabled: isProduction,
      token: process.env.REACT_APP_CSRF_TOKEN,
    },
    
    // Message encryption
    encryption: {
      enabled: isProduction,
      algorithm: 'AES-256-GCM',
      keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
  
  // Monitoring and debugging
  monitoring: {
    // Enable connection monitoring
    enabled: true,
    
    // Metrics to track
    metrics: [
      'connection_attempts',
      'successful_connections',
      'disconnections',
      'messages_sent',
      'messages_received',
      'errors',
      'latency',
    ],
    
    // Debug logging
    debug: {
      enabled: isDevelopment || process.env.REACT_APP_WS_DEBUG === 'true',
      logConnections: true,
      logMessages: isDevelopment,
      logErrors: true,
    },
    
    // Performance tracking
    performance: {
      trackLatency: true,
      trackThroughput: true,
      reportInterval: 60000, // 1 minute
    },
  },
  
  // Feature flags
  features: {
    // Enable presence tracking (who's online)
    presence: process.env.REACT_APP_WS_PRESENCE !== 'false',
    
    // Enable typing indicators
    typing: process.env.REACT_APP_WS_TYPING === 'true',
    
    // Enable read receipts
    readReceipts: process.env.REACT_APP_WS_READ_RECEIPTS === 'true',
    
    // Enable message history sync
    messageHistory: process.env.REACT_APP_WS_HISTORY === 'true',
    
    // Enable offline message queueing
    offlineQueue: process.env.REACT_APP_WS_OFFLINE_QUEUE !== 'false',
  },
};

// WebSocket Event Types (Challenge specific)
export const wsEventTypes = {
  // Connection events
  CONNECTION_OPENED: 'connection:opened',
  CONNECTION_CLOSED: 'connection:closed',
  CONNECTION_ERROR: 'connection:error',
  CONNECTION_RETRY: 'connection:retry',
  
  // Authentication events
  AUTH_SUCCESS: 'auth:success',
  AUTH_FAILED: 'auth:failed',
  AUTH_REQUIRED: 'auth:required',
  
  // Rating events (Core feature)
  RATING_CREATED: 'rating:created',
  RATING_UPDATED: 'rating:updated',
  RATING_DELETED: 'rating:deleted',
  RATING_MODERATED: 'rating:moderated',
  
  // Store events
  STORE_CREATED: 'store:created',
  STORE_UPDATED: 'store:updated',
  STORE_DELETED: 'store:deleted',
  STORE_STATS_UPDATED: 'store:stats_updated',
  
  // User events
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  USER_UPDATED: 'user:updated',
  
  // Notification events
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELETED: 'notification:deleted',
  
  // System events
  SYSTEM_BROADCAST: 'system:broadcast',
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_ALERT: 'system:alert',
  
  // Dashboard events
  DASHBOARD_STATS: 'dashboard:stats',
  DASHBOARD_ACTIVITY: 'dashboard:activity',
  
  // Generic events
  MESSAGE: 'message',
  ERROR: 'error',
  HEARTBEAT: 'heartbeat',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
};

// Message Types
export const wsMessageTypes = {
  // System messages
  PING: 'ping',
  PONG: 'pong',
  AUTH: 'auth',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  
  // Data messages
  RATING_UPDATE: 'rating_update',
  STORE_UPDATE: 'store_update',
  NOTIFICATION: 'notification',
  BROADCAST: 'broadcast',
  
  // Control messages
  ACK: 'ack',
  ERROR: 'error',
  RETRY: 'retry',
};

// Room/Channel Configuration
export const wsRooms = {
  // Global rooms
  GLOBAL: 'global',
  SYSTEM: 'system',
  
  // User-specific rooms
  user: (userId) => `user:${userId}`,
  userNotifications: (userId) => `notifications:${userId}`,
  
  // Store-specific rooms
  store: (storeId) => `store:${storeId}`,
  storeRatings: (storeId) => `ratings:${storeId}`,
  storeOwner: (storeId) => `owner:${storeId}`,
  
  // Role-based rooms
  role: (role) => `role:${role}`,
  admins: () => 'role:admin',
  systemAdmins: () => 'role:system_administrator',
  storeOwners: () => 'role:store_owner',
  
  // Dashboard rooms
  adminDashboard: () => 'dashboard:admin',
  ownerDashboard: (storeId) => `dashboard:owner:${storeId}`,
  
  // Category rooms
  category: (categoryId) => `category:${categoryId}`,
  
  // Location-based rooms
  location: (lat, lng, radius = 5) => `location:${lat}:${lng}:${radius}`,
};

// WebSocket Client Configuration
export const wsClientConfig = {
  // Client identification
  clientId: () => `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // User agent
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Store Rating App',
  
  // Connection metadata
  metadata: {
    version: process.env.REACT_APP_VERSION || '1.0.0',
    platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  
  // Presence settings
  presence: {
    enabled: websocketConfig.features.presence,
    status: 'online', // 'online', 'away', 'busy', 'offline'
    updateInterval: 30000, // 30 seconds
  },
};

// Error Codes
export const wsErrorCodes = {
  // Connection errors
  CONNECTION_FAILED: 1000,
  CONNECTION_TIMEOUT: 1001,
  CONNECTION_LOST: 1002,
  
  // Authentication errors
  AUTH_FAILED: 2000,
  AUTH_EXPIRED: 2001,
  AUTH_REQUIRED: 2002,
  
  // Permission errors
  PERMISSION_DENIED: 3000,
  ROOM_ACCESS_DENIED: 3001,
  
  // Rate limiting
  RATE_LIMITED: 4000,
  MESSAGE_TOO_LARGE: 4001,
  
  // Server errors
  SERVER_ERROR: 5000,
  SERVICE_UNAVAILABLE: 5001,
  
  // Client errors
  INVALID_MESSAGE: 6000,
  UNSUPPORTED_FORMAT: 6001,
};

// Error Messages
export const wsErrorMessages = {
  [wsErrorCodes.CONNECTION_FAILED]: 'Failed to connect to server',
  [wsErrorCodes.CONNECTION_TIMEOUT]: 'Connection timeout',
  [wsErrorCodes.CONNECTION_LOST]: 'Connection lost',
  [wsErrorCodes.AUTH_FAILED]: 'Authentication failed',
  [wsErrorCodes.AUTH_EXPIRED]: 'Authentication expired',
  [wsErrorCodes.AUTH_REQUIRED]: 'Authentication required',
  [wsErrorCodes.PERMISSION_DENIED]: 'Permission denied',
  [wsErrorCodes.ROOM_ACCESS_DENIED]: 'Access denied to room',
  [wsErrorCodes.RATE_LIMITED]: 'Rate limit exceeded',
  [wsErrorCodes.MESSAGE_TOO_LARGE]: 'Message too large',
  [wsErrorCodes.SERVER_ERROR]: 'Server error',
  [wsErrorCodes.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [wsErrorCodes.INVALID_MESSAGE]: 'Invalid message format',
  [wsErrorCodes.UNSUPPORTED_FORMAT]: 'Unsupported message format',
};

// WebSocket Utilities
export const wsUtils = {
  // Create message object
  createMessage: (type, data, options = {}) => {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      clientId: wsClientConfig.clientId(),
      ...options,
    };
  },
  
  // Create subscription message
  createSubscription: (rooms, events = []) => {
    return wsUtils.createMessage(wsMessageTypes.SUBSCRIBE, {
      rooms: Array.isArray(rooms) ? rooms : [rooms],
      events: Array.isArray(events) ? events : [events],
    });
  },
  
  // Create unsubscription message
  createUnsubscription: (rooms) => {
    return wsUtils.createMessage(wsMessageTypes.UNSUBSCRIBE, {
      rooms: Array.isArray(rooms) ? rooms : [rooms],
    });
  },
  
  // Validate message format
  validateMessage: (message) => {
    if (typeof message !== 'object' || message === null) {
      return { valid: false, error: 'Message must be an object' };
    }
    
    if (!message.type) {
      return { valid: false, error: 'Message must have a type' };
    }
    
    if (JSON.stringify(message).length > websocketConfig.security.maxMessageSize) {
      return { valid: false, error: 'Message too large' };
    }
    
    return { valid: true };
  },
  
  // Get connection URL with auth token
  getConnectionUrl: (token) => {
    const url = new URL(websocketConfig.connection.url);
    
    if (token && websocketConfig.auth.method === 'query') {
      url.searchParams.set('token', token);
    }
    
    return url.toString();
  },
  
  // Calculate retry delay with exponential backoff
  calculateRetryDelay: (attempt) => {
    const { retryDelay, maxRetryDelay, retryDelayMultiplier } = websocketConfig.connection.options;
    const delay = retryDelay * Math.pow(retryDelayMultiplier, attempt - 1);
    return Math.min(delay, maxRetryDelay);
  },
};

// Default export
export default {
  config: websocketConfig,
  eventTypes: wsEventTypes,
  messageTypes: wsMessageTypes,
  rooms: wsRooms,
  clientConfig: wsClientConfig,
  errorCodes: wsErrorCodes,
  errorMessages: wsErrorMessages,
  utils: wsUtils,
};

// Environment validation
if (isDevelopment) {
  console.log('🔌 WebSocket Configuration:', {
    url: websocketConfig.connection.url,
    auth: websocketConfig.auth.enabled,
    features: websocketConfig.features,
  });
}

// Validate WebSocket support
if (typeof window !== 'undefined' && !window.WebSocket) {
  console.warn('⚠️ WebSocket is not supported in this browser');
}

// Validate required configuration
if (!websocketConfig.connection.url) {
  console.warn('⚠️ WebSocket URL is not configured');
}
