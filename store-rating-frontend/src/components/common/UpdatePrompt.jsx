// ==========================================================================
// UpdatePrompt Component - Store Rating Platform
// Prompts users when a new version is available (PWA)
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Chip
} from '@mui/material';
import { 
  Update as UpdateIcon, 
  Close as CloseIcon,
  Download as DownloadIcon,
  Schedule as LaterIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const UpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    // Listen for service worker update events
    const handleServiceWorkerUpdate = (event) => {
      if (event.detail && event.detail.registration) {
        setUpdateInfo({
          version: '2.0.0', // This would come from your build process
          features: ['New rating features', 'Performance improvements', 'Bug fixes']
        });
        setShowPrompt(true);
      }
    };

    // Mock update for demonstration (remove in production)
    const mockUpdate = () => {
      setTimeout(() => {
        setUpdateInfo({
          version: '1.1.0',
          features: ['Enhanced store search', 'Improved rating UI', 'Offline support']
        });
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds for demo
    };

    window.addEventListener('sw-update-available', handleServiceWorkerUpdate);
    
    // Uncomment for demo
    // mockUpdate();

    return () => {
      window.removeEventListener('sw-update-available', handleServiceWorkerUpdate);
    };
  }, []);

  const handleUpdate = () => {
    // Reload to activate new service worker
    window.location.reload();
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Show again after 24 hours
    setTimeout(() => setShowPrompt(true), 24 * 60 * 60 * 1000);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9998,
          maxWidth: 400,
          width: '90%',
        }}
      >
        <Card
          sx={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.95)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UpdateIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Update Available
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Version Info */}
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={`Version ${updateInfo?.version}`}
                size="small"
                sx={{ 
                  backgroundColor: 'primary.50',
                  color: 'primary.700',
                  fontWeight: 600
                }}
              />
            </Box>

            {/* Description */}
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              A new version of Store Rating Platform is ready with exciting improvements!
            </Typography>

            {/* Features List */}
            {updateInfo?.features && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, display: 'block' }}>
                  What's New:
                </Typography>
                {updateInfo.features.map((feature, index) => (
                  <Typography key={index} variant="caption" sx={{ display: 'block', color: 'text.secondary', ml: 1 }}>
                    • {feature}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleUpdate}
                sx={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Update Now
              </Button>
              <Button
                variant="outlined"
                startIcon={<LaterIcon />}
                onClick={handleLater}
                sx={{
                  flex: 1,
                  borderColor: 'grey.300',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50'
                  }
                }}
              >
                Later
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdatePrompt;
