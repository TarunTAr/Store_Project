import React, { forwardRef, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SlideIn = forwardRef(({
  children,
  direction = 'left', // left, right, up, down, topLeft, topRight, bottomLeft, bottomRight
  delay = 0,
  duration = 0.6,
  distance = 100,
  easing = "easeOut",
  threshold = 0.1,
  triggerOnce = true,
  staggerChildren = 0.1,
  viewport = { once: true, amount: 0.1 },
  className = '',
  style = {},
  onAnimationStart,
  onAnimationComplete,
  disabled = false,
  variant = 'default', // default, smooth, bounce, elastic, overshoot
  overshoot = 1.05,
  ...props
}, ref) => {
  const localRef = useRef(null);
  const targetRef = ref || localRef;
  const isInView = useInView(targetRef, viewport);

  // Calculate slide direction coordinates
  const getDirectionOffset = (dir, dist) => {
    const directions = {
      left: { x: -dist, y: 0 },
      right: { x: dist, y: 0 },
      up: { x: 0, y: -dist },
      down: { x: 0, y: dist },
      topLeft: { x: -dist * 0.7, y: -dist * 0.7 },
      topRight: { x: dist * 0.7, y: -dist * 0.7 },
      bottomLeft: { x: -dist * 0.7, y: dist * 0.7 },
      bottomRight: { x: dist * 0.7, y: dist * 0.7 }
    };
    return directions[dir] || directions.left;
  };

  const offset = getDirectionOffset(direction, distance);

  // Animation variants for different effects
  const variants = {
    default: {
      hidden: {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: 0.95
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: easing,
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    smooth: {
      hidden: {
        opacity: 0,
        x: offset.x * 0.5,
        y: offset.y * 0.5,
        scale: 0.98
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: duration * 1.2,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    bounce: {
      hidden: {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: 0.8
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          type: "spring",
          stiffness: 200,
          damping: 20,
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    elastic: {
      hidden: {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: 0.9
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          type: "spring",
          stiffness: 100,
          damping: 15,
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    overshoot: {
      hidden: {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: 0.9
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: [0.9, overshoot, 1],
        transition: {
          duration: duration * 1.3,
          delay,
          times: [0, 0.6, 1],
          ease: "easeOut",
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    }
  };

  // Child item variants for stagger effect
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: offset.x * 0.3,
      y: offset.y * 0.3,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: duration * 0.8,
        ease: easing
      }
    }
  };

  if (disabled) {
    return (
      <div ref={targetRef} className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={targetRef}
      className={className}
      style={style}
      variants={variants[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      {...props}
    >
      {/* If children is an array, apply stagger effect */}
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
            >
              {child}
            </motion.div>
          ))
        : children
      }
    </motion.div>
  );
});

// Carousel-style slide in
export const CarouselSlideIn = ({ 
  children, 
  direction = 'left',
  interval = 0.3,
  className = '',
  ...slideProps 
}) => (
  <div className={`carousel-slide-container ${className}`}>
    {React.Children.map(children, (child, index) => (
      <SlideIn
        key={index}
        direction={direction}
        delay={(slideProps.delay || 0) + (index * interval)}
        {...slideProps}
      >
        {child}
      </SlideIn>
    ))}
  </div>
);

// Multi-directional slide in
export const MultiDirectionSlideIn = ({ 
  children, 
  directions = ['left', 'right'],
  className = '',
  ...slideProps 
}) => (
  <div className={`multi-direction-slide ${className}`}>
    {React.Children.map(children, (child, index) => (
      <SlideIn
        key={index}
        direction={directions[index % directions.length]}
        delay={(slideProps.delay || 0) + (index * (slideProps.staggerChildren || 0.1))}
        {...slideProps}
      >
        {child}
      </SlideIn>
    ))}
  </div>
);

// Slide in with reveal effect
export const RevealSlideIn = ({ 
  children,
  direction = 'left',
  revealColor = '#667eea',
  className = '',
  ...slideProps
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, slideProps.viewport || { once: true });

  return (
    <div 
      ref={ref} 
      className={`reveal-slide-container ${className}`}
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        ...slideProps.style 
      }}
    >
      {/* Reveal overlay */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: revealColor,
          zIndex: 1
        }}
        initial={{ 
          x: direction === 'right' ? '-100%' : direction === 'left' ? '100%' : 0,
          y: direction === 'down' ? '-100%' : direction === 'up' ? '100%' : 0
        }}
        animate={isInView ? {
          x: direction === 'right' ? '100%' : direction === 'left' ? '-100%' : 0,
          y: direction === 'down' ? '100%' : direction === 'up' ? '-100%' : 0
        } : {}}
        transition={{
          duration: slideProps.duration || 0.6,
          delay: slideProps.delay || 0,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <SlideIn
        direction={direction}
        delay={(slideProps.delay || 0) + 0.2}
        {...slideProps}
      >
        {children}
      </SlideIn>
    </div>
  );
};

// Slide in from viewport edges
export const ViewportSlideIn = ({ 
  children,
  edge = 'left', // left, right, top, bottom
  className = '',
  ...slideProps
}) => {
  const directions = {
    left: 'left',
    right: 'right', 
    top: 'up',
    bottom: 'down'
  };

  return (
    <SlideIn
      direction={directions[edge]}
      distance={slideProps.distance || 150}
      viewport={{ 
        once: slideProps.triggerOnce !== false,
        margin: edge === 'left' ? '0px -100px 0px 0px' :
                edge === 'right' ? '0px 0px 0px -100px' :
                edge === 'top' ? '-100px 0px 0px 0px' :
                '0px 0px -100px 0px'
      }}
      className={`viewport-slide-${edge} ${className}`}
      {...slideProps}
    >
      {children}
    </SlideIn>
  );
};

// Zigzag slide in pattern
export const ZigzagSlideIn = ({ 
  children,
  className = '',
  ...slideProps
}) => {
  const directions = ['left', 'right'];

  return (
    <div className={`zigzag-slide-container ${className}`}>
      {React.Children.map(children, (child, index) => (
        <SlideIn
          key={index}
          direction={directions[index % 2]}
          delay={(slideProps.delay || 0) + (index * (slideProps.staggerChildren || 0.2))}
          {...slideProps}
        >
          {child}
        </SlideIn>
      ))}
    </div>
  );
};

SlideIn.displayName = 'SlideIn';

export default SlideIn;
