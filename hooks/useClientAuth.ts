'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

/**
 * Hook to ensure auth state is properly hydrated on client
 * Prevents hydration mismatches between server and client
 */
export const useClientAuth = () => {
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return loading state until client is hydrated
  return {
    isAuthenticated: isClient ? isAuthenticated : false,
    user: isClient ? user : null,
    accessToken: isClient ? accessToken : null,
    isLoading: !isClient
  };
};
