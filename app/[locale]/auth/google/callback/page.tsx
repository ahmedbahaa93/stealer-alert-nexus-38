"use client";

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomToast } from '@/components/ui/CustomToastProvider';

/**
 * Google OAuth Callback Page
 * Handles the OAuth response from Google and communicates with the parent window
 */
const GoogleOAuthCallback = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const customToast = useCustomToast();
    const hasProcessed = useRef(false);

    useEffect(() => {
        // Prevent double processing
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const processOAuthCallback = async () => {
            try {
                // Check if we're in an iframe that contains JSON response directly
                const checkForDirectJSONResponse = () => {
                    try {
                        const bodyText = document.body.textContent || document.body.innerText || '';
                        if (bodyText.trim().startsWith('{"status"') && bodyText.includes('access_token')) {
                            const authData = JSON.parse(bodyText.trim());
                            return authData;
                        }
                    } catch {
                        // Not JSON, continue with normal flow
                    }
                    return null;
                };

                // Check for direct JSON response first
                const directAuthData = checkForDirectJSONResponse();
                if (directAuthData) {
                    // Validate response structure
                    if (!directAuthData.data?.user || !directAuthData.access_token) {
                        throw new Error('Invalid authentication response from server');
                    }

                    // Send success data to parent window
                    if (window.opener || window.parent !== window) {
                        const targetWindow = window.opener || window.parent;
                        targetWindow.postMessage({
                            type: 'GOOGLE_AUTH_SUCCESS',
                            payload: directAuthData
                        }, window.location.origin);

                        // Close the popup/iframe after a short delay to ensure message is received
                        setTimeout(() => {
                            if (window.opener) {
                                window.close();
                            } else {
                                // For iframe, signal parent to handle closure
                                window.parent.postMessage({
                                    type: 'GOOGLE_AUTH_CLOSE'
                                }, window.location.origin);
                            }
                        }, 500);
                        return;
                    }

                    // If no parent window, handle authentication directly
                    console.warn('No parent window detected, redirecting to home...');
                    router.push('/');
                    return;
                }

                // Get URL parameters for traditional OAuth flow
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                // Handle OAuth errors
                if (error) {
                    const errorMessage = errorDescription || error;
                    console.error('Google OAuth Error:', errorMessage);

                    // Send error to parent window
                    if (window.opener || window.parent !== window) {
                        const targetWindow = window.opener || window.parent;
                        targetWindow.postMessage({
                            type: 'GOOGLE_AUTH_ERROR',
                            error: errorMessage
                        }, window.location.origin);

                        if (window.opener) {
                            window.close();
                        }
                        return;
                    }

                    // If no parent window, redirect to login with error
                    customToast.error(
                        '❌ Authentication Failed',
                        errorMessage || 'Google authentication failed. Please try again.',
                        6000
                    );
                    router.push('/login');
                    return;
                }

                // Handle successful OAuth with authorization code
                if (code) {
                    // Exchange code for tokens via backend
                    const response = await fetch('https://booking-courses-gilt.vercel.app/api/v1/google/callback', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            code,
                            state,
                            redirectUri: window.location.origin + '/auth/google/callback'
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                    }

                    const authData = await response.json();

                    // Validate response structure
                    if (!authData.data?.user || !authData.access_token) {
                        throw new Error('Invalid authentication response from server');
                    }

                    // Send success data to parent window
                    if (window.opener || window.parent !== window) {
                        const targetWindow = window.opener || window.parent;
                        targetWindow.postMessage({
                            type: 'GOOGLE_AUTH_SUCCESS',
                            payload: authData
                        }, window.location.origin);

                        // Close the popup after a short delay to ensure message is received
                        setTimeout(() => {
                            if (window.opener) {
                                window.close();
                            }
                        }, 500);
                        return;
                    }

                    // If no parent window (direct navigation), handle authentication directly
                    console.warn('No parent window detected, redirecting to home...');
                    router.push('/');
                } else {
                    // No code or error - check if we're waiting for a redirect
                    console.log('No OAuth parameters found, waiting for backend redirect...');

                    // Set a timeout to check for JSON response after page loads
                    setTimeout(() => {
                        const delayedAuthData = checkForDirectJSONResponse();
                        if (delayedAuthData) {
                            // Process the delayed response
                            if (window.opener || window.parent !== window) {
                                const targetWindow = window.opener || window.parent;
                                targetWindow.postMessage({
                                    type: 'GOOGLE_AUTH_SUCCESS',
                                    payload: delayedAuthData
                                }, window.location.origin);

                                setTimeout(() => {
                                    if (window.opener) {
                                        window.close();
                                    }
                                }, 500);
                            }
                        }
                    }, 1000);
                }

            } catch (error: any) {
                console.error('OAuth callback processing error:', error);

                // Send error to parent window if available
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        error: error.message || 'Authentication processing failed'
                    }, window.location.origin);
                    window.close();
                    return;
                }

                // If no parent window, show error and redirect
                customToast.error(
                    '❌ Authentication Error',
                    error.message || 'Something went wrong during authentication. Please try again.',
                    6000
                );
                router.push('/login');
            }
        };

        processOAuthCallback();
    }, [searchParams, router, customToast]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4285f4] mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Completing Google Authentication...
                </h2>
                <p className="text-gray-600">
                    Please wait while we finalize your login.
                </p>
            </div>
        </div>
    );
};

export default GoogleOAuthCallback;
