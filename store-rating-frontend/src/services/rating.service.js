import { api, handleApiError, handleApiSuccess, cachedRequest, apiCache } from './api';
import authService from './auth.service';

class RatingService {
  constructor() {
    this.cacheKeys = {
      storeRatings: (storeId) => `store-${storeId}-ratings`,
      userRatings: (userId) => `user-${userId}-ratings`,
      ratingDetails: (ratingId) => `rating-${ratingId}`,
      ratingStats: (storeId) => `store-${storeId}-rating-stats`,
      userStoreRating: (userId, storeId) => `user-${userId}-store-${storeId}-rating`
    };
  }

  // Submit Rating (Normal Users)
  async submitRating(ratingData) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isUser()) {
        throw new Error('Authentication required to submit ratings');
      }

      this.validateRatingData(ratingData);

      const response = await api.post('/ratings', {
        ...ratingData,
        userId: user.id
      });

      const result = handleApiSuccess(response);

      // Clear relevant caches
      this.clearRatingCaches(ratingData.storeId, user.id);

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update Rating (Normal Users - modify their own rating)
  async updateRating(ratingId, ratingData) {
    try {
      if (!ratingId) {
        throw new Error('Rating ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isUser()) {
        throw new Error('Authentication required to update ratings');
      }

      this.validateRatingData(ratingData, false);

      const response = await api.put(`/ratings/${ratingId}`, ratingData);
      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.ratingDetails(ratingId));
      if (ratingData.storeId) {
        this.clearRatingCaches(ratingData.storeId, user.id);
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete Rating (Admin or User's own rating)
  async deleteRating(ratingId) {
    try {
      if (!ratingId) {
        throw new Error('Rating ID is required');
      }

      const response = await api.delete(`/ratings/${ratingId}`);
      const result = handleApiSuccess(response);

      // Clear cache
      apiCache.delete(this.cacheKeys.ratingDetails(ratingId));

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Store Ratings (All Users)
  async getStoreRatings(storeId, params = {}) {
    try {
      if (!storeId) {
        throw new Error('Store ID is required');
      }

      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        rating = null,
        withReviews = false
      } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        rating,
        withReviews
      };

      // Use cache for first page without filters
      if (page === 1 && !rating && !withReviews) {
        return await cachedRequest(
          `${this.cacheKeys.storeRatings(storeId)}-${sortBy}-${sortOrder}`,
          () => api.get(`/stores/${storeId}/ratings`, { params: queryParams }),
          300000 // 5 minutes cache
        );
      }

      const response = await api.get(`/stores/${storeId}/ratings`, { params: queryParams });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get User's Rating for a Store
  async getUserStoreRating(storeId, userId = null) {
    try {
      if (!storeId) {
        throw new Error('Store ID is required');
      }

      const user = authService.getCurrentUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        throw new Error('User ID is required');
      }

      return await cachedRequest(
        this.cacheKeys.userStoreRating(targetUserId, storeId),
        () => api.get(`/stores/${storeId}/ratings/user/${targetUserId}`),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Store Ratings with User Details (Store Owner)
  async getStoreRatingsWithUsers(storeId, params = {}) {
    try {
      if (!storeId) {
        throw new Error('Store ID is required');
      }

      // Verify store ownership or admin access
      const user = authService.getCurrentUser();
      if (!user || (!authService.isAdmin() && !authService.isStoreOwner())) {
        throw new Error('Access denied');
      }

      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        rating = null,
        startDate = null,
        endDate = null
      } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        rating,
        startDate,
        endDate,
        includeUserDetails: true
      };

      const response = await api.get(`/stores/${storeId}/ratings/detailed`, { params: queryParams });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Rating Statistics for Store
  async getStoreRatingStats(storeId) {
    try {
      if (!storeId) {
        throw new Error('Store ID is required');
      }

      return await cachedRequest(
        this.cacheKeys.ratingStats(storeId),
        () => api.get(`/stores/${storeId}/ratings/stats`),
        600000 // 10 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Validate Rating Data
  validateRatingData(ratingData, isCreate = true) {
    const { storeId, rating, review } = ratingData;

    if (isCreate && !storeId) {
      throw new Error('Store ID is required');
    }

    if (rating !== undefined) {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be an integer between 1 and 5');
      }
    } else if (isCreate) {
      throw new Error('Rating is required');
    }

    if (review && typeof review !== 'string') {
      throw new Error('Review must be a string');
    }

    if (review && review.length > 2000) {
      throw new Error('Review must not exceed 2000 characters');
    }
  }

  // Clear rating-related caches
  clearRatingCaches(storeId, userId) {
    // Clear store ratings cache
    const storeRatingKeys = Array.from(apiCache.cache.keys()).filter(key => 
      key.includes(`store-${storeId}-ratings`)
    );
    storeRatingKeys.forEach(key => apiCache.delete(key));

    // Clear store rating stats cache
    apiCache.delete(this.cacheKeys.ratingStats(storeId));

    // Clear user-store rating cache
    if (userId) {
      apiCache.delete(this.cacheKeys.userStoreRating(userId, storeId));
    }
  }
}

// Create singleton instance
const ratingService = new RatingService();

export default ratingService;
