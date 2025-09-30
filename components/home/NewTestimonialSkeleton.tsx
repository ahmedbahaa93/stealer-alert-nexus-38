"use client";

import { MotionDiv } from "@/components/ui/motion";

const NewTestimonialSkeleton = () => {
    return (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>

                <MotionDiv
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Generate 3 skeleton cards */}
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm p-6 relative animate-pulse"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>

                            {/* Skeleton text lines */}
                            <div className="space-y-3">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            </div>

                            {/* Skeleton rating */}
                            <div className="flex mt-4 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-5 h-5 rounded-full bg-gray-200"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </MotionDiv>

                {/* Skeleton navigation dots */}
                <div className="flex justify-center mt-10 space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gray-100 opacity-30 -z-10"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gray-100 opacity-30 -z-10"></div>
        </section>
    );
};

export default NewTestimonialSkeleton;
