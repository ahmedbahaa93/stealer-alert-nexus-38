'use client';

import { MotionDiv } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

interface PremiumSkeletonProps {
    className?: string;
    variant?: 'default' | 'floating' | 'wave' | 'pulse' | 'shimmer' | 'gradient' | 'particles';
    delay?: number;
    width?: string | number;
    height?: string | number;
}

export function PremiumSkeleton({
    className,
    variant = 'default',
    delay = 0,
    width,
    height
}: PremiumSkeletonProps) {
    const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg";

    const variants = {
        default: {
            opacity: [0.4, 0.8, 0.4],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay
            }
        },
        floating: {
            opacity: [0.4, 0.9, 0.4],
            y: [0, -8, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay
            }
        },
        wave: {
            opacity: [0.3, 0.7, 0.3],
            scaleX: [1, 1.02, 1],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay
            }
        },
        pulse: {
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
            transition: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay
            }
        },
        shimmer: {
            backgroundPosition: ['-200px 0', '200px 0'],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear" as const,
                delay
            }
        },
        gradient: {
            background: [
                'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
            ],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay
            }
        },
        particles: {
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay
            }
        }
    };

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <MotionDiv
            className={cn(baseClasses, className)}
            animate={variants[variant]}
            style={style}
        />
    );
}

// Specialized skeleton components with enhanced animations
export function SkeletonCard({
    delay = 0,
    className
}: {
    delay?: number;
    className?: string;
}) {
    return (
        <MotionDiv
            className={cn("space-y-4 p-4", className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { delay, duration: 0.6 }
            }}
        >
            <PremiumSkeleton variant="floating" delay={delay} height={200} className="w-full" />
            <div className="space-y-2">
                <PremiumSkeleton variant="wave" delay={delay + 0.1} height={24} className="w-3/4" />
                <PremiumSkeleton variant="pulse" delay={delay + 0.2} height={16} className="w-1/2" />
            </div>
            <div className="flex space-x-2">
                <PremiumSkeleton variant="gradient" delay={delay + 0.3} height={36} className="flex-1" />
                <PremiumSkeleton variant="particles" delay={delay + 0.4} height={36} className="flex-1" />
            </div>
        </MotionDiv>
    );
}

export function SkeletonImage({
    delay = 0,
    className,
    aspectRatio = "16/9"
}: {
    delay?: number;
    className?: string;
    aspectRatio?: string;
}) {
    return (
        <MotionDiv
            className={cn("relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600", className)}
            style={{ aspectRatio }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: { delay, duration: 0.8 }
            }}
        >
            {/* Animated gradient overlay */}
            <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-400/20"
                animate={{
                    x: [-100, 300],
                    transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay
                    }
                }}
            />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <MotionDiv
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 dark:bg-gray-400/30 rounded-full"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.8, 0.3],
                            transition: {
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: delay + i * 0.2
                            }
                        }}
                    />
                ))}
            </div>
        </MotionDiv>
    );
}

export function SkeletonText({
    delay = 0,
    className,
    lines = 1,
    variant = 'wave'
}: {
    delay?: number;
    className?: string;
    lines?: number;
    variant?: 'wave' | 'pulse' | 'gradient';
}) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <PremiumSkeleton
                    key={i}
                    variant={variant}
                    delay={delay + i * 0.1}
                    height={16}
                    className={cn(
                        "rounded-full",
                        i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
                    )}
                />
            ))}
        </div>
    );
}

export function SkeletonButton({
    delay = 0,
    className,
    size = 'md'
}: {
    delay?: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClasses = {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6"
    };

    return (
        <MotionDiv
            className={cn(
                "relative overflow-hidden rounded-md bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-700",
                sizeClasses[size],
                className
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: { delay, duration: 0.5 }
            }}
        >
            {/* Pulsing overlay */}
            <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                    x: [-50, 150],
                    transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay
                    }
                }}
            />
        </MotionDiv>
    );
}

export function SkeletonAvatar({
    delay = 0,
    className,
    size = 'md'
}: {
    delay?: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12"
    };

    return (
        <MotionDiv
            className={cn(
                "rounded-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-700",
                sizeClasses[size],
                className
            )}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{
                opacity: 1,
                rotate: 0,
                transition: { delay, duration: 0.8 }
            }}
        >
            <MotionDiv
                className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-400/40"
                animate={{
                    rotate: 360,
                    transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay
                    }
                }}
            />
        </MotionDiv>
    );
}
