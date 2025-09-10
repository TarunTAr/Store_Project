import { useState, useEffect, useRef, useCallback } from 'react';
import useAuth from './useAuth';

const useWebSocket = (url, options = {}) => {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    onConnect,
    onDisconnect,
    onError,
    onMessage
  } = options;

  const { getToken, isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const ws = useRef(null);
  const reconnectTimeoutId = useRef(null);
  const heartbeatTimeoutId = useRef(null);
  const reconnectCount = useRef(0);
  const messageQueue = useRef([]);

  // Create WebSocket connection
  const connect = useCallback(() => {
    if (!isAuthenticated || isConnecting || connectionStatus === 'Connected') {
      return;
    }

    setIsConnecting(true);
    
    try {
      const token = getToken();
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setConnectionStatus('Connected');
        setIsConnecting(false);
        reconnectCount.current = 0;
        
        // Send queued messages
        while (messageQueue.current.length > 0) {
          const message = messageQueue.current.shift();
          ws.current.send(JSON.stringify(message));
        }

        // Start heartbeat
        startHeartbeat();
        
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle heartbeat response
          if (data.type === 'pong') {
            return;
          }
          
          setLastMessage(data);
          setMessageHistory(prev => [...prev.slice(-99), data]); // Keep last 100 messages
          
          onMessage?.(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        setConnectionStatus('Disconnected');
        setIsConnecting(false);
        stopHeartbeat();
        
        onDisconnect?.(event);
        
        // Attempt to reconnect if not intentional
        if (!event.wasClean && reconnectCount.current < reconnectAttempts) {
          scheduleReconnect();
        }
      };

      ws.current.onerror = (error) => {
        setConnectionStatus('Error');
        setIsConnecting(false);
        onError?.(error);
      };

    } catch (error) {
      setConnectionStatus('Error');
      setIsConnecting(false);
      onError?.(error);
    }
  }, [url, isAuthenticated, getToken, onConnect, onDisconnect, onError, onMessage, reconnectAttempts, isConnecting, connectionStatus]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current);
      reconnectTimeoutId.current = null;
    }
    
    stopHeartbeat();
    
    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect');
      ws.current = null;
    }
    
    setConnectionStatus('Disconnected');
    reconnectCount.current = 0;
  }, []);

  // Schedule reconnection attempt
  const scheduleReconnect = useCallback(() => {
    if (reconnectCount.current >= reconnectAttempts) {
      setConnectionStatus('Failed');
      return;
    }

    reconnectCount.current++;
    setConnectionStatus('Reconnecting');
    
    reconnectTimeoutId.current = setTimeout(() => {
      connect();
    }, reconnectInterval * Math.pow(1.5, reconnectCount.current - 1)); // Exponential backoff
  }, [connect, reconnectAttempts, reconnectInterval]);

  // Start heartbeat to keep connection alive
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimeoutId.current) {
      clearInterval(heartbeatTimeoutId.current);
    }

    heartbeatTimeoutId.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimeoutId.current) {
      clearInterval(heartbeatTimeoutId.current);
      heartbeatTimeoutId.current = null;
    }
  }, []);

  // Send message
  const sendMessage = useCallback((message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    } else {
      // Queue message for when connection is restored
      messageQueue.current.push(message);
      return false;
    }
  }, []);

  // Send JSON message with type
  const sendJsonMessage = useCallback((type, data = {}) => {
    const message = { type, data, timestamp: Date.now() };
    return sendMessage(message);
  }, [sendMessage]);

  // Subscribe to specific message types
  const subscribe = useCallback((messageType, callback) => {
    const unsubscribe = () => {
      // Remove subscription logic would go here
    };

    // Add subscription logic here
    
    return unsubscribe;
  }, []);

  // Get connection statistics
  const getConnectionStats = useCallback(() => {
    return {
      status: connectionStatus,
      reconnectAttempts: reconnectCount.current,
      messagesReceived: messageHistory.length,
      lastMessageTime: lastMessage?.timestamp,
      isConnected: connectionStatus === 'Connected'
    };
  }, [connectionStatus, messageHistory.length, lastMessage]);

  // Auto-connect when authenticated
  useEffect(() => {
    if (autoConnect && isAuthenticated && connectionStatus === 'Disconnected') {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [autoConnect, isAuthenticated, connect, disconnect, connectionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionStatus,
    lastMessage,
    messageHistory,
    isConnecting,
    connect,
    disconnect,
    sendMessage,
    sendJsonMessage,
    subscribe,
    getConnectionStats,
    isConnected: connectionStatus === 'Connected',
    // Utility methods
    clearHistory: () => setMessageHistory([]),
    getQueuedMessages: () => [...messageQueue.current]
  };
};

export default useWebSocket;
