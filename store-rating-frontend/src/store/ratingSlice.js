import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ratingService from '../services/rating.service';

// Async thunks for rating operations

// Submit rating
export const submitRating = createAsyncThunk(
  'ratings/submitRating',
  async (ratingData, { rejectWithValue, dispatch }) => {
    try {
      const response = await ratingService.submitRating(ratingData);
      
      // Update store rating in store slice
      dispatch({
        type: 'stores/updateStoreRating',
        payload: {
          storeId: ratingData.storeId,
          rating: response.data.newAverageRating,
          userRating: response.data.rating,
        },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit rating');
    }
  }
);

// Update rating
export const updateRating = createAsyncThunk(
  'ratings/updateRating',
  async ({ ratingId, ratingData }, { rejectWithValue }) => {
    try {
      const response = await ratingService.updateRating(ratingId, ratingData);
      return { ratingId, updatedRating: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update rating');
    }
  }
);

// Delete rating
export const deleteRating = createAsyncThunk(
  'ratings/deleteRating',
  async (ratingId, { rejectWithValue }) => {
    try {
      await ratingService.deleteRating(ratingId);
      return ratingId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete rating');
    }
  }
);

// Get store ratings
export const fetchStoreRatings = createAsyncThunk(
  'ratings/fetchStoreRatings',
  async ({ storeId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await ratingService.getStoreRatings(storeId, params);
      return {
        storeId,
        ratings: response.data.ratings || response.data,
        pagination: response.data.pagination,
        params,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch store ratings');
    }
  }
);

// Get user's rating for a store
export const fetchUserStoreRating = createAsyncThunk(
  'ratings/fetchUserStoreRating',
  async ({ storeId, userId }, { rejectWithValue }) => {
    try {
      const response = await ratingService.getUserStoreRating(storeId, userId);
      return { storeId, rating: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user rating');
    }
  }
);

// Get store ratings with user details (Store Owner)
export const fetchStoreRatingsWithUsers = createAsyncThunk(
  'ratings/fetchStoreRatingsWithUsers',
  async ({ storeId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await ratingService.getStoreRatingsWithUsers(storeId, params);
      return {
        storeId,
        ratings: response.data.ratings || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch detailed ratings');
    }
  }
);

// Get rating statistics
export const fetchRatingStats = createAsyncThunk(
  'ratings/fetchRatingStats',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await ratingService.getStoreRatingStats(storeId);
      return { storeId, stats: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch rating statistics');
    }
  }
);

// Initial state
const initialState = {
  // Rating data
  storeRatings: {}, // { storeId: { ratings: [], pagination: {}, stats: {} } }
  userRatings: {}, // { storeId: rating }
  currentRatings: [], // Currently displayed ratings
  
  // Pagination and filtering
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  
  // Filters
  filters: {
    rating: 0, // Filter by star rating
    sortBy: 'createdAt', // createdAt, rating, helpful
    sortOrder: 'desc', // asc, desc
    withReviews: false, // Only ratings with text reviews
  },
  
  // Loading states
  loading: {
    submit: false,
    update: false,
    delete: false,
    fetch: false,
    userRating: false,
    stats: false,
  },
  
  // Error states
  errors: {
    submit: null,
    update: null,
    delete: null,
    fetch: null,
    userRating: null,
    stats: null,
  },
  
  // UI state
  selectedRatingId: null,
  showRatingForm: false,
  ratingFormData: {
    storeId: null,
    rating: 0,
    review: '',
    isEditing: false,
    editingRatingId: null,
  },
  
  // Statistics
  overallStats: {
    totalRatings: 0,
    averageRating: 0,
    distribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
};

// Rating slice
const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    // Clear ratings
    clearRatings: (state) => {
      state.storeRatings = {};
      state.userRatings = {};
      state.currentRatings = [];
      state.selectedRatingId = null;
    },
    
    // Clear store ratings
    clearStoreRatings: (state, action) => {
      const storeId = action.payload;
      if (state.storeRatings[storeId]) {
        delete state.storeRatings[storeId];
      }
      if (state.userRatings[storeId]) {
        delete state.userRatings[storeId];
      }
    },
    
    // Set selected rating
    setSelectedRating: (state, action) => {
      state.selectedRatingId = action.payload;
    },
    
    // Clear selected rating
    clearSelectedRating: (state) => {
      state.selectedRatingId = null;
    },
    
    // Show rating form
    showRatingForm: (state, action) => {
      state.showRatingForm = true;
      state.ratingFormData = {
        storeId: action.payload.storeId,
        rating: action.payload.rating || 0,
        review: action.payload.review || '',
        isEditing: action.payload.isEditing || false,
        editingRatingId: action.payload.ratingId || null,
      };
    },
    
    // Hide rating form
    hideRatingForm: (state) => {
      state.showRatingForm = false;
      state.ratingFormData = {
        storeId: null,
        rating: 0,
        review: '',
        isEditing: false,
        editingRatingId: null,
      };
    },
    
    // Update rating form data
    updateRatingFormData: (state, action) => {
      state.ratingFormData = {
        ...state.ratingFormData,
        ...action.payload,
      };
    },
    
    // Update filters
    updateRatingFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear filters
    clearRatingFilters: (state) => {
      state.filters = {
        rating: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        withReviews: false,
      };
    },
    
    // Clear specific error
    clearRatingError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },
    
    // Clear all errors
    clearAllRatingErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Set user rating for store (optimistic update)
    setUserRating: (state, action) => {
      const { storeId, rating } = action.payload;
      state.userRatings[storeId] = rating;
    },
    
    // Remove user rating for store
    removeUserRating: (state, action) => {
      const storeId = action.payload;
      if (state.userRatings[storeId]) {
        delete state.userRatings[storeId];
      }
    },
  },
  extraReducers: (builder) => {
    // Submit rating cases
    builder
      .addCase(submitRating.pending, (state) => {
        state.loading.submit = true;
        state.errors.submit = null;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        state.loading.submit = false;
        const { storeId, rating, id } = action.payload;
        
        // Add to user ratings
        state.userRatings[storeId] = { rating: rating, id };
        
        // Add to store ratings if we have them loaded
        if (state.storeRatings[storeId]) {
          state.storeRatings[storeId].ratings.unshift(action.payload);
        }
        
        state.errors.submit = null;
        state.showRatingForm = false;
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading.submit = false;
        state.errors.submit = action.payload;
      });

    // Update rating cases
    builder
      .addCase(updateRating.pending, (state) => {
        state.loading.update = true;
        state.errors.update = null;
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.loading.update = false;
        const { ratingId, updatedRating } = action.payload;
        
        // Update in user ratings
        const storeId = updatedRating.storeId;
        if (state.userRatings[storeId]) {
          state.userRatings[storeId] = updatedRating;
        }
        
        // Update in store ratings
        if (state.storeRatings[storeId]) {
          const index = state.storeRatings[storeId].ratings.findIndex(r => r.id === ratingId);
          if (index !== -1) {
            state.storeRatings[storeId].ratings[index] = updatedRating;
          }
        }
        
        // Update in current ratings
        const currentIndex = state.currentRatings.findIndex(r => r.id === ratingId);
        if (currentIndex !== -1) {
          state.currentRatings[currentIndex] = updatedRating;
        }
        
        state.errors.update = null;
        state.showRatingForm = false;
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.update = action.payload;
      });

    // Delete rating cases
    builder
      .addCase(deleteRating.pending, (state) => {
        state.loading.delete = true;
        state.errors.delete = null;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.loading.delete = false;
        const ratingId = action.payload;
        
        // Remove from all relevant places
        Object.keys(state.storeRatings).forEach(storeId => {
          state.storeRatings[storeId].ratings = state.storeRatings[storeId].ratings.filter(
            r => r.id !== ratingId
          );
        });
        
        // Remove from current ratings
        state.currentRatings = state.currentRatings.filter(r => r.id !== ratingId);
        
        // Clear selected rating if it was deleted
        if (state.selectedRatingId === ratingId) {
          state.selectedRatingId = null;
        }
        
        state.errors.delete = null;
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.loading.delete = false;
        state.errors.delete = action.payload;
      });

    // Fetch store ratings cases
    builder
      .addCase(fetchStoreRatings.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchStoreRatings.fulfilled, (state, action) => {
        state.loading.fetch = false;
        const { storeId, ratings, pagination } = action.payload;
        
        // Initialize store ratings if not exists
        if (!state.storeRatings[storeId]) {
          state.storeRatings[storeId] = { ratings: [], pagination: {}, stats: {} };
        }
        
        state.storeRatings[storeId].ratings = ratings;
        state.storeRatings[storeId].pagination = pagination || state.pagination;
        state.currentRatings = ratings;
        state.pagination = pagination || state.pagination;
        state.errors.fetch = null;
      })
      .addCase(fetchStoreRatings.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
        state.currentRatings = [];
      });

    // Fetch user store rating cases
    builder
      .addCase(fetchUserStoreRating.pending, (state) => {
        state.loading.userRating = true;
        state.errors.userRating = null;
      })
      .addCase(fetchUserStoreRating.fulfilled, (state, action) => {
        state.loading.userRating = false;
        const { storeId, rating } = action.payload;
        state.userRatings[storeId] = rating;
        state.errors.userRating = null;
      })
      .addCase(fetchUserStoreRating.rejected, (state, action) => {
        state.loading.userRating = false;
        state.errors.userRating = action.payload;
      });

    // Fetch store ratings with users cases
    builder
      .addCase(fetchStoreRatingsWithUsers.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchStoreRatingsWithUsers.fulfilled, (state, action) => {
        state.loading.fetch = false;
        const { storeId, ratings, pagination } = action.payload;
        
        if (!state.storeRatings[storeId]) {
          state.storeRatings[storeId] = { ratings: [], pagination: {}, stats: {} };
        }
        
        state.storeRatings[storeId].ratings = ratings;
        state.storeRatings[storeId].pagination = pagination || state.pagination;
        state.currentRatings = ratings;
        state.pagination = pagination || state.pagination;
        state.errors.fetch = null;
      })
      .addCase(fetchStoreRatingsWithUsers.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
      });

    // Fetch rating stats cases
    builder
      .addCase(fetchRatingStats.pending, (state) => {
        state.loading.stats = true;
        state.errors.stats = null;
      })
      .addCase(fetchRatingStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        const { storeId, stats } = action.payload;
        
        if (!state.storeRatings[storeId]) {
          state.storeRatings[storeId] = { ratings: [], pagination: {}, stats: {} };
        }
        
        state.storeRatings[storeId].stats = stats;
        state.overallStats = stats;
        state.errors.stats = null;
      })
      .addCase(fetchRatingStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.errors.stats = action.payload;
      });
  },
});

