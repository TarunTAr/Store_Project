import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const StarRating = ({
  value = 0,
  onChange,
  max = 5,
  precision = 1, // 1 = whole numbers, 0.5 = half stars, 0.1 = decimal
  size = 'medium', // small, medium, large, xl
  color = '#f59e0b',
  hoverColor = '#fbbf24',
  emptyColor = '#e5e7eb',
  readOnly = false,
  showValue = false,
  showTooltip = true,
  animated = true,
  orientation = 'horizontal', // horizontal, vertical
  spacing = 1,
  className = '',
  labels = [], // Optional labels for each rating
  onHover,
  onLeave
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const getStarSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 32;
      case 'xl': return 48;
      default: return 24;
    }
  };

  const getRoundedValue = (val) => {
    if (precision === 1) return Math.round(val);
    if (precision === 0.5) return Math.round(val * 2) / 2;
    return Math.round(val * 10) / 10;
  };

  const handleStarClick = (starIndex) => {
    if (readOnly) return;
    
    const newValue = getRoundedValue(starIndex);
    setInternalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleStarHover = (starIndex) => {
    if (readOnly) return;
    
    const roundedValue = getRoundedValue(starIndex);
    setHoveredRating(roundedValue);
    
    if (onHover) {
      onHover(roundedValue);
    }
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    
    setHoveredRating(0);
    
    if (onLeave) {
      onLeave();
    }
  };

  const getStarColor = (starIndex) => {
    const currentValue = hoveredRating || internalValue;
    
    if (starIndex <= currentValue) {
      return hoveredRating ? hoverColor : color;
    }
    
    // Handle half stars for display
    if (precision === 0.5 && starIndex - 0.5 <= currentValue) {
      return hoveredRating ? hoverColor : color;
    }
    
    return emptyColor;
  };

  const getStarComponent = (starIndex) => {
    const currentValue = hoveredRating || internalValue;
    
    if (starIndex <= Math.floor(currentValue)) {
      return StarIcon;
    }
    
    if (precision === 0.5 && starIndex - 0.5 === currentValue) {
      return StarHalfIcon;
    }
    
    return StarBorderIcon;
  };

  const getTooltipText = (starIndex) => {
    if (labels && labels[starIndex - 1]) {
      return labels[starIndex - 1];
    }
    
    return `${starIndex} star${starIndex > 1 ? 's' : ''}`;
  };

  const starVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180,
      opacity: 0 
    },
    visible: (i) => ({
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        delay: animated ? i * 0.1 : 0,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }),
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.1 }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0.8, 1.5, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= max; i++) {
      const StarComponent = getStarComponent(i);
      const starColor = getStarColor(i);
      const isActive = hoveredRating >= i || internalValue >= i;
      
      stars.push(
        <motion.div
          key={i}
          custom={i - 1}
          variants={starVariants}
          initial="hidden"
          animate="visible"
          whileHover={!readOnly ? "hover" : {}}
          whileTap={!readOnly ? "tap" : {}}
          style={{
            position: 'relative',
            display: 'inline-block',
            cursor: readOnly ? 'default' : 'pointer'
          }}
        >
          <Tooltip
            title={showTooltip ? getTooltipText(i) : ''}
            placement="top"
            arrow
            disabled={!showTooltip}
          >
            <IconButton
              size="small"
              onClick={() => handleStarClick(i)}
              onMouseEnter={() => handleStarHover(i)}
              disabled={readOnly}
              sx={{
                p: spacing / 2,
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <StarComponent
                sx={{
                  fontSize: getStarSize(),
                  color: starColor,
                  transition: 'all 0.2s ease',
                  filter: isActive && !readOnly ? `drop-shadow(0 0 8px ${starColor})` : 'none'
                }}
              />
              
              {/* Glow effect for active stars */}
              {isActive && animated && !readOnly && (
                <motion.div
                  variants={glowVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                  }}
                >
                  <StarIcon
                    sx={{
                      fontSize: getStarSize(),
                      color: starColor,
                      opacity: 0.3
                    }}
                  />
                </motion.div>
              )}
            </IconButton>
          </Tooltip>
        </motion.div>
      );
    }
    
    return stars;
  };

  return (
    <Box
      className={className}
      onMouseLeave={handleMouseLeave}
      sx={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        gap: spacing / 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          alignItems: 'center'
        }}
      >
        <AnimatePresence>
          {renderStars()}
        </AnimatePresence>
      </Box>
      
      {showValue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography
            variant={size === 'small' ? 'caption' : size === 'large' ? 'h6' : 'body2'}
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              ml: orientation === 'horizontal' ? 1 : 0,
              mt: orientation === 'vertical' ? 1 : 0
            }}
          >
            {(hoveredRating || internalValue).toFixed(precision === 1 ? 0 : 1)}
          </Typography>
        </motion.div>
      )}
      
      {/* Rating label */}
      {labels && (hoveredRating || internalValue) > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                ml: orientation === 'horizontal' ? 1 : 0,
                mt: orientation === 'vertical' ? 0.5 : 0,
                fontStyle: 'italic'
              }}
            >
              {labels[Math.ceil((hoveredRating || internalValue)) - 1]}
            </Typography>
          </motion.div>
        </AnimatePresence>
      )}
    </Box>
  );
};

// Preset configurations
export const CompactStarRating = (props) => (
  <StarRating
    size="small"
    showValue={false}
    showTooltip={false}
    animated={false}
    spacing={0.5}
    {...props}
  />
);

export const LargeStarRating = (props) => (
  <StarRating
    size="large"
    showValue={true}
    precision={0.5}
    animated={true}
    spacing={2}
    {...props}
  />
);

export const ReviewStarRating = (props) => (
  <StarRating
    size="medium"
    precision={1}
    showValue={true}
    labels={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
    {...props}
  />
);

export const DisplayStarRating = (props) => (
  <StarRating
    readOnly={true}
    size="small"
    showValue={false}
    animated={false}
    showTooltip={false}
    spacing={0.5}
    {...props}
  />
);

export default StarRating;
