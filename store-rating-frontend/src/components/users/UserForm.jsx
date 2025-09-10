import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Switch,
  FormControlLabel,
  InputAdornment,
  Paper,
  Divider,
  Collapse
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PhotoCamera as PhotoIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminIcon,
  Store as StoreIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser } from '../../store/userSlice';
import { uploadImage } from '../../utils/imageUtils';

const schema = yup.object({
  name: yup
    .string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .required('Name is required'),
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
    .when('isEditing', {
      is: false,
      then: (schema) => schema.required('Password is required')
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .when('password', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required('Please confirm your password')
    }),
  role: yup
    .string()
    .oneOf(['user', 'store_owner', 'admin'], 'Please select a valid role')
    .required('Role is required'),
  address: yup
    .string()
    .max(400, 'Address cannot exceed 400 characters')
    .required('Address is required'),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
});

const steps = ['Basic Info', 'Account Details', 'Additional Info'];

const UserForm = ({
  user = null,
  onSuccess,
  onCancel,
  embedded = false,
  showRoleSelection = true
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const { currentUser } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema.concat(yup.object({
      isEditing: yup.boolean().default(!!user)
    }))),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      role: user?.role || 'user',
      address: user?.address || '',
      phone: user?.phone || '',
      isActive: user?.status === 'active' ?? true,
      isVerified: user?.verified ?? false,
      isEditing: !!user
    }
  });

  const watchedRole = watch('role');
  const watchedPassword = watch('password');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
        address: user.address,
        phone: user.phone || '',
        isActive: user.status === 'active',
        isVerified: user.verified,
        isEditing: true
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user, reset]);

  const handleNext = async () => {
    const fieldsToValidate = {
      0: ['name', 'email'],
      1: ['password', 'confirmPassword', 'role'],
      2: ['address']
    };

    const isStepValid = await trigger(fieldsToValidate[activeStep]);
    
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      let avatarUrl = avatarPreview;
      
      // Upload avatar if new file selected
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      const userData = {
        name: data.name,
        email: data.email,
        role: data.role,
        address: data.address,
        phone: data.phone,
        avatar: avatarUrl,
        status: data.isActive ? 'active' : 'inactive',
        verified: data.isVerified
      };

      // Only include password if it's provided
      if (data.password) {
        userData.password = data.password;
      }

      let result;
      if (user) {
        result = await dispatch(updateUser({ id: user.id, ...userData })).unwrap();
      } else {
        result = await dispatch(createUser(userData)).unwrap();
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result);
        }
      }, 1500);

    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
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

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="step-0"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              {/* Avatar Upload */}
              <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={avatarPreview}
                    sx={{
                      width: 100,
                      height: 100,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: '4px solid white',
                      boxShadow: 3
                    }}
                  >
                    {watch('name')?.charAt(0) || <PersonIcon sx={{ fontSize: 40 }} />}
                  </Avatar>
                  
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    }}
                    component="label"
                  >
                    <PhotoIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                </Box>
                
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                  Click the camera icon to upload avatar
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message || `${field.value?.length || 0}/60 characters (min 20)`}
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
              </Grid>

              <Grid item xs={12}>
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
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number (Optional)"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
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
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={user ? 'New Password (leave empty to keep current)' : 'Password'}
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
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
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </Grid>

              {watchedPassword && (
                <Grid item xs={12}>
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
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />
                    )}
                  />
                </Grid>
              )}

              {showRoleSelection && (
                <Grid item xs={12}>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.role}>
                        <InputLabel>User Role</InputLabel>
                        <Select
                          {...field}
                          label="User Role"
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="user">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                              Normal User
                            </Box>
                          </MenuItem>
                          <MenuItem value="store_owner">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <StoreIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                              Store Owner
                            </Box>
                          </MenuItem>
                          <MenuItem value="admin">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AdminIcon sx={{ fontSize: 18, color: 'error.main' }} />
                              System Administrator
                            </Box>
                          </MenuItem>
                        </Select>
                        {errors.role && (
                          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                            {errors.role.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* Role Description */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Role Permissions:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {watchedRole === 'admin' && 
                      'Full access to manage users, stores, and system settings. Can add/edit/delete all content.'
                    }
                    {watchedRole === 'store_owner' && 
                      'Can manage their own store profile, view ratings and reviews, update store information.'
                    }
                    {watchedRole === 'user' && 
                      'Can browse stores, submit ratings and reviews, manage their own profile.'
                    }
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <LocationIcon color={errors.address ? 'error' : 'action'} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Advanced Options */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Advanced Options
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    sx={{ textTransform: 'none' }}
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Options
                  </Button>
                </Box>

                <Collapse in={showAdvanced}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'grey.50'
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="isActive"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  color="primary"
                                />
                              }
                              label="Active User"
                              sx={{ mb: 1 }}
                            />
                          )}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Inactive users cannot log in to the system
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="isVerified"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  color="success"
                                />
                              }
                              label="Verified User"
                              sx={{ mb: 1 }}
                            />
                          )}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Verified users have a checkmark badge
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Collapse>
              </Grid>

              {/* Summary */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Review Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Name:</strong> {watch('name')}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {watch('email')}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Role:</strong> {watch('role')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Phone:</strong> {watch('phone') || 'Not provided'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Status:</strong> {watch('isActive') ? 'Active' : 'Inactive'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Verified:</strong> {watch('isVerified') ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        variants={successVariants}
        initial="hidden"
        animate="visible"
      >
        <Card
          sx={{
            maxWidth: 400,
            mx: 'auto',
            borderRadius: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(102, 187, 106, 0.1) 100%)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.8 }}
            >
              <SuccessIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            </motion.div>
            
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'success.main' }}>
              {user ? 'User Updated!' : 'User Created!'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              {user ? 'User information has been updated successfully.' : 'New user has been created successfully.'}
            </Typography>
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
          maxWidth: embedded ? '100%' : 700,
          mx: embedded ? 0 : 'auto',
          borderRadius: 4,
          boxShadow: embedded ? 'none' : '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            position: 'relative'
          }}
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {user ? 'Edit User' : 'Create New User'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user ? 'Update user information and permissions' : 'Add a new user to the system'}
                </Typography>
              </Box>

              {onCancel && (
                <IconButton
                  onClick={onCancel}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
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
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
              <Box>
                {onCancel && (
                  <Button
                    onClick={onCancel}
                    startIcon={<CancelIcon />}
                    sx={{ borderRadius: 2, mr: 2 }}
                  >
                    Cancel
                  </Button>
                )}
                
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ borderRadius: 2 }}
                >
                  Back
                </Button>
              </Box>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !isValid}
                  startIcon={loading ? null : user ? <EditIcon /> : <SaveIcon />}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4
                  }}
                >
                  {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserForm;
