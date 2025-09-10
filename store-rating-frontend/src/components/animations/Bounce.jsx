import React, { forwardRef, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const Bounce = forwardRef(({
  children,
  delay = 0,
  duration = 0.6,
  intensity = 1,
  direction = 'up', // up, down, left, right, scale, rotate
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
  variant = 'default', // default, gentle, energetic, rubber, spring, jello
  repeat = false,
  repeatDelay = 1,
  ...props
}, ref) => {
  const localRef = useRef(null);
  const targetRef = ref || localRef;
  const isInView = useInView(targetRef, viewport);
  const controls = useAnimation();

  // Bounce intensity multiplier
  const bounceDistance = 30 * intensity;
  const scaleIntensity = 0.1 * intensity;

  // Animation variants for different bounce effects
  const variants = {
    default: {
      hidden: {
        opacity: 0,
        y: direction === 'up' ? bounceDistance : direction === 'down' ? -bounceDistance : 0,
        x: direction === 'left' ? bounceDistance : direction === 'right' ? -bounceDistance : 0,
        scale: direction === 'scale' ? 1 - scaleIntensity : 1,
        rotate: direction === 'rotate' ? -10 * intensity : 0
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        transition: {
          duration,
          delay,
          type: "spring",
          stiffness: 200,
          damping: 20,
          when: "beforeChildren",
          staggerChildren: staggerChildren,
          ...(repeat && {
            repeat: Infinity,
            repeatDelay,
            repeatType: "reverse"
          })
        }
      }
    },
    gentle: {
      hidden: {
        opacity: 0,
        y: direction === 'up' ? bounceDistance * 0.5 : direction === 'down' ? -bounceDistance * 0.5 : 0,
        x: direction === 'left' ? bounceDistance * 0.5 : direction === 'right' ? -bounceDistance * 0.5 : 0,
        scale: direction === 'scale' ? 1 - scaleIntensity * 0.5 : 0.98
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: duration * 1.2,
          delay,
          type: "spring",
          stiffness: 100,
          damping: 25,
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    energetic: {
      hidden: {
        opacity: 0,
        y: direction === 'up' ? bounceDistance * 1.5 : direction === 'down' ? -bounceDistance * 1.5 : 0,
        x: direction === 'left' ? bounceDistance * 1.5 : direction === 'right' ? -bounceDistance * 1.5 : 0,
        scale: direction === 'scale' ? 1 - scaleIntensity * 1.5 : 0.8,
        rotate: direction === 'rotate' ? -20 * intensity : 0
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        transition: {
          duration: duration * 0.8,
          delay,
          type: "spring",
          stiffness: 300,
          damping: 15,
          when: "beforeChildren",
          staggerChildren: staggerChildren * 0.7
        }
      }
    },
    rubber: {
      hidden: {
        opacity: 0,
        scale: 0.3,
        rotate: direction === 'rotate' ? 180 : 0
      },
      visible: {
        opacity: 1,
        scale: [0.3, 1.2, 0.9, 1.1, 1],
        rotate: 0,
        transition: {
          duration: duration * 1.5,
          delay,
          times: [0, 0.3, 0.6, 0.8, 1],
          ease: "easeOut",
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    spring: {
      hidden: {
        opacity: 0,
        y: direction === 'up' ? bounceDistance : direction === 'down' ? -bounceDistance : 0,
        x: direction === 'left' ? bounceDistance : direction === 'right' ? -bounceDistance : 0,
        scale: 0.8
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          type: "spring",
          stiffness: 400,
          damping: 10,
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    jello: {
      hidden: {
        opacity: 0,
        scale: 1,
        skewX: 0,
        skewY: 0
      },
      visible: {
        opacity: 1,
        scale: 1,
        skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0.390625, -0.1953125, 0],
        skewY: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0.390625, -0.1953125, 0],
        transition: {
          duration: duration * 1.8,
          delay,
          times: [0, 0.111, 0.222, 0.333, 0.444, 0.555, 0.666, 0.777, 1],
          ease: "easeInOut",
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
      y: direction === 'up' ? bounceDistance * 0.3 : direction === 'down' ? -bounceDistance * 0.3 : 0,
      x: direction === 'left' ? bounceDistance * 0.3 : direction === 'right' ? -bounceDistance * 0.3 : 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: duration * 0.8,
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    }
  };

  // Trigger continuous bounce effect
  React.useEffect(() => {
    if (repeat && isInView) {
      controls.start({
        y: [0, -10, 0],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          repeatDelay,
          ease: "easeInOut"
        }
      });
    }
  }, [isInView, repeat, repeatDelay, controls]);

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
      {...(repeat && { animate: controls })}
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

// Continuous bounce effect
export const ContinuousBounce = ({ 
  children,
  bounceHeight = 10,
  bounceDuration = 0.6,
  className = '',
  ...bounceProps
}) => {
  return (
    <motion.div
      className={`continuous-bounce ${className}`}
      animate={{
        y: [-bounceHeight, 0, -bounceHeight]
      }}
      transition={{
        duration: bounceDuration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      {...bounceProps}
    >
      {children}
    </motion.div>
  );
};

// Pulse bounce effect
export const PulseBounce = ({ 
  children,
  scaleRange = [1, 1.05, 1],
  pulseDuration = 1,
  className = '',
  ...bounceProps
}) => {
  return (
    <motion.div
      className={`pulse-bounce ${className}`}
      animate={{
        scale: scaleRange
      }}
      transition={{
        duration: pulseDuration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      {...bounceProps}
    >
      {children}
    </motion.div>
  );
};

// Bounce on hover
export const HoverBounce = ({ 
  children,
  bounceScale = 1.05,
  bounceDuration = 0.2,
  className = '',
  ...bounceProps
}) => {
  return (
    <motion.div
      className={`hover-bounce ${className}`}
      whileHover={{
        scale: bounceScale,
        y: -5,
        transition: { duration: bounceDuration, type: "spring", stiffness: 400 }
      }}
      whileTap={{
        scale: 0.95,
        y: 0
      }}
      {...bounceProps}
    >
      {children}
    </motion.div>
  );
};

// Sequential bounce wave
export const BouncingWave = ({ 
  children,
  waveDelay = 0.1,
  className = '',
  ...bounceProps
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: waveDelay,
        delayChildren: bounceProps.delay || 0
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: bounceProps.duration || 0.6
      }
    }
  };

  const ref = useRef(null);
  const isInView = useInView(ref, bounceProps.viewport || { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={`bouncing-wave ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Elastic bounce
export const ElasticBounce = ({ 
  children,
  elasticity = 0.8,
  className = '',
  ...bounceProps
}) => {
  return (
    <Bounce
      variant="spring"
      className={`elastic-bounce ${className}`}
      transition={{
        type: "spring",
        stiffness: 400 * elasticity,
        damping: 15,
        duration: bounceProps.duration || 0.8
      }}
      {...bounceProps}
    >
      {children}
    </Bounce>
  );
};

// Attention seeking bounce
export const AttentionBounce = ({ 
  children,
  triggerInterval = 3000,
  className = '',
  ...bounceProps
}) => {
  const [shouldBounce, setShouldBounce] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 1000);
    }, triggerInterval);

    return () => clearInterval(interval);
  }, [triggerInterval]);

  return (
    <motion.div
      className={`attention-bounce ${className}`}
      animate={shouldBounce ? {
        scale: [1, 1.1, 1, 1.05, 1],
        y: [0, -5, 0, -3, 0]
      } : {}}
      transition={{
        duration: 0.6,
        ease: "easeInOut"
      }}
      {...bounceProps}
    >
      {children}
    </motion.div>
  );
};

// Bounce with rotation
export const RotateBounce = ({ 
  children,
  rotationAngle = 5,
  className = '',
  ...bounceProps
}) => {
  return (
    <Bounce
      direction="rotate"
      variant="spring"
      className={`rotate-bounce ${className}`}
      style={{
        transformOrigin: 'center center'
      }}
      {...bounceProps}
    >
      {children}
    </Bounce>
  );
};

// Staggered bounce grid
export const BounceGrid = ({ 
  children,
  columns = 3,
  gridGap = 0.05,
  className = '',
  ...bounceProps
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: gridGap,
        delayChildren: bounceProps.delay || 0
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const ref = useRef(null);
  const isInView = useInView(ref, bounceProps.viewport || { once: true });

  return (
    <motion.div
      ref={ref}
      className={`bounce-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem'
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

Bounce.displayName = 'Bounce';

export default Bounce;
