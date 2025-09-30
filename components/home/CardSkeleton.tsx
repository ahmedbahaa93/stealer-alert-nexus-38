'use client';

import Border from '@/components/courses/Border';
import { MotionDiv } from '@/components/ui/motion';
import '@/components/ui/skeleton-loader.css';

interface CardSkeletonProps {
    delay?: number;
    index?: number;
}

export default function CardSkeleton({ delay = 0, index = 0 }: CardSkeletonProps) {
    // Use class-based delays instead of inline styles
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay / 1000 }}
            className="h-full"
        >
            <Border padding="py-1 px-[1px] h-fit">
                <div className="skeleton-card">
                    {/* Image placeholder with staggered animation */}
                    <div className={`skeleton-image skeleton-shimmer skeleton-delay-${index ? 100 + index * 50 : 100}`} />

                    <div className="skeleton-content">
                        {/* Title placeholder */}
                        <div className={`skeleton-title skeleton-shimmer skeleton-delay-${index ? 150 + index * 50 : 150}`} />

                        {/* Subtitle/metadata placeholders */}
                        <div className="skeleton-meta">
                            <div className={`skeleton-meta-item skeleton-shimmer skeleton-delay-${index ? 200 + index * 50 : 200}`} />
                        </div>

                        {/* Button placeholder */}
                        <div className="mt-4 mb-2 flex justify-center">
                            <div className={`skeleton-button skeleton-shimmer skeleton-delay-${index ? 250 + index * 50 : 250}`} />
                        </div>
                    </div>
                </div>
            </Border>
        </MotionDiv>
    );
}
