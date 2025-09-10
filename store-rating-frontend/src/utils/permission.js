import { USER_ROLES, USER_ROLE_LABELS } from './constants';

// Permission levels (based on challenge requirements)
export const PERMISSION_LEVELS = {
  NONE: 0,
  READ: 1,
  WRITE: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

// Resource types
export const RESOURCES = {
  USERS: 'users',
  STORES: 'stores', 
  RATINGS: 'ratings',
  CATEGORIES: 'categories',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  SYSTEM: 'system',
};

// Actions
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  SEARCH: 'search',
  MANAGE: 'manage',
  MODERATE: 'moderate',
};

// Role-based permissions matrix (based on exact challenge requirements)
export const ROLE_PERMISSIONS = {
  // System Administrator (as per challenge requirements)
  [USER_ROLES.SYSTEM_ADMINISTRATOR]: {
    [RESOURCES.USERS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.LIST, ACTIONS.SEARCH, ACTIONS.MANAGE],
    [RESOURCES.STORES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.LIST, ACTIONS.SEARCH, ACTIONS.MANAGE],
    [RESOURCES.RATINGS]: [ACTIONS.READ, ACTIONS.LIST, ACTIONS.SEARCH, ACTIONS.MODERATE, ACTIONS.DELETE],
    [RESOURCES.CATEGORIES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.LIST, ACTIONS.MANAGE],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.MANAGE],
    [RESOURCES.ANALYTICS]: [ACTIONS.READ, ACTIONS.LIST],
    [RESOURCES.SYSTEM]: [ACTIONS.READ, ACTIONS.MANAGE],
  },

  // Admin (similar to System Administrator but may have some restrictions)
  [USER_ROLES.ADMIN]: {
    [RESOURCES.USERS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.LIST, ACTIONS.SEARCH, ACTIONS.MANAGE],
    [RESOURCES.STORES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.LIST, ACTIONS.SEARCH, ACTIONS.MANAGE],
    [RESOURCES.RATINGS]: [ACTIONS.READ, ACTIONS.LIST, ACTIONS.SEARCH, ACTIONS.MODERATE],
    [RESOURCES.CATEGORIES]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.LIST, ACTIONS.MANAGE],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.MANAGE],
    [RESOURCES.ANALYTICS]: [ACTIONS.READ, ACTIONS.LIST],
    [RESOURCES.SYSTEM]: [ACTIONS.READ],
  },

  // Normal User (as per challenge requirements)
  [USER_ROLES.USER]: {
    [RESOURCES.USERS]: [ACTIONS.READ], // Can read own profile
    [RESOURCES.STORES]: [ACTIONS.READ, ACTIONS.LIST, ACTIONS.SEARCH], // Can view and search stores
    [RESOURCES.RATINGS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE], // Can submit and modify their ratings (1-5)
    [RESOURCES.CATEGORIES]: [ACTIONS.READ, ACTIONS.LIST], // Can view categories
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ], // Can read notifications
    [RESOURCES.ANALYTICS]: [], // No analytics access
    [RESOURCES.SYSTEM]: [], // No system access
  },

  [USER_ROLES.NORMAL_USER]: { // Alias for USER
    [RESOURCES.USERS]: [ACTIONS.READ],
    [RESOURCES.STORES]: [ACTIONS.READ, ACTIONS.LIST, ACTIONS.SEARCH],
    [RESOURCES.RATINGS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.CATEGORIES]: [ACTIONS.READ, ACTIONS.LIST],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ],
    [RESOURCES.ANALYTICS]: [],
    [RESOURCES.SYSTEM]: [],
  },

  // Store Owner (as per challenge requirements)
  [USER_ROLES.STORE_OWNER]: {
    [RESOURCES.USERS]: [ACTIONS.READ], // Can read profiles of users who rated their store
    [RESOURCES.STORES]: [ACTIONS.READ, ACTIONS.UPDATE], // Can read and update their own store
    [RESOURCES.RATINGS]: [ACTIONS.READ, ACTIONS.LIST], // Can view ratings for their store
    [RESOURCES.CATEGORIES]: [ACTIONS.READ, ACTIONS.LIST], // Can view categories
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ], // Can read notifications
    [RESOURCES.ANALYTICS]: [ACTIONS.READ], // Can view their store analytics
    [RESOURCES.SYSTEM]: [], // No system access
  },
};

// Permission checker class
export class PermissionChecker {
  constructor(user = null) {
    this.user = user;
  }

  // Set current user
  setUser(user) {
    this.user = user;
  }

  // Get user role
  getUserRole() {
    return this.user?.role || null;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const userRole = this.getUserRole();
    return Array.isArray(roles) ? roles.includes(userRole) : false;
  }

  // Get permissions for current user role
  getRolePermissions(role = null) {
    const targetRole = role || this.getUserRole();
    return ROLE_PERMISSIONS[targetRole] || {};
  }

