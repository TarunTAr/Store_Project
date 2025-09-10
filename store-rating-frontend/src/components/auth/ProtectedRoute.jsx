import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Security as SecurityIcon, Lock as LockIcon } from '@mui/icons-material';
import { checkAuthStatus } from '../../store/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true,
  fallbackPath = '/login' 
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  const { 
    user, 
    isAuthenticated, 
    loading: authLoading, 
    initialized 
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!initialized) {
        try {
          await dispatch(checkAuthStatus()).unwrap();
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsChecking(false);
    };

    initializeAuth();
  }, [dispatch, initialized]);

  // Show loading spinner while checking authentication
  if (isChecking || authLoading || !initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      >
        <LoadingSpinner 
          size="large" 
          message="Verifying access permissions..." 
          variant="pulse"
        />
      </Box>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (isAuthenticated && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);
    
    if (!hasRequiredRole) {
      return <UnauthorizedAccess userRole={user?.role} requiredRoles={allowedRoles} />;
    }
  }

  // Wrap children with AnimatePresence for smooth transitions
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Unauthorized Access Component
const UnauthorizedAccess = ({ userRole, requiredRoles }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const iconVariants = {
    animate: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        p: 3
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box
          sx={{
            maxWidth: 500,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            p: 6,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {/* Animated Icon */}
          <motion.div variants={itemVariants}>
            <motion.div variants={iconVariants} animate="animate">
              <SecurityIcon 
                sx={{ 
                  fontSize: 80, 
                  color: 'warning.main',
                  mb: 3
                }} 
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Access Denied
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              You don't have permission to access this page. This area is restricted to specific user roles.
            </Typography>
          </motion.div>

          {/* Role Information */}
          <motion.div variants={itemVariants}>
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 4, 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Access Requirements:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Your Role:</strong> {userRole || 'Not specified'}
                </Typography>
                <Typography variant="body2">
                  <strong>Required Roles:</strong> {requiredRoles.join(', ')}
                </Typography>
              </Box>
            </Alert>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => window.history.back()}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 3
                }}
              >
                Go Back
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/dashboard'}
                sx={{
                  borderRadius: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }}
              >
                Dashboard
              </Button>
              
              <Button
                variant="text"
                onClick={() => window.location.href = '/contact'}
                sx={{
                  borderRadius: 2,
                  color: 'text.secondary'
                }}
              >
                Contact Support
              </Button>
            </Box>
          </motion.div>

          {/* Additional Info */}
          <motion.div variants={itemVariants}>
            <Typography 
              variant="caption" 
              color="text.disabled" 
              sx={{ mt: 4, display: 'block' }}
            >
              If you believe this is an error, please contact your administrator
            </Typography>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
};

// HOC for creating role-specific protected routes
export const createRoleProtectedRoute = (allowedRoles) => {
  return ({ children }) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      {children}
    </ProtectedRoute>
  );
};

// Predefined role-based route components
export const AdminRoute = createRoleProtectedRoute(['System Administrator']);
export const UserRoute = createRoleProtectedRoute(['Normal User']);
export const StoreOwnerRoute = createRoleProtectedRoute(['Store Owner']);
export const UserOrOwnerRoute = createRoleProtectedRoute(['Normal User', 'Store Owner']);

export default ProtectedRoute;
