"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NoToastProvider } from "@/components/ui/NoToastProvider";

interface EnrollmentData {
    courseId: string;
    courseTitle: string;
    price: number;
    currency: string;
    startDate: string;
    date: string;
    provider: string;
    sessionId?: string;
}

interface PaymentResponse {
    status: string;
    code: number;
    message: string;
    data: {
        transactionId: number | null;
        bookingStatus: string;
        paymentStatus: string;
        amount?: number;
        currency?: string;
        order?: string;
        integration_id?: string;
        hmac?: string;
        redirectUrl?: string;
    };
}

const Success = () => {
    return (
        <NoToastProvider>
            <SuccessContent />
        </NoToastProvider>
    );
};

const SuccessContent = () => {
    const t = useTranslations("SuccessPage");
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null);
    const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);

    // Check if we have payment confirmation in URL params
    const paymentId = searchParams.get('payment_id');
    const transactionId = searchParams.get('transaction_id');
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success') === 'true';
    const provider = searchParams.get('provider');
    const paymentDataParam = searchParams.get('payment_data');

    useEffect(() => {
        // Load toast disabler script
        const script = document.createElement('script');
        script.src = '/js/disable-toasts.js';
        script.async = true;
        document.head.appendChild(script);

        // Get enrollment data from localStorage
        const storedData = localStorage.getItem('pendingEnrollment');

        // Parse payment response from URL if available
        if (paymentDataParam) {
            try {
                const decodedPaymentData = JSON.parse(decodeURIComponent(paymentDataParam));
                setPaymentResponse(decodedPaymentData);

                // NO TOAST MESSAGES - Just process the data silently
            } catch (error) {
                console.error('Error parsing payment data:', error);
            }
        }

        // Check if payment was successful based on URL parameters
        const isPaymentSuccessful = success || paymentId || sessionId || transactionId || paymentDataParam;

        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setEnrollmentData(parsedData);

                // Clear after successful payment confirmation
                if (isPaymentSuccessful) {
                    localStorage.removeItem('pendingEnrollment');
                }
            } catch (error) {
                console.error('Error parsing enrollment data:', error);
            }
        }

        // If no payment confirmation or no enrollment data, redirect to homepage
        if (!isPaymentSuccessful || !storedData) {
            // Silent redirect - NO TOAST MESSAGES
            setTimeout(() => {
                router.push(`/${locale}`);
            }, 1000);
        }

        // Cleanup script on unmount
        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [paymentId, sessionId, transactionId, success, provider, paymentDataParam, locale, router]);

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
                <div className="relative max-w-2xl flex flex-col items-center ">

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
                                <h1 className="text-xl sm:text-3xl md:text-6xl font-bold text-[#6BBE66]">
                                    {t("title")}
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
                            <h2 className="text-base sm:text-xl md:text-5xl text-[#6BBE66] mb-2">
                                {t("subtitle")}
                            </h2>
                            <p className="text-xs sm:text-base md:text-lg text-[#6BBE66] mb-3">
                                {enrollmentData?.courseTitle
                                    ? t.rich("dynamicCourseMessage", { courseName: enrollmentData.courseTitle })
                                    : t("courseMessage")}
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

                        {/* Course information */}
                        <div className="bg-[#0F43B4]/5 rounded-lg p-4 md:p-6 my-4 md:my-6 space-y-3 max-w-lg mx-auto">
                            <h3 className="font-semibold text-[#0F43B4] text-lg md:text-xl">
                                {enrollmentData?.courseTitle || "Course Enrollment Confirmed"}
                            </h3>
                            <div className="flex justify-between text-sm md:text-base">
                                <span className="text-gray-600">Start Date:</span>
                                <span className="font-medium text-gray-800">
                                    {enrollmentData?.startDate
                                        ? new Date(enrollmentData.startDate).toLocaleDateString(
                                            locale === 'ar' ? 'ar-EG' : 'en-US',
                                            { year: 'numeric', month: 'long', day: 'numeric' }
                                        )
                                        : "As scheduled"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm md:text-base">
                                <span className="text-gray-600">Payment:</span>
                                <span className="font-medium text-gray-800">
                                    {paymentResponse?.data?.amount && paymentResponse?.data?.currency
                                        ? `${paymentResponse.data.amount} ${paymentResponse.data.currency}`
                                        : enrollmentData
                                            ? `${enrollmentData.price} ${enrollmentData.currency}`
                                            : "Payment processed"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm md:text-base">
                                <span className="text-gray-600">Confirmation #:</span>
                                <span className="font-medium text-gray-800">
                                    {paymentResponse?.data?.transactionId || paymentId || sessionId || transactionId || "Payment confirmed"}
                                </span>
                            </div>
                            {paymentResponse?.data?.bookingStatus && (
                                <div className="flex justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Booking Status:</span>
                                    <span className={`font-medium ${paymentResponse.data.bookingStatus === 'Confirmed'
                                        ? 'text-green-600'
                                        : paymentResponse.data.bookingStatus === 'Pending'
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                        }`}>
                                        {paymentResponse.data.bookingStatus}
                                    </span>
                                </div>
                            )}
                            {paymentResponse?.data?.paymentStatus && (
                                <div className="flex justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={`font-medium ${paymentResponse.data.paymentStatus === 'Completed' || paymentResponse.data.paymentStatus === 'Partial'
                                        ? 'text-green-600'
                                        : paymentResponse.data.paymentStatus === 'Pending'
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                        }`}>
                                        {paymentResponse.data.paymentStatus}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Payment Response Details (if available) */}
                        {paymentResponse && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6 my-4 md:my-6 max-w-lg mx-auto">
                                <h3 className="font-semibold text-green-800 text-lg md:text-xl mb-3 flex items-center gap-2">
                                    ✅ Payment Confirmation
                                </h3>
                                <div className="space-y-2 text-sm md:text-base">
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Status:</span>
                                        <span className="font-medium text-green-800">{paymentResponse.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Code:</span>
                                        <span className="font-medium text-green-800">{paymentResponse.code}</span>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-md mt-3">
                                        <p className="text-green-800 text-sm">
                                            💬 {paymentResponse.message}
                                        </p>
                                    </div>
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Removed help button */}
        </div>
    );
};

export default Success;
