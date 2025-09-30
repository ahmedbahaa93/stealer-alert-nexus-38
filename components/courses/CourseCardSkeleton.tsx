'use client';

import { useViewChange } from '@/context/VewChangeProvider';
import clsx from 'clsx';

interface CourseCardSkeletonProps {
    count?: number;
}

function SingleCourseSkeleton() {
    const { viewMode } = useViewChange();

    return (
        <div className="animate-pulse h-[380px]">
            <div className="border-gradient bg-gray-100 rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl h-full">
                <div
                    className={clsx(
                        'bg-white course-bg rounded-md p-1 h-full',
                        viewMode === 'grid' && 'block',
                        viewMode === 'list' && 'flex gap-x-5'
                    )}
                >
                    {/* Image skeleton */}
                    <div
                        className={clsx(
                            'bg-gray-300 rounded-md',
                            viewMode === 'grid'
                                ? 'mx-auto h-[180px] w-full'
                                : 'h-[180px] w-[200px]'
                        )}
                    />

                    <div
                        className={clsx(
                            'px-3',
                            viewMode === 'grid' && 'h-[110px] flex flex-col',
                            viewMode === 'list' && 'flex flex-col justify-between py-3'
                        )}
                    >
                        {/* Title skeleton */}
                        <div className="bg-gray-200 mb-2 h-6 w-3/4 rounded"></div>

                        {/* Duration skeleton */}
                        <div className="bg-gray-200 mb-3 h-4 w-20 rounded"></div>

                        {/* Buttons skeleton */}
                        <div
                            className={clsx(
                                'mt-auto mb-3 flex justify-center',
                                viewMode === 'grid' && 'xl:gap-2 xl:px-3',
                                viewMode === 'list' && 'justify-start gap-x-5'
                            )}
                        >
                            <div className="bg-gray-200 h-10 w-28 rounded border"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CourseCardSkeleton({ count = 12 }: CourseCardSkeletonProps) {
    const { viewMode } = useViewChange();

    return (
        <div
            className={clsx(
                'col-span-2 mt-3 px-2 md:px-7',
                viewMode === 'grid' &&
                'grid grid-cols-2 gap-x-5 gap-y-8 max-2xl:overflow-auto max-md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3',
                viewMode === 'list' &&
                'flex h-auto flex-col gap-y-6 overflow-auto'
            )}
        >
            {Array.from({ length: count }).map((_, i) => (
                <SingleCourseSkeleton key={`skeleton-${i}`} />
            ))}
        </div>
    );
}
