import React, { Component } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Collapse,
  IconButton,
  Alert,
  Chip
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  BugReport as BugIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      expanded: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      expanded: false
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleToggleDetails = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  };

  handleReportBug = () => {
    const errorReport = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // You can send this to your error reporting service
    console.log('Error Report:', errorReport);
    
    // For now, copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    alert('Error details copied to clipboard!');
  };

  render() {
    if (this.state.hasError) {
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
                We encountered an unexpected error. Don't worry, our team has been notified.
              </Typography>

              {this.state.retryCount > 0 && (
                <Chip
                  label={`Retry attempt: ${this.state.retryCount}`}
                  size="small"
                  sx={{ 
                    mt: 2, 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              )}
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Error Type Alert */}
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<BugIcon />}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Error Type: {this.state.error?.name || 'Unknown Error'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {this.state.error?.message || 'No error message available'}
                </Typography>
              </Alert>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                  sx={{
                    flex: 1,
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
                  onClick={this.handleGoHome}
                  sx={{
                    flex: 1,
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

              {/* Advanced Options */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={this.handleToggleDetails}
                  endIcon={
                    <motion.div
                      animate={{ rotate: this.state.expanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExpandIcon />
                    </motion.div>
                  }
                  sx={{ color: 'text.secondary' }}
                >
                  {this.state.expanded ? 'Hide' : 'Show'} Technical Details
                </Button>

                <AnimatePresence>
                  {this.state.expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Collapse in={this.state.expanded}>
                        <Box sx={{ mt: 2, textAlign: 'left' }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Error Stack:
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
                              maxHeight: 200
                            }}
                          >
                            {this.state.error?.stack || 'No stack trace available'}
                          </Box>

                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<BugIcon />}
                              onClick={this.handleReportBug}
                              sx={{ borderRadius: 2 }}
                            >
                              Copy Error Report
                            </Button>
                          </Box>
                        </Box>
                      </Collapse>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
