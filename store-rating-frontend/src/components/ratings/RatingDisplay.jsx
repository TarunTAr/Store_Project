import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Grid,
  Divider,
  Badge
} from '@mui/material';
import {
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarBorder as StarBorderIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  ThumbUp as ThumbUpIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const RatingDisplay = ({
  rating = 0,
  totalRatings = 0,
  ratingDistribution = {},
  showDistribution = true,
  showTrend = false,
  previousRating = null,
  size = 'medium', // small, medium, large
  variant = 'detailed', // simple, detailed, compact
  interactive = false,
  onRatingClick,
  className = ''
}) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [animateValue, setAnimateValue] = useState(0);

  useEffect(() => {
    // Animate rating value on mount
    const timer = setTimeout(() => {
      setAnimateValue(rating);
    }, 500);
    return () => clearTimeout(timer);
  }, [rating]);

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#4caf50'; // Green
    if (rating >= 3.5) return '#8bc34a'; // Light Green
    if (rating >= 2.5) return '#ff9800'; // Orange
    if (rating >= 1.5) return '#ff5722'; // Deep Orange
    return '#f44336'; // Red
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Very Good';
    if (rating >= 2.5) return 'Good';
    if (rating >= 1.5) return 'Fair';
    return 'Poor';
  };

  const getTrendIcon = () => {
    if (!showTrend || !previousRating) return null;
    
    const difference = rating - previousRating;
    if (difference > 0.1) return <TrendingUpIcon sx={{ color: 'success.main' }} />;
    if (difference < -0.1) return <TrendingDownIcon sx={{ color: 'error.main' }} />;
    return <TrendingFlatIcon sx={{ color: 'warning.main' }} />;
  };

  const renderStars = (rating, size = 24, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      let StarComponent = StarBorderIcon;
      let color = 'action.disabled';
      
      if (i <= fullStars) {
        StarComponent = StarIcon;
        color = '#f59e0b';
      } else if (i === fullStars + 1 && hasHalfStar) {
        StarComponent = StarHalfIcon;
        color = '#f59e0b';
      }

      if (interactive && hoveredStar >= i) {
        StarComponent = StarIcon;
        color = '#fbbf24';
      }

      stars.push(
        <motion.div
          key={i}
          whileHover={{ scale: interactive ? 1.2 : 1 }}
          whileTap={{ scale: interactive ? 0.9 : 1 }}
          onHoverStart={() => interactive && setHoveredStar(i)}
          onHoverEnd={() => interactive && setHoveredStar(0)}
          onClick={() => interactive && onRatingClick && onRatingClick(i)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          <StarComponent
            sx={{
              fontSize: size,
              color,
              transition: 'all 0.2s ease',
              filter: interactive && hoveredStar >= i ? 'drop-shadow(0 0 8px #fbbf24)' : 'none'
            }}
          />
        </motion.div>
      );
    }
    
    return stars;
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const distributionVariants = {
    hidden: { width: 0 },
    visible: (percentage) => ({
      width: `${percentage}%`,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    })
  };

  if (variant === 'simple') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderStars(rating, size === 'small' ? 16 : size === 'large' ? 32 : 24, interactive)}
          </Box>
          
          <Typography
            variant={size === 'small' ? 'body2' : size === 'large' ? 'h6' : 'body1'}
            sx={{
              fontWeight: 600,
              color: getRatingColor(rating)
            }}
          >
            {animateValue.toFixed(1)}
          </Typography>
          
          {totalRatings > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 0.5 }}
            >
              ({totalRatings.toLocaleString()})
            </Typography>
          )}

          {getTrendIcon()}
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
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                {renderStars(rating, 20, interactive)}
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                {totalRatings.toLocaleString()} reviews
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: getRatingColor(rating),
                    background: `linear-gradient(45deg, ${getRatingColor(rating)}, ${getRatingColor(rating)}88)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {animateValue.toFixed(1)}
                </Typography>
              </motion.div>
              
              <Typography variant="caption" color="text.secondary">
                {getRatingText(rating)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    );
  }

  // Detailed variant (default)
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${getRatingColor(rating)}22 0%, ${getRatingColor(rating)}11 100%)`,
            p: 3,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `conic-gradient(${getRatingColor(rating)} ${(animateValue / 5) * 360}deg, #e0e0e0 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: getRatingColor(rating),
                        lineHeight: 1
                      }}
                    >
                      {animateValue.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs>
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {renderStars(rating, 28, interactive)}
                  {getTrendIcon() && (
                    <Box sx={{ ml: 1 }}>
                      {getTrendIcon()}
                    </Box>
                  )}
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {getRatingText(rating)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Based on {totalRatings.toLocaleString()} reviews
                </Typography>
              </motion.div>
            </Grid>

            <Grid item>
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip
                    label={`${Math.round((rating / 5) * 100)}%`}
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${getRatingColor(rating)} 0%, ${getRatingColor(rating)}88 100%)`,
                      color: 'white'
                    }}
                  />
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    Satisfaction
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Rating Distribution */}
        {showDistribution && Object.keys(ratingDistribution).length > 0 && (
          <CardContent sx={{ pt: 3 }}>
            <motion.div variants={itemVariants}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Rating Distribution
              </Typography>
              
              <Box sx={{ space: 2 }}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars] || 0;
                  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                  
                  return (
                    <Box key={stars} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                        <Typography variant="body2" sx={{ mr: 0.5 }}>
                          {stars}
                        </Typography>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                      </Box>
                      
                      <Box
                        sx={{
                          flex: 1,
                          height: 8,
                          backgroundColor: 'grey.200',
                          borderRadius: 4,
                          mx: 2,
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <motion.div
                          variants={distributionVariants}
                          initial="hidden"
                          animate="visible"
                          custom={percentage}
                          style={{
                            height: '100%',
                            background: `linear-gradient(135deg, ${getRatingColor(stars)} 0%, ${getRatingColor(stars)}88 100%)`,
                            borderRadius: 4
                          }}
                        />
                      </Box>
                      
                      <Typography
                        variant="body2"
                        sx={{ minWidth: 40, textAlign: 'right', color: 'text.secondary' }}
                      >
                        {count}
                      </Typography>
                      
                      <Typography
                        variant="caption"
                        sx={{ minWidth: 35, textAlign: 'right', color: 'text.disabled', ml: 1 }}
                      >
                        {percentage.toFixed(0)}%
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </motion.div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default RatingDisplay;
