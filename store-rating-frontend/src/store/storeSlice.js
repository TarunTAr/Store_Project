import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeService from '../services/store.service';
import categoryService from '../services/category.service';

// Async thunks for store operations

// Get all stores
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await storeService.getAllStores(params);
      return {
        stores: response.data.stores || response.data,
        pagination: response.data.pagination,
        params,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch stores');
    }
  }
);

// Get store by ID
export const fetchStoreById = createAsyncThunk(
  'stores/fetchStoreById',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await storeService.getStoreById(storeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch store');
    }
  }
);

// Search stores
export const searchStores = createAsyncThunk(
  'stores/searchStores',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await storeService.searchStores(query, params);
      return {
        stores: response.data.stores || response.data,
        query,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

// Get nearby stores
export const fetchNearbyStores = createAsyncThunk(
  'stores/fetchNearbyStores',
  async ({ latitude, longitude, radius = 5 }, { rejectWithValue }) => {
    try {
      const response = await storeService.getNearbyStores(latitude, longitude, radius);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch nearby stores');
    }
  }
);

// Create store (Admin only)
export const createStore = createAsyncThunk(
  'stores/createStore',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await storeService.createStore(storeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create store');
    }
  }
);

// Update store
export const updateStore = createAsyncThunk(
  'stores/updateStore',
  async ({ storeId, storeData }, { rejectWithValue }) => {
    try {
      const response = await storeService.updateStore(storeId, storeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update store');
    }
  }
);

// Delete store (Admin only)
export const deleteStore = createAsyncThunk(
  'stores/deleteStore',
  async (storeId, { rejectWithValue }) => {
    try {
      await storeService.deleteStore(storeId);
      return storeId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete store');
    }
  }
);

// Get store categories
export const fetchStoreCategories = createAsyncThunk(
  'stores/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

// Get popular stores
export const fetchPopularStores = createAsyncThunk(
  'stores/fetchPopularStores',
  async ({ limit = 10, timeRange = '7d' } = {}, { rejectWithValue }) => {
    try {
      const response = await storeService.getPopularStores(limit, timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch popular stores');
    }
  }
);

// Get featured stores
export const fetchFeaturedStores = createAsyncThunk(
  'stores/fetchFeaturedStores',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await storeService.getFeaturedStores(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch featured stores');
    }
  }
);

// Initial state
const initialState = {
  // Store data
  stores: [],
  currentStore: null,
  popularStores: [],
  featuredStores: [],
  nearbyStores: [],
  
  // Categories
  categories: [],
  
  // Pagination and filtering
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  
  // Search and filters
  searchQuery: '',
  searchResults: [],
  filters: {
    category: '',
    rating: 0,
    location: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  
  // Loading states
  loading: {
    stores: false,
    store: false,
    search: false,
    nearby: false,
    popular: false,
    featured: false,
    categories: false,
    create: false,
    update: false,
    delete: false,
  },
  
  // Error states
  errors: {
    stores: null,
    store: null,
    search: null,
    nearby: null,
    popular: null,
    featured: null,
    categories: null,
    create: null,
    update: null,
    delete: null,
  },
  
  // UI state
  selectedStoreId: null,
  viewMode: 'grid', // 'grid' or 'list'
  showFilters: false,
};

// Store slice
const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    // Clear stores
    clearStores: (state) => {
      state.stores = [];
      state.searchResults = [];
      state.currentStore = null;
      state.selectedStoreId = null;
      state.searchQuery = '';
    },
    
    // Set selected store
    setSelectedStore: (state, action) => {
      state.selectedStoreId = action.payload;
    },
    
    // Clear selected store
    clearSelectedStore: (state) => {
      state.selectedStoreId = null;
      state.currentStore = null;
    },
    
    // Update search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        category: '',
        rating: 0,
        location: '',
        sortBy: 'name',
        sortOrder: 'asc',
      };
    },
    
    // Toggle view mode
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid';
    },
    
    // Set view mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    // Toggle filters visibility
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    
    // Clear specific error
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Update store rating locally (optimistic update)
    updateStoreRating: (state, action) => {
      const { storeId, rating, userRating } = action.payload;
      
      // Update in stores array
      const storeIndex = state.stores.findIndex(store => store.id === storeId);
      if (storeIndex !== -1) {
        state.stores[storeIndex].averageRating = rating;
        if (userRating) {
          state.stores[storeIndex].userRating = userRating;
        }
      }
      
      // Update current store
      if (state.currentStore && state.currentStore.id === storeId) {
        state.currentStore.averageRating = rating;
        if (userRating) {
          state.currentStore.userRating = userRating;
        }
      }
      
      // Update in search results
      const searchIndex = state.searchResults.findIndex(store => store.id === storeId);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex].averageRating = rating;
        if (userRating) {
          state.searchResults[searchIndex].userRating = userRating;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch stores cases
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading.stores = true;
        state.errors.stores = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading.stores = false;
        state.stores = action.payload.stores;
        state.pagination = action.payload.pagination || state.pagination;
        state.errors.stores = null;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading.stores = false;
        state.errors.stores = action.payload;
        state.stores = [];
      });

    // Fetch store by ID cases
    builder
      .addCase(fetchStoreById.pending, (state) => {
        state.loading.store = true;
        state.errors.store = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading.store = false;
        state.currentStore = action.payload;
        state.errors.store = null;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading.store = false;
        state.errors.store = action.payload;
        state.currentStore = null;
      });

    // Search stores cases
    builder
      .addCase(searchStores.pending, (state) => {
        state.loading.search = true;
        state.errors.search = null;
      })
      .addCase(searchStores.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.stores;
        state.searchQuery = action.payload.query;
        state.pagination = action.payload.pagination || state.pagination;
        state.errors.search = null;
      })
      .addCase(searchStores.rejected, (state, action) => {
        state.loading.search = false;
        state.errors.search = action.payload;
        state.searchResults = [];
      });

    // Fetch nearby stores cases
    builder
      .addCase(fetchNearbyStores.pending, (state) => {
        state.loading.nearby = true;
        state.errors.nearby = null;
      })
      .addCase(fetchNearbyStores.fulfilled, (state, action) => {
        state.loading.nearby = false;
        state.nearbyStores = action.payload;
        state.errors.nearby = null;
      })
      .addCase(fetchNearbyStores.rejected, (state, action) => {
        state.loading.nearby = false;
        state.errors.nearby = action.payload;
        state.nearbyStores = [];
      });

    // Create store cases
    builder
      .addCase(createStore.pending, (state) => {
        state.loading.create = true;
        state.errors.create = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading.create = false;
        state.stores.unshift(action.payload);
        state.errors.create = null;
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading.create = false;
        state.errors.create = action.payload;
      });

    // Update store cases
    builder
      .addCase(updateStore.pending, (state) => {
        state.loading.update = true;
        state.errors.update = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedStore = action.payload;
        
        // Update in stores array
        const index = state.stores.findIndex(store => store.id === updatedStore.id);
        if (index !== -1) {
          state.stores[index] = updatedStore;
        }
        
        // Update current store if it's the same
        if (state.currentStore && state.currentStore.id === updatedStore.id) {
          state.currentStore = updatedStore;
        }
        
        state.errors.update = null;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.update = action.payload;
      });

    // Delete store cases
    builder
      .addCase(deleteStore.pending, (state) => {
        state.loading.delete = true;
        state.errors.delete = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading.delete = false;
        const deletedStoreId = action.payload;
        
        // Remove from stores array
        state.stores = state.stores.filter(store => store.id !== deletedStoreId);
        
        // Clear current store if it was deleted
        if (state.currentStore && state.currentStore.id === deletedStoreId) {
          state.currentStore = null;
        }
        
        // Clear selected store if it was deleted
        if (state.selectedStoreId === deletedStoreId) {
          state.selectedStoreId = null;
        }
        
        state.errors.delete = null;
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading.delete = false;
        state.errors.delete = action.payload;
      });

    // Fetch categories cases
    builder
      .addCase(fetchStoreCategories.pending, (state) => {
        state.loading.categories = true;
        state.errors.categories = null;
      })
      .addCase(fetchStoreCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload;
        state.errors.categories = null;
      })
      .addCase(fetchStoreCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.errors.categories = action.payload;
      });

    // Fetch popular stores cases
    builder
      .addCase(fetchPopularStores.pending, (state) => {
        state.loading.popular = true;
        state.errors.popular = null;
      })
      .addCase(fetchPopularStores.fulfilled, (state, action) => {
        state.loading.popular = false;
        state.popularStores = action.payload;
        state.errors.popular = null;
      })
      .addCase(fetchPopularStores.rejected, (state, action) => {
        state.loading.popular = false;
        state.errors.popular = action.payload;
        state.popularStores = [];
      });

    // Fetch featured stores cases
    builder
      .addCase(fetchFeaturedStores.pending, (state) => {
        state.loading.featured = true;
        state.errors.featured = null;
      })
      .addCase(fetchFeaturedStores.fulfilled, (state, action) => {
        state.loading.featured = false;
        state.featuredStores = action.payload;
        state.errors.featured = null;
      })
      .addCase(fetchFeaturedStores.rejected, (state, action) => {
        state.loading.featured = false;
        state.errors.featured = action.payload;
        state.featuredStores = [];
      });
  },
});

