'use client';

import { MotionDiv } from '@/components/ui/motion';
import Card from '../Card';

export default function MyCertCardSkeleton() {
    return (
        <Card>
            {/* Title placeholder */}
            <MotionDiv
                className="h-8 w-48 bg-gray-200 rounded-md mb-6"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            />

            <div className="grid grid-cols-2 grid-rows-4 gap-x-5 gap-y-4 max-2xl:overflow-auto max-md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                {[...Array(12)].map((_, index) => (
                    <MotionDiv
                        key={index}
                        className="bg-white rounded-lg p-4 shadow-lg"
                        animate={{ opacity: [0.6, 0.8, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * (index % 6) }}
                    >
                        {/* Certificate image placeholder */}
                        <MotionDiv
                            className="h-[230px] w-full bg-gray-200 rounded-md mb-4"
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index }}
                        />

                        <div className="px-3">
                            {/* Title placeholder */}
                            <MotionDiv
                                className="h-6 w-3/4 bg-gray-200 rounded-md mb-3"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.1 }}
                            />

                            {/* Date placeholder */}
                            <div className="flex gap-3 mb-4">
                                <MotionDiv
                                    className="h-4 w-20 bg-gray-200 rounded-md"
                                    animate={{ opacity: [0.6, 0.8, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.2 }}
                                />
                                <MotionDiv
                                    className="h-4 w-32 bg-gray-200 rounded-md"
                                    animate={{ opacity: [0.6, 0.8, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.3 }}
                                />
                            </div>

                            {/* Button placeholder */}
                            <MotionDiv
                                className="h-10 w-24 bg-gray-200 rounded-md mx-auto"
                                animate={{ opacity: [0.6, 0.8, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 * index + 0.4 }}
                            />
                        </div>
                    </MotionDiv>
                ))}
            </div>
        </Card>
    );
}
