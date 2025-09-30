import axios from 'axios';

const API_BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1';

export const contactApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor for adding auth tokens or other headers if needed
contactApi.interceptors.request.use(
  (config) => {
    // Add any global request configuration here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global error responses
contactApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.code === 'ECONNABORTED') {
      error.isTimeout = true;
    }

    if (error.response?.status === 429) {
      error.isRateLimit = true;
    }

    return Promise.reject(error);
  }
);

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  for: string;
  message: string;
  country: {
    en: string;
    ar: string;
  };
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ContactFormError {
  message: string;
  field?: string;
  code?: string;
  isTimeout?: boolean;
  isRateLimit?: boolean;
  isNetworkError?: boolean;
}

export const submitContactForm = async (
  data: ContactFormData
): Promise<ContactFormResponse> => {
  try {
    const response = await contactApi.post('/messages', data);
    return response.data;
  } catch (error: any) {
    // Transform error for better handling
    const transformedError: ContactFormError = {
      message: 'An unexpected error occurred',
      isNetworkError: !error.response,
      isTimeout: error.isTimeout,
      isRateLimit: error.isRateLimit
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      transformedError.message =
        data?.message || getErrorMessageByStatus(status);
      transformedError.code = status.toString();
      transformedError.field = data?.field;
    } else if (error.request) {
      // Network error
      transformedError.message = 'Network error. Please check your connection.';
      transformedError.isNetworkError = true;
    }

    throw transformedError;
  }
};

const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid form data. Please check your inputs.';
    case 401:
      return 'Unauthorized. Please refresh and try again.';
    case 403:
      return 'Access denied. Please contact support.';
    case 404:
      return 'Service not found. Please try again later.';
    case 422:
      return 'Validation error. Please check your inputs.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
