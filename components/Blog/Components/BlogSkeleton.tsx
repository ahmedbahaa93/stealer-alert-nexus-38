'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from "next-intl";

interface BlogSkeletonProps {
    itemCount?: number;
    showHeader?: boolean;
}

function BlogSkeleton({ itemCount = 5, showHeader = true }: BlogSkeletonProps) {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header Section Skeleton */}
            {showHeader && (
                <div className="w-full bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Featured Blog Content */}
                            <div className="space-y-6">
                                <Skeleton className="h-10 w-3/4" />
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/5" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                                <div className="flex items-center space-x-4 pt-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-32" />
                            </div>

                            {/* Featured Image */}
                            <div className="relative">
                                <Skeleton className="w-full h-80 rounded-2xl" />
                                <div className="absolute top-4 right-4">
                                    <Skeleton className="h-8 w-20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Cards Grid Skeleton */}
            <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: itemCount }).map((_, index) => (
                            <BlogCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Individual Blog Card Skeleton Component
function BlogCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
            {/* Image Skeleton */}
            <div className="relative">
                <Skeleton className="w-full h-48" />
                <div className="absolute top-4 left-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="absolute top-4 right-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />

                {/* Description */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </div>
    );
}

export default BlogSkeleton;
