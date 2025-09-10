import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import ParticleBackground from '../../components/animations/ParticleBackground';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock authentication logic
      const mockUsers = [
        { email: 'admin@storerating.com', password: 'Admin@123', role: 'admin' },
        { email: 'user@storerating.com', password: 'User@123', role: 'user' },
        { email: 'owner@storerating.com', password: 'Owner@123', role: 'store_owner' }
      ];

      const user = mockUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Dispatch login action
        // dispatch(loginSuccess(user));
        
        // Navigate based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'store_owner':
            navigate('/owner/dashboard');
            break;
          default:
            navigate('/user/dashboard');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Particle Background */}
      <ParticleBackground
        variant="floating"
        particleCount={50}
        colors={['#ffffff', '#f093fb', '#4facfe']}
        interactive={true}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <SlideIn direction="up" delay={0.2}>
          <Paper
            elevation={20}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 4,
                pb: 2,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                  onClick={() => navigate('/')}
                  sx={{ mr: 1, color: '#667eea' }}
                >
                  <BackIcon />
                </IconButton>
                <Typography variant="h6" color="text.secondary">
                  Back to Home
                </Typography>
              </Box>

              <FadeInUp delay={0.3}>
                <Typography
                  variant="h3"
                  align="center"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 1
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Sign in to your account to continue rating stores
                </Typography>
              </FadeInUp>
            </Box>

            {/* Form */}
            <Box sx={{ p: 4 }}>
              {error && (
                <FadeInUp>
                  <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                </FadeInUp>
              )}

              <form onSubmit={handleSubmit}>
                <FadeInUp delay={0.4}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                  />
                </FadeInUp>

                <FadeInUp delay={0.5}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                  />
                </FadeInUp>

                <FadeInUp delay={0.6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          sx={{ color: '#667eea' }}
                        />
                      }
                      label="Remember me"
                    />
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      sx={{
                        color: '#667eea',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                </FadeInUp>

                <FadeInUp delay={0.7}>
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: '#ccc'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </FadeInUp>
              </form>

              {/* Demo Credentials */}
              <FadeInUp delay={0.8}>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px dashed #667eea'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#667eea' }}>
                    Demo Credentials:
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    Admin: admin@storerating.com / Admin@123
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    User: user@storerating.com / User@123
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Store Owner: owner@storerating.com / Owner@123
                  </Typography>
                </Box>
              </FadeInUp>

              {/* Social Login */}
              <FadeInUp delay={0.9}>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Or continue with
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  {[
                    { icon: <GoogleIcon />, color: '#db4437', name: 'Google' },
                    { icon: <FacebookIcon />, color: '#4267B2', name: 'Facebook' },
                    { icon: <TwitterIcon />, color: '#1DA1F2', name: 'Twitter' }
                  ].map((social, index) => (
                    <motion.div
                      key={social.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        onClick={() => handleSocialLogin(social.name)}
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: `${social.color}15`,
                          color: social.color,
                          border: `1px solid ${social.color}30`,
                          '&:hover': {
                            backgroundColor: `${social.color}25`,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 15px ${social.color}30`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </FadeInUp>

              {/* Sign Up Link */}
              <FadeInUp delay={1}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 3 }}
                >
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </FadeInUp>
            </Box>
          </Paper>
        </SlideIn>
      </Container>
    </Box>
  );
};

export default Login;
