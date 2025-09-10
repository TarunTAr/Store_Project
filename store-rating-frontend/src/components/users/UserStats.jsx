import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as VerifiedIcon,
  Block as InactiveIcon,
  Assessment as StatsIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserStats, exportUserStats } from '../../store/userSlice';

const UserStats = ({
  users = [],
  timeRange = '30d',
  showCharts = true,
  showTrends = true,
  compact = false,
  onTimeRangeChange,
  className = ''
}) => {
  const [selectedChart, setSelectedChart] = useState('overview');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const inactiveUsers = users.filter(user => user.status === 'inactive').length;
    const verifiedUsers = users.filter(user => user.verified).length;
    
    // Role distribution
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const storeOwners = users.filter(user => user.role === 'store_owner').length;
    const normalUsers = users.filter(user => user.role === 'user').length;

    // Store owner stats
    const storeOwnersWithRating = users.filter(user => 
      user.role === 'store_owner' && user.storeRating
    );
    const avgStoreRating = storeOwnersWithRating.length > 0 
      ? storeOwnersWithRating.reduce((sum, user) => sum + user.storeRating, 0) / storeOwnersWithRating.length
      : 0;

    // Growth calculations (mock data for demo)
    const previousPeriodUsers = Math.floor(totalUsers * 0.85);
    const userGrowth = totalUsers - previousPeriodUsers;
    const growthPercentage = previousPeriodUsers > 0 
      ? ((userGrowth / previousPeriodUsers) * 100).toFixed(1)
      : 0;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      adminUsers,
      storeOwners,
      normalUsers,
      avgStoreRating,
      userGrowth,
      growthPercentage,
      activePercentage: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      verifiedPercentage: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0
    };
  }, [users]);

  // Chart data
  const roleDistributionData = [
    { name: 'Normal Users', value: stats.normalUsers, color: '#667eea' },
    { name: 'Store Owners', value: stats.storeOwners, color: '#f59e0b' },
    { name: 'Administrators', value: stats.adminUsers, color: '#ef4444' }
  ];

  const statusDistributionData = [
    { name: 'Active', value: stats.activeUsers, color: '#10b981' },
    { name: 'Inactive', value: stats.inactiveUsers, color: '#ef4444' }
  ];

  const verificationData = [
    { name: 'Verified', value: stats.verifiedUsers, color: '#10b981' },
    { name: 'Unverified', value: stats.unverifiedUsers, color: '#f59e0b' }
  ];

  // Mock growth data
  const growthData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    users: Math.floor(Math.random() * 10) + stats.totalUsers * (i / 30),
    newUsers: Math.floor(Math.random() * 5) + 1
  }));

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await dispatch(fetchUserStats(timeRange)).unwrap();
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await dispatch(exportUserStats({ 
        timeRange, 
        format: 'xlsx',
        includeCharts: true 
      })).unwrap();
    } catch (error) {
      console.error('Failed to export stats:', error);
    }
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

  const StatCard = ({ title, value, subtitle, icon, color, trend, trendValue, loading = false }) => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
            borderColor: color
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color, mt: 0.5 }}>
                {loading ? (
                  <Box sx={{ width: 60, height: 36 }}>
                    <LinearProgress sx={{ borderRadius: 1 }} />
                  </Box>
                ) : (
                  value
                )}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 24, color } })}
            </Box>
          </Box>

          {showTrends && trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend === 'up' ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : trend === 'down' ? (
                <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
              ) : (
                <TrendingFlatIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              )}
              
              <Typography
                variant="caption"
                sx={{
                  color: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'warning.main',
                  fontWeight: 600
                }}
              >
                {trendValue}%
              </Typography>
              
              <Typography variant="caption" color="text.disabled">
                vs last period
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              User Overview
            </Typography>
            <Chip
              label={`${stats.totalUsers} total`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.activeUsers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.verifiedUsers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Verified
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.storeOwners}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Store Owners
              </Typography>
            </Box>
          </Box>
        </Paper>
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
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StatsIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              User Analytics
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
                <MenuItem value="90d">Last 90 days</MenuItem>
                <MenuItem value="1y">Last year</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Refresh data">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export data">
              <IconButton onClick={handleExport}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              subtitle={`${stats.growthPercentage}% growth`}
              icon={<PersonIcon />}
              color="#667eea"
              trend={stats.userGrowth > 0 ? 'up' : stats.userGrowth < 0 ? 'down' : 'flat'}
              trendValue={Math.abs(stats.growthPercentage)}
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              subtitle={`${stats.activePercentage.toFixed(1)}% of total`}
              icon={<VerifiedIcon />}
              color="#10b981"
              trend="up"
              trendValue="5.2"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Store Owners"
              value={stats.storeOwners.toLocaleString()}
              subtitle={`Avg rating: ${stats.avgStoreRating.toFixed(1)}`}
              icon={<StoreIcon />}
              color="#f59e0b"
              trend="up"
              trendValue="12.5"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Verified Users"
              value={stats.verifiedUsers.toLocaleString()}
              subtitle={`${stats.verifiedPercentage.toFixed(1)}% verified`}
              icon={<VerifiedIcon />}
              color="#8b5cf6"
              trend="up"
              trendValue="8.3"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Charts */}
        {showCharts && (
          <Grid container spacing={3}>
            {/* Role Distribution */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        User Roles Distribution
                      </Typography>
                      <Chip label="By Role" size="small" variant="outlined" />
                    </Box>

                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={roleDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {roleDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                      {roleDistributionData.map((item) => (
                        <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: item.color
                            }}
                          />
                          <Typography variant="caption">
                            {item.name} ({item.value})
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Status Distribution */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        User Status Overview
                      </Typography>
                      <Chip label="Active vs Inactive" size="small" variant="outlined" />
                    </Box>

                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[...statusDistributionData, ...verificationData]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Growth Trend */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        User Growth Trend
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label="Total Users"
                          size="small"
                          sx={{ backgroundColor: '#667eea15', color: '#667eea' }}
                        />
                        <Chip
                          label="New Users"
                          size="small"
                          sx={{ backgroundColor: '#10b98115', color: '#10b981' }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="users"
                            stackId="1"
                            stroke="#667eea"
                            fill="#667eea"
                            fillOpacity={0.3}
                            name="Total Users"
                          />
                          <Area
                            type="monotone"
                            dataKey="newUsers"
                            stackId="2"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.6}
                            name="New Users"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

export default UserStats;
