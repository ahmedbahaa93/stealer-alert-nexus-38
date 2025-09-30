/**
 * Authentication Provider
 * Manages authentication state and automatic token refresh
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { initializeAuth } from '@/lib/utils/authSync';

// Initialize auth state from localStorage to cookies immediately
if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken) {
        // Set cookie for middleware access
        document.cookie = `access_token=${accessToken}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
    }

    if (refreshToken) {
        // Set refresh token cookie  
        document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
    }
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { isLoading } = useAuth();

    useEffect(() => {
        // Initialize auth state synchronization
        const cleanup = initializeAuth();

        // Set up axios interceptors or fetch interceptors here
        // to automatically include auth tokens in requests

        // Example for fetch interceptor - only for API requests
        const originalFetch = window.fetch;
        window.fetch = async (input, init) => {
            // Only add auth headers for API requests
            const url = typeof input === 'string' ? input :
                input instanceof Request ? input.url :
                    input instanceof URL ? input.toString() : '';
            const isApiRequest = url.includes('/api/') || url.includes('booking-courses');

            if (isApiRequest) {
                const token = localStorage.getItem('access_token');

                if (token) {
                    init = init || {};
                    init.headers = {
                        ...init.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
            }

            try {
                return await originalFetch(input, init);
            } catch (error) {
                // Don't throw on network errors, just log them
                console.warn('Fetch error:', error);
                // Return a failed response instead of throwing
                return new Response(null, {
                    status: 500,
                    statusText: 'Network Error',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        };

        // Cleanup
        return () => {
            window.fetch = originalFetch;
            if (cleanup) cleanup();
        };
    }, []);

    // Don't render anything while loading auth state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <>{children}</>;
};

// Hook to get authentication status
export const useAuthStatus = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    return {
        isAuthenticated,
        user,
        isLoading,
        isGuest: !isAuthenticated && !isLoading
    };
};
