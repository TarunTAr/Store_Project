import { createSlice } from '@reduxjs/toolkit';

// Theme constants
const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

const COLOR_SCHEMES = {
  DEFAULT: { primary: '#667eea', secondary: '#764ba2' },
  OCEAN: { primary: '#0ea5e9', secondary: '#06b6d4' },
  FOREST: { primary: '#10b981', secondary: '#059669' },
  SUNSET: { primary: '#f59e0b', secondary: '#d97706' },
  ROSE: { primary: '#f43f5e', secondary: '#e11d48' },
  PURPLE: { primary: '#8b5cf6', secondary: '#7c3aed' }
};

// Initial state
const initialState = {
  // Theme settings
  mode: THEME_MODES.LIGHT,
  systemPreference: THEME_MODES.LIGHT,
  
  // Color scheme
  primaryColor: COLOR_SCHEMES.DEFAULT.primary,
  secondaryColor: COLOR_SCHEMES.DEFAULT.secondary,
  colorScheme: 'default',
  
  // Typography
  fontSize: FONT_SIZES.MEDIUM,
  fontFamily: 'Inter, sans-serif',
  
  // Layout
  borderRadius: 12,
  compactMode: false,
  sidebarCollapsed: false,
  sidebarWidth: 280,
  
  // Animation settings
  animationsEnabled: true,
  reducedMotion: false,
  
  // Accessibility
  highContrast: false,
  focusVisible: true,
  
  // Layout preferences
  layoutMode: 'default',
  gridDensity: 'comfortable',
  
  // UI preferences
  showTooltips: true,
  showAnimations: true,
  autoSaveSettings: true,
  
  // Development settings
  devMode: false,
  debugMode: false,
  
  // Responsive breakpoints (read-only)
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  },
  
  // Current screen info
  screen: {
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    breakpoint: 'lg',
    isMobile: false,
    isTablet: false,
    isDesktop: true
  }
};

// Helper functions
const calculateBreakpoint = (width, breakpoints) => {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

const updateScreenInfo = (state, width, height) => {
  state.screen.width = width;
  state.screen.height = height;
  state.screen.breakpoint = calculateBreakpoint(width, state.breakpoints);
  state.screen.isMobile = width < state.breakpoints.md;
  state.screen.isTablet = width >= state.breakpoints.md && width < state.breakpoints.lg;
  state.screen.isDesktop = width >= state.breakpoints.lg;
};

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // ✅ FIXED: Added both setTheme and setThemeMode for compatibility
    setTheme: (state, action) => {
      if (typeof action.payload === 'string') {
        state.mode = action.payload;
      } else if (action.payload && action.payload.mode) {
        state.mode = action.payload.mode;
      }
    },
    
    setThemeMode: (state, action) => {
      state.mode = action.payload;
    },
    
    // ✅ FIXED: Added both toggleTheme and toggleThemeMode for compatibility
    toggleTheme: (state) => {
      state.mode = state.mode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    },
    
    toggleThemeMode: (state) => {
      state.mode = state.mode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    },
    
    setSystemPreference: (state, action) => {
      state.systemPreference = action.payload;
    },
    
    // Color scheme actions
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
      state.colorScheme = 'custom';
    },
    
    setSecondaryColor: (state, action) => {
      state.secondaryColor = action.payload;
      state.colorScheme = 'custom';
    },
    
    setColorScheme: (state, action) => {
      const schemeName = action.payload;
      const scheme = COLOR_SCHEMES[schemeName.toUpperCase()];
      
      if (scheme) {
        state.colorScheme = schemeName;
        state.primaryColor = scheme.primary;
        state.secondaryColor = scheme.secondary;
      }
    },
    
    // Typography actions
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload;
    },
    
    // Layout actions
    setBorderRadius: (state, action) => {
      state.borderRadius = action.payload;
    },
    
    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode;
    },
    
    setCompactMode: (state, action) => {
      state.compactMode = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = Math.max(200, Math.min(400, action.payload));
    },
    
    setLayoutMode: (state, action) => {
      state.layoutMode = action.payload;
    },
    
    setGridDensity: (state, action) => {
      state.gridDensity = action.payload;
    },
    
    // Animation actions
    toggleAnimations: (state) => {
      state.animationsEnabled = !state.animationsEnabled;
    },
    
    setAnimationsEnabled: (state, action) => {
      state.animationsEnabled = action.payload;
    },
    
    setReducedMotion: (state, action) => {
      state.reducedMotion = action.payload;
      if (action.payload) {
        state.animationsEnabled = false;
      }
    },
    
    // Accessibility actions
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
    },
    
    setHighContrast: (state, action) => {
      state.highContrast = action.payload;
    },
    
    setFocusVisible: (state, action) => {
      state.focusVisible = action.payload;
    },
    
    // UI preferences
    toggleTooltips: (state) => {
      state.showTooltips = !state.showTooltips;
    },
    
    setShowTooltips: (state, action) => {
      state.showTooltips = action.payload;
    },
    
    setAutoSaveSettings: (state, action) => {
      state.autoSaveSettings = action.payload;
    },
    
    // Screen size update
    updateScreenSize: (state, action) => {
      const { width, height } = action.payload;
      updateScreenInfo(state, width, height);
      
      // Auto-collapse sidebar on mobile
      if (state.screen.isMobile && !state.sidebarCollapsed) {
        state.sidebarCollapsed = true;
      }
    },
    
    // Development settings
    toggleDevMode: (state) => {
      state.devMode = !state.devMode;
    },
    
    setDevMode: (state, action) => {
      state.devMode = action.payload;
    },
    
    setDebugMode: (state, action) => {
      state.debugMode = action.payload;
    },
    
    // Reset actions
    resetToDefaults: (state) => {
      Object.assign(state, initialState);
    },
    
    resetColors: (state) => {
      state.primaryColor = COLOR_SCHEMES.DEFAULT.primary;
      state.secondaryColor = COLOR_SCHEMES.DEFAULT.secondary;
      state.colorScheme = 'default';
    }
  }
});

