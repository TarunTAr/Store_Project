import React, { useState, useMemo } from 'react';
import {
  Grid,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Fab,
  Slide,
  useScrollTrigger
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  KeyboardArrowUp as ScrollUpIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import StoreCard from './StoreCard';
import StoreList from './StoreList';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';

const StoreGrid = ({
  stores = [],
  loading = false,
  onStoreSelect,
  onRate,
  showViewToggle = true,
  showSorting = true,
  showPagination = true,
  initialView = 'grid', // grid, list
  itemsPerPage = 12,
  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'reviewCount', label: 'Reviews' },
    { value: 'distance', label: 'Distance' },
    { value: 'newest', label: 'Newest' }
  ]
}) => {
  const [viewMode, setViewMode] = useState(initialView);
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Scroll to top functionality
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Sort stores
  const sortedStores = useMemo(() => {
    if (!stores.length) return [];

    return [...stores].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle special sorting cases
      if (sortBy === 'name') {
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
      } else if (sortBy === 'rating') {
        aValue = a.rating || 0;
        bValue = b.rating || 0;
      } else if (sortBy === 'reviewCount') {
        aValue = a.reviewCount || 0;
        bValue = b.reviewCount || 0;
      } else if (sortBy === 'distance') {
        aValue = a.distance || Infinity;
        bValue = b.distance || Infinity;
      } else if (sortBy === 'newest') {
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [stores, sortBy, sortOrder]);

  // Paginate stores
  const paginatedStores = useMemo(() => {
    if (!showPagination) return sortedStores;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedStores.slice(startIndex, endIndex);
  }, [sortedStores, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(sortedStores.length / itemsPerPage);

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    if (value.includes('_desc')) {
      setSortBy(value.replace('_desc', ''));
      setSortOrder('desc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  const controlsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LoadingSpinner 
          message="Loading stores..." 
          size="large"
          variant="pulse"
        />
      </Box>
    );
  }

  if (stores.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 4,
            border: '2px dashed',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, -2, 2, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}
            >
              <GridViewIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
          </motion.div>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            No Stores Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We couldn't find any stores matching your criteria.
            Try adjusting your search filters or browse all available stores.
          </Typography>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Box>
      {/* Controls */}
      <motion.div
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            {/* Results Count */}
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Showing {paginatedStores.length} of {stores.length} stores
            </Typography>

            {/* Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {/* Sorting */}
              {showSorting && (
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={`${sortBy}${sortOrder === 'desc' ? '_desc' : ''}`}
                    onChange={handleSortChange}
                    label="Sort by"
                    sx={{ borderRadius: 2 }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label} (A-Z)
                      </MenuItem>
                    ))}
                    {sortOptions.map((option) => (
                      <MenuItem key={`${option.value}_desc`} value={`${option.value}_desc`}>
                        {option.label} (Z-A)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* View Toggle */}
              {showViewToggle && (
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      borderRadius: '8px !important',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      }
                    }
                  }}
                >
                  <ToggleButton value="grid">
                    <GridViewIcon />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ListViewIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Store Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Grid container spacing={3}>
              {paginatedStores.map((store, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={store.id}>
                  <motion.div
                    variants={itemVariants}
                    custom={index}
                  >
                    <StoreCard
                      store={store}
                      onView={onStoreSelect}
                      onRate={onRate}
                      variant="standard"
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StoreList
              stores={paginatedStores}
              onStoreSelect={onStoreSelect}
              onRate={onRate}
              showPagination={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => {
                setCurrentPage(page);
                scrollToTop();
              }}
              totalItems={stores.length}
              rowsPerPage={itemsPerPage}
              showRowsPerPage={false}
              showInfo={true}
              color="primary"
              size="large"
              showFirstLastButtons={true}
            />
          </Box>
        </motion.div>
      )}

      {/* Scroll to Top Fab */}
      <Slide direction="up" in={trigger} mountOnEnter unmountOnExit>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000
          }}
        >
          <ScrollUpIcon />
        </Fab>
      </Slide>
    </Box>
  );
};

export default StoreGrid;
