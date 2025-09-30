import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createUserApiClient,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  UserCourse,
  UserPayment,
  UserCertificate
} from '@/lib/api/user';
import { useAuthStore } from '@/lib/store/authStore';

// Create a dedicated client for user profile
const userApi = createUserApiClient();

/**
 * Query key factory for user-related queries
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  courses: () => [...userKeys.all, 'courses'] as const,
  payments: () => [...userKeys.all, 'payments'] as const,
  certificates: () => [...userKeys.all, 'certificates'] as const
};

/**
 * Hook for fetching user profile data
 */
export const useUserProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async (): Promise<UserProfile> => {
      try {
        const response = await userApi.get('/profile');

        // Handle the new API response structure
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        }

        // Fallback for older API structure
        if (response.data && response.data.data) {
          return response.data.data;
        }

        throw new Error('Invalid response structure');
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        throw new Error(
          error.response?.data?.message || 'Failed to fetch profile data'
        );
      }
    },
    enabled: isAuthenticated, // Only run the query if the user is authenticated
    staleTime: 1000 * 60 * 10 // 10 minutes
  });
};

/**
 * Hook for fetching user courses
 */
export const useUserCourses = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.courses(),
    queryFn: async (): Promise<UserCourse[]> => {
      try {
        const response = await userApi.get('/my-courses');

        // Handle the new API response structure
        if (response.data && response.data.status === 'success') {
          return response.data.data || [];
        }

        // Fallback for older API structure
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }

        // If data is directly an array
        if (Array.isArray(response.data)) {
          return response.data;
        }

        return [];
      } catch (error: any) {
        console.error('Error fetching user courses:', error);
        throw new Error(
          error.response?.data?.message || 'Failed to fetch courses data'
        );
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2 // Allow retry for network issues
  });
};

/**
 * Hook for fetching user payment records
 */
export const useUserPayments = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.payments(),
    queryFn: async (): Promise<UserPayment[]> => {
      try {
        const response = await userApi.get('/payments');

        // Handle the new API response structure
        if (
          response.data &&
          response.data.status === 'success' &&
          response.data.data
        ) {
          return response.data.data;
        }

        // Fallback for older API structure
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }

        return [];
      } catch (error: any) {
        console.error('Error fetching payment records:', error);
        throw new Error(
          error.response?.data?.message || 'Failed to fetch payment data'
        );
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

/**
 * Hook for fetching user certificates
 */
export const useUserCertificates = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.certificates(),
    queryFn: async (): Promise<UserCertificate[]> => {
      try {
        const response = await userApi.get('/my-certificates');

        // Handle the new API response structure
        if (
          response.data &&
          response.data.status === 'success' &&
          response.data.data &&
          response.data.data.certificates
        ) {
          return response.data.data.certificates;
        }

        // Fallback for older API structure
        if (response.data && response.data.data) {
          return Array.isArray(response.data.data) ? response.data.data : [];
        }

        return [];
      } catch (error: any) {
        console.error('Error fetching certificates:', error);
        throw new Error(
          error.response?.data?.message || 'Failed to fetch certificate data'
        );
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest) => {
      const { data } = await userApi.patch('/update-profile', profileData);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data after successful update
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    }
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest) => {
      const { data } = await userApi.patch('/change-password', passwordData);
      return data;
    }
  });
};

/**
 * Hook for deleting account
 */
export const useDeleteAccount = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async (deleteData: DeleteAccountRequest) => {
      const { data } = await userApi.post('/delete-account', deleteData);
      return data;
    },
    onSuccess: () => {
      // Clear auth data after account deletion
      clearAuth();
    }
  });
};
