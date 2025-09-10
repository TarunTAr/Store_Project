import { TIME_CONSTANTS, DATE_FORMATS, RATING_LABELS } from './constants';

// Date and time formatters
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options = {
    short: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    },
    medium: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    datetime: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  };
  
  try {
    return new Intl.DateTimeFormat('en-US', options[format] || options.short).format(dateObj);
  } catch (error) {
    return dateObj.toLocaleDateString();
  }
};

// Relative time formatter (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;
  
  if (isNaN(dateObj.getTime()) || diffMs < 0) return formatDate(date);
  
  const units = [
    { name: 'year', ms: TIME_CONSTANTS.YEAR },
    { name: 'month', ms: TIME_CONSTANTS.MONTH },
    { name: 'week', ms: TIME_CONSTANTS.WEEK },
    { name: 'day', ms: TIME_CONSTANTS.DAY },
    { name: 'hour', ms: TIME_CONSTANTS.HOUR },
    { name: 'minute', ms: TIME_CONSTANTS.MINUTE },
    { name: 'second', ms: TIME_CONSTANTS.SECOND },
  ];
  
  for (const unit of units) {
    const count = Math.floor(diffMs / unit.ms);
    if (count >= 1) {
      return `${count} ${unit.name}${count !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
};

// Duration formatter
export const formatDuration = (ms, format = 'auto') => {
  if (typeof ms !== 'number' || ms < 0) return '0 seconds';
  
  const units = [
    { name: 'day', ms: TIME_CONSTANTS.DAY },
    { name: 'hour', ms: TIME_CONSTANTS.HOUR },
    { name: 'minute', ms: TIME_CONSTANTS.MINUTE },
    { name: 'second', ms: TIME_CONSTANTS.SECOND },
  ];
  
  if (format === 'short') {
    for (const unit of units) {
      const count = Math.floor(ms / unit.ms);
      if (count >= 1) {
        const remainder = ms % unit.ms;
        const nextUnit = units[units.indexOf(unit) + 1];
        if (nextUnit && remainder >= nextUnit.ms) {
          const nextCount = Math.floor(remainder / nextUnit.ms);
          return `${count}${unit.name.charAt(0)} ${nextCount}${nextUnit.name.charAt(0)}`;
        }
        return `${count}${unit.name.charAt(0)}`;
      }
    }
    return '0s';
  }
  
  const parts = [];
  let remaining = ms;
  
  for (const unit of units) {
    const count = Math.floor(remaining / unit.ms);
    if (count > 0) {
      parts.push(`${count} ${unit.name}${count !== 1 ? 's' : ''}`);
      remaining %= unit.ms;
    }
    if (parts.length >= 2) break; // Show max 2 units
  }
  
  return parts.length > 0 ? parts.join(', ') : '0 seconds';
};

// Number formatters
export const formatNumber = (number, options = {}) => {
  if (typeof number !== 'number' || isNaN(number)) return '0';
  
  const {
    decimals = 0,
    locale = 'en-US',
    style = 'decimal',
    currency = 'USD',
    notation = 'standard',
  } = options;
  
  try {
    return new Intl.NumberFormat(locale, {
      style,
      currency: style === 'currency' ? currency : undefined,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation,
    }).format(number);
  } catch (error) {
    return number.toFixed(decimals);
  }
};

// Currency formatter
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return formatNumber(amount, { style: 'currency', currency, locale, decimals: 2 });
};

// Percentage formatter
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return formatNumber(value, { style: 'percent', decimals });
};

// Compact number formatter (e.g., 1.2K, 1.5M)
export const formatCompactNumber = (number) => {
  return formatNumber(number, { notation: 'compact' });
};

// File size formatter
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (typeof bytes !== 'number' || bytes < 0) return 'Invalid size';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Rating formatters
export const formatRating = (rating, options = {}) => {
  const {
    showLabel = false,
    showStars = false,
    decimals = 1,
  } = options;
  
  if (typeof rating !== 'number' || isNaN(rating)) {
    return showStars ? '☆☆☆☆☆' : '0.0';
  }
  
  const clampedRating = Math.max(0, Math.min(5, rating));
  const formatted = clampedRating.toFixed(decimals);
  
  let result = formatted;
  
  if (showStars) {
    const fullStars = Math.floor(clampedRating);
    const hasHalfStar = clampedRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    result = '★'.repeat(fullStars) + 
             (hasHalfStar ? '½' : '') + 
             '☆'.repeat(emptyStars);
  }
  
  if (showLabel) {
    const roundedRating = Math.round(clampedRating);
    const label = RATING_LABELS[roundedRating] || 'Unrated';
    result += ` (${label})`;
  }
  
  return result;
};

// Star rating display
export const formatStarRating = (rating, maxStars = 5) => {
  if (typeof rating !== 'number' || isNaN(rating)) return '☆'.repeat(maxStars);
  
  const clampedRating = Math.max(0, Math.min(maxStars, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
};

// Rating distribution formatter
export const formatRatingDistribution = (distribution) => {
  if (!distribution || typeof distribution !== 'object') {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
  
  const total = Object.values(distribution).reduce((sum, count) => sum + (count || 0), 0);
  
  return Object.keys(distribution).reduce((result, rating) => {
    const count = distribution[rating] || 0;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    result[rating] = {
      count,
      percentage: Math.round(percentage * 10) / 10,
      stars: formatStarRating(parseInt(rating), 1).repeat(parseInt(rating)),
    };
    
    return result;
  }, {});
};

// Text formatters
export const formatText = (text, options = {}) => {
  if (typeof text !== 'string') return '';
  
  const {
    case: textCase = 'none',
    truncate = null,
    ellipsis = '...',
    stripHtml = false,
  } = options;
  
  let formatted = text;
  
  // Strip HTML tags
  if (stripHtml) {
    formatted = formatted.replace(/<[^>]*>/g, '');
  }
  
  // Apply case transformation
  switch (textCase) {
    case 'upper':
      formatted = formatted.toUpperCase();
      break;
    case 'lower':
      formatted = formatted.toLowerCase();
      break;
    case 'title':
      formatted = formatted.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
      break;
    case 'sentence':
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
      break;
  }
  
  // Truncate text
  if (truncate && formatted.length > truncate) {
    formatted = formatted.substring(0, truncate).trim() + ellipsis;
  }
  
  return formatted;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Title case formatter
export const toTitleCase = (str) => {
  return formatText(str, { case: 'title' });
};

// Truncate text
export const truncate = (text, maxLength = 100, ellipsis = '...') => {
  return formatText(text, { truncate: maxLength, ellipsis });
};

// Address formatter
export const formatAddress = (address) => {
  if (typeof address === 'string') return address.trim();
  if (!address || typeof address !== 'object') return '';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Phone number formatter
export const formatPhoneNumber = (phone, format = 'international') => {
  if (typeof phone !== 'string') return phone;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    // US format
    return format === 'dots' 
      ? `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
      : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  if (digits.length === 11 && digits.startsWith('1')) {
    // US with country code
    const areaCode = digits.slice(1, 4);
    const exchange = digits.slice(4, 7);
    const number = digits.slice(7);
    return `+1 (${areaCode}) ${exchange}-${number}`;
  }
  
  return phone; // Return original if can't format
};

// URL formatter
export const formatUrl = (url) => {
  if (typeof url !== 'string') return '';
  
  let formatted = url.trim();
  
  // Add protocol if missing
  if (formatted && !formatted.match(/^https?:\/\//)) {
    formatted = `https://${formatted}`;
  }
  
  return formatted;
};

// Display URL (remove protocol for display)
export const formatDisplayUrl = (url) => {
  if (typeof url !== 'string') return '';
  
  return url.replace(/^https?:\/\/(www\.)?/, '');
};

// List formatter
export const formatList = (items, options = {}) => {
  if (!Array.isArray(items)) return '';
  
  const {
    conjunction = 'and',
    maxItems = null,
    moreText = 'more',
  } = options;
  
  let displayItems = [...items];
  let hasMore = false;
  
  if (maxItems && items.length > maxItems) {
    displayItems = items.slice(0, maxItems);
    hasMore = true;
  }
  
  if (displayItems.length === 0) return '';
  if (displayItems.length === 1) return displayItems[0];
  if (displayItems.length === 2) return `${displayItems[0]} ${conjunction} ${displayItems[1]}`;
  
  const lastItem = displayItems.pop();
  let result = displayItems.join(', ') + `, ${conjunction} ${lastItem}`;
  
  if (hasMore) {
    const remainingCount = items.length - maxItems;
    result += ` ${conjunction} ${remainingCount} ${moreText}`;
  }
  
  return result;
};

// User role formatter
export const formatUserRole = (role) => {
  const roleLabels = {
    'user': 'Normal User',
    'store_owner': 'Store Owner',
    'admin': 'Admin',
    'system_administrator': 'System Administrator',
  };
  
  return roleLabels[role] || capitalize(role?.replace(/_/g, ' ') || '');
};

// Status formatter
export const formatStatus = (status) => {
  const statusLabels = {
    'active': 'Active',
    'inactive': 'Inactive',
    'pending': 'Pending',
    'suspended': 'Suspended',
    'deleted': 'Deleted',
  };
  
  return statusLabels[status] || capitalize(status || '');
};

// Sort order formatter
export const formatSortOrder = (order) => {
  return order === 'asc' ? 'A-Z' : 'Z-A';
};

// Search highlighting
export const highlightText = (text, searchTerm, className = 'highlight') => {
  if (typeof text !== 'string' || typeof searchTerm !== 'string' || !searchTerm.trim()) {
    return text;
  }
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
};

// Default export with all formatters
export default {
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatFileSize,
  formatRating,
  formatStarRating,
  formatRatingDistribution,
  formatText,
  capitalize,
  toTitleCase,
  truncate,
  formatAddress,
  formatPhoneNumber,
  formatUrl,
  formatDisplayUrl,
  formatList,
  formatUserRole,
  formatStatus,
  formatSortOrder,
  highlightText,
};
