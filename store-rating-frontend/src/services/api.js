import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// Request/Response interceptors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth and errors
apiClient.interceptors.response.use(
  (response) => {
    // Add response time for monitoring
    if (response.config.metadata) {
      response.config.metadata.endTime = new Date();
      response.config.metadata.duration = 
        response.config.metadata.endTime - response.config.metadata.startTime;
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken
          });

          const { token } = response.data;
          
          // Update stored tokens
          const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
          storage.setItem('auth_token', token);
          
          // Update default headers
          apiClient.defaults.headers.Authorization = `Bearer ${token}`;
          
          processQueue(null, token);
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth data and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user_data');
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// API utility functions
export const api = {
  // HTTP Methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),

  // File upload
  upload: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: config.onUploadProgress,
    });
  },

  // Download file
  download: (url, config = {}) => {
    return apiClient.get(url, {
      ...config,
      responseType: 'blob',
    });
  },

  // Batch requests
  all: (requests) => axios.all(requests),
  spread: (callback) => axios.spread(callback),
};

// Request/Response logging (development only)
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use(request => {
    console.log('🚀 API Request:', {
      method: request.method?.toUpperCase(),
      url: request.url,
      baseURL: request.baseURL,
      headers: request.headers,
      data: request.data
    });
    return request;
  });

  apiClient.interceptors.response.use(
    response => {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        duration: response.config.metadata?.duration,
        data: response.data
      });
      return response;
    },
    error => {
      console.error('❌ API Error:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data
      });
      return Promise.reject(error);
    }
  );
}

// Error handler utility
export const handleApiError = (error) => {
  const errorResponse = {
    success: false,
    message: 'An unexpected error occurred',
    errors: [],
    status: error.response?.status || 0,
    data: null
  };

  if (error.response?.data) {
    const { data } = error.response;
    errorResponse.message = data.message || data.error || errorResponse.message;
    errorResponse.errors = data.errors || [];
    errorResponse.data = data;
  } else if (error.request) {
    errorResponse.message = 'No response from server';
  } else {
    errorResponse.message = error.message;
  }

  return errorResponse;
};

// Success handler utility
export const handleApiSuccess = (response) => {
  return {
    success: true,
    message: response.data?.message || 'Operation completed successfully',
    data: response.data?.data || response.data,
    status: response.status,
    metadata: {
      timestamp: new Date().toISOString(),
      duration: response.config?.metadata?.duration
    }
  };
};

// Cache manager for API responses
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time to live
  }

  set(key, data, ttlMs = 300000) { // Default 5 minutes
    this.cache.set(key, data);
    this.ttl.set(key, Date.now() + ttlMs);
  }

  get(key) {
    if (this.cache.has(key) && this.ttl.get(key) > Date.now()) {
      return this.cache.get(key);
    }
    
    // Clean expired
    this.cache.delete(key);
    this.ttl.delete(key);
    return null;
  }

  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }
}

export const apiCache = new ApiCache();

// Cached API request wrapper
export const cachedRequest = async (cacheKey, requestFn, ttlMs = 300000) => {
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Make request
  try {
    const response = await requestFn();
    const result = handleApiSuccess(response);
    
    // Cache the result
    apiCache.set(cacheKey, result, ttlMs);
    return result;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Rate limiting
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  canMakeRequest(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key).filter(time => time > windowStart);
    
    if (requests.length >= maxRequests) {
      return false;
    }
    
    requests.push(now);
    this.requests.set(key, requests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// API health check
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      healthy: true,
      status: response.data?.status || 'ok',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      healthy: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Export configured axios instance
export default apiClient;
