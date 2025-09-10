import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  Checkbox
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Storage as DataIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD',
    
    // Notification Settings
    emailNotifications: {
      newStores: true,
      ratingUpdates: true,
      weeklyDigest: true,
      promotions: false,
      securityAlerts: true,
      reviewResponses: true
    },
    pushNotifications: {
      enabled: true,
      newStores: true,
      favorites: true,
      recommendations: false,
      reminders: true
    },
    
    // Privacy Settings
    profileVisibility: 'public', // public, friends, private
    showActivity: true,
    showLocation: false,
    allowMessaging: true,
    dataCollection: true,
    
    // Display Settings
    theme: 'system', // light, dark, system
    fontSize: 'medium', // small, medium, large
    animations: true,
    compactMode: false,
    showPhotos: true,
    
    // Location Settings
    locationServices: false,
    autoLocation: false,
    locationAccuracy: 'city', // precise, city, region
    
    // Data Settings
    cacheSize: 50, // MB
    offlineMode: false,
    dataSaver: false,
    autoBackup: true
  });

  const handleSettingChange = (category, setting, value) => {
    if (category) {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const exportData = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'store-rating-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setOpenExportDialog(false);
  };

  const renderGeneralTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Language & Region
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                label="Language"
                onChange={(e) => handleSettingChange(null, 'language', e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.timezone}
                label="Timezone"
                onChange={(e) => handleSettingChange(null, 'timezone', e.target.value)}
              >
                <MenuItem value="America/New_York">Eastern Time (UTC-5)</MenuItem>
                <MenuItem value="America/Chicago">Central Time (UTC-6)</MenuItem>
                <MenuItem value="America/Denver">Mountain Time (UTC-7)</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time (UTC-8)</MenuItem>
                <MenuItem value="Europe/London">GMT (UTC+0)</MenuItem>
                <MenuItem value="Europe/Berlin">CET (UTC+1)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Date Format</InputLabel>
              <Select
                value={settings.dateFormat}
                label="Date Format"
                onChange={(e) => handleSettingChange(null, 'dateFormat', e.target.value)}
              >
                <MenuItem value="MM/dd/yyyy">MM/DD/YYYY</MenuItem>
                <MenuItem value="dd/MM/yyyy">DD/MM/YYYY</MenuItem>
                <MenuItem value="yyyy-MM-dd">YYYY-MM-DD</MenuItem>
                <MenuItem value="dd MMM yyyy">DD MMM YYYY</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={settings.currency}
                label="Currency"
                onChange={(e) => handleSettingChange(null, 'currency', e.target.value)}
              >
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
                <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Display Preferences
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme}
                label="Theme"
                onChange={(e) => handleSettingChange(null, 'theme', e.target.value)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={settings.fontSize}
                label="Font Size"
                onChange={(e) => handleSettingChange(null, 'fontSize', e.target.value)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.animations}
                    onChange={(e) => handleSettingChange(null, 'animations', e.target.checked)}
                  />
                }
                label="Enable Animations"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.compactMode}
                    onChange={(e) => handleSettingChange(null, 'compactMode', e.target.checked)}
                  />
                }
                label="Compact Mode"
              />
            </Box>
            
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showPhotos}
                    onChange={(e) => handleSettingChange(null, 'showPhotos', e.target.checked)}
                  />
                }
                label="Show Store Photos"
              />
            </Box>
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
            
            <List>
              {[
                { key: 'newStores', label: 'New Stores in Your Area', description: 'Get notified when new stores are added near you' },
                { key: 'ratingUpdates', label: 'Rating Updates', description: 'When stores you rated receive new reviews' },
                { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of your activity and recommendations' },
                { key: 'promotions', label: 'Promotions & Deals', description: 'Special offers from stores you follow' },
                { key: 'securityAlerts', label: 'Security Alerts', description: 'Important account security notifications' },
                { key: 'reviewResponses', label: 'Review Responses', description: 'When store owners respond to your reviews' }
              ].map((item, index) => (
                <React.Fragment key={item.key}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                    />
                    <Switch
                      checked={settings.emailNotifications[item.key]}
                      onChange={(e) => handleSettingChange('emailNotifications', item.key, e.target.checked)}
                    />
                  </ListItem>
                  {index < 5 && <Divider />}
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
              Push Notifications
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications.enabled}
                    onChange={(e) => handleSettingChange('pushNotifications', 'enabled', e.target.checked)}
                  />
                }
                label="Enable Push Notifications"
              />
            </Box>
            
            <List>
              {[
                { key: 'newStores', label: 'New Stores' },
                { key: 'favorites', label: 'Favorite Store Updates' },
                { key: 'recommendations', label: 'Personalized Recommendations' },
                { key: 'reminders', label: 'Review Reminders' }
              ].map((item, index) => (
                <React.Fragment key={item.key}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText primary={item.label} />
                    <Switch
                      checked={settings.pushNotifications[item.key]}
                      onChange={(e) => handleSettingChange('pushNotifications', item.key, e.target.checked)}
                      disabled={!settings.pushNotifications.enabled}
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

  const renderPrivacyTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Profile Privacy
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              Profile Visibility
            </Typography>
            <RadioGroup
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange(null, 'profileVisibility', e.target.value)}
              sx={{ mb: 3 }}
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="Public - Anyone can see your profile"
              />
              <FormControlLabel
                value="friends"
                control={<Radio />}
                label="Friends Only - Only connections can see your profile"
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="Private - Only you can see your profile"
              />
            </RadioGroup>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showActivity}
                    onChange={(e) => handleSettingChange(null, 'showActivity', e.target.checked)}
                  />
                }
                label="Show Activity Feed"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showLocation}
                    onChange={(e) => handleSettingChange(null, 'showLocation', e.target.checked)}
                  />
                }
                label="Show Location in Reviews"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowMessaging}
                    onChange={(e) => handleSettingChange(null, 'allowMessaging', e.target.checked)}
                  />
                }
                label="Allow Direct Messages"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataCollection}
                    onChange={(e) => handleSettingChange(null, 'dataCollection', e.target.checked)}
                  />
                }
                label="Allow Analytics Data Collection"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Location Settings
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.locationServices}
                    onChange={(e) => handleSettingChange(null, 'locationServices', e.target.checked)}
                  />
                }
                label="Enable Location Services"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoLocation}
                    onChange={(e) => handleSettingChange(null, 'autoLocation', e.target.checked)}
                    disabled={!settings.locationServices}
                  />
                }
                label="Automatic Location Detection"
              />
            </Box>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Location Accuracy</InputLabel>
              <Select
                value={settings.locationAccuracy}
                label="Location Accuracy"
                onChange={(e) => handleSettingChange(null, 'locationAccuracy', e.target.value)}
                disabled={!settings.locationServices}
              >
                <MenuItem value="precise">Precise Location</MenuItem>
                <MenuItem value="city">City Level</MenuItem>
                <MenuItem value="region">Region Level</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Location data helps us show you nearby stores and improve recommendations.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDataTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Data & Storage
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cache Size: {settings.cacheSize} MB
              </Typography>
              <Slider
                value={settings.cacheSize}
                onChange={(e, value) => handleSettingChange(null, 'cacheSize', value)}
                min={10}
                max={200}
                step={10}
                marks={[
                  { value: 10, label: '10MB' },
                  { value: 100, label: '100MB' },
                  { value: 200, label: '200MB' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.offlineMode}
                    onChange={(e) => handleSettingChange(null, 'offlineMode', e.target.checked)}
                  />
                }
                label="Offline Mode"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataSaver}
                    onChange={(e) => handleSettingChange(null, 'dataSaver', e.target.checked)}
                  />
                }
                label="Data Saver Mode"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange(null, 'autoBackup', e.target.checked)}
                  />
                }
                label="Automatic Backup"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => setOpenExportDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                Export Data
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => setOpenImportDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                Import Data
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ borderRadius: 2 }}
              >
                Clear Cache
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Data Usage Summary
            </Typography>
            
            <List>
              {[
                { label: 'Profile Data', size: '2.4 MB' },
                { label: 'Reviews & Ratings', size: '15.7 MB' },
                { label: 'Store Images', size: '45.2 MB' },
                { label: 'Cached Content', size: `${settings.cacheSize} MB` },
                { label: 'Settings Backup', size: '0.1 MB' }
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary={item.label} />
                    <Typography variant="body2" color="text.secondary">
                      {item.size}
                    </Typography>
                  </ListItem>
                  {index < 4 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            <Box sx={{ mt: 3 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  Total data usage: ~{(63.4 + settings.cacheSize).toFixed(1)} MB
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const tabs = [
    { label: 'General', icon: <SettingsIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'Privacy', icon: <SecurityIcon /> },
    { label: 'Data', icon: <DataIcon /> }
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
                Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Customize your app experience and preferences
              </Typography>
            </Box>
            
            <Bounce>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
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
            <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
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
              variant="fullWidth"
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
            {activeTab === 0 && renderGeneralTab()}
            {activeTab === 1 && renderNotificationsTab()}
            {activeTab === 2 && renderPrivacyTab()}
            {activeTab === 3 && renderDataTab()}
          </Paper>
        </FadeInUp>
      </Container>

      {/* Export Data Dialog */}
      <Dialog open={openExportDialog} onClose={() => setOpenExportDialog(false)}>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This will download a JSON file containing all your settings and preferences.
          </Typography>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Your exported data will not include personal information like passwords or payment details.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExportData} startIcon={<DownloadIcon />}>
            Export Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Data Dialog */}
      <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)}>
        <DialogTitle>Import Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Upload a previously exported settings file to restore your preferences.
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Importing will overwrite your current settings. Make sure to export first if you want to keep them.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImportDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<UploadIcon />}>
            Choose File
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
