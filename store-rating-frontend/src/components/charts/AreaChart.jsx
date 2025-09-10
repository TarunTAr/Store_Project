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
  FormControlLabel,
  Slider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  GetApp as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  AreaChart as AreaChartIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  StackedLineChart as StackedIcon,
  Gradient as GradientIcon,
  Palette as PaletteIcon,
  GridOn as GridIcon,
  GridOff as GridOffIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
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

const AreaChart = ({
  data,
  title = 'Area Chart',
  subtitle,
  height = 400,
  loading = false,
  error = null,
  showLegend = true,
  showGrid = true,
  showPoints = true,
  stacked = false,
  animate = true,
  responsive = true,
  maintainAspectRatio = false,
  tension = 0.4,
  fillOpacity = 0.3,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  gradientFill = true,
  onRefresh,
  onExport,
  className = ''
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [areaMode, setAreaMode] = useState(stacked ? 'stacked' : 'overlapping');
  const [visibleDatasets, setVisibleDatasets] = useState(new Set());
  const [chartTension, setChartTension] = useState(tension);
  const [chartFillOpacity, setChartFillOpacity] = useState(fillOpacity);
  const [showGridLines, setShowGridLines] = useState(showGrid);
  const [showDataPoints, setShowDataPoints] = useState(showPoints);
  const [isFullscreen, setIsFullscreen] = useState(false);

  React.useEffect(() => {
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
      link.download = `area-chart-${Date.now()}.${format}`;
      
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

  const createGradient = (ctx, colorStart, colorEnd, opacity) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `${colorStart}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${colorEnd}${Math.floor(opacity * 0.1 * 255).toString(16).padStart(2, '0')}`);
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
        const isVisible = visibleDatasets.has(index);
        
        let backgroundColor = color;
        if (ctx && gradientFill) {
          backgroundColor = createGradient(ctx, color, color, chartFillOpacity);
        } else {
          backgroundColor = `${color}${Math.floor(chartFillOpacity * 255).toString(16).padStart(2, '0')}`;
        }

        return {
          ...dataset,
          borderColor: color,
          backgroundColor,
          borderWidth: 3,
          pointRadius: showDataPoints ? 5 : 0,
          pointHoverRadius: showDataPoints ? 7 : 0,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          fill: areaMode === 'stacked' ? (index === 0 ? 'origin' : '-1') : 'origin',
          tension: chartTension,
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
  }, [data, colors, chartTension, chartFillOpacity, visibleDatasets, gradientFill, animate, areaMode, showDataPoints]);

  const options = {
    responsive,
    maintainAspectRatio,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: {
          display: showGridLines,
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
        stacked: areaMode === 'stacked',
        grid: {
          display: showGridLines,
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: colors[0],
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const label = context.dataset.label || '';
            const value = typeof context.parsed.y === 'number' 
              ? context.parsed.y.toLocaleString() 
              : context.parsed.y;
            return `${label}: ${value}`;
          },
          afterBody: (context) => {
            if (areaMode === 'stacked' && context.length > 1) {
              const total = context.reduce((sum, item) => sum + item.parsed.y, 0);
              return `Total: ${total.toLocaleString()}`;
            }
            return null;
          }
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
        duration: 0.8,
        staggerChildren: 0.1,
        ease: "easeOutCubic"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1
      }
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
                  <AreaChartIcon color="primary" />
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
                <Tooltip title="Area Mode">
                  <ToggleButtonGroup
                    value={areaMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setAreaMode(newMode)}
                    size="small"
                  >
                    <ToggleButton value="overlapping">
                      <Tooltip title="Overlapping">
                        <TimelineIcon />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="stacked">
                      <Tooltip title="Stacked">
                        <StackedIcon />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
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

            {/* Advanced Controls */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                <Typography variant="caption">Smoothing:</Typography>
                <Slider
                  value={chartTension}
                  onChange={(e, value) => setChartTension(value)}
                  min={0}
                  max={1}
                  step={0.1}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Typography variant="caption">{chartTension}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                <Typography variant="caption">Fill:</Typography>
                <Slider
                  value={chartFillOpacity}
                  onChange={(e, value) => setChartFillOpacity(value)}
                  min={0.1}
                  max={1}
                  step={0.1}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Typography variant="caption">{chartFillOpacity}</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={showDataPoints}
                    onChange={(e) => setShowDataPoints(e.target.checked)}
                    size="small"
                  />
                }
                label="Points"
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
                label="Grid"
                sx={{ fontSize: '0.875rem' }}
              />
            </Box>

            {/* Dataset Visibility Controls */}
            {data?.datasets && data.datasets.length > 1 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.datasets.map((dataset, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={dataset.label || `Series ${index + 1}`}
                      onClick={() => toggleDataset(index)}
                      icon={visibleDatasets.has(index) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      color={visibleDatasets.has(index) ? 'primary' : 'default'}
                      variant={visibleDatasets.has(index) ? 'filled' : 'outlined'}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        '& .MuiChip-icon': {
                          color: colors[index % colors.length]
                        },
                        ...(visibleDatasets.has(index) && {
                          backgroundColor: `${colors[index % colors.length]}20`,
                          borderColor: colors[index % colors.length]
                        })
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
                      thickness={4}
                      size={50}
                    />
                  </motion.div>
                  <Typography variant="body2" color="text.secondary">
                    Loading area chart...
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
              <motion.div
                key={`${areaMode}-${chartTension}-${chartFillOpacity}`}
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                style={{ height }}
              >
                <Line
                  ref={chartRef}
                  data={processedData}
                  options={options}
                />
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
                  <AreaChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
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

        {/* Footer with Chart Info */}
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
                    label={areaMode}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                  />
                  
                  <Chip
                    label={`${Math.round(chartTension * 100)}% smooth`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />

                  <Chip
                    label={`${Math.round(chartFillOpacity * 100)}% opacity`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {data?.datasets?.filter((_, index) => visibleDatasets.has(index)).map((dataset, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: colors[index % colors.length],
                        opacity: chartFillOpacity
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

        <MenuItem onClick={() => setAreaMode(areaMode === 'stacked' ? 'overlapping' : 'stacked')}>
          <ListItemIcon>
            <StackedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {areaMode === 'stacked' ? 'Unstack Areas' : 'Stack Areas'}
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

        <MenuItem onClick={() => setShowDataPoints(!showDataPoints)}>
          <ListItemIcon>
            {showDataPoints ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {showDataPoints ? 'Hide Points' : 'Show Points'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default AreaChart;
