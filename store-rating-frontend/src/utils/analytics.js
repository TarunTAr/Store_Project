import { TIME_CONSTANTS, FEATURE_FLAGS } from './constants';

// Analytics event types
export const EVENT_TYPES = {
  // User actions
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  USER_PROFILE_UPDATE: 'user_profile_update',
  
  // Store actions
  STORE_VIEW: 'store_view',
  STORE_SEARCH: 'store_search',
  STORE_CREATE: 'store_create',
  STORE_UPDATE: 'store_update',
  
  // Rating actions (core challenge requirement)
  RATING_SUBMIT: 'rating_submit',
  RATING_UPDATE: 'rating_update',
  RATING_VIEW: 'rating_view',
  
  // Navigation
  PAGE_VIEW: 'page_view',
  ROUTE_CHANGE: 'route_change',
  
  // UI interactions
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  SEARCH_PERFORM: 'search_perform',
  FILTER_APPLY: 'filter_apply',
  
  // Performance
  PAGE_LOAD: 'page_load',
  API_CALL: 'api_call',
  ERROR_OCCURRED: 'error_occurred',
};

// Analytics data processor
export class AnalyticsProcessor {
  constructor(options = {}) {
    this.enabled = options.enabled !== false && FEATURE_FLAGS.ENABLE_ANALYTICS;
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 30 * TIME_CONSTANTS.SECOND;
    this.maxRetries = options.maxRetries || 3;
    
    this.eventQueue = [];
    this.processingTimer = null;
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.deviceInfo = this.collectDeviceInfo();
    
    // Initialize session tracking
    this.initSession();
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Collect device and browser information
  collectDeviceInfo() {
    if (typeof window === 'undefined') return {};

    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    };
  }

  // Initialize session tracking
  initSession() {
    if (typeof window === 'undefined') return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track(EVENT_TYPES.PAGE_VIEW, { action: 'hidden' });
      } else {
        this.track(EVENT_TYPES.PAGE_VIEW, { action: 'visible' });
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Start processing timer
    this.startProcessing();
  }

  // Set user ID for tracking
  setUserId(userId) {
    this.userId = userId;
  }

  // Set user properties
  setUserProperties(properties) {
    this.userProperties = { ...this.userProperties, ...properties };
  }

  // Track event
  track(eventType, properties = {}, options = {}) {
    if (!this.enabled) return;

    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : null,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        ...this.deviceInfo,
      },
      context: {
        library: 'store-rating-analytics',
        version: '1.0.0',
      },
      options,
    };

    // Add to queue
    this.eventQueue.push(event);

    // Process immediately if high priority
    if (options.immediate) {
      this.flush();
    }
  }

  // Track page view
  trackPageView(page, properties = {}) {
    this.track(EVENT_TYPES.PAGE_VIEW, {
      page,
      title: typeof document !== 'undefined' ? document.title : null,
      ...properties,
    });
  }

  // Track user action
  trackUserAction(action, properties = {}) {
    this.track(action, {
      userId: this.userId,
      ...properties,
    });
  }

  // Track rating submission (core challenge requirement)
  trackRatingSubmission(storeId, rating, properties = {}) {
    this.track(EVENT_TYPES.RATING_SUBMIT, {
      storeId,
      rating,
      userId: this.userId,
      ...properties,
    });
  }

  // Track rating update (core challenge requirement)
  trackRatingUpdate(storeId, oldRating, newRating, properties = {}) {
    this.track(EVENT_TYPES.RATING_UPDATE, {
      storeId,
      oldRating,
      newRating,
      userId: this.userId,
      ...properties,
    });
  }

  // Track store interaction
  trackStoreInteraction(action, storeId, properties = {}) {
    this.track(action, {
      storeId,
      userId: this.userId,
      ...properties,
    });
  }

  // Track search query
  trackSearch(query, filters = {}, resultCount = 0) {
    this.track(EVENT_TYPES.SEARCH_PERFORM, {
      query,
      filters,
      resultCount,
      userId: this.userId,
    });
  }

  // Track error
  trackError(error, context = {}) {
    this.track(EVENT_TYPES.ERROR_OCCURRED, {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      userId: this.userId,
      ...context,
    }, { immediate: true });
  }

  // Track performance metrics
  trackPerformance(metric, value, properties = {}) {
    this.track('performance_metric', {
      metric,
      value,
      ...properties,
    });
  }

  // Track API call performance
  trackApiCall(endpoint, method, duration, status, properties = {}) {
    this.track(EVENT_TYPES.API_CALL, {
      endpoint,
      method,
      duration,
      status,
      userId: this.userId,
      ...properties,
    });
  }

  // Start processing timer
  startProcessing() {
    if (this.processingTimer) return;

    this.processingTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  // Stop processing timer
  stopProcessing() {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }
  }

  // Flush events to server
  async flush() {
    if (this.eventQueue.length === 0) return;

    const events = this.eventQueue.splice(0, this.batchSize);

    try {
      await this.sendEvents(events);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      
      // Re-queue events for retry (up to max retries)
      events.forEach(event => {
        event.retryCount = (event.retryCount || 0) + 1;
        if (event.retryCount <= this.maxRetries) {
          this.eventQueue.unshift(event);
        }
      });
    }
  }

  // Send events to analytics endpoint
  async sendEvents(events) {
    if (!this.enabled || events.length === 0) return;

    const payload = {
      events,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    // In a real app, send to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics events:', payload);
      return;
    }

    // Send to analytics endpoint
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }

  // Get session summary
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.sessionStartTime,
      eventCount: this.eventQueue.length,
      deviceInfo: this.deviceInfo,
    };
  }

  // Clean up
  destroy() {
    this.stopProcessing();
    this.flush();
  }
}

