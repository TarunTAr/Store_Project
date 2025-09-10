import { HTTP_STATUS, ERROR_MESSAGES, API_CONFIG, TIME_CONSTANTS } from './constants';

// API Response Types
export const API_RESPONSE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
  IDLE: 'idle',
};

// Request/Response Interceptor Manager
export class InterceptorManager {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  // Add error interceptor
  addErrorInterceptor(interceptor) {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.errorInterceptors.splice(index, 1);
      }
    };
  }

  // Apply request interceptors
  async applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      try {
        modifiedConfig = await interceptor(modifiedConfig);
      } catch (error) {
        console.error('Request interceptor error:', error);
      }
    }
    
    return modifiedConfig;
  }

  // Apply response interceptors
  async applyResponseInterceptors(response) {
    let modifiedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      try {
        modifiedResponse = await interceptor(modifiedResponse);
      } catch (error) {
        console.error('Response interceptor error:', error);
      }
    }
    
    return modifiedResponse;
  }

  // Apply error interceptors
  async applyErrorInterceptors(error) {
    let modifiedError = error;
    
    for (const interceptor of this.errorInterceptors) {
      try {
        modifiedError = await interceptor(modifiedError);
      } catch (interceptorError) {
        console.error('Error interceptor error:', interceptorError);
      }
    }
    
    return modifiedError;
  }
}

