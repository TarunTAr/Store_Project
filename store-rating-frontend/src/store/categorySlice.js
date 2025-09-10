import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../services/category.service';

// Async thunks for category operations

// Get all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

// Get category by ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch category');
    }
  }
);

// Create category (Admin only)
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create category');
    }
  }
);

// Update category (Admin only)
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(categoryId, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update category');
    }
  }
);

// Delete category (Admin only)
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete category');
    }
  }
);

// Get popular categories
export const fetchPopularCategories = createAsyncThunk(
  'categories/fetchPopularCategories',
  async ({ limit = 10, timeRange = '30d' } = {}, { rejectWithValue }) => {
    try {
      const response = await categoryService.getPopularCategories(limit, timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch popular categories');
    }
  }
);

// Get featured categories
export const fetchFeaturedCategories = createAsyncThunk(
  'categories/fetchFeaturedCategories',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await categoryService.getFeaturedCategories(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch featured categories');
    }
  }
);

// Get category hierarchy
export const fetchCategoryHierarchy = createAsyncThunk(
  'categories/fetchCategoryHierarchy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryHierarchy();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch category hierarchy');
    }
  }
);

// Get stores by category
export const fetchStoresByCategory = createAsyncThunk(
  'categories/fetchStoresByCategory',
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await categoryService.getStoresByCategory(categoryId, params);
      return { categoryId, stores: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch stores by category');
    }
  }
);

// Search categories
export const searchCategories = createAsyncThunk(
  'categories/searchCategories',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await categoryService.searchCategories(query, params);
      return {
        categories: response.data,
        query,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Category search failed');
    }
  }
);

// Initial state
const initialState = {
  // Category data
  categories: [],
  currentCategory: null,
  popularCategories: [],
  featuredCategories: [],
  categoryHierarchy: [],
  searchResults: [],
  
  // Stores by category
  storesByCategory: {}, // { categoryId: stores[] }
  
  // UI state
  selectedCategoryId: null,
  showCategoryForm: false,
  categoryFormData: {
    name: '',
    description: '',
    slug: '',
    parentId: null,
    isEditing: false,
    editingCategoryId: null,
  },
  
  // Search and filters
  searchQuery: '',
  filters: {
    includeInactive: false,
    sortBy: 'name',
    sortOrder: 'asc',
    parentId: null,
  },
  
  // Loading states
  loading: {
    categories: false,
    category: false,
    create: false,
    update: false,
    delete: false,
    popular: false,
    featured: false,
    hierarchy: false,
    stores: false,
    search: false,
  },
  
  // Error states
  errors: {
    categories: null,
    category: null,
    create: null,
    update: null,
    delete: null,
    popular: null,
    featured: null,
    hierarchy: null,
    stores: null,
    search: null,
  },
  
  // Statistics
  stats: {
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
    categoriesWithStores: 0,
  },
};

