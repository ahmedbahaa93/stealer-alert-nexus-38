'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  ChangePasswordParams,
  DeleteAccountParams,
  changePassword,
  deleteAccount,
  default as settingsApiClient
} from '@/lib/api/settings';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export const useChangePassword = () => {
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ChangePasswordParams) => {
      try {
        // Make sure we have a token
        if (!accessToken) {
          console.error('No access token available');
          throw new Error('Authentication required');
        }

        // First attempt with PATCH method
        try {
          const response = await changePassword(data);
          console.log(
            'Change password mutation successful with PATCH:',
            response
          );
          return response.data;
        } catch (patchError) {
          console.error('PATCH method failed, error:', patchError);

          // If PATCH fails, try POST as fallback
          if (axios.isAxiosError(patchError)) {
            console.log('Trying POST method as fallback...');
            const postResponse = await settingsApiClient.post(
              '/change-password',
              data
            );
            console.log(
              'Change password mutation successful with POST:',
              postResponse
            );
            return postResponse.data;
          }

          throw patchError;
        }
      } catch (error) {
        console.error(
          'Change password mutation error (all methods failed):',
          error
        );
        throw error;
      }
    }
  });
};

export const useDeleteAccount = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: async (data: DeleteAccountParams) => {
      try {
        // Make sure we have a token
        if (!accessToken) {
          console.error('No access token available for delete account');
          throw new Error('Authentication required');
        }

        // Try with the direct API function first
        try {
          const response = await deleteAccount(data);
          console.log('Delete account mutation successful:', response);
          return response.data;
        } catch (deleteError) {
          console.error('First delete attempt failed:', deleteError);

          // If that fails, try with a direct axios call as a fallback
          if (
            axios.isAxiosError(deleteError) &&
            deleteError.response?.status === 404
          ) {
            console.log('Trying alternative endpoint...');
            const fallbackResponse = await axios.post(
              'https://booking-courses-gilt.vercel.app/api/v1/users/delete-account', // Try 'users' instead of 'user'
              data,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
              }
            );
            console.log(
              'Delete account fallback successful:',
              fallbackResponse
            );
            return fallbackResponse.data;
          }

          throw deleteError;
        }
      } catch (error) {
        console.error(
          'Delete account mutation error (all attempts failed):',
          error
        );
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('Delete account error in hook:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete account',
        error
      };
    },
    onSuccess: () => {
      console.log('Delete account success, logging out and redirecting');
      // Clear auth state and redirect to homepage
      logout();
      router.push('/');
      return {
        success: true,
        message: 'Account deleted successfully'
      };
    }
  });
};
