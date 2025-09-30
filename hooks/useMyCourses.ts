import { useQuery } from '@tanstack/react-query';
import { createUserApiClient, UserCourse } from '@/lib/api/user';
import { useAuthStore } from '@/lib/store/authStore';

// Create a dedicated client for user courses
const userApi = createUserApiClient();

/**
 * Query key factory for my-courses related queries
 */
export const myCoursesKeys = {
  all: ['my-courses'] as const,
  list: () => [...myCoursesKeys.all, 'list'] as const,
  completed: () => [...myCoursesKeys.all, 'completed'] as const,
  inProgress: () => [...myCoursesKeys.all, 'in-progress'] as const
};

/**
 * Hook for fetching all user courses
 */
export const useMyCourses = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myCoursesKeys.list(),
    queryFn: async (): Promise<UserCourse[]> => {
      try {
        const response = await userApi.get('/my-courses');

        // Handle the new API response structure
        if (
          response.data &&
          response.data.status === 'success' &&
          response.data.data
        ) {
          return response.data.data;
        }

        // Fallback for direct array response
        if (Array.isArray(response.data)) {
          return response.data;
        }

        // Fallback for older wrapped structure
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }

        return [];
      } catch (error: any) {
        console.error('Error fetching my courses:', error);
        throw error; // Properly throw error so UI can handle it
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2 // Allow retries for network issues
  });
};

/**
 * Hook for fetching completed user courses
 */
export const useCompletedCourses = () => {
  const {
    data: allCourses,
    isLoading,
    isError,
    error,
    refetch
  } = useMyCourses();

  const completedCourses =
    allCourses?.filter((course) => course.booking_status === 'Completed') || [];

  return {
    data: completedCourses,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * Hook for fetching in-progress user courses
 */
export const useInProgressCourses = () => {
  const {
    data: allCourses,
    isLoading,
    isError,
    error,
    refetch
  } = useMyCourses();

  const inProgressCourses =
    allCourses?.filter(
      (course) =>
        course.booking_status === 'Confirmed' ||
        course.booking_status === 'In Progress'
    ) || [];

  return {
    data: inProgressCourses,
    isLoading,
    isError,
    error,
    refetch
  };
};
