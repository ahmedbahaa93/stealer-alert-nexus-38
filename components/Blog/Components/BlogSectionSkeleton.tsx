'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from "next-intl";

interface BlogSectionSkeletonProps {
    index?: number;
}

function BlogSectionSkeleton({ index = 0 }: BlogSectionSkeletonProps) {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const isEven = index % 2 === 0;

    return (
        <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 animate-pulse" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? 'lg:gap-16' : 'lg:gap-16'
                    }`}>
                    {/* Content Section */}
                    <div className={`space-y-8 ${isEven ? 'lg:order-1' : 'lg:order-2'
                        }`}>
                        {/* Category Badge */}
                        <Skeleton className="h-6 w-24 rounded-full" />

                        {/* Title */}
                        <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-4/5" />
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>

                        {/* Author and Meta Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>

                            {/* Read More Button */}
                            <Skeleton className="h-12 w-36 rounded-xl" />
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className={`relative ${isEven ? 'lg:order-2' : 'lg:order-1'
                        }`}>
                        <div className="relative group">
                            <Skeleton className="w-full h-80 rounded-2xl" />

                            {/* Floating Elements */}
                            <div className="absolute top-4 right-4">
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>

                            <div className="absolute bottom-4 left-4">
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogSectionSkeleton;
