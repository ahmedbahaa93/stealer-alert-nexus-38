'use client';

import { cn } from '@/lib/utils';
import { DynamicIcon } from '../DynamicIcon';
import { SkeletonText, LoadingDots } from '@/components/ui/skeleton';
import Border from './Border';

interface TopCategorySkeletonProps {
    showTitle?: boolean;
    itemCount?: number;
}

function TopCategorySkeleton({
    showTitle = true,
    itemCount = 10
}: TopCategorySkeletonProps) {
    return (
        <div className="pb-15">
            {/* Premium Header Section with orchestrated entrance */}
            {showTitle && (
                <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-2 skeleton-card-animated">
                    <div className="relative">
                        <DynamicIcon
                            src="/assets/home/cat.svg"
                            alt="celebrate"
                            width={60}
                            className="skeleton-floating opacity-60"
                        />
                        {/* Sophisticated loading indicator overlay */}
                        <div className="absolute -top-1 -right-1 skeleton-delay-300">
                            <LoadingDots className="scale-75" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <SkeletonText size="title" className="w-48" delay={200} />
                    </div>
                </div>
            )}

            {/* Description skeleton */}
            <div className="pb-10 text-center skeleton-delay-400">
                <SkeletonText size="long" className="w-64 mx-auto" delay={300} />
            </div>

            {/* Premium Grid Section with enhanced spacing */}
            <div className="grid-cols-3 gap-3 px-15 max-md:space-y-5 md:grid lg:grid-cols-4 lg:gap-15 xl:grid-cols-5">
                {Array.from({ length: itemCount }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "skeleton-card-animated",
                            `skeleton-delay-${(index % 6) * 100 + 500}`
                        )}
                    >
                        <Border padding="pl-[2px] pb-[2px] hover:p-1">
                            <div className="bg-card h-55 rounded-lg text-center skeleton-shimmer">
                                {/* Icon skeleton */}
                                <div className="mx-auto pt-15 flex justify-center">
                                    <div className="w-8 h-8 rounded skeleton-breathing skeleton-shimmer" />
                                </div>

                                {/* Title skeleton */}
                                <div className="px-4 mt-3 flex justify-center">
                                    <SkeletonText
                                        size="medium"
                                        className="w-24"
                                        delay={index * 50 + 600}
                                    />
                                </div>

                                {/* Course count skeleton */}
                                <div className="px-4 mt-2 flex justify-center">
                                    <SkeletonText
                                        size="short"
                                        className="w-16"
                                        delay={index * 50 + 700}
                                    />
                                </div>
                            </div>
                        </Border>
                    </div>
                ))}
            </div>

            {/* Premium loading indicator at bottom with enhanced design */}
            <div className="flex flex-col items-center mt-8 space-y-3">
                <div className="flex items-center space-x-3 text-muted-foreground">
                    <LoadingDots />
                    <SkeletonText size="medium" className="w-40" delay={100} />
                </div>

                {/* Additional status indicators */}
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full skeleton-shimmer skeleton-breathing" />
                        <SkeletonText size="short" className="w-24" delay={200} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full skeleton-shimmer skeleton-breathing skeleton-delay-300" />
                        <SkeletonText size="short" className="w-28" delay={300} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full skeleton-shimmer skeleton-breathing skeleton-delay-500" />
                        <SkeletonText size="short" className="w-20" delay={400} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopCategorySkeleton;
