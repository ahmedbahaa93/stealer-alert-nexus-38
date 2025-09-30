"use client";

import { MotionDiv, MotionH2, MotionP } from "@/components/ui/motion";
import { useTranslations } from "next-intl";

interface NewTestimonialErrorProps {
    error?: Error;
    onRetry: () => void;
}

const NewTestimonialError = ({ error, onRetry }: NewTestimonialErrorProps) => {
    const t = useTranslations('HomePage');

    return (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <MotionDiv
                    className="text-center max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <MotionDiv
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-6 flex justify-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                    </MotionDiv>

                    <MotionH2
                        className="text-3xl font-bold mb-4 text-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {t('testimonials.errorTitle') || 'Unable to Load Testimonials'}
                    </MotionH2>

                    <MotionP
                        className="text-lg text-gray-600 mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {t('testimonials.errorMessage') || 'There was a problem loading the testimonials.'}
                    </MotionP>

                    {error && (
                        <MotionP
                            className="text-sm text-red-500 mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45, duration: 0.5 }}
                        >
                            {error.message}
                        </MotionP>
                    )}

                    <MotionDiv
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <button
                            onClick={onRetry}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center mx-auto"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            {t('testimonials.retry') || 'Try Again'}
                        </button>
                    </MotionDiv>
                </MotionDiv>
            </div>

            {/* Background decoration */}
            <MotionDiv
                className="absolute top-10 left-10 w-64 h-64 rounded-full bg-red-50 opacity-20 -z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ delay: 0.2, duration: 1 }}
            />

            <MotionDiv
                className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-red-50 opacity-20 -z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ delay: 0.3, duration: 1 }}
            />
        </section>
    );
};

export default NewTestimonialError;
