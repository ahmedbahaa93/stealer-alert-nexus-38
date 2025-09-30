"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { NoToastProvider } from "@/components/ui/NoToastProvider";

interface PaymentResponse {
    status: string;
    code: number;
    message: string;
    data: {
        transactionId: number;
        bookingStatus: string;
        paymentStatus: string;
        redirectUrl: string;
        provider?: string;
        sessionId?: string;
        paymentIntent?: string;
    };
}

interface EnrollmentData {
    courseId: string;
    courseTitle: string;
    price: number;
    currency: string;
    startDate: string;
    date: string;
    provider: string;
    sessionId?: string;
    status?: string;
}

const PaymentResult = () => {
    return (
        <NoToastProvider>
            <PaymentResultContent />
        </NoToastProvider>
    );
};

const PaymentResultContent = () => {
    const t = useTranslations("SuccessPage");
    const locale = useLocale();
    const router = useRouter();

    // Dummy toast that does nothing
    const dummyToast = {
        success: () => { },
        error: () => { },
        warning: () => { },
        loading: () => { }
    };

    const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
    const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasProcessedRef = useRef(false);

    // Function to handle payment response from external sources
    const handlePaymentResponse = useCallback((response: PaymentResponse) => {
        setPaymentResponse(response);

        // Store in sessionStorage for persistence
        sessionStorage.setItem('paymentResponse', JSON.stringify(response));

        // NO TOAST MESSAGES - Just process the data silently
        setIsLoading(false);
    }, []);

    const processPaymentData = useCallback(() => {
        // Prevent multiple executions
        if (hasProcessedRef.current) return;
        hasProcessedRef.current = true;

        // Get the payment response from the URL or localStorage or direct access
        const urlParams = new URLSearchParams(window.location.search);

        // Try to get payment data from multiple sources
        let paymentData: PaymentResponse | null = null;

        // First, check if there's a direct payment response in sessionStorage (from payment page)
        const sessionPaymentData = sessionStorage.getItem('paymentResponse');
        if (sessionPaymentData) {
            try {
                paymentData = JSON.parse(sessionPaymentData);
                // Don't remove immediately - keep for potential page refreshes
                // Will be cleaned up after successful processing
            } catch (error) {
                console.error('Error parsing session payment data:', error);
            }
        }

        // Second, check if there's encoded payment data in URL
        if (!paymentData) {
            const encodedPaymentData = urlParams.get('payment_data');
            if (encodedPaymentData) {
                try {
                    paymentData = JSON.parse(decodeURIComponent(encodedPaymentData));
                } catch (error) {
                    console.error('Error parsing URL payment data:', error);
                }
            }
        }

        // If no structured data, try to extract from URL parameters
        if (!paymentData) {
            const status = urlParams.get('status') || 'unknown';
            const code = urlParams.get('code') || '0';
            const message = urlParams.get('message') || 'Payment processed';
            const transactionId = urlParams.get('transactionId') || urlParams.get('transaction_id') ||
                urlParams.get('session_id') || '0';
            const bookingStatus = urlParams.get('bookingStatus') || urlParams.get('booking_status') || 'Unknown';
            const paymentStatus = urlParams.get('paymentStatus') || urlParams.get('payment_status') || 'Unknown';
            const redirectUrl = urlParams.get('redirectUrl') || urlParams.get('redirect_url') || '';
            const provider = urlParams.get('provider') || 'unknown';
            const success = urlParams.get('success');

            // Check if we have enough data to construct a payment response
            // More lenient check - if any payment-related parameter exists, process it
            if (status !== 'unknown' || transactionId !== '0' || success !== null || provider !== 'unknown' ||
                urlParams.has('payment_data') || urlParams.has('session_id') ||
                urlParams.has('transaction_id') || urlParams.has('code')) {
                paymentData = {
                    status: success === 'true' ? 'success' : success === 'false' ? 'failed' : status,
                    code: parseInt(code),
                    message: success === 'true' ? 'Payment successful!' :
                        success === 'false' ? 'Payment failed.' : message,
                    data: {
                        transactionId: parseInt(transactionId) || Math.floor(Math.random() * 1000000),
                        bookingStatus: success === 'true' ? 'Confirmed' :
                            success === 'false' ? 'Failed' : bookingStatus,
                        paymentStatus: success === 'true' ? 'Completed' :
                            success === 'false' ? 'Failed' : paymentStatus,
                        redirectUrl,
                        provider
                    }
                };
            }
        }

        // Get enrollment data from localStorage
        const storedEnrollmentData = localStorage.getItem('pendingEnrollment');
        if (storedEnrollmentData) {
            try {
                const parsedEnrollmentData = JSON.parse(storedEnrollmentData);
                setEnrollmentData(parsedEnrollmentData);

                // Restore user authentication token if available
                if (parsedEnrollmentData.userToken && !localStorage.getItem('auth-token') && !sessionStorage.getItem('auth-token')) {
                    // Try to restore the auth token
                    localStorage.setItem('auth-token', parsedEnrollmentData.userToken);
                    console.log('Restored user authentication after payment redirect');
                }

                // Clear enrollment data if payment was successful
                if (paymentData && paymentData.status === 'success') {
                    localStorage.removeItem('pendingEnrollment');
                }
            } catch (error) {
                console.error('Error parsing enrollment data:', error);
            }
        }

        if (paymentData) {
            handlePaymentResponse(paymentData);

            // Clean up session storage after successful processing (with delay for page stability)
            setTimeout(() => {
                sessionStorage.removeItem('paymentResponse');
            }, 2000);
        } else {
            // No payment data found - silently redirect to homepage (NO TOAST)
            setTimeout(() => {
                router.push(`/${locale}`);
            }, 1000);
        }
    }, [handlePaymentResponse, router, locale]);

    useEffect(() => {
        processPaymentData();

        // Load toast disabler script
        const script = document.createElement('script');
        script.src = '/js/disable-toasts.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [processPaymentData]);    // Function to handle payment response from external sources
    const handleExternalPaymentResponse = useCallback((response: PaymentResponse) => {
        handlePaymentResponse(response);
    }, [handlePaymentResponse]);

    // Expose function to window for external access
    useEffect(() => {
        (window as any).handlePaymentResponse = handleExternalPaymentResponse;

        // Cleanup session storage when component unmounts (user navigates away)
        return () => {
            delete (window as any).handlePaymentResponse;
            // Clean up session storage when leaving the page
            sessionStorage.removeItem('paymentResponse');
        };
    }, [handleExternalPaymentResponse]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0F43B4] mx-auto"></div>
                    <h2 className="text-xl font-semibold text-gray-700 mt-4">Processing Payment Result...</h2>
                    <p className="text-gray-500 mt-2">Please wait while we confirm your payment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Top right wave pattern */}
            <div className="absolute top-2 right-0 w-60 h-52 md:w-[530px] md:h-[430px] opacity-70">
                <Image
                    src="/images/success/Topology-1.svg"
                    alt="vector pattern"
                    className="w-full h-full object-contain"
                    width={530}
                    height={430}
                />
            </div>

            {/* Bottom left wave pattern */}
            <div className="absolute -bottom-9 left-4 w-40 h-40 md:w-64 md:h-64 opacity-70">
                <Image
                    src="/images/success/Topology-1.svg"
                    alt="vector pattern"
                    className="w-full h-full object-contain"
                    width={64}
                    height={64}
                />
            </div>

            {/* Main content container */}
            <div className="flex items-center justify-center min-h-screen gap-4">
                <div className="relative max-w-2xl flex flex-col items-center px-4">

                    {/* Left side balloons */}
                    <div className="absolute top-40 left-0 flex flex-col gap-6 md:gap-14">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-36 md:h-36 -translate-x-6 sm:-translate-x-10 md:-translate-x-40 translate-y-2 sm:translate-y-4 md:translate-y-8">
                            <Image
                                src="/images/success/erasebg-transformed.png"
                                alt="balloon"
                                className="w-full h-full"
                                width={36}
                                height={36}
                            />
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-36 md:h-36 -translate-x-8 sm:-translate-x-12 md:-translate-x-48">
                            <Image
                                src="/images/success/erasebg-transformed.png"
                                alt="balloon"
                                className="w-full h-full"
                                width={36}
                                height={36}
                            />
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-36 md:h-36 -translate-x-10 sm:-translate-x-14 md:-translate-x-52">
                            <Image
                                src="/images/success/erasebg-transformed.png"
                                alt="balloon"
                                className="w-full h-full"
                                width={36}
                                height={36}
                            />
                        </div>
                    </div>

                    {/* Right side balloons */}
                    <div className="absolute top-40 right-0 flex flex-col gap-6 md:gap-14">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-36 md:h-36 translate-x-6 sm:translate-x-10 md:translate-x-44 translate-y-2 sm:translate-y-4 md:translate-y-8">
                            <Image
                                src="/images/success/erasebg-transformed.png"
                                alt="balloon"
                                className="w-full h-full rotate-45"
                                width={36}
                                height={36}
                            />
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-36 md:h-36 translate-x-8 sm:translate-x-12 md:translate-x-48">
                            <Image
                                src="/images/success/erasebg-transformed.png"
                                alt="balloon"
                                className="w-full h-full rotate-45"
                                width={36}
                                height={36}
                            />
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-36 md:h-36 translate-x-10 sm:translate-x-14 md:translate-x-52">
                            <Image
                                src="/images/success/erasebg-transformed.png"
                                alt="balloon"
                                className="w-full h-full rotate-45"
                                width={36}
                                height={36}
                            />
                        </div>
                    </div>

                    {/* Center balloon */}
                    <div className="relative flex flex-col items-center">
                        <div className="absolute -top-1 mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36">
                                <Image
                                    src="/images/success/erasebg-transformed.png"
                                    alt="balloon"
                                    className="w-full rotate-12"
                                    width={36}
                                    height={36}
                                />
                            </div>
                        </div>

                        {/* Header section */}
                        <div className="text-center">
                            <div className="relative flex justify-center items-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32">
                                    <Image
                                        src="/images/success/erasebg-transformed(1).png"
                                        alt="success checkmark"
                                        className="w-full"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <h1 className={`text-xl sm:text-3xl md:text-6xl font-bold ${paymentResponse?.status === 'success' ? 'text-[#6BBE66]' : paymentResponse?.status === 'failed' ? 'text-red-500' : 'text-orange-500'
                                    }`}>
                                    {paymentResponse?.status === 'success' ? t("title") : paymentResponse?.status === 'failed' ? "Payment Failed" : "Payment Processed"}
                                </h1>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32">
                                    <Image
                                        src="/images/success/erasebg-transformed(1).png"
                                        alt="success checkmark"
                                        className="w-full rotate-90"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            </div>
                            <h2 className={`text-base sm:text-xl md:text-5xl mb-2 ${paymentResponse?.status === 'success' ? 'text-[#6BBE66]' : paymentResponse?.status === 'failed' ? 'text-red-500' : 'text-orange-500'
                                }`}>
                                {paymentResponse?.status === 'success' ? t("subtitle") : paymentResponse?.status === 'failed' ? "Transaction Failed" : "Payment Update"}
                            </h2>
                            <p className={`text-xs sm:text-base md:text-lg mb-3 ${paymentResponse?.status === 'success' ? 'text-[#6BBE66]' : paymentResponse?.status === 'failed' ? 'text-red-600' : 'text-orange-600'
                                }`}>
                                {enrollmentData?.courseTitle
                                    ? `Course: ${enrollmentData.courseTitle}`
                                    : "Payment status updated"}
                            </p>
                            <div className="w-6 h-6 flex items-center justify-center mx-auto sm:w-8 sm:h-8 md:w-12 md:h-12">
                                <Image
                                    src="/images/success/Group.svg"
                                    alt="success checkmark"
                                    className="w-full h-full object-contain"
                                    width={12}
                                    height={12}
                                />
                            </div>
                        </div>

                        {/* Payment Response Details */}
                        {paymentResponse && (
                            <div className={`${paymentResponse.status === 'success'
                                ? 'bg-green-50 border-green-200'
                                : paymentResponse.status === 'failed'
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-orange-50 border-orange-200'
                                } border rounded-lg p-4 md:p-6 my-4 md:my-6 max-w-lg mx-auto w-full`}>
                                <h3 className={`font-semibold text-lg md:text-xl mb-3 flex items-center gap-2 ${paymentResponse.status === 'success' ? 'text-green-800' : paymentResponse.status === 'failed' ? 'text-red-800' : 'text-orange-800'
                                    }`}>
                                    {paymentResponse.status === 'success' ? '✅' : paymentResponse.status === 'failed' ? '❌' : '⚠️'} Payment Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className={`${paymentResponse.status === 'success' ? 'text-green-700' : paymentResponse.status === 'failed' ? 'text-red-700' : 'text-orange-700'}`}>
                                            Status:
                                        </span>
                                        <span className={`font-medium ${paymentResponse.status === 'success' ? 'text-green-800' : paymentResponse.status === 'failed' ? 'text-red-800' : 'text-orange-800'}`}>
                                            {paymentResponse.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className={`${paymentResponse.status === 'success' ? 'text-green-700' : paymentResponse.status === 'failed' ? 'text-red-700' : 'text-orange-700'}`}>
                                            Code:
                                        </span>
                                        <span className={`font-medium ${paymentResponse.status === 'success' ? 'text-green-800' : paymentResponse.status === 'failed' ? 'text-red-800' : 'text-orange-800'}`}>
                                            {paymentResponse.code}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className={`${paymentResponse.status === 'success' ? 'text-green-700' : 'text-orange-700'}`}>
                                            Transaction ID:
                                        </span>
                                        <span className={`font-medium ${paymentResponse.status === 'success' ? 'text-green-800' : 'text-orange-800'}`}>
                                            {paymentResponse.data.transactionId}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className={`${paymentResponse.status === 'success' ? 'text-green-700' : 'text-orange-700'}`}>
                                            Booking Status:
                                        </span>
                                        <span className={`font-medium ${paymentResponse.data.bookingStatus === 'Confirmed'
                                            ? 'text-green-800'
                                            : paymentResponse.data.bookingStatus === 'Pending'
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                            }`}>
                                            {paymentResponse.data.bookingStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className={`${paymentResponse.status === 'success' ? 'text-green-700' : 'text-orange-700'}`}>
                                            Payment Status:
                                        </span>
                                        <span className={`font-medium ${paymentResponse.data.paymentStatus === 'Completed' || paymentResponse.data.paymentStatus === 'Partial'
                                            ? 'text-green-800'
                                            : paymentResponse.data.paymentStatus === 'Pending'
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                            }`}>
                                            {paymentResponse.data.paymentStatus}
                                        </span>
                                    </div>
                                    <div className={`${paymentResponse.status === 'success' ? 'bg-green-100' : 'bg-orange-100'
                                        } p-3 rounded-md mt-3`}>
                                        <p className={`${paymentResponse.status === 'success' ? 'text-green-800' : 'text-orange-800'
                                            } text-sm`}>
                                            💬 {paymentResponse.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Course Information */}
                        {enrollmentData && (
                            <div className="bg-[#0F43B4]/5 rounded-lg p-4 md:p-6 my-4 md:my-6 space-y-3 max-w-lg mx-auto w-full">
                                <h3 className="font-semibold text-[#0F43B4] text-lg md:text-xl">
                                    Course Information
                                </h3>
                                <div className="flex justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Course:</span>
                                    <span className="font-medium text-gray-800">{enrollmentData.courseTitle}</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Start Date:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Date(enrollmentData.startDate).toLocaleDateString(
                                            locale === 'ar' ? 'ar-EG' : 'en-US',
                                            { year: 'numeric', month: 'long', day: 'numeric' }
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Payment:</span>
                                    <span className="font-medium text-gray-800">
                                        {enrollmentData.price} {enrollmentData.currency}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Blue mascot robot */}
                        <div className="relative mb-5">
                            <div className="w-40 h-60 sm:w-48 sm:h-72 md:w-[300px] md:h-[460px] -translate-y-2 sm:-translate-y-4 md:-translate-y-9">
                                <Image
                                    src="/images/success/ChatGPT Image Jun 12, 2025, 01_04_43 PM (1) 1.svg"
                                    alt="mascot robot"
                                    className="w-full h-full object-contain"
                                    width={300}
                                    height={460}
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pb-5 justify-around w-full items-center md:-translate-y-14">
                            <Link href={`/${locale}`} className="flex items-center gap-3 px-6 py-2 shadow-sm shadow-black sm:px-8 sm:py-3 border-2 border-[#0F43B4] text-[#0F43B4] rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium text-sm sm:text-lg min-w-[120px] sm:min-w-[140px] justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                {t("buttons.back")}
                            </Link>
                            {enrollmentData?.courseId && (
                                <Link
                                    href={`/${locale}/course-details/${enrollmentData.courseId}`}
                                    className="flex items-center gap-3 shadow-sm shadow-black px-8 py-2 sm:px-8 sm:py-3 border-2 border-[#0F43B4] text-[#0F43B4] rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium text-sm sm:text-lg min-w-[120px] sm:min-w-[140px] justify-center"
                                >
                                    {t("buttons.viewCourse")}
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </Link>
                            )}
                            <Link
                                href={`/${locale}/payments`}
                                className="flex items-center gap-3 shadow-sm shadow-black px-8 py-2 sm:px-8 sm:py-3 bg-[#0F43B4] text-white rounded-lg hover:bg-[#1a5bc4] transition-all duration-200 font-medium text-sm sm:text-lg min-w-[120px] sm:min-w-[140px] justify-center"
                            >
                                View Payments
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