// API Error Handler
export class ApiError extends Error {
  constructor(message, status = 0, code = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  // Check if error is network related
  isNetworkError() {
    return this.status === 0 || this.code === 'NETWORK_ERROR';
  }

  // Check if error is authentication related
  isAuthError() {
    return this.status === HTTP_STATUS.UNAUTHORIZED || this.status === HTTP_STATUS.FORBIDDEN;
  }

  // Check if error is client related (4xx)
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  // Check if error is server related (5xx)
  isServerError() {
    return this.status >= 500 && this.status < 600;
  }

  // Get user-friendly error message
  getUserMessage() {
    const statusMessages = {
      [HTTP_STATUS.BAD_REQUEST]: 'Invalid request. Please check your input.',
      [HTTP_STATUS.UNAUTHORIZED]: ERROR_MESSAGES.UNAUTHORIZED,
      [HTTP_STATUS.FORBIDDEN]: ERROR_MESSAGES.FORBIDDEN,
      [HTTP_STATUS.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
      [HTTP_STATUS.CONFLICT]: 'This action conflicts with existing data.',
      [HTTP_STATUS.UNPROCESSABLE_ENTITY]: ERROR_MESSAGES.VALIDATION_ERROR,
      [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_MESSAGES.INTERNAL_ERROR,
      [HTTP_STATUS.BAD_GATEWAY]: 'Service temporarily unavailable.',
      [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable.',
      [HTTP_STATUS.GATEWAY_TIMEOUT]: 'Request timeout. Please try again.',
    };

    return statusMessages[this.status] || this.message || ERROR_MESSAGES.GENERIC_ERROR;
  }
}

// Response normalizer
export const normalizeApiResponse = (response) => {
  const normalized = {
    success: true,
    data: null,
    message: '',
    errors: [],
    status: response.status || 200,
    timestamp: new Date().toISOString(),
  };

  if (response.data) {
    // Handle different response structures
    if (response.data.success !== undefined) {
      normalized.success = response.data.success;
      normalized.data = response.data.data || response.data;
      normalized.message = response.data.message || '';
      normalized.errors = response.data.errors || [];
    } else {
      normalized.data = response.data;
    }
  }

  return normalized;
};

// Error normalizer
export const normalizeApiError = (error) => {
  let apiError;

  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || data?.error || ERROR_MESSAGES.GENERIC_ERROR;
    const code = data?.code || null;
    const details = data?.details || data?.errors || null;

    apiError = new ApiError(message, status, code, details);
  } else if (error.request) {
    // Network error
    apiError = new ApiError(
      ERROR_MESSAGES.NETWORK_ERROR,
      0,
      'NETWORK_ERROR',
      { originalError: error.message }
    );
  } else {
    // Other error
    apiError = new ApiError(
      error.message || ERROR_MESSAGES.GENERIC_ERROR,
      0,
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }

  return apiError;
};

// Request builder
export const buildApiRequest = (endpoint, options = {}) => {
  const {
    method = 'GET',
    data = null,
    params = {},
    headers = {},
    timeout = API_CONFIG.TIMEOUT,
    baseURL = API_CONFIG.BASE_URL,
    ...otherOptions
  } = options;

  const config = {
    url: endpoint,
    method: method.toUpperCase(),
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...otherOptions,
  };

  // Add query parameters
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      config.url += (config.url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Add request body
  if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
    if (data instanceof FormData) {
      config.data = data;
      delete config.headers['Content-Type']; // Let browser set it
    } else {
      config.data = JSON.stringify(data);
    }
  }

  return config;
};

// Request batch manager
export class BatchRequestManager {
  constructor(options = {}) {
    this.batchDelay = options.batchDelay || 50;
    this.maxBatchSize = options.maxBatchSize || 10;
    this.pendingRequests = [];
    this.batchTimer = null;
  }

  // Add request to batch
  addRequest(request) {
    return new Promise((resolve, reject) => {
      this.pendingRequests.push({
        request,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      // Start batch timer if not already running
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatch();
        }, this.batchDelay);
      }

      // Process immediately if batch is full
      if (this.pendingRequests.length >= this.maxBatchSize) {
        clearTimeout(this.batchTimer);
        this.processBatch();
      }
    });
  }

  // Process current batch
  async processBatch() {
    if (this.pendingRequests.length === 0) return;

    const batch = this.pendingRequests.splice(0);
    this.batchTimer = null;

    const promises = batch.map(async ({ request, resolve, reject }) => {
      try {
        const response = await request();
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

    await Promise.allSettled(promises);
  }

  // Clear pending requests
  clear() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    // Reject all pending requests
    this.pendingRequests.forEach(({ reject }) => {
      reject(new ApiError('Batch cleared', 0, 'BATCH_CLEARED'));
    });
    
    this.pendingRequests = [];
  }
}

// Rate limiter
export class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 10;
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.requests = new Map();
  }

  // Check if request is allowed
  isAllowed(key = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const requestTimes = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = requestTimes.filter(time => time > windowStart);
    this.requests.set(key, validRequests);

    // Check if we're under the limit
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...validRequests);
      const resetTime = oldestRequest + this.windowMs;
      return {
        allowed: false,
        resetTime,
        remaining: 0,
        limit: this.maxRequests,
      };
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return {
      allowed: true,
      resetTime: now + this.windowMs,
      remaining: this.maxRequests - validRequests.length,
      limit: this.maxRequests,
    };
  }

  // Get current status
  getStatus(key = 'default') {
    const { allowed, resetTime, remaining, limit } = this.isAllowed(key);
    return { allowed, resetTime, remaining, limit };
  }

  // Reset rate limit for key
  reset(key = 'default') {
    this.requests.delete(key);
  }

  // Clear all rate limits
  clearAll() {
    this.requests.clear();
  }
}

// Network status detector
export class NetworkStatusDetector {
  constructor() {
    this.online = navigator.onLine;
    this.listeners = new Set();
    this.connectionQuality = 'unknown';
    this.lastCheck = null;

    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
    }

    // Check connection quality
    this.checkConnectionQuality();
  }

  handleOnline() {
    this.online = true;
    this.lastCheck = Date.now();
    this.notifyListeners({ online: true, quality: this.connectionQuality });
  }

  handleOffline() {
    this.online = false;
    this.connectionQuality = 'offline';
    this.lastCheck = Date.now();
    this.notifyListeners({ online: false, quality: 'offline' });
  }

  async checkConnectionQuality() {
    if (!this.online) return;

    try {
      const start = performance.now();
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-store',
      });
      const end = performance.now();
      const latency = end - start;

      if (response.ok) {
        if (latency < 100) {
          this.connectionQuality = 'excellent';
        } else if (latency < 300) {
          this.connectionQuality = 'good';
        } else if (latency < 1000) {
          this.connectionQuality = 'fair';
        } else {
          this.connectionQuality = 'poor';
        }
      } else {
        this.connectionQuality = 'poor';
      }
    } catch (error) {
      this.connectionQuality = 'poor';
    }

