"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomToast } from '@/components/ui/CustomToastProvider';

const PaymentSuccessRedirect = () => {
    const router = useRouter();
    const customToast = useCustomToast();

    useEffect(() => {
        // Get locale from URL
        const locale = window.location.pathname.split('/')[1] || 'en';

        // Show success message
        customToast.success(
            '🎉 Payment Successful!',
            'Redirecting you to payment details...',
            3000
        );

        // Redirect to payment-result page after a brief delay
        setTimeout(() => {
            const newUrl = `/${locale}/payment-result${window.location.search}`;
            router.push(newUrl);
        }, 2000);
    }, [router, customToast]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-green-700 mt-4">Payment Successful!</h2>
                <p className="text-gray-500 mt-2">Redirecting you to payment details...</p>
            </div>
        </div>
    );
};

export default PaymentSuccessRedirect;
