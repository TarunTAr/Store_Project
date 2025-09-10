import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const AnimatedCounter = ({
  value = 0,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimal = 0,
  startValue = 0,
  formatter = null,
  variant = 'h4',
  color = 'primary',
  size = 'medium',
  showPlusSign = false,
  animateOnMount = true,
  threshold = 0.3,
  ...typographyProps
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(startValue);
  const springValue = useSpring(motionValue, { 
    duration: duration * 1000,
    bounce: 0.25 
  });
  
  const [displayValue, setDisplayValue] = useState(startValue);
  const [hasAnimated, setHasAnimated] = useState(!animateOnMount);

  useEffect(() => {
    springValue.onChange((latest) => {
      let formattedValue = latest;
      
      if (formatter) {
        formattedValue = formatter(latest);
      } else {
        formattedValue = latest.toFixed(decimal);
        
        // Add thousands separators
        if (decimal === 0) {
          formattedValue = Math.floor(latest).toLocaleString();
        } else {
          const parts = formattedValue.split('.');
          parts[0] = parseInt(parts[0]).toLocaleString();
          formattedValue = parts.join('.');
        }
      }
      
      setDisplayValue(formattedValue);
    });
  }, [springValue, decimal, formatter]);

  useEffect(() => {
    if ((isInView || !animateOnMount) && !hasAnimated) {
      setTimeout(() => {
        motionValue.set(value);
        setHasAnimated(true);
      }, delay * 1000);
    }
  }, [isInView, value, delay, motionValue, animateOnMount, hasAnimated]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: '1.25rem',
          fontWeight: 600
        };
      case 'large':
        return {
          fontSize: '3rem',
          fontWeight: 700
        };
      case 'xl':
        return {
          fontSize: '4rem',
          fontWeight: 800
        };
      default:
        return {
          fontSize: '2rem',
          fontWeight: 700
        };
    }
  };

  const getColorStyles = () => {
    const baseStyles = {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };

    switch (color) {
      case 'success':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };
      case 'warning':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };
      case 'inherit':
        return {};
      default:
        return baseStyles;
    }
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const digitVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView || !animateOnMount ? "visible" : "hidden"}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 0.5
        }}
      >
        {/* Prefix */}
        {prefix && (
          <Typography
            variant={variant}
            sx={{
              ...getSizeStyles(),
              ...getColorStyles(),
              opacity: 0.8
            }}
            {...typographyProps}
          >
            {prefix}
          </Typography>
        )}

        {/* Plus sign for positive numbers */}
        {showPlusSign && value > 0 && (
          <motion.div
            variants={digitVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant={variant}
              sx={{
                ...getSizeStyles(),
                ...getColorStyles(),
                opacity: 0.8
              }}
              {...typographyProps}
            >
              +
            </Typography>
          </motion.div>
        )}

        {/* Main counter value */}
        <motion.div
          variants={pulseVariants}
          animate={hasAnimated ? "pulse" : ""}
        >
          <Typography
            variant={variant}
            component="span"
            sx={{
              ...getSizeStyles(),
              ...getColorStyles(),
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em'
            }}
            {...typographyProps}
          >
            {displayValue}
          </Typography>
        </motion.div>

        {/* Suffix */}
        {suffix && (
          <Typography
            variant={variant}
            sx={{
              ...getSizeStyles(),
              ...getColorStyles(),
              opacity: 0.8,
              fontSize: `${parseFloat(getSizeStyles().fontSize) * 0.7}rem`
            }}
            {...typographyProps}
          >
            {suffix}
          </Typography>
        )}
      </Box>

      {/* Animated underline */}
      <motion.div
        style={{
          height: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          marginTop: 8,
          originX: 0
        }}
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: hasAnimated ? 1 : 0,
          transition: { 
            duration: duration * 0.8, 
            delay: delay + 0.5,
            ease: "easeOut"
          }
        }}
      />
    </motion.div>
  );
};

// Preset counter components
export const StatCounter = ({ label, value, ...props }) => (
  <Box sx={{ textAlign: 'center' }}>
    <AnimatedCounter value={value} {...props} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      {label}
    </Typography>
  </Box>
);

export const PercentageCounter = ({ value, ...props }) => (
  <AnimatedCounter 
    value={value} 
    suffix="%" 
    decimal={1}
    color="success"
    {...props} 
  />
);

export const CurrencyCounter = ({ value, currency = '$', ...props }) => (
  <AnimatedCounter 
    value={value} 
    prefix={currency}
    decimal={2}
    formatter={(val) => val.toFixed(2)}
    {...props} 
  />
);

export const ScoreCounter = ({ value, maxValue = 5, ...props }) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
    <AnimatedCounter 
      value={value} 
      decimal={1}
      color="warning"
      {...props} 
    />
    <Typography variant="h6" color="text.secondary">
      / {maxValue}
    </Typography>
  </Box>
);

export default AnimatedCounter;
