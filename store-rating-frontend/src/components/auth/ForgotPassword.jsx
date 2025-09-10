import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Link,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Send as SendIcon,
  CheckCircle as SuccessIcon,
  ArrowBack as BackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const emailSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
});

const resetSchema = yup.object({
  code: yup
    .string()
    .length(6, 'Reset code must be 6 digits')
    .matches(/^\d+$/, 'Reset code must contain only numbers')
    .required('Reset code is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, 
      'Password must contain at least one uppercase letter and one special character')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password')
});

const steps = ['Enter Email', 'Enter Reset Code', 'Set New Password'];

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    mode: 'onChange'
  });

  const resetForm = useForm({
    resolver: yupResolver(resetSchema),
    mode: 'onChange'
  });

  // Countdown timer for resend code
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendResetCode = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmail(data.email);
      setActiveStep(1);
      setCountdown(60); // 60 seconds countdown
      
      // Mock success - replace with actual API call
      console.log('Reset code sent to:', data.email);
      
    } catch (err) {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success - replace with actual API call
      console.log('Password reset successful for:', email);
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError('Invalid reset code or failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      console.log('Reset code resent to:', email);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
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

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
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
          <Card sx={{ maxWidth: 480, mx: 'auto', borderRadius: 4, textAlign: 'center' }}>
            <CardContent sx={{ p: 6 }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 1 }}
              >
                <SuccessIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
                Password Reset Complete!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your password has been successfully reset. You can now sign in with your new password.
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Redirecting to login page in 3 seconds...
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </motion.div>
    );
  }

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
        <Card
          sx={{
            maxWidth: 500,
            mx: 'auto',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Back Button */}
            <Box sx={{ position: 'absolute', left: 16, top: 16 }}>
              <Button
                onClick={() => navigate('/login')}
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  minWidth: 'auto',
                  p: 1
                }}
              >
                <BackIcon />
              </Button>
            </Box>

            <motion.div variants={itemVariants}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ display: 'inline-block', marginBottom: 16 }}
              >
                <LockIcon sx={{ fontSize: 48 }} />
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Reset Password
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {activeStep === 0 && "Enter your email to receive a reset code"}
                {activeStep === 1 && "Enter the 6-digit code sent to your email"}
                {activeStep === 2 && "Create your new password"}
              </Typography>
            </motion.div>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Stepper */}
            <motion.div variants={itemVariants}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step-0"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <form onSubmit={emailForm.handleSubmit(handleSendResetCode)}>
                    <Controller
                      name="email"
                      control={emailForm.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email Address"
                          type="email"
                          fullWidth
                          autoFocus
                          error={!!emailForm.formState.errors.email}
                          helperText={emailForm.formState.errors.email?.message || 'We\'ll send a reset code to this email'}
                          sx={{ mb: 4 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color={emailForm.formState.errors.email ? 'error' : 'action'} />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || !emailForm.formState.isValid}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                      startIcon={loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendIcon />
                      )}
                    >
                      {loading ? 'Sending...' : 'Send Reset Code'}
                    </Button>
                  </form>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Reset code sent to: <strong>{email}</strong>
                    </Typography>
                  </Box>

                  <Controller
                    name="code"
                    control={resetForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="6-Digit Reset Code"
                        fullWidth
                        autoFocus
                        inputProps={{
                          maxLength: 6,
                          style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }
                        }}
                        error={!!resetForm.formState.errors.code}
                        helperText={resetForm.formState.errors.code?.message}
                        sx={{ mb: 3 }}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    )}
                  />

                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Button
                      onClick={handleResendCode}
                      disabled={countdown > 0 || loading}
                      sx={{ color: 'primary.main' }}
                      startIcon={<RefreshIcon />}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </Button>
                  </Box>

                  <Button
                    onClick={() => setActiveStep(2)}
                    fullWidth
                    variant="contained"
                    disabled={!resetForm.watch('code') || resetForm.formState.errors.code}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    Verify Code
                  </Button>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <form onSubmit={resetForm.handleSubmit(handleVerifyAndReset)}>
                    <Controller
                      name="newPassword"
                      control={resetForm.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="New Password"
                          type="password"
                          fullWidth
                          autoFocus
                          error={!!resetForm.formState.errors.newPassword}
                          helperText={resetForm.formState.errors.newPassword?.message}
                          sx={{ mb: 3 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color={resetForm.formState.errors.newPassword ? 'error' : 'action'} />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="confirmPassword"
                      control={resetForm.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                          error={!!resetForm.formState.errors.confirmPassword}
                          helperText={resetForm.formState.errors.confirmPassword?.message}
                          sx={{ mb: 4 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color={resetForm.formState.errors.confirmPassword ? 'error' : 'action'} />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || !resetForm.formState.isValid}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                      startIcon={loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <LockIcon />
                      )}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to Login */}
            <motion.div variants={itemVariants}>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
                Remember your password?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Back to Login
                </Link>
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ForgotPassword;
