import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Slider,
  TextField,
  Button,
  Chip,
  Rating,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  Badge
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Category as CategoryIcon,
  Schedule as TimeIcon,
  Verified as VerifiedIcon,
  LocalOffer as OfferIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../store/storeSlice';

const StoreFilters = ({
  filters = {},
  onFiltersChange,
  onClearFilters,
  showAdvanced = true,
  collapsible = true,
  orientation = 'vertical', // vertical, horizontal
  compact = false
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    rating: true,
    location: false,
    price: false,
    features: false,
    availability: false
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [distanceRange, setDistanceRange] = useState(10);

  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.stores);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setLocalFilters(filters);
    if (filters.priceRange) {
      setPriceRange(filters.priceRange);
    }
    if (filters.distance) {
      setDistanceRange(filters.distance);
    }
  }, [filters]);

  const handleFilterChange = (filterType, value, option = null) => {
    const newFilters = { ...localFilters };

    switch (filterType) {
      case 'categories':
        if (!newFilters.categories) newFilters.categories = [];
        if (newFilters.categories.includes(value)) {
          newFilters.categories = newFilters.categories.filter(cat => cat !== value);
        } else {
          newFilters.categories.push(value);
        }
        break;

      case 'rating':
        newFilters.minRating = value;
        break;

      case 'priceRange':
        newFilters.priceRange = value;
        setPriceRange(value);
        break;

      case 'distance':
        newFilters.distance = value;
        setDistanceRange(value);
        break;

      case 'features':
        if (!newFilters.features) newFilters.features = [];
        if (newFilters.features.includes(value)) {
          newFilters.features = newFilters.features.filter(f => f !== value);
        } else {
          newFilters.features.push(value);
        }
        break;

      case 'sortBy':
        newFilters.sortBy = value;
        break;

      case 'sortOrder':
        newFilters.sortOrder = value;
        break;

      default:
        newFilters[filterType] = value;
    }

    setLocalFilters(newFilters);
    
    // Debounce the filter changes
    if (onFiltersChange) {
      clearTimeout(window.filterTimeout);
      window.filterTimeout = setTimeout(() => {
        onFiltersChange(newFilters);
      }, 300);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    setPriceRange([0, 100]);
    setDistanceRange(10);
    
    if (onClearFilters) {
      onClearFilters();
    } else if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (localFilters.categories?.length) count += localFilters.categories.length;
    if (localFilters.minRating && localFilters.minRating > 0) count++;
    if (localFilters.priceRange) count++;
    if (localFilters.distance && localFilters.distance !== 10) count++;
    if (localFilters.features?.length) count += localFilters.features.length;
    if (localFilters.openNow) count++;
    if (localFilters.verified) count++;
    if (localFilters.hasOffers) count++;

    return count;
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, x: orientation === 'horizontal' ? 0 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const sectionVariants = {
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
          backgroundColor: expandedSections[section] ? 'primary.light' : 'grey.50',
          borderRadius: '8px 8px 0 0',
          minHeight: 48,
          '&.Mui-expanded': {
            borderRadius: expandedSections[section] ? '8px 8px 0 0' : '8px'
          },
          color: expandedSections[section] ? 'primary.contrastText' : 'text.primary'
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
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      </AccordionDetails>
    </Accordion>
  );

  const QuickFilters = () => (
    <motion.div variants={sectionVariants}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {[
          { key: 'openNow', label: 'Open Now', icon: <TimeIcon /> },
          { key: 'verified', label: 'Verified', icon: <VerifiedIcon /> },
          { key: 'hasOffers', label: 'Has Offers', icon: <OfferIcon /> },
          { key: 'highRated', label: '4+ Stars', icon: <StarIcon /> }
        ].map((filter) => (
          <motion.div
            key={filter.key}
            variants={chipVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Chip
              icon={filter.icon}
              label={filter.label}
              clickable
              color={localFilters[filter.key] ? 'primary' : 'default'}
              variant={localFilters[filter.key] ? 'filled' : 'outlined'}
              onClick={() => handleFilterChange(filter.key, !localFilters[filter.key])}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                },
                transition: 'all 0.2s ease'
              }}
            />
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );

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
          backdropFilter: 'blur(10px)',
          ...(orientation === 'horizontal' && {
            width: '100%'
          })
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
                Filters
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
        </Box>

        <Collapse in={!isCollapsed}>
          <Box sx={{ p: 2 }}>
            {/* Quick Filters */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                Quick Filters
              </Typography>
              <QuickFilters />
            </Box>

            {/* Sort Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                Sort By
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={`${localFilters.sortBy || 'rating'}_${localFilters.sortOrder || 'desc'}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('_');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="rating_desc">Rating (High to Low)</MenuItem>
                  <MenuItem value="rating_asc">Rating (Low to High)</MenuItem>
                  <MenuItem value="name_asc">Name (A to Z)</MenuItem>
                  <MenuItem value="name_desc">Name (Z to A)</MenuItem>
                  <MenuItem value="distance_asc">Distance (Near to Far)</MenuItem>
                  <MenuItem value="reviews_desc">Most Reviews</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Categories */}
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.05 }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={localFilters.categories?.includes(category.id) || false}
                            onChange={() => handleFilterChange('categories', category.id)}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {category.name}
                            </Typography>
                            <Chip
                              label={category.storeCount || 0}
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
                  value={localFilters.minRating || 0}
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
                      variant={localFilters.minRating === rating ? 'contained' : 'outlined'}
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

            {/* Price Range */}
            {showAdvanced && (
              <FilterSection
                title="Price Range"
                icon={<PriceIcon color="primary" />}
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
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 25, label: '$25' },
                    { value: 50, label: '$50' },
                    { value: 75, label: '$75' },
                    { value: 100, label: '$100+' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }
                  }}
                />
              </FilterSection>
            )}

            {/* Distance */}
            <FilterSection
              title="Distance"
              icon={<LocationIcon color="primary" />}
              section="location"
            >
              <Typography variant="body2" gutterBottom>
                Within {distanceRange} km
              </Typography>
              <Slider
                value={distanceRange}
                onChange={(e, newValue) => {
                  setDistanceRange(newValue);
                  handleFilterChange('distance', newValue);
                }}
                min={1}
                max={50}
                step={1}
                marks={[
                  { value: 1, label: '1km' },
                  { value: 10, label: '10km' },
                  { value: 25, label: '25km' },
                  { value: 50, label: '50km' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}km`}
                sx={{
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }
                }}
              />

              <TextField
                label="Location"
                size="small"
                fullWidth
                placeholder="Enter city or address"
                value={localFilters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Get user's current location
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((position) => {
                            const { latitude, longitude } = position.coords;
                            handleFilterChange('coordinates', { lat: latitude, lng: longitude });
                          });
                        }
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  )
                }}
              />
            </FilterSection>

            {/* Features */}
            {showAdvanced && (
              <FilterSection
                title="Features"
                icon={<TuneIcon color="primary" />}
                section="features"
              >
                <FormGroup>
                  {[
                    'WiFi',
                    'Parking',
                    'Delivery',
                    'Takeout',
                    'Credit Cards',
                    'Outdoor Seating',
                    'Wheelchair Accessible',
                    'Pet Friendly'
                  ].map((feature) => (
                    <FormControlLabel
                      key={feature}
                      control={
                        <Checkbox
                          checked={localFilters.features?.includes(feature) || false}
                          onChange={() => handleFilterChange('features', feature)}
                          color="primary"
                        />
                      }
                      label={feature}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderRadius: 1
                        }
                      }}
                    />
                  ))}
                </FormGroup>
              </FilterSection>
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
                {/* Category chips */}
                {localFilters.categories?.map((categoryId) => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <motion.div
                      key={`category-${categoryId}`}
                      variants={chipVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <Chip
                        label={category.name}
                        onDelete={() => handleFilterChange('categories', categoryId)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </motion.div>
                  ) : null;
                })}

                {/* Rating chip */}
                {localFilters.minRating > 0 && (
                  <motion.div
                    key="rating-filter"
                    variants={chipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Chip
                      label={`${localFilters.minRating}+ stars`}
                      onDelete={() => handleFilterChange('rating', 0)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<StarIcon />}
                      sx={{ borderRadius: 2 }}
                    />
                  </motion.div>
                )}

                {/* Other active filters */}
                {Object.entries(localFilters).map(([key, value]) => {
                  if (key === 'categories' || key === 'minRating' || !value) return null;
                  
                  const labels = {
                    openNow: 'Open Now',
                    verified: 'Verified',
                    hasOffers: 'Has Offers',
                    distance: `Within ${value}km`,
                    location: value
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
                        onDelete={() => handleFilterChange(key, key === 'distance' ? 10 : null)}
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

export default StoreFilters;
