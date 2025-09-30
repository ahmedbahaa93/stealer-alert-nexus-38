'use client';

import { MotionDiv } from '@/components/ui/motion';
import Card from '../Card';
import '@/components/ui/skeleton-loader.css';

export default function CourseProgressCardSkeleton() {
    return (
        <Card>
            {/* Title placeholder */}
            <MotionDiv
                className="h-8 w-48 bg-gray-200 rounded-md mb-6"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            />

            <div className='lg:w-[80%] space-y-10'>
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="w-full space-y-2">
                        <div className="flex items-center justify-between">
                            {/* Title placeholder */}
                            <MotionDiv
                                className="h-6 w-36 bg-gray-200 rounded-md"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index }}
                            />
                            {/* Progress text placeholder */}
                            <MotionDiv
                                className="h-4 w-16 bg-gray-200 rounded-md"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.1 }}
                            />
                        </div>
                        {/* Progress bar container placeholder */}
                        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            {/* Progress bar animation */}
                            <MotionDiv
                                className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-green-400"
                                initial={{ width: '0%' }}
                                animate={{ width: '30%' }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.1 * index + 0.3,
                                    repeat: Infinity,
                                    repeatType: 'reverse'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
