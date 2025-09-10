import React, { useRef, useState, useMemo, useEffect } from 'react';
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
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Switch,
  FormControlLabel,
  Slider
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  GetApp as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  DonutLarge as DonutIcon,
  PieChart as PieChartIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  CenterFocusStrong as CenterIcon,
  RadioButtonUnchecked as RingIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const DonutChart = ({
  data,
  title = 'Donut Chart',
  subtitle,
  height = 400,
  loading = false,
  error = null,
  showLegend = true,
  showStats = true,
  showCenter = true,
  animate = true,
  responsive = true,
  maintainAspectRatio = false,
  cutout = 65,
  thickness = 35,
  spacing = 2,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
  centerMetric = 'total',
  animationSpeed = 2000,
  onRefresh,
  onExport,
  onSegmentClick,
  className = ''
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedSegments, setSelectedSegments] = useState(new Set());
  const [chartCutout, setChartCutout] = useState(cutout);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(animationSpeed);

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
      link.download = `donut-chart-${Date.now()}.${format}`;
      
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

  const toggleSegment = (index) => {
    const newSelected = new Set(selectedSegments);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSegments(newSelected);
  };

  // Calculate statistics and processed data
  const { processedData, statistics, centerText } = useMemo(() => {
    if (!data?.datasets?.[0]?.data) return { processedData: null, statistics: {}, centerText: {} };

    const dataset = data.datasets[0];
    const visibleData = dataset.data.map((value, index) => 
      selectedSegments.has(index) ? 0 : value
    );

    const total = visibleData.reduce((sum, value) => sum + value, 0);
    const max = Math.max(...visibleData);
    const maxIndex = visibleData.indexOf(max);

    const processedData = {
      labels: data.labels,
      datasets: [{
        ...dataset,
        data: visibleData,
        backgroundColor: colors.map((color, index) => 
          selectedSegments.has(index) ? `${color}40` : color
        ),
        borderColor: '#ffffff',
        borderWidth: spacing,
        hoverBorderWidth: spacing + 2,
        hoverOffset: 8,
        ...(animate && {
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: animationDuration,
            easing: 'easeInOutQuart'
          }
        })
      }]
    };

    const statistics = {
      total,
      average: total / visibleData.filter(v => v > 0).length || 0,
      max: { value: max, label: data.labels?.[maxIndex] },
      segments: data.labels?.map((label, index) => ({
        label,
        value: dataset.data[index],
        percentage: total > 0 ? ((dataset.data[index] / total) * 100).toFixed(1) : 0,
        color: colors[index % colors.length],
        selected: selectedSegments.has(index),
        isMax: index === maxIndex
      })) || []
    };

    const centerText = {
      primary: centerMetric === 'total' ? total.toLocaleString() : 
               centerMetric === 'average' ? statistics.average.toFixed(1) :
               centerMetric === 'max' ? max.toLocaleString() : total.toLocaleString(),
      secondary: centerMetric === 'total' ? 'Total' :
                 centerMetric === 'average' ? 'Average' :
                 centerMetric === 'max' ? 'Maximum' : 'Total'
    };

    return { processedData, statistics, centerText };
  }, [data, colors, selectedSegments, centerMetric, animate, animationDuration, spacing]);

  const options = {
    responsive,
    maintainAspectRatio,
    cutout: `${chartCutout}%`,
    plugins: {
      legend: {
        display: showLegend && !showStats,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            weight: 600
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, index) => ({
                text: label,
                fillStyle: colors[index % colors.length],
                strokeStyle: colors[index % colors.length],
                hidden: selectedSegments.has(index),
                index
              }));
            }
            return [];
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
            const dataset = context.dataset;
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            
            return [
              `Value: ${value.toLocaleString()}`,
              `Percentage: ${percentage}%`,
              `Rank: ${context.dataIndex + 1} of ${dataset.data.length}`
            ];
          }
        }
      }
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        setHoveredSegment(elements[0].index);
        event.native.target.style.cursor = 'pointer';
      } else {
        setHoveredSegment(null);
        event.native.target.style.cursor = 'default';
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        toggleSegment(index);
        if (onSegmentClick) {
          onSegmentClick(statistics.segments[index]);
        }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
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

  const donutVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 1.2
      }
    }
  };

  const StatCard = ({ label, value, color, trend, onClick }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: color || 'divider',
          cursor: onClick ? 'pointer' : 'default',
          background: `linear-gradient(135deg, ${color}10, ${color}05)`,
          '&:hover': {
            boxShadow: `0 8px 25px ${color}25`
          },
          transition: 'all 0.3s ease'
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          {trend && (
            <Box sx={{ mt: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
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
                  <DonutIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {title}
                  </Typography>
                  {hoveredSegment !== null && (
                    <Chip
                      label={statistics.segments?.[hoveredSegment]?.label}
                      size="small"
                      sx={{
                        backgroundColor: statistics.segments?.[hoveredSegment]?.color,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>
                
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Center Metric">
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={centerMetric}
                      onChange={(e) => setCenterMetric(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="total">Total</MenuItem>
                      <MenuItem value="average">Average</MenuItem>
                      <MenuItem value="max">Maximum</MenuItem>
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

            {/* Controls */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                <Typography variant="caption">Ring Size:</Typography>
                <Slider
                  value={chartCutout}
                  onChange={(e, value) => setChartCutout(value)}
                  min={30}
                  max={80}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Typography variant="caption">{chartCutout}%</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={showCenter}
                    onChange={(e) => setShowCenter(e.target.checked)}
                    size="small"
                  />
                }
                label="Center Text"
                sx={{ fontSize: '0.875rem' }}
              />

              {statistics.segments && (
                <Chip
                  label={`${statistics.segments.filter(s => !s.selected).length} active segments`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Box>
          </motion.div>
        </Box>

        {/* Chart and Stats */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Chart */}
          <Box sx={{ flex: showStats ? 2 : 1, minWidth: 300, p: 3, position: 'relative' }}>
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
                        thickness={6}
                        size={60}
                      />
                    </motion.div>
                    <Typography variant="body2" color="text.secondary">
                      Loading donut chart...
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
                  key="chart"
                  variants={donutVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ height: 350, position: 'relative' }}
                >
                  {/* Center Content */}
                  {showCenter && centerText && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        zIndex: 1,
                        pointerEvents: 'none'
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800, 
                          color: colors[0],
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {centerText.primary}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontWeight: 600, mt: 0.5 }}
                      >
                        {centerText.secondary}
                      </Typography>
                      
                      {hoveredSegment !== null && statistics.segments?.[hoveredSegment] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ marginTop: 8 }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {statistics.segments[hoveredSegment].label}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: statistics.segments[hoveredSegment].color,
                              fontWeight: 700 
                            }}
                          >
                            {statistics.segments[hoveredSegment].percentage}%
                          </Typography>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  <Doughnut ref={chartRef} data={processedData} options={options} />
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
                    <DonutIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
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

          {/* Statistics Sidebar */}
          {showStats && statistics.segments && (
            <motion.div
              variants={itemVariants}
              style={{ flex: 1, minWidth: 250, padding: 24, borderLeft: '1px solid #e5e7eb' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Segment Analysis
              </Typography>

              {/* Key Metrics */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <StatCard
                    label="Total"
                    value={statistics.total.toLocaleString()}
                    color={colors[0]}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    label="Average"
                    value={statistics.average.toFixed(1)}
                    color={colors[1]}
                  />
                </Grid>
              </Grid>

              {/* Segment List */}
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {statistics.segments.map((segment, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <Card
                      sx={{
                        mb: 1,
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: segment.selected ? 'divider' : segment.color,
                        backgroundColor: segment.selected 
                          ? 'action.hover' 
                          : hoveredSegment === index 
                            ? `${segment.color}15` 
                            : 'white',
                        opacity: segment.selected ? 0.6 : 1,
                        '&:hover': {
                          backgroundColor: `${segment.color}20`,
                          borderColor: segment.color
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => toggleSegment(index)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: segment.color
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {segment.label}
                            </Typography>
                            {segment.isMax && (
                              <Chip
                                label="MAX"
                                size="small"
                                color="warning"
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            )}
                          </Box>
                          
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: segment.color }}
                          >
                            {segment.percentage}%
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(segment.percentage)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: segment.color,
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          Value: {segment.value.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
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
                    label={`${chartCutout}% cutout`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                  
                  <Chip
                    label={centerMetric}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                  />
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

        <MenuItem onClick={() => setShowStats(!showStats)}>
          <ListItemIcon>
            <AnalyticsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {showStats ? 'Hide' : 'Show'} Statistics
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setShowCenter(!showCenter)}>
          <ListItemIcon>
            <CenterIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {showCenter ? 'Hide' : 'Show'} Center Text
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setSelectedSegments(new Set())}>
          <ListItemIcon>
            <RingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Show All Segments</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default DonutChart;
