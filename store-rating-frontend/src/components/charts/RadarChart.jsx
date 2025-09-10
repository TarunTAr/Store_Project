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
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  GetApp as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  Radar as RadarIcon,
  CenterFocusStrong as CenterIcon,
  GridOn as GridIcon,
  GridOff as GridOffIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  TrendingUp as TrendingUpIcon,
  CompareArrows as CompareIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

const RadarChart = ({
  data,
  title = 'Radar Chart',
  subtitle,
  height = 400,
  loading = false,
  error = null,
  showLegend = true,
  showGrid = true,
  showLabels = true,
  showStats = true,
  animate = true,
  responsive = true,
  maintainAspectRatio = false,
  tension = 0.3,
  fillOpacity = 0.2,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  maxScale = null,
  minScale = 0,
  scaleSteps = 5,
  onRefresh,
  onExport,
  className = ''
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [visibleDatasets, setVisibleDatasets] = useState(new Set());
  const [chartTension, setChartTension] = useState(tension);
  const [chartFillOpacity, setChartFillOpacity] = useState(fillOpacity);
  const [showGridLines, setShowGridLines] = useState(showGrid);
  const [showDataLabels, setShowDataLabels] = useState(showLabels);
  const [comparisonMode, setComparisonMode] = useState(false);
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
      link.download = `radar-chart-${Date.now()}.${format}`;
      
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

  // Calculate statistics for radar data
  const radarStats = useMemo(() => {
    if (!data?.datasets || !data?.labels) return {};

    const stats = {
      datasets: [],
      labels: data.labels.map((label, labelIndex) => ({
        name: label,
        values: data.datasets.map(dataset => dataset.data[labelIndex] || 0),
        max: Math.max(...data.datasets.map(dataset => dataset.data[labelIndex] || 0)),
        min: Math.min(...data.datasets.map(dataset => dataset.data[labelIndex] || 0)),
        avg: data.datasets.reduce((sum, dataset) => sum + (dataset.data[labelIndex] || 0), 0) / data.datasets.length
      }))
    };

    stats.datasets = data.datasets.map((dataset, index) => {
      const values = dataset.data || [];
      const total = values.reduce((sum, val) => sum + val, 0);
      const avg = total / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);

      return {
        label: dataset.label,
        total,
        average: avg,
        maximum: max,
        minimum: min,
        color: colors[index % colors.length],
        visible: visibleDatasets.has(index)
      };
    });

    return stats;
  }, [data, colors, visibleDatasets]);

  const processedData = useMemo(() => {
    if (!data?.datasets) return null;

    const maxValue = maxScale || Math.max(
      ...data.datasets.flatMap(dataset => dataset.data || [])
    );

    return {
      labels: data.labels,
      datasets: data.datasets.map((dataset, index) => {
        const color = colors[index % colors.length];
        const isVisible = visibleDatasets.has(index);
        
        return {
          ...dataset,
          borderColor: color,
          backgroundColor: `${color}${Math.floor(chartFillOpacity * 255).toString(16).padStart(2, '0')}`,
          borderWidth: 3,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: chartTension,
          fill: true,
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
  }, [data, colors, chartTension, chartFillOpacity, visibleDatasets, animate, maxScale]);

  const options = {
    responsive,
    maintainAspectRatio,
    scales: {
      r: {
        beginAtZero: true,
        min: minScale,
        max: maxScale,
        grid: {
          display: showGridLines,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          display: showGridLines,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          display: showDataLabels,
          font: {
            size: 12,
            weight: 600
          },
          color: '#374151'
        },
        ticks: {
          display: showGridLines,
          font: {
            size: 10
          },
          color: '#9ca3af',
          stepSize: maxScale ? maxScale / scaleSteps : undefined
        }
      }
    },
    plugins: {
      legend: {
        display: showLegend && !showStats,
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
            const value = context.parsed.r;
            const percentage = maxScale ? ((value / maxScale) * 100).toFixed(1) : value;
            return [
              `${label}: ${value.toFixed(1)}`,
              `Performance: ${percentage}${maxScale ? '%' : ''}`
            ];
          },
          afterBody: (context) => {
            if (comparisonMode && radarStats.labels) {
              const labelIndex = context[0].dataIndex;
              const labelStats = radarStats.labels[labelIndex];
              return [
                '',
                `Category Average: ${labelStats.avg.toFixed(1)}`,
                `Category Range: ${labelStats.min.toFixed(1)} - ${labelStats.max.toFixed(1)}`
              ];
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: "easeOutBack"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const radarVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1.5
      }
    }
  };

  const StatCard = ({ label, value, color, comparison }) => (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
      <Card
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: color,
          background: `linear-gradient(135deg, ${color}10, ${color}05)`,
          '&:hover': {
            boxShadow: `0 4px 15px ${color}30`
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color, mb: 0.5 }}>
            {typeof value === 'number' ? value.toFixed(1) : value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          {comparison && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                +{comparison}%
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

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
                  <RadarIcon color="primary" />
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
                <Tooltip title="Comparison Mode">
                  <IconButton 
                    size="small" 
                    color={comparisonMode ? 'primary' : 'default'}
                    onClick={() => setComparisonMode(!comparisonMode)}
                  >
                    <CompareIcon />
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                <Typography variant="caption">Smoothness:</Typography>
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
                  max={0.8}
                  step={0.1}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Typography variant="caption">{chartFillOpacity}</Typography>
              </Box>

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

              <FormControlLabel
                control={
                  <Switch
                    checked={showDataLabels}
                    onChange={(e) => setShowDataLabels(e.target.checked)}
                    size="small"
                  />
                }
                label="Labels"
                sx={{ fontSize: '0.875rem' }}
              />
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

        {/* Chart and Stats Layout */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Chart */}
          <Box sx={{ flex: showStats ? 2 : 1, minWidth: 400, p: 3, position: 'relative' }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    height: 350,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <CircularProgress
                        sx={{ color: colors[0], mb: 2 }}
                        thickness={4}
                        size={60}
                      />
                    </motion.div>
                    <Typography variant="body2" color="text.secondary">
                      Loading radar chart...
                    </Typography>
                  </Box>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ height: 350 }}
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
                  key={`${chartTension}-${chartFillOpacity}-${showGridLines}`}
                  variants={radarVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ height: 350 }}
                >
                  <Radar ref={chartRef} data={processedData} options={options} />
                </motion.div>
              ) : (
                <motion.div
                  key="no-data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    height: 350,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <RadarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
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

          {/* Statistics Panel */}
          {showStats && radarStats.datasets && (
            <motion.div
              variants={itemVariants}
              style={{ flex: 1, minWidth: 280, padding: 24, borderLeft: '1px solid #e5e7eb' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Performance Metrics
              </Typography>

              {/* Dataset Statistics */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Dataset Performance
                </Typography>
                
                <Grid container spacing={2}>
                  {radarStats.datasets
                    .filter(dataset => dataset.visible)
                    .map((dataset, index) => (
                      <Grid item xs={12} key={index}>
                        <StatCard
                          label={dataset.label}
                          value={dataset.average}
                          color={dataset.color}
                          comparison={comparisonMode ? Math.round((dataset.average / dataset.maximum) * 100 - 100) : null}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>

              {/* Category Breakdown */}
              {radarStats.labels && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Category Analysis
                  </Typography>
                  
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {radarStats.labels.map((label, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        custom={index}
                      >
                        <Card
                          sx={{
                            mb: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'primary.light'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              {label.name}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Average: {label.avg.toFixed(1)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Range: {label.min.toFixed(1)} - {label.max.toFixed(1)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {label.values.map((value, valueIndex) => (
                                <Box
                                  key={valueIndex}
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: colors[valueIndex % colors.length],
                                    opacity: value / label.max
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              )}
            </motion.div>
          )}
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
                backgroundColor: 'grey.50'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date().toLocaleString()}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={`${data?.labels?.length || 0} dimensions`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                  
                  <Chip
                    label={`${Math.round(chartTension * 100)}% smooth`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />

                  {comparisonMode && (
                    <Chip
                      label="Comparison On"
                      size="small"
                      color="primary"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
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

        <MenuItem onClick={() => setComparisonMode(!comparisonMode)}>
          <ListItemIcon>
            <CompareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {comparisonMode ? 'Disable' : 'Enable'} Comparison
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

        <MenuItem onClick={() => setShowDataLabels(!showDataLabels)}>
          <ListItemIcon>
            {showDataLabels ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {showDataLabels ? 'Hide Labels' : 'Show Labels'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default RadarChart;
