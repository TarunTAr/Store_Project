// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 300000, // 5 minutes
};

// User Roles (as specified in challenge requirements)
export const USER_ROLES = {
  SYSTEM_ADMINISTRATOR: 'system_administrator',
  ADMIN: 'admin', 
  NORMAL_USER: 'user',
  USER: 'user',
  STORE_OWNER: 'store_owner',
};

// User Role Labels
export const USER_ROLE_LABELS = {
  [USER_ROLES.SYSTEM_ADMINISTRATOR]: 'System Administrator',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.NORMAL_USER]: 'Normal User', 
  [USER_ROLES.USER]: 'Normal User',
  [USER_ROLES.STORE_OWNER]: 'Store Owner',
};

// Form Validation Rules (as per challenge requirements)
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 60,
    REQUIRED: true,
  },
  ADDRESS: {
    MAX_LENGTH: 400,
    REQUIRED: true,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 16,
    REQUIRED: true,
    PATTERN: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/,
    DESCRIPTION: 'Must be 8-16 characters with at least one uppercase letter and one special character',
  },
  EMAIL: {
    REQUIRED: true,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  RATING: {
    MIN: 1,
    MAX: 5,
    REQUIRED: true,
  },
};

// Rating System
export const RATINGS = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
  SCALE: [1, 2, 3, 4, 5],
};

// Rating Labels
export const RATING_LABELS = {
  1: 'Very Poor',
  2: 'Poor', 
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

// Status Types
export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

// Sort Orders
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

// Common Sort Fields
export const SORT_FIELDS = {
  NAME: 'name',
  EMAIL: 'email', 
  ADDRESS: 'address',
  ROLE: 'role',
  RATING: 'rating',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_FILES: 10,
};

// Theme Configuration
export const THEME_CONFIG = {
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
  FONT_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium', 
    LARGE: 'large',
  },
  COLOR_SCHEMES: {
    DEFAULT: 'default',
    OCEAN: 'ocean',
    FOREST: 'forest',
    SUNSET: 'sunset',
    ROSE: 'rose',
    PURPLE: 'purple',
  },
  BREAKPOINTS: {
    XS: 0,
    SM: 600,
    MD: 960,
    LG: 1280,
    XL: 1920,
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_RATING: 'new_rating',
  NEW_REVIEW: 'new_review', 
  RATING_RESPONSE: 'rating_response',
  STORE_UPDATE: 'store_update',
  ADMIN_MESSAGE: 'admin_message',
  SYSTEM_ALERT: 'system_alert',
  PROMOTION: 'promotion',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Notification Severities
export const NOTIFICATION_SEVERITIES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning', 
  INFO: 'info',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME_SETTINGS: 'theme_settings',
  USER_PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  CART_DATA: 'cart_data',
  FORM_DRAFTS: 'form_drafts',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id) => `/users/${id}`,
    BY_ROLE: (role) => `/users/role/${role}`,
    SEARCH: '/users/search',
    BULK: '/users/bulk',
    ACTIVITY: (id) => `/users/${id}/activity`,
    STATS: (id) => `/users/${id}/stats`,
    DASHBOARD: '/users/dashboard',
    ADMIN_DASHBOARD: '/users/admin-dashboard',
  },
  
  // Stores  
  STORES: {
    BASE: '/stores',
    BY_ID: (id) => `/stores/${id}`,
    SEARCH: '/stores/search',
    NEARBY: '/stores/nearby',
    POPULAR: '/stores/popular',
    FEATURED: '/stores/featured',
    CATEGORIES: '/stores/categories',
    RATINGS: (id) => `/stores/${id}/ratings`,
    IMAGES: (id) => `/stores/${id}/images`,
  },
  
  // Ratings
  RATINGS: {
    BASE: '/ratings',
    BY_ID: (id) => `/ratings/${id}`,
    STORE: (storeId) => `/stores/${storeId}/ratings`,
    USER: (userId) => `/users/${userId}/ratings`,
    STATS: (storeId) => `/stores/${storeId}/ratings/stats`,
    ANALYTICS: (storeId) => `/stores/${storeId}/ratings/analytics`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
    SEARCH: '/categories/search',
    POPULAR: '/categories/popular',
    FEATURED: '/categories/featured',
    HIERARCHY: '/categories/hierarchy',
    STORES: (id) => `/categories/${id}/stores`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    HISTORY: '/notifications/history',
    PREFERENCES: '/notifications/preferences',
    SUBSCRIBE: '/notifications/subscribe',
    UNSUBSCRIBE: '/notifications/unsubscribe',
    SEND: '/notifications/send',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    UNREAD_COUNT: '/notifications/unread-count',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'The requested resource was not found.',
  INTERNAL_ERROR: 'An internal server error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'An unexpected error occurred.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password does not meet security requirements.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  RATING_SUBMITTED: 'Rating submitted successfully!',
  RATING_UPDATED: 'Rating updated successfully!',
  STORE_CREATED: 'Store created successfully!',
  STORE_UPDATED: 'Store updated successfully!',
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
};

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

