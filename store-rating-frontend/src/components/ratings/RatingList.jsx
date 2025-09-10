import React, { useState, useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  Avatar,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  Divider,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Pagination
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Reply as ReplyIcon,
  Report as ReportIcon,
  MoreVert as MoreIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { 
  likeRating, 
  dislikeRating, 
  reportRating, 
  replyToRating,
  deleteRating 
} from '../../store/ratingSlice';
import StarRating from './StarRating';
import LoadingSpinner from '../common/LoadingSpinner';

const RatingList = ({
  ratings = [],
  loading = false,
  showUserActions = true,
  showReplyOption = false,
  showReportOption = true,
  allowEdit = false,
  allowDelete = false,
  onEditRating,
  onDeleteRating,
  showPagination = true,
  itemsPerPage = 10,
  showFilters = true,
  showSorting = true
}) => {
  const [expandedRatings, setExpandedRatings] = useState(new Set());
  const [selectedRating, setSelectedRating] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportDialog, setReportDialog] = useState({ open: false, ratingId: null });
  const [replyDialog, setReplyDialog] = useState({ open: false, ratingId: null });
  const [reportReason, setReportReason] = useState('');
  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Filter and sort ratings
  const processedRatings = useMemo(() => {
    let filtered = [...ratings];

    // Apply filters
    switch (filterBy) {
      case 'verified':
        filtered = filtered.filter(rating => rating.user?.verified);
        break;
      case 'withPhotos':
        filtered = filtered.filter(rating => rating.images?.length > 0);
        break;
      case 'highRatings':
        filtered = filtered.filter(rating => rating.rating >= 4);
        break;
      case 'lowRatings':
        filtered = filtered.filter(rating => rating.rating <= 2);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [ratings, sortBy, filterBy]);

  // Paginate ratings
  const paginatedRatings = useMemo(() => {
    if (!showPagination) return processedRatings;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedRatings.slice(startIndex, endIndex);
  }, [processedRatings, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(processedRatings.length / itemsPerPage);

  const handleExpandRating = (ratingId) => {
    const newExpanded = new Set(expandedRatings);
    if (newExpanded.has(ratingId)) {
      newExpanded.delete(ratingId);
    } else {
      newExpanded.add(ratingId);
    }
    setExpandedRatings(newExpanded);
  };

  const handleMenuOpen = (event, rating) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRating(rating);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRating(null);
  };

  const handleLikeRating = async (ratingId, currentlyLiked) => {
    try {
      await dispatch(likeRating({ ratingId, action: currentlyLiked ? 'unlike' : 'like' })).unwrap();
    } catch (error) {
      console.error('Failed to like rating:', error);
    }
  };

  const handleReportRating = async () => {
    if (!reportReason.trim()) return;
    
    try {
      await dispatch(reportRating({
        ratingId: reportDialog.ratingId,
        reason: reportReason
      })).unwrap();
      
      setReportDialog({ open: false, ratingId: null });
      setReportReason('');
    } catch (error) {
      console.error('Failed to report rating:', error);
    }
  };

  const handleReplyToRating = async () => {
    if (!replyText.trim()) return;
    
    try {
      await dispatch(replyToRating({
        ratingId: replyDialog.ratingId,
        reply: replyText
      })).unwrap();
      
      setReplyDialog({ open: false, ratingId: null });
      setReplyText('');
    } catch (error) {
      console.error('Failed to reply to rating:', error);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        await dispatch(deleteRating(ratingId)).unwrap();
        if (onDeleteRating) {
          onDeleteRating(ratingId);
        }
      } catch (error) {
        console.error('Failed to delete rating:', error);
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
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
        <LoadingSpinner message="Loading ratings..." />
      </Box>
    );
  }

  if (ratings.length === 0) {
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
            border: '2px dashed',
            borderColor: 'divider',
            background: 'rgba(102, 126, 234, 0.02)'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            No Reviews Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Be the first to share your experience!
          </Typography>
        </Paper>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Filters and Sorting */}
      {(showFilters || showSorting) && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {paginatedRatings.length} of {processedRatings.length} reviews
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {showFilters && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filterBy}
                    onChange={(e) => {
                      setFilterBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    label="Filter"
                    startAdornment={<FilterIcon sx={{ fontSize: 16, mr: 1 }} />}
                  >
                    <MenuItem value="all">All Reviews</MenuItem>
                    <MenuItem value="verified">Verified Only</MenuItem>
                    <MenuItem value="withPhotos">With Photos</MenuItem>
                    <MenuItem value="highRatings">4+ Stars</MenuItem>
                    <MenuItem value="lowRatings">2- Stars</MenuItem>
                  </Select>
                </FormControl>
              )}

              {showSorting && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort"
                    startAdornment={<SortIcon sx={{ fontSize: 16, mr: 1 }} />}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="highest">Highest Rated</MenuItem>
                    <MenuItem value="lowest">Lowest Rated</MenuItem>
                    <MenuItem value="helpful">Most Helpful</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Ratings List */}
      <List sx={{ p: 0 }}>
        <AnimatePresence>
          {paginatedRatings.map((rating, index) => (
            <motion.div
              key={rating.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <Card
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: 4
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      <Avatar
                        src={rating.user?.avatar}
                        sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: '2px solid white',
                          boxShadow: 2
                        }}
                      >
                        {rating.user?.name?.charAt(0)}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {rating.user?.name}
                          </Typography>
                          
                          {rating.user?.verified && (
                            <Tooltip title="Verified User">
                              <VerifiedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            </Tooltip>
                          )}

                          {rating.recommend && (
                            <Chip
                              label="Recommends"
                              size="small"
                              color="success"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <StarRating value={rating.rating} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(rating.createdAt))} ago
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Menu */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, rating)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>

                  {/* Comment */}
                  {rating.comment && (
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        color: 'text.primary'
                      }}
                    >
                      {expandedRatings.has(rating.id) || rating.comment.length <= 200
                        ? rating.comment
                        : `${rating.comment.substring(0, 200)}...`}
                      
                      {rating.comment.length > 200 && (
                        <Button
                          size="small"
                          onClick={() => handleExpandRating(rating.id)}
                          sx={{ ml: 1, p: 0, minWidth: 'auto' }}
                        >
                          {expandedRatings.has(rating.id) ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </Typography>
                  )}

                  {/* Tags */}
                  {rating.tags && rating.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {rating.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', borderRadius: 2 }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Images */}
                  {rating.images && rating.images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {rating.images.slice(0, 4).map((image, imgIndex) => (
                        <motion.div
                          key={imgIndex}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={image.url}
                            alt={`Review ${imgIndex + 1}`}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 8,
                              cursor: 'pointer',
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        </motion.div>
                      ))}
                      {rating.images.length > 4 && (
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            +{rating.images.length - 4}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {showUserActions && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          onClick={() => handleLikeRating(rating.id, rating.isLiked)}
                          sx={{
                            color: rating.isLiked ? 'primary.main' : 'text.secondary',
                            minWidth: 'auto'
                          }}
                        >
                          {rating.likes || 0}
                        </Button>

                        {showReplyOption && (
                          <Button
                            size="small"
                            startIcon={<ReplyIcon />}
                            onClick={() => setReplyDialog({ open: true, ratingId: rating.id })}
                            sx={{ color: 'text.secondary' }}
                          >
                            Reply
                          </Button>
                        )}
                      </Box>
                    )}

                    <Typography variant="caption" color="text.disabled">
                      Review #{rating.id}
                    </Typography>
                  </Box>

                  {/* Replies */}
                  {rating.replies && rating.replies.length > 0 && (
                    <Collapse in={expandedRatings.has(rating.id)}>
                      <motion.div
                        variants={expandVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Replies ({rating.replies.length})
                        </Typography>
                        
                        {rating.replies.map((reply, replyIndex) => (
                          <Box key={replyIndex} sx={{ ml: 2, mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Avatar src={reply.user?.avatar} sx={{ width: 24, height: 24 }}>
                                {reply.user?.name?.charAt(0)}
                              </Avatar>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {reply.user?.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(new Date(reply.createdAt))} ago
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {reply.text}
                            </Typography>
                          </Box>
                        ))}
                      </motion.div>
                    </Collapse>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>

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
      >
        {allowEdit && selectedRating?.user?.id === user?.id && (
          <MenuItem
            onClick={() => {
              onEditRating(selectedRating);
              handleMenuClose();
            }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Edit Review
          </MenuItem>
        )}

        {allowDelete && selectedRating?.user?.id === user?.id && (
          <MenuItem
            onClick={() => {
              handleDeleteRating(selectedRating.id);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Review
          </MenuItem>
        )}

        {showReportOption && selectedRating?.user?.id !== user?.id && (
          <MenuItem
            onClick={() => {
              setReportDialog({ open: true, ratingId: selectedRating.id });
              handleMenuClose();
            }}
            sx={{ color: 'warning.main' }}
          >
            <FlagIcon sx={{ mr: 1 }} />
            Report Review
          </MenuItem>
        )}
      </Menu>

      {/* Report Dialog */}
      <Dialog
        open={reportDialog.open}
        onClose={() => setReportDialog({ open: false, ratingId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for reporting"
            fullWidth
            multiline
            rows={3}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Please explain why you're reporting this review..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialog({ open: false, ratingId: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleReportRating}
            disabled={!reportReason.trim()}
            color="warning"
          >
            Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialog.open}
        onClose={() => setReplyDialog({ open: false, ratingId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reply to Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your reply"
            fullWidth
            multiline
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a helpful reply..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog({ open: false, ratingId: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleReplyToRating}
            disabled={!replyText.trim()}
            variant="contained"
          >
            Reply
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default RatingList;