// Export actions
export const {
  clearRatings,
  clearStoreRatings,
  setSelectedRating,
  clearSelectedRating,
  showRatingForm,
  hideRatingForm,
  updateRatingFormData,
  updateRatingFilters,
  clearRatingFilters,
  clearRatingError,
  clearAllRatingErrors,
  setUserRating,
  removeUserRating,
} = ratingSlice.actions;

// Selectors
export const selectStoreRatings = (storeId) => (state) => 
  state.ratings.storeRatings[storeId]?.ratings || [];

export const selectUserStoreRating = (storeId) => (state) => 
  state.ratings.userRatings[storeId] || null;

export const selectCurrentRatings = (state) => state.ratings.currentRatings;
export const selectRatingPagination = (state) => state.ratings.pagination;
export const selectRatingFilters = (state) => state.ratings.filters;
export const selectRatingLoading = (state) => state.ratings.loading;
export const selectRatingErrors = (state) => state.ratings.errors;
export const selectSelectedRatingId = (state) => state.ratings.selectedRatingId;
export const selectShowRatingForm = (state) => state.ratings.showRatingForm;
export const selectRatingFormData = (state) => state.ratings.ratingFormData;
export const selectOverallStats = (state) => state.ratings.overallStats;

// Complex selectors
export const selectFilteredRatings = (state) => {
  const { currentRatings, filters } = state.ratings;
  let filtered = [...currentRatings];

  // Filter by rating
  if (filters.rating > 0) {
    filtered = filtered.filter(rating => rating.rating >= filters.rating);
  }

  // Filter by reviews
  if (filters.withReviews) {
    filtered = filtered.filter(rating => rating.review && rating.review.trim().length > 0);
  }

  // Sort
  filtered.sort((a, b) => {
    let aValue, bValue;
    
    switch (filters.sortBy) {
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'helpful':
        aValue = a.helpfulCount || 0;
        bValue = b.helpfulCount || 0;
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }
    
    if (filters.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
};

export const selectRatingStats = (storeId) => (state) => 
  state.ratings.storeRatings[storeId]?.stats || null;

export const selectIsRatingLoading = (loadingType) => (state) => 
  state.ratings.loading[loadingType] || false;

export const selectRatingError = (errorType) => (state) => 
  state.ratings.errors[errorType] || null;

export const selectCanUserRate = (storeId) => (state) => {
  const userRating = state.ratings.userRatings[storeId];
  return !userRating; // User can rate if they haven't rated before
};

export const selectCanUserEditRating = (storeId) => (state) => {
  const userRating = state.ratings.userRatings[storeId];
  return !!userRating; // User can edit if they have rated before
};

export default ratingSlice.reducer;
