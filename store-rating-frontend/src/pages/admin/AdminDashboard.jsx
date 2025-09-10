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
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  Assessment as ReportIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import CountUp from '../../components/animations/CountUp';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartContainer from '../../components/dashboard/ChartContainer';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuickActions from '../../components/dashboard/QuickActions';
import TopStores from '../../components/dashboard/TopStores';
import UserEngagement from '../../components/dashboard/UserEngagement';
import RatingTrends from '../../components/dashboard/RatingTrends';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [anchorEl, setAnchorEl] = useState(null);

  // Mock dashboard data
  const dashboardStats = {
    totalUsers: 50000,
    totalStores: 15000,
    totalRatings: 250000,
    avgRating: 4.2,
    newUsersToday: 120,
    newStoresToday: 45,
    newRatingsToday: 890,
    activeUsers: 12500
  };

  // Mock chart data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Users',
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
    }, {
      label: 'New Stores',
      data: [400, 600, 1000, 1800, 800, 1200],
      borderColor: '#764ba2',
      backgroundColor: 'rgba(118, 75, 162, 0.1)',
    }]
  };

  const categoryDistribution = {
    labels: ['Restaurants', 'Retail', 'Services', 'Healthcare', 'Electronics'],
    datasets: [{
      data: [35, 25, 20, 12, 8],
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
    }]
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_registered',
      title: 'New user registration',
      description: 'John Smith registered as a new user',
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      metadata: { userName: 'John Smith' },
      read: false
    },
    {
      id: 2,
      type: 'store_created',
      title: 'New store added',
      description: 'Pizza Palace was added to the platform',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      metadata: { storeName: 'Pizza Palace' },
      read: false
    },
    {
      id: 3,
      type: 'rating_submitted',
      title: 'New rating submitted',
      description: 'User rated Milano Restaurant with 5 stars',
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      metadata: { storeName: 'Milano Restaurant', rating: 5 },
      read: true
    }
  ];

  const topStoresData = [
    {
      id: 1,
      name: "Milano's Italian Restaurant",
      rating: 4.8,
      reviewCount: 1250,
      category: "Restaurant",
      logo: "/api/placeholder/60/60"
    },
    {
      id: 2,
      name: "TechHub Electronics",
      rating: 4.6,
      reviewCount: 890,
      category: "Electronics",
      logo: "/api/placeholder/60/60"
    },
    {
      id: 3,
      name: "Green Gardens Pharmacy",
      rating: 4.9,
      reviewCount: 2100,
      category: "Healthcare",
      logo: "/api/placeholder/60/60"
    }
  ];

  const quickActionItems = [
    {
      id: 'add-user',
      label: 'Add User',
      icon: <PeopleIcon />,
      color: '#667eea',
      description: 'Create new user account',
      onClick: () => navigate('/admin/users/create')
    },
    {
      id: 'add-store',
      label: 'Add Store',
      icon: <StoreIcon />,
      color: '#10b981',
      description: 'Register new store',
      onClick: () => navigate('/admin/stores/create')
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      icon: <ReportIcon />,
      color: '#f59e0b',
      description: 'Generate analytics reports',
      onClick: () => navigate('/admin/reports')
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: <SettingsIcon />,
      color: '#ef4444',
      description: 'Configure system settings',
      onClick: () => navigate('/admin/settings')
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <DashboardIcon sx={{ fontSize: '2rem' }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    Admin Dashboard
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Welcome back! Here's what's happening with your platform.
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  sx={{
                    backgroundColor: 'white',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 3 }
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    backgroundColor: 'white',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 3 }
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </FadeInUp>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Users"
              value={<CountUp end={dashboardStats.totalUsers} duration={2} />}
              subtitle={`+${dashboardStats.newUsersToday} today`}
              icon={<PeopleIcon />}
              color="#667eea"
              trend="up"
              trendValue="12.5"
              onClick={() => navigate('/admin/users')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Stores"
              value={<CountUp end={dashboardStats.totalStores} duration={2} />}
              subtitle={`+${dashboardStats.newStoresToday} today`}
              icon={<StoreIcon />}
              color="#10b981"
              trend="up"
              trendValue="8.3"
              onClick={() => navigate('/admin/stores')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Ratings"
              value={<CountUp end={dashboardStats.totalRatings} duration={2} />}
              subtitle={`+${dashboardStats.newRatingsToday} today`}
              icon={<StarIcon />}
              color="#f59e0b"
              trend="up"
              trendValue="15.2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Avg Rating"
              value={dashboardStats.avgRating}
              subtitle="Platform average"
              icon={<TrendingIcon />}
              color="#ef4444"
              trend="up"
              trendValue="5.7"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <ChartContainer
              title="User & Store Growth"
              subtitle="Monthly growth trends"
              data={userGrowthData}
              chartType="line"
              height={350}
              showControls={true}
              onTimeRangeChange={setTimeRange}
              timeRange={timeRange}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <DonutChart
              title="Store Categories"
              data={categoryDistribution}
              height={350}
              showStats={true}
              centerMetric="total"
            />
          </Grid>
        </Grid>

        {/* Activity & Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <RecentActivity
              activities={recentActivities}
              showHeader={true}
              showFilters={true}
              maxItems={10}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <SlideIn direction="right" delay={0.3}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Common administrative tasks
                  </Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {quickActionItems.map((action, index) => (
                      <Grid item xs={6} key={action.id}>
                        <FadeInUp delay={0.1 * index}>
                          <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              onClick={action.onClick}
                              sx={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: action.color,
                                  boxShadow: `0 8px 25px ${action.color}20`
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Avatar
                                  sx={{
                                    backgroundColor: `${action.color}15`,
                                    color: action.color,
                                    width: 40,
                                    height: 40,
                                    margin: '0 auto',
                                    mb: 1
                                  }}
                                >
                                  {action.icon}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {action.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {action.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </FadeInUp>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </SlideIn>
          </Grid>
        </Grid>

        {/* Top Stores */}
        <TopStores
          stores={topStoresData}
          variant="list"
          showRankings={true}
          showTrends={true}
          maxItems={5}
          onStoreClick={(store) => navigate(`/admin/stores/${store.id}`)}
        />

        {/* Analytics Summary */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <UserEngagement
              variant="metrics"
              data={{
                totalUsers: dashboardStats.totalUsers,
                activeUsers: dashboardStats.activeUsers,
                avgSessionDuration: 12.5,
                engagementRate: 78.5
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RatingTrends
              data={{
                avgRating: dashboardStats.avgRating,
                totalRatings: dashboardStats.totalRatings,
                dailyAvg: Math.floor(dashboardStats.totalRatings / 30)
              }}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/admin/settings')}>
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={() => navigate('/admin/analytics')}>
          <AnalyticsIcon sx={{ mr: 1 }} />
          Analytics
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/admin/security')}>
          <SecurityIcon sx={{ mr: 1 }} />
          Security
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminDashboard;
