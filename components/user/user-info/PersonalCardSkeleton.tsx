'use client';

import { MotionDiv } from '@/components/ui/motion';
import Card from '../Card';

export default function PersonalCardSkeleton() {
    return (
        <Card>
            {/* Title placeholder */}
            <MotionDiv
                className="h-8 w-56 bg-gray-200 rounded-md mb-6"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            />

            <div className="w-full space-y-11">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex gap-3 items-center">
                        {/* Icon placeholder */}
                        <MotionDiv
                            className="h-6 w-6 rounded-md bg-gray-200"
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index }}
                        />
                        {/* Label placeholder */}
                        <MotionDiv
                            className="h-6 w-28 rounded-md bg-gray-200"
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.1 }}
                        />
                        {/* Value placeholder */}
                        <MotionDiv
                            className={`h-6 rounded-md bg-gray-200 ${index === 2 ? 'w-40' : index === 3 ? 'w-12' : 'w-32'
                                }`}
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.2 }}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
}
