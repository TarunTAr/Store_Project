import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  GetApp as DownloadIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Code as CsvIcon,
  Print as PrintIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  PlayArrow as RunIcon,
  Pause as PauseIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  BarChart as ChartIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('users');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [scheduledReports, setScheduledReports] = useState([]);
  const [reportHistory, setReportHistory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    type: 'users',
    format: 'pdf',
    frequency: 'weekly',
    recipients: '',
    enabled: true
  });

  // Report types configuration
  const reportTypes = [
    {
      id: 'users',
      title: 'User Analytics Report',
      description: 'Comprehensive user statistics and demographics',
      icon: <PeopleIcon />,
      color: '#667eea',
      fields: ['user_count', 'growth_rate', 'demographics', 'activity_metrics'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'stores',
      title: 'Store Performance Report',
      description: 'Store metrics, ratings, and performance analysis',
      icon: <StoreIcon />,
      color: '#10b981',
      fields: ['store_count', 'category_breakdown', 'top_performers', 'rating_analysis'],
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'ratings',
      title: 'Ratings & Reviews Report',
      description: 'Rating trends, distribution, and sentiment analysis',
      icon: <StarIcon />,
      color: '#f59e0b',
      fields: ['total_ratings', 'avg_rating', 'distribution', 'trends'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'revenue',
      title: 'Revenue Analytics Report',
      description: 'Financial metrics and revenue analysis',
      icon: <TrendingUpIcon />,
      color: '#8b5cf6',
      fields: ['total_revenue', 'growth', 'forecasting', 'breakdown'],
      estimatedTime: '4-5 minutes'
    },
    {
      id: 'comprehensive',
      title: 'Comprehensive Platform Report',
      description: 'Complete overview of all platform metrics',
      icon: <ChartIcon />,
      color: '#ef4444',
      fields: ['all_metrics', 'comparisons', 'insights', 'recommendations'],
      estimatedTime: '8-10 minutes'
    }
  ];

  // Mock data for scheduled reports
  const mockScheduledReports = [
    {
      id: 1,
      name: 'Weekly User Report',
      type: 'users',
      format: 'pdf',
      frequency: 'weekly',
      recipients: 'admin@company.com, manager@company.com',
      enabled: true,
      nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Monthly Store Performance',
      type: 'stores',
      format: 'excel',
      frequency: 'monthly',
      recipients: 'stores@company.com',
      enabled: true,
      nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
    }
  ];

  // Mock data for report history
  const mockReportHistory = [
    {
      id: 1,
      name: 'User Analytics Report',
      type: 'users',
      format: 'pdf',
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: '2.4 MB',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Store Performance Report',
      type: 'stores',
      format: 'excel',
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      size: '5.1 MB',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Monthly Comprehensive Report',
      type: 'comprehensive',
      format: 'pdf',
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      size: '12.8 MB',
      status: 'completed',
      downloadUrl: '#'
    }
  ];

  useEffect(() => {
    setScheduledReports(mockScheduledReports);
    setReportHistory(mockReportHistory);
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    setGenerateProgress(0);
    setOpenDialog(true);

    // Simulate report generation with progress
    const interval = setInterval(() => {
      setGenerateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleScheduleReport = () => {
    // Validate form
    if (!scheduleForm.name || !scheduleForm.recipients) {
      return;
    }

    // Add new scheduled report
    const newReport = {
      ...scheduleForm,
      id: Date.now(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastRun: null
    };

    setScheduledReports(prev => [...prev, newReport]);
    setOpenScheduleDialog(false);
    setScheduleForm({
      name: '',
      type: 'users',
      format: 'pdf',
      frequency: 'weekly',
      recipients: '',
      enabled: true
    });
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf': return <PdfIcon />;
      case 'excel': return <ExcelIcon />;
      case 'csv': return <CsvIcon />;
      default: return <DownloadIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const ReportTypeCard = ({ report, isSelected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: isSelected ? report.color : 'divider',
          cursor: 'pointer',
          height: '100%',
          background: isSelected 
            ? `linear-gradient(135deg, ${report.color}10, ${report.color}05)`
            : 'white',
          '&:hover': {
            borderColor: report.color,
            boxShadow: `0 8px 25px ${report.color}20`
          },
          transition: 'all 0.3s ease'
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                backgroundColor: `${report.color}15`,
                color: report.color,
                width: 56,
                height: 56
              }}
            >
              {report.icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {report.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {report.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {report.fields.slice(0, 3).map((field, index) => (
                  <Chip
                    key={index}
                    label={field.replace('_', ' ')}
                    size="small"
                    sx={{
                      backgroundColor: `${report.color}20`,
                      color: report.color,
                      fontSize: '0.7rem'
                    }}
                  />
                ))}
                {report.fields.length > 3 && (
                  <Chip
                    label={`+${report.fields.length - 3} more`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                ⏱ Est. Time: {report.estimatedTime}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  Reports Center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Generate, schedule, and manage comprehensive platform reports
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setOpenScheduleDialog(true)}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    borderRadius: 3
                  }}
                >
                  Schedule Report
                </Button>
                <Bounce>
                  <Button
                    variant="contained"
                    startIcon={<ReportsIcon />}
                    onClick={handleGenerateReport}
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
                    Generate Report
                  </Button>
                </Bounce>
              </Box>
            </Box>
          </FadeInUp>

          <Grid container spacing={4}>
            {/* Report Configuration */}
            <Grid item xs={12} lg={8}>
              {/* Report Type Selection */}
              <FadeInUp delay={0.1}>
                <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Select Report Type
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {reportTypes.map((report, index) => (
                      <Grid item xs={12} md={6} key={report.id}>
                        <FadeInUp delay={0.1 + index * 0.05}>
                          <ReportTypeCard
                            report={report}
                            isSelected={selectedReportType === report.id}
                            onClick={() => setSelectedReportType(report.id)}
                          />
                        </FadeInUp>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </FadeInUp>

              {/* Report Configuration */}
              <SlideIn direction="up" delay={0.2}>
                <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Report Configuration
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <DatePicker
                        label="Start Date"
                        value={dateRange.start}
                        onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <DatePicker
                        label="End Date"
                        value={dateRange.end}
                        onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Format</InputLabel>
                        <Select
                          value={reportFormat}
                          label="Format"
                          onChange={(e) => setReportFormat(e.target.value)}
                        >
                          <MenuItem value="pdf">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PdfIcon /> PDF Report
                            </Box>
                          </MenuItem>
                          <MenuItem value="excel">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ExcelIcon /> Excel Spreadsheet
                            </Box>
                          </MenuItem>
                          <MenuItem value="csv">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CsvIcon /> CSV Data
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </SlideIn>

              {/* Report History */}
              <SlideIn direction="up" delay={0.3}>
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Report History
                    </Typography>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ backgroundColor: 'grey.50' }}>
                        <TableRow>
                          <TableCell>Report Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Generated</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportHistory.map((report, index) => (
                          <TableRow
                            key={report.id}
                            component={motion.tr}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getFormatIcon(report.format)}
                                {report.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={report.type}
                                size="small"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell>
                              {report.generatedAt.toLocaleDateString()} {report.generatedAt.toLocaleTimeString()}
                            </TableCell>
                            <TableCell>{report.size}</TableCell>
                            <TableCell>
                              <Chip
                                label={report.status}
                                color={getStatusColor(report.status)}
                                size="small"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton size="small" onClick={() => window.open(report.downloadUrl)}>
                                <DownloadIcon />
                              </IconButton>
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                              <IconButton size="small">
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </SlideIn>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Quick Stats */}
              <FadeInUp delay={0.2}>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      Report Statistics
                    </Typography>
                    
                    {[
                      { label: 'Generated Today', value: '12', color: '#667eea' },
                      { label: 'Scheduled Reports', value: '8', color: '#10b981' },
                      { label: 'Total Downloads', value: '1,247', color: '#f59e0b' }
                    ].map((stat, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        py: 1,
                        borderBottom: index < 2 ? '1px solid' : 'none',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="body2">{stat.label}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </FadeInUp>

              {/* Scheduled Reports */}
              <SlideIn direction="right" delay={0.3}>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      Scheduled Reports
                    </Typography>
                    
                    <List>
                      {scheduledReports.map((report, index) => (
                        <ListItem
                          key={report.id}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            backgroundColor: 'grey.50',
                            px: 2
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: report.enabled ? '#10b981' : '#6b7280'
                              }}
                            >
                              <ScheduleIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={report.name}
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block">
                                  {report.frequency} • {report.format.toUpperCase()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Next: {report.nextRun.toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                          />
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => setOpenScheduleDialog(true)}
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      Add Schedule
                    </Button>
                  </CardContent>
                </Card>
              </SlideIn>

              {/* Recent Activity */}
              <SlideIn direction="right" delay={0.4}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      Recent Activity
                    </Typography>
                    
                    <List>
                      {[
                        { action: 'User Report Generated', time: '2 hours ago', icon: <PeopleIcon /> },
                        { action: 'Store Report Scheduled', time: '1 day ago', icon: <ScheduleIcon /> },
                        { action: 'Revenue Report Downloaded', time: '3 days ago', icon: <DownloadIcon /> }
                      ].map((activity, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: '#667eea15',
                                color: '#667eea'
                              }}
                            >
                              {activity.icon}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.action}
                            secondary={activity.time}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </SlideIn>
            </Grid>
          </Grid>
        </Container>

        {/* Generate Report Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => !loading && setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Generating Report
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              {loading ? (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Generating {reportTypes.find(r => r.id === selectedReportType)?.title}...
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={generateProgress}
                    sx={{ mb: 2, borderRadius: 1, height: 8 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {generateProgress}% Complete
                  </Typography>
                </>
              ) : (
                <>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: '#10b981',
                      margin: '0 auto',
                      mb: 2
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: '2rem' }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Report Generated Successfully!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your report is ready for download.
                  </Typography>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            {!loading ? (
              <>
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
                <Button variant="contained" startIcon={<DownloadIcon />}>
                  Download Report
                </Button>
              </>
            ) : null}
          </DialogActions>
        </Dialog>

        {/* Schedule Report Dialog */}
        <Dialog
          open={openScheduleDialog}
          onClose={() => setOpenScheduleDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Schedule Report</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Report Name"
                  value={scheduleForm.name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={scheduleForm.type}
                    label="Report Type"
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={scheduleForm.format}
                    label="Format"
                    onChange={(e) => setScheduleForm({ ...scheduleForm, format: e.target.value })}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={scheduleForm.frequency}
                    label="Frequency"
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recipients (comma separated)"
                  placeholder="admin@company.com, manager@company.com"
                  value={scheduleForm.recipients}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, recipients: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenScheduleDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleScheduleReport}
              disabled={!scheduleForm.name || !scheduleForm.recipients}
            >
              Schedule Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
