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
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Store as StoreIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as CameraIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import ImageUpload from '../../components/common/ImageUpload';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const MyStore = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openHoursDialog, setOpenHoursDialog] = useState(false);

  const [storeData, setStoreData] = useState({
    id: 1,
    name: "Milano's Italian Restaurant",
    category: "Restaurant",
    description: "Authentic Italian cuisine with a modern twist. We pride ourselves on using fresh, locally-sourced ingredients to create traditional dishes that bring the taste of Italy to your table.",
    address: "123 Main Street, Downtown City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@milanos.com",
    website: "https://milanos.com",
    image: "/api/placeholder/120/120",
    coverImage: "/api/placeholder/800/400",
    rating: 4.8,
    totalReviews: 1250,
    isVerified: true,
    isActive: true,
    joinedDate: "2023-06-15",
    tags: ["Italian", "Fine Dining", "Romantic", "Family-friendly"],
    priceRange: "$$$",
    features: {
      delivery: true,
      takeout: true,
      dineIn: true,
      parking: true,
      wifi: true,
      accessibility: true
    },
    socialMedia: {
      facebook: "https://facebook.com/milanos",
      instagram: "https://instagram.com/milanos",
      twitter: "https://twitter.com/milanos"
    },
    businessHours: {
      monday: { open: "11:00", close: "22:00", closed: false },
      tuesday: { open: "11:00", close: "22:00", closed: false },
      wednesday: { open: "11:00", close: "22:00", closed: false },
      thursday: { open: "11:00", close: "22:00", closed: false },
      friday: { open: "11:00", close: "23:00", closed: false },
      saturday: { open: "11:00", close: "23:00", closed: false },
      sunday: { open: "12:00", close: "21:00", closed: false }
    }
  });

  const [editData, setEditData] = useState({ ...storeData });
  const [errors, setErrors] = useState({});

  const categories = [
    "Restaurant", "Electronics", "Healthcare", "Fashion", "Automotive",
    "Books", "Sports", "Grocery", "Beauty", "Home & Garden"
  ];

  const validateStore = () => {
    const newErrors = {};
    
    if (!editData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    
    if (!editData.email || !/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!editData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!editData.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateStore()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStoreData({ ...editData });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to update store. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...storeData });
    setIsEditing(false);
    setErrors({});
  };

  const handleFeatureToggle = (feature) => {
    setEditData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const renderStoreInfoTab = () => (
    <Grid container spacing={3}>
      {/* Store Profile Header */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Cover Image */}
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${isEditing ? editData.coverImage : storeData.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              p: 3
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
              }}
            />
            {isEditing && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'white' }
                }}
              >
                <CameraIcon />
              </IconButton>
            )}
            
            <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={isEditing ? editData.image : storeData.image}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '4px solid white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                />
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <CameraIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
              
              <Box sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {storeData.name}
                  </Typography>
                  {storeData.isVerified && (
                    <VerifiedIcon sx={{ color: '#10b981' }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={storeData.category}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ color: '#ffd700', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {storeData.rating}
                    </Typography>
                    <Typography variant="body2">
                      ({storeData.totalReviews} reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* Store Details Form */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Store Information
              </Typography>
              
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    borderRadius: 2
                  }}
                >
                  Edit Info
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Store Name"
                  value={isEditing ? editData.name : storeData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  disabled={!isEditing}
                  error={!!errors.name}
                  helperText={errors.name}
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
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={isEditing ? editData.category : storeData.category}
                    label="Category"
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    error={!!errors.category}
                    sx={{ borderRadius: 2 }}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price Range"
                  value={isEditing ? editData.priceRange : storeData.priceRange}
                  onChange={(e) => setEditData({ ...editData, priceRange: e.target.value })}
                  disabled={!isEditing}
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
                  label="Description"
                  multiline
                  rows={4}
                  value={isEditing ? editData.description : storeData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  disabled={!isEditing}
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
                  rows={2}
                  value={isEditing ? editData.address : storeData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  disabled={!isEditing}
                  error={!!errors.address}
                  helperText={errors.address}
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                  value={isEditing ? editData.phone : storeData.phone}
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
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={isEditing ? editData.email : storeData.email}
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
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  value={isEditing ? editData.website : storeData.website}
                  onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <WebsiteIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Store Features & Settings */}
      <Grid item xs={12} md={4}>
        <Grid container spacing={3}>
          {/* Store Features */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Store Features
                </Typography>
                
                {Object.entries(storeData.features).map(([feature, enabled]) => (
                  <FormControlLabel
                    key={feature}
                    control={
                      <Switch
                        checked={isEditing ? editData.features[feature] : enabled}
                        onChange={() => handleFeatureToggle(feature)}
                        disabled={!isEditing}
                      />
                    }
                    label={feature.charAt(0).toUpperCase() + feature.slice(1)}
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      m: 0,
                      mb: 1,
                      width: '100%'
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Business Hours */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Business Hours
                  </Typography>
                  <IconButton
                    onClick={() => setOpenHoursDialog(true)}
                    size="small"
                    disabled={!isEditing}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                
                <List sx={{ p: 0 }}>
                  {Object.entries(storeData.businessHours).map(([day, hours]) => (
                    <ListItem key={day} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={day.charAt(0).toUpperCase() + day.slice(1)}
                        secondary={
                          hours.closed 
                            ? 'Closed' 
                            : `${hours.open} - ${hours.close}`
                        }
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.8rem'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Actions
                </Typography>
                
                <List sx={{ p: 0 }}>
                  {[
                    { icon: <ShareIcon />, text: 'Share Store Profile', color: '#667eea' },
                    { icon: <QrCodeIcon />, text: 'Generate QR Code', color: '#10b981' },
                    { icon: <DownloadIcon />, text: 'Download Store Kit', color: '#f59e0b' },
                    { icon: <VisibilityIcon />, text: 'Preview Public View', color: '#8b5cf6' }
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem
                        button
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: `${action.color}10`
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: `${action.color}15`,
                              color: action.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {action.icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={action.text}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderSettingsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Store Visibility
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={storeData.isActive}
                  onChange={(e) => setStoreData({ ...storeData, isActive: e.target.checked })}
                />
              }
              label="Store is Active and Visible"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              When disabled, your store will not appear in search results and users cannot rate it.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Notifications
            </Typography>
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications for new reviews"
              sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Weekly performance reports"
              sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={<Switch />}
              label="Marketing promotions"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
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
              sx={{ borderRadius: 2 }}
            >
              Delete Store
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
              My Store
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your store information and settings
            </Typography>
          </Box>
        </FadeInUp>

        {/* Success Alert */}
        {saveSuccess && (
          <FadeInUp>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
              Store information updated successfully!
            </Alert>
          </FadeInUp>
        )}

        {/* Store Tabs */}
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
                    <StoreIcon />
                    Store Information
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon />
                    Settings
                  </Box>
                }
              />
            </Tabs>
          </Paper>
        </SlideIn>

        {/* Tab Content */}
        <FadeInUp delay={0.2} key={activeTab}>
          {activeTab === 0 && renderStoreInfoTab()}
          {activeTab === 1 && renderSettingsTab()}
        </FadeInUp>
      </Container>

      {/* Business Hours Dialog */}
      <Dialog
        open={openHoursDialog}
        onClose={() => setOpenHoursDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Business Hours</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Set your operating hours for each day of the week.
          </Typography>
          {/* Business hours editing form would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHoursDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Save Hours
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyStore;
