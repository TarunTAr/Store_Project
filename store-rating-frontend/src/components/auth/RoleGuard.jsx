// ==========================================================================
// RoleGuard Component - Store Rating Platform
// Role-based access control for different user types (Challenge requirement)
// ==========================================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RoleGuard = ({ children, allowedRoles, fallbackPath = '/unauthorized' }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const userRole = user?.role;
  const hasRequiredRole = allowedRoles.includes(userRole);

  // If user doesn't have required role, redirect to unauthorized page
  if (!hasRequiredRole) {
    console.warn(`Access denied. User role: ${userRole}, Required roles: ${allowedRoles.join(', ')}`);
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has required role
  return children;
};

export default RoleGuard;
