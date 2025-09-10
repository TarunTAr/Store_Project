import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/user.service';

// Async thunks for user operations

// Get all users (Admin only)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(params);
      return {
        users: response.data.users || response.data,
        pagination: response.data.pagination,
        params,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

// Get user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// Create user (Admin only)
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(userId, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

// Delete user (Admin only)
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query, params);
      return {
        users: response.data.users || response.data,
        query,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'User search failed');
    }
  }
);

// Get users by role
export const fetchUsersByRole = createAsyncThunk(
  'users/fetchUsersByRole',
  async ({ role, params = {} }, { rejectWithValue }) => {
    try {
      const response = await userService.getUsersByRole(role, params);
      return { role, users: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users by role');
    }
  }
);

// Get user statistics
export const fetchUserStats = createAsyncThunk(
  'users/fetchUserStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getUserStats(userId);
      return { userId, stats: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user statistics');
    }
  }
);

// Get admin dashboard data
export const fetchAdminDashboard = createAsyncThunk(
  'users/fetchAdminDashboard',
  async (timeRange = '30d', { rejectWithValue }) => {
    try {
      const response = await userService.getAdminDashboard(timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin dashboard');
    }
  }
);

// Bulk user operations
export const bulkUserOperation = createAsyncThunk(
  'users/bulkUserOperation',
  async ({ operation, userIds, data = {} }, { rejectWithValue }) => {
    try {
      const response = await userService.bulkUserOperation(operation, userIds, data);
      return { operation, userIds, result: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Bulk operation failed');
    }
  }
);

// Initial state
const initialState = {
  // User data
  users: [],
  currentUser: null,
  usersByRole: {
    admin: [],
    user: [],
    store_owner: [],
    system_administrator: [],
  },
  searchResults: [],
  
  // Dashboard data
  adminDashboard: {
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    newUsersToday: 0,
    activeUsers: 0,
    userGrowth: [],
    roleDistribution: {},
    recentActivities: [],
  },
  
  // User statistics
  userStats: {}, // { userId: stats }
  
  // Pagination and filtering
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  
  // Search and filters
  searchQuery: '',
  filters: {
    role: '',
    status: 'active',
    dateFrom: null,
    dateTo: null,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  
  // Loading states
  loading: {
    users: false,
    user: false,
    search: false,
    create: false,
    update: false,
    delete: false,
    stats: false,
    dashboard: false,
    bulk: false,
    roleUsers: false,
  },
  
  // Error states
  errors: {
    users: null,
    user: null,
    search: null,
    create: null,
    update: null,
    delete: null,
    stats: null,
    dashboard: null,
    bulk: null,
    roleUsers: null,
  },
  
  // UI state
  selectedUserIds: [],
  showUserForm: false,
  userFormData: {
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
    isEditing: false,
    editingUserId: null,
  },
  showBulkActions: false,
  viewMode: 'table', // 'table', 'grid'
};

// User slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Clear users
    clearUsers: (state) => {
      state.users = [];
      state.searchResults = [];
      state.currentUser = null;
      state.selectedUserIds = [];
      state.searchQuery = '';
    },
    
    // Set selected users
    setSelectedUsers: (state, action) => {
      state.selectedUserIds = action.payload;
    },
    
    // Toggle user selection
    toggleUserSelection: (state, action) => {
      const userId = action.payload;
      const index = state.selectedUserIds.indexOf(userId);
      
      if (index > -1) {
        state.selectedUserIds.splice(index, 1);
      } else {
        state.selectedUserIds.push(userId);
      }
    },
    
    // Select all users
    selectAllUsers: (state) => {
      state.selectedUserIds = state.users.map(user => user.id);
    },
    
    // Clear user selection
    clearUserSelection: (state) => {
      state.selectedUserIds = [];
    },
    
    // Update search query
    setUserSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Clear search results
    clearUserSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    // Update filters
    updateUserFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear filters
    clearUserFilters: (state) => {
      state.filters = {
        role: '',
        status: 'active',
        dateFrom: null,
        dateTo: null,
        sortBy: 'name',
        sortOrder: 'asc',
      };
    },
    
    // Show user form
    showUserForm: (state, action) => {
      state.showUserForm = true;
      if (action.payload) {
        const user = action.payload;
        state.userFormData = {
          name: user.name || '',
          email: user.email || '',
          address: user.address || '',
          password: '',
          role: user.role || 'user',
          isEditing: true,
          editingUserId: user.id,
        };
      } else {
        state.userFormData = {
          name: '',
          email: '',
          address: '',
          password: '',
          role: 'user',
          isEditing: false,
          editingUserId: null,
        };
      }
    },
    
    // Hide user form
    hideUserForm: (state) => {
      state.showUserForm = false;
      state.userFormData = {
        name: '',
        email: '',
        address: '',
        password: '',
        role: 'user',
        isEditing: false,
        editingUserId: null,
      };
    },
    
    // Update user form data
    updateUserFormData: (state, action) => {
      state.userFormData = {
        ...state.userFormData,
        ...action.payload,
      };
    },
    
    // Toggle bulk actions
    toggleBulkActions: (state) => {
      state.showBulkActions = !state.showBulkActions;
    },
    
    // Set view mode
    setUserViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    // Clear specific error
    clearUserError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },
    
    // Clear all errors
    clearAllUserErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Update user status locally
    updateUserStatus: (state, action) => {
      const { userId, isActive } = action.payload;
      
      const userIndex = state.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].isActive = isActive;
      }
      
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser.isActive = isActive;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch users cases
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading.users = true;
        state.errors.users = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination || state.pagination;
        state.errors.users = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.errors.users = action.payload;
        state.users = [];
      });

    // Fetch user by ID cases
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading.user = true;
        state.errors.user = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading.user = false;
        state.currentUser = action.payload;
        state.errors.user = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading.user = false;
        state.errors.user = action.payload;
        state.currentUser = null;
      });

    // Create user cases
    builder
      .addCase(createUser.pending, (state) => {
        state.loading.create = true;
        state.errors.create = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading.create = false;
        state.users.unshift(action.payload);
        state.errors.create = null;
        state.showUserForm = false;
        
        // Update role-specific arrays
        const role = action.payload.role;
        if (state.usersByRole[role]) {
          state.usersByRole[role].unshift(action.payload);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading.create = false;
        state.errors.create = action.payload;
      });

    // Update user cases
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading.update = true;
        state.errors.update = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedUser = action.payload;
        
        // Update in users array
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        
        // Update current user if it's the same
        if (state.currentUser && state.currentUser.id === updatedUser.id) {
          state.currentUser = updatedUser;
        }
        
        state.errors.update = null;
        state.showUserForm = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.update = action.payload;
      });

    // Delete user cases
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading.delete = true;
        state.errors.delete = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading.delete = false;
        const deletedUserId = action.payload;
        
        // Remove from users array
        state.users = state.users.filter(user => user.id !== deletedUserId);
        
        // Remove from role-specific arrays
        Object.keys(state.usersByRole).forEach(role => {
          state.usersByRole[role] = state.usersByRole[role].filter(
            user => user.id !== deletedUserId
          );
        });
        
        // Clear current user if it was deleted
        if (state.currentUser && state.currentUser.id === deletedUserId) {
          state.currentUser = null;
        }
        
        // Remove from selection
        state.selectedUserIds = state.selectedUserIds.filter(id => id !== deletedUserId);
        
        state.errors.delete = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading.delete = false;
        state.errors.delete = action.payload;
      });

    // Search users cases
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading.search = true;
        state.errors.search = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.users;
        state.searchQuery = action.payload.query;
        state.pagination = action.payload.pagination || state.pagination;
        state.errors.search = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading.search = false;
        state.errors.search = action.payload;
        state.searchResults = [];
      });

    // Fetch users by role cases
    builder
      .addCase(fetchUsersByRole.pending, (state) => {
        state.loading.roleUsers = true;
        state.errors.roleUsers = null;
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.loading.roleUsers = false;
        const { role, users } = action.payload;
        state.usersByRole[role] = users;
        state.errors.roleUsers = null;
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.loading.roleUsers = false;
        state.errors.roleUsers = action.payload;
      });

    // Fetch user stats cases
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading.stats = true;
        state.errors.stats = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        const { userId, stats } = action.payload;
        state.userStats[userId] = stats;
        state.errors.stats = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.errors.stats = action.payload;
      });

    // Fetch admin dashboard cases
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading.dashboard = true;
        state.errors.dashboard = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.adminDashboard = action.payload;
        state.errors.dashboard = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.errors.dashboard = action.payload;
      });

    // Bulk user operation cases
    builder
      .addCase(bulkUserOperation.pending, (state) => {
        state.loading.bulk = true;
        state.errors.bulk = null;
      })
      .addCase(bulkUserOperation.fulfilled, (state, action) => {
        state.loading.bulk = false;
        const { operation, userIds } = action.payload;
        
        // Handle different bulk operations
        switch (operation) {
          case 'delete':
            state.users = state.users.filter(user => !userIds.includes(user.id));
            break;
          case 'activate':
            state.users = state.users.map(user => 
              userIds.includes(user.id) ? { ...user, isActive: true } : user
            );
            break;
          case 'deactivate':
            state.users = state.users.map(user => 
              userIds.includes(user.id) ? { ...user, isActive: false } : user
            );
            break;
        }
        
        state.selectedUserIds = [];
        state.errors.bulk = null;
      })
      .addCase(bulkUserOperation.rejected, (state, action) => {
        state.loading.bulk = false;
        state.errors.bulk = action.payload;
      });
  },
});

