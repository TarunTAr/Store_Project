import { api, handleApiError, handleApiSuccess } from './api';
import authService from './auth.service';

class PushNotificationService {
  constructor() {
    this.registration = null;
    this.subscription = null;
    this.publicVapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.permission = Notification.permission;
    
    // Notification types
    this.types = {
      NEW_RATING: 'new_rating',
      NEW_REVIEW: 'new_review',
      RATING_RESPONSE: 'rating_response',
      STORE_UPDATE: 'store_update',
      ADMIN_MESSAGE: 'admin_message',
      SYSTEM_ALERT: 'system_alert',
      PROMOTION: 'promotion'
    };

    // Initialize service worker
    this.init();
  }

  // Initialize push notifications
  async init() {
    try {
      if (!this.isSupported) {
        console.warn('Push notifications are not supported');
        return false;
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', this.registration);

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission() {
    try {
      if (!this.isSupported) {
        throw new Error('Push notifications are not supported');
      }

      if (this.permission === 'granted') {
        return true;
      }

      if (this.permission === 'denied') {
        throw new Error('Notification permission denied');
      }

      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === 'granted') {
        // Subscribe user to push notifications
        await this.subscribe();
        return true;
      } else {
        throw new Error(`Notification permission ${permission}`);
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      throw error;
    }
  }

  // Subscribe to push notifications
  async subscribe() {
    try {
      if (!this.registration) {
        await this.init();
      }

      if (!this.publicVapidKey) {
        throw new Error('VAPID public key not configured');
      }

      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription();

      if (!this.subscription) {
        // Create new subscription
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
        });
      }

      // Send subscription to server
      const response = await api.post('/notifications/subscribe', {
        subscription: this.subscription.toJSON(),
        userId: user.id,
        userAgent: navigator.userAgent
      });

      const result = handleApiSuccess(response);
      console.log('Push notification subscription successful');
      
      return result;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw handleApiError(error);
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    try {
      if (!this.subscription) {
        return true;
      }

      const user = authService.getCurrentUser();
      if (user) {
        // Remove subscription from server
        await api.delete('/notifications/unsubscribe', {
          data: { userId: user.id }
        });
      }

      // Unsubscribe from push manager
      const success = await this.subscription.unsubscribe();
      this.subscription = null;

      console.log('Push notification unsubscription successful');
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw handleApiError(error);
    }
  }

  // Send notification (backend trigger)
  async sendNotification(notificationData) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required to send notifications');
      }

      this.validateNotificationData(notificationData);

      const response = await api.post('/notifications/send', notificationData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Send notification to user
  async sendToUser(userId, notificationData) {
    try {
      return await this.sendNotification({
        ...notificationData,
        recipients: [{ type: 'user', id: userId }]
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Send notification to role
  async sendToRole(role, notificationData) {
    try {
      return await this.sendNotification({
        ...notificationData,
        recipients: [{ type: 'role', id: role }]
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Send notification to all users
  async sendToAll(notificationData) {
    try {
      return await this.sendNotification({
        ...notificationData,
        recipients: [{ type: 'all' }]
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Show local notification
  async showLocalNotification(title, options = {}) {
    try {
      if (this.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }

      const notificationOptions = {
        body: options.message || '',
        icon: options.icon || '/icons/icon-192x192.png',
        badge: options.badge || '/icons/badge-72x72.png',
        tag: options.tag || 'default',
        data: options.data || {},
        requireInteraction: options.persistent || false,
        silent: options.silent || false,
        timestamp: Date.now(),
        ...options
      };

      // Add action buttons if provided
      if (options.actions && Array.isArray(options.actions)) {
        notificationOptions.actions = options.actions.map(action => ({
          action: action.id,
          title: action.title,
          icon: action.icon
        }));
      }

      if (this.registration && 'showNotification' in this.registration) {
        // Use service worker notification
        await this.registration.showNotification(title, notificationOptions);
      } else {
        // Fallback to basic notification
        new Notification(title, notificationOptions);
      }

      return true;
    } catch (error) {
      console.error('Failed to show local notification:', error);
      return false;
    }
  }

  // Handle service worker messages
  handleServiceWorkerMessage(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'notification-click':
        this.handleNotificationClick(data);
        break;
      case 'notification-close':
        this.handleNotificationClose(data);
        break;
      case 'notification-action':
        this.handleNotificationAction(data);
        break;
      default:
        console.log('Unknown service worker message:', type);
    }
  }

  // Handle notification click
  handleNotificationClick(data) {
    const { notificationType, storeId, userId, url } = data;

    // Navigate based on notification type
    switch (notificationType) {
      case this.types.NEW_RATING:
      case this.types.NEW_REVIEW:
        if (storeId) {
          window.location.href = `/owner/ratings?storeId=${storeId}`;
        }
        break;
      case this.types.RATING_RESPONSE:
        if (storeId) {
          window.location.href = `/stores/${storeId}`;
        }
        break;
      case this.types.STORE_UPDATE:
        if (storeId) {
          window.location.href = `/owner/my-store`;
        }
        break;
      case this.types.ADMIN_MESSAGE:
        window.location.href = '/admin/messages';
        break;
      default:
        if (url) {
          window.location.href = url;
        }
    }

    // Track notification interaction
    this.trackNotificationInteraction('click', data);
  }

  // Handle notification close
  handleNotificationClose(data) {
    this.trackNotificationInteraction('close', data);
  }

  // Handle notification action
  handleNotificationAction(data) {
    const { action, notificationType } = data;

    switch (action) {
      case 'view':
        this.handleNotificationClick(data);
        break;
      case 'dismiss':
        // Just close notification
        break;
      case 'reply':
        // Open quick reply interface
        this.openQuickReply(data);
        break;
      default:
        console.log('Unknown notification action:', action);
    }

    this.trackNotificationInteraction('action', { ...data, action });
  }

  // Open quick reply interface
  openQuickReply(data) {
    // Implement quick reply functionality
    window.postMessage({
      type: 'open-quick-reply',
      data
    }, window.location.origin);
  }

  // Track notification interaction
  async trackNotificationInteraction(interaction, data) {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      await api.post('/notifications/track', {
        userId: user.id,
        notificationId: data.notificationId,
        interaction,
        timestamp: new Date().toISOString(),
        data
      });
    } catch (error) {
      console.error('Failed to track notification interaction:', error);
    }
  }

  // Get notification preferences
  async getPreferences() {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await api.get('/notifications/preferences');
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update notification preferences
  async updatePreferences(preferences) {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      this.validatePreferences(preferences);

      const response = await api.put('/notifications/preferences', preferences);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get notification history
  async getHistory(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { page = 1, limit = 20, type = '', read = null } = params;

      const response = await api.get('/notifications/history', {
        params: { page, limit, type, read }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await api.patch(`/notifications/${notificationId}/read`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await api.patch('/notifications/read-all');
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get unread count
  async getUnreadCount() {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await api.get('/notifications/unread-count');
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Test notification
  async testNotification() {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      await this.showLocalNotification('Test Notification', {
        message: 'This is a test notification from Store Rating App',
        icon: '/icons/icon-192x192.png',
        tag: 'test',
        data: {
          type: 'test',
          timestamp: Date.now()
        }
      });

      return { success: true, message: 'Test notification sent' };
    } catch (error) {
      throw { success: false, message: error.message };
    }
  }

  // Validate notification data
  validateNotificationData(data) {
    const { title, message, recipients } = data;

    if (!title || title.trim().length === 0) {
      throw new Error('Notification title is required');
    }

    if (!message || message.trim().length === 0) {
      throw new Error('Notification message is required');
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Notification recipients are required');
    }

    recipients.forEach((recipient, index) => {
      if (!recipient.type || !['user', 'role', 'all'].includes(recipient.type)) {
        throw new Error(`Invalid recipient type at index ${index}`);
      }

      if (recipient.type !== 'all' && !recipient.id) {
        throw new Error(`Recipient ID required for type ${recipient.type} at index ${index}`);
      }
    });
  }

  // Validate preferences
  validatePreferences(preferences) {
    const validTypes = Object.values(this.types);
    
    Object.keys(preferences).forEach(type => {
      if (!validTypes.includes(type) && type !== 'global') {
        throw new Error(`Invalid notification type: ${type}`);
      }

      if (typeof preferences[type] !== 'boolean') {
        throw new Error(`Preference for ${type} must be boolean`);
      }
    });
  }

  // Convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Check if notifications are supported
  isNotificationSupported() {
    return this.isSupported;
  }

  // Get current permission status
  getPermissionStatus() {
    return this.permission;
  }

  // Get subscription status
  isSubscribed() {
    return !!this.subscription;
  }

  // Get service worker registration
  getServiceWorkerRegistration() {
    return this.registration;
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
