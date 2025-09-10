import React, { useState } from 'react';
import {
  Breadcrumbs,
  Typography,
  Link,
  Box,
  Paper,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
  Collapse
} from '@mui/material';
import {
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  MoreHoriz as MoreIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  KeyboardArrowDown as DropdownIcon,
  Navigation as NavigationIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryPath, navigateToCategory } from '../../store/categorySlice';

const CategoryBreadcrumb = ({
  categoryPath = [],
  onCategoryClick,
  showHome = true,
  showStoreCount = true,
  showDropdown = true,
  variant = 'default', // default, compact, pills
  maxItems = 4,
  className = ''
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  const handleCategoryClick = (category, index) => {
    if (onCategoryClick) {
      onCategoryClick(category, index);
    } else {
      dispatch(navigateToCategory(category.id));
      navigate(`/categories/${category.id}`);
    }
  };

  const handleHomeClick = () => {
    if (onCategoryClick) {
      onCategoryClick(null, -1);
    } else {
      dispatch(setCategoryPath([]));
      navigate('/categories');
    }
  };

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
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

  // Handle overflow when there are too many items
  const shouldCollapse = categoryPath.length > maxItems;
  const visibleItems = shouldCollapse 
    ? [categoryPath[0], ...categoryPath.slice(-maxItems + 2)]
    : categoryPath;
  const hiddenItems = shouldCollapse 
    ? categoryPath.slice(1, categoryPath.length - maxItems + 2)
    : [];

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
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

  const hoverVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  if (variant === 'pills') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {showHome && (
            <motion.div variants={itemVariants} whileHover="hover">
              <Chip
                icon={<HomeIcon sx={{ fontSize: 18 }} />}
                label="Home"
                clickable
                onClick={handleHomeClick}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    borderColor: 'primary.main'
                  },
                  transition: 'all 0.3s ease'
                }}
              />
            </motion.div>
          )}

          <AnimatePresence>
            {categoryPath.map((category, index) => (
              <React.Fragment key={category.id}>
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                >
                  <Chip
                    avatar={
                      <Box sx={{ fontSize: '14px', ml: 0.5 }}>
                        {getCategoryIcon(category)}
                      </Box>
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {category.name}
                        {showStoreCount && category.storeCount > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              borderRadius: 1,
                              px: 0.5,
                              fontSize: '0.6rem'
                            }}
                          >
                            {category.storeCount}
                          </Typography>
                        )}
                      </Box>
                    }
                    clickable
                    onClick={() => handleCategoryClick(category, index)}
                    sx={{
                      borderRadius: 3,
                      backgroundColor: index === categoryPath.length - 1 
                        ? getCategoryColor(category.id) 
                        : 'transparent',
                      color: index === categoryPath.length - 1 ? 'white' : 'text.primary',
                      border: `1px solid ${getCategoryColor(category.id)}`,
                      '&:hover': {
                        backgroundColor: getCategoryColor(category.id),
                        color: 'white'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </motion.div>

                {index < categoryPath.length - 1 && (
                  <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </Box>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Paper
          elevation={1}
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <NavigationIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          
          <Breadcrumbs
            separator={<ChevronRightIcon sx={{ fontSize: 14 }} />}
            sx={{
              '& .MuiBreadcrumbs-separator': {
                color: 'text.disabled'
              }
            }}
          >
            {showHome && (
              <Link
                component="button"
                variant="caption"
                onClick={handleHomeClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <HomeIcon sx={{ fontSize: 12 }} />
                Home
              </Link>
            )}

            {categoryPath.map((category, index) => (
              <Link
                key={category.id}
                component="button"
                variant="caption"
                onClick={() => handleCategoryClick(category, index)}
                sx={{
                  textDecoration: 'none',
                  color: index === categoryPath.length - 1 ? 'text.primary' : 'text.secondary',
                  fontWeight: index === categoryPath.length - 1 ? 600 : 400,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {category.name}
              </Link>
            ))}
          </Breadcrumbs>
        </Paper>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Breadcrumbs
          separator={
            <motion.div
              animate={{ rotate: [0, 180, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronRightIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            </motion.div>
          }
          sx={{
            '& .MuiBreadcrumbs-separator': {
              mx: 1
            }
          }}
        >
          {/* Home Link */}
          {showHome && (
            <motion.div
              variants={itemVariants}
              whileHover={hoverVariants.hover}
              onHoverStart={() => setHoveredIndex(-1)}
              onHoverEnd={() => setHoveredIndex(-2)}
            >
              <Link
                component="button"
                onClick={handleHomeClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textDecoration: 'none',
                  color: 'text.primary',
                  backgroundColor: hoveredIndex === -1 ? 'primary.light' : 'transparent',
                  border: '1px solid transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <HomeIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Categories
                </Typography>
              </Link>
            </motion.div>
          )}

          {/* Collapsed items indicator */}
          {shouldCollapse && hiddenItems.length > 0 && (
            <motion.div variants={itemVariants}>
              <IconButton
                size="small"
                onClick={handleDropdownOpen}
                sx={{
                  backgroundColor: 'grey.100',
                  '&:hover': {
                    backgroundColor: 'grey.200'
                  }
                }}
              >
                <MoreIcon />
              </IconButton>
            </motion.div>
          )}

          {/* Visible category items */}
          <AnimatePresence>
            {visibleItems.map((category, index) => {
              const isLast = index === categoryPath.length - 1;
              const actualIndex = shouldCollapse && index > 0 ? index + hiddenItems.length : index;
              
              return (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={hoverVariants.hover}
                  onHoverStart={() => setHoveredIndex(actualIndex)}
                  onHoverEnd={() => setHoveredIndex(-2)}
                >
                  <Link
                    component="button"
                    onClick={() => handleCategoryClick(category, actualIndex)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textDecoration: 'none',
                      color: isLast ? 'primary.main' : 'text.primary',
                      backgroundColor: isLast 
                        ? `${getCategoryColor(category.id)}15` 
                        : hoveredIndex === actualIndex ? 'action.hover' : 'transparent',
                      border: `1px solid ${isLast ? getCategoryColor(category.id) : 'transparent'}`,
                      '&:hover': {
                        borderColor: getCategoryColor(category.id),
                        backgroundColor: `${getCategoryColor(category.id)}20`
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box sx={{ fontSize: '16px' }}>
                      {getCategoryIcon(category)}
                    </Box>
                    
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isLast ? 700 : 600,
                          color: isLast ? getCategoryColor(category.id) : 'text.primary'
                        }}
                      >
                        {category.name}
                      </Typography>
                      
                      {showStoreCount && category.storeCount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {category.storeCount} stores
                        </Typography>
                      )}
                    </Box>

                    {showDropdown && category.children?.length > 0 && (
                      <DropdownIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Breadcrumbs>

        {/* Dropdown Menu for collapsed items */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDropdownClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mt: 1
            }
          }}
        >
          {hiddenItems.map((category, index) => (
            <MenuItem
              key={category.id}
              onClick={() => {
                handleCategoryClick(category, index + 1);
                handleDropdownClose();
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 1,
                mx: 0.5,
                '&:hover': {
                  backgroundColor: `${getCategoryColor(category.id)}15`
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <Box sx={{ fontSize: '16px' }}>
                  {getCategoryIcon(category)}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={category.name}
                secondary={showStoreCount && category.storeCount > 0 ? `${category.storeCount} stores` : undefined}
              />
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </motion.div>
  );
};

export default CategoryBreadcrumb;
