import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Avatar,
  Rating,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fade,
  Collapse
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { submitRating, updateRating, toggleFavorite } from '../../store/storeSlice';

const StoreCard = ({ 
  store, 
  variant = 'standard', // standard, compact, featured
  showActions = true,
  onView,
  onRate,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState(store.userRating || 0);
  const [ratingComment, setRatingComment] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.stores);

  const handleViewStore = () => {
    if (onView) {
      onView(store);
    } else {
      navigate(`/stores/${store.id}`);
    }
  };

  const handleRateStore = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setRatingDialogOpen(true);
  };

  const handleSubmitRating = async () => {
    try {
      const ratingData = {
        storeId: store.id,
        rating: userRating,
        comment: ratingComment
      };

      if (store.userRating) {
        await dispatch(updateRating(ratingData)).unwrap();
      } else {
        await dispatch(submitRating(ratingData)).unwrap();
      }

      setRatingDialogOpen(false);
      setRatingComment('');
      
      if (onRate) {
        onRate(store, userRating);
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(toggleFavorite(store.id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: `Check out ${store.name} - ${store.rating}⭐ rating`,
          url: `${window.location.origin}/stores/${store.id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/stores/${store.id}`);
    }
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
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.4 }
    }
  };

  const actionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  const getCardHeight = () => {
    switch (variant) {
      case 'compact': return 280;
      case 'featured': return 400;
      default: return 350;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'compact': return 120;
      case 'featured': return 200;
      default: return 160;
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={className}
      >
        <Card
          sx={{
            height: getCardHeight(),
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
              borderColor: 'primary.main'
            },
            transition: 'all 0.3s ease'
          }}
          onClick={handleViewStore}
        >
          {/* Store Image */}
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <motion.div variants={imageVariants} whileHover="hover">
              <CardMedia
                component="img"
                height={getImageHeight()}
                image={store.image || '/api/placeholder/400/200'}
                alt={store.name}
                sx={{
                  objectFit: 'cover',
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                  transition: 'filter 0.3s ease'
                }}
              />
            </motion.div>

            {/* Overlay Badges */}
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap'
              }}
            >
              {store.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(16, 185, 129, 0.9)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </motion.div>
              )}

              {store.isOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Chip
                    icon={<ScheduleIcon />}
                    label="Open"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(34, 197, 94, 0.9)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </motion.div>
              )}

              {store.category && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Chip
                    label={store.category.name}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(102, 126, 234, 0.9)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </motion.div>
              )}
            </Box>

            {/* Action Buttons */}
            <AnimatePresence>
              {isHovered && showActions && (
                <motion.div
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <Tooltip title={store.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite();
                      }}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: store.isFavorite ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      {store.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share store">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                      }}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rating Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -16,
                right: 16,
                backgroundColor: 'white',
                borderRadius: '50%',
                p: 1,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                border: '3px solid white'
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `conic-gradient(#667eea ${(store.rating / 5) * 360}deg, #e0e0e0 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: '0.7rem'
                  }}
                >
                  {store.rating.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <CardContent sx={{ pt: 3, pb: 2 }}>
            {/* Store Name */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'text.primary'
              }}
            >
              {store.name}
            </Typography>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}
              >
                {store.address}
              </Typography>
            </Box>

            {/* Rating Display */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                <Typography variant="caption" color="text.secondary">
                  ({store.reviewCount || 0})
                </Typography>
              </Box>

              {store.priceRange && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'success.main',
                    fontWeight: 600
                  }}
                >
                  {store.priceRange}
                </Typography>
              )}
            </Box>

            {/* User's Rating */}
            {isAuthenticated && store.userRating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 2,
                    p: 1,
                    mb: 2,
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                    Your Rating:
                  </Typography>
                  <Rating
                    value={store.userRating}
                    readOnly
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </motion.div>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewStore();
                }}
                startIcon={<ViewIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                View
              </Button>

              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleRateStore();
                }}
                startIcon={store.userRating ? <EditIcon /> : <StarIcon />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                  }
                }}
              >
                {store.userRating ? 'Edit Rating' : 'Rate'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Rate {store.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share your experience with other customers
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Your Rating:
            </Typography>
            <Rating
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              size="large"
              sx={{
                fontSize: '3rem',
                '& .MuiRating-iconFilled': {
                  color: '#f59e0b'
                },
                '& .MuiRating-iconHover': {
                  color: '#fbbf24'
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Click the stars to rate
            </Typography>
          </Box>

          <TextField
            label="Comment (Optional)"
            multiline
            rows={3}
            fullWidth
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Tell others about your experience..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setRatingDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRating}
            variant="contained"
            disabled={userRating === 0 || loading}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 3
            }}
          >
            {loading ? 'Submitting...' : store.userRating ? 'Update Rating' : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreCard;
