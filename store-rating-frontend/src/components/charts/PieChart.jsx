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
  List,
  ListItem,
  ListItemText as MuiListItemText,
  Avatar,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  GetApp as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  PieChart as PieChartIcon,
  DonutLarge as DonutIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  List as ListIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const PieChart = ({
  data,
  title = 'Pie Chart',
  subtitle,
  height = 400,
  loading = false,
  error = null,
  showLegend = true,
  showLabels = true,
  showValues = true,
  showPercentages = true,
  doughnut = false,
  animate = true,
  responsive = true,
  maintainAspectRatio = false,
  cutout = 50,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
  onRefresh,
  onExport,
  className = ''
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chartType, setChartType] = useState(doughnut ? 'doughnut' : 'pie');
  const [hiddenSegments, setHiddenSegments] = useState(new Set());
  const [showDataList, setShowDataList] = useState(false);
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
      link.download = `pie-chart-${Date.now()}.${format}`;
      
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
    const newHidden = new Set(hiddenSegments);
    if (newHidden.has(index)) {
      newHidden.delete(index);
    } else {
      newHidden.add(index);
    }
    setHiddenSegments(newHidden);
  };

  // Calculate totals and percentages
  const { processedData, statistics } = useMemo(() => {
    if (!data?.datasets?.[0]?.data) return { processedData: null, statistics: {} };

    const dataset = data.datasets[0];
    const total = dataset.data.reduce((sum, value, index) => 
      hiddenSegments.has(index) ? sum : sum + value, 0
    );

    const visibleData = dataset.data.map((value, index) => 
      hiddenSegments.has(index) ? 0 : value
    );

    const processedData = {
      labels: data.labels,
      datasets: [{
        ...dataset,
        data: visibleData,
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 4,
        hoverOffset: 8,
        ...(animate && {
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 2000,
            easing: 'easeInOutQuart'
          }
        })
      }]
    };

    const statistics = {
      total,
      segments: data.labels?.map((label, index) => ({
        label,
        value: dataset.data[index],
        percentage: total > 0 ? ((dataset.data[index] / total) * 100).toFixed(1) : 0,
        color: colors[index % colors.length],
        hidden: hiddenSegments.has(index)
      })) || []
    };

    return { processedData, statistics };
  }, [data, colors, hiddenSegments, animate]);

  const options = {
    responsive,
    maintainAspectRatio,
    cutout: chartType === 'doughnut' ? `${cutout}%` : 0,
    plugins: {
      legend: {
        display: showLegend && !showDataList,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 600
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, index) => ({
                text: label,
                fillStyle: colors[index % colors.length],
                strokeStyle: colors[index % colors.length],
                hidden: hiddenSegments.has(index),
                index
              }));
            }
            return [];
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
            const dataset = context.dataset;
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            
            const parts = [];
            if (showValues) parts.push(`Value: ${value.toLocaleString()}`);
            if (showPercentages) parts.push(`${percentage}%`);
            
            return parts.join(' • ');
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        toggleSegment(index);
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
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

  const pieVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
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
                  {chartType === 'doughnut' ? <DonutIcon color="primary" /> : <PieChartIcon color="primary" />}
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
                      <MenuItem value="pie">Pie</MenuItem>
                      <MenuItem value="doughnut">Doughnut</MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>

                <Tooltip title="Toggle Data List">
                  <IconButton 
                    size="small" 
                    color={showDataList ? 'primary' : 'default'}
                    onClick={() => setShowDataList(!showDataList)}
                  >
                    <ListIcon />
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
                    checked={showPercentages}
                    onChange={(e) => setShowPercentages(e.target.checked)}
                    size="small"
                  />
                }
                label="Show %"
                sx={{ fontSize: '0.875rem' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showValues}
                    onChange={(e) => setShowValues(e.target.checked)}
                    size="small"
                  />
                }
                label="Show Values"
                sx={{ fontSize: '0.875rem' }}
              />

              {statistics.segments && (
                <Chip
                  label={`${statistics.segments.filter(s => !s.hidden).length} of ${statistics.segments.length} segments`}
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
        <Box sx={{ display: 'flex', height: showDataList ? 'auto' : height }}>
          {/* Chart */}
          <Box sx={{ flex: showDataList ? 2 : 1, p: 3, position: 'relative' }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    height: showDataList ? 350 : height - 48,
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
                        scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
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
                  style={{ height: showDataList ? 350 : height - 48 }}
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
                  key={chartType}
                  variants={pieVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ height: showDataList ? 350 : height - 48 }}
                >
                  {/* Center Label for Doughnut */}
                  {chartType === 'doughnut' && statistics.total && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        zIndex: 1,
                        pointerEvents: 'none'
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: colors[0] }}>
                        {statistics.total.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total
                      </Typography>
                    </Box>
                  )}

                  {chartType === 'doughnut' ? (
                    <Doughnut ref={chartRef} data={processedData} options={options} />
                  ) : (
                    <Pie ref={chartRef} data={processedData} options={options} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="no-data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    height: showDataList ? 350 : height - 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <PieChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
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

          {/* Data List Sidebar */}
          <AnimatePresence>
            {showDataList && statistics.segments && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '300px' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                style={{ borderLeft: '1px solid #e5e7eb' }}
              >
                <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Data Breakdown
                  </Typography>
                  
                  <List dense>
                    {statistics.segments.map((segment, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        custom={index}
                      >
                        <ListItem
                          button
                          onClick={() => toggleSegment(index)}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            border: '1px solid',
                            borderColor: segment.hidden ? 'divider' : segment.color,
                            backgroundColor: segment.hidden ? 'action.hover' : `${segment.color}10`,
                            '&:hover': {
                              backgroundColor: `${segment.color}20`
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: segment.color,
                              mr: 1.5,
                              opacity: segment.hidden ? 0.5 : 1
                            }}
                          >
                            {segment.hidden ? <VisibilityOffIcon sx={{ fontSize: 14 }} /> : ''}
                          </Avatar>
                          
                          <MuiListItemText
                            primary={
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 600,
                                  opacity: segment.hidden ? 0.5 : 1
                                }}
                              >
                                {segment.label}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="caption" sx={{ opacity: segment.hidden ? 0.5 : 1 }}>
                                  {segment.value.toLocaleString()}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontWeight: 600,
                                    color: segment.color,
                                    opacity: segment.hidden ? 0.5 : 1
                                  }}
                                >
                                  {segment.percentage}%
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>

                  <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Summary
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {statistics.total.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total across all segments
                    </Typography>
                  </Box>
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
                backgroundColor: 'grey.50'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date().toLocaleString()}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={chartType}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                  />
                  
                  <Chip
                    label={`${statistics.segments?.filter(s => !s.hidden).length || 0} segments`}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.7rem' }}
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

        <MenuItem onClick={() => setChartType(chartType === 'pie' ? 'doughnut' : 'pie')}>
          <ListItemIcon>
            {chartType === 'pie' ? <DonutIcon fontSize="small" /> : <PieChartIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            Switch to {chartType === 'pie' ? 'Doughnut' : 'Pie'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setShowDataList(!showDataList)}>
          <ListItemIcon>
            <ListIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {showDataList ? 'Hide' : 'Show'} Data List
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setHiddenSegments(new Set())}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Show All Segments</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default PieChart;
