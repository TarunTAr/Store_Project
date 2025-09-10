import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Fullscreen as FullscreenIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const RatingChart = ({
  data = {},
  type = 'line', // line, bar, pie, doughnut, area
  timeRange = '7d', // 1d, 7d, 30d, 90d, 1y
  showControls = true,
  showStats = true,
  animated = true,
  height = 300,
  title = 'Rating Analytics',
  className = ''
}) => {
  const [chartType, setChartType] = useState(type);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({});
  const chartRef = useRef(null);

  useEffect(() => {
    generateChartData();
  }, [data, chartType, selectedTimeRange]);

  const generateChartData = () => {
    setLoading(true);
    
    // Simulate data processing
    setTimeout(() => {
      const processedData = processRatingData(data, chartType, selectedTimeRange);
      setChartData(processedData);
      calculateStats(data);
      setLoading(false);
    }, 500);
  };

  const processRatingData = (rawData, type, range) => {
    const gradientColors = {
      primary: ['rgba(102, 126, 234, 0.8)', 'rgba(118, 75, 162, 0.8)'],
      success: ['rgba(76, 175, 80, 0.8)', 'rgba(139, 195, 74, 0.8)'],
      warning: ['rgba(255, 152, 0, 0.8)', 'rgba(255, 193, 7, 0.8)'],
      error: ['rgba(244, 67, 54, 0.8)', 'rgba(233, 30, 99, 0.8)']
    };

    switch (type) {
      case 'line':
      case 'area':
        return {
          labels: rawData.timeLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Average Rating',
              data: rawData.timeSeriesData || [4.2, 4.3, 4.1, 4.5, 4.4, 4.6],
              borderColor: gradientColors.primary[0],
              backgroundColor: type === 'area' ? gradientColors.primary[0].replace('0.8', '0.2') : 'transparent',
              tension: 0.4,
              fill: type === 'area',
              pointBackgroundColor: gradientColors.primary[0],
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            }
          ]
        };

      case 'bar':
        return {
          labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
          datasets: [
            {
              label: 'Rating Distribution',
              data: rawData.distribution || [5, 10, 25, 45, 60],
              backgroundColor: [
                'rgba(244, 67, 54, 0.8)',
                'rgba(255, 152, 0, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(139, 195, 74, 0.8)',
                'rgba(76, 175, 80, 0.8)'
              ],
              borderColor: [
                'rgba(244, 67, 54, 1)',
                'rgba(255, 152, 0, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(139, 195, 74, 1)',
                'rgba(76, 175, 80, 1)'
              ],
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        };

      case 'pie':
      case 'doughnut':
        return {
          labels: ['Excellent (5★)', 'Very Good (4★)', 'Good (3★)', 'Fair (2★)', 'Poor (1★)'],
          datasets: [
            {
              data: rawData.distribution || [60, 45, 25, 10, 5],
              backgroundColor: [
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(255, 152, 0, 0.8)',
                'rgba(244, 67, 54, 0.8)'
              ],
              borderColor: '#fff',
              borderWidth: 3,
              hoverBorderWidth: 4,
            }
          ]
        };

      default:
        return null;
    }
  };

  const calculateStats = (data) => {
    const totalRatings = data.totalRatings || 145;
    const averageRating = data.averageRating || 4.3;
    const previousAverage = data.previousAverage || 4.1;
    const trend = averageRating - previousAverage;

    setStats({
      totalRatings,
      averageRating,
      trend,
      trendPercentage: ((trend / previousAverage) * 100).toFixed(1)
    });
  };

  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      animation: animated ? {
        duration: 1000,
        easing: 'easeOutQuart'
      } : false,
      plugins: {
        legend: {
          display: chartType !== 'pie' && chartType !== 'doughnut',
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: 600
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#667eea',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              if (chartType === 'pie' || chartType === 'doughnut') {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
              return `${context.dataset.label}: ${context.parsed.y || context.parsed}`;
            }
          }
        }
      }
    };

    if (chartType === 'line' || chartType === 'area' || chartType === 'bar') {
      baseOptions.scales = {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: chartType === 'bar',
          min: chartType === 'line' || chartType === 'area' ? 0 : undefined,
          max: chartType === 'line' || chartType === 'area' ? 5 : undefined,
          grid: {
            color: 'rgba(0, 0, 0, 0.06)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      };
    }

    return baseOptions;
  };

  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
      data: chartData,
      options: getChartOptions(),
      ref: chartRef
    };

    switch (chartType) {
      case 'line':
      case 'area':
        return <Line {...commonProps} />;
      case 'bar':
        return <Bar {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `rating-chart-${Date.now()}.png`;
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
  };

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
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
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>

              {showControls && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Refresh Data">
                    <IconButton
                      size="small"
                      onClick={generateChartData}
                      disabled={loading}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download Chart">
                    <IconButton size="small" onClick={downloadChart}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Fullscreen">
                    <IconButton size="small">
                      <FullscreenIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  label="Chart Type"
                >
                  <MenuItem value="line">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimelineIcon sx={{ fontSize: 16 }} />
                      Line Chart
                    </Box>
                  </MenuItem>
                  <MenuItem value="bar">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BarChartIcon sx={{ fontSize: 16 }} />
                      Bar Chart
                    </Box>
                  </MenuItem>
                  <MenuItem value="pie">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PieChartIcon sx={{ fontSize: 16 }} />
                      Pie Chart
                    </Box>
                  </MenuItem>
                  <MenuItem value="area">Area Chart</MenuItem>
                  <MenuItem value="doughnut">Doughnut Chart</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="1d">1 Day</MenuItem>
                  <MenuItem value="7d">7 Days</MenuItem>
                  <MenuItem value="30d">30 Days</MenuItem>
                  <MenuItem value="90d">90 Days</MenuItem>
                  <MenuItem value="1y">1 Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </motion.div>
        </Box>

        {/* Stats Cards */}
        {showStats && (
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Ratings
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {stats.totalRatings?.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Average Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {stats.averageRating?.toFixed(1)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {stats.trend > 0 ? (
                          <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        ) : (
                          <TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            color: stats.trend > 0 ? 'success.main' : 'error.main',
                            fontWeight: 600
                          }}
                        >
                          {Math.abs(stats.trendPercentage)}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          </Box>
        )}

        {/* Chart Container */}
        <Box sx={{ p: 3, position: 'relative' }}>
          {loading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                sx={{
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }
                }}
              />
            </Box>
          )}

          <motion.div
            variants={itemVariants}
            style={{ height }}
          >
            <AnimatePresence mode="wait">
              {chartData && (
                <motion.div
                  key={chartType}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%' }}
                >
                  {renderChart()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default RatingChart;
