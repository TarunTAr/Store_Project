import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false,
  color = 'primary',
  variant = 'circular' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 40;
      case 'large': return 60;
      case 'xl': return 80;
      default: return 40;
    }
  };

  const spinnerVariants = {
    start: { rotate: 0 },
    end: { rotate: 360 }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const DotsSpinner = () => (
    <div className="dots-spinner">
      <motion.div 
        className="dot"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.div 
        className="dot"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div 
        className="dot"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );

  const PulseSpinner = () => (
    <motion.div
      className="pulse-spinner"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      style={{ 
        width: getSize(), 
        height: getSize(),
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    />
  );

  const WaveSpinner = () => (
    <div className="wave-spinner">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="wave-bar"
          animate={{ scaleY: [1, 2, 1] }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            delay: i * 0.1 
          }}
        />
      ))}
    </div>
  );

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />;
      case 'pulse':
        return <PulseSpinner />;
      case 'wave':
        return <WaveSpinner />;
      default:
        return (
          <motion.div
            variants={spinnerVariants}
            animate="end"
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress 
              size={getSize()} 
              thickness={4}
              sx={{
                color: color === 'primary' ? '#667eea' : color,
                '& .MuiCircularProgress-circle': {
                  stroke: 'url(#gradient)',
                }
              }}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        );
    }
  };

  const content = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="loading-container"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          padding: 3,
        }}
      >
        {renderSpinner()}
        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {message}
            </Typography>
          </motion.div>
        )}
        
        {/* Subtle animation hint */}
        <motion.div
          className="loading-hint"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '0.75rem',
            }}
          >
            Please wait...
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );

  if (overlay) {
    return (
      <Box
        className="loading-overlay"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;