    this.lastCheck = Date.now();
    this.notifyListeners({ online: this.online, quality: this.connectionQuality });
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(status) {
    this.listeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Network status listener error:', error);
      }
    });
  }

  getStatus() {
    return {
      online: this.online,
      quality: this.connectionQuality,
      lastCheck: this.lastCheck,
    };
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline.bind(this));
      window.removeEventListener('offline', this.handleOffline.bind(this));
    }
    this.listeners.clear();
  }
}

// API cache manager
export class ApiCacheManager {
  constructor(options = {}) {
    this.defaultTtl = options.defaultTtl || 5 * TIME_CONSTANTS.MINUTE;
    this.maxSize = options.maxSize || 100;
    this.cache = new Map();
    this.timers = new Map();
  }

  // Generate cache key
  generateKey(url, params = {}) {
    const key = `${url}?${JSON.stringify(params)}`;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Set cache entry
  set(key, data, ttl = this.defaultTtl) {
    // Remove expired entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    // Clear existing timer for this key
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store data with timestamp
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  // Get cache entry
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    // Check if entry is still valid
    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  // Delete cache entry
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    
    return this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        this.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    for (const entry of this.cache.values()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize,
    };
  }
}

// Request queue for offline support
export class RequestQueue {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 50;
    this.queue = [];
    this.processing = false;
  }

  // Add request to queue
  enqueue(request) {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // Remove oldest request
    }

    this.queue.push({
      ...request,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    });
  }

  // Process queue
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const results = [];

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      
      try {
        const response = await request.execute();
        results.push({ success: true, request, response });
      } catch (error) {
        results.push({ success: false, request, error });
        
        // Re-queue failed requests (with limit)
        if (!request.retryCount || request.retryCount < 3) {
          request.retryCount = (request.retryCount || 0) + 1;
          this.queue.unshift(request);
          break; // Stop processing on failure
        }
      }
    }

    this.processing = false;
    return results;
  }

  // Get queue status
  getStatus() {
    return {
      length: this.queue.length,
      processing: this.processing,
      maxSize: this.maxSize,
    };
  }

  // Clear queue
  clear() {
    this.queue = [];
    this.processing = false;
  }
}

// Utility functions
export const apiUtils = {
  // Check if response is successful
  isSuccessResponse: (response) => {
    return response && response.status >= 200 && response.status < 300;
  },

  // Extract data from response
  extractData: (response) => {
    if (!response) return null;
    return response.data?.data || response.data || null;
  },

  // Create API request config
  createConfig: buildApiRequest,

  // Normalize responses and errors
  normalizeResponse: normalizeApiResponse,
  normalizeError: normalizeApiError,

  // Retry function with exponential backoff
  retry: async (fn, maxAttempts = 3, baseDelay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },

  // Create abort controller with timeout
  createAbortController: (timeoutMs = 30000) => {
    const controller = new AbortController();
    
    const timeout = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    // Clear timeout if request completes
    const originalSignal = controller.signal;
    controller.signal.addEventListener('abort', () => {
      clearTimeout(timeout);
    });

    return controller;
  },

  // Parse API error for user display
  parseError: (error) => {
    const apiError = normalizeApiError(error);
    return {
      message: apiError.getUserMessage(),
      status: apiError.status,
      code: apiError.code,
      isRetryable: apiError.isNetworkError() || apiError.isServerError(),
    };
  },

  // Create request headers with authentication
  createAuthHeaders: (token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  },
};

// Global instances
export const interceptorManager = new InterceptorManager();
export const batchRequestManager = new BatchRequestManager();
export const rateLimiter = new RateLimiter();
export const networkStatusDetector = new NetworkStatusDetector();
export const apiCacheManager = new ApiCacheManager();
export const requestQueue = new RequestQueue();

export default {
  InterceptorManager,
  ApiError,
  BatchRequestManager,
  RateLimiter,
  NetworkStatusDetector,
  ApiCacheManager,
  RequestQueue,
  normalizeApiResponse,
  normalizeApiError,
  buildApiRequest,
  apiUtils,
  interceptorManager,
  batchRequestManager,
  rateLimiter,
  networkStatusDetector,
  apiCacheManager,
  requestQueue,
};