// ✅ FIXED: Export both old and new action names for compatibility
export const {
  setTheme,           // ✅ For ThemeToggle compatibility
  setThemeMode,
  toggleTheme,        // ✅ For ThemeToggle compatibility
  toggleThemeMode,
  setSystemPreference,
  setPrimaryColor,
  setSecondaryColor,
  setColorScheme,
  setFontSize,
  setFontFamily,
  setBorderRadius,
  toggleCompactMode,
  setCompactMode,
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarWidth,
  setLayoutMode,
  setGridDensity,
  toggleAnimations,
  setAnimationsEnabled,
  setReducedMotion,
  toggleHighContrast,
  setHighContrast,
  setFocusVisible,
  toggleTooltips,
  setShowTooltips,
  setAutoSaveSettings,
  updateScreenSize,
  toggleDevMode,
  setDevMode,
  setDebugMode,
  resetToDefaults,
  resetColors
} = themeSlice.actions;

// Selectors
export const selectThemeMode = (state) => state.theme.mode;
export const selectSystemPreference = (state) => state.theme.systemPreference;
export const selectEffectiveThemeMode = (state) => {
  return state.theme.mode === THEME_MODES.SYSTEM 
    ? state.theme.systemPreference 
    : state.theme.mode;
};

// ✅ FIXED: Added darkMode selector for ThemeToggle compatibility
export const selectDarkMode = (state) => state.theme.mode === THEME_MODES.DARK;
export const selectPrimaryColor = (state) => state.theme.primaryColor;
export const selectSecondaryColor = (state) => state.theme.secondaryColor;
export const selectColorScheme = (state) => state.theme.colorScheme;
export const selectFontSize = (state) => state.theme.fontSize;
export const selectFontFamily = (state) => state.theme.fontFamily;
export const selectBorderRadius = (state) => state.theme.borderRadius;
export const selectCompactMode = (state) => state.theme.compactMode;
export const selectSidebarCollapsed = (state) => state.theme.sidebarCollapsed;
export const selectSidebarWidth = (state) => state.theme.sidebarWidth;
export const selectLayoutMode = (state) => state.theme.layoutMode;
export const selectGridDensity = (state) => state.theme.gridDensity;
export const selectAnimationsEnabled = (state) => state.theme.animationsEnabled;
export const selectReducedMotion = (state) => state.theme.reducedMotion;
export const selectHighContrast = (state) => state.theme.highContrast;
export const selectFocusVisible = (state) => state.theme.focusVisible;
export const selectShowTooltips = (state) => state.theme.showTooltips;
export const selectAutoSaveSettings = (state) => state.theme.autoSaveSettings;
export const selectScreenInfo = (state) => state.theme.screen;
export const selectBreakpoint = (state) => state.theme.screen.breakpoint;
export const selectIsMobile = (state) => state.theme.screen.isMobile;
export const selectIsTablet = (state) => state.theme.screen.isTablet;
export const selectIsDesktop = (state) => state.theme.screen.isDesktop;
export const selectDevMode = (state) => state.theme.devMode;
export const selectDebugMode = (state) => state.theme.debugMode;

export const selectIsLightTheme = (state) => selectEffectiveThemeMode(state) === THEME_MODES.LIGHT;
export const selectIsDarkTheme = (state) => selectEffectiveThemeMode(state) === THEME_MODES.DARK;

// Export theme constants
export { THEME_MODES, FONT_SIZES, COLOR_SCHEMES };

export default themeSlice.reducer;
