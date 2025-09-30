import axios from 'axios';

const BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1/user';

// Create an axios instance with the base URL
const settingsApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token from localStorage
settingsApiClient.interceptors.request.use(
  (config) => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define types
export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string; // This needs to match what the backend expects
  // These are the exact field names used in useUserProfile.ts
}

export interface DeleteAccountParams {
  password: string;
}

// API functions
export const changePassword = async (params: ChangePasswordParams) => {
  try {
    // Try PATCH instead of POST based on useUserProfile.ts implementation
    console.log('Sending change password request:', {
      ...params,
      currentPassword: '[REDACTED]',
      newPassword: '[REDACTED]',
      confirmPassword: '[REDACTED]'
    });

    const response = await settingsApiClient.patch('/change-password', params);
    console.log('Change password API response:', response);
    return response;
  } catch (error) {
    console.error('API Error in changePassword:', error);
    // Log more detailed error information
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    throw error;
  }
};

export const deleteAccount = async (params: DeleteAccountParams) => {
  try {
    console.log('Sending delete account request:', {
      password: '[REDACTED]'
    });

    // Try with the exact URL from your requirements
    const response = await axios.post(
      'https://booking-courses-gilt.vercel.app/api/v1/user/delete-account',
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    );
    console.log('Delete account API response:', response);
    return response;
  } catch (error) {
    console.error('API Error in deleteAccount:', error);
    // Log more detailed error information
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    throw error;
  }
};

export default settingsApiClient;