// Export actions
export const {
  clearStores,
  setSelectedStore,
  clearSelectedStore,
  setSearchQuery,
  clearSearchResults,
  updateFilters,
  clearFilters,
  toggleViewMode,
  setViewMode,
  toggleFilters,
  clearError,
  clearAllErrors,
  updateStoreRating,
} = storeSlice.actions;

// Selectors
export const selectStores = (state) => state.stores.stores;
export const selectCurrentStore = (state) => state.stores.currentStore;
export const selectPopularStores = (state) => state.stores.popularStores;
export const selectFeaturedStores = (state) => state.stores.featuredStores;
export const selectNearbyStores = (state) => state.stores.nearbyStores;
export const selectStoreCategories = (state) => state.stores.categories;
export const selectSearchResults = (state) => state.stores.searchResults;
export const selectSearchQuery = (state) => state.stores.searchQuery;
export const selectStoreFilters = (state) => state.stores.filters;
export const selectStorePagination = (state) => state.stores.pagination;
export const selectStoreLoading = (state) => state.stores.loading;
export const selectStoreErrors = (state) => state.stores.errors;
export const selectSelectedStoreId = (state) => state.stores.selectedStoreId;
export const selectViewMode = (state) => state.stores.viewMode;
export const selectShowFilters = (state) => state.stores.showFilters;

// Complex selectors
export const selectFilteredStores = (state) => {
  const { stores, filters } = state.stores;
  let filtered = [...stores];

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter(store => store.category === filters.category);
  }

  // Filter by rating
  if (filters.rating > 0) {
    filtered = filtered.filter(store => store.averageRating >= filters.rating);
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

export const selectStoreById = (storeId) => (state) => {
  return state.stores.stores.find(store => store.id === storeId) || null;
};

export const selectIsStoreLoading = (loadingType) => (state) => {
  return state.stores.loading[loadingType] || false;
};

export const selectStoreError = (errorType) => (state) => {
  return state.stores.errors[errorType] || null;
};

export default storeSlice.reducer;
