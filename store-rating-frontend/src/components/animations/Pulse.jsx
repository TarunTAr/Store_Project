import React, { forwardRef, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const Pulse = forwardRef(({
  children,
  delay = 0,
  duration = 1,
  intensity = 1,
  color = '#667eea',
  glowColor = '#667eea',
  easing = "easeInOut",
  threshold = 0.1,
  triggerOnce = false,
  viewport = { once: false, amount: 0.1 },
  className = '',
  style = {},
  onAnimationStart,
  onAnimationComplete,
  disabled = false,
  variant = 'default', // default, heartbeat, glow, ring, breathe, ripple, neon
  repeat = true,
  pauseOnHover = false,
  interactive = false,
  pulseScale = [1, 1.05, 1],
  ...props
}, ref) => {
  const localRef = useRef(null);
  const targetRef = ref || localRef;
  const isInView = useInView(targetRef, viewport);
  const controls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);

  // Pulse intensity calculations
  const scaleRange = pulseScale.map(scale => scale * intensity);
  const glowIntensity = 0.3 * intensity;
  const ringSize = 20 * intensity;

  // Animation variants for different pulse effects
  const variants = {
    default: {
      initial: {
        scale: 1,
        opacity: 1
      },
      animate: {
        scale: scaleRange,
        transition: {
          duration,
          delay,
          ease: easing,
          repeat: repeat ? Infinity : 0,
          repeatType: "loop"
        }
      }
    },
    heartbeat: {
      initial: {
        scale: 1,
        opacity: 1
      },
      animate: {
        scale: [1, 1.1, 1, 1.1, 1],
        transition: {
          duration: duration * 1.5,
          delay,
          times: [0, 0.14, 0.28, 0.42, 1],
          ease: "easeInOut",
          repeat: repeat ? Infinity : 0,
          repeatDelay: 0.5
        }
      }
    },
    glow: {
      initial: {
        scale: 1,
        opacity: 1,
        filter: `drop-shadow(0 0 0px ${glowColor})`
      },
      animate: {
        scale: scaleRange,
        filter: [
          `drop-shadow(0 0 0px ${glowColor})`,
          `drop-shadow(0 0 ${ringSize}px ${glowColor}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')})`,
          `drop-shadow(0 0 0px ${glowColor})`
        ],
        transition: {
          duration,
          delay,
          ease: easing,
          repeat: repeat ? Infinity : 0,
          repeatType: "loop"
        }
      }
    },
    ring: {
      initial: {
        scale: 1,
        opacity: 1
      },
      animate: {
        scale: scaleRange,
        transition: {
          duration,
          delay,
          ease: easing,
          repeat: repeat ? Infinity : 0,
          repeatType: "loop"
        }
      }
    },
    breathe: {
      initial: {
        scale: 1,
        opacity: 0.8
      },
      animate: {
        scale: [1, 1.02, 1],
        opacity: [0.8, 1, 0.8],
        transition: {
          duration: duration * 2,
          delay,
          ease: "easeInOut",
          repeat: repeat ? Infinity : 0,
          repeatType: "loop"
        }
      }
    },
    ripple: {
      initial: {
        scale: 1,
        opacity: 1
      },
      animate: {
        scale: [1, 1.1, 1.05, 1],
        opacity: [1, 0.8, 0.9, 1],
        transition: {
          duration: duration * 1.5,
          delay,
          times: [0, 0.4, 0.7, 1],
          ease: "easeOut",
          repeat: repeat ? Infinity : 0,
          repeatDelay: 0.3
        }
      }
    },
    neon: {
      initial: {
        scale: 1,
        opacity: 1,
        textShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`,
        boxShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}, 0 0 20px ${color}`
      },
      animate: {
        scale: scaleRange,
        textShadow: [
          `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`,
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
          `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`
        ],
        boxShadow: [
          `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}, 0 0 20px ${color}`,
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
          `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}, 0 0 20px ${color}`
        ],
        transition: {
          duration,
          delay,
          ease: easing,
          repeat: repeat ? Infinity : 0,
          repeatType: "loop"
        }
      }
    }
  };

  // Handle pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
      controls.start(variants[variant].animate);
    }
  };

  // Interactive pulse on click
  const handleClick = () => {
    if (interactive) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3, ease: "easeOut" }
      });
    }
  };

  React.useEffect(() => {
    if (isInView && !disabled && !isPaused) {
      controls.start(variants[variant].animate);
    } else if (!isInView || disabled || isPaused) {
      controls.stop();
    }
  }, [isInView, disabled, isPaused, variant, controls]);

  if (disabled) {
    return (
      <div ref={targetRef} className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  // Ring pulse effect wrapper
  const RingWrapper = ({ children }) => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {variant === 'ring' && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              border: `2px solid ${color}`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.8, 0.3, 0]
            }}
            transition={{
              duration: duration * 2,
              delay,
              ease: "easeOut",
              repeat: repeat ? Infinity : 0,
              repeatDelay: 0.5
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              border: `2px solid ${color}`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.8, 0.3, 0]
            }}
            transition={{
              duration: duration * 2,
              delay: delay + 0.5,
              ease: "easeOut",
              repeat: repeat ? Infinity : 0,
              repeatDelay: 0.5
            }}
          />
        </>
      )}
    </div>
  );

  return (
    <motion.div
      ref={targetRef}
      className={className}
      style={style}
      initial={variants[variant].initial}
      animate={controls}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {variant === 'ring' ? (
        <RingWrapper>{children}</RingWrapper>
      ) : (
        children
      )}
    </motion.div>
  );
});