  // Check if user has permission for resource and action
  hasPermission(resource, action, targetUserId = null) {
    if (!this.user) return false;

    const userRole = this.getUserRole();
    const permissions = this.getRolePermissions(userRole);
    const resourcePermissions = permissions[resource] || [];

    // Check basic permission
    if (!resourcePermissions.includes(action)) {
      return false;
    }

    // Special cases for user resource (can only access own data unless admin)
    if (resource === RESOURCES.USERS && targetUserId) {
      if (this.isAdmin()) {
        return true; // Admins can access all user data
      }
      return this.user.id === targetUserId; // Users can only access their own data
    }

    // Special cases for store owners (can only access their own store data)
    if (userRole === USER_ROLES.STORE_OWNER && resource === RESOURCES.STORES) {
      // Store owners can only manage their own stores
      // This would need additional context about which store is being accessed
      return true; // Simplified - in real implementation, check store ownership
    }

    return true;
  }

  // Check multiple permissions at once
  hasPermissions(permissionChecks) {
    if (!Array.isArray(permissionChecks)) return false;

    return permissionChecks.every(check => {
      const { resource, action, targetUserId } = check;
      return this.hasPermission(resource, action, targetUserId);
    });
  }

  // Check if user is admin (System Administrator or Admin)
  isAdmin() {
    return this.hasAnyRole([USER_ROLES.SYSTEM_ADMINISTRATOR, USER_ROLES.ADMIN]);
  }

  // Check if user is system administrator
  isSystemAdmin() {
    return this.hasRole(USER_ROLES.SYSTEM_ADMINISTRATOR);
  }

  // Check if user is store owner
  isStoreOwner() {
    return this.hasRole(USER_ROLES.STORE_OWNER);
  }

  // Check if user is normal user
  isNormalUser() {
    return this.hasAnyRole([USER_ROLES.USER, USER_ROLES.NORMAL_USER]);
  }

  // Get allowed actions for a resource
  getAllowedActions(resource) {
    const permissions = this.getRolePermissions();
    return permissions[resource] || [];
  }

  // Check if user can perform any action on a resource
  canAccessResource(resource) {
    const allowedActions = this.getAllowedActions(resource);
    return allowedActions.length > 0;
  }

  // Get permission level for resource
  getPermissionLevel(resource) {
    const allowedActions = this.getAllowedActions(resource);
    
    if (allowedActions.includes(ACTIONS.MANAGE) || allowedActions.includes(ACTIONS.DELETE)) {
      return PERMISSION_LEVELS.ADMIN;
    }
    
    if (allowedActions.includes(ACTIONS.CREATE) || allowedActions.includes(ACTIONS.UPDATE)) {
      return PERMISSION_LEVELS.WRITE;
    }
    
    if (allowedActions.includes(ACTIONS.READ) || allowedActions.includes(ACTIONS.LIST)) {
      return PERMISSION_LEVELS.READ;
    }
    
    return PERMISSION_LEVELS.NONE;
  }

  // Get user capabilities summary
  getCapabilities() {
    const userRole = this.getUserRole();
    const permissions = this.getRolePermissions(userRole);
    
    const capabilities = {
      // Challenge requirements - System Administrator
      canAddStores: this.hasPermission(RESOURCES.STORES, ACTIONS.CREATE),
      canAddUsers: this.hasPermission(RESOURCES.USERS, ACTIONS.CREATE),
      canAddAdminUsers: this.hasPermission(RESOURCES.USERS, ACTIONS.CREATE) && this.isAdmin(),
      canViewDashboard: this.isAdmin(),
      canViewAllUsers: this.hasPermission(RESOURCES.USERS, ACTIONS.LIST) && this.isAdmin(),
      canViewAllStores: this.hasPermission(RESOURCES.STORES, ACTIONS.LIST),
      canFilterListings: this.hasPermission(RESOURCES.USERS, ACTIONS.SEARCH) || this.hasPermission(RESOURCES.STORES, ACTIONS.SEARCH),
      canViewUserDetails: this.hasPermission(RESOURCES.USERS, ACTIONS.READ),
      
      // Challenge requirements - Normal User
      canRegister: true, // Registration is always allowed
      canLogin: true, // Login is always allowed
      canUpdatePassword: true, // Password update is always allowed for authenticated users
      canViewStores: this.hasPermission(RESOURCES.STORES, ACTIONS.READ),
      canSearchStores: this.hasPermission(RESOURCES.STORES, ACTIONS.SEARCH),
      canSubmitRating: this.hasPermission(RESOURCES.RATINGS, ACTIONS.CREATE),
      canModifyRating: this.hasPermission(RESOURCES.RATINGS, ACTIONS.UPDATE),
      
      // Challenge requirements - Store Owner
      canViewStoreRatings: this.isStoreOwner() && this.hasPermission(RESOURCES.RATINGS, ACTIONS.READ),
      canViewRatingUsers: this.isStoreOwner() && this.hasPermission(RESOURCES.USERS, ACTIONS.READ),
      canViewStoreAnalytics: this.isStoreOwner() && this.hasPermission(RESOURCES.ANALYTICS, ACTIONS.READ),
      
      // Additional capabilities
      canModerateRatings: this.hasPermission(RESOURCES.RATINGS, ACTIONS.MODERATE),
      canManageCategories: this.hasPermission(RESOURCES.CATEGORIES, ACTIONS.MANAGE),
      canSendNotifications: this.hasPermission(RESOURCES.NOTIFICATIONS, ACTIONS.CREATE),
      canAccessSystemSettings: this.hasPermission(RESOURCES.SYSTEM, ACTIONS.MANAGE),
    };

    return capabilities;
  }
}

