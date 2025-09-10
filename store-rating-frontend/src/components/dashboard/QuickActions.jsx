import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  Badge,
  Chip,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Launch as LaunchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const QuickActions = ({
  userRole = 'user', // admin, store_owner, user
  variant = 'grid', // grid, fab, speeddial, compact
  actions = [],
  showLabels = true,
  showStats = false,
  onActionClick,
  className = ''
}) => {
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Default actions based on user role
  const getDefaultActions = () => {
    const commonActions = [
      {
        id: 'search',
        label: 'Search',
        icon: <SearchIcon />,
        color: '#667eea',
        description: 'Search stores and ratings',
        route: '/search',
        badge: null
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: <NotificationsIcon />,
        color: '#f59e0b',
        description: 'View notifications',
        route: '/notifications',
        badge: 5
      }
    ];

    switch (userRole) {
      case 'admin':
        return [
          {
            id: 'add-user',
            label: 'Add User',
            icon: <PersonIcon />,
            color: '#667eea',
            description: 'Create new user account',
            route: '/admin/users/create',
            badge: null,
            primary: true
          },
          {
            id: 'add-store',
            label: 'Add Store',
            icon: <StoreIcon />,
            color: '#10b981',
            description: 'Register new store',
            route: '/admin/stores/create',
            badge: null,
            primary: true
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: <AnalyticsIcon />,
            color: '#8b5cf6',
            description: 'View detailed analytics',
            route: '/admin/analytics',
            badge: null
          },
          {
            id: 'reports',
            label: 'Reports',
            icon: <ReportsIcon />,
            color: '#ef4444',
            description: 'Generate reports',
            route: '/admin/reports',
            badge: null
          },
          {
            id: 'users',
            label: 'Manage Users',
            icon: <GroupIcon />,
            color: '#06b6d4',
            description: 'View and manage users',
            route: '/admin/users',
            badge: 125
          },
          {
            id: 'stores',
            label: 'Manage Stores',
            icon: <StoreIcon />,
            color: '#84cc16',
            description: 'View and manage stores',
            route: '/admin/stores',
            badge: 89
          },
          ...commonActions,
          {
            id: 'settings',
            label: 'Settings',
            icon: <SettingsIcon />,
            color: '#6b7280',
            description: 'System settings',
            route: '/admin/settings',
            badge: null
          }
        ];

      case 'store_owner':
        return [
          {
            id: 'view-ratings',
            label: 'My Ratings',
            icon: <StarIcon />,
            color: '#f59e0b',
            description: 'View store ratings',
            route: '/store/ratings',
            badge: 23,
            primary: true
          },
          {
            id: 'store-analytics',
            label: 'Store Analytics',
            icon: <TrendingUpIcon />,
            color: '#8b5cf6',
            description: 'View store performance',
            route: '/store/analytics',
            badge: null,
            primary: true
          },
          {
            id: 'edit-store',
            label: 'Edit Store',
            icon: <EditIcon />,
            color: '#10b981',
            description: 'Update store information',
            route: '/store/edit',
            badge: null
          },
          {
            id: 'customers',
            label: 'Customers',
            icon: <GroupIcon />,
            color: '#667eea',
            description: 'View customer reviews',
            route: '/store/customers',
            badge: 45
          },
          ...commonActions,
          {
            id: 'help',
            label: 'Help',
            icon: <HelpIcon />,
            color: '#6b7280',
            description: 'Get help and support',
            route: '/help',
            badge: null
          }
        ];

      default: // normal user
        return [
          {
            id: 'rate-store',
            label: 'Rate Store',
            icon: <StarIcon />,
            color: '#f59e0b',
            description: 'Submit a store rating',
            route: '/stores',
            badge: null,
            primary: true
          },
          {
            id: 'browse-stores',
            label: 'Browse Stores',
            icon: <StoreIcon />,
            color: '#10b981',
            description: 'Explore all stores',
            route: '/stores',
            badge: null,
            primary: true
          },
          {
            id: 'my-ratings',
            label: 'My Ratings',
            icon: <StarIcon />,
            color: '#8b5cf6',
            description: 'View your ratings',
            route: '/user/ratings',
            badge: 12
          },
          {
            id: 'categories',
            label: 'Categories',
            icon: <CategoryIcon />,
            color: '#06b6d4',
            description: 'Browse by category',
            route: '/categories',
            badge: null
          },
          ...commonActions,
          {
            id: 'profile',
            label: 'Profile',
            icon: <PersonIcon />,
            color: '#667eea',
            description: 'Manage your profile',
            route: '/user/profile',
            badge: null
          }
        ];
    }
  };

  const actionItems = actions.length > 0 ? actions : getDefaultActions();

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    } else if (action.route) {
      navigate(action.route);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  if (variant === 'fab') {
    const primaryActions = actionItems.filter(action => action.primary).slice(0, 3);
    
    return (
      <Box className={className}>
        {primaryActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { delay: index * 0.1 }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Fab
              color="primary"
              onClick={() => handleActionClick(action)}
              sx={{
                position: 'fixed',
                bottom: 24 + (index * 70),
                right: 24,
                background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${action.color}dd, ${action.color})`
                }
              }}
            >
              <Badge badgeContent={action.badge} color="error">
                {action.icon}
              </Badge>
            </Fab>
          </motion.div>
        ))}
      </Box>
    );
  }

  if (variant === 'speeddial') {
    return (
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
        className={className}
      >
        {actionItems.slice(0, 6).map((action) => (
          <SpeedDialAction
            key={action.id}
            icon={
              <Badge badgeContent={action.badge} color="error">
                {action.icon}
              </Badge>
            }
            tooltipTitle={action.label}
            onClick={() => {
              handleActionClick(action);
              setSpeedDialOpen(false);
            }}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                backgroundColor: `${action.color}15`,
                color: action.color,
                '&:hover': {
                  backgroundColor: `${action.color}25`
                }
              }
            }}
          />
        ))}
      </SpeedDial>
    );
  }

  if (variant === 'compact') {
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
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Quick Actions
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {actionItems.slice(0, 8).map((action, index) => (
              <motion.div
                key={action.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  startIcon={
                    <Badge badgeContent={action.badge} color="error">
                      {action.icon}
                    </Badge>
                  }
                  onClick={() => handleActionClick(action)}
                  variant={action.primary ? 'contained' : 'outlined'}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    ...(action.primary && {
                      background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${action.color}dd, ${action.color})`
                      }
                    }),
                    ...(!action.primary && {
                      borderColor: action.color,
                      color: action.color,
                      '&:hover': {
                        backgroundColor: `${action.color}15`,
                        borderColor: action.color
                      }
                    })
                  }}
                >
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>
    );
  }

  // Default grid variant
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
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Quick Actions
              </Typography>
            </Box>

            <Tooltip title="Role-based actions">
              <Chip
                label={userRole.replace('_', ' ').toUpperCase()}
                size="small"
                color="primary"
                sx={{ fontSize: '0.7rem' }}
              />
            </Tooltip>
          </Box>
        </Box>

        {/* Actions Grid */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <AnimatePresence>
              {actionItems.map((action, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={action.id}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index}
                    whileHover="hover"
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        height: '100%',
                        background: action.primary 
                          ? `linear-gradient(135deg, ${action.color}15 0%, ${action.color}08 100%)`
                          : 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          borderColor: action.color,
                          boxShadow: `0 8px 25px ${action.color}20`,
                          transform: 'translateY(-4px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleActionClick(action)}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            badgeContent={action.badge}
                            color="error"
                            sx={{ mb: 2 }}
                          >
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: `${action.color}20`,
                                color: action.color,
                                margin: '0 auto'
                              }}
                            >
                              {action.icon}
                            </Avatar>
                          </Badge>
                        </motion.div>

                        {showLabels && (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              color: action.primary ? action.color : 'text.primary'
                            }}
                          >
                            {action.label}
                          </Typography>
                        )}

                        {action.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: '0.875rem',
                              lineHeight: 1.4
                            }}
                          >
                            {action.description}
                          </Typography>
                        )}

                        {showStats && action.stats && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: action.color }}>
                              {action.stats.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {action.stats.label}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      {action.primary && (
                        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                          <Button
                            size="small"
                            endIcon={<LaunchIcon />}
                            sx={{
                              color: action.color,
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: `${action.color}15`
                              }
                            }}
                          >
                            Get Started
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default QuickActions;
