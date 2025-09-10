// ==========================================================================
// Store Service - Store Rating Platform (Updated & Optimized)
// Complete store management with caching, validation, and error handling
// ==========================================================================

import { api, handleApiError, handleApiSuccess, cachedRequest, apiCache } from './api';
import authService from './auth.service';

class StoreService {
  constructor() {
    this.cacheKeys = {
      allStores: 'stores-all',
      storeDetails: (id) => `store-${id}`,
      storeRatings: (id) => `store-${id}-ratings`,
      nearbyStores: (lat, lng, radius) => `stores-nearby-${lat}-${lng}-${radius}`,
      categories: 'store-categories',
      ownerStores: (ownerId) => `owner-${ownerId}-stores`,
      featured: 'stores-featured',
      popular: 'stores-popular'
    };
  }

  // ========== CORE STORE OPERATIONS ==========

  // Get All Stores (Challenge requirement: Normal Users can view all stores)
  async getAllStores(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        category = '',
        sortBy = 'name',
        sortOrder = 'asc',
        minRating = 0,
        location = '',
        radius = 10
      } = params;

      const queryParams = { 
        page, limit, search, category, sortBy, sortOrder, minRating, location, radius 
      };

      const cacheKey = search || category || minRating || location
        ? `${this.cacheKeys.allStores}-${JSON.stringify(queryParams)}`
        : `${this.cacheKeys.allStores}-${page}-${limit}-${sortBy}-${sortOrder}`;

