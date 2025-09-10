import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // warning, error, success, info
  loading = false,
  maxWidth = 'sm',
  destructive = false,
  children
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getIcon = () => {
    const iconProps = { 
      sx: { fontSize: 48, mb: 1 }
    };

    switch (type) {
      case 'error':
        return <ErrorIcon {...iconProps} color="error" />;
      case 'success':
        return <SuccessIcon {...iconProps} color="success" />;
      case 'info':
        return <InfoIcon {...iconProps} color="info" />;
      default:
        return destructive ? 
          <DeleteIcon {...iconProps} color="error" /> :
          <WarningIcon {...iconProps} color="warning" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'error':
        return {
          primary: theme.palette.error.main,
          secondary: theme.palette.error.light,
          gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        };
      case 'success':
        return {
          primary: theme.palette.success.main,
          secondary: theme.palette.success.light,
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        };
      case 'info':
        return {
          primary: theme.palette.info.main,
          secondary: theme.palette.info.light,
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        };
      default:
        return {
          primary: destructive ? theme.palette.error.main : theme.palette.warning.main,
          secondary: destructive ? theme.palette.error.light : theme.palette.warning.light,
          gradient: destructive ? 
            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        };
    }
  };

  const colors = getColors();

  const iconVariants = {
    initial: { scale: 0, rotate: -90 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 0.3 }
    }
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
          maxWidth={maxWidth}
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          {/* Header with gradient background */}
          <Box
            sx={{
              background: colors.gradient,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated background pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
                backgroundSize: '20px 20px'
              }}
            />

            <DialogTitle
              sx={{
                textAlign: 'center',
                py: 3,
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* Close button */}
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Animated icon */}
              <motion.div
                variants={iconVariants}
                initial="initial"
                animate={["animate", "pulse"]}
              >
                {getIcon()}
              </motion.div>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {title}
              </Typography>
            </DialogTitle>
          </Box>

          <DialogContent sx={{ px: 3, py: 4 }}>
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'text.secondary',
                  mb: children ? 3 : 0
                }}
              >
                {message}
              </Typography>

              {children && (
                <Box sx={{ mt: 2 }}>
                  {children}
                </Box>
              )}
            </motion.div>
          </DialogContent>

          <DialogActions 
            sx={{ 
              px: 3, 
              py: 2, 
              backgroundColor: 'grey.50',
              gap: 1
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              size="large"
              disabled={loading}
              sx={{
                minWidth: 100,
                borderRadius: 2,
                py: 1,
                color: 'text.secondary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'text.secondary',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              {cancelText}
            </Button>

            <Button
              onClick={handleConfirm}
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                minWidth: 100,
                borderRadius: 2,
                py: 1,
                background: colors.gradient,
                '&:hover': {
                  background: colors.gradient,
                  filter: 'brightness(0.9)'
                },
                '&:disabled': {
                  background: 'action.disabledBackground'
                }
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⭮
                </motion.div>
              ) : (
                confirmText
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
