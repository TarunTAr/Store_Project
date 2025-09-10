import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  return (
    <motion.div
      variants={layoutVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
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
            opacity: 0.03,
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #667eea 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #764ba2 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 25px 25px',
            backgroundPosition: '0 0, 12.5px 12.5px',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />

        {/* Navigation */}
        <Navbar showSearch />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            pt: { xs: '56px', sm: '64px' }, // Account for navbar height
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div
            variants={contentVariants}
            style={{ minHeight: 'calc(100vh - 64px)' }}
          >
            <Outlet />
          </motion.div>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </motion.div>
  );
};

export default MainLayout;
