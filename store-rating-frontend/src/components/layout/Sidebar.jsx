import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Store as StoreIcon,
  Star as RatingsIcon,
  Category as CategoryIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  PersonAdd as AddUserIcon,
  StoreMallDirectory as AddStoreIcon,
  Assessment as ReportsIcon,
  Security as SecurityIcon,
  Notifications as NotificationIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

const Sidebar = ({ 
  open = true, 
  onClose, 
  variant = 'permanent', 
  collapsible = true 
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleExpandToggle = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [];

    // Common items for all authenticated users
    baseItems.push({
      key: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      color: '#667eea'
    });

    if (user?.role === 'System Administrator') {
      baseItems.push(
        {
          key: 'users',
          label: 'User Management',
          icon: <UsersIcon />,
          color: '#10b981',
          children: [
            { key: 'users-list', label: 'All Users', path: '/dashboard/admin/users', icon: <UsersIcon /> },
            { key: 'users-add', label: 'Add User', path: '/dashboard/admin/users/add', icon: <AddUserIcon /> }
          ]
        },
        {
          key: 'stores',
          label: 'Store Management',
          icon: <StoreIcon />,
          color: '#f59e0b',
          children: [
            { key: 'stores-list', label: 'All Stores', path: '/dashboard/admin/stores', icon: <StoreIcon /> },
            { key: 'stores-add', label: 'Add Store', path: '/dashboard/admin/stores/add', icon: <AddStoreIcon /> }
          ]
        },
        {
          key: 'categories',
          label: 'Categories',
          icon: <CategoryIcon />,
          path: '/dashboard/admin/categories',
          color: '#8b5cf6'
        },
        {
          key: 'analytics',
          label: 'Analytics',
          icon: <AnalyticsIcon />,
          path: '/dashboard/admin/analytics',
          color: '#ef4444'
        }
      );
    }

    if (user?.role === 'Normal User') {
      baseItems.push(
        {
          key: 'browse',
          label: 'Browse Stores',
          icon: <SearchIcon />,
          path: '/dashboard/user/browse',
          color: '#10b981'
        },
        {
          key: 'my-ratings',
          label: 'My Ratings',
          icon: <RatingsIcon />,
          path: '/dashboard/user/ratings',
          color: '#f59e0b'
        },
        {
          key: 'favorites',
          label: 'Favorites',
          icon: <FavoriteIcon />,
          path: '/dashboard/user/favorites',
          color: '#ef4444'
        }
      );
    }

    if (user?.role === 'Store Owner') {
      baseItems.push(
        {
          key: 'my-store',
          label: 'My Store',
          icon: <StoreIcon />,
          path: '/dashboard/owner/store',
          color: '#10b981'
        },
        {
          key: 'store-ratings',
          label: 'Store Ratings',
          icon: <RatingsIcon />,
          path: '/dashboard/owner/ratings',
          color: '#f59e0b'
        },
        {
          key: 'store-analytics',
          label: 'Analytics',
          icon: <AnalyticsIcon />,
          path: '/dashboard/owner/analytics',
          color: '#8b5cf6'
        }
      );
    }

    // Common bottom items
    baseItems.push(
      {
        key: 'profile',
        label: 'Profile',
        icon: <ProfileIcon />,
        path: '/dashboard/profile',
        color: '#6b7280'
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: <SettingsIcon />,
        path: '/dashboard/settings',
        color: '#6b7280'
      }
    );

    return baseItems;
  };

  const menuItems = getMenuItems();

  const sidebarVariants = {
    expanded: { width: DRAWER_WIDTH },
    collapsed: { width: COLLAPSED_WIDTH },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  const iconVariants = {
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const SidebarItem = ({ item, index, level = 0 }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.key];
    const isActive = location.pathname === item.path || 
      (hasChildren && item.children.some(child => location.pathname === child.path));

    return (
      <motion.div
        key={item.key}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        custom={index}
      >
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleExpandToggle(item.key);
              } else if (item.path) {
                handleNavigation(item.path);
              }
            }}
            sx={{
              minHeight: 48,
              pl: level * 2 + 2,
              pr: 2,
              mx: 1,
              borderRadius: 2,
              background: isActive 
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                : 'transparent',
              border: isActive ? 1 : 0,
              borderColor: isActive ? 'primary.main' : 'transparent',
              '&:hover': {
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)'
                  : 'rgba(102, 126, 234, 0.08)',
                transform: 'translateX(4px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 'auto' : 40,
                justifyContent: 'center',
                color: isActive ? item.color || 'primary.main' : 'text.secondary'
              }}
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {item.icon}
              </motion.div>
            </ListItemIcon>

            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.main' : 'text.primary'
                    }
                  }}
                />
                
                {hasChildren && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExpandLess sx={{ fontSize: 20 }} />
                  </motion.div>
                )}
              </>
            )}

            {/* Badge for active state when collapsed */}
            {collapsed && isActive && (
              <Box
                sx={{
                  position: 'absolute',
                  right: -2,
                  width: 4,
                  height: 20,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '2px 0 0 2px'
                }}
              />
            )}
          </ListItemButton>
        </ListItem>

        {/* Children Items */}
        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child, childIndex) => (
                <SidebarItem
                  key={child.key}
                  item={child}
                  index={childIndex}
                  level={level + 1}
                />
              ))}
            </List>
          </Collapse>
        )}
      </motion.div>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 1 : 3,
          borderBottom: 1,
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
        }}
      >
        {!collapsed ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user?.avatar}
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user?.name}
                </Typography>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    height: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </Box>
        )}

        {/* Collapse Button */}
        {collapsible && !isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: collapsed ? 'center' : 'flex-end',
            mt: collapsed ? 1 : 2
          }}>
            <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <IconButton
                onClick={handleToggleCollapse}
                size="small"
                sx={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.2)'
                  }
                }}
              >
                <motion.div
                  animate={{ rotate: collapsed ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExpandIcon />
                </motion.div>
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <SidebarItem key={item.key} item={item} index={index} />
          ))}
        </List>
      </Box>

      {/* Footer */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            background: 'rgba(102, 126, 234, 0.03)'
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center' }}
          >
            Store Rating Platform
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}
          >
            v1.0.0
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Drawer
        variant={isMobile ? 'temporary' : variant}
        open={isMobile ? open : true}
        onClose={onClose}
        sx={{
          width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.95)' 
              : 'rgba(248, 250, 252, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: 1,
            borderColor: 'divider',
            transition: 'width 0.3s ease'
          }
        }}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawerContent}
      </Drawer>
    </motion.div>
  );
};

export default Sidebar;
