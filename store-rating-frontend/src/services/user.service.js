import { api, handleApiError, handleApiSuccess, cachedRequest, apiCache } from './api';
import authService from './auth.service';

class UserService {
  constructor() {
    this.cacheKeys = {
      allUsers: 'users-all',
      userDetails: (id) => `user-${id}`,
      userStats: (id) => `user-${id}-stats`,
      userActivity: (id) => `user-${id}-activity`,
      adminUsers: 'admin-users',
      storeOwners: 'store-owners',
      normalUsers: 'normal-users',
      userRoles: 'user-roles'
    };
  }

  // Get All Users (Admin only)
  async getAllUsers(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const {
        page = 1,
        limit = 20,
        search = '',
        role = '',
        sortBy = 'name',
        sortOrder = 'asc',
        status = '',
        dateFrom = null,
        dateTo = null
      } = params;

      const queryParams = {
        page,
        limit,
        search,
        role,
        sortBy,
        sortOrder,
        status,
        dateFrom,
        dateTo
      };

      // Cache key includes search params for specific queries
      const cacheKey = search || role || status || dateFrom || dateTo
        ? `${this.cacheKeys.allUsers}-${JSON.stringify(queryParams)}`
        : `${this.cacheKeys.allUsers}-${page}-${limit}-${sortBy}-${sortOrder}`;

      return await cachedRequest(
        cacheKey,
        () => api.get('/users', { params: queryParams }),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get User by ID
  async getUserById(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      // Users can view their own profile, admins can view any profile
      if (currentUser.id !== userId && !authService.isAdmin()) {
        throw new Error('Access denied');
      }

      return await cachedRequest(
        this.cacheKeys.userDetails(userId),
        () => api.get(`/users/${userId}`),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Create New User (Admin only)
  async createUser(userData) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      this.validateUserData(userData);

      const response = await api.post('/users', userData);
      const result = handleApiSuccess(response);

      // Clear user list caches
      this.clearUserListCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update User (Admin or own profile)
  async updateUser(userId, userData) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      // Users can update their own profile, admins can update any profile
      if (currentUser.id !== userId && !authService.isAdmin()) {
        throw new Error('Access denied');
      }

      this.validateUserData(userData, false); // Partial validation for updates

      const response = await api.put(`/users/${userId}`, userData);
      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.userDetails(userId));
      this.clearUserListCaches();

      // Update current user data if updating own profile
      if (currentUser.id === userId && result.data?.user) {
        authService.notifyListeners(result.data.user);
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete User (Admin only)
  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      // Prevent admin from deleting themselves
      if (user.id === userId) {
        throw new Error('Cannot delete your own account');
      }

      const response = await api.delete(`/users/${userId}`);
      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.userDetails(userId));
      apiCache.delete(this.cacheKeys.userStats(userId));
      apiCache.delete(this.cacheKeys.userActivity(userId));
      this.clearUserListCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Search Users (Admin only)
  async searchUsers(query, params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const {
        page = 1,
        limit = 20,
        role = '',
        sortBy = 'relevance',
        sortOrder = 'desc',
        includeInactive = false
      } = params;

      const response = await api.get('/users/search', {
        params: {
          q: query,
          page,
          limit,
          role,
          sortBy,
          sortOrder,
          includeInactive
        }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Users by Role (Admin only)
  async getUsersByRole(role, params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      if (!['admin', 'user', 'store_owner', 'system_administrator'].includes(role)) {
        throw new Error('Invalid role specified');
      }

      const {
        page = 1,
        limit = 20,
        sortBy = 'name',
        sortOrder = 'asc',
        includeStats = false
      } = params;

      const cacheKey = `${role}-users-${page}-${limit}-${sortBy}-${sortOrder}`;

      return await cachedRequest(
        cacheKey,
        () => api.get(`/users/role/${role}`, {
          params: { page, limit, sortBy, sortOrder, includeStats }
        }),
        600000 // 10 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get User Statistics
  async getUserStats(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      // Users can view their own stats, admins can view any stats
      if (currentUser.id !== userId && !authService.isAdmin()) {
        throw new Error('Access denied');
      }

      return await cachedRequest(
        this.cacheKeys.userStats(userId),
        () => api.get(`/users/${userId}/stats`),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get User Activity Log
  async getUserActivity(userId, params = {}) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      // Users can view their own activity, admins can view any activity
      if (currentUser.id !== userId && !authService.isAdmin()) {
        throw new Error('Access denied');
      }

      const {
        page = 1,
        limit = 20,
        activityType = '',
        dateFrom = null,
        dateTo = null
      } = params;

      const response = await api.get(`/users/${userId}/activity`, {
        params: { page, limit, activityType, dateFrom, dateTo }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Activate/Deactivate User (Admin only)
  async toggleUserStatus(userId, isActive) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      // Prevent admin from deactivating themselves
      if (user.id === userId) {
        throw new Error('Cannot modify your own account status');
      }

      const response = await api.patch(`/users/${userId}/status`, {
        isActive: Boolean(isActive)
      });

      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.userDetails(userId));
      this.clearUserListCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Assign Role to User (Admin only)
  async assignRole(userId, role) {
    try {
      if (!userId || !role) {
        throw new Error('User ID and role are required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const validRoles = ['admin', 'user', 'store_owner', 'system_administrator'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role specified');
      }

      // Prevent admin from changing their own role
      if (user.id === userId) {
        throw new Error('Cannot modify your own role');
      }

      const response = await api.patch(`/users/${userId}/role`, { role });
      const result = handleApiSuccess(response);

      // Clear caches
      apiCache.delete(this.cacheKeys.userDetails(userId));
      this.clearUserListCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get User Dashboard Data (Role-specific)
  async getUserDashboard() {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      return await cachedRequest(
        `user-dashboard-${user.id}-${user.role}`,
        () => api.get('/users/dashboard'),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Admin Dashboard Data (Admin only)
  async getAdminDashboard(timeRange = '30d') {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      return await cachedRequest(
        `admin-dashboard-${timeRange}`,
        () => api.get('/users/admin-dashboard', {
          params: { timeRange }
        }),
        600000 // 10 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Store Owner Dashboard Data (Store Owner only)
  async getStoreOwnerDashboard(storeId = null) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isStoreOwner()) {
        throw new Error('Store owner access required');
      }

      return await cachedRequest(
        `store-owner-dashboard-${user.id}-${storeId || 'all'}`,
        () => api.get('/users/store-owner-dashboard', {
          params: { storeId }
        }),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update User Preferences
  async updateUserPreferences(userId, preferences) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      // Users can update their own preferences
      if (currentUser.id !== userId) {
        throw new Error('Access denied');
      }

      const response = await api.put(`/users/${userId}/preferences`, preferences);
      const result = handleApiSuccess(response);

      // Clear user cache
      apiCache.delete(this.cacheKeys.userDetails(userId));

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Reset User Password (Admin only)
  async resetUserPassword(userId, newPassword) {
    try {
      if (!userId || !newPassword) {
        throw new Error('User ID and new password are required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      // Validate password
      if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(newPassword)) {
        throw new Error('Password must be 8-16 characters with at least one uppercase letter and one special character');
      }

      const response = await api.post(`/users/${userId}/reset-password`, {
        newPassword
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Send User Notification (Admin only)
  async sendUserNotification(userId, notificationData) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const { title, message, type = 'info', persistent = false } = notificationData;

      if (!title || !message) {
        throw new Error('Notification title and message are required');
      }

      const response = await api.post(`/users/${userId}/notify`, {
        title,
        message,
        type,
        persistent
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Bulk User Operations (Admin only)
  async bulkUserOperation(operation, userIds, data = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      if (!operation || !Array.isArray(userIds) || userIds.length === 0) {
        throw new Error('Operation and user IDs are required');
      }

      const validOperations = ['activate', 'deactivate', 'delete', 'assign_role', 'send_notification'];
      if (!validOperations.includes(operation)) {
        throw new Error('Invalid bulk operation');
      }

      // Prevent bulk operations on own account
      if (userIds.includes(user.id)) {
        throw new Error('Cannot perform bulk operations on your own account');
      }

      const response = await api.post('/users/bulk', {
        operation,
        userIds,
        data
      });

      const result = handleApiSuccess(response);

      // Clear relevant caches
      userIds.forEach(userId => {
        apiCache.delete(this.cacheKeys.userDetails(userId));
      });
      this.clearUserListCaches();

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Export Users Data (Admin only)
  async exportUsersData(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const {
        format = 'csv',
        role = '',
        status = 'active',
        includeStats = false
      } = params;

      const response = await api.download('/users/export', {
        params: { format, role, status, includeStats },
        responseType: 'blob'
      });

      // Create download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Users data exported successfully' };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get User Roles (Admin only)
  async getUserRoles() {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      return await cachedRequest(
        this.cacheKeys.userRoles,
        () => api.get('/users/roles'),
        3600000 // 1 hour cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get User Analytics (Admin only)
  async getUserAnalytics(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const {
        timeRange = '30d',
        granularity = 'day',
        metrics = ['registrations', 'activity', 'ratings']
      } = params;

      const response = await api.get('/users/analytics', {
        params: { timeRange, granularity, metrics: metrics.join(',') }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Validate User Data
  validateUserData(userData, isCreate = true) {
    const { name, email, password, address, role } = userData;

    // Name validation
    if (isCreate && !name) {
      throw new Error('Name is required');
    }
    if (name && (name.length < 20 || name.length > 60)) {
      throw new Error('Name must be between 20 and 60 characters');
    }

    // Email validation
    if (isCreate && !email) {
      throw new Error('Email is required');
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Password validation (only for create or when password is being updated)
    if ((isCreate && !password) || (password && password.length > 0)) {
      if (!password || !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(password)) {
        throw new Error('Password must be 8-16 characters with at least one uppercase letter and one special character');
      }
    }

    // Address validation
    if (isCreate && !address) {
      throw new Error('Address is required');
    }
    if (address && address.length > 400) {
      throw new Error('Address must not exceed 400 characters');
    }

    // Role validation
    if (role && !['admin', 'user', 'store_owner', 'system_administrator'].includes(role)) {
      throw new Error('Invalid role specified');
    }
  }

  // Clear user list caches
  clearUserListCaches() {
    const cacheKeys = Array.from(apiCache.cache.keys()).filter(key => 
      key.includes('users-all') || 
      key.includes('-users-') ||
      key.includes('admin-dashboard') ||
      key.includes('user-analytics')
    );
    
    cacheKeys.forEach(key => apiCache.delete(key));
  }

  // Get Recently Active Users (Admin only)
  async getRecentlyActiveUsers(limit = 10, timeRange = '24h') {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      return await cachedRequest(
        `recently-active-users-${limit}-${timeRange}`,
        () => api.get('/users/recently-active', {
          params: { limit, timeRange }
        }),
        300000 // 5 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get Top Contributors (Admin only)
  async getTopContributors(limit = 10, timeRange = '30d') {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      return await cachedRequest(
        `top-contributors-${limit}-${timeRange}`,
        () => api.get('/users/top-contributors', {
          params: { limit, timeRange }
        }),
        1800000 // 30 minutes cache
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Create singleton instance
const userService = new UserService();

export default userService;
