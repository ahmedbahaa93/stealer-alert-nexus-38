'use client';

import { MotionDiv } from "@/components/ui/motion";
import Border from '@/components/courses/Border';
import { PremiumSkeleton, SkeletonImage, SkeletonText, SkeletonButton } from './PremiumSkeleton';
import { cn } from "@/lib/utils";

interface EnhancedCourseCardSkeletonProps {
    delay?: number;
    variant?: 'course-discount' | 'our-courses' | 'category';
}

export function EnhancedCourseCardSkeleton({
    delay = 0,
    variant = 'course-discount'
}: EnhancedCourseCardSkeletonProps) {
    return (
        <MotionDiv
            className={cn(
                "relative",
                variant === 'course-discount' && "w-[408px] h-[420px]",
                variant === 'our-courses' && "w-full h-[420px]",
                variant === 'category' && "w-full h-[380px]"
            )}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    delay,
                    duration: 0.8,
                    ease: "easeOut"
                }
            }}
        >
            <Border padding="py-1 px-[1px] h-full">
                <div className="bg-primary-foreground course-bg rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl h-full relative overflow-hidden">

                    {/* Premium floating background elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Main floating orb */}
                        <MotionDiv
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100/50 to-blue-200/50 dark:from-blue-900/30 dark:to-blue-800/30"
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3],
                                transition: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: delay + 0.5
                                }
                            }}
                        />

                        {/* Secondary floating elements */}
                        <MotionDiv
                            className="absolute bottom-6 left-6 w-6 h-6 rounded-full bg-gradient-to-br from-green-100/50 to-green-200/50 dark:from-green-900/30 dark:to-green-800/30"
                            animate={{
                                x: [0, 8, 0],
                                rotate: [0, 180, 360],
                                opacity: [0.2, 0.5, 0.2],
                                transition: {
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: delay + 1
                                }
                            }}
                        />

                        {/* Micro particles */}
                        {[...Array(3)].map((_, i) => (
                            <MotionDiv
                                key={i}
                                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-200/40 to-pink-200/40 dark:from-purple-800/30 dark:to-pink-800/30"
                                style={{
                                    top: `${20 + i * 25}%`,
                                    left: `${15 + i * 20}%`,
                                }}
                                animate={{
                                    y: [0, -15, 0],
                                    opacity: [0.2, 0.6, 0.2],
                                    scale: [0.8, 1.2, 0.8],
                                    transition: {
                                        duration: 3 + i * 0.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: delay + i * 0.3
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* Course Image with enhanced effects */}
                    <div className="relative w-full max-w-[396px] h-[256px] mt-[3px] mx-auto rounded-[20px] overflow-hidden">
                        <SkeletonImage
                            delay={delay}
                            className="w-full h-full"
                            aspectRatio="auto"
                        />

                        {/* Image overlay effects */}
                        <MotionDiv
                            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
                            animate={{
                                opacity: [0.1, 0.3, 0.1],
                                transition: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: delay + 0.2
                                }
                            }}
                        />

                        {/* Corner badge skeleton */}
                        <div className="absolute top-3 right-3">
                            <MotionDiv
                                className="px-2 py-1 rounded-full bg-gradient-to-r from-orange-200/80 to-red-200/80 dark:from-orange-800/60 dark:to-red-800/60"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.7, 1, 0.7],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: delay + 0.8
                                    }
                                }}
                            >
                                <PremiumSkeleton variant="shimmer" width={40} height={12} className="rounded-full" />
                            </MotionDiv>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-4 flex flex-col justify-between h-[150px] relative z-10">

                        {/* Title with sophisticated animation */}
                        <div className="mt-3 space-y-2">
                            <MotionDiv
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        delay: delay + 0.3,
                                        duration: 0.6
                                    }
                                }}
                            >
                                <SkeletonText delay={delay + 0.4} lines={2} variant="wave" />
                            </MotionDiv>
                        </div>

                        {/* Metadata row with enhanced spacing */}
                        <MotionDiv
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    delay: delay + 0.5,
                                    duration: 0.6
                                }
                            }}
                        >
                            {/* Duration indicator */}
                            <div className="flex items-center space-x-2">
                                <MotionDiv
                                    className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-600"
                                    animate={{
                                        rotate: 360,
                                        transition: {
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: delay + 0.6
                                        }
                                    }}
                                />
                                <PremiumSkeleton variant="pulse" width={60} height={16} className="rounded-full" delay={delay + 0.7} />
                            </div>

                            {/* Price indicator */}
                            <div className="text-right space-y-1">
                                <PremiumSkeleton variant="gradient" width={80} height={20} className="rounded-full" delay={delay + 0.8} />
                                <PremiumSkeleton variant="wave" width={60} height={14} className="rounded-full" delay={delay + 0.9} />
                            </div>
                        </MotionDiv>

                        {/* Action buttons with staggered entrance */}
                        <MotionDiv
                            className="mt-5 mb-3 flex justify-center xl:gap-2 xl:px-3"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    delay: delay + 0.8,
                                    duration: 0.7,
                                    ease: "backOut"
                                }
                            }}
                        >
                            <Border padding="p-[1px]">
                                <SkeletonButton
                                    delay={delay + 1}
                                    size="md"
                                    className="w-32 relative overflow-hidden"
                                />
                            </Border>
                        </MotionDiv>

                        {/* Footer elements with premium touches */}
                        <MotionDiv
                            className="flex justify-between items-center pb-2"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    delay: delay + 1.2,
                                    duration: 0.8
                                }
                            }}
                        >
                            {/* User avatars */}
                            <div className="flex -space-x-2">
                                {[...Array(3)].map((_, i) => (
                                    <MotionDiv
                                        key={i}
                                        className="relative"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{
                                            scale: 1,
                                            rotate: 0,
                                            transition: {
                                                delay: delay + 1.3 + i * 0.1,
                                                duration: 0.5,
                                                ease: "backOut"
                                            }
                                        }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 border-2 border-white dark:border-gray-800">
                                            <MotionDiv
                                                className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                animate={{
                                                    rotate: 360,
                                                    transition: {
                                                        duration: 4 + i,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                        delay: delay + 1.5 + i * 0.2
                                                    }
                                                }}
                                            />
                                        </div>
                                    </MotionDiv>
                                ))}
                            </div>

                            {/* Status indicators */}
                            <div className="flex items-center space-x-3">
                                {[...Array(3)].map((_, i) => (
                                    <MotionDiv
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-gradient-to-r from-green-300 to-blue-300 dark:from-green-700 dark:to-blue-700"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.5, 1, 0.5],
                                            transition: {
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: delay + 1.8 + i * 0.3
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </MotionDiv>
                    </div>

                    {/* Premium loading overlay */}
                    <MotionDiv
                        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"
                        animate={{
                            opacity: [0, 0.3, 0],
                            rotate: [0, 180, 360],
                            transition: {
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                                delay
                            }
                        }}
                    />
                </div>
            </Border>
        </MotionDiv>
    );
}

export default EnhancedCourseCardSkeleton;
