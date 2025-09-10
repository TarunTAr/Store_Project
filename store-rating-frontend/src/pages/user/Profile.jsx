import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  LinearProgress,
  Badge,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  PhotoCamera as CameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  Store as StoreIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as AwardIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Verified as VerifiedIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import CountUp from '../../components/animations/CountUp';
import ImageUpload from '../../components/common/ImageUpload';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'John Smith Williams Anderson',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown City, State 12345, United States of America',
    bio: 'Passionate food lover and tech enthusiast. Love discovering new stores and sharing experiences with the community.',
    avatar: '/api/placeholder/120/120',
    joinedDate: '2024-01-15',
    verified: true,
    level: 'Expert Reviewer',
    points: 1250,
    preferences: {
      publicProfile: true,
      showEmail: false,
      showPhone: false,
      showActivity: true
    }
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const userStats = {
    totalRatings: 25,
    avgRating: 4.2,
    helpfulVotes: 42,
    favoriteStores: 8,
    reviewsThisMonth: 5,
    streakDays: 7
  };

  const recentActivity = [
    {
      id: 1,
      type: 'rating',
      store: "Milano's Italian Restaurant",
      action: 'Rated 5 stars',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      type: 'favorite',
      store: 'TechHub Electronics',
      action: 'Added to favorites',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      type: 'review',
      store: 'Green Gardens Pharmacy',
      action: 'Wrote a detailed review',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  const validateProfile = () => {
    const newErrors = {};
    
    if (!editData.name || editData.name.length < 20 || editData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }
    
    if (!editData.email || !/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (editData.address && editData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProfileData({ ...editData });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (newAvatar) => {
    setEditData({ ...editData, avatar: newAvatar });
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to logout or home
      navigate('/login', { 
        state: { message: 'Account deleted successfully' } 
      });
    } catch (error) {
      setErrors({ submit: 'Failed to delete account. Please try again.' });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      {/* Profile Header */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              position: 'relative'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={isEditing ? editData.avatar : profileData.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }}
                />
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'white',
                      color: '#667eea',
                      '&:hover': { backgroundColor: '#f8fafc' }
                    }}
                  >
                    <CameraIcon />
                  </IconButton>
                )}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {profileData.name.split(' ').slice(0, 2).join(' ')}
                  </Typography>
                  {profileData.verified && (
                    <VerifiedIcon sx={{ color: '#10b981' }} />
                  )}
                  <Chip
                    label={profileData.level}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
                
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  {profileData.bio}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      <CountUp end={profileData.points} />
                    </Typography>
                    <Typography variant="caption">Points</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      <CountUp end={userStats.totalRatings} />
                    </Typography>
                    <Typography variant="caption">Reviews</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {userStats.avgRating}
                    </Typography>
                    <Typography variant="caption">Avg Rating</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box>
                <Button
                  variant={isEditing ? 'contained' : 'outlined'}
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  disabled={loading}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    backgroundColor: isEditing ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {isEditing ? (loading ? <CircularProgress size={20} /> : 'Save') : 'Edit Profile'}
                </Button>
                
                {isEditing && (
                  <IconButton
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ ...profileData });
                      setErrors({});
                    }}
                    sx={{ 
                      ml: 1, 
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* Profile Form */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={isEditing ? editData.name : profileData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  disabled={!isEditing}
                  error={!!errors.name}
                  helperText={errors.name || 'Min 20, Max 60 characters'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-disabled': {
                        backgroundColor: 'grey.50'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={isEditing ? editData.email : profileData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  disabled={!isEditing}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-disabled': {
                        backgroundColor: 'grey.50'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={isEditing ? editData.phone : profileData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-disabled': {
                        backgroundColor: 'grey.50'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={isEditing ? editData.address : profileData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  disabled={!isEditing}
                  error={!!errors.address}
                  helperText={errors.address || 'Max 400 characters'}
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-disabled': {
                        backgroundColor: 'grey.50'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={isEditing ? editData.bio : profileData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell others about yourself, your interests, and what kind of places you enjoy..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-disabled': {
                        backgroundColor: 'grey.50'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Privacy Settings */}
            {isEditing && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Privacy Settings
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editData.preferences.publicProfile}
                        onChange={(e) => setEditData({
                          ...editData,
                          preferences: { ...editData.preferences, publicProfile: e.target.checked }
                        })}
                      />
                    }
                    label="Public Profile"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editData.preferences.showEmail}
                        onChange={(e) => setEditData({
                          ...editData,
                          preferences: { ...editData.preferences, showEmail: e.target.checked }
                        })}
                      />
                    }
                    label="Show Email Address"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editData.preferences.showActivity}
                        onChange={(e) => setEditData({
                          ...editData,
                          preferences: { ...editData.preferences, showActivity: e.target.checked }
                        })}
                      />
                    }
                    label="Show Activity Feed"
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Stats & Activity */}
      <Grid item xs={12} md={4}>
        <Grid container spacing={3}>
          {/* Account Stats */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Account Statistics
                </Typography>
                
                <List sx={{ p: 0 }}>
                  {[
                    { icon: <StarIcon />, label: 'Total Reviews', value: userStats.totalRatings, color: '#667eea' },
                    { icon: <TrendingIcon />, label: 'Helpful Votes', value: userStats.helpfulVotes, color: '#10b981' },
                    { icon: <StoreIcon />, label: 'Favorite Stores', value: userStats.favoriteStores, color: '#f59e0b' },
                    { icon: <AwardIcon />, label: 'Current Streak', value: `${userStats.streakDays} days`, color: '#ef4444' }
                  ].map((stat, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            backgroundColor: `${stat.color}15`,
                            color: stat.color,
                            width: 40,
                            height: 40
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={stat.label}
                        secondary={stat.value}
                        secondaryTypographyProps={{
                          sx: { fontWeight: 600, color: stat.color }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recent Activity
                </Typography>
                
                <List sx={{ p: 0 }}>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              backgroundColor: '#667eea15',
                              color: '#667eea',
                              width: 32,
                              height: 32
                            }}
                          >
                            {activity.type === 'rating' ? <StarIcon /> : 
                             activity.type === 'favorite' ? <StoreIcon /> : <EditIcon />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.store}
                          secondary={activity.action}
                          secondaryTypographyProps={{
                            sx: { fontSize: '0.75rem' }
                          }}
                        />
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderSecurityTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Change Password
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
                
                {passwordData.newPassword && (
                  <Box sx={{ mt: 2 }}>
                    <PasswordStrengthMeter password={passwordData.newPassword} />
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleChangePassword}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Account Security
            </Typography>
            
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Email Verification"
                  secondary="Your email address has been verified"
                />
                <Chip label="Verified" color="success" size="small" />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security"
                />
                <Switch />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Login Notifications"
                  secondary="Get notified of new logins"
                />
                <Switch defaultChecked />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
              Danger Zone
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDeleteDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              Profile Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your personal information and account preferences
            </Typography>
          </Box>
        </FadeInUp>

        {/* Success Alert */}
        {saveSuccess && (
          <FadeInUp>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
              Changes saved successfully!
            </Alert>
          </FadeInUp>
        )}

        {/* Profile Tabs */}
        <SlideIn direction="up" delay={0.1}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                backgroundColor: 'grey.50',
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: '#667eea'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                  height: 3
                }
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    Profile
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon />
                    Security
                  </Box>
                }
              />
            </Tabs>
          </Paper>
        </SlideIn>

        {/* Tab Content */}
        <FadeInUp delay={0.2} key={activeTab}>
          {activeTab === 0 && renderProfileTab()}
          {activeTab === 1 && renderSecurityTab()}
        </FadeInUp>
      </Container>

      {/* Delete Account Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone and will remove all your reviews and data."
        onConfirm={handleDeleteAccount}
        confirmText="Delete Account"
        severity="error"
      />
    </Box>
  );
};

export default Profile;
