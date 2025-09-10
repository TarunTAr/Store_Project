import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Box,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Badge,
  Collapse,
  Divider
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Verified as VerifiedIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Photo as PhotoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import StarRating from './StarRating';

const RatingCard = ({
  rating = {},
  variant = 'default', // default, compact, detailed, minimal
  showActions = true,
  showStore = false,
  onLike,
  onShare,
  onComment,
  onExpand,
  interactive = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(rating.isLiked || false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(rating.id, !isLiked);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(rating);
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) {
      onExpand(rating.id, !isExpanded);
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
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
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
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  if (variant === 'minimal') {
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
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar
                src={rating.user?.avatar}
                sx={{ width: 24, height: 24 }}
              >
                {rating.user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {rating.user?.name}
              </Typography>
              <StarRating value={rating.rating} readOnly size="small" />
            </Box>
            
            {rating.comment && (
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4
                }}
              >
                {rating.comment}
              </Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar
                src={rating.user?.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {rating.user?.name?.charAt(0)}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {rating.user?.name}
                  </Typography>
                  {rating.user?.verified && (
                    <VerifiedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarRating value={rating.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(rating.createdAt))} ago
                  </Typography>
                </Box>
              </Box>
            </Box>

            {rating.comment && (
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.5
                }}
              >
                {rating.comment}
              </Typography>
            )}

            {showActions && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={handleLike}>
                    {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton size="small" onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="caption" color="text.disabled">
                  {rating.likes || 0} likes
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
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
          borderColor: isHovered ? 'primary.main' : 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)`,
            p: 3,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <motion.div
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  rating.user?.verified && (
                    <VerifiedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                  )
                }
              >
                <Avatar
                  src={rating.user?.avatar}
                  sx={{
                    width: 56,
                    height: 56,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: '3px solid white',
                    boxShadow: 3
                  }}
                >
                  {rating.user?.name?.charAt(0)}
                </Avatar>
              </Badge>
            </motion.div>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {rating.user?.name}
                </Typography>
                
                {showActions && (
                  <IconButton size="small">
                    <MoreIcon />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <StarRating value={rating.rating} readOnly size="medium" />
                <Chip
                  label={rating.rating === 5 ? 'Excellent' : rating.rating >= 4 ? 'Very Good' : rating.rating >= 3 ? 'Good' : rating.rating >= 2 ? 'Fair' : 'Poor'}
                  size="small"
                  color="primary"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(rating.createdAt))} ago
                {showStore && rating.store && (
                  <>
                    {' • '}
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <StoreIcon sx={{ fontSize: 12 }} />
                      {rating.store.name}
                    </Box>
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Main Comment */}
          {rating.comment && (
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                color: 'text.primary'
              }}
            >
              {isExpanded || rating.comment.length <= 200
                ? rating.comment
                : `${rating.comment.substring(0, 200)}...`}
              
              {rating.comment.length > 200 && (
                <Button
                  size="small"
                  onClick={handleExpand}
                  sx={{ ml: 1, p: 0, minWidth: 'auto', fontSize: '0.875rem' }}
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </Button>
              )}
            </Typography>
          )}

          {/* Tags */}
          {rating.tags && rating.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              <AnimatePresence>
                {rating.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Chip
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        borderRadius: 2,
                        borderColor: 'primary.main',
                        color: 'primary.main'
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          )}

          {/* Images */}
          {rating.images && rating.images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {rating.images.slice(0, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, zIndex: 1 }}
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
                        borderColor: 'divider',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Review ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      
                      {index === 3 && rating.images.length > 4 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                            +{rating.images.length - 3}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          )}

          {/* Expandable Content */}
          <Collapse in={isExpanded}>
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <Divider sx={{ my: 2 }} />
              
              {/* Additional Details */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Visit Date
                  </Typography>
                  <Typography variant="body2">
                    {rating.visitDate ? new Date(rating.visitDate).toLocaleDateString() : 'Not specified'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Recommendation
                  </Typography>
                  <Typography variant="body2" sx={{ color: rating.recommend ? 'success.main' : 'error.main' }}>
                    {rating.recommend ? 'Recommends' : 'Does not recommend'}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Collapse>
        </CardContent>

        {/* Actions */}
        {showActions && (
          <CardActions sx={{ px: 3, py: 2, backgroundColor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <motion.div
                  custom={0}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                    <IconButton
                      size="small"
                      onClick={handleLike}
                      sx={{
                        color: isLiked ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: isLiked ? 'error.light' : 'action.hover'
                        }
                      }}
                    >
                      <Badge badgeContent={rating.likes || 0} color="primary" max={99}>
                        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Tooltip title="Comment">
                    <IconButton
                      size="small"
                      onClick={onComment}
                      sx={{ color: 'text.secondary' }}
                    >
                      <Badge badgeContent={rating.comments?.length || 0} color="primary" max={99}>
                        <CommentIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </motion.div>

                <motion.div
                  custom={2}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Tooltip title="Share">
                    <IconButton
                      size="small"
                      onClick={handleShare}
                      sx={{ color: 'text.secondary' }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </Box>

              <Button
                size="small"
                onClick={handleExpand}
                endIcon={isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                sx={{
                  color: 'primary.main',
                  fontSize: '0.75rem'
                }}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </Box>
          </CardActions>
        )}
      </Card>
    </motion.div>
  );
};

export default RatingCard;
