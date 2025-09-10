import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

const CountUp = forwardRef(({
  start = 0,
  end,
  duration = 2,
  delay = 0,
  decimals = 0,
  separator = ',',
  decimal = '.',
  prefix = '',
  suffix = '',
  easing = "easeOut",
  threshold = 0.1,
  triggerOnce = true,
  viewport = { once: true, amount: 0.1 },
  className = '',
  style = {},
  onStart,
  onUpdate,
  onComplete,
  disabled = false,
  preserveValue = false,
  redraw = true,
  useGrouping = true,
  enableScrollSpy = true,
  smartEasing = true,
  formatValue,
  animateOnChange = true,
  ...props
}, ref) => {
  const localRef = useRef(null);
  const targetRef = ref || localRef;
  const isInView = useInView(targetRef, viewport);
  
  const [displayValue, setDisplayValue] = useState(preserveValue ? end : start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const motionValue = useMotionValue(start);
  const rounded = useTransform(motionValue, latest => Math.round(latest * Math.pow(10, decimals)) / Math.pow(10, decimals));

  // Format number with separators
  const formatNumber = (value) => {
    if (formatValue) {
      return formatValue(value);
    }

    const num = parseFloat(value);
    if (isNaN(num)) return value;

    const parts = num.toFixed(decimals).split('.');
    
    if (useGrouping && separator) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    const formattedNumber = parts.join(decimal);
    return `${prefix}${formattedNumber}${suffix}`;
  };

  // Smart easing based on number size
  const getSmartEasing = () => {
    if (!smartEasing) return easing;
    
    const diff = Math.abs(end - start);
    if (diff < 100) return "easeOut";
    if (diff < 1000) return "easeInOut";
    return [0.25, 0.1, 0.25, 1]; // Custom cubic bezier for large numbers
  };

  // Animation effect
  useEffect(() => {
    if ((isInView || !enableScrollSpy) && !disabled && (!hasAnimated || !triggerOnce || animateOnChange)) {
      const controls = animate(motionValue, end, {
        duration,
        delay,
        ease: getSmartEasing(),
        onPlay: () => {
          setHasAnimated(true);
          onStart?.(start, end);
        },
        onUpdate: (latest) => {
          setDisplayValue(latest);
          onUpdate?.(latest);
        },
        onComplete: () => {
          setDisplayValue(end);
          onComplete?.(end);
        }
      });

      return () => controls.stop();
    }
  }, [isInView, end, disabled, hasAnimated, triggerOnce, animateOnChange, enableScrollSpy]);

  // Subscribe to motion value changes
  useEffect(() => {
    return rounded.onChange((latest) => {
      if (redraw) {
        setDisplayValue(latest);
      }
    });
  }, [rounded, redraw]);

  const formattedValue = formatNumber(displayValue);

  if (disabled) {
    return (
      <span ref={targetRef} className={className} style={style} {...props}>
        {formatNumber(end)}
      </span>
    );
  }

  return (
    <motion.span
      ref={targetRef}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {formattedValue}
    </motion.span>
  );
});

// Enhanced CountUp with additional visual effects
export const EnhancedCountUp = ({
  children,
  highlightColor = '#667eea',
  showPlusSign = false,
  glowEffect = false,
  textShadow = false,
  className = '',
  ...countUpProps
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const enhancedStyle = {
    color: isAnimating ? highlightColor : undefined,
    textShadow: textShadow ? `0 0 10px ${highlightColor}50` : undefined,
    filter: glowEffect ? `drop-shadow(0 0 5px ${highlightColor}50)` : undefined,
    transition: 'all 0.3s ease',
    ...countUpProps.style
  };

  return (
    <CountUp
      className={`enhanced-countup ${className}`}
      style={enhancedStyle}
      prefix={showPlusSign && countUpProps.end > 0 ? '+' : countUpProps.prefix}
      onStart={() => setIsAnimating(true)}
      onComplete={() => setIsAnimating(false)}
      {...countUpProps}
    />
  );
};

// CountUp with progress bar
export const ProgressCountUp = ({
  label,
  max = 100,
  progressColor = '#667eea',
  progressBg = '#e5e7eb',
  showPercentage = true,
  className = '',
  ...countUpProps
}) => {
  const percentage = (countUpProps.end / max) * 100;

  return (
    <div className={`progress-countup ${className}`}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{label}</span>
          <CountUp
            {...countUpProps}
            suffix={showPercentage ? '%' : countUpProps.suffix}
            style={{ fontSize: '0.875rem', fontWeight: 600, ...countUpProps.style }}
          />
        </div>
      )}
      
      <div style={{ 
        width: '100%', 
        height: 8, 
        backgroundColor: progressBg, 
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <motion.div
          style={{
            height: '100%',
            backgroundColor: progressColor,
            borderRadius: 4
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: countUpProps.duration || 2,
            delay: countUpProps.delay || 0,
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  );
};

// Circular progress CountUp
export const CircularCountUp = ({
  size = 120,
  strokeWidth = 8,
  progressColor = '#667eea',
  trackColor = '#e5e7eb',
  max = 100,
  className = '',
  ...countUpProps
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (countUpProps.end / max) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`circular-countup ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: countUpProps.duration || 2,
            delay: countUpProps.delay || 0,
            ease: "easeOut"
          }}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
        />
      </svg>
      
      {/* Center text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <CountUp
          {...countUpProps}
          style={{
            fontSize: size / 6,
            fontWeight: 700,
            color: progressColor,
            ...countUpProps.style
          }}
        />
      </div>
    </div>
  );
};

// Odometer-style CountUp
export const OdometerCountUp = ({
  digits = 4,
  className = '',
  ...countUpProps
}) => {
  const [currentValue, setCurrentValue] = useState(countUpProps.start || 0);
  
  const paddedValue = currentValue.toString().padStart(digits, '0');
  
  return (
    <div className={`odometer-countup ${className}`} style={{ display: 'flex', gap: 2 }}>
      {paddedValue.split('').map((digit, index) => (
        <motion.div
          key={index}
          style={{
            width: 40,
            height: 60,
            backgroundColor: '#1f2937',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontFamily: 'monospace',
            borderRadius: 4,
            border: '1px solid #374151'
          }}
          animate={{ rotateX: [0, 90, 0] }}
          transition={{
            duration: 0.5,
            delay: index * 0.1
          }}
        >
          {digit}
        </motion.div>
      ))}
      
      <CountUp
        {...countUpProps}
        onUpdate={setCurrentValue}
        style={{ display: 'none' }}
      />
    </div>
  );
};

// CountUp with typewriter effect
export const TypewriterCountUp = ({
  typingSpeed = 100,
  className = '',
  ...countUpProps
}) => {
  const [displayText, setDisplayText] = useState('');
  const [finalValue, setFinalValue] = useState('');

  useEffect(() => {
    if (finalValue) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= finalValue.length) {
          setDisplayText(finalValue.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, typingSpeed);

      return () => clearInterval(interval);
    }
  }, [finalValue, typingSpeed]);

  return (
    <span className={`typewriter-countup ${className}`}>
      <CountUp
        {...countUpProps}
        onComplete={(value) => setFinalValue(value.toString())}
        style={{ display: 'none' }}
      />
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        style={{ marginLeft: 2 }}
      >
        |
      </motion.span>
    </span>
  );
};

// Currency CountUp
export const CurrencyCountUp = ({
  currency = 'USD',
  locale = 'en-US',
  className = '',
  ...countUpProps
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  return (
    <CountUp
      className={`currency-countup ${className}`}
      formatValue={formatCurrency}
      {...countUpProps}
    />
  );
};

// Percentage CountUp with visual indicator
export const PercentageCountUp = ({
  showBar = true,
  barColor = '#667eea',
  className = '',
  ...countUpProps
}) => {
  return (
    <div className={`percentage-countup ${className}`}>
      <CountUp
        {...countUpProps}
        suffix="%"
        style={{ fontSize: '2rem', fontWeight: 700, ...countUpProps.style }}
      />
      
      {showBar && (
        <div style={{ 
          width: '100%', 
          height: 4, 
          backgroundColor: '#e5e7eb', 
          borderRadius: 2,
          marginTop: 8,
          overflow: 'hidden'
        }}>
          <motion.div
            style={{
              height: '100%',
              backgroundColor: barColor,
              borderRadius: 2
            }}
            initial={{ width: 0 }}
            animate={{ width: `${countUpProps.end}%` }}
            transition={{ 
              duration: countUpProps.duration || 2,
              delay: countUpProps.delay || 0,
              ease: "easeOut"
            }}
          />
        </div>
      )}
    </div>
  );
};

// Split number CountUp (for large numbers)
export const SplitCountUp = ({
  splitChar = ',',
  className = '',
  ...countUpProps
}) => {
  const [parts, setParts] = useState(['0']);

  const formatSplitValue = (value) => {
    const formatted = value.toLocaleString();
    const splitParts = formatted.split(splitChar);
    setParts(splitParts);
    return formatted;
  };

  return (
    <div className={`split-countup ${className}`} style={{ display: 'flex', alignItems: 'baseline' }}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            style={{ 
              fontSize: index === 0 ? '3rem' : '2rem',
              fontWeight: 700,
              color: index === 0 ? '#667eea' : '#6b7280'
            }}
          >
            {part}
          </motion.span>
          {index < parts.length - 1 && (
            <span style={{ fontSize: '2rem', color: '#6b7280', margin: '0 4px' }}>
              {splitChar}
            </span>
          )}
        </React.Fragment>
      ))}
      
      <CountUp
        {...countUpProps}
        formatValue={formatSplitValue}
        style={{ display: 'none' }}
      />
    </div>
  );
};

CountUp.displayName = 'CountUp';

export default CountUp;
