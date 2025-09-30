/**
 * Auth Synchronization Utility
 * Ensures authentication state is properly synced between localStorage, cookies, and store
 */

import { useAuthStore } from '@/lib/store/authStore';

export const syncAuthState = () => {
  if (typeof window === 'undefined') return;

  const { accessToken, setAccessToken, clearAuth } = useAuthStore.getState();

  // Check localStorage for access token
  const storedToken = localStorage.getItem('access_token');

  // If we have a token in localStorage but not in store, sync it
  if (storedToken && !accessToken) {
    setAccessToken(storedToken);
    // Also ensure cookie is set
    document.cookie = `access_token=${storedToken}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
  }

  // If we have a token in store but not in localStorage, clear store
  if (!storedToken && accessToken) {
    clearAuth();
  }

  // Sync cookie with current token
  if (storedToken) {
    document.cookie = `access_token=${storedToken}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
  }
};

export const initializeAuth = () => {
  if (typeof window === 'undefined') return;

  // Run sync on app initialization
  syncAuthState();

  // Set up periodic sync every 30 seconds
  const interval = setInterval(syncAuthState, 30000);

  // Cleanup function
  return () => clearInterval(interval);
};
