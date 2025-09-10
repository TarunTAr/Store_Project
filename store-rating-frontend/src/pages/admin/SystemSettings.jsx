import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
  Storage as DatabaseIcon,
  Language as LanguageIcon,
  Schedule as BackupIcon,
  Speed as PerformanceIcon,
  Shield as PrivacyIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
  RestoreFromTrash as RestoreIcon,
  ExpandMore as ExpandIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Store Rating Platform',
    siteDescription: 'Discover and rate amazing stores in your area',
    contactEmail: 'admin@storerating.com',
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'user',
    
    // Security Settings
    passwordMinLength: 8,
    passwordMaxLength: 16,
    requireSpecialChar: true,
    requireUppercase: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@storerating.com',
    smtpPassword: '',
    emailVerification: true,
    welcomeEmail: true,
    
    // Notification Settings
    pushNotifications: true,
    emailNotifications: true,
    newUserNotifications: true,
    newStoreNotifications: true,
    newRatingNotifications: false,
    
    // Performance Settings
    cacheEnabled: true,
    cacheDuration: 3600,
    compressionEnabled: true,
    cdnEnabled: false,
    
    // Privacy Settings
    cookieConsent: true,
    dataRetentionDays: 365,
    allowAnalytics: true,
    gdprCompliance: true
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [backupDialog, setBackupDialog] = useState(false);
  const [importDialog, setImportDialog] = useState(false);

  const tabs = [
    { label: 'General', icon: <SettingsIcon />, id: 'general' },
    { label: 'Security', icon: <SecurityIcon />, id: 'security' },
    { label: 'Email', icon: <EmailIcon />, id: 'email' },
    { label: 'Notifications', icon: <NotificationsIcon />, id: 'notifications' },
    { label: 'Performance', icon: <PerformanceIcon />, id: 'performance' },
    { label: 'Privacy', icon: <PrivacyIcon />, id: 'privacy' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
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

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="primary" />
              Site Configuration
            </Typography>
            
            <TextField
              fullWidth
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Site Description"
              multiline
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              Access Control
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                />
              }
              label="Maintenance Mode"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowRegistration}
                  onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                />
              }
              label="Allow User Registration"
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Default User Role</InputLabel>
              <Select
                value={settings.defaultUserRole}
                label="Default User Role"
                onChange={(e) => handleSettingChange('defaultUserRole', e.target.value)}
              >
                <MenuItem value="user">Regular User</MenuItem>
                <MenuItem value="store_owner">Store Owner</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Shield color="primary" />
              Password Policy
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Minimum Length: {settings.passwordMinLength}
              </Typography>
              <Slider
                value={settings.passwordMinLength}
                onChange={(e, value) => handleSettingChange('passwordMinLength', value)}
                min={6}
                max={16}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Maximum Length: {settings.passwordMaxLength}
              </Typography>
              <Slider
                value={settings.passwordMaxLength}
                onChange={(e, value) => handleSettingChange('passwordMaxLength', value)}
                min={8}
                max={32}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requireSpecialChar}
                  onChange={(e) => handleSettingChange('requireSpecialChar', e.target.checked)}
                />
              }
              label="Require Special Characters"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requireUppercase}
                  onChange={(e) => handleSettingChange('requireUppercase', e.target.checked)}
                />
              }
              label="Require Uppercase Letters"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              Session & Authentication
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Session Timeout: {settings.sessionTimeout} minutes
              </Typography>
              <Slider
                value={settings.sessionTimeout}
                onChange={(e, value) => handleSettingChange('sessionTimeout', value)}
                min={15}
                max={120}
                step={15}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Max Login Attempts: {settings.maxLoginAttempts}
              </Typography>
              <Slider
                value={settings.maxLoginAttempts}
                onChange={(e, value) => handleSettingChange('maxLoginAttempts', value)}
                min={3}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                />
              }
              label="Two-Factor Authentication"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderEmailSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              SMTP Configuration
            </Typography>
            
            <TextField
              fullWidth
              label="SMTP Host"
              value={settings.smtpHost}
              onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="SMTP Port"
              type="number"
              value={settings.smtpPort}
              onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="SMTP Username"
              value={settings.smtpUsername}
              onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="SMTP Password"
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon color="primary" />
              Email Features
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailVerification}
                  onChange={(e) => handleSettingChange('emailVerification', e.target.checked)}
                />
              }
              label="Email Verification Required"
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.welcomeEmail}
                  onChange={(e) => handleSettingChange('welcomeEmail', e.target.checked)}
                />
              }
              label="Send Welcome Emails"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                sx={{ borderRadius: 2 }}
              >
                Edit Templates
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                sx={{ borderRadius: 2 }}
              >
                Test SMTP
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon color="primary" />
              Notification Preferences
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem sx={{ borderRadius: 2, mb: 1, backgroundColor: 'grey.50' }}>
                    <ListItemIcon>
                      <NotificationsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Push Notifications" />
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ borderRadius: 2, mb: 1, backgroundColor: 'grey.50' }}>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Email Notifications" />
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <List>
                  <ListItem sx={{ borderRadius: 2, mb: 1, backgroundColor: 'grey.50' }}>
                    <ListItemIcon>
                      <AddIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="New User Registrations" />
                    <Switch
                      checked={settings.newUserNotifications}
                      onChange={(e) => handleSettingChange('newUserNotifications', e.target.checked)}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ borderRadius: 2, mb: 1, backgroundColor: 'grey.50' }}>
                    <ListItemIcon>
                      <AddIcon color="info" />
                    </ListItemIcon>
                    <ListItemText primary="New Store Registrations" />
                    <Switch
                      checked={settings.newStoreNotifications}
                      onChange={(e) => handleSettingChange('newStoreNotifications', e.target.checked)}
                    />
                  </ListItem>

                  <ListItem sx={{ borderRadius: 2, backgroundColor: 'grey.50' }}>
                    <ListItemIcon>
                      <AddIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary="New Rating Submissions" />
                    <Switch
                      checked={settings.newRatingNotifications}
                      onChange={(e) => handleSettingChange('newRatingNotifications', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPerformanceSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PerformanceIcon color="primary" />
              Caching
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.cacheEnabled}
                  onChange={(e) => handleSettingChange('cacheEnabled', e.target.checked)}
                />
              }
              label="Enable Caching"
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}
            />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cache Duration: {settings.cacheDuration} seconds
              </Typography>
              <Slider
                value={settings.cacheDuration}
                onChange={(e, value) => handleSettingChange('cacheDuration', value)}
                min={300}
                max={7200}
                step={300}
                marks
                valueLabelDisplay="auto"
                disabled={!settings.cacheEnabled}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.compressionEnabled}
                  onChange={(e) => handleSettingChange('compressionEnabled', e.target.checked)}
                />
              }
              label="Enable Compression"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DatabaseIcon color="primary" />
              Database & CDN
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.cdnEnabled}
                  onChange={(e) => handleSettingChange('cdnEnabled', e.target.checked)}
                />
              }
              label="Enable CDN"
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<BackupIcon />}
                onClick={() => setBackupDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                Backup Database
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RestoreIcon />}
                sx={{ borderRadius: 2 }}
              >
                Restore
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPrivacySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PrivacyIcon color="primary" />
              Privacy & Compliance
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.cookieConsent}
                      onChange={(e) => handleSettingChange('cookieConsent', e.target.checked)}
                    />
                  }
                  label="Cookie Consent Banner"
                  sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowAnalytics}
                      onChange={(e) => handleSettingChange('allowAnalytics', e.target.checked)}
                    />
                  }
                  label="Allow Analytics Tracking"
                  sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.gdprCompliance}
                      onChange={(e) => handleSettingChange('gdprCompliance', e.target.checked)}
                    />
                  }
                  label="GDPR Compliance Mode"
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Data Retention Period: {settings.dataRetentionDays} days
                  </Typography>
                  <Slider
                    value={settings.dataRetentionDays}
                    onChange={(e, value) => handleSettingChange('dataRetentionDays', value)}
                    min={30}
                    max={2555} // 7 years
                    step={30}
                    marks={[
                      { value: 30, label: '30d' },
                      { value: 365, label: '1y' },
                      { value: 1095, label: '3y' },
                      { value: 2555, label: '7y' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
            </Grid>
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
                System Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure platform settings, security, and preferences
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ImportIcon />}
                onClick={() => setImportDialog(true)}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderRadius: 3
                }}
              >
                Import Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderRadius: 3
                }}
              >
                Export Settings
              </Button>
              <Bounce>
                <Button
                  variant="contained"
                  startIcon={loading ? <RefreshIcon /> : <SaveIcon />}
                  onClick={handleSave}
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
        <SlideIn direction="up" delay={0.2}>
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
                  minHeight: 72,
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
                  key={tab.id}
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

        {/* Settings Content */}
        <FadeInUp delay={0.3}>
          <Paper sx={{ borderRadius: 3, p: 4, minHeight: 500 }}>
            {activeTab === 0 && renderGeneralSettings()}
            {activeTab === 1 && renderSecuritySettings()}
            {activeTab === 2 && renderEmailSettings()}
            {activeTab === 3 && renderNotificationSettings()}
            {activeTab === 4 && renderPerformanceSettings()}
            {activeTab === 5 && renderPrivacySettings()}
          </Paper>
        </FadeInUp>
      </Container>

      {/* Backup Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)}>
        <DialogTitle>Database Backup</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Create a complete backup of your database including all users, stores, and ratings.
          </Typography>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Backup may take several minutes depending on data size.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<BackupIcon />}>
            Start Backup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialog} onClose={() => setImportDialog(false)}>
        <DialogTitle>Import Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Import settings from a previously exported configuration file.
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Importing will overwrite current settings. Make sure to backup first.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<ImportIcon />}>
            Choose File
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemSettings;
