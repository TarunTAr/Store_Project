import React, { useState, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Forum as ForumIcon,
  Visibility as ViewIcon,
  ThumbUp as LikeIcon,
  Share as ShareIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Store as StoreIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  EmojiEvents as AchievementIcon,
  LocalFireDepartment as ActiveIcon,
  Schedule as RecentIcon,
  Group as GroupIcon,
  Assessment as AnalyticsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEngagement } from '../../store/analyticsSlice';

const UserEngagement = ({
  data = {},
  loading = false,
  timeRange = '30d',
  onTimeRangeChange,
  variant = 'comprehensive', // comprehensive, compact, metrics
  showActiveUsers = true,
  showEngagementChart = true,
  showTopUsers = true,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState('all');

  const dispatch = useDispatch();

  // Mock data structure for comprehensive engagement metrics
  const engagementData = {
    totalUsers: data.totalUsers || 1250,
    activeUsers: data.activeUsers || 890,
    newUsers: data.newUsers || 45,
    returningUsers: data.returningUsers || 845,
    avgSessionDuration: data.avgSessionDuration || 12.5, // minutes
    totalSessions: data.totalSessions || 5430,
    pageViews: data.pageViews || 28950,
    ratingsSubmitted: data.ratingsSubmitted || 1230,
    storesViewed: data.storesViewed || 4560,
    searchQueries: data.searchQueries || 2340,
    engagementRate: data.engagementRate || 78.5,
    bounceRate: data.bounceRate || 21.5,
    conversionRate: data.conversionRate || 15.8,
    ...data
  };

  // Sample active users data
  const activeUsersData = useMemo(() => [
    { name: 'Mon', activeUsers: 120, newUsers: 8, pageViews: 450 },
    { name: 'Tue', activeUsers: 134, newUsers: 12, pageViews: 520 },
    { name: 'Wed', activeUsers: 125, newUsers: 6, pageViews: 480 },
    { name: 'Thu', activeUsers: 148, newUsers: 15, pageViews: 590 },
    { name: 'Fri', activeUsers: 165, newUsers: 18, pageViews: 650 },
    { name: 'Sat', activeUsers: 142, newUsers: 10, pageViews: 555 },
    { name: 'Sun', activeUsers: 128, newUsers: 7, pageViews: 490 }
  ], []);

  // Sample engagement breakdown
  const engagementBreakdown = [
    { name: 'Ratings', value: 35, color: '#f59e0b' },
    { name: 'Browsing', value: 40, color: '#10b981' },
    { name: 'Searching', value: 15, color: '#667eea' },
    { name: 'Social', value: 10, color: '#ef4444' }
  ];

  // Sample top engaged users
  const topUsers = [
    { id: 1, name: 'Alice Johnson', avatar: '', ratings: 45, reviews: 23, lastActive: '2 hours ago', engagement: 95 },
    { id: 2, name: 'Bob Smith', avatar: '', ratings: 38, reviews: 19, lastActive: '1 hour ago', engagement: 89 },
    { id: 3, name: 'Carol Davis', avatar: '', ratings: 42, reviews: 28, lastActive: '30 minutes ago', engagement: 92 },
    { id: 4, name: 'David Wilson', avatar: '', ratings: 35, reviews: 15, lastActive: '4 hours ago', engagement: 78 },
    { id: 5, name: 'Emma Brown', avatar: '', ratings: 29, reviews: 12, lastActive: '1 day ago', engagement: 71 }
  ];

  const getEngagementColor = (rate) => {
    if (rate >= 80) return '#10b981'; // Green
    if (rate >= 60) return '#f59e0b'; // Orange
    if (rate >= 40) return '#ef4444'; // Red
    return '#6b7280'; // Gray
  };

  const getEngagementText = (rate) => {
    if (rate >= 80) return 'Excellent';
    if (rate >= 60) return 'Good';
    if (rate >= 40) return 'Fair';
    return 'Poor';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const MetricCard = ({ title, value, subtitle, icon, color, trend, trendValue }) => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            boxShadow: `0 8px 25px ${color}20`,
            borderColor: color
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                {title}
              </Typography>
              
              <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 0.5 }}>
                {value}
              </Typography>
              
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Avatar
              sx={{
                backgroundColor: `${color}15`,
                color,
                width: 48,
                height: 48
              }}
            >
              {icon}
            </Avatar>
          </Box>

          {trend && trendValue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                +{trendValue}% vs last period
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (variant === 'metrics') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Users"
              value={engagementData.totalUsers.toLocaleString()}
              subtitle="Registered users"
              icon={<PeopleIcon />}
              color="#667eea"
              trend={true}
              trendValue="12.5"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Daily Active Users"
              value={engagementData.activeUsers.toLocaleString()}
              subtitle={`${((engagementData.activeUsers / engagementData.totalUsers) * 100).toFixed(1)}% of total`}
              icon={<ActiveIcon />}
              color="#10b981"
              trend={true}
              trendValue="8.3"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Avg Session Time"
              value={`${engagementData.avgSessionDuration} min`}
              subtitle="Per user session"
              icon={<TimeIcon />}
              color="#f59e0b"
              trend={true}
              trendValue="15.2"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Engagement Rate"
              value={`${engagementData.engagementRate}%`}
              subtitle={getEngagementText(engagementData.engagementRate)}
              icon={<SpeedIcon />}
              color={getEngagementColor(engagementData.engagementRate)}
              trend={true}
              trendValue="5.7"
            />
          </Grid>
        </Grid>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                User Engagement Analytics
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {onTimeRangeChange && (
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={(e) => onTimeRangeChange(e.target.value)}
                    label="Period"
                  >
                    <MenuItem value="7d">7 Days</MenuItem>
                    <MenuItem value="30d">30 Days</MenuItem>
                    <MenuItem value="90d">90 Days</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>

          {/* Key Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {engagementData.activeUsers}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {engagementData.engagementRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Engagement
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {engagementData.avgSessionDuration}m
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Session
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {engagementData.newUsers}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  New Users
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Activity Chart */}
            {showEngagementChart && (
              <Grid item xs={12} lg={8}>
                <motion.div variants={itemVariants}>
                  <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Daily Activity Trends
                      </Typography>
                      
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activeUsersData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="activeUsers"
                              stackId="1"
                              stroke="#667eea"
                              fill="#667eea"
                              fillOpacity={0.6}
                              name="Active Users"
                            />
                            <Area
                              type="monotone"
                              dataKey="newUsers"
                              stackId="2"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.8}
                              name="New Users"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )}

            {/* Engagement Breakdown */}
            <Grid item xs={12} lg={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Engagement Breakdown
                    </Typography>
                    
                    <Box sx={{ height: 200, mb: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={engagementBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {engagementBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>

                    <Box sx={{ space: 1 }}>
                      {engagementBreakdown.map((item) => (
                        <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: item.color
                              }}
                            />
                            <Typography variant="body2">{item.name}</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.value}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Top Engaged Users */}
            {showTopUsers && (
              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Most Engaged Users
                        </Typography>
                        
                        <Button size="small" endIcon={<ViewIcon />}>
                          View All
                        </Button>
                      </Box>

                      <List>
                        {topUsers.map((user, index) => (
                          <motion.div
                            key={user.id}
                            variants={itemVariants}
                            custom={index}
                          >
                            <ListItem
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid transparent',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  backgroundColor: 'primary.light'
                                }
                              }}
                            >
                              <ListItemAvatar>
                                <Badge
                                  badgeContent={index + 1}
                                  color="primary"
                                  sx={{
                                    '& .MuiBadge-badge': {
                                      backgroundColor: index < 3 ? '#FFD700' : '#667eea',
                                      color: 'white',
                                      fontWeight: 700
                                    }
                                  }}
                                >
                                  <Avatar src={user.avatar}>
                                    {user.name.charAt(0)}
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>

                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {user.name}
                                    </Typography>
                                    
                                    {index < 3 && (
                                      <AchievementIcon sx={{ fontSize: 16, color: '#FFD700' }} />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Box sx={{ mt: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <StarIcon sx={{ fontSize: 12, color: '#f59e0b' }} />
                                        <Typography variant="caption">
                                          {user.ratings} ratings
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ForumIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                        <Typography variant="caption">
                                          {user.reviews} reviews
                                        </Typography>
                                      </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Last active: {user.lastActive}
                                      </Typography>

                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                          Engagement:
                                        </Typography>
                                        <LinearProgress
                                          variant="determinate"
                                          value={user.engagement}
                                          sx={{
                                            width: 50,
                                            height: 4,
                                            borderRadius: 2,
                                            backgroundColor: 'grey.200',
                                            '& .MuiLinearProgress-bar': {
                                              backgroundColor: getEngagementColor(user.engagement),
                                              borderRadius: 2
                                            }
                                          }}
                                        />
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: getEngagementColor(user.engagement),
                                            fontWeight: 600,
                                            minWidth: 30
                                          }}
                                        >
                                          {user.engagement}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                }
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default UserEngagement;
