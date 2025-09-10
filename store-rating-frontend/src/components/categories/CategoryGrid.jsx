import React, { useState, useMemo } from 'react';
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Fade,
  Slide,
  useScrollTrigger,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as CompactViewIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Category as CategoryIcon,
  KeyboardArrowUp as ScrollUpIcon,
  Refresh as RefreshIcon,
  Upload as ImportIcon,
  Download as ExportIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories, 
  createCategory, 
  searchCategories,
  exportCategories,
  importCategories
} from '../../store/categorySlice';
import CategoryCard from './CategoryCard';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoryGrid = ({
  categories = [],
  loading = false,
  onCategorySelect,
  onCategoryEdit,
  onCategoryCreate,
  showControls = true,
  showSearch = true,
  showFilters = true,
  defaultView = 'grid',
  itemsPerPage = 12,
  showPagination = true
}) => {
  const [viewMode, setViewMode] = useState(defaultView);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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

  // Filter and sort categories
  const processedCategories = useMemo(() => {
    let filtered = [...categories];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(category =>
        category.name?.toLowerCase().includes(searchLower) ||
        category.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'active':
        filtered = filtered.filter(cat => cat.isActive !== false);
        break;
      case 'inactive':
        filtered = filtered.filter(cat => cat.isActive === false);
        break;
      case 'parent':
        filtered = filtered.filter(cat => !cat.parentId);
        break;
      case 'subcategory':
        filtered = filtered.filter(cat => cat.parentId);
        break;
      case 'popular':
        filtered = filtered.filter(cat => (cat.storeCount || 0) > 5);
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle special sorting cases
      if (sortBy === 'name') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      } else if (sortBy === 'storeCount') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortBy === 'createdAt') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [categories, searchTerm, filterBy, sortBy, sortOrder]);

  // Paginate categories
  const paginatedCategories = useMemo(() => {
    if (!showPagination) return processedCategories;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedCategories.slice(startIndex, endIndex);
  }, [processedCategories, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(processedCategories.length / itemsPerPage);

  const handleCategoryCreate = () => {
    if (onCategoryCreate) {
      onCategoryCreate();
    } else {
      setCreateDialogOpen(true);
    }
  };

  const handleRefresh = async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
    } catch (error) {
      console.error('Failed to refresh categories:', error);
    }
  };

  const handleExport = async () => {
    try {
      await dispatch(exportCategories({
        format: 'csv',
        includeSubcategories: true
      })).unwrap();
    } catch (error) {
      console.error('Failed to export categories:', error);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await dispatch(importCategories(file)).unwrap();
      } catch (error) {
        console.error('Failed to import categories:', error);
      }
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
          message="Loading categories..." 
          size="large"
        />
      </Box>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Controls */}
        {showControls && (
          <motion.div variants={controlsVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
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
                {/* Left side - Search and Filters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  {showSearch && (
                    <TextField
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      sx={{ minWidth: 250 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm('')}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }}
                    />
                  )}

                  {showFilters && (
                    <>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select
                          value={filterBy}
                          onChange={(e) => setFilterBy(e.target.value)}
                          label="Filter"
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="all">All Categories</MenuItem>
                          <MenuItem value="active">Active Only</MenuItem>
                          <MenuItem value="inactive">Inactive Only</MenuItem>
                          <MenuItem value="parent">Parent Categories</MenuItem>
                          <MenuItem value="subcategory">Subcategories</MenuItem>
                          <MenuItem value="popular">Popular (5+ stores)</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Sort</InputLabel>
                        <Select
                          value={`${sortBy}_${sortOrder}`}
                          onChange={(e) => {
                            const [field, order] = e.target.value.split('_');
                            setSortBy(field);
                            setSortOrder(order);
                          }}
                          label="Sort"
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                          <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                          <MenuItem value="storeCount_desc">Most Stores</MenuItem>
                          <MenuItem value="storeCount_asc">Least Stores</MenuItem>
                          <MenuItem value="createdAt_desc">Newest First</MenuItem>
                          <MenuItem value="createdAt_asc">Oldest First</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  )}
                </Box>

                {/* Right side - View controls and actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {paginatedCategories.length} of {processedCategories.length} categories
                  </Typography>

                  {/* View Mode Toggle */}
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newViewMode) => newViewMode && setViewMode(newViewMode)}
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
                      <Tooltip title="Grid View">
                        <GridViewIcon />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="list">
                      <Tooltip title="List View">
                        <ListViewIcon />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="compact">
                      <Tooltip title="Compact View">
                        <CompactViewIcon />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>

                  {/* Action Buttons */}
                  <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh} size="small">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Export Categories">
                    <IconButton onClick={handleExport} size="small">
                      <ExportIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Import Categories">
                    <IconButton component="label" size="small">
                      <ImportIcon />
                      <input
                        type="file"
                        hidden
                        accept=".csv,.json"
                        onChange={handleImport}
                      />
                    </IconButton>
                  </Tooltip>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCategoryCreate}
                    sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                      }
                    }}
                  >
                    Add Category
                  </Button>
                </Box>
              </Box>

              {/* Active Filters Display */}
              {(searchTerm || filterBy !== 'all' || sortBy !== 'name') && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
                    Active filters:
                  </Typography>
                  
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      size="small"
                      onDelete={() => setSearchTerm('')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  
                  {filterBy !== 'all' && (
                    <Chip
                      label={`Filter: ${filterBy}`}
                      size="small"
                      onDelete={() => setFilterBy('all')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  
                  {sortBy !== 'name' && (
                    <Chip
                      label={`Sort: ${sortBy} (${sortOrder})`}
                      size="small"
                      onDelete={() => {
                        setSortBy('name');
                        setSortOrder('asc');
                      }}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}
            </Paper>
          </motion.div>
        )}

        {/* Categories Display */}
        {processedCategories.length === 0 ? (
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
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CategoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              </motion.div>
              
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                No Categories Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first category to get started'
                }
              </Typography>
              
              {(!searchTerm && filterBy === 'all') && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCategoryCreate}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  Create Category
                </Button>
              )}
            </Paper>
          </motion.div>
        ) : (
          <Box>
            {viewMode === 'grid' ? (
              <Grid container spacing={3}>
                <AnimatePresence>
                  {paginatedCategories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={index}
                      >
                        <CategoryCard
                          category={category}
                          variant="default"
                          onView={onCategorySelect}
                          onEdit={onCategoryEdit}
                          showSubcategories={true}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            ) : viewMode === 'list' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AnimatePresence>
                  {paginatedCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      custom={index}
                    >
                      <CategoryCard
                        category={category}
                        variant="default"
                        onView={onCategorySelect}
                        onEdit={onCategoryEdit}
                        showSubcategories={true}
                        showStats={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            ) : (
              <Grid container spacing={2}>
                <AnimatePresence>
                  {paginatedCategories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={index}
                      >
                        <CategoryCard
                          category={category}
                          variant="compact"
                          onView={onCategorySelect}
                          onEdit={onCategoryEdit}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      sx={{ borderRadius: 2 }}
                    >
                      First
                    </Button>
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      sx={{ borderRadius: 2 }}
                    >
                      Previous
                    </Button>
                    
                    <Typography variant="body2" sx={{ mx: 2 }}>
                      Page {currentPage} of {totalPages}
                    </Typography>
                    
                    <Button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      sx={{ borderRadius: 2 }}
                    >
                      Next
                    </Button>
                    <Button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      sx={{ borderRadius: 2 }}
                    >
                      Last
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            )}
          </Box>
        )}
      </motion.div>

      {/* Scroll to Top Button */}
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
    </>
  );
};

export default CategoryGrid;
