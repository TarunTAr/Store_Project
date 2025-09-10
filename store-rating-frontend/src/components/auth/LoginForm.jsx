import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login } from '../../store/authSlice';

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, 
      'Password must contain at least one uppercase letter and one special character')
    .required('Password is required')
});

const LoginForm = ({ onSuccess, embedded = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setFocus
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const watchedFields = watch();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(login({ 
        ...data, 
        rememberMe 
      })).unwrap();
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    try {
      // Implement social login logic here
      console.log(`Social login with ${provider}`);
      setTimeout(() => {
        setSocialLoading(null);
      }, 2000);
    } catch (error) {
      setSocialLoading(null);
      console.error(`${provider} login failed:`, error);
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

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const socialButtonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card
        sx={{
          maxWidth: 480,
          mx: 'auto',
          mt: embedded ? 0 : 4,
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
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 4s ease-in-out infinite reverse'
            }}
          />

          <motion.div variants={itemVariants}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ display: 'inline-block', marginBottom: 16 }}
            >
              <LoginIcon sx={{ fontSize: 48 }} />
            </motion.div>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Sign in to your Store Rating account
            </Typography>
          </motion.div>
        </Box>

        <CardContent sx={{ p: 4 }}>
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
                  onClose={() => {/* Clear error */}}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div variants={itemVariants}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color={errors.email ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        '&.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        }
                      }
                    }}
                    InputLabelProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color={errors.password ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            tabIndex={-1}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        '&.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        }
                      }
                    }}
                  />
                )}
              />
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember me"
                  sx={{ color: 'text.secondary' }}
                />
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !isValid}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)'
                    }
                  }}
                  startIcon={loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon />
                  )}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {[
                { provider: 'google', icon: <GoogleIcon />, color: '#db4437' },
                { provider: 'facebook', icon: <FacebookIcon />, color: '#3b5998' },
                { provider: 'github', icon: <GitHubIcon />, color: '#333' }
              ].map((social) => (
                <motion.div
                  key={social.provider}
                  variants={socialButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  style={{ flex: 1 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin(social.provider)}
                    disabled={socialLoading === social.provider}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      borderColor: 'divider',
                      color: social.color,
                      '&:hover': {
                        borderColor: social.color,
                        backgroundColor: `${social.color}10`
                      }
                    }}
                  >
                    {socialLoading === social.provider ? (
                      <CircularProgress size={20} />
                    ) : (
                      social.icon
                    )}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants}>
            <Typography variant="body2" align="center" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/register')}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </motion.div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </motion.div>
  );
};

export default LoginForm;
