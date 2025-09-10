/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  
  // Dark mode configuration
  darkMode: ['class', '[data-theme="dark"]'],
  
  theme: {
    // Screen breakpoints (mobile-first)
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    extend: {
      // Custom color palette for Store Rating Platform
      colors: {
        // Primary colors (Blue-Indigo gradient)
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Main brand color
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        
        // Secondary colors (Purple)
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
        
        // Success colors (Green)
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
        
        // Warning colors (Amber - for star ratings)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Perfect for stars
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        
        // Error colors (Red)
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
        
        // Info colors (Cyan)
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
        
        // Custom gray scale
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
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
        display: ['Poppins', 'system-ui', ...defaultTheme.fontFamily.sans],
      },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Spacing scale
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '12.5': '3.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '21': '5.25rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '70': '17.5rem',
        '74': '18.5rem',
        '78': '19.5rem',
        '82': '20.5rem',
        '86': '21.5rem',
        '90': '22.5rem',
        '94': '23.5rem',
        '98': '24.5rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
        '132': '33rem',
        '136': '34rem',
        '140': '35rem',
      },
      
      // Border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      
      // Box shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.025)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'outline-primary': '0 0 0 3px rgba(79, 70, 229, 0.1)',
        'outline-error': '0 0 0 3px rgba(220, 38, 38, 0.1)',
        'outline-success': '0 0 0 3px rgba(22, 163, 74, 0.1)',
        'glow': '0 0 20px rgba(79, 70, 229, 0.3)',
        'glow-lg': '0 0 40px rgba(79, 70, 229, 0.3)',
      },
      
      // Animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'slide-in-down': 'slideInDown 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'wiggle': 'wiggle 1s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'star-fill': 'starFill 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'star-bounce': 'starBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'skeleton-loading': 'skeletonLoading 1.4s ease-in-out infinite',
        'toast-slide-in': 'toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'modal-scale-in': 'modalScaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      
      // Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        wiggle: {
          '0%, 7%, 100%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(-3deg)' },
          '20%': { transform: 'rotate(3deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '30%': { transform: 'rotate(3deg)' },
          '35%': { transform: 'rotate(-1deg)' },
          '40%': { transform: 'rotate(1deg)' },
          '50%, 100%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        starFill: {
          '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        starBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3) rotate(15deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        skeletonLoading: {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '-100% 50%' },
        },
        toastSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        modalScaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.7) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        heartbeat: {
          '0%, 50%, 100%': { transform: 'scale(1)' },
          '5%, 45%': { transform: 'scale(1.1)' },
          '10%, 40%': { transform: 'scale(1.2)' },
          '15%, 35%': { transform: 'scale(1.1)' },
          '20%, 30%': { transform: 'scale(1)' },
        },
      },
      
      // Transitions
      transitionTimingFunction: {
        'bounce-custom': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      
      // Z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Container sizes
      containers: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Grid template columns
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
      },
      
      // Aspect ratio
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'photo': '4 / 3',
        'golden': '1.618 / 1',
      },
    },
  },
  
  plugins: [
    forms({
      strategy: 'class',
    }),
    typography({
      className: 'prose',
    }),
    aspectRatio,
    containerQueries,
    
    // Custom plugin for store rating specific utilities
    function({ addUtilities, addComponents, theme }) {
      // Star rating utilities
      addComponents({
        '.star-rating': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme('spacing.1'),
        },
        '.star': {
          fontSize: theme('fontSize.xl[0]'),
          color: theme('colors.gray.300'),
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          userSelect: 'none',
          '&.filled': {
            color: theme('colors.warning.500'),
          },
          '&.interactive:hover': {
            transform: 'scale(1.1)',
            filter: 'brightness(1.1)',
          },
          '&.interactive:active': {
            animation: theme('animation.star-bounce'),
          },
        },
        
        // Card components
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.sm'),
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: theme('boxShadow.md'),
            transform: 'translateY(-2px)',
          },
        },
        
        '.card-hover': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme('boxShadow.xl'),
          },
        },
        
        // Button components
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          fontFamily: theme('fontFamily.sans'),
          fontWeight: theme('fontWeight.medium'),
          textAlign: 'center',
          whiteSpace: 'nowrap',
          verticalAlign: 'middle',
          userSelect: 'none',
          border: `1px solid transparent`,
          borderRadius: theme('borderRadius.md'),
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.primary.500')}`,
            outlineOffset: '2px',
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
        
        // Skeleton loading
        '.skeleton': {
          background: `linear-gradient(90deg, ${theme('colors.gray.200')} 25%, transparent 37%, ${theme('colors.gray.200')} 63%)`,
          backgroundSize: '400% 100%',
          animation: theme('animation.skeleton-loading'),
        },
        
        // Gradient text
        '.text-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.primary.800')})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: theme('animation.gradient-shift'),
        },
        
        // Focus ring
        '.focus-ring': {
          transition: `box-shadow ${theme('transitionDuration.150')} ${theme('transitionTimingFunction.DEFAULT')}`,
          '&:focus': {
            boxShadow: theme('boxShadow.outline-primary'),
          },
        },
        
        // Custom scrollbar
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.gray.100'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.gray.400'),
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: theme('colors.gray.500'),
            },
          },
        },
      });
      
      // Utility classes
      addUtilities({
        '.text-balance': {
          textWrap: 'balance',
        },
        '.text-pretty': {
          textWrap: 'pretty',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.transform-style-3d': {
          transformStyle: 'preserve-3d',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.animate-glow': {
          animation: `${theme('animation.pulse')} 2s ease-in-out infinite`,
          boxShadow: theme('boxShadow.glow'),
        },
        '.hover-lift': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.lg'),
          },
        },
      });
    },
  ],
  
  // Future CSS features
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  // Experimental features
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
