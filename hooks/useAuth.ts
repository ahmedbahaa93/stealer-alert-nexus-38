/**
 * Authentication Hook
 * Handles automatic token refresh and session management
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export const useAuth = () => {
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    rememberMe,
    isTokenExpired,
    refreshAccessToken,
    logout,
    setLoading
  } = useAuthStore();

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh token logic
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!isAuthenticated || !accessToken) return;

      if (isTokenExpired()) {
        setLoading(true);
        try {
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            // If refresh fails, logout user
            logout();
            console.log('Session expired. Please log in again.');
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    // Check token immediately
    checkAndRefreshToken();

    // Set up interval for token refresh
    if (isAuthenticated && refreshToken) {
      refreshIntervalRef.current = setInterval(
        checkAndRefreshToken,
        rememberMe ? 30 * 60 * 1000 : 15 * 60 * 1000 // 30 min for remember me, 15 min otherwise
      );
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [
    isAuthenticated,
    accessToken,
    refreshToken,
    rememberMe,
    isTokenExpired,
    refreshAccessToken,
    logout,
    setLoading
  ]);

  // Restore token from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');

    if (storedToken && !accessToken) {
      // Token exists in localStorage but not in state, check if it's valid
      if (isTokenExpired()) {
        refreshAccessToken().catch(() => {
          logout();
        });
      }
    }
  }, [accessToken, isTokenExpired, refreshAccessToken, logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    rememberMe
  };
};

// Hook for protecting routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};

// Hook for auto-logout on tab close (optional)
export const useAutoLogout = () => {
  const { logout, rememberMe } = useAuthStore();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!rememberMe) {
        // Only logout if remember me is not checked
        logout();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [logout, rememberMe]);
};
