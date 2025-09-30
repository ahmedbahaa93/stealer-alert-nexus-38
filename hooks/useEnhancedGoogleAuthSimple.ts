/**
 * Simple and Reliable Google Authentication Hook using NextAuth
 * Uses a callback page approach to handle the authentication flow
 */

'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useCustomToast } from '@/components/ui/CustomToastProvider';

export const useEnhancedGoogleAuthSimple = () => {
  const [isLoading, setIsLoading] = useState(false);
  const customToast = useCustomToast();

  // Handle Google authentication with NextAuth
  const handleGoogleAuth = useCallback(async () => {
    setIsLoading(true);

    try {
      console.log('🚀 Initiating Google authentication with NextAuth...');

      // Show loading toast
      customToast.showToast({
        type: 'loading',
        title: '🔄 Connecting to Google',
        description: 'Please complete the authentication...',
        duration: 15000
      });

      // Sign in with NextAuth Google provider, redirect to callback page
      const result = await signIn('google', {
        callbackUrl: '/auth/google/callback',
        redirect: true // Let NextAuth handle the redirect
      });

      // If we reach here and there's an error, handle it
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('❌ Google Auth Error:', error);

      // Handle different error types
      const errorMessage = error?.message || 'Unknown error occurred';

      if (
        errorMessage.includes('cancelled') ||
        errorMessage.includes('denied')
      ) {
        customToast.showToast({
          type: 'warning',
          title: '⚠️ Authentication Cancelled',
          description: 'Google login was cancelled. You can try again anytime.',
          duration: 4000
        });
      } else if (errorMessage.includes('popup')) {
        customToast.error(
          '🚫 Popup Blocked',
          'Please allow popups for this site and try again.',
          6000
        );
      } else if (
        errorMessage.includes('network') ||
        errorMessage.includes('fetch')
      ) {
        customToast.error(
          '🌐 Connection Error',
          'Please check your internet connection and try again.',
          5000
        );
      } else {
        customToast.error(
          '❌ Authentication Error',
          errorMessage ||
            'Something went wrong during Google login. Please try again.',
          6000
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [customToast]);

  return {
    handleGoogleAuth,
    isLoading
  };
};