// Notification pulse dot
export const PulseDot = ({ 
  size = 12,
  color = '#ef4444',
  className = '',
  ...pulseProps 
}) => (
  <Pulse
    variant="glow"
    intensity={1.5}
    color={color}
    glowColor={color}
    className={`pulse-dot ${className}`}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'inline-block'
    }}
    {...pulseProps}
  />
);

// Loading pulse skeleton
export const PulseSkeleton = ({ 
  width = '100%',
  height = 20,
  borderRadius = 4,
  className = '',
  ...pulseProps 
}) => (
  <Pulse
    variant="breathe"
    duration={1.5}
    className={`pulse-skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: '#e5e7eb',
      display: 'block'
    }}
    {...pulseProps}
  />
);

// Attention pulse
export const AttentionPulse = ({ 
  children,
  urgency = 'medium', // low, medium, high
  className = '',
  ...pulseProps 
}) => {
  const urgencySettings = {
    low: { duration: 2, intensity: 1, color: '#10b981' },
    medium: { duration: 1.5, intensity: 1.2, color: '#f59e0b' },
    high: { duration: 1, intensity: 1.5, color: '#ef4444' }
  };

  const settings = urgencySettings[urgency];

  return (
    <Pulse
      variant="heartbeat"
      duration={settings.duration}
      intensity={settings.intensity}
      color={settings.color}
      glowColor={settings.color}
      className={`attention-pulse attention-${urgency} ${className}`}
      {...pulseProps}
    >
      {children}
    </Pulse>
  );
};

// Status indicator pulse
export const StatusPulse = ({ 
  children,
  status = 'active', // active, warning, error, success, idle
  className = '',
  ...pulseProps 
}) => {
  const statusSettings = {
    active: { color: '#10b981', variant: 'breathe', duration: 2 },
    warning: { color: '#f59e0b', variant: 'heartbeat', duration: 1.5 },
    error: { color: '#ef4444', variant: 'glow', duration: 1 },
    success: { color: '#10b981', variant: 'glow', duration: 2 },
    idle: { color: '#6b7280', variant: 'breathe', duration: 3 }
  };

  const settings = statusSettings[status];

  return (
    <Pulse
      variant={settings.variant}
      color={settings.color}
      glowColor={settings.color}
      duration={settings.duration}
      className={`status-pulse status-${status} ${className}`}
      {...pulseProps}
    >
      {children}
    </Pulse>
  );
};

// Wave pulse effect
export const WavePulse = ({ 
  children,
  waves = 3,
  waveDelay = 0.3,
  className = '',
  ...pulseProps 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div 
      ref={ref}
      className={`wave-pulse-container ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {Array.from({ length: waves }).map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            border: `2px solid ${pulseProps.color || '#667eea'}`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
          animate={isInView ? {
            scale: [1, 2, 3],
            opacity: [0.8, 0.3, 0]
          } : {}}
          transition={{
            duration: pulseProps.duration || 2,
            delay: (pulseProps.delay || 0) + (index * waveDelay),
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: waves * waveDelay
          }}
        />
      ))}
    </div>
  );
};

// Synchronized pulse group
export const PulseGroup = ({ 
  children,
  syncDelay = 0,
  className = '',
  ...pulseProps 
}) => (
  <div className={`pulse-group ${className}`}>
    {React.Children.map(children, (child, index) => (
      <Pulse
        key={index}
        delay={syncDelay}
        {...pulseProps}
      >
        {child}
      </Pulse>
    ))}
  </div>
);

// Conditional pulse
export const ConditionalPulse = ({ 
  children,
  condition = true,
  fallbackComponent,
  className = '',
  ...pulseProps 
}) => (
  condition ? (
    <Pulse className={`conditional-pulse ${className}`} {...pulseProps}>
      {children}
    </Pulse>
  ) : (
    fallbackComponent || (
      <div className={className}>
        {children}
      </div>
    )
  )
);

Pulse.displayName = 'Pulse';

export default Pulse;
