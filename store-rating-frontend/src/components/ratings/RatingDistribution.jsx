import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Analytics as AnalyticsIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const RatingDistribution = ({
  ratings = {},
  totalRatings = 0,
  showChart = true,
  showStats = true,
  showTrends = false,
  animated = true,
  variant = 'detailed', // detailed, compact, chart-only
  className = ''
}) => {
  const [chartType, setChartType] = useState('bar');
  const [showPercentages, setShowPercentages] = useState(true);
  const [viewMode, setViewMode] = useState('distribution'); // distribution, trends, comparison

  // Process rating distribution data
  const distributionData = useMemo(() => {
    const data = [];
    const colors = {
      5: '#4caf50', // Green
      4: '#8bc34a', // Light Green  
      3: '#ff9800', // Orange
      2: '#ff5722', // Deep Orange
      1: '#f44336'  // Red
    };

    for (let i = 5; i >= 1; i--) {
      const count = ratings[i] || 0;
      const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
      
      data.push({
        stars: i,
        count,
        percentage,
        color: colors[i],
        label: `${i} Star${i > 1 ? 's' : ''}`,
        trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend data
      });
    }

    return data;
  }, [ratings, totalRatings]);

  const chartData = distributionData.map(item => ({
    name: item.label,
    value: item.count,
    percentage: item.percentage,
    fill: item.color
  }));

  const averageRating = useMemo(() => {
    if (totalRatings === 0) return 0;
    
    let weighted = 0;
    for (let i = 1; i <= 5; i++) {
      weighted += i * (ratings[i] || 0);
    }
    
    return weighted / totalRatings;
  }, [ratings, totalRatings]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: (percentage) => ({
      width: `${percentage}%`,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    })
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2">
            Count: {payload[0].value}
          </Typography>
          <Typography variant="body2">
            Percentage: {payload[0].payload.percentage.toFixed(1)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (variant === 'compact') {
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
              Rating Distribution
            </Typography>
            <Chip
              label={`${averageRating.toFixed(1)} ⭐`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Box sx={{ space: 1.5 }}>
            {distributionData.map((item, index) => (
              <motion.div
                key={item.stars}
                variants={itemVariants}
                custom={index}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      {item.stars}
                    </Typography>
                    <StarIcon sx={{ fontSize: 14, color: item.color }} />
                  </Box>
                  
                  <Box
                    sx={{
                      flex: 1,
                      height: 8,
                      backgroundColor: 'grey.200',
                      borderRadius: 4,
                      mx: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      variants={barVariants}
                      initial="hidden"
                      animate="visible"
                      custom={item.percentage}
                      style={{
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: 4
                      }}
                    />
                  </Box>
                  
                  <Typography variant="caption" sx={{ minWidth: 40, textAlign: 'right' }}>
                    {showPercentages ? `${item.percentage.toFixed(1)}%` : item.count}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>
    );
  }

  if (variant === 'chart-only') {
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
            borderColor: 'divider',
            height: 300
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Paper>
      </motion.div>
    );
  }

  // Detailed variant (default)
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
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Rating Distribution
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>View</InputLabel>
                  <Select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    label="View"
                  >
                    <MenuItem value="bar">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BarChartIcon sx={{ fontSize: 16 }} />
                        Bars
                      </Box>
                    </MenuItem>
                    <MenuItem value="pie">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AnalyticsIcon sx={{ fontSize: 16 }} />
                        Pie
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showPercentages}
                      onChange={(e) => setShowPercentages(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Show %"
                  sx={{ fontSize: '0.875rem' }}
                />
              </Box>
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Stats Summary */}
            {showStats && (
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                        {averageRating.toFixed(1)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{
                              fontSize: 24,
                              color: i < Math.round(averageRating) ? '#f59e0b' : '#e5e7eb'
                            }}
                          />
                        ))}
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Average Rating
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        Based on {totalRatings.toLocaleString()} reviews
                      </Typography>

                      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Rating Quality
                        </Typography>
                        <Chip
                          label={
                            averageRating >= 4.5 ? 'Excellent' :
                            averageRating >= 4.0 ? 'Very Good' :
                            averageRating >= 3.5 ? 'Good' :
                            averageRating >= 3.0 ? 'Fair' : 'Poor'
                          }
                          color={
                            averageRating >= 4.5 ? 'success' :
                            averageRating >= 4.0 ? 'primary' :
                            averageRating >= 3.0 ? 'warning' : 'error'
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )}

            {/* Distribution Bars */}
            <Grid item xs={12} md={showStats ? 8 : 12}>
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Rating Breakdown
                  </Typography>

                  <Box sx={{ space: 2 }}>
                    <AnimatePresence>
                      {distributionData.map((item, index) => (
                        <motion.div
                          key={item.stars}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          custom={index}
                          whileHover={{ scale: 1.02, x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 2,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              '&:hover': {
                                borderColor: item.color,
                                backgroundColor: `${item.color}08`
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
                              <Typography variant="body1" sx={{ mr: 0.5, fontWeight: 600 }}>
                                {item.stars}
                              </Typography>
                              <StarIcon sx={{ fontSize: 20, color: item.color, mr: 1 }} />
                              
                              {showTrends && (
                                <Tooltip title={`Trend: ${item.trend === 'up' ? 'Increasing' : 'Decreasing'}`}>
                                  {item.trend === 'up' ? (
                                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                  ) : item.trend === 'down' ? (
                                    <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                  ) : (
                                    <TrendingFlatIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                  )}
                                </Tooltip>
                              )}
                            </Box>
                            
                            <Box
                              sx={{
                                flex: 1,
                                height: 12,
                                backgroundColor: 'grey.200',
                                borderRadius: 6,
                                mx: 2,
                                overflow: 'hidden',
                                position: 'relative'
                              }}
                            >
                              <motion.div
                                variants={barVariants}
                                initial="hidden"
                                animate="visible"
                                custom={item.percentage}
                                style={{
                                  height: '100%',
                                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                                  borderRadius: 6,
                                  position: 'relative'
                                }}
                              >
                                {/* Shine effect */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                                    borderRadius: '6px 6px 0 0'
                                  }}
                                />
                              </motion.div>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80, justifyContent: 'flex-end' }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: 'text.primary', mr: 1 }}
                              >
                                {item.count}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', minWidth: 40, textAlign: 'right' }}
                              >
                                ({item.percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Chart Visualization */}
            {showChart && (
              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Visual Distribution
                        </Typography>
                        
                        <IconButton
                          onClick={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}
                          sx={{
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                            '&:hover': {
                              backgroundColor: 'primary.main'
                            }
                          }}
                        >
                          {chartType === 'bar' ? <AnalyticsIcon /> : <BarChartIcon />}
                        </IconButton>
                      </Box>

                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AnimatePresence mode="wait">
                            {chartType === 'pie' ? (
                              <motion.div
                                key="pie"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%', height: '100%' }}
                              >
                                <PieChart>
                                  <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={3}
                                    dataKey="value"
                                  >
                                    {chartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip content={<CustomTooltip />} />
                                </PieChart>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="bar"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%', height: '100%' }}
                              >
                                <BarChart
                                  data={chartData}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <RechartsTooltip content={<CustomTooltip />} />
                                  <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                                </BarChart>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </ResponsiveContainer>
                      </Box>
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

export default RatingDistribution;
