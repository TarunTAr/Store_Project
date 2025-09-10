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
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import ParticleBackground from '../../components/animations/ParticleBackground';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';

const Register = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = ['Personal Info', 'Account Setup', 'Verification'];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name || formData.name.length < 20 || formData.name.length > 60) {
        newErrors.name = 'Name must be between 20 and 60 characters';
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 1) {
      if (!formData.address || formData.address.length > 400) {
        newErrors.address = 'Address is required (max 400 characters)';
      }
      if (!formData.password || !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(formData.password)) {
        newErrors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - show success message and redirect
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please sign in to continue.' 
        }
      });
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
    // Implement social registration logic
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FadeInUp delay={0.3}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name || 'Enter your full name (20-60 characters)'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  )
                }}
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

            <FadeInUp delay={0.4}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email || 'We will use this to send you updates'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  )
                }}
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
          </Box>
        );

      case 1:
        return (
          <Box>
            <FadeInUp delay={0.3}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                error={!!errors.address}
                helperText={errors.address || 'Your address (max 400 characters)'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  )
                }}
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

            <FadeInUp delay={0.4}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
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

            {formData.password && (
              <FadeInUp delay={0.5}>
                <Box sx={{ mb: 3 }}>
                  <PasswordStrengthMeter password={formData.password} />
                </Box>
              </FadeInUp>
            )}

            <FadeInUp delay={0.6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
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
          </Box>
        );

      case 2:
        return (
          <Box>
            <FadeInUp delay={0.3}>
              <Card
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#667eea' }}>
                    Account Summary
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>Name:</strong> {formData.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>Email:</strong> {formData.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>Address:</strong> {formData.address.substring(0, 50)}...
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    sx={{ color: '#667eea' }}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href="#" sx={{ color: '#667eea' }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" sx={{ color: '#667eea' }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
              {errors.agreeToTerms && (
                <Typography variant="body2" color="error" sx={{ ml: 4 }}>
                  {errors.agreeToTerms}
                </Typography>
              )}
            </FadeInUp>

            {errors.submit && (
              <FadeInUp delay={0.5}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {errors.submit}
                </Alert>
              </FadeInUp>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4
      }}
    >
      {/* Particle Background */}
      <ParticleBackground
        variant="network"
        particleCount={40}
        colors={['#ffffff', '#f093fb', '#4facfe']}
        interactive={true}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
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
                  Create Account
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Join our community and start rating stores today
                </Typography>
              </FadeInUp>
            </Box>

            {/* Stepper */}
            <Box sx={{ p: 4, pb: 2 }}>
              <FadeInUp delay={0.4}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          '& .MuiStepLabel-label': {
                            fontWeight: 600
                          },
                          '& .MuiStepIcon-root': {
                            color: '#e0e0e0',
                            '&.Mui-active': {
                              color: '#667eea'
                            },
                            '&.Mui-completed': {
                              color: '#10b981'
                            }
                          }
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </FadeInUp>
            </Box>

            {/* Form Content */}
            <Box sx={{ p: 4 }}>
              {renderStepContent(activeStep)}

              {/* Social Registration (only on first step) */}
              {activeStep === 0 && (
                <FadeInUp delay={0.5}>
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Or register with
                    </Typography>
                  </Divider>

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
                    {[
                      { icon: <GoogleIcon />, color: '#db4437', name: 'Google' },
                      { icon: <FacebookIcon />, color: '#4267B2', name: 'Facebook' },
                      { icon: <TwitterIcon />, color: '#1DA1F2', name: 'Twitter' }
                    ].map((social) => (
                      <motion.div
                        key={social.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          onClick={() => handleSocialRegister(social.name)}
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
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Back
                </Button>

                <Bounce>
                  <Button
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontSize: '1rem',
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
                    ) : activeStep === steps.length - 1 ? (
                      'Create Account'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </Bounce>
              </Box>

              {/* Sign In Link */}
              <FadeInUp delay={0.6}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 3 }}
                >
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign in here
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

export default Register;
