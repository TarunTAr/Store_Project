import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Zoom
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  GetApp as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const LineChart = ({
  data,
  title = 'Line Chart',
  subtitle,
  height = 400,
  loading = false,
  error = null,
  showLegend = true,
  showGrid = true,
  showPoints = true,
  showArea = false,
  animate = true,
  responsive = true,
  maintainAspectRatio = false,
  tension = 0.4,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  gradientColors = true,
  onRefresh,
  onExport,
  className = ''
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [visibleDatasets, setVisibleDatasets] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (data?.datasets) {
      setVisibleDatasets(new Set(data.datasets.map((_, index) => index)));
    }
  }, [data]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const link = document.createElement('a');
      link.download = `line-chart-${Date.now()}.${format}`;
      
      if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
      } else if (format === 'jpg') {
        link.href = canvas.toDataURL('image/jpeg', 0.9);
      }
      
      link.click();
    }
    
    if (onExport) {
      onExport(format);
    }
    handleMenuClose();
  };

  const toggleDataset = (datasetIndex) => {
    const newVisible = new Set(visibleDatasets);
    if (newVisible.has(datasetIndex)) {
      newVisible.delete(datasetIndex);
    } else {
      newVisible.add(datasetIndex);
    }
    setVisibleDatasets(newVisible);
  };

  const createGradient = (ctx, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  const processedData = React.useMemo(() => {
    if (!data?.datasets) return null;

    const canvas = chartRef.current?.canvas;
    const ctx = canvas?.getContext('2d');

    return {
      ...data,
      datasets: data.datasets.map((dataset, index) => {
        const color = colors[index % colors.length];
        const isVisible = visibleDatasets.has(index);
        
        let backgroundColor = color;
        let borderColor = color;

        if (ctx && gradientColors) {
          if (showArea) {
            backgroundColor = createGradient(ctx, `${color}40`, `${color}10`);
          }
          
          if (dataset.gradient !== false) {
            borderColor = createGradient(ctx, color, `${color}cc`);
          }
        }

        return {
          ...dataset,
          borderColor,
          backgroundColor: showArea ? backgroundColor : 'transparent',
          borderWidth: 3,
          pointRadius: showPoints ? 6 : 0,
          pointHoverRadius: showPoints ? 8 : 0,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          fill: showArea,
          tension,
          hidden: !isVisible,
          ...(animate && {
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart'
            }
          })
        };
      })
    };
  }, [data, colors, showArea, showPoints, tension, visibleDatasets, gradientColors, animate]);

  const options = {
    responsive,
    maintainAspectRatio,
    interaction: {
      intersect: false,
      mode: 'index',
    },
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
          },
          generateLabels: (chart) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);
            
            return labels.map((label, index) => ({
              ...label,
              hidden: !visibleDatasets.has(index)
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: colors[0],
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return `${context[0].label}`;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = typeof context.parsed.y === 'number' 
              ? context.parsed.y.toFixed(2) 
              : context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.06)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.06)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280'
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      },
      line: {
        borderCapStyle: 'round',
        borderJoinStyle: 'round'
      }
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
          backdropFilter: 'blur(10px)',
          ...(isFullscreen && {
            position: 'fixed',
            inset: 16,
            zIndex: 9999
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <TimelineIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {title}
                  </Typography>
                </Box>
                
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Chart Type">
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="line">Line</MenuItem>
                      <MenuItem value="area">Area</MenuItem>
                      <MenuItem value="stepped">Stepped</MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>

                <Tooltip title="Refresh">
                  <IconButton size="small" onClick={onRefresh} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Fullscreen">
                  <IconButton size="small" onClick={() => setIsFullscreen(!isFullscreen)}>
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>

                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Dataset Controls */}
            {data?.datasets && data.datasets.length > 1 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.datasets.map((dataset, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={dataset.label || `Dataset ${index + 1}`}
                      onClick={() => toggleDataset(index)}
                      icon={visibleDatasets.has(index) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      color={visibleDatasets.has(index) ? 'primary' : 'default'}
                      variant={visibleDatasets.has(index) ? 'filled' : 'outlined'}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        '& .MuiChip-icon': {
                          color: colors[index % colors.length]
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            )}
          </motion.div>
        </Box>

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
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <CircularProgress
                      sx={{ color: colors[0], mb: 2 }}
                    />
                  </motion.div>
                  <Typography variant="body2" color="text.secondary">
                    Loading chart data...
                  </Typography>
                </Box>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ height }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center',
                    borderRadius: 3 
                  }}
                >
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
            ) : processedData ? (
              <Fade in={true}>
                <Box style={{ height }}>
                  <Line
                    ref={chartRef}
                    data={processedData}
                    options={options}
                  />
                </Box>
              </Fade>
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
                  <ShowChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
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
        {processedData && !loading && !error && (
          <motion.div variants={itemVariants}>
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
                {data?.datasets?.map((dataset, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: colors[index % colors.length]
                      }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                      {dataset.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
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

        <MenuItem onClick={() => setShowArea(!showArea)}>
          <ListItemIcon>
            <PaletteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {showArea ? 'Hide Area Fill' : 'Show Area Fill'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setShowPoints(!showPoints)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {showPoints ? 'Hide Points' : 'Show Points'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default LineChart;
