import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Badge,
  LinearProgress,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Star as StarIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Verified as VerifiedIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Assessment as StatsIcon,
  PhotoCamera as PhotoIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, changePassword, uploadAvatar } from '../../store/userSlice';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
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

const UserProfile = ({
  userId,
  viewMode = 'full', // full, compact, readonly
  onEdit,
  onClose,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { currentUser } = useSelector((state) => state.auth);

  const user = users.find(u => u.id === userId) || currentUser;

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: yupResolver(passwordSchema)
  });

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handlePasswordChange = async (data) => {
    try {
      await dispatch(changePassword({
        userId: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })).unwrap();
      
      setPasswordDialog(false);
      resetPassword();
    } catch (error) {
      console.error('Failed to change password:', error);
    }
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

      // Upload avatar
      try {
        await dispatch(uploadAvatar({
          userId: user.id,
          file
        })).unwrap();
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'system_administrator':
        return <AdminIcon sx={{ fontSize: 20, color: 'error.main' }} />;
      case 'store_owner':
        return <StoreIcon sx={{ fontSize: 20, color: 'warning.main' }} />;
      default:
        return <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'system_administrator':
        return 'error';
      case 'store_owner':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  if (!user) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        User not found
      </Alert>
    );
  }

  if (viewMode === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {user.name?.charAt(0)}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  {user.verified && <VerifiedIcon sx={{ fontSize: 18, color: 'success.main' }} />}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {user.email}
                </Typography>
                
                <Chip
                  icon={getRoleIcon(user.role)}
                  label={user.role}
                  size="small"
                  color={getRoleColor(user.role)}
                />
              </Box>

              {onEdit && (
                <IconButton onClick={() => onEdit(user)} color="primary">
                  <EditIcon />
                </IconButton>
              )}
            </Box>
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
      className={className}
    >
      <Card
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            p: 4,
            position: 'relative'
          }}
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: user.status === 'active' ? 'success.main' : 'error.main',
                        border: '3px solid white'
                      }}
                    />
                  }
                >
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
                    {user.name?.charAt(0)}
                  </Avatar>
                </Badge>

                {currentUser?.id === user.id && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    }}
                    component="label"
                  >
                    <PhotoIcon sx={{ fontSize: 16 }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {user.name}
                    </Typography>
                    {user.verified && (
                      <Tooltip title="Verified User">
                        <VerifiedIcon sx={{ fontSize: 24, color: 'success.main' }} />
                      </Tooltip>
                    )}
                  </Box>

                  {onClose && (
                    <IconButton onClick={onClose}>
                      <CancelIcon />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={user.role}
                    color={getRoleColor(user.role)}
                    sx={{ fontSize: '0.8rem' }}
                  />
                  
                  <Chip
                    icon={user.status === 'active' ? <ActiveIcon /> : <BlockIcon />}
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'error'}
                    sx={{ fontSize: '0.8rem' }}
                  />
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Member since {format(new Date(user.createdAt || Date.now()), 'MMMM yyyy')}
                </Typography>

                {/* Quick Stats */}
                {user.role === 'store_owner' && (
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {user.storeRating?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography variant="caption">Store Rating</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {user.totalReviews || 0}
                      </Typography>
                      <Typography variant="caption">Reviews</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {user.storeViews || 0}
                      </Typography>
                      <Typography variant="caption">Views</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" icon={<PersonIcon />} />
            <Tab label="Settings" icon={<SettingsIcon />} />
            <Tab label="Security" icon={<SecurityIcon />} />
            {user.role === 'store_owner' && <Tab label="Store Stats" icon={<StatsIcon />} />}
            <Tab label="Activity" icon={<HistoryIcon />} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 4 }}>
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 0 && (
              <motion.div
                key="overview"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Contact Information
                      </Typography>

                      <List disablePadding>
                        <ListItem disablePadding sx={{ mb: 2 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <EmailIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Email"
                            secondary={user.email}
                          />
                        </ListItem>

                        {user.phone && (
                          <ListItem disablePadding sx={{ mb: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <PhoneIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Phone"
                              secondary={user.phone}
                            />
                          </ListItem>
                        )}

                        <ListItem disablePadding sx={{ mb: 2 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <LocationIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Address"
                            secondary={user.address}
                          />
                        </ListItem>

                        <ListItem disablePadding>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <DateIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Joined"
                            secondary={format(new Date(user.createdAt || Date.now()), 'PPP')}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Account Status
                      </Typography>

                      <Box sx={{ space: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2">Account Status</Typography>
                          <Chip
                            label={user.status}
                            color={user.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2">Email Verified</Typography>
                          <Chip
                            label={user.verified ? 'Verified' : 'Unverified'}
                            color={user.verified ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2">Last Login</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin)) + ' ago' : 'Never'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Profile Completeness</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                            <LinearProgress
                              variant="determinate"
                              value={85}
                              sx={{ flex: 1, borderRadius: 1 }}
                            />
                            <Typography variant="caption">85%</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 1 && (
              <motion.div
                key="settings"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Account Settings
                </Typography>

                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Settings panel would go here with preferences, notifications, privacy settings, etc.
                  </Typography>
                </Paper>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 2 && (
              <motion.div
                key="security"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Security Settings
                </Typography>

                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 3
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Change Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Update your password to keep your account secure
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      startIcon={<LockIcon />}
                      onClick={() => setPasswordDialog(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      Change Password
                    </Button>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Last changed: {user.passwordChangedAt ? formatDistanceToNow(new Date(user.passwordChangedAt)) + ' ago' : 'Never'}
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Two-Factor Authentication
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add an extra layer of security to your account
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, borderRadius: 2 }}
                    disabled
                  >
                    Setup 2FA (Coming Soon)
                  </Button>
                </Paper>
              </motion.div>
            )}

            {/* Store Stats Tab */}
            {activeTab === 3 && user.role === 'store_owner' && (
              <motion.div
                key="stats"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Store Statistics
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {user.storeRating?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Average Rating
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {user.totalReviews || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Reviews
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {user.storeViews || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Store Views
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {user.monthlyVisitors || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Monthly Visitors
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === 4 && (
              <motion.div
                key="activity"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Recent Activity
                </Typography>

                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Activity log would show recent actions, login history, profile changes, etc.
                  </Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Card>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handlePasswordSubmit(handlePasswordChange)}>
          <DialogContent sx={{ space: 3 }}>
            <Controller
              name="currentPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword?.message}
                />
              )}
            />

            <Controller
              name="newPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword?.message}
                />
              )}
            />
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setPasswordDialog(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};

export default UserProfile;
