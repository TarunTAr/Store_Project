import { useState, useEffect, useCallback, useRef } from 'react';
import useWebSocket from './useWebSocket';
import useAuth from './useAuth';
import { useNotification } from './useNotifications';

const useRealTimeUpdates = (options = {}) => {
  const {
    endpoint = '/api/websocket',
    autoConnect = true,
    subscriptions = [],
    onUpdate,
    onConnect,
    onDisconnect,
    onError,
    showNotifications = true,
    notificationTypes = ['rating', 'review', 'store'],
    enableSound = false,
    soundUrl = '/sounds/notification.mp3'
  } = options;

  const { user, isAuthenticated } = useAuth();
  const notification = useNotification();
  
  const [updates, setUpdates] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateCounts, setUpdateCounts] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const audioRef = useRef(null);
  const updateQueueRef = useRef([]);
  const processedUpdatesRef = useRef(new Set());

  // Initialize audio for notifications
  useEffect(() => {
    if (enableSound && soundUrl) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.preload = 'auto';
    }
  }, [enableSound, soundUrl]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // WebSocket connection
  const websocket = useWebSocket(endpoint, {
    autoConnect: autoConnect && isAuthenticated,
    onConnect: () => {
      setReconnectAttempts(0);
      
      // Subscribe to channels
      subscriptions.forEach(subscription => {
        subscribe(subscription);
      });
      
      onConnect?.();
    },
    onDisconnect: () => {
      onDisconnect?.();
    },
    onError: (error) => {
      setReconnectAttempts(prev => prev + 1);
      onError?.(error);
    },
    onMessage: handleWebSocketMessage
  });

  // Handle incoming WebSocket messages
  function handleWebSocketMessage(message) {
    if (!message || processedUpdatesRef.current.has(message.id)) {
      return; // Skip duplicate messages
    }

    processedUpdatesRef.current.add(message.id);
    
    // Clean up old processed IDs (keep last 1000)
    if (processedUpdatesRef.current.size > 1000) {
      const ids = Array.from(processedUpdatesRef.current);
      ids.slice(0, 500).forEach(id => processedUpdatesRef.current.delete(id));
    }

    const update = {
      id: message.id || Date.now(),
      type: message.type,
      data: message.data,
      timestamp: message.timestamp || Date.now(),
      userId: message.userId,
      storeId: message.storeId,
      processed: false
    };

    // Add to updates list
    setUpdates(prev => [update, ...prev.slice(0, 99)]); // Keep last 100 updates
    setLastUpdate(update);
    
    // Update counters
    setUpdateCounts(prev => ({
      ...prev,
      [update.type]: (prev[update.type] || 0) + 1,
      total: (prev.total || 0) + 1
    }));

    // Process update based on type
    processUpdate(update);
  }

  // Process different types of updates
  const processUpdate = useCallback((update) => {
    const { type, data } = update;

    // Show notification if enabled
    if (showNotifications && notificationTypes.includes(type)) {
      showUpdateNotification(update);
    }

    // Play sound if enabled
    if (enableSound && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Handle specific update types
    switch (type) {
      case 'new_rating':
        handleNewRating(data);
        break;
      case 'new_review':
        handleNewReview(data);
        break;
      case 'store_updated':
        handleStoreUpdate(data);
        break;
      case 'user_activity':
        handleUserActivity(data);
        break;
      case 'system_notification':
        handleSystemNotification(data);
        break;
      default:
        break;
    }

    // Call custom update handler
    onUpdate?.(update);

    // Mark as processed
    setUpdates(prev => prev.map(u => 
      u.id === update.id ? { ...u, processed: true } : u
    ));
  }, [showNotifications, notificationTypes, enableSound, onUpdate]);

  // Show notification for update
  const showUpdateNotification = useCallback((update) => {
    const { type, data } = update;
    
    const notificationMap = {
      new_rating: {
        title: 'New Rating Received',
        message: `${data.userName} rated your store ${data.rating} stars`,
        severity: 'success'
      },
      new_review: {
        title: 'New Review',
        message: `${data.userName} left a review for ${data.storeName}`,
        severity: 'info'
      },
      store_updated: {
        title: 'Store Information Updated',
        message: `${data.storeName} has been updated`,
        severity: 'info'
      },
      user_activity: {
        title: 'User Activity',
        message: data.message || 'New user activity detected',
        severity: 'info'
      },
      system_notification: {
        title: data.title || 'System Notification',
        message: data.message,
        severity: data.severity || 'info'
      }
    };

    const notificationConfig = notificationMap[type];
    if (notificationConfig) {
      notification.showCustom({
        ...notificationConfig,
        actions: [{
          label: 'View',
          onClick: () => handleNotificationClick(update)
        }]
      });
    }
  }, [notification]);

  // Handle notification clicks
  const handleNotificationClick = useCallback((update) => {
    const { type, data } = update;
    
    // Navigate based on update type
    switch (type) {
      case 'new_rating':
      case 'new_review':
        if (data.storeId) {
          window.location.href = `/owner/ratings?storeId=${data.storeId}`;
        }
        break;
      case 'store_updated':
        if (data.storeId) {
          window.location.href = `/owner/my-store?storeId=${data.storeId}`;
        }
        break;
      default:
        break;
    }
  }, []);

  // Specific update handlers
  const handleNewRating = useCallback((data) => {
    // Update local store data if applicable
    if (user?.role === 'store_owner' && data.storeId === user.storeId) {
      // Trigger store data refresh
      window.dispatchEvent(new CustomEvent('store-rating-updated', { detail: data }));
    }
  }, [user]);

  const handleNewReview = useCallback((data) => {
    // Similar to rating handler
    if (user?.role === 'store_owner' && data.storeId === user.storeId) {
      window.dispatchEvent(new CustomEvent('store-review-updated', { detail: data }));
    }
  }, [user]);

  const handleStoreUpdate = useCallback((data) => {
    // Refresh store data
    window.dispatchEvent(new CustomEvent('store-data-updated', { detail: data }));
  }, []);

  const handleUserActivity = useCallback((data) => {
    // Handle user activity updates
    console.log('User activity:', data);
  }, []);

  const handleSystemNotification = useCallback((data) => {
    // Handle system-wide notifications
    if (data.broadcast || data.userId === user?.id) {
      notification.showCustom({
        title: data.title,
        message: data.message,
        severity: data.severity || 'info',
        persistent: data.persistent || false
      });
    }
  }, [user, notification]);

  // Subscribe to specific channels
  const subscribe = useCallback((subscription) => {
    if (websocket.isConnected) {
      websocket.sendJsonMessage('subscribe', subscription);
    }
  }, [websocket]);

  // Unsubscribe from channels
  const unsubscribe = useCallback((subscription) => {
    if (websocket.isConnected) {
      websocket.sendJsonMessage('unsubscribe', subscription);
    }
  }, [websocket]);

  // Send real-time update
  const sendUpdate = useCallback((type, data) => {
    if (websocket.isConnected) {
      websocket.sendJsonMessage('update', {
        type,
        data,
        userId: user?.id,
        timestamp: Date.now()
      });
    }
  }, [websocket, user]);

  // Clear processed updates
  const clearUpdates = useCallback(() => {
    setUpdates([]);
    setUpdateCounts({});
    processedUpdatesRef.current.clear();
  }, []);

  // Mark update as read
  const markAsRead = useCallback((updateId) => {
    setUpdates(prev => prev.map(update => 
      update.id === updateId ? { ...update, read: true } : update
    ));
  }, []);

  // Get updates by type
  const getUpdatesByType = useCallback((type) => {
    return updates.filter(update => update.type === type);
  }, [updates]);

  // Get unread updates
  const getUnreadUpdates = useCallback(() => {
    return updates.filter(update => !update.read);
  }, [updates]);

  // Check for specific update patterns
  const hasUpdateType = useCallback((type) => {
    return updates.some(update => update.type === type && !update.read);
  }, [updates]);

  return {
    // Connection state
    isConnected: websocket.isConnected,
    isOnline,
    reconnectAttempts,
    
    // Updates
    updates,
    lastUpdate,
    updateCounts,
    
    // Actions
    subscribe,
    unsubscribe,
    sendUpdate,
    clearUpdates,
    markAsRead,
    
    // WebSocket controls
    connect: websocket.connect,
    disconnect: websocket.disconnect,
    
    // Utilities
    getUpdatesByType,
    getUnreadUpdates,
    hasUpdateType,
    
    // Computed values
    hasUnreadUpdates: getUnreadUpdates().length > 0,
    unreadCount: getUnreadUpdates().length,
    totalUpdates: updates.length,
    
    // Connection info
    connectionStatus: websocket.connectionStatus,
    lastConnectionTime: websocket.lastMessage?.timestamp,
    
    // Update-specific helpers
    hasNewRatings: hasUpdateType('new_rating'),
    hasNewReviews: hasUpdateType('new_review'),
    hasStoreUpdates: hasUpdateType('store_updated'),
    
    // Real-time features for store owners
    newRatingsCount: updateCounts.new_rating || 0,
    newReviewsCount: updateCounts.new_review || 0,
    
    // Activity monitoring
    isActiveUser: updates.some(u => u.timestamp > Date.now() - 300000), // Active in last 5 minutes
    lastActivity: lastUpdate?.timestamp
  };
};

// Hook for store owner real-time dashboard
export const useStoreOwnerUpdates = (storeId) => {
  const realTime = useRealTimeUpdates({
    subscriptions: [
      { channel: 'store_ratings', storeId },
      { channel: 'store_reviews', storeId },
      { channel: 'store_analytics', storeId }
    ],
    notificationTypes: ['new_rating', 'new_review', 'store_analytics'],
    showNotifications: true
  });

  const [storeStats, setStoreStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    newRatingsToday: 0,
    pendingResponses: 0
  });

  // Update store stats when new data arrives
  useEffect(() => {
    const ratingUpdates = realTime.getUpdatesByType('new_rating');
    const reviewUpdates = realTime.getUpdatesByType('new_review');
    
    // Calculate real-time stats
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const newRatingsToday = ratingUpdates.filter(
      update => update.timestamp >= todayStart
    ).length;

    setStoreStats(prev => ({
      ...prev,
      newRatingsToday,
      pendingResponses: reviewUpdates.filter(u => !u.data.responded).length
    }));
  }, [realTime.updates]);

  return {
    ...realTime,
    storeStats,
    newRatingsToday: storeStats.newRatingsToday,
    pendingResponses: storeStats.pendingResponses
  };
};

export default useRealTimeUpdates;
