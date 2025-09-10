import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Rating,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Collapse,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import {
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Schedule as ScheduleIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../store/storeSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';

const StoreList = ({
  stores = [],
  loading = false,
  onStoreSelect,
  onRate,
  showPagination = true,
  itemsPerPage = 10,
  variant = 'standard' // standard, compact, detailed
}) => {
  const [expandedStores, setExpandedStores] = useState(new Set());
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Paginated stores
  const paginatedStores = useMemo(() => {
    if (!showPagination) return stores;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return stores.slice(startIndex, endIndex);
  }, [stores, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(stores.length / itemsPerPage);

  const handleExpandStore = (storeId) => {
    const newExpanded = new Set(expandedStores);
    if (newExpanded.has(storeId)) {
      newExpanded.delete(storeId);
    } else {
      newExpanded.add(storeId);
    }
    setExpandedStores(newExpanded);
  };

  const handleMenuOpen = (event, store) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedStore(store);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStore(null);
  };

  const handleViewStore = (store) => {
    if (onStoreSelect) {
      onStoreSelect(store);
    } else {
      navigate(`/stores/${store.id}`);
    }
    handleMenuClose();
  };

  const handleRateStore = (store) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (onRate) {
      onRate(store);
    } else {
      navigate(`/stores/${store.id}#rate`);
    }
    handleMenuClose();
  };

  const handleToggleFavorite = async (store) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(toggleFavorite(store.id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
    handleMenuClose();
  };

  const handleShare = async (store) => {
    const url = `${window.location.origin}/stores/${store.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: `Check out ${store.name} - ${store.rating}⭐ rating`,
          url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      // Show toast notification
    }
    handleMenuClose();
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      x: 8,
      transition: { duration: 0.2 }
    }
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LoadingSpinner message="Loading stores..." />
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
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <StoreIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No stores found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Try adjusting your search filters or browse all stores
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
            onClick={() => navigate('/stores')}
          >
            Browse All Stores
          </Button>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Box>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <List disablePadding>
            <AnimatePresence>
              {paginatedStores.map((store, index) => (
                <motion.div
                  key={store.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  custom={index}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      cursor: 'pointer',
                      borderBottom: index < paginatedStores.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleViewStore(store)}
                  >
                    {/* Store Avatar/Image */}
                    <ListItemAvatar>
                      <Avatar
                        src={store.image}
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: '2px solid white',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <StoreIcon />
                      </Avatar>
                    </ListItemAvatar>

                    {/* Store Information */}
                    <ListItemText
                      sx={{ flex: 1, pr: 2 }}
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {store.name}
                          </Typography>
                          
                          {store.isVerified && (
                            <Tooltip title="Verified Store">
                              <VerifiedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                            </Tooltip>
                          )}

                          {store.isOpen && (
                            <Chip
                              label="Open"
                              size="small"
                              sx={{
                                backgroundColor: 'success.light',
                                color: 'success.contrastText',
                                fontSize: '0.65rem',
                                height: 20
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          {/* Location */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 14, color: 'text.disabled', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {store.address}
                            </Typography>
                          </Box>

                          {/* Rating */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Rating
                                value={store.rating}
                                precision={0.1}
                                readOnly
                                size="small"
                                sx={{
                                  '& .MuiRating-iconFilled': {
                                    color: '#f59e0b'
                                  }
                                }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {store.rating.toFixed(1)} ({store.reviewCount || 0} reviews)
                              </Typography>
                            </Box>
                          </Box>

                          {/* User's Rating */}
                          {isAuthenticated && store.userRating && (
                            <Box
                              sx={{
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                borderRadius: 1,
                                px: 1.5,
                                py: 0.5,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                                Your rating:
                              </Typography>
                              <Rating
                                value={store.userRating}
                                readOnly
                                size="small"
                                sx={{ fontSize: '1rem' }}
                              />
                            </Box>
                          )}
                        </Box>
                      }
                    />

                    {/* Store Stats & Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Category */}
                      {store.category && (
                        <Chip
                          label={store.category.name}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}

                      {/* Favorite Button */}
                      <Tooltip title={store.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(store);
                          }}
                          sx={{
                            color: store.isFavorite ? 'error.main' : 'text.secondary',
                            '&:hover': {
                              color: 'error.main',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          {store.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Tooltip>

                      {/* Expand Button */}
                      <Tooltip title={expandedStores.has(store.id) ? 'Show less' : 'Show more'}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExpandStore(store.id);
                          }}
                          sx={{
                            transform: expandedStores.has(store.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <ExpandIcon />
                        </IconButton>
                      </Tooltip>

                      {/* Menu Button */}
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, store)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    {/* Expanded Content */}
                    <Collapse in={expandedStores.has(store.id)} timeout="auto" unmountOnExit>
                      <motion.div
                        variants={expandVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                          {/* Contact Information */}
                          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                            {store.phone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption">
                                  {store.phone}
                                </Typography>
                              </Box>
                            )}
                            
                            {store.email && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption">
                                  {store.email}
                                </Typography>
                              </Box>
                            )}

                            {store.hours && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ScheduleIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption">
                                  {store.hours}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Description */}
                          {store.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2, lineHeight: 1.6 }}
                            >
                              {store.description}
                            </Typography>
                          )}

                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ViewIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewStore(store);
                              }}
                              sx={{ borderRadius: 2 }}
                            >
                              View Details
                            </Button>

                            <Button
                              size="small"
                              variant="contained"
                              startIcon={store.userRating ? <EditIcon /> : <StarIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRateStore(store);
                              }}
                              sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}
                            >
                              {store.userRating ? 'Edit Rating' : 'Rate Store'}
                            </Button>
                          </Box>
                        </Box>
                      </motion.div>
                    </Collapse>
                  </ListItem>

                  {/* Divider */}
                  {index < paginatedStores.length - 1 && (
                    <Divider sx={{ ml: 10 }} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </Paper>
      </motion.div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

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
        <MenuItem onClick={() => handleViewStore(selectedStore)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleRateStore(selectedStore)}>
          <ListItemIcon>
            {selectedStore?.userRating ? <EditIcon fontSize="small" /> : <StarIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {selectedStore?.userRating ? 'Edit Rating' : 'Rate Store'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleToggleFavorite(selectedStore)}>
          <ListItemIcon>
            {selectedStore?.isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {selectedStore?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleShare(selectedStore)}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share Store</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StoreList;
