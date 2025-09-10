import React, { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Tooltip,
  Paper,
  Fade
} from '@mui/material';
import {
  Notifications as BellIcon,
  NotificationsActive as ActiveBellIcon,
  Star as StarIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  MarkEmailRead as ReadIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import useWebSocket from '../../hooks/useWebSocket';

const NotificationBell = ({ maxVisible = 5 }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  
  // WebSocket for real-time notifications
  const { subscribeToEvent } = useWebSocket();

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsubscribe = subscribeToEvent('newNotification', (notification) => {
      // Trigger shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      
      // Add notification to store
      dispatch(addNotification(notification));
    });

    return unsubscribe;
  }, [subscribeToEvent, dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsShaking(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    handleClose();
  };

  const getNotificationIcon = (type) => {
    const iconProps = { sx: { fontSize: 20 } };
    
    switch (type) {
      case 'rating':
        return <StarIcon {...iconProps} sx={{ color: '#f59e0b' }} />;
      case 'store':
        return <StoreIcon {...iconProps} sx={{ color: '#10b981' }} />;
      case 'user':
        return <PersonIcon {...iconProps} sx={{ color: '#3b82f6' }} />;
      default:
        return <BellIcon {...iconProps} sx={{ color: '#667eea' }} />;
    }
  };

  const getNotificationColor = (type, read = false) => {
    if (read) return '#94a3b8';
    
    switch (type) {
      case 'rating': return '#f59e0b';
      case 'store': return '#10b981';
      case 'user': return '#3b82f6';
      case 'error': return '#ef4444';
      default: return '#667eea';
    }
  };

  const bellVariants = {
    idle: { rotate: 0 },
    shake: {
      rotate: [0, -15, 15, -15, 15, 0],
      transition: { duration: 0.6, times: [0, 0.1, 0.3, 0.5, 0.7, 1] }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const badgeVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const notificationItemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }),
    exit: {
      opacity: 0,
      x: 50,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const open = Boolean(anchorEl);
  const recentNotifications = notifications.slice(0, maxVisible);

  return (
    <>
      <Tooltip title={`${unreadCount} new notifications`}>
        <IconButton
          ref={bellRef}
          onClick={handleClick}
          sx={{
            position: 'relative',
            color: unreadCount > 0 ? 'primary.main' : 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <motion.div
            variants={bellVariants}
            animate={isShaking ? 'shake' : 'idle'}
            whileHover="hover"
          >
            <Badge
              badgeContent={
                <motion.span
                  variants={badgeVariants}
                  initial="initial"
                  animate={unreadCount > 0 ? ["animate", "pulse"] : "animate"}
                >
                  {unreadCount}
                </motion.span>
              }
              color="error"
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  minWidth: 16,
                  height: 16,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }
              }}
            >
              {unreadCount > 0 ? (
                <motion.div
                  animate={{
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ActiveBellIcon />
                </motion.div>
              ) : (
                <BellIcon />
              )}
            </Badge>
          </motion.div>

          {/* Notification glow effect */}
          {unreadCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                inset: -2,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
                animation: 'pulse 2s infinite',
                pointerEvents: 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 1 },
                  '100%': { transform: 'scale(1.4)', opacity: 0 }
                }
              }}
            />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Tooltip title="Mark all as read">
                  <IconButton
                    size="small"
                    onClick={handleMarkAllAsRead}
                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    <ReadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Clear all">
                <IconButton
                  size="small"
                  onClick={handleClearAll}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '0.75rem'
              }}
            />
          )}
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BellIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No notifications yet
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  We'll notify you when something happens
                </Typography>
              </motion.div>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {recentNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    custom={index}
                    variants={notificationItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <ListItem
                      sx={{
                        borderLeft: 4,
                        borderLeftColor: getNotificationColor(notification.type, notification.read),
                        backgroundColor: notification.read ? 'transparent' : 'action.hover',
                        '&:hover': {
                          backgroundColor: 'action.selected'
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: notification.read 
                              ? 'grey.100' 
                              : getNotificationColor(notification.type),
                            color: notification.read ? 'text.disabled' : 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: notification.read ? 400 : 600,
                              color: notification.read ? 'text.secondary' : 'text.primary',
                              lineHeight: 1.4
                            }}
                          >
                            {notification.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: notification.read ? 'text.disabled' : 'text.secondary',
                                display: 'block',
                                lineHeight: 1.3
                              }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.disabled',
                                mt: 0.5,
                                display: 'block'
                              }}
                            >
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </Typography>
                          </Box>
                        }
                      />

                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            ml: 1,
                            flexShrink: 0
                          }}
                        />
                      )}
                    </ListItem>
                    
                    {index < recentNotifications.length - 1 && <Divider />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > maxVisible && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                handleClose();
                // Navigate to notifications page
              }}
              sx={{ color: 'primary.main' }}
            >
              View all {notifications.length} notifications
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationBell;
