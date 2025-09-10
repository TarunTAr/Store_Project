import React, { useState, useMemo } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
  Collapse,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Person as PersonIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  TrendingUp as TrendingUpIcon,
  Comment as CommentIcon,
  ThumbUp as LikeIcon,
  Share as ShareIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentActivity, markActivityAsRead } from '../../store/activitySlice';

const RecentActivity = ({
  activities = [],
  loading = false,
  error = null,
  maxItems = 10,
  showHeader = true,
  showFilters = false,
  showLoadMore = true,
  onActivityClick,
  onRefresh,
  autoRefresh = false,
  groupByDate = false,
  className = ''
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [filter, setFilter] = useState('all');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Group activities by date if requested
  const groupedActivities = useMemo(() => {
    if (!groupByDate) return { all: activities };

    const groups = {};
    activities.forEach(activity => {
      const date = format(new Date(activity.createdAt), 'yyyy-MM-dd');
      const dateLabel = format(new Date(activity.createdAt), 'MMMM d, yyyy');
      
      if (!groups[date]) {
        groups[date] = {
          label: dateLabel,
          activities: []
        };
      }
      groups[date].activities.push(activity);
    });

    return groups;
  }, [activities, groupByDate]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (filter === 'all') return activities;
    
    return activities.filter(activity => {
      switch (filter) {
        case 'ratings':
          return activity.type === 'rating_submitted' || activity.type === 'rating_updated';
        case 'stores':
          return activity.type === 'store_created' || activity.type === 'store_updated';
        case 'users':
          return activity.type === 'user_registered' || activity.type === 'user_updated';
        default:
          return true;
      }
    });
  }, [activities, filter]);

  const handleMenuOpen = (event, activity) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedActivity(activity);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActivity(null);
  };

  const handleActivityClick = (activity) => {
    // Mark as read if unread
    if (!activity.read) {
      dispatch(markActivityAsRead(activity.id));
    }

    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  const handleGroupToggle = (groupKey) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getActivityIcon = (activity) => {
    const iconProps = { sx: { fontSize: 20 } };
    
    switch (activity.type) {
      case 'rating_submitted':
      case 'rating_updated':
        return <StarIcon {...iconProps} />;
      case 'store_created':
      case 'store_updated':
        return <StoreIcon {...iconProps} />;
      case 'user_registered':
      case 'user_updated':
        return <PersonIcon {...iconProps} />;
      case 'comment_added':
        return <CommentIcon {...iconProps} />;
      case 'like_added':
        return <LikeIcon {...iconProps} />;
      case 'store_shared':
        return <ShareIcon {...iconProps} />;
      default:
        return <NotificationIcon {...iconProps} />;
    }
  };

  const getActivityColor = (activity) => {
    switch (activity.type) {
      case 'rating_submitted':
      case 'rating_updated':
        return '#f59e0b';
      case 'store_created':
      case 'store_updated':
        return '#10b981';
      case 'user_registered':
      case 'user_updated':
        return '#667eea';
      case 'comment_added':
        return '#8b5cf6';
      case 'like_added':
        return '#ef4444';
      case 'store_shared':
        return '#06b6d4';
      default:
        return '#6b7280';
    }
  };

  const getActivityTitle = (activity) => {
    switch (activity.type) {
      case 'rating_submitted':
        return `New rating submitted for ${activity.metadata?.storeName}`;
      case 'rating_updated':
        return `Rating updated for ${activity.metadata?.storeName}`;
      case 'store_created':
        return `New store "${activity.metadata?.storeName}" was created`;
      case 'store_updated':
        return `Store "${activity.metadata?.storeName}" was updated`;
      case 'user_registered':
        return `New user ${activity.metadata?.userName} registered`;
      case 'user_updated':
        return `User ${activity.metadata?.userName} updated their profile`;
      case 'comment_added':
        return `New comment on ${activity.metadata?.storeName}`;
      case 'like_added':
        return `${activity.metadata?.userName} liked ${activity.metadata?.storeName}`;
      case 'store_shared':
        return `${activity.metadata?.storeName} was shared`;
      default:
        return activity.title || 'Activity occurred';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.2 }
    }
  };

  const ActivityItem = ({ activity, index }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
    >
      <ListItem
        sx={{
          borderRadius: 2,
          mb: 1,
          border: '1px solid transparent',
          cursor: 'pointer',
          backgroundColor: activity.read ? 'transparent' : 'action.hover',
          '&:hover': {
            borderColor: getActivityColor(activity),
            backgroundColor: `${getActivityColor(activity)}08`
          },
          transition: 'all 0.2s ease'
        }}
        onClick={() => handleActivityClick(activity)}
      >
        <ListItemAvatar>
          <Badge
            variant="dot"
            color="error"
            invisible={activity.read}
            sx={{
              '& .MuiBadge-badge': {
                right: 6,
                top: 6
              }
            }}
          >
            <Avatar
              sx={{
                backgroundColor: `${getActivityColor(activity)}15`,
                color: getActivityColor(activity),
                width: 40,
                height: 40
              }}
            >
              {getActivityIcon(activity)}
            </Avatar>
          </Badge>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: activity.read ? 500 : 600,
                  flex: 1
                }}
              >
                {getActivityTitle(activity)}
              </Typography>

              {activity.metadata?.priority === 'high' && (
                <Chip
                  label="High"
                  size="small"
                  color="error"
                  sx={{ fontSize: '0.65rem', height: 16 }}
                />
              )}
            </Box>
          }
          secondary={
            <Box>
              {activity.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {activity.description}
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.disabled">
                  {formatDistanceToNow(new Date(activity.createdAt))} ago
                </Typography>

                {activity.metadata?.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 12, color: '#f59e0b' }} />
                    <Typography variant="caption">
                      {activity.metadata.rating}
                    </Typography>
                  </Box>
                )}

                {activity.metadata?.userName && activity.type !== 'user_registered' && (
                  <Typography variant="caption" color="text.secondary">
                    by {activity.metadata.userName}
                  </Typography>
                )}
              </Box>
            </Box>
          }
        />

        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, activity)}
          sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
        >
          <MoreIcon />
        </IconButton>
      </ListItem>
    </motion.div>
  );

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
        className={className}
      >
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton variant="text" width="50%" height={16} />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        {showHeader && (
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Activity
                </Typography>
                {activities.filter(a => !a.read).length > 0 && (
                  <Badge
                    badgeContent={activities.filter(a => !a.read).length}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem'
                      }
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Refresh">
                  <IconButton size="small" onClick={onRefresh} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Filters */}
            {showFilters && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['all', 'ratings', 'stores', 'users'].map((filterType) => (
                  <Chip
                    key={filterType}
                    label={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    clickable
                    size="small"
                    color={filter === filterType ? 'primary' : 'default'}
                    onClick={() => setFilter(filterType)}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Content */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              <Typography variant="body2">
                Failed to load recent activity: {error}
              </Typography>
              {onRefresh && (
                <Button
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={onRefresh}
                  sx={{ mt: 1 }}
                >
                  Retry
                </Button>
              )}
            </Alert>
          ) : filteredActivities.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Recent Activity
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Activity will appear here as users interact with the platform
              </Typography>
            </Box>
          ) : groupByDate ? (
            <List sx={{ p: 2 }}>
              {Object.entries(groupedActivities).map(([dateKey, group]) => (
                <Box key={dateKey}>
                  <ListItem
                    button
                    onClick={() => handleGroupToggle(dateKey)}
                    sx={{ borderRadius: 2, mb: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {group.label}
                        </Typography>
                      }
                      secondary={`${group.activities.length} activities`}
                    />
                    {expandedGroups.has(dateKey) ? <CollapseIcon /> : <ExpandIcon />}
                  </ListItem>

                  <Collapse in={expandedGroups.has(dateKey)}>
                    <Box sx={{ ml: 2 }}>
                      {group.activities.slice(0, maxItems).map((activity, index) => (
                        <ActivityItem
                          key={activity.id}
                          activity={activity}
                          index={index}
                        />
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </List>
          ) : (
            <List sx={{ p: 2 }}>
              <AnimatePresence>
                {filteredActivities.slice(0, maxItems).map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </List>
          )}
        </Box>

        {/* Footer */}
        {filteredActivities.length > maxItems && showLoadMore && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => {
                // Handle load more
              }}
              sx={{ borderRadius: 2 }}
            >
              Load More ({filteredActivities.length - maxItems} remaining)
            </Button>
          </Box>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <MenuItem onClick={() => { /* View details */ handleMenuClose(); }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        {selectedActivity && !selectedActivity.read && (
          <MenuItem onClick={() => { dispatch(markActivityAsRead(selectedActivity.id)); handleMenuClose(); }}>
            <ListItemIcon>
              <MoreIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Read</ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={() => { /* Delete */ handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default RecentActivity;
