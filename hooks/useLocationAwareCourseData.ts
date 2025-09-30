/**
 * Location-Aware Course Data Hook
 * Ensures location is ready before fetching course data to get correct pricing
 */

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/lib/api/courses';
import { useLocationReady } from './useLocationReady';
import { CoursesResponse } from '@/lib/types/course';

interface UseLocationAwareCourseDataOptions {
  /** Whether to auto-detect location before fetching */
  autoDetectLocation?: boolean;
  /** Whether to show location modal if detection fails */
  showLocationModal?: boolean;
  /** Query options to pass to React Query */
  queryOptions?: {
    staleTime?: number;
    gcTime?: number;
    refetchOnWindowFocus?: boolean;
  };
}

/**
 * Hook for fetching all courses with location-aware pricing
 */
export const useLocationAwareCourses = (
  options: UseLocationAwareCourseDataOptions = {}
) => {
  const {
    autoDetectLocation = true,
    showLocationModal = false,
    queryOptions = {}
  } = options;

  const { isLocationReady, isDetecting: isDetectingLocation } =
    useLocationReady({
      autoDetect: autoDetectLocation,
      showModalOnFail: showLocationModal
    });

  return useQuery<CoursesResponse>({
    queryKey: ['courses', 'location-aware'],
    queryFn: () => courseApi.getCourses(),
    enabled: isLocationReady, // Only fetch when location is ready
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    ...queryOptions,
    meta: {
      isDetectingLocation
    }
  });
};

/**
 * Hook for fetching discounted courses with location-aware pricing
 */
export const useLocationAwareDiscountedCourses = (
  options: UseLocationAwareCourseDataOptions = {}
) => {
  const {
    autoDetectLocation = true,
    showLocationModal = false,
    queryOptions = {}
  } = options;

  const { isLocationReady, isDetecting: isDetectingLocation } =
    useLocationReady({
      autoDetect: autoDetectLocation,
      showModalOnFail: showLocationModal
    });

  return useQuery<CoursesResponse>({
    queryKey: ['courses', 'discounted', 'location-aware'],
    queryFn: () => courseApi.getDiscountedCourses(),
    enabled: isLocationReady,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    ...queryOptions,
    meta: {
      isDetectingLocation
    }
  });
};

/**
 * Hook for fetching course details with location-aware pricing
 */
export const useLocationAwareCourseDetail = (
  courseId: string,
  options: UseLocationAwareCourseDataOptions = {}
) => {
  const {
    autoDetectLocation = true,
    showLocationModal = false,
    queryOptions = {}
  } = options;

  const { isLocationReady, isDetecting: isDetectingLocation } =
    useLocationReady({
      autoDetect: autoDetectLocation,
      showModalOnFail: showLocationModal
    });

  return useQuery({
    queryKey: ['course', courseId, 'location-aware'],
    queryFn: () => courseApi.getCourseDetail(courseId),
    enabled: isLocationReady && Boolean(courseId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    ...queryOptions,
    meta: {
      isDetectingLocation
    }
  });
};
