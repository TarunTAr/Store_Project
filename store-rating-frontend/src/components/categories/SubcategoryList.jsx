import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Tooltip,
  Collapse,
  Badge,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  ArrowForward as ArrowIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewCarousel as CarouselViewIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubcategories, navigateToCategory } from '../../store/categorySlice';

const SubcategoryList = ({
  parentCategory,
  subcategories = [],
  loading = false,
  variant = 'grid', // grid, list, carousel, compact
  showStats = true,
  showTrends = false,
  onSubcategoryClick,
  maxItems = null,
  showViewToggle = true,
  autoPlay = false,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState(variant);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubcategoryClick = (subcategory) => {
    if (onSubcategoryClick) {
      onSubcategoryClick(subcategory);
    } else {
      dispatch(navigateToCategory(subcategory.id));
      navigate(`/categories/${subcategory.id}`);
    }
  };

  const handleExpandToggle = (subcategoryId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
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
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ];
    return colors[id % colors.length];
  };

  const displaySubcategories = maxItems 
    ? subcategories.slice(0, maxItems)
    : subcategories;

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

  const hoverVariants = {
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box className={className}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rectangular" width={120} height={32} />
        </Box>
        
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={20} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (subcategories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'divider',
            background: 'rgba(102, 126, 234, 0.02)'
          }}
        >
          <CategoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No Subcategories
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {parentCategory?.name || 'This category'} doesn't have any subcategories yet.
          </Typography>
        </Paper>
      </motion.div>
    );
  }

  const SubcategoryCard = ({ subcategory, index }) => (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover="hover"
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            borderColor: getCategoryColor(subcategory.id),
            boxShadow: `0 8px 25px ${getCategoryColor(subcategory.id)}20`
          },
          transition: 'all 0.3s ease'
        }}
        onClick={() => handleSubcategoryClick(subcategory)}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: getCategoryColor(subcategory.id),
                  color: 'white',
                  fontSize: '20px'
                }}
              >
                {getCategoryIcon(subcategory)}
              </Avatar>
            </motion.div>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {subcategory.name}
              </Typography>

              {subcategory.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {subcategory.description}
                </Typography>
              )}

              {showStats && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {subcategory.storeCount || 0} stores
                    </Typography>
                  </Box>

                  {subcategory.avgRating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                      <Typography variant="caption" color="text.secondary">
                        {subcategory.avgRating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}

                  {showTrends && subcategory.trend && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: subcategory.trend === 'up' ? 'success.main' : 'error.main' 
                        }} 
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: subcategory.trend === 'up' ? 'success.main' : 'error.main',
                          fontWeight: 600
                        }}
                      >
                        {subcategory.trendPercentage}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {subcategory.isActive !== false ? (
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    sx={{ fontSize: '0.65rem', height: 18 }}
                  />
                ) : (
                  <Chip
                    label="Inactive"
                    size="small"
                    color="error"
                    sx={{ fontSize: '0.65rem', height: 18 }}
                  />
                )}

                {subcategory.children?.length > 0 && (
                  <Chip
                    label={`${subcategory.children.length} sub`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 18 }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              {(subcategory.storeCount || 0) > 0 && (
                <Badge
                  badgeContent={subcategory.storeCount}
                  color="primary"
                  max={99}
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }
                  }}
                />
              )}

              <IconButton
                size="small"
                sx={{
                  color: getCategoryColor(subcategory.id),
                  '&:hover': {
                    backgroundColor: `${getCategoryColor(subcategory.id)}15`
                  }
                }}
              >
                <ArrowIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Progress bar for popularity */}
          {showStats && (subcategory.storeCount || 0) > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Popularity
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.min(((subcategory.storeCount || 0) / 50) * 100, 100).toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(((subcategory.storeCount || 0) / 50) * 100, 100)}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(135deg, ${getCategoryColor(subcategory.id)}, ${getCategoryColor(subcategory.id)}88)`,
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const SubcategoryListItem = ({ subcategory, index }) => (
    <motion.div
      variants={itemVariants}
      custom={index}
    >
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleSubcategoryClick(subcategory)}
          sx={{
            borderRadius: 2,
            mb: 1,
            border: '1px solid transparent',
            '&:hover': {
              borderColor: getCategoryColor(subcategory.id),
              backgroundColor: `${getCategoryColor(subcategory.id)}10`
            }
          }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                backgroundColor: getCategoryColor(subcategory.id),
                color: 'white',
                fontSize: '16px'
              }}
            >
              {getCategoryIcon(subcategory)}
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {subcategory.name}
                </Typography>
                {subcategory.children?.length > 0 && (
                  <Chip
                    label={subcategory.children.length}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 16 }}
                  />
                )}
              </Box>
            }
            secondary={
              <Box>
                {subcategory.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {subcategory.description.length > 100 
                      ? `${subcategory.description.substring(0, 100)}...`
                      : subcategory.description
                    }
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {subcategory.storeCount || 0} stores
                  </Typography>
                  
                  {subcategory.avgRating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 12, color: '#f59e0b' }} />
                      <Typography variant="caption">
                        {subcategory.avgRating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            }
          />

          {subcategory.children?.length > 0 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleExpandToggle(subcategory.id);
              }}
              size="small"
            >
              {expandedItems.has(subcategory.id) ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
          )}
        </ListItemButton>
      </ListItem>

      {/* Nested subcategories */}
      {subcategory.children?.length > 0 && (
        <Collapse in={expandedItems.has(subcategory.id)}>
          <List sx={{ pl: 4 }}>
            {subcategory.children.map((child, childIndex) => (
              <SubcategoryListItem
                key={child.id}
                subcategory={child}
                index={childIndex}
              />
            ))}
          </List>
        </Collapse>
      )}
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {parentCategory?.name ? `${parentCategory.name} Categories` : 'Subcategories'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {displaySubcategories.length} subcategories available
          </Typography>
        </Box>

        {showViewToggle && (
          <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                backgroundColor: viewMode === 'grid' ? 'primary.light' : 'transparent'
              }}
            >
              <GridViewIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                backgroundColor: viewMode === 'list' ? 'primary.light' : 'transparent'
              }}
            >
              <ListViewIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('carousel')}
              sx={{
                color: viewMode === 'carousel' ? 'primary.main' : 'text.secondary',
                backgroundColor: viewMode === 'carousel' ? 'primary.light' : 'transparent'
              }}
            >
              <CarouselViewIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {displaySubcategories.map((subcategory, index) => (
                <Grid item xs={12} sm={6} md={4} key={subcategory.id}>
                  <SubcategoryCard subcategory={subcategory} index={index} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <List sx={{ p: 2 }}>
                {displaySubcategories.map((subcategory, index) => (
                  <SubcategoryListItem
                    key={subcategory.id}
                    subcategory={subcategory}
                    index={index}
                  />
                ))}
              </List>
            </Paper>
          </motion.div>
        )}

        {viewMode === 'carousel' && (
          <motion.div
            key="carousel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ '& .swiper-pagination-bullet-active': { backgroundColor: '#667eea' } }}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={autoPlay ? { delay: 3000 } : false}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 }
                }}
              >
                {displaySubcategories.map((subcategory, index) => (
                  <SwiperSlide key={subcategory.id}>
                    <SubcategoryCard subcategory={subcategory} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show More Button */}
      {maxItems && subcategories.length > maxItems && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              // Handle show more logic
            }}
            sx={{
              borderRadius: 3,
              px: 4,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light'
              }
            }}
          >
            Show {subcategories.length - maxItems} More Categories
          </Button>
        </Box>
      )}
    </motion.div>
  );
};

export default SubcategoryList;
