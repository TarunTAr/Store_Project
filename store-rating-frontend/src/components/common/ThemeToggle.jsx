import React from 'react';
import { 
  IconButton, 
  Tooltip, 
  Box,
  Typography,
  Paper
} from '@mui/material';
import {
  LightMode as LightIcon,
  DarkMode as DarkIcon,
  Brightness6 as AutoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../../store/themeSlice';

const ThemeToggle = ({ variant = 'icon', showLabel = false, size = 'medium' }) => {
  const dispatch = useDispatch();
  
  // ✅ FIXED: Correct state access
  const mode = useSelector((state) => state.theme.mode);
  const darkMode = mode === 'dark';

  const handleThemeChange = () => {
    dispatch(toggleTheme());
  };

  const handleModeChange = (newMode) => {
    dispatch(setTheme(newMode));
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
    exit: { 
      scale: 0, 
      rotate: 180,
      transition: { duration: 0.15 }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const switchVariants = {
    light: { x: 0 },
    dark: { x: 24 },
    transition: { type: "spring", stiffness: 500, damping: 30 }
  };

  // Simple Icon Toggle
  if (variant === 'icon') {
    return (
      <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
        <IconButton
          onClick={handleThemeChange}
          size={size}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            background: darkMode 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: 'white',
            '&:hover': {
              background: darkMode
                ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={darkMode ? 'dark' : 'light'}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
            >
              {darkMode ? <LightIcon /> : <DarkIcon />}
            </motion.div>
          </AnimatePresence>

          {/* Animated background particles */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%'
                }}
                animate={{
                  x: [0, 40, 0],
                  y: [0, -20, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
                initial={{
                  x: Math.random() * 40,
                  y: Math.random() * 40
                }}
              />
            ))}
          </Box>
        </IconButton>
      </Tooltip>
    );
  }

  // Custom Switch Toggle
  if (variant === 'switch') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showLabel && (
          <Typography variant="body2" color="text.secondary">
            {darkMode ? 'Dark' : 'Light'}
          </Typography>
        )}

        <Box
          sx={{
            position: 'relative',
            width: 56,
            height: 28,
            borderRadius: 14,
            background: darkMode
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}
          onClick={handleThemeChange}
        >
          {/* Switch handle */}
          <motion.div
            variants={switchVariants}
            animate={darkMode ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              width: 24,
              height: 24,
              borderRadius: 12,
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              key={darkMode ? 'moon' : 'sun'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? (
                <DarkIcon sx={{ fontSize: 16, color: '#334155' }} />
              ) : (
                <LightIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
              )}
            </motion.div>
          </motion.div>
        </Box>
      </Box>
    );
  }

  // Advanced Multi-Mode Toggle
  if (variant === 'advanced') {
    const modes = [
      { key: 'light', icon: <LightIcon />, label: 'Light', color: '#f59e0b' },
      { key: 'system', icon: <AutoIcon />, label: 'Auto', color: '#667eea' },
      { key: 'dark', icon: <DarkIcon />, label: 'Dark', color: '#334155' }
    ];

    return (
      <Paper
        elevation={2}
        sx={{
          p: 0.5,
          borderRadius: 3,
          background: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {modes.map((modeOption) => {
            const isActive = mode === modeOption.key;
            
            return (
              <Tooltip key={modeOption.key} title={modeOption.label}>
                <IconButton
                  size="small"
                  onClick={() => handleModeChange(modeOption.key)}
                  sx={{
                    borderRadius: 2,
                    position: 'relative',
                    color: isActive ? 'white' : 'text.secondary',
                    background: isActive ? modeOption.color : 'transparent',
                    '&:hover': {
                      background: isActive 
                        ? modeOption.color 
                        : 'action.hover'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? [1, 1.2, 1] : 1,
                      rotate: isActive ? [0, 10, -10, 0] : 0
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    {modeOption.icon}
                  </motion.div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTheme"
                      style={{
                        position: 'absolute',
                        inset: -2,
                        borderRadius: 8,
                        border: `2px solid ${modeOption.color}`,
                        pointerEvents: 'none'
                      }}
                      initial={false}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30 
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>
      </Paper>
    );
  }

  return null;
};

export default ThemeToggle;