// Permission-based UI utilities
export const permissionUtils = {
  // Filter menu items based on permissions
  filterMenuItems: (menuItems, permissionChecker) => {
    if (!permissionChecker.user) return [];

    return menuItems.filter(item => {
      if (!item.requiredPermissions) return true;
      
      return permissionChecker.hasPermissions(item.requiredPermissions);
    });
  },

  // Filter routes based on permissions
  filterRoutes: (routes, permissionChecker) => {
    if (!permissionChecker.user) return routes.filter(route => route.public);

    return routes.filter(route => {
      if (route.public) return true;
      if (!route.requiredPermissions) return true;
      
      return permissionChecker.hasPermissions(route.requiredPermissions);
    });
  },

  // Check if component should be visible
  shouldShowComponent: (requiredPermissions, permissionChecker) => {
    if (!requiredPermissions) return true;
    if (!permissionChecker.user) return false;
    
    return permissionChecker.hasPermissions(requiredPermissions);
  },

  // Get role-based redirect URL after login
  getRedirectUrl: (user) => {
    if (!user) return '/login';
    
    switch (user.role) {
      case USER_ROLES.SYSTEM_ADMINISTRATOR:
      case USER_ROLES.ADMIN:
        return '/admin/dashboard';
      case USER_ROLES.STORE_OWNER:
        return '/owner/dashboard';
      case USER_ROLES.USER:
      case USER_ROLES.NORMAL_USER:
        return '/stores';
      default:
        return '/';
    }
  },

  // Get role display name
  getRoleDisplayName: (role) => {
    return USER_ROLE_LABELS[role] || role;
  },

  // Get role-based theme
  getRoleTheme: (role) => {
    const roleThemes = {
      [USER_ROLES.SYSTEM_ADMINISTRATOR]: 'admin',
      [USER_ROLES.ADMIN]: 'admin',
      [USER_ROLES.STORE_OWNER]: 'business',
      [USER_ROLES.USER]: 'user',
      [USER_ROLES.NORMAL_USER]: 'user',
    };
    
    return roleThemes[role] || 'default';
  },

  // Validate role transition (for role changes)
  canChangeRole: (fromRole, toRole, changerRole) => {
    // Only system administrators can change roles
    if (changerRole !== USER_ROLES.SYSTEM_ADMINISTRATOR) {
      return false;
    }

    // Cannot change system administrator role unless you are system admin
    if (fromRole === USER_ROLES.SYSTEM_ADMINISTRATOR && changerRole !== USER_ROLES.SYSTEM_ADMINISTRATOR) {
      return false;
    }

    // Cannot assign system administrator role unless you are system admin
    if (toRole === USER_ROLES.SYSTEM_ADMINISTRATOR && changerRole !== USER_ROLES.SYSTEM_ADMINISTRATOR) {
      return false;
    }

    return true;
  },
};

// Permission decorators and HOCs
export const withPermissions = (requiredPermissions) => {
  return (Component) => {
    return (props) => {
      const permissionChecker = new PermissionChecker(props.user);
      
      if (!permissionUtils.shouldShowComponent(requiredPermissions, permissionChecker)) {
        return null;
      }
      
      return <Component {...props} permissionChecker={permissionChecker} />;
    };
  };
};

// Permission context helpers
export const createPermissionChecker = (user) => {
  return new PermissionChecker(user);
};

// Route guard function
export const requirePermissions = (requiredPermissions, user) => {
  const permissionChecker = new PermissionChecker(user);
  return permissionChecker.hasPermissions(requiredPermissions);
};

// Default exports
export default {
  PERMISSION_LEVELS,
  RESOURCES,
  ACTIONS,
  ROLE_PERMISSIONS,
  PermissionChecker,
  permissionUtils,
  withPermissions,
  createPermissionChecker,
  requirePermissions,
};