// Category slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Clear categories
    clearCategories: (state) => {
      state.categories = [];
      state.searchResults = [];
      state.currentCategory = null;
      state.selectedCategoryId = null;
      state.searchQuery = '';
    },
    
    // Set selected category
    setSelectedCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
    
    // Clear selected category
    clearSelectedCategory: (state) => {
      state.selectedCategoryId = null;
      state.currentCategory = null;
    },
    
    // Update search query
    setCategorySearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Clear search results
    clearCategorySearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    // Update filters
    updateCategoryFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear filters
    clearCategoryFilters: (state) => {
      state.filters = {
        includeInactive: false,
        sortBy: 'name',
        sortOrder: 'asc',
        parentId: null,
      };
    },
    
    // Show category form
    showCategoryForm: (state, action) => {
      state.showCategoryForm = true;
      if (action.payload) {
        const category = action.payload;
        state.categoryFormData = {
          name: category.name || '',
          description: category.description || '',
          slug: category.slug || '',
          parentId: category.parentId || null,
          isEditing: true,
          editingCategoryId: category.id,
        };
      } else {
        state.categoryFormData = {
          name: '',
          description: '',
          slug: '',
          parentId: null,
          isEditing: false,
          editingCategoryId: null,
        };
      }
    },
    
    // Hide category form
    hideCategoryForm: (state) => {
      state.showCategoryForm = false;
      state.categoryFormData = {
        name: '',
        description: '',
        slug: '',
        parentId: null,
        isEditing: false,
        editingCategoryId: null,
      };
    },
    
    // Update category form data
    updateCategoryFormData: (state, action) => {
      state.categoryFormData = {
        ...state.categoryFormData,
        ...action.payload,
      };
    },
    
    // Clear specific error
    clearCategoryError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },
    
    // Clear all errors
    clearAllCategoryErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Update category status locally
    updateCategoryStatus: (state, action) => {
      const { categoryId, isActive } = action.payload;
      
      const categoryIndex = state.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex].isActive = isActive;
      }
      
      if (state.currentCategory && state.currentCategory.id === categoryId) {
        state.currentCategory.isActive = isActive;
      }
    },
    
    // Update stats
    updateCategoryStats: (state, action) => {
      state.stats = {
        ...state.stats,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch categories cases
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
        state.errors.categories = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload;
        state.errors.categories = null;
        
        // Update stats
        state.stats.totalCategories = action.payload.length;
        state.stats.activeCategories = action.payload.filter(cat => cat.isActive).length;
        state.stats.inactiveCategories = action.payload.filter(cat => !cat.isActive).length;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.errors.categories = action.payload;
        state.categories = [];
      });

    // Fetch category by ID cases
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading.category = true;
        state.errors.category = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading.category = false;
        state.currentCategory = action.payload;
        state.errors.category = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading.category = false;
        state.errors.category = action.payload;
        state.currentCategory = null;
      });

    // Create category cases
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading.create = true;
        state.errors.create = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading.create = false;
        state.categories.unshift(action.payload);
        state.errors.create = null;
        state.showCategoryForm = false;
        state.stats.totalCategories += 1;
        if (action.payload.isActive) {
          state.stats.activeCategories += 1;
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading.create = false;
        state.errors.create = action.payload;
      });

    // Update category cases
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading.update = true;
        state.errors.update = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedCategory = action.payload;
        
        // Update in categories array
        const index = state.categories.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
        
        // Update current category if it's the same
        if (state.currentCategory && state.currentCategory.id === updatedCategory.id) {
          state.currentCategory = updatedCategory;
        }
        
        state.errors.update = null;
        state.showCategoryForm = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.update = action.payload;
      });

    // Delete category cases
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading.delete = true;
        state.errors.delete = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading.delete = false;
        const deletedCategoryId = action.payload;
        
        // Remove from categories array
        const deletedCategory = state.categories.find(cat => cat.id === deletedCategoryId);
        state.categories = state.categories.filter(cat => cat.id !== deletedCategoryId);
        
        // Clear current category if it was deleted
        if (state.currentCategory && state.currentCategory.id === deletedCategoryId) {
          state.currentCategory = null;
        }
        
        // Clear selected category if it was deleted
        if (state.selectedCategoryId === deletedCategoryId) {
          state.selectedCategoryId = null;
        }
        
        // Update stats
        state.stats.totalCategories -= 1;
        if (deletedCategory && deletedCategory.isActive) {
          state.stats.activeCategories -= 1;
        } else if (deletedCategory) {
          state.stats.inactiveCategories -= 1;
        }
        
        state.errors.delete = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading.delete = false;
        state.errors.delete = action.payload;
      });

    // Fetch popular categories cases
    builder
      .addCase(fetchPopularCategories.pending, (state) => {
        state.loading.popular = true;
        state.errors.popular = null;
      })
      .addCase(fetchPopularCategories.fulfilled, (state, action) => {
        state.loading.popular = false;
        state.popularCategories = action.payload;
        state.errors.popular = null;
      })
      .addCase(fetchPopularCategories.rejected, (state, action) => {
        state.loading.popular = false;
        state.errors.popular = action.payload;
        state.popularCategories = [];
      });

    // Fetch featured categories cases
    builder
      .addCase(fetchFeaturedCategories.pending, (state) => {
        state.loading.featured = true;
        state.errors.featured = null;
      })
      .addCase(fetchFeaturedCategories.fulfilled, (state, action) => {
        state.loading.featured = false;
        state.featuredCategories = action.payload;
        state.errors.featured = null;
      })
      .addCase(fetchFeaturedCategories.rejected, (state, action) => {
        state.loading.featured = false;
        state.errors.featured = action.payload;
        state.featuredCategories = [];
      });

    // Fetch category hierarchy cases
    builder
      .addCase(fetchCategoryHierarchy.pending, (state) => {
        state.loading.hierarchy = true;
        state.errors.hierarchy = null;
      })
      .addCase(fetchCategoryHierarchy.fulfilled, (state, action) => {
        state.loading.hierarchy = false;
        state.categoryHierarchy = action.payload;
        state.errors.hierarchy = null;
      })
      .addCase(fetchCategoryHierarchy.rejected, (state, action) => {
        state.loading.hierarchy = false;
        state.errors.hierarchy = action.payload;
        state.categoryHierarchy = [];
      });

    // Fetch stores by category cases
    builder
      .addCase(fetchStoresByCategory.pending, (state) => {
        state.loading.stores = true;
        state.errors.stores = null;
      })
      .addCase(fetchStoresByCategory.fulfilled, (state, action) => {
        state.loading.stores = false;
        const { categoryId, stores } = action.payload;
        state.storesByCategory[categoryId] = stores;
        state.errors.stores = null;
      })
      .addCase(fetchStoresByCategory.rejected, (state, action) => {
        state.loading.stores = false;
        state.errors.stores = action.payload;
      });

    // Search categories cases
    builder
      .addCase(searchCategories.pending, (state) => {
        state.loading.search = true;
        state.errors.search = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.categories;
        state.searchQuery = action.payload.query;
        state.errors.search = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading.search = false;
        state.errors.search = action.payload;
        state.searchResults = [];
      });
  },
});

