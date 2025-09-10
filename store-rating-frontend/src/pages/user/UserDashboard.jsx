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
  Button,
  Avatar,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  IconButton,
  LinearProgress,
  Badge,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Explore as ExploreIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Recommend as RecommendIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as AwardIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  ThumbUp as ThumbUpIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import CountUp from '../../components/animations/CountUp';
import StatsCard from '../../components/dashboard/StatsCard';
import SearchBar from '../../components/common/SearchBar';
import DonutChart from '../../components/charts/DonutChart';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'John Smith Williams Anderson',
    email: 'john.smith@example.com',
    avatar: '/api/placeholder/80/80',
    level: 'Explorer',
    points: 1250,
    joinedDate: '2024-01-15'
  });

  const [userStats, setUserStats] = useState({
    totalRatings: 25,
    favoriteStores: 8,
    reviewsHelpful: 42,
    averageRating: 4.2,
    categoriesRated: 6,
    streakDays: 7
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'rating',
      store: "Milano's Italian Restaurant",
      rating: 5,
      comment: 'Amazing pasta and great service!',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'Restaurant'
    },
    {
      id: 2,
      type: 'favorite',
      store: 'TechHub Electronics',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: 'Electronics'
    },
    {
      id: 3,
      type: 'rating',
      store: 'Green Gardens Pharmacy',
      rating: 4,
      comment: 'Quick service and good prices',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: 'Healthcare'
    }
  ]);

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      name: 'Cafe Central',
      category: 'Restaurant',
      rating: 4.6,
      image: '/api/placeholder/120/80',
      reason: 'Based on your Italian food ratings',
      distance: '0.8 km'
    },
    {
      id: 2,
      name: 'Digital World',
      category: 'Electronics',
      rating: 4.4,
      image: '/api/placeholder/120/80',
      reason: 'Similar to TechHub Electronics',
      distance: '1.2 km'
    },
    {
      id: 3,
      name: 'Wellness Spa',
      category: 'Healthcare',
      rating: 4.8,
      image: '/api/placeholder/120/80',
      reason: 'Trending in your area',
      distance: '2.1 km'
    }
  ]);

  const categoryStats = {
    labels: ['Restaurant', 'Electronics', 'Healthcare', 'Shopping', 'Services'],
    datasets: [{
      data: [8, 6, 4, 5, 2],
      backgroundColor: ['#ef4444', '#10b981', '#667eea', '#f59e0b', '#8b5cf6']
    }]
  };

  const quickActions = [
    {
      id: 'browse',
      title: 'Browse Stores',
      description: 'Discover new stores',
      icon: <ExploreIcon />,
      color: '#667eea',
      action: () => navigate('/user/browse')
    },
    {
      id: 'categories',
      title: 'By Category',
      description: 'Explore by type',
      icon: <CategoryIcon />,
      color: '#10b981',
      action: () => navigate('/user/categories')
    },
    {
      id: 'my-ratings',
      title: 'My Ratings',
      description: 'View your reviews',
      icon: <StarIcon />,
      color: '#f59e0b',
      action: () => navigate('/user/my-ratings')
    },
    {
      id: 'favorites',
      title: 'Favorites',
      description: 'Saved stores',
      icon: <FavoriteIcon />,
      color: '#ef4444',
      action: () => navigate('/user/favorites')
    }
  ];

  const getUserLevel = (points) => {
    if (points < 100) return { name: 'Newcomer', color: '#6b7280', next: 100 };
    if (points < 500) return { name: 'Explorer', color: '#10b981', next: 500 };
    if (points < 1000) return { name: 'Reviewer', color: '#667eea', next: 1000 };
    if (points < 2000) return { name: 'Expert', color: '#f59e0b', next: 2000 };
    return { name: 'Master', color: '#ef4444', next: null };
  };

  const userLevel = getUserLevel(user.points);
  const progressPercent = userLevel.next ? ((user.points % 500) / 500) * 100 : 100;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '4px solid',
                    borderColor: userLevel.color,
                    boxShadow: `0 0 20px ${userLevel.color}40`
                  }}
                />
              </Grid>
              <Grid item xs>
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
                  Welcome back, {user.name.split(' ')[0]}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    icon={<AwardIcon />}
                    label={userLevel.name}
                    sx={{
                      backgroundColor: `${userLevel.color}15`,
                      color: userLevel.color,
                      fontWeight: 600
                    }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    <CountUp end={user.points} /> points
                  </Typography>
                </Box>
                {userLevel.next && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercent}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: userLevel.color,
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {userLevel.next - user.points} points to next level
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Member since
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </FadeInUp>

        {/* Quick Actions */}
        <FadeInUp delay={0.1}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={action.id}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={action.action}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      border: '2px solid transparent',
                      background: `linear-gradient(135deg, ${action.color}10, ${action.color}05)`,
                      '&:hover': {
                        borderColor: action.color,
                        boxShadow: `0 8px 25px ${action.color}20`
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar
                        sx={{
                          backgroundColor: action.color,
                          width: 56,
                          height: 56,
                          margin: '0 auto',
                          mb: 2
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </FadeInUp>

        {/* Stats and Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Ratings"
              value={<CountUp end={userStats.totalRatings} />}
              subtitle="Reviews submitted"
              icon={<StarIcon />}
              color="#667eea"
              trend="up"
              trendValue="3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Favorite Stores"
              value={<CountUp end={userStats.favoriteStores} />}
              subtitle="Bookmarked places"
              icon={<FavoriteIcon />}
              color="#ef4444"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Helpful Reviews"
              value={<CountUp end={userStats.reviewsHelpful} />}
              subtitle="Thumbs up received"
              icon={<ThumbUpIcon />}
              color="#10b981"
              trend="up"
              trendValue="12"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Rating Streak"
              value={<CountUp end={userStats.streakDays} />}
              subtitle="Days active"
              icon={<TrendingIcon />}
              color="#f59e0b"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} lg={8}>
            <SlideIn direction="left" delay={0.2}>
              <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your latest ratings and interactions
                  </Typography>
                </Box>

                <List sx={{ p: 0 }}>
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          py: 2,
                          px: 3,
                          borderBottom: index < recentActivity.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'grey.50'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor: activity.type === 'rating' ? '#f59e0b15' : '#ef444415',
                              color: activity.type === 'rating' ? '#f59e0b' : '#ef4444'
                            }}
                          >
                            {activity.type === 'rating' ? <StarIcon /> : <FavoriteIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {activity.store}
                              </Typography>
                              <Chip
                                label={activity.category}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                              {activity.rating && (
                                <Rating value={activity.rating} size="small" readOnly />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              {activity.comment && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  "{activity.comment}"
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {activity.date.toRelativeTimeString || activity.date.toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                        
                        <IconButton size="small">
                          <ArrowIcon />
                        </IconButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>

                <Box sx={{ p: 2, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
                  <Button
                    startIcon={<HistoryIcon />}
                    onClick={() => navigate('/user/activity')}
                    sx={{ borderRadius: 2 }}
                  >
                    View All Activity
                  </Button>
                </Box>
              </Paper>
            </SlideIn>
          </Grid>

          {/* Rating Categories & Recommendations */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* Category Breakdown */}
              <Grid item xs={12}>
                <SlideIn direction="right" delay={0.2}>
                  <DonutChart
                    title="Rating Categories"
                    data={categoryStats}
                    height={300}
                    showStats={true}
                    centerMetric="total"
                  />
                </SlideIn>
              </Grid>

              {/* Recommendations */}
              <Grid item xs={12}>
                <SlideIn direction="right" delay={0.3}>
                  <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
                      borderBottom: 1,
                      borderColor: 'divider'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RecommendIcon color="success" />
                        Recommended for You
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Based on your preferences
                      </Typography>
                    </Box>

                    <List sx={{ p: 0 }}>
                      {recommendations.map((store, index) => (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{
                              py: 2,
                              px: 3,
                              borderBottom: index < recommendations.length - 1 ? '1px solid' : 'none',
                              borderColor: 'divider',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'grey.50'
                              }
                            }}
                            onClick={() => navigate(`/stores/${store.id}`)}
                          >
                            <ListItemAvatar>
                              <Avatar
                                src={store.image}
                                variant="rounded"
                                sx={{ width: 48, height: 48 }}
                              />
                            </ListItemAvatar>
                            
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {store.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {store.rating}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    {store.reason}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {store.distance}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>

                    <Box sx={{ p: 2, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
                      <Button
                        startIcon={<ExploreIcon />}
                        onClick={() => navigate('/user/browse')}
                        sx={{ borderRadius: 2 }}
                      >
                        Explore More Stores
                      </Button>
                    </Box>
                  </Paper>
                </SlideIn>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;
