import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Slider,
  DatePicker,
  Autocomplete,
  Divider,
  Badge,
  Tooltip,
  Collapse,
  Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as VerifiedIcon,
  Block as InactiveIcon,
  Schedule as DateIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Tune as TuneIcon,
  SaveAlt as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUserFilters, clearUserFilters, saveFilterPreset } from '../../store/userSlice';

const UserFilters = ({
  filters = {},
  onFiltersChange,
  onClearFilters,
  showAdvanced = true,
  collapsible = true,
  showPresets = true,
  totalUsers = 0,
  filteredUsers = 0
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    role: false,
    status: false,
    dates: false,
    location: false,
    advanced: false
  });
  const [showFiltersPanel, setShowFiltersPanel] = useState(!collapsible);
  const [presetName, setPresetName] = useState('');
  const [showPresetDialog, setShowPresetDialog] = useState(false);

  const dispatch = useDispatch();
  const { filterPresets, loading } = useSelector((state) => state.users);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Debounce filter changes
    if (onFiltersChange) {
      clearTimeout(window.userFilterTimeout);
      window.userFilterTimeout = setTimeout(() => {
        onFiltersChange(newFilters);
      }, 300);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    
    if (onClearFilters) {
      onClearFilters();
    } else if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (localFilters.search) count++;
    if (localFilters.role && localFilters.role !== 'all') count++;
    if (localFilters.status && localFilters.status !== 'all') count++;
    if (localFilters.verified && localFilters.verified !== 'all') count++;
    if (localFilters.location) count++;
    if (localFilters.dateRange?.start || localFilters.dateRange?.end) count++;
    if (localFilters.minRating && localFilters.minRating > 0) count++;

    return count;
  };

  const handleApplyPreset = (preset) => {
    setLocalFilters(preset.filters);
    if (onFiltersChange) {
      onFiltersChange(preset.filters);
    }
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      dispatch(saveFilterPreset({
        name: presetName,
        filters: localFilters
      }));
      setPresetName('');
      setShowPresetDialog(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
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
            p: 2,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                User Filters
              </Typography>
              
              <AnimatePresence>
                {getActiveFilterCount() > 0 && (
                  <motion.div
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Badge
                      badgeContent={getActiveFilterCount()}
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {filteredUsers} of {totalUsers} users
              </Typography>

              {collapsible && (
                <Tooltip title={showFiltersPanel ? 'Collapse filters' : 'Expand filters'}>
                  <IconButton
                    size="small"
                    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  >
                    <TuneIcon />
                  </IconButton>
                </Tooltip>
              )}

              {getActiveFilterCount() > 0 && (
                <Tooltip title="Clear all filters">
                  <IconButton
                    size="small"
                    onClick={handleClearFilters}
                    color="error"
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>

        <Collapse in={showFiltersPanel}>
          <Box sx={{ p: 3 }}>
            {/* Quick Search */}
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                placeholder="Search users by name, email, or address..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  endAdornment: localFilters.search && (
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange('search', '')}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                  sx: { borderRadius: 2 }
                }}
                sx={{ mb: 3 }}
              />
            </motion.div>

            {/* Filter Presets */}
            {showPresets && filterPresets.length > 0 && (
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Quick Filters
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {filterPresets.map((preset) => (
                      <Chip
                        key={preset.id}
                        label={preset.name}
                        clickable
                        variant="outlined"
                        onClick={() => handleApplyPreset(preset)}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Basic Filters */}
            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expandedSections.basic}
                onChange={() => handleSectionToggle('basic')}
                sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Basic Filters
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                    <FormControl size="small">
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={localFilters.role || 'all'}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        label="Role"
                      >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="admin">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AdminIcon sx={{ fontSize: 16, color: 'error.main' }} />
                            Administrator
                          </Box>
                        </MenuItem>
                        <MenuItem value="store_owner">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StoreIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                            Store Owner
                          </Box>
                        </MenuItem>
                        <MenuItem value="user">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            Normal User
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={localFilters.status || 'all'}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        label="Status"
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small">
                      <InputLabel>Verification</InputLabel>
                      <Select
                        value={localFilters.verified || 'all'}
                        onChange={(e) => handleFilterChange('verified', e.target.value)}
                        label="Verification"
                      >
                        <MenuItem value="all">All Users</MenuItem>
                        <MenuItem value="verified">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            Verified
                          </Box>
                        </MenuItem>
                        <MenuItem value="unverified">Unverified</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            {/* Location Filters */}
            {showAdvanced && (
              <motion.div variants={itemVariants}>
                <Accordion
                  expanded={expandedSections.location}
                  onChange={() => handleSectionToggle('location')}
                  sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="primary" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Location Filters
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      size="small"
                      label="City or State"
                      value={localFilters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="Filter by city or state"
                      sx={{ borderRadius: 2 }}
                    />
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            )}

            {/* Date Filters */}
            {showAdvanced && (
              <motion.div variants={itemVariants}>
                <Accordion
                  expanded={expandedSections.dates}
                  onChange={() => handleSectionToggle('dates')}
                  sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateIcon color="primary" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Date Range
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <MuiDatePicker
                          label="From Date"
                          value={localFilters.dateRange?.start || null}
                          onChange={(date) => handleFilterChange('dateRange', {
                            ...localFilters.dateRange,
                            start: date
                          })}
                          slotProps={{
                            textField: { size: 'small' }
                          }}
                        />
                        <MuiDatePicker
                          label="To Date"
                          value={localFilters.dateRange?.end || null}
                          onChange={(date) => handleFilterChange('dateRange', {
                            ...localFilters.dateRange,
                            end: date
                          })}
                          slotProps={{
                            textField: { size: 'small' }
                          }}
                        />
                      </Box>
                    </LocalizationProvider>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            )}

            {/* Store Owner Filters */}
            {showAdvanced && (
              <motion.div variants={itemVariants}>
                <Accordion
                  expanded={expandedSections.advanced}
                  onChange={() => handleSectionToggle('advanced')}
                  sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StoreIcon color="primary" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Store Owner Filters
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Minimum Store Rating: {localFilters.minRating || 0}
                      </Typography>
                      <Slider
                        value={localFilters.minRating || 0}
                        onChange={(e, value) => handleFilterChange('minRating', value)}
                        min={0}
                        max={5}
                        step={0.1}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 1, label: '1' },
                          { value: 2, label: '2' },
                          { value: 3, label: '3' },
                          { value: 4, label: '4' },
                          { value: 5, label: '5' }
                        ]}
                        valueLabelDisplay="auto"
                        sx={{
                          '& .MuiSlider-thumb': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }
                        }}
                      />
                    </Box>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={localFilters.hasStore || false}
                          onChange={(e) => handleFilterChange('hasStore', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Has Active Store"
                    />
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            )}
          </Box>
        </Collapse>

        {/* Active Filters Summary */}
        {getActiveFilterCount() > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Active Filters ({getActiveFilterCount()})
              </Typography>
              
              {showPresets && (
                <Button
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={() => setShowPresetDialog(true)}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Save Preset
                </Button>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <AnimatePresence>
                {/* Search filter */}
                {localFilters.search && (
                  <motion.div
                    key="search-filter"
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Chip
                      label={`Search: "${localFilters.search}"`}
                      onDelete={() => handleFilterChange('search', '')}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </motion.div>
                )}

                {/* Role filter */}
                {localFilters.role && localFilters.role !== 'all' && (
                  <motion.div
                    key="role-filter"
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Chip
                      label={`Role: ${localFilters.role}`}
                      onDelete={() => handleFilterChange('role', 'all')}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </motion.div>
                )}

                {/* Status filter */}
                {localFilters.status && localFilters.status !== 'all' && (
                  <motion.div
                    key="status-filter"
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Chip
                      label={`Status: ${localFilters.status}`}
                      onDelete={() => handleFilterChange('status', 'all')}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </motion.div>
                )}

                {/* Other active filters */}
                {Object.entries(localFilters).map(([key, value]) => {
                  if (key === 'search' || key === 'role' || key === 'status' || !value) return null;
                  
                  const labels = {
                    verified: value === 'verified' ? 'Verified Users' : 'Unverified Users',
                    location: `Location: ${value}`,
                    minRating: `Min Rating: ${value}`,
                    hasStore: 'Has Store'
                  };

                  const label = labels[key];
                  if (!label) return null;

                  return (
                    <motion.div
                      key={key}
                      variants={chipVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <Chip
                        label={label}
                        onDelete={() => handleFilterChange(key, key === 'verified' ? 'all' : key === 'minRating' ? 0 : null)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Box>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default UserFilters;
