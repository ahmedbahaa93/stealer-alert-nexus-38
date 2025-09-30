'use client';

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

interface CourseDiscountSkeletonProps {
    showTitle?: boolean;
    itemCount?: number;
}

function CourseDiscountSkeleton({
    showTitle = true,
    itemCount = 6
}: CourseDiscountSkeletonProps) {
    return (
        <div className="pb-15 overflow-visible">
            {showTitle && (
                <MotionDiv
                    className="mx-auto mt-10 flex items-center justify-center space-x-3 pb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, ease: "easeOut" }
                    }}
                >
                    <MotionDiv
                        className="relative"
                        animate={{
                            y: [0, -5, 0],
                            rotate: [0, 5, -5, 0],
                            transition: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        <DynamicIcon
                            src="/assets/home/course-dis.svg"
                            alt="celebrate"
                            width={60}
                            className="opacity-70"
                        />
                        {/* Premium loading indicator overlay */}
                        <MotionDiv
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.6, 1, 0.6],
                                transition: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                        />
                    </MotionDiv>
                    <div className="space-y-2">
                        <SkeletonText
                            lines={1}
                            delay={0.2}
                            variant="gradient"
                            className="w-52 h-8"
                        />
                        <MotionDiv
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { delay: 0.4, duration: 0.6 }
                            }}
                        >
                            <SkeletonText
                                lines={1}
                                delay={0.3}
                                variant="wave"
                                className="w-32 h-4"
                            />
                        </MotionDiv>
                    </div>
                </MotionDiv>
            )}

            <div className="flex items-center justify-center card-hover-section">
                <Carousel opts={{ loop: true }} className="w-[70%] sm:w-[80%] overflow-visible" dir="ltr">
                    <MotionDiv
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.5, duration: 0.6 }
                        }}
                    >
                        <CarouselPrevious className="opacity-60 hover:opacity-100 transition-opacity" />
                    </MotionDiv>

                    <CarouselContent className="w-[80%] py-4 overflow-visible">
                        {Array.from({ length: itemCount }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className={cn(
                                    "pl-5 md:basis-1/2 xl:basis-1/3 xl:pl-20 py-4 overflow-visible"
                                )}
                            >
                                <EnhancedCourseCardSkeleton
                                    delay={index * 0.15}
                                    variant="course-discount"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <MotionDiv
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.5, duration: 0.6 }
                        }}
                    >
                        <CarouselNext className="opacity-60 hover:opacity-100 transition-opacity" />
                    </MotionDiv>
                </Carousel>
            </div>

            {/* Enhanced loading indicators */}
            <MotionDiv
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1, duration: 0.8 }
                }}
            >
                <div className="flex items-center space-x-4">
                    {[...Array(5)].map((_, i) => (
                        <MotionDiv
                            key={i}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.4, 1, 0.4],
                                transition: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.2
                                }
                            }}
                        />
                    ))}
                </div>
            </MotionDiv>

            {/* Premium floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <MotionDiv
                        key={i}
                        className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 dark:from-blue-800/20 dark:to-purple-800/20"
                        style={{
                            left: `${10 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [0.8, 1.2, 0.8],
                            transition: {
                                duration: 6 + i * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.8
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default CourseDiscountSkeleton;
