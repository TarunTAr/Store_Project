import { api, handleApiError, handleApiSuccess, cachedRequest, apiCache } from './api';
import authService from './auth.service';

class CategoryService {
  constructor() {
    this.cacheKeys = {
      allCategories: 'categories-all',
      categoryDetails: (id) => `category-${id}`,
      categoryStats: (id) => `category-${id}-stats`,
      popularCategories: 'categories-popular',
      categoryHierarchy: 'categories-hierarchy',
      categoryTrends: 'categories-trends',
      storesByCategory: (id) => `category-${id}-stores`
    };
  }

  // Get All Categories
  async getAllCategories(params = {}) {
    try {
      const {
        includeInactive = false,
        sortBy = 'name',
        sortOrder = 'asc',
        includeStats = false,
        parent = null
      } = params;

      const cacheKey = `${this.cacheKeys.allCategories}-${includeInactive}-${sortBy}-${sortOrder}-${includeStats}-${parent || 'root'}`;

      return await cachedRequest(
        cacheKey,
        () => api.get('/categories', {
          params: { includeInactive, sortBy, sortOrder, includeStats, parent }
        }),
        1800000 // 30 minutes cache - categories don't change frequently
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Category by ID
  async getCategoryById(categoryId) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      return await cachedRequest(
        this.cacheKeys.categoryDetails(categoryId),
        () => api.get(`/categories/${categoryId}`),
        1800000 // 30 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Create Category (Admin only)
  async createCategory(categoryData) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      this.validateCategoryData(categoryData);

      const response = await api.post('/categories', categoryData);
      const result = handleApiSuccess(response);

      // Clear category caches
      this.clearCategoryCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update Category (Admin only)
  async updateCategory(categoryId, categoryData) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      this.validateCategoryData(categoryData, false);

      const response = await api.put(`/categories/${categoryId}`, categoryData);
      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.categoryDetails(categoryId));
      apiCache.delete(this.cacheKeys.categoryStats(categoryId));
      this.clearCategoryCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete Category (Admin only)
  async deleteCategory(categoryId) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const response = await api.delete(`/categories/${categoryId}`);
      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.categoryDetails(categoryId));
      apiCache.delete(this.cacheKeys.categoryStats(categoryId));
      apiCache.delete(this.cacheKeys.storesByCategory(categoryId));
      this.clearCategoryCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Popular Categories
  async getPopularCategories(limit = 10, timeRange = '30d') {
    try {
      return await cachedRequest(
        `${this.cacheKeys.popularCategories}-${limit}-${timeRange}`,
        () => api.get('/categories/popular', {
          params: { limit, timeRange }
        }),
        3600000 // 1 hour cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Category Hierarchy
  async getCategoryHierarchy() {
    try {
      return await cachedRequest(
        this.cacheKeys.categoryHierarchy,
        () => api.get('/categories/hierarchy'),
        3600000 // 1 hour cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Category Statistics
  async getCategoryStats(categoryId) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      return await cachedRequest(
        this.cacheKeys.categoryStats(categoryId),
        () => api.get(`/categories/${categoryId}/stats`),
        1800000 // 30 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Stores by Category
  async getStoresByCategory(categoryId, params = {}) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const {
        page = 1,
        limit = 20,
        sortBy = 'rating',
        sortOrder = 'desc',
        location = null,
        radius = 10,
        minRating = 0
      } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        location,
        radius,
        minRating
      };

      // Cache first page without location filter
      if (page === 1 && !location && minRating === 0) {
        return await cachedRequest(
          `${this.cacheKeys.storesByCategory(categoryId)}-${sortBy}-${sortOrder}`,
          () => api.get(`/categories/${categoryId}/stores`, { params: queryParams }),
          600000 // 10 minutes cache
        );
      }

      const response = await api.get(`/categories/${categoryId}/stores`, { params: queryParams });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Search Categories
  async searchCategories(query, params = {}) {
    try {
      const {
        limit = 10,
        includeInactive = false,
        exactMatch = false
      } = params;

      const response = await api.get('/categories/search', {
        params: {
          q: query,
          limit,
          includeInactive,
          exactMatch
        }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Upload Category Image (Admin only)
  async uploadCategoryImage(categoryId, imageFile, imageType = 'icon') {
    try {
      if (!categoryId || !imageFile) {
        throw new Error('Category ID and image file are required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('imageType', imageType);

      const response = await api.upload(`/categories/${categoryId}/image`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          window.dispatchEvent(new CustomEvent('category-image-upload-progress', { 
            detail: { categoryId, progress } 
          }));
        }
      });

      const result = handleApiSuccess(response);

      // Clear category cache
      apiCache.delete(this.cacheKeys.categoryDetails(categoryId));

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete Category Image (Admin only)
  async deleteCategoryImage(categoryId, imageType = 'icon') {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const response = await api.delete(`/categories/${categoryId}/image`, {
        params: { imageType }
      });

      const result = handleApiSuccess(response);

      // Clear category cache
      apiCache.delete(this.cacheKeys.categoryDetails(categoryId));

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Category Trends (Admin only)
  async getCategoryTrends(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const {
        timeRange = '90d',
        granularity = 'week',
        metric = 'store_count'
      } = params;

      return await cachedRequest(
        `${this.cacheKeys.categoryTrends}-${timeRange}-${granularity}-${metric}`,
        () => api.get('/categories/trends', {
          params: { timeRange, granularity, metric }
        }),
        3600000 // 1 hour cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Toggle Category Status (Admin only)
  async toggleCategoryStatus(categoryId, isActive) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const response = await api.patch(`/categories/${categoryId}/status`, {
        isActive: Boolean(isActive)
      });

      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.categoryDetails(categoryId));
      this.clearCategoryCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Create Subcategory (Admin only)
  async createSubcategory(parentCategoryId, subcategoryData) {
    try {
      if (!parentCategoryId) {
        throw new Error('Parent category ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      this.validateCategoryData(subcategoryData);

      const response = await api.post(`/categories/${parentCategoryId}/subcategories`, subcategoryData);
      const result = handleApiSuccess(response);

      // Clear category caches
      this.clearCategoryCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Subcategories
  async getSubcategories(parentCategoryId, params = {}) {
    try {
      if (!parentCategoryId) {
        throw new Error('Parent category ID is required');
      }

      const {
        includeInactive = false,
        sortBy = 'name',
        sortOrder = 'asc',
        includeStats = false
      } = params;

      const cacheKey = `category-${parentCategoryId}-subcategories-${includeInactive}-${sortBy}-${sortOrder}`;

      return await cachedRequest(
        cacheKey,
        () => api.get(`/categories/${parentCategoryId}/subcategories`, {
          params: { includeInactive, sortBy, sortOrder, includeStats }
        }),
        1800000 // 30 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Merge Categories (Admin only)
  async mergeCategories(sourceCategoryId, targetCategoryId) {
    try {
      if (!sourceCategoryId || !targetCategoryId) {
        throw new Error('Source and target category IDs are required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      if (sourceCategoryId === targetCategoryId) {
        throw new Error('Source and target categories cannot be the same');
      }

      const response = await api.post('/categories/merge', {
        sourceCategoryId,
        targetCategoryId
      });

      const result = handleApiSuccess(response);

      // Clear all category caches
      this.clearAllCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Category Analytics (Admin only)
  async getCategoryAnalytics(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const {
        timeRange = '30d',
        granularity = 'day',
        includeSubcategories = false,
        metrics = ['store_count', 'rating_count', 'avg_rating']
      } = params;

      const response = await api.get('/categories/analytics', {
        params: {
          timeRange,
          granularity,
          includeSubcategories,
          metrics: metrics.join(',')
        }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Export Categories Data (Admin only)
  async exportCategoriesData(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const {
        format = 'csv',
        includeInactive = false,
        includeStats = true,
        includeSubcategories = true
      } = params;

      const response = await api.download('/categories/export', {
        params: { format, includeInactive, includeStats, includeSubcategories },
        responseType: 'blob'
      });

      // Create download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `categories-export-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Categories data exported successfully' };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Bulk Category Operations (Admin only)
  async bulkCategoryOperation(operation, categoryIds, data = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      if (!operation || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        throw new Error('Operation and category IDs are required');
      }

      const validOperations = ['activate', 'deactivate', 'delete', 'merge'];
      if (!validOperations.includes(operation)) {
        throw new Error('Invalid bulk operation');
      }

      const response = await api.post('/categories/bulk', {
        operation,
        categoryIds,
        data
      });

      const result = handleApiSuccess(response);

      // Clear all caches
      this.clearAllCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Featured Categories
  async getFeaturedCategories(limit = 6) {
    try {
      return await cachedRequest(
        `featured-categories-${limit}`,
        () => api.get('/categories/featured', {
          params: { limit }
        }),
        3600000 // 1 hour cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Set Featured Categories (Admin only)
  async setFeaturedCategories(categoryIds) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      if (!Array.isArray(categoryIds)) {
        throw new Error('Category IDs must be an array');
      }

      const response = await api.post('/categories/featured', {
        categoryIds
      });

      const result = handleApiSuccess(response);

      // Clear featured categories cache
      const featuredKeys = Array.from(apiCache.cache.keys()).filter(key => 
        key.includes('featured-categories')
      );
      featuredKeys.forEach(key => apiCache.delete(key));

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Validate Category Data
  validateCategoryData(categoryData, isCreate = true) {
    const { name, description, slug, parentId } = categoryData;

    if (isCreate && !name) {
      throw new Error('Category name is required');
    }

    if (name && (name.length < 2 || name.length > 50)) {
      throw new Error('Category name must be between 2 and 50 characters');
    }

    if (description && description.length > 500) {
      throw new Error('Category description must not exceed 500 characters');
    }

    if (slug && (slug.length < 2 || slug.length > 50 || !/^[a-z0-9-]+$/.test(slug))) {
      throw new Error('Category slug must be 2-50 characters and contain only lowercase letters, numbers, and hyphens');
    }

    if (parentId && typeof parentId !== 'string') {
      throw new Error('Parent category ID must be a valid string');
    }
  }

  // Clear category-related caches
  clearCategoryCaches() {
    const cacheKeys = Array.from(apiCache.cache.keys()).filter(key => 
      key.includes('categories-all') ||
      key.includes('categories-popular') ||
      key.includes('categories-hierarchy') ||
      key.includes('categories-trends') ||
      key.includes('featured-categories')
    );
    
    cacheKeys.forEach(key => apiCache.delete(key));
  }

  // Clear all caches (use sparingly)
  clearAllCaches() {
    const cacheKeys = Array.from(apiCache.cache.keys()).filter(key => 
      key.includes('category') || key.includes('categories')
    );
    
    cacheKeys.forEach(key => apiCache.delete(key));
  }

  // Get Category Performance Report (Admin only)
  async getCategoryPerformanceReport(categoryId, timeRange = '30d') {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const response = await api.get(`/categories/${categoryId}/performance`, {
        params: { timeRange }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Create singleton instance
const categoryService = new CategoryService();

export default categoryService;