// Export actions
export const {
  clearUsers,
  setSelectedUsers,
  toggleUserSelection,
  selectAllUsers,
  clearUserSelection,
  setUserSearchQuery,
  clearUserSearchResults,
  updateUserFilters,
  clearUserFilters,
  showUserForm,
  hideUserForm,
  updateUserFormData,
  toggleBulkActions,
  setUserViewMode,
  clearUserError,
  clearAllUserErrors,
  updateUserStatus,
} = userSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersByRole = (role) => (state) => state.users.usersByRole[role] || [];
export const selectUserSearchResults = (state) => state.users.searchResults;
export const selectUserSearchQuery = (state) => state.users.searchQuery;
export const selectUserFilters = (state) => state.users.filters;
export const selectUserPagination = (state) => state.users.pagination;
export const selectUserLoading = (state) => state.users.loading;
export const selectUserErrors = (state) => state.users.errors;
export const selectSelectedUserIds = (state) => state.users.selectedUserIds;
export const selectShowUserForm = (state) => state.users.showUserForm;
export const selectUserFormData = (state) => state.users.userFormData;
export const selectShowBulkActions = (state) => state.users.showBulkActions;
export const selectUserViewMode = (state) => state.users.viewMode;
export const selectAdminDashboard = (state) => state.users.adminDashboard;
export const selectUserStats = (userId) => (state) => state.users.userStats[userId] || null;

// Complex selectors
export const selectFilteredUsers = (state) => {
  const { users, filters } = state.users;
  let filtered = [...users];

  // Filter by role
  if (filters.role) {
    filtered = filtered.filter(user => user.role === filters.role);
  }

  // Filter by status
  if (filters.status === 'active') {
    filtered = filtered.filter(user => user.isActive);
  } else if (filters.status === 'inactive') {
    filtered = filtered.filter(user => !user.isActive);
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[filters.sortBy] || '';
    const bValue = b[filters.sortBy] || '';
    
    if (filters.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
};

export const selectUserById = (userId) => (state) => {
  return state.users.users.find(user => user.id === userId) || null;
};

export const selectIsUserLoading = (loadingType) => (state) => {
  return state.users.loading[loadingType] || false;
};

export const selectUserError = (errorType) => (state) => {
  return state.users.errors[errorType] || null;
};

export const selectSelectedUsersCount = (state) => state.users.selectedUserIds.length;

export const selectCanBulkDelete = (state) => {
  return state.users.selectedUserIds.length > 0;
};

export default userSlice.reducer;
