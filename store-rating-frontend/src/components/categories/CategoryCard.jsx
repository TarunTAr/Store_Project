import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress,
  Collapse,
  Divider
} from '@mui/material';
import {
  Category as CategoryIcon,
  Store as StoreIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingIcon,
  LocalGasStation as GasIcon,
  LocalPharmacy as PharmacyIcon,
  School as SchoolIcon,
  FitnessCenter as GymIcon,
  LocalHospital as HealthIcon,
  Build as ServiceIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, updateCategory } from '../../store/categorySlice';

const CategoryCard = ({
  category = {},
  variant = 'default', // default, compact, detailed, tree
  showActions = true,
  showStats = true,
  showSubcategories = false,
  onEdit,
  onView,
  onDelete,
  onAddSubcategory,
  interactive = true,
  level = 0,
  className = ''
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(category);
    }
  };

  const handleView = () => {
    handleMenuClose();
    if (onView) {
      onView(category);
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await dispatch(deleteCategory(category.id)).unwrap();
        if (onDelete) {
          onDelete(category.id);
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleAddSubcategory = () => {
    handleMenuClose();
    if (onAddSubcategory) {
      onAddSubcategory(category);
    }
  };

  const getCategoryIcon = (categoryName, iconName) => {
    const name = (iconName || categoryName || '').toLowerCase();
    const iconProps = { sx: { fontSize: variant === 'compact' ? 20 : 24 } };

    switch (name) {
      case 'restaurant':
      case 'food':
      case 'dining':
        return <RestaurantIcon {...iconProps} />;
      case 'shopping':
      case 'retail':
      case 'store':
        return <ShoppingIcon {...iconProps} />;
      case 'gas':
      case 'fuel':
        return <GasIcon {...iconProps} />;
      case 'pharmacy':
      case 'health':
        return <LocalPharmacy {...iconProps} />;
      case 'education':
      case 'school':
        return <SchoolIcon {...iconProps} />;
      case 'fitness':
      case 'gym':
        return <GymIcon {...iconProps} />;
      case 'hospital':
      case 'medical':
        return <HealthIcon {...iconProps} />;
      case 'service':
      case 'repair':
        return <ServiceIcon {...iconProps} />;
      default:
        return <CategoryIcon {...iconProps} />;
    }
  };

  const getCategoryColor = (id) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ];
    return colors[id % colors.length];
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -6,
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${Math.min((category.storeCount / 100) * 100, 100)}%`,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : {}}
        className={className}
      >
        <Card
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.9)',
            cursor: interactive ? 'pointer' : 'default'
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: getCategoryColor(category.id),
                  color: 'white'
                }}
              >
                {getCategoryIcon(category.name, category.icon)}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {category.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.storeCount || 0} stores
                </Typography>
              </Box>

              {showActions && (
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreIcon />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'tree') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={className}
        style={{ marginLeft: level * 24 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            borderRadius: 2,
            border: '1px solid transparent',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: getCategoryColor(category.id)
            },
            transition: 'all 0.2s ease'
          }}
        >
          {category.subcategories?.length > 0 && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ mr: 0.5 }}
            >
              {expanded ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
          )}

          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: getCategoryColor(category.id),
              color: 'white',
              mr: 1.5
            }}
          >
            {getCategoryIcon(category.name, category.icon)}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {category.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {category.storeCount || 0} stores
            </Typography>
          </Box>

          {showActions && (
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreIcon />
            </IconButton>
          )}
        </Box>

        {category.subcategories?.length > 0 && (
          <Collapse in={expanded}>
            <Box sx={{ ml: 2, mt: 1 }}>
              {category.subcategories.map((subcategory) => (
                <CategoryCard
                  key={subcategory.id}
                  category={subcategory}
                  variant="tree"
                  level={level + 1}
                  showActions={showActions}
                  onEdit={onEdit}
                  onView={onView}
                  onDelete={onDelete}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </motion.div>
    );
  }

  // Default detailed variant
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={interactive ? "hover" : {}}
      whileTap={interactive ? "tap" : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: isHovered ? getCategoryColor(category.id) : 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          cursor: interactive ? 'pointer' : 'default',
          '&:hover': {
            boxShadow: `0 10px 30px ${getCategoryColor(category.id)}20`
          },
          transition: 'all 0.3s ease'
        }}
        onClick={() => onView && onView(category)}
      >
        {/* Header with gradient */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${getCategoryColor(category.id)}15 0%, ${getCategoryColor(category.id)}08 100%)`,
            p: 3,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <motion.div
              animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: getCategoryColor(category.id),
                  color: 'white',
                  boxShadow: 3
                }}
              >
                {getCategoryIcon(category.name, category.icon)}
              </Avatar>
            </motion.div>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {category.name}
                </Typography>
                
                {showActions && (
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                )}
              </Box>

              {category.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {category.description}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {category.isActive !== false ? (
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ) : (
                  <Chip
                    label="Inactive"
                    size="small"
                    color="error"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}

                {category.parentId && (
                  <Chip
                    label="Subcategory"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Statistics */}
          {showStats && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Category Statistics
                </Typography>
                
                {category.trend && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {category.trend === 'up' ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: category.trend === 'up' ? 'success.main' : 'error.main',
                        fontWeight: 600
                      }}
                    >
                      {category.trendPercentage}%
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: getCategoryColor(category.id) }}>
                    {category.storeCount || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Stores
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {category.avgRating?.toFixed(1) || '0.0'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg Rating
                  </Typography>
                </Box>
              </Box>

              {/* Progress bar */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Store Distribution
                </Typography>
                <Box
                  sx={{
                    height: 6,
                    backgroundColor: 'grey.200',
                    borderRadius: 3,
                    overflow: 'hidden',
                    mt: 0.5
                  }}
                >
                  <motion.div
                    variants={progressVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${getCategoryColor(category.id)}, ${getCategoryColor(category.id)}88)`,
                      borderRadius: 3
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Subcategories */}
          {showSubcategories && category.subcategories?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Subcategories ({category.subcategories.length})
                </Typography>
                
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  endIcon={expanded ? <CollapseIcon /> : <ExpandIcon />}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {expanded ? 'Hide' : 'Show'}
                </Button>
              </Box>

              <Collapse in={expanded}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {category.subcategories.slice(0, 5).map((sub) => (
                    <Chip
                      key={sub.id}
                      label={sub.name}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {category.subcategories.length > 5 && (
                    <Chip
                      label={`+${category.subcategories.length - 5} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Collapse>
            </Box>
          )}
        </CardContent>

        {/* Actions */}
        {showActions && (
          <CardActions sx={{ px: 3, py: 2, backgroundColor: 'grey.50' }}>
            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              sx={{ borderRadius: 2 }}
            >
              View Stores
            </Button>
            
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>

            <Box sx={{ flex: 1 }} />
            
            <Typography variant="caption" color="text.disabled">
              ID: {category.id}
            </Typography>
          </CardActions>
        )}
      </Card>

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
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Stores</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Category</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAddSubcategory}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Subcategory</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Category</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default CategoryCard;
