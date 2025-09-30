'use client';

import { MotionDiv } from '@/components/ui/motion';
import Card from '../Card';
import '@/components/ui/skeleton-loader.css';

export default function PaymentRecordCardSkeleton() {
    return (
        <Card>
            {/* Title placeholder */}
            <MotionDiv
                className="h-8 w-48 bg-gray-200 rounded-md mb-6"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            />

            <div className="flex flex-col gap-4">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="w-full space-y-6">
                        <div className="items-center justify-between space-y-3 space-x-3 sm:flex">
                            <div className="flex items-center gap-3 sm:w-[250px]">
                                {/* Icon placeholder */}
                                <MotionDiv
                                    className="h-6 w-6 rounded-md bg-gray-200"
                                    animate={{ opacity: [0.6, 0.8, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index }}
                                />
                                {/* Title placeholder */}
                                <MotionDiv
                                    className="h-6 w-36 rounded-md bg-gray-200"
                                    animate={{ opacity: [0.6, 0.8, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.1 }}
                                />
                            </div>
                            {/* Payment method placeholder */}
                            <MotionDiv
                                className="h-4 w-16 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.2 }}
                            />
                            {/* Amount placeholder */}
                            <MotionDiv
                                className="h-4 w-24 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.3 }}
                            />
                            {/* Date placeholder */}
                            <MotionDiv
                                className="h-4 w-40 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.4 }}
                            />
                            {/* Icon placeholder */}
                            <MotionDiv
                                className="h-6 w-6 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.5 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
