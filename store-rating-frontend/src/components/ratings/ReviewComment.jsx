import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Reply as ReplyIcon,
  MoreVert as MoreIcon,
  Flag as FlagIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Star as StarIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { 
  likeComment, 
  dislikeComment, 
  replyToComment, 
  reportComment,
  deleteComment,
  editComment 
} from '../../store/ratingSlice';
import StarRating from './StarRating';

const ReviewComment = ({
  comment = {},
  showActions = true,
  showReplyButton = true,
  showRating = true,
  showImages = true,
  allowEdit = false,
  allowDelete = false,
  nested = false,
  onReply,
  onEdit,
  onDelete,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [replyDialog, setReplyDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState(comment.text || '');
  const [reportReason, setReportReason] = useState('');
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [disliked, setDisliked] = useState(comment.isDisliked || false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    try {
      setLiked(!liked);
      if (disliked) setDisliked(false);
      await dispatch(likeComment({ 
        commentId: comment.id, 
        action: liked ? 'unlike' : 'like' 
      })).unwrap();
    } catch (error) {
      console.error('Failed to like comment:', error);
      setLiked(liked); // Revert on error
    }
  };

  const handleDislike = async () => {
    try {
      setDisliked(!disliked);
      if (liked) setLiked(false);
      await dispatch(dislikeComment({ 
        commentId: comment.id, 
        action: disliked ? 'undislike' : 'dislike' 
      })).unwrap();
    } catch (error) {
      console.error('Failed to dislike comment:', error);
      setDisliked(disliked); // Revert on error
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    try {
      await dispatch(replyToComment({
        commentId: comment.id,
        text: replyText
      })).unwrap();
      
      setReplyDialog(false);
      setReplyText('');
      
      if (onReply) {
        onReply(comment.id, replyText);
      }
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    
    try {
      await dispatch(editComment({
        commentId: comment.id,
        text: editText
      })).unwrap();
      
      setEditDialog(false);
      
      if (onEdit) {
        onEdit(comment.id, editText);
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(comment.id)).unwrap();
        
        if (onDelete) {
          onDelete(comment.id);
        }
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    
    try {
      await dispatch(reportComment({
        commentId: comment.id,
        reason: reportReason
      })).unwrap();
      
      setReportDialog(false);
      setReportReason('');
    } catch (error) {
      console.error('Failed to report comment:', error);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/reviews/${comment.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Review by ${comment.user?.name}`,
        text: comment.text,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  const actionVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.2
      }
    })
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={className}
      >
        <Box
          sx={{
            p: nested ? 2 : 3,
            border: nested ? 'none' : '1px solid',
            borderColor: 'divider',
            borderRadius: nested ? 1 : 3,
            backgroundColor: nested ? 'grey.50' : 'background.paper',
            ml: nested ? 4 : 0,
            position: 'relative',
            '&:hover': {
              backgroundColor: nested ? 'grey.100' : 'action.hover'
            },
            transition: 'all 0.2s ease'
          }}
        >
          {/* Main Comment Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              src={comment.user?.avatar}
              sx={{
                width: nested ? 32 : 40,
                height: nested ? 32 : 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {comment.user?.name?.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              {/* User Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant={nested ? 'body2' : 'subtitle1'} sx={{ fontWeight: 600 }}>
                  {comment.user?.name}
                </Typography>
                
                {comment.user?.verified && (
                  <Tooltip title="Verified User">
                    <VerifiedIcon sx={{ fontSize: nested ? 14 : 16, color: 'primary.main' }} />
                  </Tooltip>
                )}

                {comment.user?.badge && (
                  <Chip
                    label={comment.user.badge}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.6rem', height: 18 }}
                  />
                )}

                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </Typography>

                {comment.edited && (
                  <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                    (edited)
                  </Typography>
                )}
              </Box>

              {/* Rating */}
              {showRating && comment.rating && (
                <Box sx={{ mb: 1 }}>
                  <StarRating 
                    value={comment.rating} 
                    readOnly 
                    size={nested ? 'small' : 'medium'}
                  />
                </Box>
              )}
            </Box>

            {/* Menu Button */}
            {showActions && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ alignSelf: 'flex-start' }}
              >
                <MoreIcon />
              </IconButton>
            )}
          </Box>

          {/* Comment Text */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                color: 'text.primary',
                whiteSpace: 'pre-wrap'
              }}
            >
              {expanded || comment.text.length <= 300
                ? comment.text
                : `${comment.text.substring(0, 300)}...`}
            </Typography>
            
            {comment.text.length > 300 && (
              <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ mt: 1, p: 0, minWidth: 'auto' }}
              >
                {expanded ? 'Show less' : 'Read more'}
              </Button>
            )}
          </Box>

          {/* Images */}
          {showImages && comment.images && comment.images.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {comment.images.slice(0, 3).map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Comment ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
              
              {comment.images.length > 3 && (
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
                  <Typography variant="caption">
                    +{comment.images.length - 3}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Actions */}
          {showActions && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <motion.div
                  custom={0}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="small"
                    startIcon={<ThumbUpIcon />}
                    onClick={handleLike}
                    sx={{
                      color: liked ? 'primary.main' : 'text.secondary',
                      minWidth: 'auto',
                      px: 1
                    }}
                  >
                    {comment.likes || 0}
                  </Button>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="small"
                    startIcon={<ThumbDownIcon />}
                    onClick={handleDislike}
                    sx={{
                      color: disliked ? 'error.main' : 'text.secondary',
                      minWidth: 'auto',
                      px: 1
                    }}
                  >
                    {comment.dislikes || 0}
                  </Button>
                </motion.div>

                {showReplyButton && !nested && (
                  <motion.div
                    custom={2}
                    variants={actionVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="small"
                      startIcon={<ReplyIcon />}
                      onClick={() => setReplyDialog(true)}
                      sx={{ color: 'text.secondary' }}
                    >
                      Reply
                    </Button>
                  </motion.div>
                )}
              </Box>

              {/* Show Replies Button */}
              {comment.replies && comment.replies.length > 0 && (
                <Button
                  size="small"
                  onClick={() => setShowReplies(!showReplies)}
                  endIcon={showReplies ? <CollapseIcon /> : <ExpandIcon />}
                  sx={{ color: 'primary.main' }}
                >
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
                </Button>
              )}
            </Box>
          )}

          {/* Replies */}
          <Collapse in={showReplies}>
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                {comment.replies?.map((reply) => (
                  <ReviewComment
                    key={reply.id}
                    comment={reply}
                    nested
                    showReplyButton={false}
                    showRating={false}
                  />
                ))}
              </Box>
            </motion.div>
          </Collapse>
        </Box>
      </motion.div>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {allowEdit && comment.user?.id === user?.id && (
          <MenuItem onClick={() => { setEditDialog(true); handleMenuClose(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Comment</ListItemText>
          </MenuItem>
        )}

        {allowDelete && comment.user?.id === user?.id && (
          <MenuItem onClick={() => { handleDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Comment</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => { handleShare(); handleMenuClose(); }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share Comment</ListItemText>
        </MenuItem>

        {comment.user?.id !== user?.id && (
          <MenuItem onClick={() => { setReportDialog(true); handleMenuClose(); }} sx={{ color: 'warning.main' }}>
            <ListItemIcon>
              <FlagIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Report Comment</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Reply Dialog */}
      <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to Comment</DialogTitle>
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
            placeholder="Write a thoughtful reply..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
          <Button onClick={handleReply} disabled={!replyText.trim()} variant="contained">
            Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEdit} disabled={!editText.trim()} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialog} onClose={() => setReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Comment</DialogTitle>
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
            placeholder="Please explain why you're reporting this comment..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialog(false)}>Cancel</Button>
          <Button onClick={handleReport} disabled={!reportReason.trim()} color="warning">
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewComment;
