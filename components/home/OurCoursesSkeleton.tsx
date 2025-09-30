'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MotionDiv } from '@/components/ui/motion';
import { DynamicIcon } from '../DynamicIcon';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '../ui/carousel';
import EnhancedCourseCardSkeleton from '../ui/skeletons/EnhancedCourseCardSkeleton';
import { SkeletonText } from '../ui/skeletons/PremiumSkeleton';

interface OurCoursesSkeletonProps {
    showTitle?: boolean;
    itemCount?: number;
}

function OurCoursesSkeleton({
    showTitle = true,
    itemCount = 6
}: OurCoursesSkeletonProps) {
    return (
        <div className="pb-15 relative">
            {/* Premium Header Section with orchestrated entrance */}
            {showTitle && (
                <MotionDiv
                    className="mx-auto mt-10 flex items-center justify-center space-x-3 pb-10"
                    initial={{ opacity: 0, y: -30, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                            duration: 1,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 100
                        }
                    }}
                >
                    <MotionDiv
                        className="relative"
                        animate={{
                            y: [0, -8, 0],
                            rotate: [0, 3, -3, 0],
                            transition: {
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        <DynamicIcon
                            src="/assets/home/book-lamb.svg"
                            alt="book-with-lamb"
                            width={60}
                            className="opacity-70"
                        />
                        {/* Sophisticated loading indicator overlay */}
                        <div className="absolute -top-2 -right-2 flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                                <MotionDiv
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-400 to-blue-400"
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        opacity: [0.4, 1, 0.4],
                                        transition: {
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.2
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </MotionDiv>
                    <div className="space-y-2">
                        <MotionDiv
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                transition: { delay: 0.3, duration: 0.8 }
                            }}
                        >
                            <SkeletonText
                                lines={1}
                                delay={0.2}
                                variant="gradient"
                                className="w-44 h-8"
                            />
                        </MotionDiv>
                        <MotionDiv
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { delay: 0.5, duration: 0.6 }
                            }}
                        >
                            <SkeletonText
                                lines={1}
                                delay={0.35}
                                variant="wave"
                                className="w-32 h-4"
                            />
                        </MotionDiv>
                    </div>
                </MotionDiv>
            )}

            {/* Premium Carousel Section with enhanced spacing */}
            <div className="flex items-center justify-center">
                <Carousel opts={{ loop: true }} className="w-[70%] sm:w-[80%]" dir="ltr">
                    <MotionDiv
                        initial={{ opacity: 0, x: -30 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.6, duration: 0.7 }
                        }}
                    >
                        <CarouselPrevious className="opacity-60 hover:opacity-100 transition-opacity" />
                    </MotionDiv>

                    <CarouselContent className="w-[80%]">
                        {Array.from({ length: itemCount }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className={cn(
                                    "pl-5 md:basis-1/2 xl:basis-1/3 xl:pl-20"
                                )}
                            >
                                <EnhancedCourseCardSkeleton
                                    delay={index * 0.12}
                                    variant="our-courses"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <MotionDiv
                        initial={{ opacity: 0, x: 30 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.6, duration: 0.7 }
                        }}
                    >
                        <CarouselNext className="opacity-60 hover:opacity-100 transition-opacity" />
                    </MotionDiv>
                </Carousel>
            </div>

            {/* Premium loading indicator at bottom with enhanced design */}
            <MotionDiv
                className="flex flex-col items-center mt-8 space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1.2, duration: 1 }
                }}
            >
                <div className="flex items-center space-x-3 text-muted-foreground">
                    {/* Enhanced loading dots */}
                    <div className="flex space-x-2">
                        {[...Array(4)].map((_, i) => (
                            <MotionDiv
                                key={i}
                                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                                animate={{
                                    y: [0, -12, 0],
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                    transition: {
                                        duration: 1.8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.15
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <SkeletonText
                        lines={1}
                        delay={0.5}
                        variant="pulse"
                        className="w-36 h-4"
                    />
                </div>

                {/* Additional status indicators */}
                <div className="flex items-center space-x-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <MotionDiv
                                className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.4, 1, 0.4],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.4
                                    }
                                }}
                            />
                            <SkeletonText
                                lines={1}
                                delay={0.8 + i * 0.1}
                                variant="wave"
                                className="w-20 h-3"
                            />
                        </div>
                    ))}
                </div>
            </MotionDiv>

            {/* Premium ambient floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <MotionDiv
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-pink-200/20 dark:from-blue-800/10 dark:via-purple-800/10 dark:to-pink-800/10"
                        style={{
                            width: `${8 + (i % 3) * 4}px`,
                            height: `${8 + (i % 3) * 4}px`,
                            left: `${5 + i * 12}%`,
                            top: `${15 + (i % 4) * 20}%`,
                        }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, 20, 0],
                            opacity: [0.1, 0.6, 0.1],
                            scale: [0.8, 1.4, 0.8],
                            rotate: [0, 180, 360],
                            transition: {
                                duration: 8 + i * 0.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 1.2
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default OurCoursesSkeleton;