// Rating analytics utilities (core challenge requirements)
export const ratingAnalytics = {
  // Calculate average rating
  calculateAverageRating: (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => {
      const value = typeof rating === 'object' ? rating.rating : rating;
      return total + (Number(value) || 0);
    }, 0);
    
    return Math.round((sum / ratings.length) * 10) / 10;
  },

  // Get rating distribution (for store owner dashboard)
  getRatingDistribution: (ratings) => {
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
  },

  // Calculate rating trends over time
  calculateRatingTrends: (ratings, timeFrame = '7d') => {
    if (!Array.isArray(ratings)) return [];
    
    const now = Date.now();
    const timeFrameMs = {
      '7d': 7 * TIME_CONSTANTS.DAY,
      '30d': 30 * TIME_CONSTANTS.DAY,
      '90d': 90 * TIME_CONSTANTS.DAY,
    }[timeFrame] || 7 * TIME_CONSTANTS.DAY;
    
    const startTime = now - timeFrameMs;
    const filteredRatings = ratings.filter(rating => {
      const ratingTime = new Date(rating.createdAt || rating.timestamp).getTime();
      return ratingTime >= startTime;
    });
    
    // Group by day
    const trends = {};
    filteredRatings.forEach(rating => {
      const day = new Date(rating.createdAt || rating.timestamp).toDateString();
      if (!trends[day]) {
        trends[day] = [];
      }
      trends[day].push(rating.rating || rating);
    });
    
    // Calculate daily averages
    return Object.entries(trends).map(([date, dayRatings]) => ({
      date,
      averageRating: ratingAnalytics.calculateAverageRating(dayRatings),
      ratingCount: dayRatings.length,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // Get rating summary for dashboard (challenge requirement)
  getRatingSummary: (ratings, users = []) => {
    const distribution = ratingAnalytics.getRatingDistribution(ratings);
    const averageRating = ratingAnalytics.calculateAverageRating(ratings);
    const totalRatings = ratings.length;
    
    // Get users who submitted ratings (challenge requirement)
    const ratingsWithUsers = ratings.map(rating => {
      const user = users.find(u => u.id === rating.userId);
      return {
        ...rating,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
        } : null,
      };
    });
    
    return {
      averageRating,
      totalRatings,
      distribution,
      ratingsWithUsers, // For store owner dashboard
      trends: ratingAnalytics.calculateRatingTrends(ratings),
    };
  },
};

// User analytics utilities
export const userAnalytics = {
  // Get user activity summary
  getUserActivitySummary: (events, userId) => {
    const userEvents = events.filter(event => event.properties?.userId === userId);
    
    const activityByType = {};
    userEvents.forEach(event => {
      activityByType[event.type] = (activityByType[event.type] || 0) + 1;
    });
    
    return {
      totalEvents: userEvents.length,
      activityByType,
      firstActivity: userEvents[0]?.properties?.timestamp,
      lastActivity: userEvents[userEvents.length - 1]?.properties?.timestamp,
    };
  },

  // Get user engagement metrics
  getUserEngagement: (events, userId) => {
    const userEvents = events.filter(event => event.properties?.userId === userId);
    
    const sessions = new Set(userEvents.map(e => e.properties?.sessionId)).size;
    const pageViews = userEvents.filter(e => e.type === EVENT_TYPES.PAGE_VIEW).length;
    const ratingsSubmitted = userEvents.filter(e => e.type === EVENT_TYPES.RATING_SUBMIT).length;
    
    return {
      sessions,
      pageViews,
      ratingsSubmitted,
      engagementScore: pageViews + (ratingsSubmitted * 5), // Weight ratings higher
    };
  },
};

// Dashboard analytics (challenge requirements)
export const dashboardAnalytics = {
  // Get admin dashboard data (challenge requirement)
  getAdminDashboardData: (users, stores, ratings) => {
    const totalUsers = users.length;
    const totalStores = stores.length;
    const totalRatings = ratings.length;
    
    // User distribution by role
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    // Recent activity
    const recentActivity = [...ratings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(rating => ({
        type: 'rating',
        ...rating,
      }));
    
    return {
      totalUsers,
      totalStores, 
      totalRatings,
      usersByRole,
      recentActivity,
      averageRating: ratingAnalytics.calculateAverageRating(ratings),
    };
  },

  // Get store owner dashboard data (challenge requirement)
  getStoreOwnerDashboardData: (storeId, ratings, users) => {
    const storeRatings = ratings.filter(rating => rating.storeId === storeId);
    return ratingAnalytics.getRatingSummary(storeRatings, users);
  },
};

// Performance analytics
export const performanceAnalytics = {
  // Track page load performance
  trackPageLoadPerformance: (analytics) => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = window.performance.getEntriesByType('navigation')[0];
    if (navigation) {
      analytics.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.loadEventStart);
      analytics.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.loadEventStart);
      analytics.trackPerformance('first_paint', navigation.responseEnd - navigation.requestStart);
    }
  },

  // Track Core Web Vitals
  trackWebVitals: (analytics) => {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        analytics.trackPerformance('largest_contentful_paint', lastEntry.startTime);
      });
      
      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // Not supported
      }
    }
  },
};

// Global analytics instance
export const analytics = new AnalyticsProcessor();

// Export everything
export default {
  EVENT_TYPES,
  AnalyticsProcessor,
  ratingAnalytics,
  userAnalytics,
  dashboardAnalytics,
  performanceAnalytics,
  analytics,
};
