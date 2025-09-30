import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// API base URL for user-related endpoints
const API_BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1/user';

/**
 * Creates an axios instance for user API requests with auth token
 */
export const createUserApiClient = () => {
  const accessToken = useAuthStore.getState().accessToken;

  const userApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  });

  // Request interceptor for adding auth tokens
  userApi.interceptors.request.use(
    (config) => {
      // Get the latest token for each request
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling global error responses
  userApi.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common error scenarios
      if (error.code === 'ECONNABORTED') {
        error.isTimeout = true;
      }

      if (error.response?.status === 401) {
        error.isAuthError = true;
        // Handle unauthorized errors (potentially refresh token or logout)
        useAuthStore.getState().logout();
      }

      if (error.response?.status === 429) {
        error.isRateLimit = true;
      }

      return Promise.reject(error);
    }
  );

  return userApi;
};

// Response interfaces
export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  count?: number;
}

// User profile interfaces
export interface UserLocation {
  country: string;
  city: string;
  address: string;
}

export interface UserProfessionalInfo {
  current_job_title: string;
  company_organization_name: string;
  industry_field_of_work: string;
  years_of_experience: number;
}

export interface UserEducationInfo {
  highest_education_level: string;
  field_of_study: string;
  graduation_year: number;
  university_institution_name: string;
}

export interface UserPersonalInfo {
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  location: UserLocation;
  profile_image?: string;
}

export interface UserProfile {
  avatar: string;
  personal_info: UserPersonalInfo;
  professional_info: UserProfessionalInfo;
  education_info: UserEducationInfo;
}

// Course interfaces
export interface CourseInfo {
  _id: string;
  title: string;
  description: string;
  image: string;
  course_type: string | string[];
  duration: number;
}

export interface UserCourse {
  _id: string;
  course: CourseInfo;
  selected_start_date?: string;
  booking_status: string;
  payment_status: string;
}

// Payment interfaces
export interface CourseTitle {
  en: string;
  ar: string;
}

export interface UserPayment {
  _id: string;
  image: string;
  course_title: CourseTitle | string;
  paid_amount?: number; // For old API format
  initial_payment_amount?: number; // For new API format
  payment_method: string;
  payment_type: string;
  payment_status: string;
  createdAt?: string;
}

// Certificate interfaces
export interface UserInfo {
  _id: string;
  first_name: string;
  last_name: string;
}

export interface CourseInfo {
  _id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  course_type: string | string[];
  selected_start_date?: string;
}

export interface UserCertificate {
  _id: string;
  userInfo: UserInfo;
  courseInfo: CourseInfo;
  certificate_url?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  course_title?: CourseTitle; // Adding this for backwards compatibility
}

// Request body interfaces
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone_number?: string;
  gender?: string;
  date_of_birth?: string;
  current_job_title?: string;
  company_organization_name?: string;
  industry_field_of_work?: string;
  years_of_experience?: number;
  highest_education_level?: string;
  field_of_study?: string;
  graduation_year?: number;
  university_institution_name?: string;
  location?: {
    country?: string;
    city?: string;
    address?: string;
  };
}
