// ==========================================================================
// THEME CONFIGURATION - Store Rating Platform
// Complete design system with light/dark themes + semantic tokens
// ==========================================================================

// Color Palette - Modern, accessible color system
const colors = {
  // Primary Colors (Blue-Indigo gradient)
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff', 
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main brand color
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Secondary Colors (Purple)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Gray Scale (Neutral colors)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Success Colors (Green)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Warning Colors (Amber/Yellow for stars)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Perfect for star ratings
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Error Colors (Red)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Info Colors (Cyan)
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },

  // Special Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
};

// Typography System
const typography = {
  fonts: {
    primary: [
      'Inter', 
      '-apple-system', 
      'BlinkMacSystemFont', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'sans-serif'
    ].join(', '),
    heading: [
      'Inter', 
      '-apple-system', 
      'BlinkMacSystemFont', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'sans-serif'
    ].join(', '),
    mono: [
      'Menlo', 
      'Monaco', 
      'Consolas', 
      'Liberation Mono', 
      'Courier New', 
      'monospace'
    ].join(', '),
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px  
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  fontWeights: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Spacing Scale (based on 4px grid)
const spacing = {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  7: '1.75rem',  // 28px
  8: '2rem',     // 32px
  9: '2.25rem',  // 36px
  10: '2.5rem',  // 40px
  11: '2.75rem', // 44px
  12: '3rem',    // 48px
  14: '3.5rem',  // 56px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
  40: '10rem',   // 160px
  48: '12rem',   // 192px
  56: '14rem',   // 224px
  64: '16rem',   // 256px
};

// Border Radius Scale
const borderRadius = {
  none: '0px',
  sm: '0.25rem',   // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  full: '9999px',
};

// Shadow System
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// Animation & Transition System
const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  theme: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
};

const animations = {
  durations: {
    fastest: '75ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slowest: '1000ms',
  },
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Breakpoints (Mobile-first)
const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Container Sizes
const containers = {
  xs: '20rem',     // 320px
  sm: '24rem',     // 384px
  md: '28rem',     // 448px
  lg: '32rem',     // 512px
  xl: '36rem',     // 576px
  '2xl': '42rem',  // 672px
  '3xl': '48rem',  // 768px
  '4xl': '56rem',  // 896px
  '5xl': '64rem',  // 1024px
  '6xl': '72rem',  // 1152px
  '7xl': '80rem',  // 1280px
};

// Z-Index Scale
const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  loading: 1900,
  max: 2000,
};

// Component-specific tokens
const components = {
  button: {
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
      xl: '3.5rem',    // 56px
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.625rem 1rem',
      lg: '0.75rem 1.5rem',
      xl: '1rem 2rem',
    },
  },
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.625rem 1rem',
      lg: '0.75rem 1rem',
    },
  },
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    radius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
    },
  },
};

