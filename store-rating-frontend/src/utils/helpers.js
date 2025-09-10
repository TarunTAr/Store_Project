import { TIME_CONSTANTS, DATE_FORMATS, REGEX_PATTERNS, DEFAULTS } from './constants';

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert to title case
export const toTitleCase = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Generate slug from string
export const generateSlug = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Generate random string
export const generateRandomString = (length = 8, includeNumbers = true, includeSpecialChars = false) => {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) chars += '0123456789';
  if (includeSpecialChars) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate UUID
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Format file size
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Parse query parameters
export const parseQueryParams = (queryString) => {
  const params = {};
  const searchParams = new URLSearchParams(queryString);
  
  for (const [key, value] of searchParams.entries()) {
    // Handle multiple values for the same key
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
};

// Build query string from object
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};

// Check if user has permission
export const hasPermission = (user, requiredRole) => {
  if (!user || !user.role) return false;
  
  const roleHierarchy = {
    'user': 1,
    'store_owner': 2,
    'admin': 3,
    'system_administrator': 4
  };
  
  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

// Calculate average rating
export const calculateAverageRating = (ratings) => {
  if (!Array.isArray(ratings) || ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, rating) => {
    const value = typeof rating === 'object' ? rating.rating : rating;
    return acc + (Number(value) || 0);
  }, 0);
  
  return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
};

// Get rating distribution
export const getRatingDistribution = (ratings) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  if (!Array.isArray(ratings)) return distribution;
  
  ratings.forEach(rating => {
    const value = typeof rating === 'object' ? rating.rating : rating;
    const ratingValue = Number(value);
    if (ratingValue >= 1 && ratingValue <= 5) {
      distribution[ratingValue]++;
    }
  });
  
  return distribution;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
  const R = unit === 'km' ? 6371 : 3959; // Earth's radius in km or miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100;
};

// Sort array of objects
export const sortBy = (array, key, order = 'asc') => {
  if (!Array.isArray(array)) return array;
  
  return [...array].sort((a, b) => {
    let aVal = getNestedValue(a, key);
    let bVal = getNestedValue(b, key);
    
    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === 'asc' ? 1 : -1;
    if (bVal == null) return order === 'asc' ? -1 : 1;
    
    // Convert to comparable values
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (order === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
};

// Get nested object value
export const getNestedValue = (obj, path) => {
  if (typeof path !== 'string') return obj;
  
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Set nested object value
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
  return obj;
};

// Filter array of objects
export const filterBy = (array, filters) => {
  if (!Array.isArray(array) || !filters || typeof filters !== 'object') {
    return array;
  }
  
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value == null || value === '') return true;
      
      const itemValue = getNestedValue(item, key);
      
      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      
      return itemValue === value;
    });
  });
};

// Group array by key
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const value = getNestedValue(item, key);
    const groupKey = value || 'undefined';
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(item);
    return groups;
  }, {});
};

// Check if string matches search query
export const matchesSearch = (text, query) => {
  if (typeof text !== 'string' || typeof query !== 'string') return false;
  if (!query.trim()) return true;
  
  return text.toLowerCase().includes(query.toLowerCase());
};

// Highlight search terms in text
export const highlightSearchTerms = (text, query) => {
  if (typeof text !== 'string' || typeof query !== 'string' || !query.trim()) {
    return text;
  }
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Retry async function
export const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Create delay/sleep function
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if code is running in browser
export const isBrowser = () => typeof window !== 'undefined';

// Check if device is mobile
export const isMobile = () => {
  if (!isBrowser()) return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

// Check if device is tablet
export const isTablet = () => {
  if (!isBrowser()) return false;
  
  return /iPad|Android/i.test(navigator.userAgent) && 
         window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Get device type
export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  if (!isBrowser()) return false;
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        return true;
      } catch (err) {
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (err) {
    return false;
  }
};

// Download file
export const downloadFile = (data, filename, type = 'application/octet-stream') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 0);
};

// Get scroll position
export const getScrollPosition = () => {
  if (!isBrowser()) return { x: 0, y: 0 };
  
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  };
};

// Smooth scroll to element
export const scrollToElement = (element, offset = 0) => {
  if (!isBrowser() || !element) return;
  
  const elementTop = element.offsetTop - offset;
  
  window.scrollTo({
    top: elementTop,
    behavior: 'smooth'
  });
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    if (!isBrowser()) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    if (!isBrowser()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    if (!isBrowser()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    if (!isBrowser()) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

export default {
  debounce,
  throttle,
  deepClone,
  isEmpty,
  capitalize,
  toTitleCase,
  generateSlug,
  generateRandomString,
  generateUUID,
  formatFileSize,
  parseQueryParams,
  buildQueryString,
  hasPermission,
  calculateAverageRating,
  getRatingDistribution,
  calculateDistance,
  sortBy,
  getNestedValue,
  setNestedValue,
  filterBy,
  groupBy,
  matchesSearch,
  highlightSearchTerms,
  retry,
  sleep,
  isBrowser,
  isMobile,
  isTablet,
  getDeviceType,
  copyToClipboard,
  downloadFile,
  getScrollPosition,
  scrollToElement,
  storage,
};
