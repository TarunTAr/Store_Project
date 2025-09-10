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
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Collapse
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Home as AddressIcon,
  Phone as PhoneIcon,
  PersonAdd as RegisterIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register as registerUser } from '../../store/authSlice';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const schema = yup.object({
  name: yup
    .string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  address: yup
    .string()
    .max(400, 'Address cannot exceed 400 characters')
    .required('Address is required'),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, 
      'Password must contain at least one uppercase letter and one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const steps = ['Personal Info', 'Account Details', 'Confirmation'];

const RegisterForm = ({ onSuccess, embedded = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setFocus
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      address: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const watchedPassword = watch('password');
  const watchedFields = watch();

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  const handleNext = async () => {
    const fieldsToValidate = {
      0: ['name', 'email', 'address', 'phone'],
      1: ['password', 'confirmPassword'],
      2: ['acceptTerms']
    };

    const isStepValid = await trigger(fieldsToValidate[activeStep]);
    
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, acceptTerms, ...userData } = data;
      const result = await dispatch(registerUser(userData)).unwrap();
      
      setRegistrationSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="step-0"
          >
            <Box sx={{ space: 3 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message || 'Enter your full name (20-60 characters)'}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={errors.name ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
              />

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
                    helperText={errors.email?.message || 'We\'ll use this for your account login'}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color={errors.email ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message || `${field.value?.length || 0}/400 characters`}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <AddressIcon color={errors.address ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number (Optional)"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message || 'Enter your contact number'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color={errors.phone ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
              />
            </Box>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="step-1"
          >
            <Box sx={{ space: 3 }}>
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
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
              />

              <PasswordStrengthMeter 
                password={watchedPassword} 
                sx={{ mb: 3 }}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color={errors.confirmPassword ? 'error' : 'action'} />
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
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
              />
            </Box>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="step-2"
          >
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Review Your Information
              </Typography>

              <Box sx={{ 
                background: 'rgba(102, 126, 234, 0.05)', 
                borderRadius: 2, 
                p: 3, 
                mb: 3,
                textAlign: 'left'
              }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {watchedFields.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {watchedFields.email}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> {watchedFields.address}
                </Typography>
                {watchedFields.phone && (
                  <Typography variant="body2">
                    <strong>Phone:</strong> {watchedFields.phone}
                  </Typography>
                )}
              </Box>

              <Controller
                name="acceptTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link href="/terms" target="_blank" color="primary">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" target="_blank" color="primary">
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                    sx={{ 
                      mb: 2,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                )}
              />
              
              {errors.acceptTerms && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                  {errors.acceptTerms.message}
                </Typography>
              )}
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ maxWidth: 480, mx: 'auto', mt: 4, borderRadius: 4, textAlign: 'center' }}>
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
              Welcome Aboard!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your account has been created successfully. You're being redirected to your dashboard...
            </Typography>
            <CircularProgress size={40} />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card
        sx={{
          maxWidth: 600,
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
            textAlign: 'center'
          }}
        >
          <motion.div variants={itemVariants}>
            <RegisterIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Join Store Rating Platform today
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
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {renderStepContent(activeStep)}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !isValid}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4
                  }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RegisterIcon />}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>

          {/* Login Link */}
          <motion.div variants={itemVariants}>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
              Already have an account?{' '}
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
                Sign in here
              </Link>
            </Typography>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