// Date Formats
export const DATE_FORMATS = {
  SHORT_DATE: 'MM/dd/yyyy',
  LONG_DATE: 'MMMM dd, yyyy',
  SHORT_DATETIME: 'MM/dd/yyyy HH:mm',
  LONG_DATETIME: 'MMMM dd, yyyy HH:mm:ss',
  TIME_ONLY: 'HH:mm',
  ISO_DATE: 'yyyy-MM-dd',
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  POSTAL_CODE: /^\d{5}(-\d{4})?$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
};

// Z-Index Values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  LOADING: 1090,
  MAXIMUM: 9999,
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_PUSH_NOTIFICATIONS: process.env.REACT_APP_ENABLE_PUSH_NOTIFICATIONS === 'true',
  ENABLE_REAL_TIME_UPDATES: process.env.REACT_APP_ENABLE_REAL_TIME_UPDATES === 'true',
  ENABLE_IMAGE_UPLOAD: process.env.REACT_APP_ENABLE_IMAGE_UPLOAD === 'true',
  ENABLE_GEOLOCATION: process.env.REACT_APP_ENABLE_GEOLOCATION === 'true',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
};

// Environment Configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  BUILD_DATE: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
};

// Default Values
export const DEFAULTS = {
  USER_AVATAR: '/images/default-avatar.png',
  STORE_IMAGE: '/images/default-store.png', 
  CATEGORY_ICON: '/images/default-category.png',
  PAGE_SIZE: 20,
  RATING: 0,
  THEME_MODE: 'light',
  LANGUAGE: 'en',
  CURRENCY: 'USD',
  TIMEZONE: 'UTC',
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  LINKEDIN: 'https://linkedin.com',
  GITHUB: 'https://github.com',
};

// Contact Information
export const CONTACT_INFO = {
  SUPPORT_EMAIL: 'support@storerating.com',
  BUSINESS_EMAIL: 'business@storerating.com',
  PHONE: '+1-555-0123',
  ADDRESS: '123 Main St, City, State 12345',
};

// Application Metadata
export const APP_METADATA = {
  NAME: 'Store Rating Platform',
  DESCRIPTION: 'A comprehensive platform for rating and reviewing stores',
  KEYWORDS: ['store', 'rating', 'review', 'business', 'feedback'],
  AUTHOR: 'Store Rating Team',
  URL: process.env.REACT_APP_BASE_URL || 'http://localhost:3000',
};

export default {
  API_CONFIG,
  USER_ROLES,
  USER_ROLE_LABELS,
  VALIDATION_RULES,
  RATINGS,
  RATING_LABELS,
  STATUS_TYPES,
  SORT_ORDERS,
  SORT_FIELDS,
  PAGINATION,
  FILE_UPLOAD,
  THEME_CONFIG,
  NOTIFICATION_TYPES,
  NOTIFICATION_SEVERITIES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TIME_CONSTANTS,
  DATE_FORMATS,
  REGEX_PATTERNS,
  ANIMATION_DURATION,
  Z_INDEX,
  FEATURE_FLAGS,
  ENV_CONFIG,
  DEFAULTS,
  SOCIAL_LINKS,
  CONTACT_INFO,
  APP_METADATA,
};
