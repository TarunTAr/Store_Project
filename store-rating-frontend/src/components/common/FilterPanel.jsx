import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Chip,
  Button,
  IconButton,
  Divider,
  Rating,
  Switch,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FilterPanel = ({
  filters = {},
  onFiltersChange,
  categories = [],
  showAdvanced = false,
  collapsible = true,
  orientation = 'vertical' // vertical or horizontal
}) => {
  const [activeFilters, setActiveFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    rating: true,
    location: false,
    price: false,
    date: false
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    setActiveFilters(filters);
  }, [filters]);

  const handleFilterChange = (filterType, value, option = null) => {
    const newFilters = { ...activeFilters };

    switch (filterType) {
      case 'category':
        if (!newFilters.categories) newFilters.categories = [];
        if (newFilters.categories.includes(value)) {
          newFilters.categories = newFilters.categories.filter(cat => cat !== value);
        } else {
          newFilters.categories.push(value);
        }
        break;

      case 'rating':
        newFilters.minRating = value;
        setRatingFilter(value);
        break;

      case 'priceRange':
        newFilters.priceRange = value;
        setPriceRange(value);
        break;

      case 'location':
        newFilters.location = value;
        break;

      case 'dateRange':
        if (!newFilters.dateRange) newFilters.dateRange = {};
        newFilters.dateRange[option] = value;
        break;

      case 'verified':
        newFilters.verified = value;
        break;

      case 'openNow':
        newFilters.openNow = value;
        break;

      default:
        newFilters[filterType] = value;
    }

    setActiveFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {};
    setActiveFilters(clearedFilters);
    setPriceRange([0, 1000]);
    setRatingFilter(0);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (activeFilters.categories?.length) count += activeFilters.categories.length;
    if (activeFilters.minRating) count++;
    if (activeFilters.priceRange) count++;
    if (activeFilters.location) count++;
    if (activeFilters.verified) count++;
    if (activeFilters.openNow) count++;
    if (activeFilters.dateRange?.start || activeFilters.dateRange?.end) count++;

    return count;
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filterSectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
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

  const FilterSection = ({ title, icon, children, section, defaultExpanded = true }) => (
    <Accordion
      expanded={expandedSections[section]}
      onChange={() => handleSectionToggle(section)}
      sx={{
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px !important',
        mb: 1,
        '&:before': { display: 'none' }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon />}
        sx={{
          backgroundColor: 'grey.50',
          borderRadius: '8px 8px 0 0',
          minHeight: 48,
          '&.Mui-expanded': {
            borderRadius: expandedSections[section] ? '8px 8px 0 0' : '8px'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 2 }}>
        <motion.div
          variants={filterSectionVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      </AccordionDetails>
    </Accordion>
  );

  const filterContent = (
    <Box sx={{ 
      width: orientation === 'horizontal' ? '100%' : 320,
      maxHeight: orientation === 'vertical' ? '70vh' : 'auto',
      overflow: 'auto'
    }}>
      {/* Filter Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {getActiveFilterCount() > 0 && (
            <motion.div
              variants={chipVariants}
              initial="hidden"
              animate="visible"
            >
              <Chip
                label={getActiveFilterCount()}
                size="small"
                color="primary"
                sx={{ fontSize: '0.7rem' }}
              />
            </motion.div>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {collapsible && (
            <Tooltip title={isCollapsed ? 'Expand filters' : 'Collapse filters'}>
              <IconButton
                size="small"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <TuneIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {getActiveFilterCount() > 0 && (
            <Tooltip title="Clear all filters">
              <IconButton
                size="small"
                onClick={clearAllFilters}
                color="error"
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Collapse in={!isCollapsed}>
        <Box sx={{ p: 2 }}>
          {/* Category Filter */}
          <FilterSection 
            title="Categories" 
            icon={<CategoryIcon color="primary" />}
            section="category"
          >
            <FormGroup>
              <AnimatePresence>
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.05 }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={activeFilters.categories?.includes(category.id) || false}
                          onChange={(e) => handleFilterChange('category', category.id)}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {category.name}
                          </Typography>
                          <Chip
                            label={category.count || 0}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.6rem', height: 16 }}
                          />
                        </Box>
                      }
                      sx={{ 
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderRadius: 1
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </FormGroup>
          </FilterSection>

          {/* Rating Filter */}
          <FilterSection 
            title="Minimum Rating" 
            icon={<StarIcon color="primary" />}
            section="rating"
          >
            <Box sx={{ px: 1 }}>
              <Rating
                value={ratingFilter}
                onChange={(event, newValue) => {
                  handleFilterChange('rating', newValue || 0);
                }}
                precision={1}
                size="large"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    size="small"
                    variant={ratingFilter === rating ? 'contained' : 'outlined'}
                    onClick={() => handleFilterChange('rating', rating)}
                    sx={{ 
                      minWidth: 40,
                      borderRadius: 2,
                      fontSize: '0.75rem'
                    }}
                  >
                    {rating}+
                  </Button>
                ))}
              </Box>
            </Box>
          </FilterSection>

          {/* Location Filter */}
          <FilterSection 
            title="Location" 
            icon={<LocationIcon color="primary" />}
            section="location"
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Enter city or area"
              value={activeFilters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={() => {
                      // Get user's current location
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const { latitude, longitude } = position.coords;
                            handleFilterChange('location', `${latitude},${longitude}`);
                          }
                        );
                      }
                    }}
                  >
                    <LocationIcon />
                  </IconButton>
                )
              }}
              sx={{ mb: 2 }}
            />

            {/* Distance Slider */}
            <Typography variant="body2" gutterBottom>
              Distance: {activeFilters.distance || 10} km
            </Typography>
            <Slider
              value={activeFilters.distance || 10}
              onChange={(e, value) => handleFilterChange('distance', value)}
              min={1}
              max={50}
              step={1}
              marks={[
                { value: 1, label: '1km' },
                { value: 25, label: '25km' },
                { value: 50, label: '50km' }
              ]}
              valueLabelDisplay="auto"
            />
          </FilterSection>

          {/* Advanced Filters */}
          {showAdvanced && (
            <>
              {/* Price Range */}
              <FilterSection 
                title="Price Range" 
                icon={<Typography>💰</Typography>}
                section="price"
              >
                <Typography variant="body2" gutterBottom>
                  ${priceRange[0]} - ${priceRange[1]}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => {
                    setPriceRange(newValue);
                    handleFilterChange('priceRange', newValue);
                  }}
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                />
              </FilterSection>

              {/* Quick Filters */}
              <FilterSection 
                title="Quick Filters" 
                icon={<TuneIcon color="primary" />}
                section="quick"
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={activeFilters.verified || false}
                        onChange={(e) => handleFilterChange('verified', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Verified stores only"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={activeFilters.openNow || false}
                        onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Open now"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={activeFilters.hasPhotos || false}
                        onChange={(e) => handleFilterChange('hasPhotos', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Has photos"
                  />
                </Box>
              </FilterSection>
            </>
          )}
        </Box>
      </Collapse>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Active Filters ({getActiveFilterCount()})
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <AnimatePresence>
              {activeFilters.categories?.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <motion.div
                    key={`filter-${categoryId}`}
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Chip
                      label={category.name}
                      onDelete={() => handleFilterChange('category', categoryId)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </motion.div>
                ) : null;
              })}

              {ratingFilter > 0 && (
                <motion.div
                  key="rating-filter"
                  variants={chipVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <Chip
                    label={`${ratingFilter}+ stars`}
                    onDelete={() => handleFilterChange('rating', 0)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    icon={<StarIcon />}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      )}
    </Box>
  );

  if (orientation === 'horizontal') {
    return (
      <Paper 
        elevation={2}
        sx={{ 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {filterContent}
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        elevation={2}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 20
        }}
      >
        {filterContent}
      </Paper>
    </motion.div>
  );
};

export default FilterPanel;
