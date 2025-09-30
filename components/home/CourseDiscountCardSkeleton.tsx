'use client';

// GrowAnimation removed to prevent overflow issues
import Border from '@/components/courses/Border';
import {
    Skeleton,
    SkeletonText,
    SkeletonButton,
    SkeletonAvatar,
    SkeletonProgress,
    SkeletonMetadata
} from '@/components/ui/skeleton';

function CourseDiscountCardSkeleton() {
    return (
        <div className="card-container">
            <Border padding="py-1 px-[1px] h-fit">
                <div className="bg-primary-foreground course-bg block rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl skeleton-card-animated">
                    {/* Premium Image skeleton with depth and layered effects */}
                    <div className="relative">
                        <Skeleton
                            variant="image"
                            className="mx-auto h-[230px] w-full rounded-md skeleton-premium"
                            delay={0}
                        />

                        {/* Sophisticated overlay patterns for visual richness */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            {/* Primary floating element */}
                            <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 skeleton-breathing skeleton-delay-500" />

                            {/* Secondary geometric shape */}
                            <div className="absolute top-6 right-6 w-8 h-8 rounded bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 skeleton-breathing skeleton-delay-700" />

                            {/* Tertiary accent */}
                            <div className="absolute bottom-4 left-6 w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 skeleton-breathing skeleton-delay-1000" />

                            {/* Additional micro-elements for premium feel */}
                            <div className="absolute bottom-4 right-4 w-4 h-4 rounded bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 skeleton-breathing skeleton-delay-1200" />
                        </div>

                        {/* Course category badge skeleton */}
                        <div className="absolute top-3 right-3">
                            <div className="px-2 py-1 rounded-full bg-primary/10 backdrop-blur-sm">
                                <SkeletonText size="short" delay={300} />
                            </div>
                        </div>
                    </div>

                    <div className="px-3 space-y-4">
                        {/* Enhanced Title with realistic proportions */}
                        <div className="mt-4 space-y-2">
                            <SkeletonText size="title" delay={100} />
                            {/* Secondary title line for longer course names */}
                            <div className="w-3/5">
                                <SkeletonText size="medium" delay={180} />
                            </div>
                        </div>

                        {/* Instructor and rating section */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <SkeletonAvatar size="sm" delay={250} />
                                <SkeletonText size="medium" delay={300} />
                            </div>
                            <div className="flex items-center space-x-1">
                                <SkeletonText size="short" delay={350} />
                                <div className="w-4 h-4 rounded-full skeleton-shimmer skeleton-delay-400" />
                            </div>
                        </div>

                        {/* Course metadata row with enhanced layout */}
                        <SkeletonMetadata items={3} delay={400} />

                        {/* Pricing section with sophisticated layout */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <SkeletonText size="title" delay={500} />
                                    <div className="line-through">
                                        <SkeletonText size="medium" delay={550} />
                                    </div>
                                </div>
                                <SkeletonText size="short" delay={600} />
                            </div>
                            <div className="text-right">
                                <div className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/20">
                                    <SkeletonText size="short" delay={650} />
                                </div>
                            </div>
                        </div>

                        {/* Progress indicator for course completion */}
                        <SkeletonProgress value={65} delay={700} />

                        {/* Enhanced action button with premium styling */}
                        <div className="mt-5 mb-3 flex justify-center xl:gap-2 xl:px-3">
                            <Border padding="p-[1px]">
                                <SkeletonButton
                                    size="md"
                                    className="relative overflow-hidden skeleton-premium w-full"
                                    delay={800}
                                />
                            </Border>
                        </div>

                        {/* Footer actions with sophisticated spacing */}
                        <div className="flex justify-between items-center pb-3">
                            <div className="flex space-x-3">
                                <SkeletonAvatar size="sm" delay={900} />
                                <SkeletonAvatar size="sm" delay={950} />
                                <SkeletonAvatar size="sm" delay={1000} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <SkeletonText size="short" delay={1050} />
                                <div className="w-3 h-3 rounded-full skeleton-shimmer skeleton-delay-1100" />
                            </div>
                        </div>
                    </div>
                </div>
            </Border>
        </div>
    );
}

export default CourseDiscountCardSkeleton;
