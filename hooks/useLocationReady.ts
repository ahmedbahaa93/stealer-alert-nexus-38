/**
 * Location Ready Hook
 * Ensures location is available before making API calls that depend on location
 */

import { useEffect, useState, useCallback } from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { locationService } from '@/lib/services/locationService';

interface UseLocationReadyOptions {
  /** Whether to auto-detect location if not available */
  autoDetect?: boolean;
  /** Whether to show location modal if auto-detection fails */
  showModalOnFail?: boolean;
  /** Minimum age of location data to consider valid (in milliseconds) */
  maxLocationAge?: number;
}

interface UseLocationReadyReturn {
  /** Whether location is ready and valid */
  isLocationReady: boolean;
  /** Whether location is currently being detected */
  isDetecting: boolean;
  /** Any error that occurred during location detection */
  error: string | null;
  /** Force re-detection of location */
  redetectLocation: () => Promise<void>;
}

export const useLocationReady = (
  options: UseLocationReadyOptions = {}
): UseLocationReadyReturn => {
  const {
    autoDetect = true,
    showModalOnFail = false,
    maxLocationAge = 24 * 60 * 60 * 1000 // 24 hours
  } = options;

  const { location, setLocation, setLocationModalOpen, isLocationStale } =
    useLocationStore();

  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if location is ready
  const isLocationReady = Boolean(
    location &&
      !isLocationStale() &&
      Date.now() - location.lastUpdated < maxLocationAge
  );

  const detectLocation = useCallback(async (): Promise<void> => {
    if (isDetecting) return;

    setIsDetecting(true);
    setError(null);

    try {
      console.log('🔍 Detecting location for API calls...');
      const detectedLocation = await locationService.getUserLocation();

      if (detectedLocation) {
        setLocation(detectedLocation);
        console.log('✅ Location ready for API calls:', detectedLocation);
      } else {
        throw new Error('Failed to detect location');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Location detection failed';
      setError(errorMessage);
      console.warn('⚠️ Location detection failed:', errorMessage);

      if (showModalOnFail) {
        setLocationModalOpen(true);
      } else {
        // Set default location as fallback
        const defaultLocation = locationService.getDefaultLocation();
        setLocation(defaultLocation);
        console.log('🌍 Using default location for API calls');
      }
    } finally {
      setIsDetecting(false);
    }
  }, [isDetecting, setLocation, setLocationModalOpen, showModalOnFail]);

  const redetectLocation = async (): Promise<void> => {
    await detectLocation();
  };

  useEffect(() => {
    if (!isLocationReady && autoDetect && !isDetecting) {
      detectLocation();
    }
  }, [isLocationReady, autoDetect, isDetecting, detectLocation]);

  return {
    isLocationReady,
    isDetecting,
    error,
    redetectLocation
  };
};