      return await cachedRequest(
        cacheKey,
        () => api.get('/stores', { params: queryParams }),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Store by ID (Challenge requirement: View store details)
  async getStoreById(storeId) {
    try {
      if (!storeId) throw new Error('Store ID is required');
      
      return await cachedRequest(
        this.cacheKeys.storeDetails(storeId),
        () => api.get(`/stores/${storeId}`),
        300000
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Search Stores (Challenge requirement: Search by Name and Address)
  async searchStores(query, params = {}) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        sortBy = 'relevance', 
        sortOrder = 'desc', 
        filters = {} 
      } = params;

      const response = await api.get('/stores/search', {
        params: { 
          q: query, 
          page, 
          limit, 
          sortBy, 
          sortOrder, 
          searchFields: 'name,address', // Challenge requirement
          ...filters 
        }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ========== ADMIN OPERATIONS ==========

  // Create Store (Challenge requirement: System Administrator can add stores)
  async createStore(storeData) {
    try {
      this.validateStoreData(storeData);
      
      const response = await api.post('/stores', storeData);
      const result = handleApiSuccess(response);

      this.clearStoreListCaches();
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update Store (Challenge requirement: System Administrator can modify stores)
  async updateStore(storeId, storeData) {
    try {
      if (!storeId) throw new Error('Store ID is required');
      
      this.validateStoreData(storeData, false); // Partial validation for updates

      const response = await api.put(`/stores/${storeId}`, storeData);
      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.storeDetails(storeId));
      this.clearStoreListCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete Store (Challenge requirement: System Administrator can delete stores)
  async deleteStore(storeId) {
    try {
      if (!storeId) throw new Error('Store ID is required');

      const response = await api.delete(`/stores/${storeId}`);
      const result = handleApiSuccess(response);

      // Clear all related caches
      apiCache.delete(this.cacheKeys.storeDetails(storeId));
      apiCache.delete(this.cacheKeys.storeRatings(storeId));
      this.clearStoreListCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ========== STORE OWNER OPERATIONS ==========

  // Get My Stores (Challenge requirement: Store Owner can view their stores)
  async getMyStores(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || user.role !== 'STORE_OWNER') {
        throw new Error('Access denied. Store owner authentication required.');
      }

      const { page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc' } = params;

      const response = await api.get('/stores/my-stores', {
        params: { page, limit, sortBy, sortOrder }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Store Analytics (Challenge requirement: Store Owner dashboard)
  async getStoreAnalytics(storeId, params = {}) {
    try {
      if (!storeId) throw new Error('Store ID is required');

      const {
        startDate,
        endDate,
        granularity = 'day',
        metrics = ['ratings', 'reviews', 'views']
      } = params;

      const response = await api.get(`/stores/${storeId}/analytics`, {
        params: {
          startDate,
          endDate,
          granularity,
          metrics: metrics.join(',')
        }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ========== CATEGORY & ORGANIZATION ==========

  // Get Store Categories
  async getStoreCategories() {
    try {
      return await cachedRequest(
        this.cacheKeys.categories,
        () => api.get('/stores/categories'),
        3600000 // 1 hour cache - categories don't change often
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Stores by Category
  async getStoresByCategory(categoryId, params = {}) {
    try {
      if (!categoryId) throw new Error('Category ID is required');

      const { page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc' } = params;

      const response = await api.get(`/stores/category/${categoryId}`, {
        params: { page, limit, sortBy, sortOrder }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ========== RATING OPERATIONS ==========

  // Get Store Ratings (Challenge requirement: Store Owner can view ratings)
  async getStoreRatings(storeId, params = {}) {
    try {
      if (!storeId) throw new Error('Store ID is required');

      const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = params;

      return await cachedRequest(
        `${this.cacheKeys.storeRatings(storeId)}-${page}-${limit}`,
        () => api.get(`/stores/${storeId}/ratings`, {
          params: { page, limit, sortBy, sortOrder }
        }),
        300000
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Average Rating (Challenge requirement: Store average rating)
  async getAverageRating(storeId) {
    try {
      if (!storeId) throw new Error('Store ID is required');

      const response = await api.get(`/stores/${storeId}/average-rating`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ========== IMAGE MANAGEMENT ==========

  // Upload Store Images
  async uploadStoreImages(storeId, files, imageType = 'gallery') {
    try {
      if (!storeId) throw new Error('Store ID is required');
      if (!files || files.length === 0) throw new Error('At least one file is required');

      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });
      formData.append('imageType', imageType);

      const response = await api.post(`/stores/${storeId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          window.dispatchEvent(new CustomEvent('upload-progress', { 
            detail: { storeId, progress } 
          }));
        }
      });

      const result = handleApiSuccess(response);

      // Clear store cache to refresh images
      apiCache.delete(this.cacheKeys.storeDetails(storeId));

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete Store Image
  async deleteStoreImage(storeId, imageId) {
    try {
      if (!storeId || !imageId) throw new Error('Store ID and Image ID are required');

      const response = await api.delete(`/stores/${storeId}/images/${imageId}`);
      const result = handleApiSuccess(response);

      // Clear store cache
      apiCache.delete(this.cacheKeys.storeDetails(storeId));

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ========== UTILITY FUNCTIONS ==========

  // Get Popular Stores
  async getPopularStores(limit = 10, timeRange = '7d') {
    try {
      return await cachedRequest(
        `${this.cacheKeys.popular}-${limit}-${timeRange}`,
        () => api.get('/stores/popular', {
          params: { limit, timeRange }
        }),
        1800000 // 30 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Featured Stores
  async getFeaturedStores(limit = 6) {
    try {
      return await cachedRequest(
        `${this.cacheKeys.featured}-${limit}`,
        () => api.get('/stores/featured', {
          params: { limit }
        }),
        3600000 // 1 hour cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Nearby Stores (Location-based)
  async getNearbyStores(latitude, longitude, radius = 5) {
    try {
      if (!latitude || !longitude) throw new Error('Latitude and longitude are required');

      const cacheKey = this.cacheKeys.nearbyStores(
        Math.round(latitude * 1000), 
        Math.round(longitude * 1000), 
        radius
      );

      return await cachedRequest(
        cacheKey,
        () => api.get('/stores/nearby', {
          params: { latitude, longitude, radius }
        }),
        600000 // 10 minutes cache for location-based data
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ========== VALIDATION ==========

  // Validate Store Data (Challenge requirements compliance)
  validateStoreData(storeData, isCreate = true) {
    const { name, email, address, category } = storeData;

    // Name validation (Challenge requirement: 20-60 characters)
    if (isCreate && !name) {
      throw new Error('Store name is required');
    }
    if (name && (name.length < 20 || name.length > 60)) {
      throw new Error('Store name must be between 20 and 60 characters');
    }

    // Email validation (Challenge requirement: valid email)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Address validation (Challenge requirement: max 400 characters)
    if (isCreate && !address) {
      throw new Error('Store address is required');
    }
    if (address && address.length > 400) {
      throw new Error('Address must not exceed 400 characters');
    }

    // Category validation
    if (isCreate && !category) {
      throw new Error('Store category is required');
    }
  }

  // ========== CACHE MANAGEMENT ==========

  // Clear store list caches
  clearStoreListCaches() {
    const cacheKeys = Array.from(apiCache.keys()).filter(key => 
      key.includes('stores-all') || 
      key.includes('stores-nearby') ||
      key.includes('stores-featured') ||
      key.includes('stores-popular') ||
      (key.includes('owner-') && key.includes('-stores'))
    );
    
    cacheKeys.forEach(key => apiCache.delete(key));
  }

  // Clear all store-related caches
  clearAllStoreCache() {
    const cacheKeys = Array.from(apiCache.keys()).filter(key => 
      key.includes('store')
    );
    
    cacheKeys.forEach(key => apiCache.delete(key));
  }
}

// Create singleton instance
const storeService = new StoreService();

export default storeService;
