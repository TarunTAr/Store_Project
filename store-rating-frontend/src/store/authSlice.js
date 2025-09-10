import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/auth.service';

// Async thunks for authentication operations

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      // Clear other slices on logout
      dispatch({ type: 'stores/clearStores' });
      dispatch({ type: 'ratings/clearRatings' });
      dispatch({ type: 'users/clearUsers' });
      return true;
    } catch (error) {
      // Even if logout fails, clear local state
      return true;
    }
  }
);

// Verify token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.verifyToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Token verification failed');
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Password change failed');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
  sessionExpiry: null,
  permissions: [],
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  // Role-based state
  roleCapabilities: {
    canCreateStores: false,
    canCreateUsers: false,
    canViewAllUsers: false,
    canViewAllStores: false,
    canModerateRatings: false,
    canAccessAnalytics: false,
  },
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set user manually (for token refresh)
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.roleCapabilities = calculateRoleCapabilities(action.payload.role);
    },
    
    // Clear user session
    clearSession: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.permissions = [];
      state.roleCapabilities = initialState.roleCapabilities;
      state.error = null;
    },
    
    // Update user preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    
    // Update notification preferences
    updateNotificationPreferences: (state, action) => {
      state.preferences.notifications = {
        ...state.preferences.notifications,
        ...action.payload,
      };
    },
    
    // Set session expiry
    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload;
    },
    
    // Increment login attempts
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      state.lastLoginAttempt = new Date().toISOString();
    },
    
    // Reset login attempts
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    
    // Update user avatar
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
        state.roleCapabilities = calculateRoleCapabilities(action.payload.user.role);
        
        // Set session expiry if provided
        if (action.payload.expiresAt) {
          state.sessionExpiry = action.payload.expiresAt;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loginAttempts += 1;
        state.lastLoginAttempt = new Date().toISOString();
      });

    // Register cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.roleCapabilities = calculateRoleCapabilities(action.payload.user.role);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout cases
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.roleCapabilities = initialState.roleCapabilities;
        state.error = null;
        state.sessionExpiry = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear the state
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.roleCapabilities = initialState.roleCapabilities;
        state.sessionExpiry = null;
      });

    // Verify token cases
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.roleCapabilities = calculateRoleCapabilities(action.payload.user.role);
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.roleCapabilities = initialState.roleCapabilities;
        state.error = action.payload;
      });

    // Update profile cases
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.user };
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Change password cases
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Helper function to calculate role capabilities
const calculateRoleCapabilities = (role) => {
  switch (role) {
    case 'system_administrator':
    case 'admin':
      return {
        canCreateStores: true,
        canCreateUsers: true,
        canViewAllUsers: true,
        canViewAllStores: true,
        canModerateRatings: true,
        canAccessAnalytics: true,
      };
    case 'store_owner':
      return {
        canCreateStores: false,
        canCreateUsers: false,
        canViewAllUsers: false,
        canViewAllStores: false,
        canModerateRatings: false,
        canAccessAnalytics: true, // For their own store
      };
    case 'user':
    default:
      return {
        canCreateStores: false,
        canCreateUsers: false,
        canViewAllUsers: false,
        canViewAllStores: false,
        canModerateRatings: false,
        canAccessAnalytics: false,
      };
  }
};

// Export actions
export const {
  clearError,
  setUser,
  clearSession,
  updatePreferences,
  updateNotificationPreferences,
  setSessionExpiry,
  incrementLoginAttempts,
  resetLoginAttempts,
  updateAvatar,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectRoleCapabilities = (state) => state.auth.roleCapabilities;
export const selectUserPreferences = (state) => state.auth.preferences;

// Role checking selectors
export const selectIsAdmin = (state) => 
  ['admin', 'system_administrator'].includes(state.auth.user?.role);
export const selectIsStoreOwner = (state) => 
  state.auth.user?.role === 'store_owner';
export const selectIsUser = (state) => 
  state.auth.user?.role === 'user';

// Permission selectors
export const selectCanCreateStores = (state) => 
  state.auth.roleCapabilities.canCreateStores;
export const selectCanCreateUsers = (state) => 
  state.auth.roleCapabilities.canCreateUsers;
export const selectCanViewAllUsers = (state) => 
  state.auth.roleCapabilities.canViewAllUsers;
export const selectCanViewAllStores = (state) => 
  state.auth.roleCapabilities.canViewAllStores;
export const selectCanModerateRatings = (state) => 
  state.auth.roleCapabilities.canModerateRatings;
export const selectCanAccessAnalytics = (state) => 
  state.auth.roleCapabilities.canAccessAnalytics;

// Complex selectors
export const selectLoginAttemptStatus = (state) => ({
  attempts: state.auth.loginAttempts,
  lastAttempt: state.auth.lastLoginAttempt,
  isBlocked: state.auth.loginAttempts >= 5,
});

export const selectSessionStatus = (state) => {
  const now = new Date().getTime();
  const expiry = state.auth.sessionExpiry ? new Date(state.auth.sessionExpiry).getTime() : null;
  
  return {
    isExpired: expiry ? now > expiry : false,
    timeUntilExpiry: expiry ? Math.max(0, expiry - now) : null,
  };
};

export default authSlice.reducer;
