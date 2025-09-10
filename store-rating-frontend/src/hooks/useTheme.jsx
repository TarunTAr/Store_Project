import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useLocalStorage from './useLocalStorage';

// Theme Context
const CustomThemeContext = createContext();

// Theme Provider Component
export const CustomThemeProvider = ({ children }) => {
  const { value: themeSettings, setValue: setThemeSettings } = useLocalStorage('theme-settings', {
    mode: 'light',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    fontSize: 'medium',
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif'
  });

  const [systemPreference, setSystemPreference] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
      
      const handleChange = (e) => {
        setSystemPreference(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Get effective theme mode
  const getEffectiveMode = useCallback(() => {
    if (themeSettings.mode === 'system') {
      return systemPreference;
    }
    return themeSettings.mode;
  }, [themeSettings.mode, systemPreference]);

  const effectiveMode = getEffectiveMode();

  // Create Material-UI theme
  const createCustomTheme = useCallback(() => {
    const isLight = effectiveMode === 'light';
    
    const fontSizes = {
      small: { fontSize: 13 },
      medium: { fontSize: 14 },
      large: { fontSize: 16 }
    };

    const baseTheme = createTheme({
      palette: {
        mode: effectiveMode,
        primary: {
          main: themeSettings.primaryColor,
          light: isLight ? '#8b9aff' : '#5a6fd8',
          dark: isLight ? '#4c5dd1' : '#3d4fb5',
          contrastText: '#ffffff'
        },
        secondary: {
          main: themeSettings.secondaryColor,
          light: isLight ? '#9570d4' : '#6a4c93',
          dark: isLight ? '#5e4687' : '#4a3269',
          contrastText: '#ffffff'
        },
        background: {
          default: isLight ? '#f8fafc' : '#0f0f0f',
          paper: isLight ? '#ffffff' : '#1a1a1a',
          elevated: isLight ? '#ffffff' : '#2a2a2a'
        },
        text: {
          primary: isLight ? '#1f2937' : '#f9fafb',
          secondary: isLight ? '#6b7280' : '#d1d5db'
        },
        divider: isLight ? '#e5e7eb' : '#374151',
        action: {
          hover: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
          selected: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)'
        }
      },
      typography: {
        fontFamily: themeSettings.fontFamily,
        ...fontSizes[themeSettings.fontSize],
        h1: { fontWeight: 800 },
        h2: { fontWeight: 800 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 }
      },
      shape: {
        borderRadius: themeSettings.borderRadius
      },
      shadows: isLight ? [
        'none',
        '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
        '0px 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23)',
        '0px 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23)',
        '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
        '0px 19px 38px rgba(0,0,0,0.30), 0px 15px 12px rgba(0,0,0,0.22)',
        ...Array(19).fill('0px 19px 38px rgba(0,0,0,0.30), 0px 15px 12px rgba(0,0,0,0.22)')
      ] : [
        'none',
        '0px 1px 3px rgba(0,0,0,0.5), 0px 1px 2px rgba(0,0,0,0.6)',
        '0px 3px 6px rgba(0,0,0,0.6), 0px 3px 6px rgba(0,0,0,0.7)',
        '0px 10px 20px rgba(0,0,0,0.7), 0px 6px 6px rgba(0,0,0,0.8)',
        '0px 14px 28px rgba(0,0,0,0.8), 0px 10px 10px rgba(0,0,0,0.8)',
        '0px 19px 38px rgba(0,0,0,0.9), 0px 15px 12px rgba(0,0,0,0.8)',
        ...Array(19).fill('0px 19px 38px rgba(0,0,0,0.9), 0px 15px 12px rgba(0,0,0,0.8)')
      ]
    });

    // Custom component overrides
    return createTheme(baseTheme, {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              fontFamily: themeSettings.fontFamily,
              scrollbarWidth: 'thin',
              scrollbarColor: `${themeSettings.primaryColor}40 transparent`,
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                background: `${themeSettings.primaryColor}40`,
                borderRadius: 4,
                '&:hover': {
                  background: `${themeSettings.primaryColor}60`
                }
              }
            }
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: themeSettings.borderRadius,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: fontSizes[themeSettings.fontSize].fontSize
            },
            contained: {
              boxShadow: `0 4px 12px ${themeSettings.primaryColor}30`,
              '&:hover': {
                boxShadow: `0 6px 16px ${themeSettings.primaryColor}40`,
                transform: 'translateY(-1px)'
              }
            }
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: themeSettings.borderRadius,
              border: `1px solid ${baseTheme.palette.divider}`,
              backgroundImage: 'none'
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: themeSettings.borderRadius,
              backgroundImage: 'none'
            },
            elevation1: {
              boxShadow: isLight 
                ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                : '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.6)'
            }
          }
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: themeSettings.borderRadius
              }
            }
          }
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: themeSettings.borderRadius / 2
            }
          }
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: themeSettings.borderRadius * 1.5
            }
          }
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              background: `linear-gradient(135deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
            }
          }
        }
      }
    });
  }, [effectiveMode, themeSettings]);

  const theme = createCustomTheme();

  // Theme manipulation functions
  const setMode = useCallback((mode) => {
    setThemeSettings(prev => ({ ...prev, mode }));
  }, [setThemeSettings]);

  const setPrimaryColor = useCallback((color) => {
    setThemeSettings(prev => ({ ...prev, primaryColor: color }));
  }, [setThemeSettings]);

  const setSecondaryColor = useCallback((color) => {
    setThemeSettings(prev => ({ ...prev, secondaryColor: color }));
  }, [setThemeSettings]);

  const setFontSize = useCallback((fontSize) => {
    setThemeSettings(prev => ({ ...prev, fontSize }));
  }, [setThemeSettings]);

  const setBorderRadius = useCallback((borderRadius) => {
    setThemeSettings(prev => ({ ...prev, borderRadius }));
  }, [setThemeSettings]);

  const setFontFamily = useCallback((fontFamily) => {
    setThemeSettings(prev => ({ ...prev, fontFamily }));
  }, [setThemeSettings]);

  const resetTheme = useCallback(() => {
    setThemeSettings({
      mode: 'light',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      fontSize: 'medium',
      borderRadius: 12,
      fontFamily: 'Inter, sans-serif'
    });
  }, [setThemeSettings]);

  const toggleMode = useCallback(() => {
    const currentMode = effectiveMode;
    setMode(currentMode === 'light' ? 'dark' : 'light');
  }, [effectiveMode, setMode]);

  // Predefined color schemes
  const colorSchemes = {
    default: { primary: '#667eea', secondary: '#764ba2' },
    ocean: { primary: '#0ea5e9', secondary: '#06b6d4' },
    forest: { primary: '#10b981', secondary: '#059669' },
    sunset: { primary: '#f59e0b', secondary: '#d97706' },
    rose: { primary: '#f43f5e', secondary: '#e11d48' },
    purple: { primary: '#8b5cf6', secondary: '#7c3aed' }
  };

  const setColorScheme = useCallback((schemeName) => {
    const scheme = colorSchemes[schemeName];
    if (scheme) {
      setThemeSettings(prev => ({
        ...prev,
        primaryColor: scheme.primary,
        secondaryColor: scheme.secondary
      }));
    }
  }, [setThemeSettings]);

  const value = {
    theme,
    settings: themeSettings,
    effectiveMode,
    systemPreference,
    setMode,
    setPrimaryColor,
    setSecondaryColor,
    setFontSize,
    setBorderRadius,
    setFontFamily,
    resetTheme,
    toggleMode,
    colorSchemes,
    setColorScheme,
    isLight: effectiveMode === 'light',
    isDark: effectiveMode === 'dark'
  };

  return (
    <CustomThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

// Main hook
const useTheme = () => {
  const context = useContext(CustomThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  
  return context;
};

// Utility hook for responsive design
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  const isLarge = windowSize.width >= 1440;

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : 'large'
  };
};

export default useTheme;
