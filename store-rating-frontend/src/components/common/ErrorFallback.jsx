// ==========================================================================
// ErrorFallback Component - Store Rating Platform
// Fallback UI component that matches the ErrorBoundary design
// ==========================================================================

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Collapse,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  BugReport as BugIcon,
  Home as HomeIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const [expanded, setExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleToggleDetails = () => {
    setExpanded(prev => !prev);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportBug = async () => {
    const errorReport = {
      error: error?.toString() || 'Unknown error',
      message: error?.message || 'No message available',
      stack: error?.stack || 'No stack trace available',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      platform: 'Store Rating Platform'
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy error report:', err);
      alert('Failed to copy error details. Please check console for error information.');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            textAlign: 'center'
          }}
        >
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <ErrorIcon sx={{ fontSize: 64, mb: 2 }} />
          </motion.div>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            We encountered an unexpected error in the Store Rating Platform.
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Error Alert */}
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<BugIcon />}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Error: {error?.name || 'Unknown Error'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {error?.message || 'An unexpected error occurred while processing your request.'}
            </Typography>
          </Alert>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={resetErrorBoundary}
              sx={{
                flex: { xs: '1 1 100%', sm: 1 },
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              Try Again
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                flex: { xs: '1 1 100%', sm: 1 },
                py: 1.5,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#5a6fd8',
                  backgroundColor: 'rgba(102, 126, 234, 0.04)'
                }
              }}
            >
              Go Home
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Error Reporting Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={copySuccess ? <CopyIcon /> : <BugIcon />}
              onClick={handleReportBug}
              disabled={copySuccess}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                ...(copySuccess && {
                  borderColor: 'success.main',
                  color: 'success.main'
                })
              }}
            >
              {copySuccess ? 'Copied!' : 'Copy Error Report'}
            </Button>

            <Button
              variant="text"
              size="small"
              onClick={handleToggleDetails}
              endIcon={
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExpandIcon />
                </motion.div>
              }
              sx={{ 
                color: 'text.secondary',
                textTransform: 'none'
              }}
            >
              {expanded ? 'Hide' : 'Show'} Technical Details
            </Button>
          </Box>

          {/* Expandable Error Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Collapse in={expanded}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Error Details:
                    </Typography>
                    
                    {/* Error Information */}
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={`Type: ${error?.name || 'Unknown'}`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip 
                        label={`Time: ${new Date().toLocaleString()}`}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    {/* Stack Trace */}
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Stack Trace:
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1,
                        border: '1px solid #e9ecef',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        overflow: 'auto',
                        maxHeight: 200,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {error?.stack || 'No stack trace available'}
                    </Box>

                    {/* Additional Context */}
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f9ff', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                        Context Information:
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        • URL: {window.location.href}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        • Platform: Store Rating Platform
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        • Browser: {navigator.userAgent.split(' ').pop()}
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Text */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              If this error persists, please copy the error report and contact support.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ErrorFallback;
