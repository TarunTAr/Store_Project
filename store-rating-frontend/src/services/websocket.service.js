import authService from './auth.service';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.url = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.heartbeatInterval = 30000;
    this.isReconnecting = false;
    this.messageQueue = [];
    this.listeners = new Map();
    this.heartbeatTimer = null;
    this.reconnectTimer = null;

    // Connection state
    this.connectionState = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    };

    // Event types
    this.eventTypes = {
      NEW_RATING: 'new_rating',
      NEW_REVIEW: 'new_review',
      STORE_UPDATE: 'store_update',
      USER_ONLINE: 'user_online',
      USER_OFFLINE: 'user_offline',
      ADMIN_MESSAGE: 'admin_message',
      NOTIFICATION: 'notification',
      TYPING: 'typing',
      STOP_TYPING: 'stop_typing'
    };
  }

  // Connect to WebSocket
  connect() {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        console.warn('WebSocket: User not authenticated');
        return false;
      }

      if (this.socket && this.socket.readyState === this.connectionState.OPEN) {
        console.log('WebSocket: Already connected');
        return true;
      }

      const token = authService.getToken();
      const wsUrl = `${this.url}?token=${encodeURIComponent(token)}&userId=${user.id}&role=${user.role}`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = (event) => {
        console.log('WebSocket: Connected successfully');
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        
        // Send queued messages
        this.flushMessageQueue();
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Emit connection event
        this.emit('connected', { user, timestamp: new Date() });

        // Subscribe to user-specific channels
        this.subscribeToChannels(user);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('WebSocket: Failed to parse message', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket: Connection error', error);
        this.emit('error', { error, timestamp: new Date() });
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket: Connection closed', event.code, event.reason);
        this.stopHeartbeat();
        
        this.emit('disconnected', { 
          code: event.code, 
          reason: event.reason, 
          timestamp: new Date() 
        });

        // Attempt reconnection if not intentional
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnection();
        }
      };

      return true;
    } catch (error) {
      console.error('WebSocket: Failed to connect', error);
      this.emit('error', { error, timestamp: new Date() });
      return false;
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.socket) {
      this.socket.close(1000, 'Client disconnecting');
      this.socket = null;
    }

    this.reconnectAttempts = 0;
    this.isReconnecting = false;
    this.messageQueue = [];

    console.log('WebSocket: Disconnected');
  }

  // Send message
  send(type, data = {}) {
    const message = {
      type,
      data,
      timestamp: Date.now(),
      userId: authService.getCurrentUser()?.id
    };

    if (this.socket && this.socket.readyState === this.connectionState.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
      console.log('WebSocket: Message queued (not connected)');
      return false;
    }
  }

  // Handle incoming messages
  handleMessage(message) {
    const { type, data, userId, timestamp } = message;

    console.log('WebSocket: Received message', { type, data });

    // Handle different message types
    switch (type) {
      case this.eventTypes.NEW_RATING:
        this.handleNewRating(data);
        break;
      case this.eventTypes.NEW_REVIEW:
        this.handleNewReview(data);
        break;
      case this.eventTypes.STORE_UPDATE:
        this.handleStoreUpdate(data);
        break;
      case this.eventTypes.USER_ONLINE:
        this.handleUserOnline(data);
        break;
      case this.eventTypes.USER_OFFLINE:
        this.handleUserOffline(data);
        break;
      case this.eventTypes.ADMIN_MESSAGE:
        this.handleAdminMessage(data);
        break;
      case this.eventTypes.NOTIFICATION:
        this.handleNotification(data);
        break;
      case 'pong':
        // Heartbeat response
        break;
      default:
        console.log('WebSocket: Unknown message type', type);
    }

    // Emit to specific listeners
    this.emit(type, { ...data, userId, timestamp });
    
    // Emit general message event
    this.emit('message', message);
  }

  // Handle new rating
  handleNewRating(data) {
    const { storeId, rating, userName, userId } = data;
    
    // Update UI for store owners
    const currentUser = authService.getCurrentUser();
    if (currentUser?.role === 'store_owner' && data.storeOwnerId === currentUser.id) {
      // Show notification
      this.showNotification({
        title: 'New Rating Received',
        message: `${userName} rated your store ${rating} stars`,
        type: 'success'
      });

      // Emit custom event for UI updates
      window.dispatchEvent(new CustomEvent('store-rating-received', { detail: data }));
    }
  }

  // Handle new review
  handleNewReview(data) {
    const { storeId, userName, review } = data;
    
    const currentUser = authService.getCurrentUser();
    if (currentUser?.role === 'store_owner' && data.storeOwnerId === currentUser.id) {
      this.showNotification({
        title: 'New Review',
        message: `${userName} left a review for your store`,
        type: 'info'
      });

      window.dispatchEvent(new CustomEvent('store-review-received', { detail: data }));
    }
  }

  // Handle store update
  handleStoreUpdate(data) {
    const { storeId, updateType } = data;
    
    // Refresh store data in UI
    window.dispatchEvent(new CustomEvent('store-data-updated', { detail: data }));
  }

  // Handle user online
  handleUserOnline(data) {
    const { userId, userName } = data;
    console.log(`User ${userName} is now online`);
  }

  // Handle user offline
  handleUserOffline(data) {
    const { userId, userName } = data;
    console.log(`User ${userName} is now offline`);
  }

  // Handle admin message
  handleAdminMessage(data) {
    const { message, priority } = data;
    
    this.showNotification({
      title: 'Admin Message',
      message,
      type: priority === 'high' ? 'warning' : 'info',
      persistent: priority === 'high'
    });
  }

  // Handle notification
  handleNotification(data) {
    this.showNotification(data);
  }

  // Show notification (integrate with notification system)
  showNotification(notificationData) {
    // Dispatch custom event for notification system
    window.dispatchEvent(new CustomEvent('websocket-notification', { 
      detail: notificationData 
    }));
  }

  // Subscribe to channels based on user role
  subscribeToChannels(user) {
    const { id: userId, role } = user;

    // Subscribe to user-specific channel
    this.send('subscribe', { channel: `user:${userId}` });

    // Subscribe to role-specific channels
    switch (role) {
      case 'store_owner':
        this.send('subscribe', { channel: 'store_owners' });
        // Subscribe to specific store channels if user owns stores
        break;
      case 'admin':
      case 'system_administrator':
        this.send('subscribe', { channel: 'admins' });
        this.send('subscribe', { channel: 'all_users' });
        break;
      case 'user':
        this.send('subscribe', { channel: 'users' });
        break;
    }

    // Subscribe to general announcements
    this.send('subscribe', { channel: 'announcements' });
  }

  // Subscribe to specific channel
  subscribe(channel) {
    this.send('subscribe', { channel });
  }

  // Unsubscribe from channel
  unsubscribe(channel) {
    this.send('unsubscribe', { channel });
  }

  // Send typing indicator
  sendTyping(recipientId, isTyping = true) {
    this.send(isTyping ? this.eventTypes.TYPING : this.eventTypes.STOP_TYPING, {
      recipientId
    });
  }

  // Join room (for group features)
  joinRoom(roomId) {
    this.send('join_room', { roomId });
  }

  // Leave room
  leaveRoom(roomId) {
    this.send('leave_room', { roomId });
  }

  // Send message to room
  sendToRoom(roomId, messageType, data) {
    this.send('room_message', {
      roomId,
      messageType,
      data
    });
  }

  // Get online users
  getOnlineUsers() {
    this.send('get_online_users');
  }

  // Schedule reconnection
  scheduleReconnection() {
    if (this.isReconnecting) return;

    this.isReconnecting = true;
    this.reconnectAttempts++;

    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`WebSocket: Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Flush queued messages
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.socket.send(JSON.stringify(message));
    }
  }

  // Start heartbeat
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === this.connectionState.OPEN) {
        this.send('ping');
      }
    }, this.heartbeatInterval);
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Add event listener
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);

    // Return unsubscribe function
    return () => this.off(eventType, callback);
  }

  // Remove event listener
  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event to listeners
  emit(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('WebSocket: Error in event callback', error);
        }
      });
    }
  }

  // Get connection state
  getConnectionState() {
    if (!this.socket) return 'DISCONNECTED';
    
    switch (this.socket.readyState) {
      case this.connectionState.CONNECTING:
        return 'CONNECTING';
      case this.connectionState.OPEN:
        return 'CONNECTED';
      case this.connectionState.CLOSING:
        return 'CLOSING';
      case this.connectionState.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  }

  // Check if connected
  isConnected() {
    return this.socket && this.socket.readyState === this.connectionState.OPEN;
  }

  // Get connection stats
  getStats() {
    return {
      connectionState: this.getConnectionState(),
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length,
      listeners: this.listeners.size,
      isReconnecting: this.isReconnecting
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