// Export actions
export const {
  clearCategories,
  setSelectedCategory,
  clearSelectedCategory,
  setCategorySearchQuery,
  clearCategorySearchResults,
  updateCategoryFilters,
  clearCategoryFilters,
  showCategoryForm,
  hideCategoryForm,
  updateCategoryFormData,
  clearCategoryError,
  clearAllCategoryErrors,
  updateCategoryStatus,
  updateCategoryStats,
} = categorySlice.actions;

// Selectors
export const selectCategories = (state) => state.categories.categories;
export const selectCurrentCategory = (state) => state.categories.currentCategory;
export const selectPopularCategories = (state) => state.categories.popularCategories;
export const selectFeaturedCategories = (state) => state.categories.featuredCategories;
export const selectCategoryHierarchy = (state) => state.categories.categoryHierarchy;
export const selectCategorySearchResults = (state) => state.categories.searchResults;
export const selectCategorySearchQuery = (state) => state.categories.searchQuery;
export const selectCategoryFilters = (state) => state.categories.filters;
export const selectCategoryLoading = (state) => state.categories.loading;
export const selectCategoryErrors = (state) => state.categories.errors;
export const selectSelectedCategoryId = (state) => state.categories.selectedCategoryId;
export const selectShowCategoryForm = (state) => state.categories.showCategoryForm;
export const selectCategoryFormData = (state) => state.categories.categoryFormData;
export const selectCategoryStats = (state) => state.categories.stats;
export const selectStoresByCategory = (categoryId) => (state) => 
  state.categories.storesByCategory[categoryId] || [];

// Complex selectors
export const selectFilteredCategories = (state) => {
  const { categories, filters } = state.categories;
  let filtered = [...categories];

  // Filter by active status
  if (!filters.includeInactive) {
    filtered = filtered.filter(category => category.isActive);
  }

  // Filter by parent
  if (filters.parentId !== null) {
    filtered = filtered.filter(category => category.parentId === filters.parentId);
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

export const selectCategoryById = (categoryId) => (state) => {
  return state.categories.categories.find(category => category.id === categoryId) || null;
};

export const selectIsCategoryLoading = (loadingType) => (state) => {
  return state.categories.loading[loadingType] || false;
};

export const selectCategoryError = (errorType) => (state) => {
  return state.categories.errors[errorType] || null;
};

export const selectRootCategories = (state) => {
  return state.categories.categories.filter(category => !category.parentId);
};

export const selectSubcategories = (parentId) => (state) => {
  return state.categories.categories.filter(category => category.parentId === parentId);
};

export default categorySlice.reducer;
