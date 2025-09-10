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
  Tabs,
  Tab,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  DeviceHub as DeviceIcon,
  Language as LanguageIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Assessment as ReportIcon,
  Timeline as TimelineIcon,
  CompareArrows as CompareIcon,
  Speed as PerformanceIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import CountUp from '../../components/animations/CountUp';
import StatsCard from '../../components/dashboard/StatsCard';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import AreaChart from '../../components/charts/AreaChart';

const StoreAnalytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalViews: 12500,
      uniqueVisitors: 4800,
      conversionRate: 3.2,
      avgSessionDuration: '4m 32s',
      bounceRate: 28.5,
      returningVisitors: 35.2
    },
    performance: {
      pageLoadTime: 2.1,
      mobileScore: 94,
      desktopScore: 98,
      seoScore: 89
    },
    demographics: {
      ageGroups: {
        '18-24': 15,
        '25-34': 35,
        '35-44': 28,
        '45-54': 15,
        '55+': 7
      },
      gender: {
        male: 42,
        female: 58
      },
      topCities: [
        { name: 'New York', percentage: 32 },
        { name: 'Los Angeles', percentage: 18 },
        { name: 'Chicago', percentage: 12 },
        { name: 'Houston', percentage: 9 },
        { name: 'Phoenix', percentage: 7 }
      ]
    }
  };

  // Chart data
  const trafficData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Total Views',
      data: [8500, 9200, 10100, 11500, 12000, 11800, 12500],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
    }, {
      label: 'Unique Visitors',
      data: [3200, 3500, 3800, 4200, 4500, 4300, 4800],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    }]
  };

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [45, 48, 7],
      backgroundColor: ['#667eea', '#10b981', '#f59e0b']
    }]
  };

  const sourceData = {
    labels: ['Direct', 'Google Search', 'Social Media', 'Referrals', 'Email'],
    datasets: [{
      data: [35, 28, 18, 12, 7],
      backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    }]
  };

  const conversionFunnelData = {
    labels: ['Store Views', 'Menu Views', 'Contact Info', 'Reviews Read', 'Action Taken'],
    datasets: [{
      label: 'Visitors',
      data: [12500, 8900, 6200, 4100, 1800],
      backgroundColor: '#667eea'
    }]
  };

  const peakHoursData = {
    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'],
    datasets: [{
      label: 'Page Views',
      data: [120, 200, 350, 450, 580, 420, 380, 420, 520, 680, 750, 650],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Views"
              value={<CountUp end={analyticsData.overview.totalViews} duration={2} />}
              subtitle="This month"
              icon={<VisibilityIcon />}
              color="#667eea"
              trend="up"
              trendValue="18.2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Unique Visitors"
              value={<CountUp end={analyticsData.overview.uniqueVisitors} duration={2} />}
              subtitle="New customers"
              icon={<PeopleIcon />}
              color="#10b981"
              trend="up"
              trendValue="12.5"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Conversion Rate"
              value={`${analyticsData.overview.conversionRate}%`}
              subtitle="Views to actions"
              icon={<TrendingUpIcon />}
              color="#f59e0b"
              trend="up"
              trendValue="0.8"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Avg Session"
              value={analyticsData.overview.avgSessionDuration}
              subtitle="Time on page"
              icon={<ScheduleIcon />}
              color="#8b5cf6"
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Traffic Chart */}
      <Grid item xs={12} lg={8}>
        <AreaChart
          title="Traffic Overview"
          data={trafficData}
          height={400}
          showArea={true}
          stacked={false}
        />
      </Grid>

      {/* Device Breakdown */}
      <Grid item xs={12} lg={4}>
        <DonutChart
          title="Device Usage"
          data={deviceData}
          height={400}
          showStats={true}
          centerMetric="total"
        />
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12}>
        <Paper sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Performance Indicators
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                  {analyticsData.overview.bounceRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bounce Rate
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={100 - analyticsData.overview.bounceRate}
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 3,
                    '& .MuiLinearProgress-bar': { borderRadius: 3 }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
                  {analyticsData.overview.returningVisitors}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Returning Visitors
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analyticsData.overview.returningVisitors}
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 3,
                    '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: '#667eea' }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                  {analyticsData.performance.mobileScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mobile Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analyticsData.performance.mobileScore}
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 3,
                    '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: '#f59e0b' }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6', mb: 1 }}>
                  {analyticsData.performance.seoScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SEO Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analyticsData.performance.seoScore}
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 3,
                    '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: '#8b5cf6' }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTrafficTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <LineChart
          title="Peak Hours Analysis"
          data={peakHoursData}
          height={400}
          showArea={true}
          animate={true}
        />
      </Grid>
      
      <Grid item xs={12} lg={4}>
        <DonutChart
          title="Traffic Sources"
          data={sourceData}
          height={400}
          showStats={true}
          centerMetric="total"
        />
      </Grid>

      <Grid item xs={12}>
        <BarChart
          title="Conversion Funnel"
          data={conversionFunnelData}
          height={350}
          horizontal={false}
          showGrid={true}
        />
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Top Performing Pages
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Page</TableCell>
                  <TableCell align="right">Views</TableCell>
                  <TableCell align="right">Avg Time</TableCell>
                  <TableCell align="right">Bounce Rate</TableCell>
                  <TableCell align="right">Conversions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { page: 'Store Profile', views: 4200, time: '3m 45s', bounce: '22%', conversions: 156 },
                  { page: 'Menu & Reviews', views: 3800, time: '5m 12s', bounce: '18%', conversions: 98 },
                  { page: 'Contact Info', views: 2100, time: '1m 30s', bounce: '45%', conversions: 45 },
                  { page: 'Photo Gallery', views: 1900, time: '2m 18s', bounce: '35%', conversions: 23 }
                ].map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.page}</TableCell>
                    <TableCell align="right">{row.views.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.time}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={row.bounce}
                        size="small"
                        color={parseFloat(row.bounce) < 30 ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell align="right">{row.conversions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderDemographicsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Age Distribution
          </Typography>
          
          {Object.entries(analyticsData.demographics.ageGroups).map(([age, percentage]) => (
            <Box key={age} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{age} years</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {percentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': { borderRadius: 4 }
                }}
              />
            </Box>
          ))}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Top Cities
          </Typography>
          
          <List sx={{ p: 0 }}>
            {analyticsData.demographics.topCities.map((city, index) => (
              <ListItem key={index} sx={{ px: 0, py: 1 }}>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                      fontSize: '0.8rem'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={city.name}
                  secondary={
                    <LinearProgress
                      variant="determinate"
                      value={city.percentage}
                      sx={{
                        mt: 0.5,
                        height: 4,
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': { borderRadius: 2 }
                      }}
                    />
                  }
                />
                <Typography variant="body2" sx={{ fontWeight: 600, ml: 2 }}>
                  {city.percentage}%
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Customer Insights
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Strong Mobile Audience
                </Typography>
                <Typography variant="body2">
                  48% of your visitors use mobile devices. Consider mobile-first optimizations.
                </Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Peak Hours
                </Typography>
                <Typography variant="body2">
                  Most activity between 6-8 PM. Perfect timing for dinner promotions.
                </Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Opportunity
                </Typography>
                <Typography variant="body2">
                  Low engagement in 55+ age group. Consider targeted campaigns.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );

  const tabs = [
    { label: 'Overview', icon: <AnalyticsIcon /> },
    { label: 'Traffic', icon: <TimelineIcon /> },
    { label: 'Demographics', icon: <PeopleIcon /> }
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
                Store Analytics
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Detailed insights into your store's performance and customer behavior
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="7d">Last 7 days</MenuItem>
                  <MenuItem value="30d">Last 30 days</MenuItem>
                  <MenuItem value="90d">Last 90 days</MenuItem>
                  <MenuItem value="1y">Last year</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderRadius: 2
                }}
              >
                Export Report
              </Button>
              
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Share Insights
              </Button>
            </Box>
          </Box>
        </FadeInUp>

        {/* Analytics Tabs */}
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
          <Paper sx={{ borderRadius: 3, p: 3, minHeight: 600 }}>
            {activeTab === 0 && renderOverviewTab()}
            {activeTab === 1 && renderTrafficTab()}
            {activeTab === 2 && renderDemographicsTab()}
          </Paper>
        </FadeInUp>
      </Container>
    </Box>
  );
};

export default StoreAnalytics;
