import { useState, useEffect, useContext, createContext, useCallback } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear stored data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user: userData } = data;
        
        // Store auth data
        if (rememberMe) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('auth_token', token);
          sessionStorage.setItem('user_data', JSON.stringify(userData));
        }
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        setError(data.message || 'Login failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      } else {
        setError(data.message || 'Registration failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [login]);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (token) {
        // Notify backend of logout
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data');
      
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        
        // Update stored user data
        const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
        storage.setItem('user_data', JSON.stringify(updatedUser));
        
        return { success: true, user: updatedUser };
      } else {
        setError(data.message || 'Profile update failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        setError(data.message || 'Password change failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to change password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  // Get auth token
  const getToken = useCallback(() => {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
        storage.setItem('user_data', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [getToken]);

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole,
    getToken,
    refreshUser,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
