// ==========================================================================
// InstallPrompt Component - Store Rating Platform
// PWA installation prompt for mobile and desktop users
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Avatar
} from '@mui/material';
import { 
  GetApp as InstallIcon, 
  Close as CloseIcon,
  Smartphone as MobileIcon,
  Computer as DesktopIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    // Detect device type
    const detectDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setDeviceType(isMobile ? 'mobile' : 'desktop');
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show immediately, wait a bit for user engagement
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 10000); // Show after 10 seconds
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    checkInstalled();
    detectDevice();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        setShowPrompt(false);
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed, dismissed this session, or no install prompt available
  if (isInstalled || 
      sessionStorage.getItem('installPromptDismissed') || 
      !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 9998,
          maxWidth: 380,
          width: '90%',
        }}
      >
        <Card
          sx={{
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header with App Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.2rem'
                  }}
                >
                  ⭐
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    Install App
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Store Rating Platform
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={handleDismiss}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Benefits */}
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Install our app for the best experience with offline access and quick launch!
            </Typography>

            {/* Features */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {deviceType === 'mobile' ? <MobileIcon /> : <DesktopIcon />}
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Works {deviceType === 'mobile' ? 'like a native mobile app' : 'from your desktop'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <StarIcon sx={{ color: 'warning.main' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Rate stores even when offline
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InstallIcon />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Fast loading and instant access
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<InstallIcon />}
                onClick={handleInstall}
                sx={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                  py: 1.2
                }}
              >
                Install Now
              </Button>
              <Button
                variant="outlined"
                onClick={handleDismiss}
                sx={{
                  px: 3,
                  borderColor: 'grey.300',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50'
                  }
                }}
              >
                Not Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
