import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Collapse,
  Badge,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Paper,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  Fab
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Home as HomeIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Dashboard as DashboardIcon,
  AccountTree as TreeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories, 
  setCategoryPath, 
  navigateToCategory,
  toggleCategoryFavorite
} from '../../store/categorySlice';

const CategoryNavigation = ({
  variant = 'drawer', // drawer, sidebar, dropdown, mega
  open = false,
  onClose,
  onOpen,
  categories = [],
  currentCategory = null,
  showSearch = true,
  showFilters = true,
  showStats = true,
  maxDepth = 3,
  autoClose = true,
  position = 'left', // left, right
  width = 280,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Build hierarchical structure
  const categoryTree = React.useMemo(() => {
    const categoryMap = new Map();
    const rootCategories = [];

    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: []
      });
    });

    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id);
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId);
        parent.children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }, [categories]);

  // Filter and sort categories
  const filteredCategories = React.useMemo(() => {
    let filtered = [...categoryTree];

    // Apply search filter
    if (searchTerm) {
      const filterTree = (nodes) => {
        return nodes.filter(node => {
          const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
          const hasMatchingChildren = node.children && filterTree(node.children).length > 0;
          
          if (hasMatchingChildren) {
            node.children = filterTree(node.children);
          }
          
          return matchesSearch || hasMatchingChildren;
        });
      };
      
      filtered = filterTree(filtered);
    }

    // Apply status filter
    if (filterBy === 'active') {
      filtered = filtered.filter(cat => cat.isActive !== false);
    } else if (filterBy === 'inactive') {
      filtered = filtered.filter(cat => cat.isActive === false);
    } else if (filterBy === 'popular') {
      filtered = filtered.filter(cat => (cat.storeCount || 0) > 5);
    }

    // Apply sorting
    const sortCategories = (nodes) => {
      return nodes.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === 'name') {
          aValue = aValue?.toLowerCase() || '';
          bValue = bValue?.toLowerCase() || '';
        } else if (sortBy === 'storeCount') {
          aValue = aValue || 0;
          bValue = bValue || 0;
        }

        return aValue > bValue ? 1 : -1;
      }).map(node => ({
        ...node,
        children: node.children ? sortCategories(node.children) : []
      }));
    };

    return sortCategories(filtered);
  }, [categoryTree, searchTerm, filterBy, sortBy]);

  const handleCategoryClick = (category) => {
    dispatch(navigateToCategory(category.id));
    navigate(`/categories/${category.id}`);
    
    if (autoClose && onClose) {
      onClose();
    }
  };

  const handleToggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category) => {
    const name = (category.icon || category.name || '').toLowerCase();
    switch (name) {
      case 'restaurant':
      case 'food':
        return '🍽️';
      case 'shopping':
      case 'retail':
        return '🛍️';
      case 'gas':
      case 'fuel':
        return '⛽';
      case 'pharmacy':
      case 'health':
        return '💊';
      case 'education':
      case 'school':
        return '🎓';
      case 'fitness':
      case 'gym':
        return '💪';
      default:
        return '📁';
    }
  };

  const getCategoryColor = (id) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
    ];
    return colors[id % colors.length];
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const CategoryItem = ({ category, level = 0, index = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedItems.has(category.id);
    const isActive = currentCategory?.id === category.id;

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        custom={index}
      >
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleCategoryClick(category)}
            sx={{
              pl: 2 + level * 2,
              pr: 1,
              py: 1,
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              backgroundColor: isActive ? `${getCategoryColor(category.id)}15` : 'transparent',
              border: `1px solid ${isActive ? getCategoryColor(category.id) : 'transparent'}`,
              '&:hover': {
                backgroundColor: `${getCategoryColor(category.id)}10`,
                borderColor: getCategoryColor(category.id)
              },
              transition: 'all 0.2s ease'
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Box sx={{ fontSize: '18px' }}>
                {getCategoryIcon(category)}
              </Box>
            </ListItemIcon>

            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ 
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? getCategoryColor(category.id) : 'text.primary'
                    }}
                  >
                    {category.name}
                  </Typography>
                  
                  {category.isActive === false && (
                    <Chip
                      label="Inactive"
                      size="small"
                      color="error"
                      sx={{ fontSize: '0.6rem', height: 16 }}
                    />
                  )}
                </Box>
              }
              secondary={
                showStats && (
                  <Typography variant="caption" color="text.secondary">
                    {category.storeCount || 0} stores
                  </Typography>
                )
              }
            />

            {showStats && (category.storeCount || 0) > 0 && (
              <Badge
                badgeContent={category.storeCount}
                color="primary"
                max={99}
                sx={{
                  mr: hasChildren ? 0 : 1,
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    height: 16,
                    minWidth: 16
                  }
                }}
              />
            )}

            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand(category.id);
                }}
                sx={{ ml: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExpandIcon sx={{ fontSize: 18 }} />
                </motion.div>
              </IconButton>
            )}
          </ListItemButton>

          {/* Children */}
          <AnimatePresence>
            {hasChildren && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <List component="div" disablePadding>
                    {category.children.map((child, childIndex) => (
                      <CategoryItem
                        key={child.id}
                        category={child}
                        level={level + 1}
                        index={childIndex}
                      />
                    ))}
                  </List>
                </motion.div>
              </Collapse>
            )}
          </AnimatePresence>
        </ListItem>
      </motion.div>
    );
  };

  const NavigationContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Categories
            </Typography>
          </Box>

          {variant === 'drawer' && onClose && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            size="small"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/categories')}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}
          >
            All Categories
          </Button>
          
          <Button
            size="small"
            startIcon={<TreeIcon />}
            onClick={() => navigate('/categories/tree')}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}
          >
            Tree View
          </Button>
        </Box>

        {/* Search */}
        {showSearch && (
          <TextField
            size="small"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        )}
      </Box>

      {/* Filters */}
      {showFilters && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant={filterBy === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilterBy('all')}
              sx={{ borderRadius: 2, fontSize: '0.7rem' }}
            >
              All
            </Button>
            <Button
              size="small"
              variant={filterBy === 'active' ? 'contained' : 'outlined'}
              onClick={() => setFilterBy('active')}
              sx={{ borderRadius: 2, fontSize: '0.7rem' }}
            >
              Active
            </Button>
            <Button
              size="small"
              variant={filterBy === 'popular' ? 'contained' : 'outlined'}
              onClick={() => setFilterBy('popular')}
              sx={{ borderRadius: 2, fontSize: '0.7rem' }}
            >
              Popular
            </Button>
          </Box>
        </Box>
      )}

      {/* Category List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Loading categories...
            </Typography>
          </Box>
        ) : filteredCategories.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CategoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'No matching categories' : 'No categories found'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ pt: 1 }}>
            {filteredCategories.map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </List>
        )}
      </Box>

      {/* Footer Stats */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'grey.50'
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          {categories.length} total categories
          {categories.filter(c => c.parentId).length > 0 && (
            <> • {categories.filter(c => c.parentId).length} subcategories</>
          )}
        </Typography>
      </Box>
    </Box>
  );

  if (variant === 'dropdown') {
    return (
      <>
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          startIcon={<CategoryIcon />}
          endIcon={<ExpandIcon />}
          sx={{ borderRadius: 2 }}
          className={className}
        >
          Categories
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              width: 300,
              maxHeight: 400,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }
          }}
        >
          <Box sx={{ p: 1 }}>
            <NavigationContent />
          </Box>
        </Menu>
      </>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Paper
        elevation={2}
        sx={{
          width,
          height: '100%',
          borderRadius: 0,
          border: '1px solid',
          borderColor: 'divider'
        }}
        className={className}
      >
        <NavigationContent />
      </Paper>
    );
  }

  // Default drawer variant
  return (
    <>
      {/* Mobile Fab Button */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Fab
          color="primary"
          onClick={onOpen}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: 1200
          }}
        >
          <CategoryIcon />
        </Fab>
      </Box>

      <Drawer
        anchor={position}
        open={open}
        onClose={onClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        PaperProps={{
          sx: {
            width,
            borderRadius: position === 'left' ? '0 16px 16px 0' : '16px 0 0 16px',
            border: 'none'
          }
        }}
        className={className}
      >
        <NavigationContent />
      </Drawer>
    </>
  );
};

export default CategoryNavigation;
