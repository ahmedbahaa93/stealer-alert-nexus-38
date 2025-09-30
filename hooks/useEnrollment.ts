/**
 * Course Enrollment Hook
 * Provides enrollment functionality with error handling and state management
 */

import { useState, useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCustomToast } from '@/components/ui/CustomToastProvider';
import {
  enrollmentApi,
  EnrollmentAPIError,
  type EnrollmentRequest,
  type PaymentProvider
} from '@/lib/api/enrollment';
import type { EnrollmentState, EnrollmentData } from '@/lib/types/enrollment';

export const useEnrollment = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const customToast = useCustomToast();

  const [state, setState] = useState<EnrollmentState>({
    isLoading: false,
    isProcessing: false,
    error: null,
    success: false,
    selectedProvider: null,
    enrollmentData: null
  });

  // Reset state
  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      isProcessing: false,
      error: null,
      success: false,
      selectedProvider: null,
      enrollmentData: null
    });
  }, []);

  // Check authentication and redirect if needed
  const checkAuthentication = useCallback(() => {
    if (!isAuthenticated) {
      customToast.error(
        '🔐 Authentication Required',
        "Please log in to enroll in courses. You'll be redirected to the login page.",
        6000
      );

      // Redirect to login with return URL
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
      return false;
    }
    return true;
  }, [isAuthenticated, router, customToast]);

  // Handle enrollment errors with specific messaging
  const handleEnrollmentError = useCallback(
    (error: EnrollmentAPIError) => {
      let title = '❌ Enrollment Failed';
      let message = 'Unable to enroll in the course. Please try again.';
      let duration = 6000;

      switch (error.type) {
        case 'AUTH_ERROR':
          title = '🔐 Authentication Error';
          message = error.message;
          duration = 8000;
          // Redirect to login for auth errors
          setTimeout(() => {
            const currentPath = window.location.pathname;
            router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
          }, 2000);
          break;

        case 'VALIDATION_ERROR':
          title = '⚠️ Invalid Data';
          message = error.message;
          duration = 5000;
          break;

        case 'PAYMENT_ERROR':
          title = '💳 Payment Error';
          message = error.message;
          duration = 7000;
          break;

        case 'NETWORK_ERROR':
          title = '🌐 Connection Error';
          message = error.message;
          duration = 6000;
          break;

        case 'SERVER_ERROR':
          title = '🔧 Server Error';
          message = error.message;
          duration = 7000;
          break;

        default:
          title = '❌ Enrollment Failed';
          message =
            error.message || 'An unexpected error occurred during enrollment.';
          duration = 6000;
      }

      customToast.error(title, message, duration);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        isProcessing: false,
        error: error.message
      }));
    },
    [router, customToast]
  );

  // Enroll in course
  const enrollInCourse = useCallback(
    async (enrollmentData: EnrollmentData, provider: PaymentProvider) => {
      // Check authentication first
      if (!checkAuthentication()) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        isProcessing: false,
        error: null,
        selectedProvider: provider,
        enrollmentData
      }));

      try {
        // Show loading toast
        customToast.success(
          '⏳ Processing Enrollment',
          'Preparing your course enrollment...',
          3000
        );

        const request: EnrollmentRequest = {
          courseId: enrollmentData.courseId,
          start_date: enrollmentData.startDate,
          course_type: enrollmentData.course_type || 'Online'
        };

        setState((prev) => ({ ...prev, isProcessing: true }));

        const response = await enrollmentApi.enrollInCourse(request, provider);

        // Handle successful response - but this is just getting the payment URL, not completing payment
        if (
          response.status === 'success' ||
          response.code === 200 ||
          response.code === 201
        ) {
          // Do NOT set success: true here - user hasn't paid yet!
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isProcessing: false,
            success: false // Keep false until actual payment completion
          }));

          customToast.success(
            '💳 Payment Session Created',
            'Redirecting you to complete the payment...',
            4000
          );

          // Handle Paymob iframe response
          if (response.data?.iframe) {
            // Show payment ready message - not success yet
            customToast.success(
              '💳 Payment Ready',
              `Total: ${response.data.total_amount ? `${response.data.total_amount} EGP` : 'Processing...'}`,
              3000
            );

            // Save enrollment data to localStorage for retrieval after payment
            localStorage.setItem(
              'pendingEnrollment',
              JSON.stringify({
                courseId: enrollmentData.courseId,
                startDate: enrollmentData.startDate,
                courseTitle: enrollmentData.courseTitle || 'Course',
                price: response.data.total_amount || 0,
                currency: response.data.currency || 'EGP',
                date: new Date().toISOString(),
                provider: provider,
                status: 'pending', // Mark as pending until payment completion
                // Store user auth token for restoration after payment redirect
                userToken:
                  localStorage.getItem('auth-token') ||
                  sessionStorage.getItem('auth-token')
              })
            );

            // Redirect to iframe directly (no new window)
            window.location.href = response.data.iframe;
            return;
          }

          // Handle different response types
          if (response.data?.session_url || response.data?.redirectUrl) {
            // Save enrollment data to localStorage
            localStorage.setItem(
              'pendingEnrollment',
              JSON.stringify({
                courseId: enrollmentData.courseId,
                startDate: enrollmentData.startDate,
                courseTitle: enrollmentData.courseTitle || 'Course',
                price: response.data.total_amount || response.data.amount || 0,
                currency:
                  response.data.currency ||
                  (provider === 'stripe' ? 'USD' : 'EGP'),
                date: new Date().toISOString(),
                provider: provider,
                sessionId: response.data.sessionId,
                status: 'pending', // Mark as pending until payment completion
                // Store user auth token for restoration after payment redirect
                userToken:
                  localStorage.getItem('auth-token') ||
                  sessionStorage.getItem('auth-token')
              })
            );

            // Handle Stripe session_url or general redirectUrl
            const redirectUrl =
              response.data.session_url || response.data.redirectUrl;

            customToast.success(
              '💳 Redirecting to Payment',
              provider === 'stripe'
                ? `Amount: ${response.data.total_amount || response.data.amount || 0} USD`
                : `Amount: ${response.data.total_amount || response.data.amount || 0} EGP`,
              3000
            );

            // Redirect to payment gateway
            window.location.href = redirectUrl;
          } else if (response.data?.sessionId) {
            // Handle Stripe session or similar
            localStorage.setItem(
              'pendingEnrollment',
              JSON.stringify({
                courseId: enrollmentData.courseId,
                startDate: enrollmentData.startDate,
                courseTitle: enrollmentData.courseTitle || 'Course',
                price: response.data.amount || 0,
                currency: response.data.currency || 'USD',
                date: new Date().toISOString(),
                sessionId: response.data.sessionId,
                provider: provider,
                status: 'pending', // Mark as pending until payment completion
                // Store user auth token for restoration after payment redirect
                userToken:
                  localStorage.getItem('auth-token') ||
                  sessionStorage.getItem('auth-token')
              })
            );

            // Redirect to Stripe checkout
            window.location.href =
              response.data.redirectUrl ||
              `/payment/stripe/${response.data.sessionId}`;
          } else {
            // Default error - we should never redirect to success without payment
            customToast.error(
              '⚠️ Payment Required',
              'Please complete payment first',
              3000
            );
          }
        } else {
          throw new EnrollmentAPIError(
            response.message || 'Enrollment failed with unknown error',
            response.code,
            'SERVER_ERROR'
          );
        }
      } catch (error) {
        if (error instanceof EnrollmentAPIError) {
          handleEnrollmentError(error);
        } else {
          handleEnrollmentError(
            new EnrollmentAPIError(
              error instanceof Error
                ? error.message
                : 'An unexpected error occurred',
              0,
              'SERVER_ERROR'
            )
          );
        }
      }
    },
    [checkAuthentication, customToast, handleEnrollmentError]
  );

  // Retry enrollment with same data
  const retryEnrollment = useCallback(() => {
    if (state.enrollmentData && state.selectedProvider) {
      enrollInCourse(state.enrollmentData, state.selectedProvider);
    }
  }, [state.enrollmentData, state.selectedProvider, enrollInCourse]);

  return {
    // State
    ...state,
    isAuthenticated,

    // Actions
    enrollInCourse,
    retryEnrollment,
    resetState,
    checkAuthentication
  };
};
