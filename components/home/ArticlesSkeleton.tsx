'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface ArticlesSkeletonProps {
    itemCount?: number;
}

function ArticlesSkeleton({ itemCount = 6 }: ArticlesSkeletonProps) {
    return (
        <div className="pb-15 overflow-visible">
            {/* Header skeleton */}
            <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
                <Skeleton className="h-[60px] w-[60px] rounded-full" />
                <Skeleton className="h-8 w-48" />
            </div>

            {/* Cards skeleton */}
            <div className="carousel-container flex items-center justify-center px-4">
                <div className="w-full max-w-[90%] md:max-w-[95%] mx-auto">
                    <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: itemCount }).map((_, index) => (
                            <div key={index} className="min-w-[350px] p-1">
                                <div className="bg-card rounded-xl drop-shadow-lg overflow-hidden">
                                    <Skeleton className="w-full h-[250px] rounded-t-xl" />
                                    <div className="mt-5 px-5 space-y-4">
                                        <div className="flex items-center justify-start gap-6">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div className="space-y-3">
                                            <Skeleton className="h-6 w-full" />
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-5/6" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </div>
                                    </div>
                                    <div className="mx-auto mt-10 flex w-[50%] items-center justify-evenly pb-5">
                                        <Skeleton className="h-10 w-24 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticlesSkeleton;
