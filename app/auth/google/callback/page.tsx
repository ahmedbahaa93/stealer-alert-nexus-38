"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCustomToast } from '@/components/ui/CustomToastProvider';

// Disable static generation for this dynamic page
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1/auth';

interface BackendAuthResponse {
    status: string;
    code: number;
    message: string;
    data: {
        user: {
            _id: string;
            first_name: string;
            last_name: string;
            email: string;
            avatar: string;
            gender: string;
            phone_number: string;
            date_of_birth: string;
            current_job_title: string;
            company_organization_name: string;
            industry_field_of_work: string;
            years_of_experience: number;
            highest_education_level: string;
            field_of_study: string;
            graduation_year: number;
            university_institution_name: string;
            location: {
                country: string;
                city: string;
                address: string;
            };
            role: string;
        };
    };
    access_token: string;
}

export default function GoogleCallbackPage() {
    const { data: session, status } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const customToast = useCustomToast();

    // Send Google user data to backend for authentication
    const authenticateWithBackend = async (sessionData: any): Promise<BackendAuthResponse> => {
        // Extract Google data from the session
        const googleData = sessionData.googleData || sessionData.user;

        const requestBody = {
            googleId: googleData?.googleId || sessionData.user?.id || '',
            first_name: googleData?.first_name || sessionData.user?.name?.split(' ')[0] || '',
            last_name: googleData?.last_name || sessionData.user?.name?.split(' ').slice(1).join(' ') || '',
            email: googleData?.email || sessionData.user?.email || '',
        };


        // Validate required fields
        if (!requestBody.googleId || !requestBody.email) {
            throw new Error('Missing required Google authentication data (googleId or email)');
        }

        const response = await fetch(`${BASE_URL}/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
            }
            throw new Error(errorData.message || `Backend authentication failed: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        return data;
    };

    useEffect(() => {
        const processAuthentication = async () => {
            if (status === 'loading' || isProcessing) return;

            if (status === 'authenticated' && session?.user) {
                setIsProcessing(true);

                try {
                    // Show processing toast
                    customToast.showToast({
                        type: 'loading',
                        title: '🔄 Completing Authentication',
                        description: 'Finalizing your login...',
                        duration: 10000
                    });

                    // Authenticate with backend using session data
                    const backendResponse = await authenticateWithBackend(session);

                    // Validate response structure
                    if (!backendResponse.data?.user || !backendResponse.access_token) {
                        throw new Error('Invalid authentication response: Missing user data or token');
                    }

                    // Store authentication data in auth store
                    login(backendResponse.data.user, backendResponse.access_token, undefined, false);

                    // Show success toast
                    customToast.success(
                        '🎉 Welcome to RaiseUp!',
                        `Welcome ${backendResponse.data.user.first_name}! You're now logged in.`,
                        5000
                    );

                    // Redirect to home page
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);

                } catch (error: any) {
                    console.error('❌ Backend authentication failed:', error);

                    customToast.error(
                        '❌ Authentication Failed',
                        error.message || 'Unable to complete authentication. Please try again.',
                        6000
                    );

                    // Redirect to login page on error
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                }
            } else if (status === 'unauthenticated') {
                customToast.error(
                    '❌ Authentication Failed',
                    'Google authentication was not successful. Please try again.',
                    6000
                );

                // Redirect to login page
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        };

        processAuthentication();
    }, [session, status, isProcessing, login, router, customToast]);

    return (
        <div className="min-h-screen bg-[#f2f7fa] flex items-center justify-center">
            <div className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 text-center shadow-lg">
                <div className="mb-6">
                    <div className="w-16 h-16 border-4 border-[#4285f4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Completing Authentication
                    </h1>
                    <p className="text-gray-600">
                        Please wait while we finalize your Google login...
                    </p>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                    <p>✓ Google authentication {status === 'authenticated' ? 'successful' : 'in progress'}</p>
                    <p>⏳ Connecting to RaiseUp servers...</p>
                    <p>🔄 Setting up your account...</p>
                </div>
            </div>
        </div>
    );
}
