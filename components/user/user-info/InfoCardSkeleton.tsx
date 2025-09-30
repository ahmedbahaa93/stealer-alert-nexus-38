'use client';

import { MotionDiv } from '@/components/ui/motion';
import Card from '../Card';
import '@/components/ui/skeleton-loader.css';

export default function InfoCardSkeleton() {
    return (
        <Card>
            {/* Title placeholder */}
            <MotionDiv
                className="h-8 w-60 bg-gray-200 rounded-md mb-6"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            />

            <div className="items-center justify-between lg:flex">
                <div className="space-y-5 lg:w-[50%] lg:space-y-11">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="flex gap-3 items-center">
                            {/* Icon placeholder */}
                            <MotionDiv
                                className="h-6 w-6 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index }}
                            />
                            {/* Label placeholder */}
                            <MotionDiv
                                className="h-6 w-24 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.1 }}
                            />
                            {/* Value placeholder */}
                            <MotionDiv
                                className="h-6 w-32 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.2 }}
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-5 max-lg:mt-5 lg:w-[50%] lg:space-y-11">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="flex gap-3 items-center">
                            {/* Icon placeholder */}
                            <MotionDiv
                                className="h-6 w-6 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.3 }}
                            />
                            {/* Label placeholder */}
                            <MotionDiv
                                className="h-6 w-24 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.4 }}
                            />
                            {/* Value placeholder */}
                            <MotionDiv
                                className="h-6 w-32 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.5 }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
