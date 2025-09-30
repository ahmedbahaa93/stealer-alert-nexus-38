'use client';

import { MotionDiv } from '@/components/ui/motion';
import Card from '../Card';
import '@/components/ui/skeleton-loader.css';

export default function CertificatesCardSkeleton() {
    return (
        <Card>
            {/* Title placeholder */}
            <MotionDiv
                className="h-8 w-48 bg-gray-200 rounded-md mb-6"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            />

            <div className="w-full space-y-8">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-[200px]">
                            {/* Icon placeholder */}
                            <MotionDiv
                                className="h-6 w-6 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index }}
                            />
                            {/* Certificate name placeholder */}
                            <MotionDiv
                                className="h-6 w-36 rounded-md bg-gray-200"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.1 }}
                            />
                        </div>
                        {/* Date placeholder */}
                        <MotionDiv
                            className="h-4 w-40 rounded-md bg-gray-200"
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.2 }}
                        />
                        {/* Icon placeholder */}
                        <MotionDiv
                            className="h-6 w-6 rounded-md bg-gray-200"
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.3 }}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
}
