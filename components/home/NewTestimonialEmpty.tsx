"use client";

import { MotionDiv, MotionH2, MotionP } from "@/components/ui/motion";
import { useTranslations } from "next-intl";

const NewTestimonialEmpty = () => {
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
                    >
                        <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                    </MotionDiv>

                    <MotionH2
                        className="text-3xl font-bold mb-4 text-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {t('testimonials.noTestimonialsYet') || 'No testimonials yet'}
                    </MotionH2>

                    <MotionP
                        className="text-lg text-gray-600 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {t('testimonials.emptyMessage') || 'Be the first to share your experience with us!'}
                    </MotionP>

                    <MotionDiv
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
                            {t('testimonials.leaveReview') || 'Leave a Review'}
                        </button>
                    </MotionDiv>
                </MotionDiv>
            </div>

            {/* Background decoration */}
            <MotionDiv
                className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-100 opacity-20 -z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ delay: 0.2, duration: 1 }}
            />

            <MotionDiv
                className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-purple-100 opacity-20 -z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ delay: 0.3, duration: 1 }}
            />
        </section>
    );
};

export default NewTestimonialEmpty;
