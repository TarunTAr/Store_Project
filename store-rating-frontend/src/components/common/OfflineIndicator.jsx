// ==========================================================================
// OfflineIndicator Component - Store Rating Platform
// Shows network status to users when they go offline
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { Alert, Slide, Box, Typography } from '@mui/material';
import { WifiOff as OfflineIcon, Wifi as OnlineIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide reconnected message after 3 seconds
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Offline Indicator */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
        >
          <Alert
            severity="error"
            icon={<OfflineIcon />}
            sx={{
              borderRadius: 0,
              backgroundColor: '#f44336',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' },
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                📶 You're offline
              </Typography>
              <Typography variant="caption">
                • Some features may be limited
              </Typography>
            </Box>
          </Alert>
        </motion.div>
      )}

      {/* Reconnected Indicator */}
      {isOnline && showReconnected && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
        >
          <Alert
            severity="success"
            icon={<OnlineIcon />}
            sx={{
              borderRadius: 0,
              backgroundColor: '#4caf50',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' },
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              🟢 Back online! All features restored
            </Typography>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
