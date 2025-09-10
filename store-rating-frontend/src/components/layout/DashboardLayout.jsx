import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Paper,
  Fade
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Generate breadcrumbs from current route
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [
      { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: 16 }} /> }
    ];

    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Beautify segment names
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      label = label.replace(/-/g, ' ');
      
      // Custom labels for known routes
      const customLabels = {
        'dashboard': 'Dashboard',
        'admin': 'Admin Panel',
        'user': 'User Dashboard',
        'owner': 'Store Owner',
        'stores': 'Stores',
        'users': 'Users',
        'ratings': 'Ratings',
        'analytics': 'Analytics',
        'settings': 'Settings',
        'profile': 'Profile'
      };

      label = customLabels[segment] || label;

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === pathnames.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const layoutVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const breadcrumbVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={layoutVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.02,
            backgroundImage: `
              linear-gradient(45deg, #667eea 1px, transparent 1px),
              linear-gradient(-45deg, #764ba2 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />

        {/* Navigation */}
        <Navbar 
          onSidebarToggle={handleSidebarToggle}
          showSearch={false}
        />

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          variant={isMobile ? 'temporary' : 'permanent'}
          collapsible={!isMobile}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - 280px)` },
            minHeight: '100vh',
            position: 'relative'
          }}
        >
          {/* Toolbar Spacer */}
          <Toolbar />

          {/* Content Area */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Breadcrumbs */}
            <motion.div
              variants={breadcrumbVariants}
              initial="hidden"
              animate="visible"
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Breadcrumbs
                  separator={<NavigateNextIcon fontSize="small" />}
                  aria-label="breadcrumb"
                >
                  {breadcrumbs.map((crumb, index) => (
                    <motion.div
                      key={crumb.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {crumb.isLast ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {crumb.icon}
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600
                            }}
                          >
                            {crumb.label}
                          </Typography>
                        </Box>
                      ) : (
                        <Link
                          color="inherit"
                          href={crumb.href}
                          onClick={(e) => {
                            e.preventDefault();
                            // Navigate to breadcrumb path
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {crumb.icon}
                          <Typography variant="body2">
                            {crumb.label}
                          </Typography>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </Breadcrumbs>
              </Paper>
            </motion.div>

            {/* Page Content */}
            <motion.div variants={contentVariants}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </Box>
        </Box>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: theme.zIndex.drawer - 1,
            }}
            onClick={handleSidebarClose}
          />
        )}
      </Box>
    </motion.div>
  );
};

export default DashboardLayout;
