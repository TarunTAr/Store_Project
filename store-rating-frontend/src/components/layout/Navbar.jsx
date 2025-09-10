import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  Badge,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Slide,
  Fade
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Store as StoreIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import SearchBar from '../common/SearchBar';
import NotificationBell from '../common/NotificationBell';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ onSidebarToggle, showSearch = true, transparent = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleSearch = (query, filters) => {
    navigate(`/stores?search=${encodeURIComponent(query)}`);
  };

  const getNavbarBackground = () => {
    if (transparent && !scrolled) {
      return 'rgba(255, 255, 255, 0.1)';
    }
    return darkMode 
      ? 'rgba(15, 23, 42, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)';
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const searchVariants = {
    closed: { width: 0, opacity: 0 },
    open: { 
      width: isMobile ? '100%' : 400, 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  const UserMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 8,
        sx: {
          mt: 1.5,
          minWidth: 250,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiMenuItem-root': {
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }
        }
      }}
    >
      {isAuthenticated ? (
        <Box>
          {/* User Info Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
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
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <Box sx={{ py: 1 }}>
            <motion.div variants={menuItemVariants} initial="hidden" animate="visible" custom={0}>
              <MenuItem onClick={() => handleNavigation('/dashboard')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText>Dashboard</ListItemText>
              </MenuItem>
            </motion.div>

            <motion.div variants={menuItemVariants} initial="hidden" animate="visible" custom={1}>
              <MenuItem onClick={() => handleNavigation('/profile')}>
                <ListItemIcon>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
            </motion.div>

            {user?.role === 'Store Owner' && (
              <motion.div variants={menuItemVariants} initial="hidden" animate="visible" custom={2}>
                <MenuItem onClick={() => handleNavigation('/dashboard/owner')}>
                  <ListItemIcon>
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText>My Store</ListItemText>
                </MenuItem>
              </motion.div>
            )}

            <motion.div variants={menuItemVariants} initial="hidden" animate="visible" custom={3}>
              <MenuItem onClick={() => handleNavigation('/settings')}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
            </motion.div>

            <Divider sx={{ my: 1 }} />

            <motion.div variants={menuItemVariants} initial="hidden" animate="visible" custom={4}>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
              </MenuItem>
            </motion.div>
          </Box>
        </Box>
      ) : (
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={() => handleNavigation('/login')}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText>Sign In</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleNavigation('/register')}>
            <ListItemIcon>
              <RegisterIcon />
            </ListItemIcon>
            <ListItemText>Sign Up</ListItemText>
          </MenuItem>
        </Box>
      )}
    </Menu>
  );

  return (
    <Slide direction="down" in={true} timeout={500}>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          background: getNavbarBackground(),
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? 1 : 0,
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {/* Mobile Menu Button */}
          {isMobile && onSidebarToggle && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={onSidebarToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          )}

          {/* Logo */}
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            whileTap="tap"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <StoreIcon 
                  sx={{ 
                    fontSize: 32,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }} 
                />
              </motion.div>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}
              >
                StoreRating
              </Typography>
            </Box>
          </motion.div>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links (Desktop) */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
              {[
                { label: 'Home', path: '/', icon: <HomeIcon /> },
                { label: 'Stores', path: '/stores', icon: <StoreIcon /> }
              ].map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Button
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          {/* Search Bar */}
          {showSearch && !isMobile && (
            <Box sx={{ mr: 2, minWidth: 300 }}>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search stores..."
                showFilters={false}
              />
            </Box>
          )}

          {/* Mobile Search Button */}
          {showSearch && isMobile && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                color="inherit"
                onClick={() => setSearchOpen(!searchOpen)}
                sx={{ mr: 1 }}
              >
                <SearchIcon />
              </IconButton>
            </motion.div>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <ThemeToggle variant="icon" size="small" />

            {/* Notifications (authenticated users only) */}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NotificationBell />
              </motion.div>
            )}

            {/* User Menu */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title={isAuthenticated ? 'Account' : 'Sign in'}>
                <IconButton
                  onClick={handleMenuOpen}
                  color="inherit"
                  sx={{
                    background: isAuthenticated 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'transparent',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    }
                  }}
                >
                  {isAuthenticated ? (
                    <Avatar
                      src={user?.avatar}
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                  ) : (
                    <AccountIcon />
                  )}
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>

          <UserMenu />
        </Toolbar>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && isMobile && (
            <motion.div
              variants={searchVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <Box sx={{ px: 2, pb: 2 }}>
                <SearchBar
                  onSearch={(query) => {
                    handleSearch(query);
                    setSearchOpen(false);
                  }}
                  placeholder="Search stores..."
                  showFilters={false}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </AppBar>
    </Slide>
  );
};

export default Navbar;
