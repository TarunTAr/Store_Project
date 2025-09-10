import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Button,
  LinearProgress,
  Divider,
  Badge,
  Alert,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Store as StoreIcon,
  Star as StarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  ThumbUp as ThumbUpIcon,
  Chat as ChatIcon,
  MoreVert as MoreIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Notifications as NotificationsIcon,
  LocalOffer as OfferIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import CountUp from '../../components/animations/CountUp';
import StatsCard from '../../components/dashboard/StatsCard';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [anchorEl, setAnchorEl] = useState(null);

  // Mock store owner data
  const storeData = {
    id: 1,
    name: "Milano's Italian Restaurant",
    category: "Restaurant",
    rating: 4.8,
    totalReviews: 1250,
    image: "/api/placeholder/100/100",
    address: "123 Main Street, Downtown City",
    phone: "+1 (555) 123-4567",
    email: "info@milanos.com",
    website: "https://milanos.com",
    isVerified: true,
    joinedDate: "2023-06-15"
  };

  const dashboardStats = {
    totalRatings: 1250,
    averageRating: 4.8,
    newRatingsToday: 12,
    newRatingsThisWeek: 45,
    totalViews: 8500,
    uniqueVisitors: 3200,
    responseRate: 85,
    avgResponseTime: '2.5 hours'
  };

  // Recent ratings data
  const recentRatings = [
    {
      id: 1,
      user: {
        name: 'John Smith Anderson',
        avatar: '/api/placeholder/40/40'
      },
      rating: 5,
      comment: 'Amazing pasta and excellent service! The ambiance was perfect for a dinner date.',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      helpful: 5,
      replied: false
    },
    {
      id: 2,
      user: {
        name: 'Sarah Johnson Miller',
        avatar: '/api/placeholder/40/40'
      },
      rating: 4,
      comment: 'Great food quality but service was a bit slow during peak hours.',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      helpful: 3,
      replied: true
    },
    {
      id: 3,
      user: {
        name: 'Michael Chen Wilson',
        avatar: '/api/placeholder/40/40'
      },
      rating: 5,
      comment: 'Best Italian restaurant in the city! Highly recommend the tiramisu.',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
      helpful: 8,
      replied: false
    },
    {
      id: 4,
      user: {
        name: 'Emily Rodriguez Brown',
        avatar: '/api/placeholder/40/40'
      },
      rating: 3,
      comment: 'Food was good but portions were smaller than expected for the price.',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      helpful: 2,
      replied: true
    }
  ];

  // Rating trends data for chart
  const ratingTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Average Rating',
      data: [4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4
    }, {
      label: 'Number of Reviews',
      data: [45, 52, 68, 78, 85, 92, 98],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  // Rating distribution for donut chart
  const ratingDistribution = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      data: [650, 380, 150, 50, 20],
      backgroundColor: ['#10b981', '#22c55e', '#eab308', '#f59e0b', '#ef4444']
    }]
  };

  // Monthly reviews data
  const monthlyReviewsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Reviews Received',
      data: [85, 92, 78, 105, 118, 142],
      backgroundColor: '#667eea'
    }]
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={storeData.image}
                sx={{
                  width: 80,
                  height: 80,
                  border: '4px solid #667eea',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
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
                    {storeData.name}
                  </Typography>
                  {storeData.isVerified && (
                    <Chip
                      label="Verified"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {storeData.category} • {storeData.address}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating value={storeData.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {storeData.rating} ({storeData.totalReviews} reviews)
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate('/owner/my-store')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderRadius: 3
                }}
              >
                Edit Store
              </Button>
              <Button
                variant="contained"
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate('/owner/analytics')}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                View Analytics
              </Button>
            </Box>
          </Box>
        </FadeInUp>

        {/* Key Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Reviews"
              value={<CountUp end={dashboardStats.totalRatings} duration={2} />}
              subtitle={`+${dashboardStats.newRatingsToday} today`}
              icon={<StarIcon />}
              color="#667eea"
              trend="up"
              trendValue="8.5"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Average Rating"
              value={dashboardStats.averageRating}
              subtitle="This month"
              icon={<TrendingIcon />}
              color="#10b981"
              trend="up"
              trendValue="0.2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Store Views"
              value={<CountUp end={dashboardStats.totalViews} duration={2} />}
              subtitle={`${dashboardStats.uniqueVisitors} unique visitors`}
              icon={<VisibilityIcon />}
              color="#f59e0b"
              trend="up"
              trendValue="12.3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Response Rate"
              value={`${dashboardStats.responseRate}%`}
              subtitle={`Avg ${dashboardStats.avgResponseTime}`}
              icon={<ChatIcon />}
              color="#ef4444"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Rating Trends Chart */}
          <Grid item xs={12} lg={8}>
            <SlideIn direction="left" delay={0.2}>
              <LineChart
                title="Rating Trends & Review Volume"
                data={ratingTrendsData}
                height={400}
                showArea={true}
                animate={true}
              />
            </SlideIn>
          </Grid>

          {/* Rating Distribution */}
          <Grid item xs={12} lg={4}>
            <SlideIn direction="right" delay={0.2}>
              <DonutChart
                title="Rating Distribution"
                data={ratingDistribution}
                height={400}
                showStats={true}
                centerMetric="average"
              />
            </SlideIn>
          </Grid>

          {/* Recent Reviews */}
          <Grid item xs={12} lg={8}>
            <SlideIn direction="left" delay={0.3}>
              <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Recent Customer Reviews
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Latest feedback from your customers
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => navigate('/owner/ratings')}
                    sx={{ borderRadius: 2 }}
                  >
                    View All
                  </Button>
                </Box>

                <List sx={{ p: 0 }}>
                  {recentRatings.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          py: 3,
                          px: 3,
                          borderBottom: index < recentRatings.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'grey.50'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={review.user.avatar}>
                            {review.user.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {review.user.name}
                                </Typography>
                                <Rating value={review.rating} size="small" readOnly />
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimeAgo(review.date)}
                                </Typography>
                              </Box>
                              <IconButton size="small" onClick={handleMenuOpen}>
                                <MoreIcon />
                              </IconButton>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                                "{review.comment}"
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip
                                  icon={<ThumbUpIcon />}
                                  label={`${review.helpful} helpful`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                                {review.replied ? (
                                  <Chip
                                    label="Replied"
                                    size="small"
                                    color="success"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                ) : (
                                  <Button
                                    size="small"
                                    startIcon={<ChatIcon />}
                                    sx={{ fontSize: '0.7rem', borderRadius: 2 }}
                                  >
                                    Reply
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Paper>
            </SlideIn>
          </Grid>

          {/* Monthly Performance */}
          <Grid item xs={12} lg={4}>
            <SlideIn direction="right" delay={0.3}>
              <BarChart
                title="Monthly Reviews"
                data={monthlyReviewsData}
                height={300}
                horizontal={false}
                showGrid={true}
              />
            </SlideIn>

            {/* Quick Actions */}
            <SlideIn direction="right" delay={0.4}>
              <Paper sx={{ borderRadius: 3, mt: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Quick Actions
                  </Typography>
                </Box>
                
                <List sx={{ p: 2 }}>
                  {[
                    {
                      icon: <EditIcon />,
                      title: 'Update Store Info',
                      description: 'Edit your store details',
                      action: () => navigate('/owner/my-store'),
                      color: '#667eea'
                    },
                    {
                      icon: <ChatIcon />,
                      title: 'Respond to Reviews',
                      description: 'Reply to customer feedback',
                      action: () => navigate('/owner/ratings'),
                      color: '#10b981',
                      badge: recentRatings.filter(r => !r.replied).length
                    },
                    {
                      icon: <ShareIcon />,
                      title: 'Share Store Profile',
                      description: 'Get more visibility',
                      action: () => console.log('Share store'),
                      color: '#f59e0b'
                    },
                    {
                      icon: <AssessmentIcon />,
                      title: 'Download Report',
                      description: 'Export analytics data',
                      action: () => console.log('Download report'),
                      color: '#8b5cf6'
                    }
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem
                        button
                        onClick={action.action}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: `${action.color}10`
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={action.badge}
                            color="error"
                            invisible={!action.badge}
                          >
                            <Avatar
                              sx={{
                                backgroundColor: `${action.color}15`,
                                color: action.color,
                                width: 40,
                                height: 40
                              }}
                            >
                              {action.icon}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={action.title}
                          secondary={action.description}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.8rem'
                          }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Paper>
            </SlideIn>
          </Grid>

          {/* Performance Insights */}
          <Grid item xs={12}>
            <FadeInUp delay={0.4}>
              <Paper sx={{ borderRadius: 3, p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Performance Insights
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <TrendingIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                        Excellent
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your rating improved by 0.2 points this month
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <ScheduleIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                        Fast Response
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You respond to reviews 40% faster than average
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <PeopleIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
                        Growing
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Customer engagement increased by 15% this month
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </FadeInUp>
          </Grid>
        </Grid>
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ChatIcon sx={{ mr: 1 }} />
          Reply to Review
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Review
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AssessmentIcon sx={{ mr: 1 }} />
          View User Profile
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OwnerDashboard;
