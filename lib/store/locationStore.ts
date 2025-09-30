/**
 * Location Store - Super Perfect Implementation
 * Global state management for user location and currency preferences
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: 'EGP' | 'USD';
  paymentMethod: 'paymob' | 'checkout';
  lastUpdated: number;
}

interface LocationState {
  location: LocationData | null;
  isLocationLoading: boolean;
  isLocationModalOpen: boolean;
  locationError: string | null;
  hasLocationPermission: boolean;

  // Actions
  // eslint-disable-next-line no-unused-vars
  setLocation: (location: LocationData) => void;
  // eslint-disable-next-line no-unused-vars
  setLocationLoading: (loading: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setLocationModalOpen: (open: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setLocationError: (error: string | null) => void;
  // eslint-disable-next-line no-unused-vars
  setHasLocationPermission: (hasPermission: boolean) => void;
  clearLocation: () => void;
  resetLocationState: () => void;
  isLocationStale: () => boolean;
}

const LOCATION_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      location: null,
      isLocationLoading: false,
      isLocationModalOpen: false,
      locationError: null,
      hasLocationPermission: false,

      setLocation: (location: LocationData) => {
        set({
          location: {
            ...location,
            lastUpdated: Date.now()
          },
          isLocationLoading: false,
          locationError: null,
          hasLocationPermission: true
        });
      },

      setLocationLoading: (loading: boolean) => {
        set({ isLocationLoading: loading });
      },

      setLocationModalOpen: (open: boolean) => {
        set({ isLocationModalOpen: open });
      },

      setLocationError: (error: string | null) => {
        set({
          locationError: error,
          isLocationLoading: false
        });
      },

      setHasLocationPermission: (hasPermission: boolean) => {
        set({ hasLocationPermission: hasPermission });
      },

      clearLocation: () => {
        set({
          location: null,
          locationError: null,
          hasLocationPermission: false
        });
      },

      resetLocationState: () => {
        set({
          location: null,
          isLocationLoading: false,
          isLocationModalOpen: false,
          locationError: null,
          hasLocationPermission: false
        });
      },

      isLocationStale: () => {
        const { location } = get();
        if (!location) return true;

        const now = Date.now();
        return now - location.lastUpdated > LOCATION_CACHE_DURATION;
      }
    }),
    {
      name: 'location-store',
      version: 2
    }
  )
);
