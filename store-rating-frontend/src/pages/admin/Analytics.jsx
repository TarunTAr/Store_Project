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
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import CountUp from '../../components/animations/CountUp';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import AreaChart from '../../components/charts/AreaChart';
import RadarChart from '../../components/charts/RadarChart';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock analytics data
  const kpiData = {
    users: {
      total: 50000,
      growth: 12.5,
      trend: 'up',
      data: [1200, 1900, 3000, 5000, 4200, 3800, 4500]
    },
    stores: {
      total: 15000,
      growth: 8.3,
      trend: 'up',
      data: [400, 600, 1000, 1800, 1200, 1100, 1300]
    },
    ratings: {
      total: 250000,
      growth: 15.2,
      trend: 'up',
      data: [8000, 12000, 18000, 25000, 22000, 20000, 24000]
    },
    revenue: {
      total: 125000,
      growth: -2.1,
      trend: 'down',
      data: [15000, 18000, 22000, 25000, 20000, 18000, 19000]
    }
  };

  // User Analytics Data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'New Users',
      data: [1200, 1900, 3000, 5000, 4200, 3800, 4500],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
    }, {
      label: 'Active Users',
      data: [8000, 12000, 18000, 25000, 22000, 20000, 24000],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    }]
  };

  const userDemographicsData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
    datasets: [{
      data: [25, 35, 20, 15, 5],
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
    }]
  };

  // Store Analytics Data
  const storePerformanceData = {
    labels: ['Restaurant', 'Retail', 'Services', 'Healthcare', 'Electronics'],
    datasets: [{
      label: 'Store Count',
      data: [3500, 4200, 2800, 1800, 2700],
      backgroundColor: '#667eea'
    }, {
      label: 'Avg Rating',
      data: [4.2, 4.5, 4.1, 4.8, 4.3],
      backgroundColor: '#10b981'
    }]
  };

  const topStoresData = [
    { name: "Milano's Restaurant", category: 'Restaurant', rating: 4.8, reviews: 1250 },
    { name: 'TechHub Electronics', category: 'Electronics', rating: 4.7, reviews: 980 },
    { name: 'Green Gardens Pharmacy', category: 'Healthcare', rating: 4.9, reviews: 2100 },
    { name: 'Fashion Forward', category: 'Retail', rating: 4.6, reviews: 756 },
    { name: 'Auto Care Center', category: 'Automotive', rating: 4.5, reviews: 432 }
  ];

  // Rating Analytics Data
  const ratingDistributionData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      data: [2, 5, 15, 35, 43],
      backgroundColor: ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981']
    }]
  };

  const ratingTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Average Rating',
      data: [4.1, 4.2, 4.3, 4.2, 4.4, 4.3, 4.2],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
    }]
  };

  // Performance Radar Data
  const performanceRadarData = {
    labels: ['User Growth', 'Store Quality', 'User Engagement', 'Revenue', 'Retention', 'Support'],
    datasets: [{
      label: 'Current Performance',
      data: [85, 92, 78, 65, 88, 94],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.2)',
    }, {
      label: 'Target Performance',
      data: [90, 95, 85, 80, 90, 95],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
    }]
  };

  const handleExport = (format) => {
    console.log(`Exporting analytics as ${format}`);
    // Implement export logic
  };

  const MetricCard = ({ title, value, growth, trend, icon, color, data }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: selectedMetric === title.toLowerCase() ? color : 'divider',
          cursor: 'pointer',
          height: '100%',
          background: selectedMetric === title.toLowerCase() 
            ? `linear-gradient(135deg, ${color}10, ${color}05)`
            : 'white',
          '&:hover': {
            borderColor: color,
            boxShadow: `0 8px 25px ${color}20`
          },
          transition: 'all 0.3s ease'
        }}
        onClick={() => setSelectedMetric(title.toLowerCase())}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Avatar
              sx={{
                backgroundColor: `${color}15`,
                color: color,
                width: 56,
                height: 56
              }}
            >
              {icon}
            </Avatar>
            <Chip
              icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${Math.abs(growth)}%`}
              color={trend === 'up' ? 'success' : 'error'}
              size="small"
            />
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 800, color, mb: 1 }}>
            <CountUp end={value} duration={2} />
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {title}
          </Typography>
          
          {/* Mini trend chart */}
          <Box sx={{ height: 40, display: 'flex', alignItems: 'end', gap: 1 }}>
            {data.map((point, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  height: `${(point / Math.max(...data)) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.6,
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 1
                  }
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.1}>
              <MetricCard
                title="Users"
                value={kpiData.users.total}
                growth={kpiData.users.growth}
                trend={kpiData.users.trend}
                icon={<PeopleIcon />}
                color="#667eea"
                data={kpiData.users.data}
              />
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.2}>
              <MetricCard
                title="Stores"
                value={kpiData.stores.total}
                growth={kpiData.stores.growth}
                trend={kpiData.stores.trend}
                icon={<StoreIcon />}
                color="#10b981"
                data={kpiData.stores.data}
              />
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.3}>
              <MetricCard
                title="Ratings"
                value={kpiData.ratings.total}
                growth={kpiData.ratings.growth}
                trend={kpiData.ratings.trend}
                icon={<StarIcon />}
                color="#f59e0b"
                data={kpiData.ratings.data}
              />
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.4}>
              <MetricCard
                title="Revenue"
                value={kpiData.revenue.total}
                growth={kpiData.revenue.growth}
                trend={kpiData.revenue.trend}
                icon={<TrendingUpIcon />}
                color="#ef4444"
                data={kpiData.revenue.data}
              />
            </FadeInUp>
          </Grid>
        </Grid>
      </Grid>

      {/* Main Chart */}
      <Grid item xs={12} lg={8}>
        <AreaChart
          title="User & Store Growth Trends"
          data={userGrowthData}
          height={400}
          showArea={true}
          stacked={false}
        />
      </Grid>

      {/* Performance Radar */}
      <Grid item xs={12} lg={4}>
        <RadarChart
          title="Platform Performance"
          data={performanceRadarData}
          height={400}
          showStats={false}
        />
      </Grid>
    </Grid>
  );

  const renderUsersTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <LineChart
          title="User Growth Analytics"
          data={userGrowthData}
          height={400}
          showPoints={true}
          animate={true}
        />
      </Grid>
      
      <Grid item xs={12} lg={4}>
        <DonutChart
          title="User Demographics"
          data={userDemographicsData}
          height={400}
          showStats={true}
          centerMetric="total"
        />
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              User Engagement Metrics
            </Typography>
            
            <Grid container spacing={3}>
              {[
                { label: 'Daily Active Users', value: '12,500', growth: '+8.2%', color: '#667eea' },
                { label: 'Session Duration', value: '8m 32s', growth: '+12%', color: '#10b981' },
                { label: 'Bounce Rate', value: '34%', growth: '-5%', color: '#f59e0b' },
                { label: 'Return Rate', value: '68%', growth: '+15%', color: '#8b5cf6' }
              ].map((metric, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color, mb: 1 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {metric.label}
                    </Typography>
                    <Chip
                      label={metric.growth}
                      size="small"
                      color={metric.growth.startsWith('+') ? 'success' : 'warning'}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderStoresTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <BarChart
          title="Store Performance by Category"
          data={storePerformanceData}
          height={400}
          horizontal={false}
          showGrid={true}
        />
      </Grid>
      
      <Grid item xs={12} lg={4}>
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Top Performing Stores
            </Typography>
            
            <List>
              {topStoresData.map((store, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: 'grey.50',
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                        mr: 2
                      }}
                    >
                      {store.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {store.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="caption">
                          {store.rating} ({store.reviews} reviews)
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={store.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRatingsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <DonutChart
          title="Rating Distribution"
          data={ratingDistributionData}
          height={400}
          showStats={true}
          centerMetric="average"
        />
      </Grid>
      
      <Grid item xs={12} lg={6}>
        <LineChart
          title="Average Rating Trends"
          data={ratingTrendsData}
          height={400}
          showArea={true}
          colors={['#f59e0b']}
        />
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Rating Statistics
            </Typography>
            
            <Grid container spacing={3}>
              {[
                { label: 'Total Ratings', value: '250,000', icon: <StarIcon />, color: '#f59e0b' },
                { label: 'Average Rating', value: '4.2', icon: <ThumbUpIcon />, color: '#10b981' },
                { label: 'This Month', value: '+15,200', icon: <ScheduleIcon />, color: '#667eea' },
                { label: 'Pending Reviews', value: '1,250', icon: <VisibilityIcon />, color: '#8b5cf6' }
              ].map((stat, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    borderRadius: 3, 
                    backgroundColor: `${stat.color}10`,
                    border: `1px solid ${stat.color}30`
                  }}>
                    <Avatar
                      sx={{
                        backgroundColor: stat.color,
                        width: 48,
                        height: 48,
                        margin: '0 auto',
                        mb: 2
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const tabs = [
    { label: 'Overview', icon: <AnalyticsIcon /> },
    { label: 'Users', icon: <PeopleIcon /> },
    { label: 'Stores', icon: <StoreIcon /> },
    { label: 'Ratings', icon: <StarIcon /> }
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
                Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive insights and performance metrics
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
                onClick={() => handleExport('pdf')}
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
                startIcon={<RefreshIcon />}
                onClick={() => setLoading(!loading)}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Refresh Data
              </Button>
            </Box>
          </Box>
        </FadeInUp>

        {/* Analytics Tabs */}
        <SlideIn direction="up" delay={0.2}>
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
        <FadeInUp delay={0.3} key={activeTab}>
          <Paper sx={{ borderRadius: 3, p: 3, minHeight: 600 }}>
            {activeTab === 0 && renderOverviewTab()}
            {activeTab === 1 && renderUsersTab()}
            {activeTab === 2 && renderStoresTab()}
            {activeTab === 3 && renderRatingsTab()}
          </Paper>
        </FadeInUp>
      </Container>
    </Box>
  );
};

export default Analytics;
