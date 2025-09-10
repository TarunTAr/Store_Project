import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Rating,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  Collapse,
  Tooltip,
  Alert,
  Badge,
  ImageList,
  ImageListItem
} from '@mui/material';
import {
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Language as WebsiteIcon,
  Verified as VerifiedIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  PhotoCamera as PhotoIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { 
  fetchStoreDetails, 
  submitRating, 
  updateRating, 
  deleteRating,
  toggleFavorite,
  likeReview,
  reportReview
} from '../../store/storeSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ImageUpload from '../common/ImageUpload';

const StoreDetails = ({ storeId: propStoreId, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [reportDialog, setReportDialog] = useState({ open: false, reviewId: null });

  const { id: paramStoreId } = useParams();
  const storeId = propStoreId || paramStoreId;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    currentStore: store, 
    loading, 
    error 
  } = useSelector((state) => state.stores);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreDetails(storeId));
    }
  }, [dispatch, storeId]);

  useEffect(() => {
    if (store && user) {
      const existingRating = store.reviews?.find(review => review.userId === user.id);
      if (existingRating) {
        setUserRating(existingRating.rating);
        setRatingComment(existingRating.comment || '');
      }
    }
  }, [store, user]);

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
        comment: ratingComment,
        images: selectedImages
      };

      const existingRating = store.reviews?.find(review => review.userId === user.id);
      
      if (existingRating) {
        await dispatch(updateRating({ ...ratingData, reviewId: existingRating.id })).unwrap();
      } else {
        await dispatch(submitRating(ratingData)).unwrap();
      }

      setRatingDialogOpen(false);
      setSelectedImages([]);
      
      // Refresh store details
      dispatch(fetchStoreDetails(storeId));
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleDeleteRating = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your rating?')) {
      try {
        await dispatch(deleteRating(reviewId)).unwrap();
        dispatch(fetchStoreDetails(storeId));
      } catch (error) {
        console.error('Failed to delete rating:', error);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(toggleFavorite(store.id)).unwrap();
      dispatch(fetchStoreDetails(storeId));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async () => {
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
  };

  const handleToggleReview = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(likeReview(reviewId)).unwrap();
      dispatch(fetchStoreDetails(storeId));
    } catch (error) {
      console.error('Failed to like review:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LoadingSpinner 
          message="Loading store details..." 
          size="large"
        />
      </Box>
    );
  }

  if (error || !store) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error || 'Store not found'}
        </Alert>
      </motion.div>
    );
  }

  const userReview = store.reviews?.find(review => review.userId === user?.id);
  const otherReviews = store.reviews?.filter(review => review.userId !== user?.id) || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              mb: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
            }}
          >
            {/* Store Image Gallery */}
            <Box sx={{ position: 'relative', height: 300 }}>
              {store.images && store.images.length > 0 ? (
                <ImageList
                  sx={{ height: '100%', m: 0 }}
                  cols={store.images.length === 1 ? 1 : 3}
                  rowHeight="auto"
                  gap={2}
                >
                  {store.images.slice(0, 3).map((image, index) => (
                    <ImageListItem
                      key={index}
                      cols={index === 0 && store.images.length > 1 ? 2 : 1}
                      rows={index === 0 && store.images.length > 1 ? 2 : 1}
                    >
                      <motion.img
                        src={image.url}
                        alt={`${store.name} ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setImageDialogOpen(true)}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PhotoIcon sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />
                </Box>
              )}

              {/* Close Button (for modal) */}
              {onClose && (
                <IconButton
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>

            {/* Store Info Header */}
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {store.name}
                    </Typography>
                    
                    {store.isVerified && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Tooltip title="Verified Business">
                          <VerifiedIcon sx={{ fontSize: 32, color: 'success.main' }} />
                        </Tooltip>
                      </motion.div>
                    )}

                    {store.isOpen ? (
                      <Chip
                        label="Open"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : (
                      <Chip
                        label="Closed"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {store.category?.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {store.address}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={store.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <IconButton
                      onClick={handleToggleFavorite}
                      sx={{
                        backgroundColor: 'background.paper',
                        color: store.isFavorite ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'background.paper',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      {store.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share store">
                    <IconButton
                      onClick={handleShare}
                      sx={{
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'background.paper',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Rating Overview */}
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <motion.div variants={statsVariants}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {store.rating.toFixed(1)}
                      </Typography>
                      <Rating
                        value={store.rating}
                        precision={0.1}
                        readOnly
                        size="large"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {store.reviewCount} reviews
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>

                <Grid item xs>
                  {/* Rating Distribution */}
                  <Box sx={{ ml: 3 }}>
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = store.ratingDistribution?.[stars] || 0;
                      const percentage = store.reviewCount ? (count / store.reviewCount) * 100 : 0;
                      
                      return (
                        <Box key={stars} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ minWidth: 20 }}>
                            {stars}
                          </Typography>
                          <StarIcon sx={{ fontSize: 16, color: '#f59e0b', mx: 0.5 }} />
                          <Box
                            sx={{
                              flex: 1,
                              height: 8,
                              backgroundColor: 'grey.200',
                              borderRadius: 4,
                              mx: 1,
                              overflow: 'hidden'
                            }}
                          >
                            <motion.div
                              style={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 4
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: stars * 0.1 }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ minWidth: 30, color: 'text.secondary' }}>
                            {count}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={userReview ? <EditIcon /> : <StarIcon />}
                    onClick={handleRateStore}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    {userReview ? 'Edit My Review' : 'Write a Review'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </motion.div>

        {/* Content Tabs */}
        <motion.div variants={itemVariants}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem'
                }
              }}
            >
              <Tab label="About" />
              <Tab label={`Reviews (${store.reviewCount})`} />
              <Tab label="Contact" />
              {store.location && <Tab label="Map" />}
            </Tabs>

            <Box sx={{ p: 4 }}>
              {/* About Tab */}
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {store.description && (
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                      {store.description}
                    </Typography>
                  )}

                  <Grid container spacing={3}>
                    {store.hours && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Business Hours
                        </Typography>
                        <Typography variant="body2">
                          {store.hours}
                        </Typography>
                      </Grid>
                    )}

                    {store.amenities && store.amenities.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Amenities
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {store.amenities.map((amenity, index) => (
                            <Chip key={index} label={amenity} variant="outlined" />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* User's Review */}
                  {userReview && (
                    <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Your Review
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={handleRateStore}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteRating(userReview.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating value={userReview.rating} readOnly size="small" />
                          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                            {formatDistanceToNow(new Date(userReview.createdAt))} ago
                          </Typography>
                        </Box>

                        {userReview.comment && (
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {userReview.comment}
                          </Typography>
                        )}

                        {userReview.images && userReview.images.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {userReview.images.map((image, index) => (
                              <img
                                key={index}
                                src={image.url}
                                alt={`Review ${index + 1}`}
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: 'cover',
                                  borderRadius: 8
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Other Reviews */}
                  {otherReviews.length > 0 ? (
                    <List>
                      {otherReviews.map((review, index) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem
                            alignItems="flex-start"
                            sx={{
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 2,
                              mb: 2
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={review.user?.avatar}>
                                {review.user?.name?.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {review.user?.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Rating value={review.rating} readOnly size="small" />
                                      <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(new Date(review.createdAt))} ago
                                      </Typography>
                                    </Box>
                                  </Box>
                                  
                                  {review.comment && review.comment.length > 200 && (
                                    <IconButton
                                      onClick={() => handleToggleReview(review.id)}
                                      size="small"
                                    >
                                      {expandedReviews.has(review.id) ? <CollapseIcon /> : <ExpandIcon />}
                                    </IconButton>
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  {review.comment && (
                                    <Collapse in={expandedReviews.has(review.id) || review.comment.length <= 200}>
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        {expandedReviews.has(review.id) ? 
                                          review.comment : 
                                          review.comment.length > 200 ? 
                                            `${review.comment.substring(0, 200)}...` : 
                                            review.comment
                                        }
                                      </Typography>
                                    </Collapse>
                                  )}

                                  {review.images && review.images.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                      {review.images.map((image, imgIndex) => (
                                        <img
                                          key={imgIndex}
                                          src={image.url}
                                          alt={`Review ${imgIndex + 1}`}
                                          style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            cursor: 'pointer'
                                          }}
                                          onClick={() => setImageDialogOpen(true)}
                                        />
                                      ))}
                                    </Box>
                                  )}

                                  {/* Review Actions */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                      size="small"
                                      startIcon={<LikeIcon />}
                                      onClick={() => handleLikeReview(review.id)}
                                      sx={{ color: review.isLiked ? 'primary.main' : 'text.secondary' }}
                                    >
                                      {review.likesCount || 0}
                                    </Button>
                                    
                                    <Button
                                      size="small"
                                      startIcon={<ReplyIcon />}
                                      sx={{ color: 'text.secondary' }}
                                    >
                                      Reply
                                    </Button>

                                    <Button
                                      size="small"
                                      color="error"
                                      onClick={() => setReportDialog({ open: true, reviewId: review.id })}
                                    >
                                      Report
                                    </Button>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No reviews yet
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Be the first to share your experience!
                      </Typography>
                    </Box>
                  )}
                </motion.div>
              )}

              {/* Contact Tab */}
              {activeTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <List>
                        {store.phone && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ backgroundColor: 'primary.light' }}>
                                <PhoneIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Phone"
                              secondary={
                                <Button
                                  href={`tel:${store.phone}`}
                                  sx={{ p: 0, justifyContent: 'flex-start' }}
                                >
                                  {store.phone}
                                </Button>
                              }
                            />
                          </ListItem>
                        )}

                        {store.email && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ backgroundColor: 'secondary.light' }}>
                                <EmailIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Email"
                              secondary={
                                <Button
                                  href={`mailto:${store.email}`}
                                  sx={{ p: 0, justifyContent: 'flex-start' }}
                                >
                                  {store.email}
                                </Button>
                              }
                            />
                          </ListItem>
                        )}

                        {store.website && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ backgroundColor: 'success.light' }}>
                                <WebsiteIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Website"
                              secondary={
                                <Button
                                  href={store.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ p: 0, justifyContent: 'flex-start' }}
                                >
                                  Visit Website
                                </Button>
                              }
                            />
                          </ListItem>
                        )}

                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: 'warning.light' }}>
                              <LocationIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Address"
                            secondary={store.address}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      {store.hours && (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Business Hours
                          </Typography>
                          <Typography variant="body2" component="pre" sx={{ lineHeight: 1.8 }}>
                            {store.hours}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </motion.div>
              )}

              {/* Map Tab */}
              {activeTab === 3 && store.location && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      height: 400,
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <MapIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Map Integration
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Implement your preferred map service here
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Box>

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        maxWidth="md"
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share your experience at {store.name}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
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
            label="Your Review (Optional)"
            multiline
            rows={4}
            fullWidth
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Tell others about your experience..."
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Add Photos (Optional):
          </Typography>
          <ImageUpload
            onUpload={(images) => setSelectedImages(prev => [...prev, ...images])}
            multiple
            maxFiles={5}
            preview
          />
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button
            onClick={() => setRatingDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRating}
            variant="contained"
            disabled={userRating === 0}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4
            }}
          >
            {userReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default StoreDetails;
