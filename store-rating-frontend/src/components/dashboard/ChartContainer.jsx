import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Alert,
  Fade,
  Collapse,
  Chip,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Fullscreen as FullscreenIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  DonutLarge as DonutIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
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

const ChartContainer = ({
  title,
  subtitle,
  data,
  chartType = 'line', // line, bar, pie, doughnut, area
  loading = false,
  error = null,
  height = 300,
  showControls = true,
  showLegend = true,
  showGrid = true,
  animated = true,
  responsive = true,
  timeRange = '30d',
  onTimeRangeChange,
  onRefresh,
  onExport,
  onFullscreen,
  customOptions = {},
  className = ''
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentChartType, setCurrentChartType] = useState(chartType);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const chartRef = useRef(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChartTypeChange = (type) => {
    setCurrentChartType(type);
    handleMenuClose();
  };

  const handleExport = (format) => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.${format}`;
      
      if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
      } else if (format === 'jpg') {
        link.href = canvas.toDataURL('image/jpeg');
      }
      
      link.click();
    }
    
    if (onExport) {
      onExport(format);
    }
    handleMenuClose();
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onFullscreen) {
      onFullscreen(!isFullscreen);
    }
  };

  const getChartOptions = () => {
    const baseOptions = {
      responsive,
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
          display: showLegend,
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
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y || context.parsed;
              return label;
            }
          }
        }
      },
      ...customOptions
    };

    if (currentChartType === 'line' || currentChartType === 'bar' || currentChartType === 'area') {
      baseOptions.scales = {
        x: {
          grid: {
            display: showGrid,
            color: 'rgba(0, 0, 0, 0.06)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: currentChartType === 'bar',
          grid: {
            display: showGrid,
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

  const processChartData = () => {
    if (!data) return null;

    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    
    if (currentChartType === 'area') {
      return {
        ...data,
        datasets: data.datasets?.map((dataset, index) => ({
          ...dataset,
          fill: true,
          backgroundColor: `${colors[index % colors.length]}20`,
          borderColor: colors[index % colors.length],
          tension: 0.4,
        }))
      };
    }

    if (currentChartType === 'pie' || currentChartType === 'doughnut') {
      return {
        ...data,
        datasets: data.datasets?.map(dataset => ({
          ...dataset,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 2,
        }))
      };
    }

    return {
      ...data,
      datasets: data.datasets?.map((dataset, index) => ({
        ...dataset,
        backgroundColor: currentChartType === 'bar' 
          ? `${colors[index % colors.length]}80`
          : colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 2,
        ...(currentChartType === 'line' && {
          tension: 0.4,
          pointBackgroundColor: colors[index % colors.length],
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        })
      }))
    };
  };

  const renderChart = () => {
    const chartData = processChartData();
    const options = getChartOptions();

    if (!chartData) return null;

    const chartProps = {
      ref: chartRef,
      data: chartData,
      options,
    };

    switch (currentChartType) {
      case 'line':
        return <Line {...chartProps} />;
      case 'area':
        return <Line {...chartProps} />;
      case 'bar':
        return <Bar {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      default:
        return <Line {...chartProps} />;
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

  const getChartTypeIcon = (type) => {
    switch (type) {
      case 'line':
        return <LineChartIcon />;
      case 'bar':
        return <BarChartIcon />;
      case 'pie':
        return <PieChartIcon />;
      case 'doughnut':
        return <DonutIcon />;
      case 'area':
        return <TimelineIcon />;
      default:
        return <LineChartIcon />;
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
          backdropFilter: 'blur(10px)',
          ...(isFullscreen && {
            position: 'fixed',
            inset: 16,
            zIndex: 9999,
            height: 'auto'
          })
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
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {showControls && (
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
                        <MenuItem value="1y">1 Year</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  <Tooltip title="Toggle filters">
                    <IconButton
                      size="small"
                      onClick={() => setShowFilters(!showFilters)}
                      color={showFilters ? 'primary' : 'default'}
                    >
                      <FilterIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Refresh data">
                    <IconButton
                      size="small"
                      onClick={onRefresh}
                      disabled={loading}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Fullscreen">
                    <IconButton size="small" onClick={handleFullscreen}>
                      {isFullscreen ? <CloseIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>

                  <IconButton size="small" onClick={handleMenuOpen}>
                    <MoreIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Chart Type Selector */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['line', 'bar', 'pie', 'doughnut', 'area'].map((type) => (
                <Chip
                  key={type}
                  icon={getChartTypeIcon(type)}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  clickable
                  size="small"
                  color={currentChartType === type ? 'primary' : 'default'}
                  onClick={() => setCurrentChartType(type)}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* Filters */}
        <Collapse in={showFilters}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
            <Typography variant="caption" color="text.secondary">
              Additional filters and options would go here
            </Typography>
          </Box>
        </Collapse>

        {/* Chart Content */}
        <Box sx={{ p: 3, position: 'relative' }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  height,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress
                    sx={{
                      color: '#667eea',
                      mb: 2
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Loading chart data...
                  </Typography>
                </Box>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ height }}
              >
                <Alert severity="error" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Failed to load chart
                    </Typography>
                    <Typography variant="body2">
                      {error}
                    </Typography>
                    {onRefresh && (
                      <Button
                        startIcon={<RefreshIcon />}
                        onClick={onRefresh}
                        sx={{ mt: 2 }}
                      >
                        Retry
                      </Button>
                    )}
                  </Box>
                </Alert>
              </motion.div>
            ) : data ? (
              <motion.div
                key={currentChartType}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ height }}
              >
                {renderChart()}
              </motion.div>
            ) : (
              <motion.div
                key="no-data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  height,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Data Available
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Chart data will appear here when available
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Footer */}
        {data && !loading && !error && (
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Zoom In">
                <IconButton size="small">
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton size="small">
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <MenuItem onClick={() => handleExport('png')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PNG</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleExport('jpg')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as JPG</ListItemText>
        </MenuItem>

        <Divider />

        {['line', 'bar', 'pie', 'doughnut', 'area'].map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleChartTypeChange(type)}
            selected={currentChartType === type}
          >
            <ListItemIcon>
              {getChartTypeIcon(type)}
            </ListItemIcon>
            <ListItemText>
              {type.charAt(0).toUpperCase() + type.slice(1)} Chart
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </motion.div>
  );
};

export default ChartContainer;
