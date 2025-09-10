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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Slider,
  RadioGroup,
  Radio,
  Checkbox
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Integration as IntegrationIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  Backup as BackupIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StoreSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBackupDialog, setOpenBackupDialog] = useState(false);

  const [settings, setSettings] = useState({
    // Business Settings
    businessName: "Milano's Italian Restaurant",
    businessType: 'restaurant',
    taxId: '12-3456789',
    licenseNumber: 'FL-2024-REST-001',
    operatingHours: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    },
    
    // Notification Preferences
    notifications: {
      newReviews: true,
      reviewResponses: true,
      weeklyReports: true,
      monthlyAnalytics: true,
      promotionalEmails: false,
      systemUpdates: true,
      customerMessages: true,
      ratingAlerts: true
    },
    
    // Privacy & Security
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      dataEncryption: true,
      autoLogout: 30,
      passwordExpiry: 90,
      restrictedAccess: false
    },
    
    // Integration Settings
    integrations: {
      googleMyBusiness: true,
      facebook: false,
      instagram: false,
      yelp: true,
      tripadvisor: false,
      deliveryApps: {
        ubereats: false,
        doordash: false,
        grubhub: false
      }
    },
    
    // Display Preferences
    display: {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      showPhotos: true,
      showPrices: true,
      showReviews: true,
      maxPhotosPerReview: 5
    },
    
    // Advanced Settings
    advanced: {
      dataRetention: 365,
      autoBackup: true,
      analyticsTracking: true,
      performanceOptimization: true,
      cacheEnabled: true,
      compressionEnabled: true
    }
  });

  const handleSettingChange = (category, setting, value) => {
    if (typeof category === 'object') {
      // Handle nested settings
      setSettings(prev => ({
        ...prev,
        [Object.keys(category)[0]]: {
          ...prev[Object.keys(category)[0]],
          [setting]: value
        }
      }));
    } else if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [setting]: value
      }));
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBusinessTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Business Information
            </Typography>
            
            <TextField
              fullWidth
              label="Business Name"
              value={settings.businessName}
              onChange={(e) => handleSettingChange(null, 'businessName', e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Business Type</InputLabel>
              <Select
                value={settings.businessType}
                label="Business Type"
                onChange={(e) => handleSettingChange(null, 'businessType', e.target.value)}
              >
                <MenuItem value="restaurant">Restaurant</MenuItem>
                <MenuItem value="retail">Retail Store</MenuItem>
                <MenuItem value="service">Service Business</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
                <MenuItem value="automotive">Automotive</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Tax ID"
              value={settings.taxId}
              onChange={(e) => handleSettingChange(null, 'taxId', e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="License Number"
              value={settings.licenseNumber}
              onChange={(e) => handleSettingChange(null, 'licenseNumber', e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Operating Hours
            </Typography>
            
            {Object.entries(settings.operatingHours).map(([day, hours]) => (
              <Box key={day} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {day}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!hours.closed}
                        onChange={(e) => handleSettingChange(
                          { operatingHours: true },
                          day,
                          { ...hours, closed: !e.target.checked }
                        )}
                        size="small"
                      />
                    }
                    label="Open"
                  />
                </Box>
                {!hours.closed && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      type="time"
                      label="Open"
                      size="small"
                      value={hours.open}
                      onChange={(e) => handleSettingChange(
                        { operatingHours: true },
                        day,
                        { ...hours, open: e.target.value }
                      )}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      type="time"
                      label="Close"
                      size="small"
                      value={hours.close}
                      onChange={(e) => handleSettingChange(
                        { operatingHours: true },
                        day,
                        { ...hours, close: e.target.value }
                      )}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNotificationsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Email Notifications
            </Typography>
            
            <List sx={{ p: 0 }}>
              {[
                { key: 'newReviews', label: 'New Customer Reviews', description: 'Get notified when customers leave reviews' },
                { key: 'reviewResponses', label: 'Review Responses', description: 'When customers respond to your replies' },
                { key: 'weeklyReports', label: 'Weekly Performance Reports', description: 'Summary of your store performance' },
                { key: 'monthlyAnalytics', label: 'Monthly Analytics', description: 'Detailed analytics and insights' }
              ].map((item, index) => (
                <React.Fragment key={item.key}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                    />
                    <Switch
                      checked={settings.notifications[item.key]}
                      onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                    />
                  </ListItem>
                  {index < 3 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Alert Preferences
            </Typography>
            
            <List sx={{ p: 0 }}>
              {[
                { key: 'customerMessages', label: 'Customer Messages', description: 'Direct messages from customers' },
                { key: 'ratingAlerts', label: 'Rating Alerts', description: 'Notifications for new ratings' },
                { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates and announcements' },
                { key: 'promotionalEmails', label: 'Promotional Emails', description: 'Marketing and promotional content' }
              ].map((item, index) => (
                <React.Fragment key={item.key}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                    />
                    <Switch
                      checked={settings.notifications[item.key]}
                      onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                    />
                  </ListItem>
                  {index < 3 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSecurityTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Account Security
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                />
              }
              label="Two-Factor Authentication"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.loginNotifications}
                  onChange={(e) => handleSettingChange('security', 'loginNotifications', e.target.checked)}
                />
              }
              label="Login Notifications"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.dataEncryption}
                  onChange={(e) => handleSettingChange('security', 'dataEncryption', e.target.checked)}
                />
              }
              label="Data Encryption"
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Auto Logout: {settings.security.autoLogout} minutes
              </Typography>
              <Slider
                value={settings.security.autoLogout}
                onChange={(e, value) => handleSettingChange('security', 'autoLogout', value)}
                min={15}
                max={120}
                step={15}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Password Expiry: {settings.security.passwordExpiry} days
              </Typography>
              <Slider
                value={settings.security.passwordExpiry}
                onChange={(e, value) => handleSettingChange('security', 'passwordExpiry', value)}
                min={30}
                max={365}
                step={30}
                marks={[
                  { value: 30, label: '30d' },
                  { value: 90, label: '90d' },
                  { value: 180, label: '180d' },
                  { value: 365, label: '1y' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Data Protection
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Your data is encrypted and securely stored. We follow industry best practices for data protection.
            </Alert>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<BackupIcon />}
                onClick={() => setOpenBackupDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                Backup Data
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{ borderRadius: 2 }}
              >
                Export Data
              </Button>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
              Danger Zone
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Delete Store Account
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderIntegrationsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Social Media & Reviews
            </Typography>
            
            <List sx={{ p: 0 }}>
              {[
                { key: 'googleMyBusiness', label: 'Google My Business', icon: '🌐', status: settings.integrations.googleMyBusiness },
                { key: 'facebook', label: 'Facebook', icon: '👤', status: settings.integrations.facebook },
                { key: 'instagram', label: 'Instagram', icon: '📷', status: settings.integrations.instagram },
                { key: 'yelp', label: 'Yelp', icon: '📝', status: settings.integrations.yelp },
                { key: 'tripadvisor', label: 'TripAdvisor', icon: '✈️', status: settings.integrations.tripadvisor }
              ].map((integration, index) => (
                <React.Fragment key={integration.key}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      <Typography sx={{ fontSize: '1.5rem' }}>{integration.icon}</Typography>
                    </ListItemIcon>
                    <ListItemText primary={integration.label} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={integration.status ? 'Connected' : 'Disconnected'}
                        color={integration.status ? 'success' : 'default'}
                        size="small"
                      />
                      <Switch
                        checked={integration.status}
                        onChange={(e) => handleSettingChange('integrations', integration.key, e.target.checked)}
                      />
                    </Box>
                  </ListItem>
                  {index < 4 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Delivery Platforms
            </Typography>
            
            <List sx={{ p: 0 }}>
              {[
                { key: 'ubereats', label: 'Uber Eats', icon: '🚗', status: settings.integrations.deliveryApps.ubereats },
                { key: 'doordash', label: 'DoorDash', icon: '🏠', status: settings.integrations.deliveryApps.doordash },
                { key: 'grubhub', label: 'Grubhub', icon: '🍕', status: settings.integrations.deliveryApps.grubhub }
              ].map((app, index) => (
                <React.Fragment key={app.key}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon>
                      <Typography sx={{ fontSize: '1.5rem' }}>{app.icon}</Typography>
                    </ListItemIcon>
                    <ListItemText 
                      primary={app.label}
                      secondary="Sync orders and reviews"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={app.status ? 'Active' : 'Inactive'}
                        color={app.status ? 'success' : 'default'}
                        size="small"
                      />
                      <Switch
                        checked={app.status}
                        onChange={(e) => handleSettingChange(
                          { integrations: { deliveryApps: true } },
                          app.key,
                          e.target.checked
                        )}
                      />
                    </Box>
                  </ListItem>
                  {index < 2 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
              Connecting delivery platforms requires additional setup and may have associated fees.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDisplayTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Appearance & Language
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.display.theme}
                label="Theme"
                onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
              >
                <MenuItem value="light">Light Mode</MenuItem>
                <MenuItem value="dark">Dark Mode</MenuItem>
                <MenuItem value="auto">System Default</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.display.language}
                label="Language"
                onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.display.timezone}
                label="Timezone"
                onChange={(e) => handleSettingChange('display', 'timezone', e.target.value)}
              >
                <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Date Format</InputLabel>
              <Select
                value={settings.display.dateFormat}
                label="Date Format"
                onChange={(e) => handleSettingChange('display', 'dateFormat', e.target.value)}
              >
                <MenuItem value="MM/dd/yyyy">MM/DD/YYYY</MenuItem>
                <MenuItem value="dd/MM/yyyy">DD/MM/YYYY</MenuItem>
                <MenuItem value="yyyy-MM-dd">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Content Display
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.display.showPhotos}
                  onChange={(e) => handleSettingChange('display', 'showPhotos', e.target.checked)}
                />
              }
              label="Show Customer Photos"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.display.showPrices}
                  onChange={(e) => handleSettingChange('display', 'showPrices', e.target.checked)}
                />
              }
              label="Display Menu Prices"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.display.showReviews}
                  onChange={(e) => handleSettingChange('display', 'showReviews', e.target.checked)}
                />
              }
              label="Show Customer Reviews"
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Max Photos Per Review: {settings.display.maxPhotosPerReview}
              </Typography>
              <Slider
                value={settings.display.maxPhotosPerReview}
                onChange={(e, value) => handleSettingChange('display', 'maxPhotosPerReview', value)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const tabs = [
    { label: 'Business', icon: <BusinessIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'Security', icon: <SecurityIcon /> },
    { label: 'Integrations', icon: <IntegrationIcon /> },
    { label: 'Display', icon: <ThemeIcon /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
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
                Store Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure your store preferences and business settings
              </Typography>
            </Box>
            
            <Bounce>
              <Button
                variant="contained"
                startIcon={loading ? <RefreshIcon /> : <SaveIcon />}
                onClick={handleSaveSettings}
                disabled={loading}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Bounce>
          </Box>
        </FadeInUp>

        {/* Success Alert */}
        {saveSuccess && (
          <FadeInUp>
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: 3 }}
              icon={<CheckIcon />}
            >
              Settings saved successfully!
            </Alert>
          </FadeInUp>
        )}

        {/* Settings Tabs */}
        <SlideIn direction="up" delay={0.1}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
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
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.icon}
                      {tab.label}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Paper>
        </SlideIn>

        {/* Tab Content */}
        <FadeInUp delay={0.2} key={activeTab}>
          <Paper sx={{ borderRadius: 3, p: 3, minHeight: 500 }}>
            {activeTab === 0 && renderBusinessTab()}
            {activeTab === 1 && renderNotificationsTab()}
            {activeTab === 2 && renderSecurityTab()}
            {activeTab === 3 && renderIntegrationsTab()}
            {activeTab === 4 && renderDisplayTab()}
          </Paper>
        </FadeInUp>
      </Container>

      {/* Delete Account Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Store Account"
        message="Are you sure you want to permanently delete your store account? This action cannot be undone and will remove all your data, reviews, and settings."
        onConfirm={() => {
          console.log('Store account deleted');
          setOpenDeleteDialog(false);
        }}
        confirmText="Delete Account"
        severity="error"
      />

      {/* Backup Dialog */}
      <Dialog open={openBackupDialog} onClose={() => setOpenBackupDialog(false)}>
        <DialogTitle>Backup Store Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Create a complete backup of your store data including settings, reviews, and business information.
          </Typography>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Backup may take a few minutes depending on the amount of data.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBackupDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<BackupIcon />}>
            Start Backup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreSettings;
