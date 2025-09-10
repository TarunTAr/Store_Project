import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FadeInUp = forwardRef(({
  children,
  delay = 0,
  duration = 0.6,
  distance = 30,
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
  variant = 'default', // default, gentle, dramatic, elastic
  ...props
}, ref) => {
  const localRef = useRef(null);
  const targetRef = ref || localRef;
  const isInView = useInView(targetRef, viewport);

  // Animation variants for different effects
  const variants = {
    default: {
      hidden: {
        opacity: 0,
        y: distance,
        scale: 0.95
      },
      visible: {
        opacity: 1,
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
    gentle: {
      hidden: {
        opacity: 0,
        y: distance * 0.5,
        scale: 0.98
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: duration * 1.2,
          delay,
          ease: "easeOut",
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    dramatic: {
      hidden: {
        opacity: 0,
        y: distance * 2,
        scale: 0.8,
        rotateX: -15
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
          duration: duration * 1.5,
          delay,
          ease: "easeOut",
          when: "beforeChildren",
          staggerChildren: staggerChildren
        }
      }
    },
    elastic: {
      hidden: {
        opacity: 0,
        y: distance,
        scale: 0.9
      },
      visible: {
        opacity: 1,
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
    }
  };

  // Child item variants for stagger effect
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: distance * 0.5,
      scale: 0.95
    },
    visible: {
      opacity: 1,
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

// Enhanced FadeInUp with additional features
export const FadeInUpContainer = ({ 
  children, 
  className = '',
  containerProps = {},
  itemProps = {},
  ...fadeProps 
}) => (
  <FadeInUp 
    className={`fade-in-up-container ${className}`}
    {...containerProps}
    {...fadeProps}
  >
    {React.Children.map(children, (child, index) => (
      <motion.div
        key={index}
        variants={{
          hidden: { opacity: 0, y: fadeProps.distance || 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: fadeProps.duration || 0.6 }
          }
        }}
        {...itemProps}
      >
        {child}
      </motion.div>
    ))}
  </FadeInUp>
);

// Sequential FadeInUp for multiple elements
export const SequentialFadeInUp = ({ 
  children, 
  interval = 0.2,
  className = '',
  ...fadeProps 
}) => (
  <div className={`sequential-fade-container ${className}`}>
    {React.Children.map(children, (child, index) => (
      <FadeInUp
        key={index}
        delay={(fadeProps.delay || 0) + (index * interval)}
        {...fadeProps}
      >
        {child}
      </FadeInUp>
    ))}
  </div>
);

// Grouped FadeInUp with wave effect
export const WaveFadeInUp = ({ 
  children, 
  waveDelay = 0.1,
  className = '',
  ...fadeProps 
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: waveDelay,
        delayChildren: fadeProps.delay || 0
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: fadeProps.distance || 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: fadeProps.duration || 0.6,
        ease: fadeProps.easing || "easeOut"
      }
    }
  };

  const ref = useRef(null);
  const isInView = useInView(ref, fadeProps.viewport || { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={`wave-fade-container ${className}`}
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

// FadeInUp with intersection observer controls
export const ScrollFadeInUp = ({ 
  children,
  rootMargin = "0px 0px -100px 0px",
  threshold = 0.1,
  className = '',
  ...fadeProps 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    rootMargin,
    threshold,
    once: fadeProps.triggerOnce !== false
  });

  return (
    <FadeInUp
      ref={ref}
      className={`scroll-fade ${className}`}
      disabled={!isInView}
      {...fadeProps}
    >
      {children}
    </FadeInUp>
  );
};

FadeInUp.displayName = 'FadeInUp';

export default FadeInUp;
