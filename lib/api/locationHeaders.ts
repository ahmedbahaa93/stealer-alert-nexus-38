/**
 * Location Headers Utilities
 * Centralized location header management for API requests
 */

import { useLocationStore } from '@/lib/store/locationStore';

/**
 * Get location-aware headers for API requests
 * These headers help the backend determine the correct currency and pricing
 */
export const getLocationHeaders = (): Record<string, string> => {
  const location = useLocationStore.getState().location;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  if (location) {
    // Send user's location information to backend
    headers['X-User-Country'] = location.countryCode;
    headers['X-User-Currency'] = location.currency;
    headers['X-User-City'] = location.city;
    headers['X-User-Timezone'] = location.timezone || 'UTC';

    // Add a timestamp of when location was last updated
    headers['X-Location-Updated'] = location.lastUpdated.toString();
  }

  return headers;
};

/**
 * Get auth headers with location information
 * Combines authentication and location headers
 */
export const getAuthLocationHeaders = (
  token?: string
): Record<string, string> => {
  const headers = getLocationHeaders();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Debug function to log location headers
 */
export const debugLocationHeaders = (): void => {
  const headers = getLocationHeaders();
  console.log('🌍 Location Headers:', headers);
};
