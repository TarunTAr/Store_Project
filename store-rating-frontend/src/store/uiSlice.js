// ==========================================================================
// UI Slice - Store Rating Platform
// Manages UI state including modals, loading states, sidebar, etc.
// ==========================================================================

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Loading states
  loading: false,
  loadingMessage: '',
  
  // Layout states
  sidebarOpen: false,
  sidebarCollapsed: false,
  
  // Modal states
  modals: {
    confirmDialog: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
      type: 'info' // 'info', 'warning', 'error', 'success'
    },
    userForm: {
      open: false,
      mode: 'create', // 'create', 'edit', 'view'
      user: null
    },
    storeForm: {
      open: false,
      mode: 'create', // 'create', 'edit', 'view'
      store: null
    },
    ratingForm: {
      open: false,
      store: null,
      existingRating: null
    }
  },
  
  // Notification system
  notifications: [],
  
  // Theme and preferences
  theme: 'light', // 'light', 'dark', 'system'
  
  // Search and filters
  searchQuery: '',
  activeFilters: {},
  
  // Page states
  currentPage: 1,
  pageSize: 10,
  sortBy: 'name',
  sortOrder: 'asc', // 'asc', 'desc'
  
  // Error states
  errors: {},
  
  // Success messages
  successMessage: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setLoadingWithMessage: (state, action) => {
      state.loading = action.payload.loading;
      state.loadingMessage = action.payload.message || '';
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    // Modal actions - Confirm Dialog
    openConfirmDialog: (state, action) => {
      state.modals.confirmDialog = {
        open: true,
        title: action.payload.title || 'Confirm Action',
        message: action.payload.message || 'Are you sure?',
        onConfirm: action.payload.onConfirm || null,
        type: action.payload.type || 'info'
      };
    },
    
    closeConfirmDialog: (state) => {
      state.modals.confirmDialog = {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'info'
      };
    },
    
    // Modal actions - User Form
    openUserForm: (state, action) => {
      state.modals.userForm = {
        open: true,
        mode: action.payload.mode || 'create',
        user: action.payload.user || null
      };
    },
    
    closeUserForm: (state) => {
      state.modals.userForm = {
        open: false,
        mode: 'create',
        user: null
      };
    },
    
    // Modal actions - Store Form
    openStoreForm: (state, action) => {
      state.modals.storeForm = {
        open: true,
        mode: action.payload.mode || 'create',
        store: action.payload.store || null
      };
    },
    
    closeStoreForm: (state) => {
      state.modals.storeForm = {
        open: false,
        mode: 'create',
        store: null
      };
    },
    
    // Modal actions - Rating Form
    openRatingForm: (state, action) => {
      state.modals.ratingForm = {
        open: true,
        store: action.payload.store || null,
        existingRating: action.payload.existingRating || null
      };
    },
    
    closeRatingForm: (state) => {
      state.modals.ratingForm = {
        open: false,
        store: null,
        existingRating: null
      };
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'info',
        title: '',
        message: '',
        duration: 5000,
        ...action.payload
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Search and filter actions
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    setActiveFilters: (state, action) => {
      state.activeFilters = action.payload;
    },
    
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      if (value === null || value === undefined || value === '') {
        delete state.activeFilters[key];
      } else {
        state.activeFilters[key] = value;
      }
    },
    
    clearFilters: (state) => {
      state.activeFilters = {};
      state.searchQuery = '';
    },
    
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    
    // Sorting actions
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    
    toggleSortOrder: (state, action) => {
      const field = action.payload;
      if (state.sortBy === field) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = field;
        state.sortOrder = 'asc';
      }
    },
    
    // Error actions
    setError: (state, action) => {
      const { field, message } = action.payload;
      state.errors[field] = message;
    },
    
    clearError: (state, action) => {
      const field = action.payload;
      delete state.errors[field];
    },
    
    clearAllErrors: (state) => {
      state.errors = {};
    },
    
    // Success message actions
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Reset UI state
    resetUIState: (state) => {
      return {
        ...initialState,
        theme: state.theme, // Preserve theme preference
        sidebarCollapsed: state.sidebarCollapsed // Preserve sidebar preference
      };
    }
  }
});

// Export actions
export const {
  // Loading actions
  setLoading,
  setLoadingWithMessage,
  
  // Sidebar actions
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  
  // Modal actions
  openConfirmDialog,
  closeConfirmDialog,
  openUserForm,
  closeUserForm,
  openStoreForm,
  closeStoreForm,
  openRatingForm,
  closeRatingForm,
  
  // Notification actions
  addNotification,
  removeNotification,
  clearAllNotifications,
  
  // Theme actions
  setTheme,
  toggleTheme,
  
  // Search and filter actions
  setSearchQuery,
  setActiveFilters,
  updateFilter,
  clearFilters,
  
  // Pagination actions
  setCurrentPage,
  setPageSize,
  
  // Sorting actions
  setSorting,
  toggleSortOrder,
  
  // Error actions
  setError,
  clearError,
  clearAllErrors,
  
  // Success message actions
  setSuccessMessage,
  clearSuccessMessage,
  
  // Reset action
  resetUIState
} = uiSlice.actions;

// Selectors (optional - you can also create these in a separate selectors file)
export const selectLoading = (state) => state.ui.loading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModals = (state) => state.ui.modals;
export const selectNotifications = (state) => state.ui.notifications;
export const selectTheme = (state) => state.ui.theme;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectActiveFilters = (state) => state.ui.activeFilters;
export const selectPagination = (state) => ({
  currentPage: state.ui.currentPage,
  pageSize: state.ui.pageSize
});
export const selectSorting = (state) => ({
  sortBy: state.ui.sortBy,
  sortOrder: state.ui.sortOrder
});
export const selectErrors = (state) => state.ui.errors;
export const selectSuccessMessage = (state) => state.ui.successMessage;

// Export reducer as default
export default uiSlice.reducer;
