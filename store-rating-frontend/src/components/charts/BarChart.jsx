import React, { useRef, useState, useMemo } from 'react';
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
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  GetApp as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  StackedBarChart as StackedIcon,
  TrendingUp as TrendingUpIcon,
  Palette as PaletteIcon,
  GridOn as GridIcon,
  GridOff as GridOffIcon,
  Settings as SettingsIcon,
  SwapHoriz as HorizontalIcon,
  SwapVert as VerticalIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const BarChart = ({
  data,
  title = 'Bar Chart',
  subtitle,
  height = 400,
  loading = false,
  error = null,
  showLegend = true,
  showGrid = true,
  stacked = false,
  horizontal = false,
  animate = true,
  responsive = true,
  maintainAspectRatio = false,
  barThickness = 'flex',
  borderRadius = 4,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  gradientBars = true,
  onRefresh,
  onExport,
  className = ''
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chartOrientation, setChartOrientation] = useState(horizontal ? 'horizontal' : 'vertical');
  const [isStacked, setIsStacked] = useState(stacked);
  const [showGridLines, setShowGridLines] = useState(showGrid);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      link.download = `bar-chart-${Date.now()}.${format}`;
      
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

  const createGradient = (ctx, color, direction = 'vertical') => {
    const gradient = direction === 'vertical' 
      ? ctx.createLinearGradient(0, 0, 0, 400)
      : ctx.createLinearGradient(0, 0, 400, 0);
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `${color}66`);
    return gradient;
  };

  const processedData = useMemo(() => {
    if (!data?.datasets) return null;

    const canvas = chartRef.current?.canvas;
    const ctx = canvas?.getContext('2d');

    return {
      ...data,
      datasets: data.datasets.map((dataset, index) => {
        const color = colors[index % colors.length];
        
        let backgroundColor = color;
        if (ctx && gradientBars) {
          backgroundColor = createGradient(ctx, color, chartOrientation);
        }

        return {
          ...dataset,
          backgroundColor,
          borderColor: color,
          borderWidth: 2,
          borderRadius: {
            topLeft: borderRadius,
            topRight: borderRadius,
            bottomLeft: chartOrientation === 'horizontal' ? borderRadius : 0,
            bottomRight: chartOrientation === 'horizontal' ? 0 : borderRadius,
          },
          borderSkipped: false,
          barThickness: barThickness === 'flex' ? undefined : barThickness,
          maxBarThickness: 60,
          ...(animate && {
            animation: {
              duration: 1500,
              easing: 'easeInOutQuart'
            }
          })
        };
      })
    };
  }, [data, colors, gradientBars, borderRadius, barThickness, animate, chartOrientation]);

  const options = {
    indexAxis: chartOrientation === 'horizontal' ? 'y' : 'x',
    responsive,
    maintainAspectRatio,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        stacked: isStacked,
        grid: {
          display: showGridLines && chartOrientation === 'vertical',
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
        stacked: isStacked,
        beginAtZero: true,
        grid: {
          display: showGridLines && chartOrientation === 'horizontal',
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
        borderColor: colors[0],
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = typeof context.parsed.y === 'number' 
              ? context.parsed.y.toLocaleString() 
              : typeof context.parsed.x === 'number'
              ? context.parsed.x.toLocaleString()
              : context.raw;
            return `${label}: ${value}`;
          },
          afterLabel: (context) => {
            if (isStacked && processedData?.datasets) {
              const total = processedData.datasets.reduce((sum, dataset) => {
                return sum + (dataset.data[context.dataIndex] || 0);
              }, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${percentage}% of total`;
            }
            return null;
          }
        }
      }
    },
    elements: {
      bar: {
        borderSkipped: false,
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
                  <BarChartIcon color="primary" />
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
                <Tooltip title="Orientation">
                  <IconButton 
                    size="small" 
                    onClick={() => setChartOrientation(chartOrientation === 'vertical' ? 'horizontal' : 'vertical')}
                  >
                    {chartOrientation === 'vertical' ? <HorizontalIcon /> : <VerticalIcon />}
                  </IconButton>
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

            {/* Controls */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isStacked}
                    onChange={(e) => setIsStacked(e.target.checked)}
                    size="small"
                  />
                }
                label="Stacked"
                sx={{ fontSize: '0.875rem' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showGridLines}
                    onChange={(e) => setShowGridLines(e.target.checked)}
                    size="small"
                  />
                }
                label="Grid Lines"
                sx={{ fontSize: '0.875rem' }}
              />

              {data?.datasets && (
                <Chip
                  label={`${data.datasets.length} Series`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Box>
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
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
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
                  <Bar
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
                  <BarChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
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

        {/* Footer with Statistics */}
        {processedData && !loading && !error && (
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: 1,
                borderColor: 'divider',
                backgroundColor: 'grey.50'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date().toLocaleString()}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={chartOrientation}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                  />
                  {isStacked && (
                    <Chip
                      label="Stacked"
                      size="small"
                      color="primary"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {data?.datasets?.map((dataset, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 1,
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

        <MenuItem onClick={() => setIsStacked(!isStacked)}>
          <ListItemIcon>
            <StackedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {isStacked ? 'Unstack Bars' : 'Stack Bars'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setShowGridLines(!showGridLines)}>
          <ListItemIcon>
            {showGridLines ? <GridOffIcon fontSize="small" /> : <GridIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {showGridLines ? 'Hide Grid' : 'Show Grid'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setChartOrientation(chartOrientation === 'vertical' ? 'horizontal' : 'vertical')}>
          <ListItemIcon>
            {chartOrientation === 'vertical' ? <HorizontalIcon fontSize="small" /> : <VerticalIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {chartOrientation === 'vertical' ? 'Horizontal Bars' : 'Vertical Bars'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default BarChart;