// Light Theme
export const lightTheme = {
  colors: {
    // Primary palette
    primary: {
      50: colors.primary[50],
      100: colors.primary[100],
      200: colors.primary[200],
      300: colors.primary[300],
      400: colors.primary[400],
      500: colors.primary[500],
      600: colors.primary[600],
      700: colors.primary[700],
      800: colors.primary[800],
      900: colors.primary[900],
    },
    
    // Semantic colors
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[700],
      muted: colors.gray[500],
      inverse: colors.white,
    },
    
    background: {
      primary: colors.white,
      secondary: colors.gray[50],
      tertiary: colors.gray[100],
      inverse: colors.gray[900],
    },
    
    border: {
      primary: colors.gray[200],
      secondary: colors.gray[300],
      focus: colors.primary[500],
      error: colors.error[500],
    },
    
    // Status colors
    success: colors.success[600],
    warning: colors.warning[500],
    error: colors.error[600],
    info: colors.info[600],
    
    // Interactive states
    hover: colors.gray[100],
    active: colors.gray[200],
    disabled: colors.gray[300],
    
    // Star rating specific
    star: {
      filled: colors.warning[500],
      empty: colors.gray[300],
      hover: colors.warning[400],
    },
  },
  
  shadows: {
    ...shadows,
    // Custom shadows for light theme
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

// Dark Theme
export const darkTheme = {
  colors: {
    // Primary palette (slightly adjusted for dark backgrounds)
    primary: {
      50: colors.primary[950],
      100: colors.primary[900],
      200: colors.primary[800],
      300: colors.primary[700],
      400: colors.primary[600],
      500: colors.primary[500],
      600: colors.primary[400],
      700: colors.primary[300],
      800: colors.primary[200],
      900: colors.primary[100],
    },
    
    // Semantic colors
    text: {
      primary: colors.gray[100],
      secondary: colors.gray[300],
      muted: colors.gray[500],
      inverse: colors.gray[900],
    },
    
    background: {
      primary: colors.gray[900],
      secondary: colors.gray[800],
      tertiary: colors.gray[700],
      inverse: colors.white,
    },
    
    border: {
      primary: colors.gray[700],
      secondary: colors.gray[600],
      focus: colors.primary[400],
      error: colors.error[400],
    },
    
    // Status colors (adjusted for dark theme)
    success: colors.success[500],
    warning: colors.warning[400],
    error: colors.error[500],
    info: colors.info[400],
    
    // Interactive states
    hover: colors.gray[800],
    active: colors.gray[700],
    disabled: colors.gray[600],
    
    // Star rating specific
    star: {
      filled: colors.warning[400],
      empty: colors.gray[600],
      hover: colors.warning[300],
    },
  },
  
  shadows: {
    ...shadows,
    // Custom shadows for dark theme (more subtle)
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    hover: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  },
};

// Theme object with all design tokens
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  animations,
  breakpoints,
  containers,
  zIndex,
  components,
  
  // Theme variants
  light: lightTheme,
  dark: darkTheme,
  
  // Utility functions
  utils: {
    // Convert theme values to CSS custom properties
    toCSSVars: (themeColors) => {
      const cssVars = {};
      
      // Convert colors to CSS variables
      Object.entries(themeColors).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (typeof subValue === 'string') {
              cssVars[`--color-${key}-${subKey}`] = subValue;
            }
          });
        } else if (typeof value === 'string') {
          cssVars[`--color-${key}`] = value;
        }
      });
      
      // Add other design tokens
      Object.entries(spacing).forEach(([key, value]) => {
        cssVars[`--spacing-${key}`] = value;
      });
      
      Object.entries(typography.fontSizes).forEach(([key, value]) => {
        cssVars[`--font-size-${key}`] = value;
      });
      
      Object.entries(typography.fontWeights).forEach(([key, value]) => {
        cssVars[`--font-weight-${key}`] = value;
      });
      
      Object.entries(typography.lineHeights).forEach(([key, value]) => {
        cssVars[`--line-height-${key}`] = value;
      });
      
      Object.entries(borderRadius).forEach(([key, value]) => {
        cssVars[`--border-radius-${key}`] = value;
      });
      
      Object.entries(shadows).forEach(([key, value]) => {
        cssVars[`--shadow-${key}`] = value;
      });
      
      Object.entries(transitions).forEach(([key, value]) => {
        cssVars[`--transition-${key}`] = value;
      });
      
      Object.entries(containers).forEach(([key, value]) => {
        cssVars[`--container-${key}`] = value;
      });
      
      // Font families
      cssVars['--font-family-primary'] = typography.fonts.primary;
      cssVars['--font-family-heading'] = typography.fonts.heading;
      cssVars['--font-family-mono'] = typography.fonts.mono;
      
      return cssVars;
    },
    
    // Responsive utilities
    mediaQuery: (breakpoint) => `@media (min-width: ${breakpoints[breakpoint]})`,
    
    // Color utilities
    alpha: (color, alpha) => {
      // Simple alpha utility (in real app, use proper color manipulation library)
      return color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    },
  },
};

export default theme;
