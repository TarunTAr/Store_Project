import React, { useState, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Star as StarIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  DateRange as DateRangeIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRatingTrends } from '../../store/analyticsSlice';

const RatingTrends = ({
  data = {},
  loading = false,
  timeRange = '30d',
  onTimeRangeChange,
  chartType = 'line',
  onChartTypeChange,
  showComparison = true,
  showPrediction = false,
  showBreakdown = true,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState('average');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  const dispatch = useDispatch();

  // Generate sample trend data
  const trendData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const baseRating = 4.2 + Math.sin(i / 10) * 0.3;
      const variance = (Math.random() - 0.5) * 0.4;
      
      data.push({
        date: format(date, 'MMM dd'),
        timestamp: date.getTime(),
        averageRating: Math.max(1, Math.min(5, baseRating + variance)),
        totalRatings: Math.floor(Math.random() * 50) + 10,
        oneStar: Math.floor(Math.random() * 5) + 1,
        twoStar: Math.floor(Math.random() * 8) + 2,
        threeStar: Math.floor(Math.random() * 15) + 5,
        fourStar: Math.floor(Math.random() * 25) + 15,
        fiveStar: Math.floor(Math.random() * 30) + 20,
        stores: Math.floor(Math.random() * 10) + 5,
        users: Math.floor(Math.random() * 20) + 10
      });
    }
    
    return data;
  }, [timeRange]);

  // Calculate trend statistics
  const trendStats = useMemo(() => {
    if (trendData.length < 2) return {};

    const current = trendData[trendData.length - 1];
    const previous = trendData[trendData.length - 2];
    const weekAgo = trendData[Math.max(0, trendData.length - 8)];
    
    const avgRating = trendData.reduce((sum, day) => sum + day.averageRating, 0) / trendData.length;
    const totalRatings = trendData.reduce((sum, day) => sum + day.totalRatings, 0);
    
    const ratingChange = current.averageRating - previous.averageRating;
    const volumeChange = current.totalRatings - previous.totalRatings;
    const weeklyChange = current.averageRating - weekAgo.averageRating;
    
    return {
      avgRating: avgRating.toFixed(2),
      totalRatings,
      dailyAvg: (totalRatings / trendData.length).toFixed(0),
      ratingTrend: ratingChange > 0.05 ? 'up' : ratingChange < -0.05 ? 'down' : 'stable',
      ratingChange: Math.abs(ratingChange).toFixed(2),
      volumeTrend: volumeChange > 0 ? 'up' : volumeChange < 0 ? 'down' : 'stable',
      volumeChange: Math.abs(volumeChange),
      weeklyTrend: weeklyChange > 0.1 ? 'up' : weeklyChange < -0.1 ? 'down' : 'stable',
      weeklyChange: Math.abs(weeklyChange).toFixed(2)
    };
  }, [trendData]);

  // Rating distribution data
  const distributionData = useMemo(() => {
    const totals = trendData.reduce((acc, day) => ({
      oneStar: acc.oneStar + day.oneStar,
      twoStar: acc.twoStar + day.twoStar,
      threeStar: acc.threeStar + day.threeStar,
      fourStar: acc.fourStar + day.fourStar,
      fiveStar: acc.fiveStar + day.fiveStar
    }), { oneStar: 0, twoStar: 0, threeStar: 0, fourStar: 0, fiveStar: 0 });

    const total = Object.values(totals).reduce((sum, val) => sum + val, 0);

    return [
      { name: '5 Stars', value: totals.fiveStar, percentage: ((totals.fiveStar / total) * 100).toFixed(1), color: '#10b981' },
      { name: '4 Stars', value: totals.fourStar, percentage: ((totals.fourStar / total) * 100).toFixed(1), color: '#84cc16' },
      { name: '3 Stars', value: totals.threeStar, percentage: ((totals.threeStar / total) * 100).toFixed(1), color: '#f59e0b' },
      { name: '2 Stars', value: totals.twoStar, percentage: ((totals.twoStar / total) * 100).toFixed(1), color: '#f97316' },
      { name: '1 Star', value: totals.oneStar, percentage: ((totals.oneStar / total) * 100).toFixed(1), color: '#ef4444' }
    ];
  }, [trendData]);

  // Top performing categories/stores (mock data)
  const topPerformers = [
    { name: 'Restaurants', avgRating: 4.6, trend: 'up', change: 0.3, total: 234 },
    { name: 'Retail Stores', avgRating: 4.4, trend: 'up', change: 0.2, total: 189 },
    { name: 'Gas Stations', avgRating: 4.2, trend: 'stable', change: 0.0, total: 145 },
    { name: 'Pharmacies', avgRating: 4.1, trend: 'down', change: 0.1, total: 98 },
    { name: 'Services', avgRating: 3.9, trend: 'up', change: 0.4, total: 156 }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down':
        return <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <TrendingFlatIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      default: return 'warning.main';
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

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
              <TimelineIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Rating Trends Analysis
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="7d">7 Days</MenuItem>
                  <MenuItem value="30d">30 Days</MenuItem>
                  <MenuItem value="90d">90 Days</MenuItem>
                </Select>
              </FormControl>

              <IconButton size="small">
                <RefreshIcon />
              </IconButton>

              <IconButton size="small">
                <DownloadIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {trendStats.avgRating}
                  </Typography>
                  {getTrendIcon(trendStats.ratingTrend)}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Average Rating
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {trendStats.totalRatings}
                  </Typography>
                  {getTrendIcon(trendStats.volumeTrend)}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Total Ratings
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {trendStats.dailyAvg}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Daily Average
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: getTrendColor(trendStats.weeklyTrend) }}>
                    {trendStats.weeklyChange}
                  </Typography>
                  {getTrendIcon(trendStats.weeklyTrend)}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Weekly Change
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Main Trend Chart */}
            <Grid item xs={12} lg={8}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Rating Trends Over Time
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Metric</InputLabel>
                          <Select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            label="Metric"
                          >
                            <MenuItem value="average">Average Rating</MenuItem>
                            <MenuItem value="volume">Rating Volume</MenuItem>
                            <MenuItem value="both">Both</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    <Box sx={{ height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        {selectedMetric === 'both' ? (
                          <ComposedChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Bar yAxisId="right" dataKey="totalRatings" fill="#667eea" opacity={0.6} name="Daily Ratings" />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="averageRating"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                              name="Average Rating"
                            />
                          </ComposedChart>
                        ) : selectedMetric === 'volume' ? (
                          <AreaChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="totalRatings"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.6}
                              name="Daily Ratings"
                            />
                          </AreaChart>
                        ) : (
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[1, 5]} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="averageRating"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                              name="Average Rating"
                            />
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Rating Distribution */}
            {showBreakdown && (
              <Grid item xs={12} lg={4}>
                <motion.div variants={itemVariants}>
                  <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Rating Distribution
                      </Typography>
                      
                      <Box sx={{ height: 200, mb: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={distributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {distributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>

                      <Box sx={{ space: 1 }}>
                        {distributionData.map((item) => (
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
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.percentage}%
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ({item.value})
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )}

            {/* Top Performers */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Category Performance
                      </Typography>
                      
                      <Button size="small" endIcon={<TrophyIcon />}>
                        View All
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      {topPerformers.map((performer, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={performer.name}>
                          <motion.div
                            variants={itemVariants}
                            custom={index}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <Card
                              sx={{
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                textAlign: 'center',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  boxShadow: 2
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    backgroundColor: getTrendColor(performer.trend),
                                    margin: '0 auto',
                                    mb: 1,
                                    fontSize: '14px'
                                  }}
                                >
                                  <CategoryIcon />
                                </Avatar>

                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  {performer.name}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                                  <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {performer.avgRating}
                                  </Typography>
                                  {getTrendIcon(performer.trend)}
                                </Box>

                                <Typography variant="caption" color="text.secondary">
                                  {performer.total} ratings
                                </Typography>

                                {performer.change > 0 && (
                                  <Chip
                                    label={`+${performer.change}`}
                                    size="small"
                                    color={performer.trend === 'up' ? 'success' : 'error'}
                                    sx={{ fontSize: '0.6rem', height: 16, mt: 0.5 }}
                                  />
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default RatingTrends;
