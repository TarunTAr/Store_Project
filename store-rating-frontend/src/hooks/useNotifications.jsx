import { useState, useCallback, useRef, createContext, useContext } from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Box, Typography } from '@mui/material';
import { 
  Close as CloseIcon, 
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Notification Context
const NotificationContext = createContext();

// Notification Provider Component
export const NotificationProvider = ({ children, maxNotifications = 5 }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationId = useRef(0);

  const addNotification = useCallback((notification) => {
    const id = ++notificationId.current;
    const newNotification = {
      id,
      timestamp: Date.now(),
      autoHideDuration: 6000,
      variant: 'filled',
      severity: 'info',
      position: 'top-right',
      persistent: false,
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    // Auto-remove non-persistent notifications
    if (!newNotification.persistent && newNotification.autoHideDuration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.autoHideDuration);
    }

    return id;
  }, [maxNotifications]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      )
    );
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      title: 'Success',
      message,
      severity: 'success',
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      title: 'Error',
      message,
      severity: 'error',
      persistent: true,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      title: 'Warning',
      message,
      severity: 'warning',
      autoHideDuration: 8000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      title: 'Info',
      message,
      severity: 'info',
      ...options
    });
  }, [addNotification]);

  const showLoading = useCallback((message, options = {}) => {
    return addNotification({
      title: 'Loading',
      message,
      severity: 'info',
      persistent: true,
      showProgress: true,
      ...options
    });
  }, [addNotification]);

  // Custom notification with actions
  const showCustom = useCallback((config) => {
    return addNotification(config);
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    updateNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showCustom
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Notification Container Component
const NotificationContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  const getPositionStyles = (position) => {
    const positions = {
      'top-right': { top: 24, right: 24 },
      'top-left': { top: 24, left: 24 },
      'top-center': { top: 24, left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: 24, right: 24 },
      'bottom-left': { bottom: 24, left: 24 },
      'bottom-center': { bottom: 24, left: '50%', transform: 'translateX(-50%)' }
    };
    return positions[position] || positions['top-right'];
  };

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const position = notification.position || 'top-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(notification);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedNotifications).map(([position, notificationList]) => (
        <Box
          key={position}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            maxWidth: 400,
            width: '100%',
            ...getPositionStyles(position),
            pointerEvents: 'none'
          }}
        >
          <AnimatePresence mode="popLayout">
            {notificationList.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={() => removeNotification(notification.id)}
              />
            ))}
          </AnimatePresence>
        </Box>
      ))}
    </>
  );
};

// Individual Notification Component
const NotificationItem = ({ notification, onClose }) => {
  const {
    id,
    title,
    message,
    severity,
    variant,
    actions,
    showProgress,
    progress,
    icon
  } = notification;

  const getIcon = () => {
    if (icon) return icon;
    
    const icons = {
      success: <SuccessIcon />,
      error: <ErrorIcon />,
      warning: <WarningIcon />,
      info: <InfoIcon />
    };
    
    return icons[severity];
  };

  const getSeverityColors = () => {
    const colors = {
      success: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
      },
      error: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white'
      },
      warning: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white'
      },
      info: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }
    };
    
    return colors[severity] || colors.info;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ pointerEvents: 'auto', marginBottom: 8 }}
    >
      <Alert
        severity={severity}
        variant={variant}
        icon={getIcon()}
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          background: getSeverityColors().background,
          color: getSeverityColors().color,
          '& .MuiAlert-icon': {
            color: 'inherit'
          },
          '& .MuiAlert-message': {
            flex: 1
          }
        }}
        action={
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ 
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Box>
          {title && (
            <AlertTitle sx={{ 
              fontWeight: 700, 
              mb: message ? 1 : 0,
              color: 'inherit'
            }}>
              {title}
            </AlertTitle>
          )}
          {message && (
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {message}
            </Typography>
          )}
          
          {showProgress && (
            <Box sx={{ mt: 2, width: '100%' }}>
              <Box sx={{ 
                height: 4, 
                borderRadius: 2, 
                backgroundColor: 'rgba(255,255,255,0.3)',
                overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress || 0}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '100%',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '2px'
                  }}
                />
              </Box>
            </Box>
          )}

          {actions && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {action.label}
                </motion.button>
              ))}
            </Box>
          )}
        </Box>
      </Alert>
    </motion.div>
  );
};

// Main hook
const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

// Utility hook for common notification patterns
export const useNotificationPatterns = () => {
  const notification = useNotification();

  const notifyAsync = useCallback(async (asyncFunction, messages = {}) => {
    const {
      loading = 'Processing...',
      success = 'Operation completed successfully',
      error = 'An error occurred'
    } = messages;

    const loadingId = notification.showLoading(loading);

    try {
      const result = await asyncFunction();
      notification.removeNotification(loadingId);
      notification.showSuccess(success);
      return result;
    } catch (err) {
      notification.removeNotification(loadingId);
      notification.showError(typeof error === 'function' ? error(err) : error);
      throw err;
    }
  }, [notification]);

  const notifyFormSubmission = useCallback(async (submitFunction, fieldName = 'form') => {
    return notifyAsync(submitFunction, {
      loading: `Submitting ${fieldName}...`,
      success: `${fieldName} submitted successfully!`,
      error: (err) => `Failed to submit ${fieldName}: ${err.message}`
    });
  }, [notifyAsync]);

  const notifyApiCall = useCallback(async (apiCall, operation = 'operation') => {
    return notifyAsync(apiCall, {
      loading: `Performing ${operation}...`,
      success: `${operation} completed successfully`,
      error: (err) => `${operation} failed: ${err.message}`
    });
  }, [notifyAsync]);

  return {
    notifyAsync,
    notifyFormSubmission,
    notifyApiCall
  };
};

export default useNotification;
