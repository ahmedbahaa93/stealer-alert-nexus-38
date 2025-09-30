/**
 * Authentication Store
 * Global state management for user authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  tokenExpiry: number | null;

  // Actions
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User) => void;
  // eslint-disable-next-line no-unused-vars
  setAccessToken: (token: string) => void;
  // eslint-disable-next-line no-unused-vars
  setRefreshToken: (token: string) => void;
  // eslint-disable-next-line no-unused-vars
  setLoading: (loading: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setRememberMe: (remember: boolean) => void;
  login: (
    // eslint-disable-next-line no-unused-vars
    _user: User,
    // eslint-disable-next-line no-unused-vars
    _token: string,
    // eslint-disable-next-line no-unused-vars
    _refreshToken?: string,
    // eslint-disable-next-line no-unused-vars
    _remember?: boolean
  ) => void;
  logout: () => void;
  clearAuth: () => void;
  isTokenExpired: () => boolean;
  refreshAccessToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: false,
      tokenExpiry: null,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setAccessToken: (token) => {
        const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        set({ accessToken: token, tokenExpiry: expiry });
        localStorage.setItem('access_token', token);
        // Also set cookie for middleware access
        document.cookie = `access_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
      },

      setRefreshToken: (token) => {
        set({ refreshToken: token });
        localStorage.setItem('refresh_token', token);
        // Also set cookie for middleware access
        document.cookie = `refresh_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setRememberMe: (remember) => set({ rememberMe: remember }),

      login: (user, token, refreshToken, remember = false) => {
        const expiry =
          Date.now() +
          (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000); // 30 days or 24 hours
        set({
          user,
          accessToken: token,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          rememberMe: remember,
          tokenExpiry: expiry
        });
        localStorage.setItem('access_token', token);
        // Set cookies for middleware access
        const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // seconds
        document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          rememberMe: false,
          tokenExpiry: null
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Clear cookies as well
        document.cookie =
          'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie =
          'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          rememberMe: false,
          tokenExpiry: null
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Clear cookies as well
        document.cookie =
          'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie =
          'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      },

      isTokenExpired: () => {
        const { tokenExpiry } = get();
        return tokenExpiry ? Date.now() > tokenExpiry : true;
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          });

          if (response.ok) {
            const { accessToken, refreshToken: newRefreshToken } =
              await response.json();
            const expiry = Date.now() + 24 * 60 * 60 * 1000;
            set({
              accessToken,
              refreshToken: newRefreshToken || refreshToken,
              tokenExpiry: expiry
            });
            localStorage.setItem('access_token', accessToken);
            // Update cookie as well
            document.cookie = `access_token=${accessToken}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
              document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
            }
            return true;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
        return false;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
        tokenExpiry: state.tokenExpiry
      })
    }
  )
);
