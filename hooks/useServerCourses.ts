import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { CourseFilters } from '@/lib/api/config';
import { CoursesResponse } from '@/lib/types/course';

// Server-side API hook for courses with filters
export function useServerFilteredCourses(filters: CourseFilters = {}) {
  return useQuery<CoursesResponse>({
    queryKey: ['courses', 'server-filtered', filters],
    queryFn: async () => {
      // Build query parameters for the API
      const params = new URLSearchParams();

      // Add all filters as query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });

      const response = await fetch(
        `/api/proxy?path=/courses&${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    },
    enabled: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408, 429
      if (error?.status >= 400 && error?.status < 500) {
        if (error?.status === 408 || error?.status === 429) {
          return failureCount < 2;
        }
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}

// Hook for server-side filtered courses data
export function useServerFilteredCoursesData(filters: CourseFilters = {}) {
  const query = useServerFilteredCourses(filters);

  return {
    courses: query.data?.data?.courses || [],
    pagination: query.data?.pagination || {
      currentPage: 1,
      limit: 12,
      numberOfPages: 1
    },
    total: query.data?.results || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    isPlaceholderData: query.isPlaceholderData
  };
}
