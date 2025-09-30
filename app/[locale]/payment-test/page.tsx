"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const PaymentTest = () => {
    const router = useRouter();
    const locale = useLocale();
    const [responseData, setResponseData] = useState({
        status: "success",
        code: 200,
        message: "Payment confirmed! Your booking has been successfully completed.",
        data: {
            transactionId: 332385463,
            bookingStatus: "Confirmed",
            paymentStatus: "Partial",
            redirectUrl: "https://raiseup-front.vercel.app/en/payments"
        }
    });

    const handleTestRedirect = () => {
        // Store enrollment data (simulated)
        localStorage.setItem('pendingEnrollment', JSON.stringify({
            courseId: "test-course-123",
            courseTitle: "Test Course - React Development",
            price: 299,
            currency: "USD",
            startDate: "2025-01-15",
            date: new Date().toISOString(),
            provider: "paymob"
        }));

        // Store payment response
        sessionStorage.setItem('paymentResponse', JSON.stringify(responseData));

        // Redirect to payment result page
        const params = new URLSearchParams();
        params.set('status', responseData.status);
        params.set('code', responseData.code.toString());
        params.set('message', responseData.message);
        params.set('transactionId', responseData.data.transactionId.toString());
        params.set('bookingStatus', responseData.data.bookingStatus);
        params.set('paymentStatus', responseData.data.paymentStatus);

        router.push(`/${locale}/payment-result?${params.toString()}`);
    };

    const handleDirectJSCall = () => {
        if (typeof window !== 'undefined' && (window as any).handlePaymentResponse) {
            (window as any).handlePaymentResponse(responseData);
        } else {
            alert('Payment handler not loaded. Make sure to include the payment-handler.js script.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-[#0F43B4] mb-6">
                        Payment Response Test Page
                    </h1>

                    <p className="text-gray-600 mb-8">
                        This page allows you to test the payment response handling system.
                        Use the buttons below to simulate different scenarios.
                    </p>

                    {/* Response Data Display */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Current Response Data:</h2>
                        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto text-sm">
                            {JSON.stringify(responseData, null, 2)}
                        </pre>
                    </div>

                    {/* Edit Response Data */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Edit Response Data:</h2>
                        <textarea
                            className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                            value={JSON.stringify(responseData, null, 2)}
                            placeholder="Edit payment response JSON..."
                            aria-label="Payment response data"
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    setResponseData(parsed);
                                } catch {
                                    // Invalid JSON, ignore
                                }
                            }}
                        />
                    </div>

                    {/* Test Buttons */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Test Scenarios:</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <button
                                onClick={handleTestRedirect}
                                className="bg-[#0F43B4] text-white px-6 py-3 rounded-lg hover:bg-[#1a5bc4] transition-colors"
                            >
                                🔄 Test URL Parameter Redirect
                            </button>

                            <button
                                onClick={handleDirectJSCall}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                📞 Test Direct JavaScript Call
                            </button>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                            <ul className="text-blue-700 space-y-1 text-sm">
                                <li>• <strong>URL Parameter Redirect:</strong> Simulates redirecting from a payment provider with URL parameters</li>
                                <li>• <strong>Direct JavaScript Call:</strong> Simulates calling the payment handler function directly</li>
                                <li>• Both methods should show the same result on the payment-result page</li>
                                <li>• Edit the response data above to test different payment scenarios</li>
                            </ul>
                        </div>

                        {/* Quick Test Scenarios */}
                        <div className="mt-6">
                            <h3 className="font-semibold mb-3">Quick Test Scenarios:</h3>
                            <div className="grid gap-2 md:grid-cols-3">
                                <button
                                    onClick={() => setResponseData({
                                        status: "success",
                                        code: 200,
                                        message: "Payment successful!",
                                        data: {
                                            transactionId: 123456,
                                            bookingStatus: "Confirmed",
                                            paymentStatus: "Completed",
                                            redirectUrl: ""
                                        }
                                    })}
                                    className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
                                >
                                    ✅ Success
                                </button>

                                <button
                                    onClick={() => setResponseData({
                                        status: "pending",
                                        code: 102,
                                        message: "Payment is being processed.",
                                        data: {
                                            transactionId: 789012,
                                            bookingStatus: "Pending",
                                            paymentStatus: "Pending",
                                            redirectUrl: ""
                                        }
                                    })}
                                    className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600"
                                >
                                    ⏳ Pending
                                </button>

                                <button
                                    onClick={() => setResponseData({
                                        status: "failed",
                                        code: 400,
                                        message: "Payment failed or was cancelled.",
                                        data: {
                                            transactionId: 345678,
                                            bookingStatus: "Failed",
                                            paymentStatus: "Failed",
                                            redirectUrl: ""
                                        }
                                    })}
                                    className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                                >
                                    ❌ Failed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Include the payment handler script for testing */}
            <script src="/js/payment-handler.js" async></script>
        </div>
    );
};

export default PaymentTest;
