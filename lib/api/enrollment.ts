/**
 * Course Enrollment API Service
 * Handles enrollment with Stripe and Paymob payment providers
 */

import { useAuthStore } from '@/lib/store/authStore';
import { getAuthLocationHeaders } from './locationHeaders';

const API_BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1';

// Types
export interface EnrollmentRequest {
  courseId: string;
  start_date: string;
  course_type: string;
}

export interface EnrollmentResponse {
  status: string;
  code: number;
  message?: string;
  data?: {
    sessionId?: string;
    redirectUrl?: string;
    paymentId?: string;
    [key: string]: any;
  };
}

export interface EnrollmentError {
  message: string;
  code?: number;
  type?:
    | 'NETWORK_ERROR'
    | 'AUTH_ERROR'
    | 'VALIDATION_ERROR'
    | 'PAYMENT_ERROR'
    | 'SERVER_ERROR';
  details?: any;
}

export type PaymentProvider = 'stripe' | 'paymob';

class EnrollmentAPIError extends Error {
  public code?: number;
  public type?: string;
  public details?: any;

  constructor(message: string, code?: number, type?: string, details?: any) {
    super(message);
    this.name = 'EnrollmentAPIError';
    this.code = code;
    this.type = type;
    this.details = details;
  }
}

class EnrollmentAPI {
  private getAuthHeaders(): HeadersInit {
    const token = useAuthStore.getState().accessToken;
    return getAuthLocationHeaders(token || undefined);
  }

  private async makeRequest<T>(
    endpoint: string,
    data: EnrollmentRequest
  ): Promise<T> {
    try {
      // Check authentication first
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        throw new EnrollmentAPIError(
          'Authentication required. Please log in to enroll in courses.',
          401,
          'AUTH_ERROR'
        );
      }

      const url = `${API_BASE_URL}${endpoint}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      // Handle different status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        switch (response.status) {
          case 401:
            // Token expired or invalid
            useAuthStore.getState().logout();
            throw new EnrollmentAPIError(
              'Your session has expired. Please log in again.',
              401,
              'AUTH_ERROR',
              errorData
            );

          case 400:
            throw new EnrollmentAPIError(
              errorData?.message ||
                'Invalid enrollment data. Please check your course selection and start date.',
              400,
              'VALIDATION_ERROR',
              errorData
            );

          case 402:
            throw new EnrollmentAPIError(
              errorData?.message || 'Payment required to complete enrollment.',
              402,
              'PAYMENT_ERROR',
              errorData
            );

          case 404:
            throw new EnrollmentAPIError(
              'Course not found or no longer available.',
              404,
              'VALIDATION_ERROR',
              errorData
            );

          case 409:
            throw new EnrollmentAPIError(
              errorData?.message || 'You are already enrolled in this course.',
              409,
              'VALIDATION_ERROR',
              errorData
            );

          case 422:
            throw new EnrollmentAPIError(
              errorData?.message ||
                'Selected start date is not available or course is full.',
              422,
              'VALIDATION_ERROR',
              errorData
            );

          case 429:
            throw new EnrollmentAPIError(
              'Too many enrollment attempts. Please wait a moment before trying again.',
              429,
              'SERVER_ERROR',
              errorData
            );

          case 500:
          case 502:
          case 503:
          case 504:
            throw new EnrollmentAPIError(
              'Our servers are experiencing issues. Please try again in a few moments.',
              response.status,
              'SERVER_ERROR',
              errorData
            );

          default:
            throw new EnrollmentAPIError(
              errorData?.message ||
                `Enrollment failed with status: ${response.status}`,
              response.status,
              'SERVER_ERROR',
              errorData
            );
        }
      }

      const responseData = await response.json();

      // Validate response structure
      if (!responseData || typeof responseData !== 'object') {
        throw new EnrollmentAPIError(
          'Invalid response from server.',
          0,
          'SERVER_ERROR'
        );
      }

      return responseData;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new EnrollmentAPIError(
          'Network connection failed. Please check your internet connection and try again.',
          0,
          'NETWORK_ERROR'
        );
      }

      // Re-throw our custom errors
      if (error instanceof EnrollmentAPIError) {
        throw error;
      }

      // Handle unexpected errors
      throw new EnrollmentAPIError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during enrollment.',
        0,
        'SERVER_ERROR'
      );
    }
  }

  /**
   * Enroll in course with Stripe payment
   */
  async enrollWithStripe(data: EnrollmentRequest): Promise<EnrollmentResponse> {
    return this.makeRequest<EnrollmentResponse>(
      '/checkouts/stripe/bookCourse',
      data
    );
  }

  /**
   * Enroll in course with Paymob payment
   */
  async enrollWithPaymob(data: EnrollmentRequest): Promise<EnrollmentResponse> {
    return this.makeRequest<EnrollmentResponse>(
      '/checkouts/paymob/courses',
      data
    );
  }

  /**
   * Generic enrollment method that selects payment provider
   */
  async enrollInCourse(
    data: EnrollmentRequest,
    provider: PaymentProvider
  ): Promise<EnrollmentResponse> {
    // Validate input data
    if (!data.courseId || typeof data.courseId !== 'string') {
      throw new EnrollmentAPIError(
        'Course ID is required and must be a valid string.',
        400,
        'VALIDATION_ERROR'
      );
    }

    if (!data.start_date || typeof data.start_date !== 'string') {
      throw new EnrollmentAPIError(
        'Start date is required and must be a valid date string.',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Normalize and validate date format
    let normalizedDate = data.start_date.trim();

    // Try to parse and reformat the date if it's not in YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
      try {
        const parsedDate = new Date(normalizedDate);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid date');
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');

        normalizedDate = `${year}-${month}-${day}`;
      } catch (parseError) {
        console.error('Date parsing error:', parseError);
        throw new EnrollmentAPIError(
          'Start date must be a valid date in YYYY-MM-DD format or a parseable date string.',
          400,
          'VALIDATION_ERROR'
        );
      }
    }

    // Update the data with normalized date
    data.start_date = normalizedDate;

    // Ensure start date is in the future
    const startDate = new Date(normalizedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only

    if (startDate < today) {
      throw new EnrollmentAPIError(
        'Start date must be in the future.',
        400,
        'VALIDATION_ERROR'
      );
    }

    switch (provider) {
      case 'stripe':
        return this.enrollWithStripe(data);
      case 'paymob':
        return this.enrollWithPaymob(data);
      default:
        throw new EnrollmentAPIError(
          'Invalid payment provider. Please select Stripe or Paymob.',
          400,
          'VALIDATION_ERROR'
        );
    }
  }
}

// Export singleton instance
export const enrollmentApi = new EnrollmentAPI();

// Export error class for type checking
export { EnrollmentAPIError };
