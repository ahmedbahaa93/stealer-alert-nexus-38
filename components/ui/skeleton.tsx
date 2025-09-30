'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    children?: React.ReactNode;
    variant?: 'default' | 'text' | 'circular' | 'rectangular' | 'button' | 'image';
    width?: string | number;
    height?: string | number;
    lines?: number;
    delay?: number;
}

// Helper function to get delay class
function getDelayClass(delay: number): string {
    if (delay === 0) return 'skeleton-delay-0';
    if (delay <= 50) return 'skeleton-delay-50';
    if (delay <= 100) return 'skeleton-delay-100';
    if (delay <= 150) return 'skeleton-delay-150';
    if (delay <= 200) return 'skeleton-delay-200';
    if (delay <= 250) return 'skeleton-delay-250';
    if (delay <= 300) return 'skeleton-delay-300';
    if (delay <= 400) return 'skeleton-delay-400';
    if (delay <= 500) return 'skeleton-delay-500';
    if (delay <= 600) return 'skeleton-delay-600';
    if (delay <= 700) return 'skeleton-delay-700';
    if (delay <= 800) return 'skeleton-delay-800';
    if (delay <= 900) return 'skeleton-delay-900';
    if (delay <= 1000) return 'skeleton-delay-1000';
    if (delay <= 1100) return 'skeleton-delay-1100';
    return 'skeleton-delay-1200';
}

// Helper function to get progressive delay class
function getProgressiveClass(index: number): string {
    const progressiveIndex = Math.min(index + 1, 10);
    return `skeleton-progressive-${progressiveIndex}`;
}

export function Skeleton({
    className,
    children,
    variant = 'default',
    lines = 1,
    delay = 0,
    ...props
}: SkeletonProps) {
    const baseClasses = 'skeleton-shimmer';

    const variantClasses = {
        default: 'rounded-md',
        text: 'rounded-sm',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        button: 'skeleton-button rounded-md',
        image: 'skeleton-image rounded-md'
    };

    const delayClass = delay > 0 ? getDelayClass(delay) : '';

    // For text variant with multiple lines
    if (variant === 'text' && lines > 1) {
        return (
            <div className={cn('space-y-2', className)} {...props}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            baseClasses,
                            variantClasses.text,
                            index === lines - 1 ? 'skeleton-text-medium' : 'skeleton-text-long',
                            getProgressiveClass(index + Math.floor(delay / 80))
                        )}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                delayClass,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Premium skeleton text with sophisticated timing
export function SkeletonText({
    className,
    lines = 1,
    size = 'medium',
    delay = 0
}: {
    className?: string;
    lines?: number;
    size?: 'short' | 'medium' | 'long' | 'title';
    delay?: number;
}) {
    const sizeClasses = {
        short: 'skeleton-text-short',
        medium: 'skeleton-text-medium',
        long: 'skeleton-text-long',
        title: 'skeleton-text-title'
    };

    const delayClass = delay > 0 ? getDelayClass(delay) : '';

    if (lines === 1) {
        return (
            <div
                className={cn(
                    'skeleton-shimmer rounded-sm',
                    sizeClasses[size],
                    delayClass,
                    className
                )}
            />
        );
    }

    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'skeleton-shimmer rounded-sm',
                        index === 0 && size === 'title' ? sizeClasses.title :
                            index === lines - 1 ? sizeClasses.medium : sizeClasses.long,
                        getProgressiveClass(index + Math.floor(delay / 80))
                    )}
                />
            ))}
        </div>
    );
}

// Premium avatar with floating animation
export function SkeletonAvatar({
    className,
    size = 'md',
    delay = 0
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    delay?: number;
}) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const delayClass = delay > 0 ? getDelayClass(delay) : '';

    return (
        <div
            className={cn(
                'skeleton-icon',
                sizeClasses[size],
                delayClass,
                className
            )}
        />
    );
}

// Premium button with gradient expansion
export function SkeletonButton({
    className,
    size = 'md',
    delay = 0
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    delay?: number;
}) {
    const sizeClasses = {
        sm: 'h-8 w-20',
        md: 'h-10 w-24',
        lg: 'h-12 w-32'
    };

    const delayClass = delay > 0 ? getDelayClass(delay) : '';

    return (
        <div
            className={cn(
                'skeleton-button',
                sizeClasses[size],
                delayClass,
                className
            )}
        />
    );
}

// Premium card with orchestrated animations
export function SkeletonCard({
    className,
    showAvatar = false,
    showButton = false,
    textLines = 2,
    delay = 0
}: {
    className?: string;
    showAvatar?: boolean;
    showButton?: boolean;
    textLines?: number;
    delay?: number;
}) {
    return (
        <div className={cn('p-4 space-y-4 skeleton-card-animated', className)}>
            {/* Header with optional avatar */}
            <div className="flex items-center space-x-3">
                {showAvatar && (
                    <SkeletonAvatar
                        size="md"
                        delay={delay}
                    />
                )}
                <div className="flex-1 space-y-2">
                    <SkeletonText
                        size="title"
                        delay={delay + 100}
                    />
                    <SkeletonText
                        size="medium"
                        delay={delay + 200}
                    />
                </div>
            </div>

            {/* Image placeholder */}
            <Skeleton
                variant="image"
                className="w-full h-48"
                delay={delay + 300}
            />

            {/* Text content */}
            <SkeletonText
                lines={textLines}
                delay={delay + 400}
            />

            {/* Optional button */}
            {showButton && (
                <div className="flex justify-center pt-2">
                    <SkeletonButton
                        size="md"
                        delay={delay + 600}
                    />
                </div>
            )}
        </div>
    );
}

// Premium loading dots with elastic bounce
export function LoadingDots({ className }: { className?: string }) {
    return (
        <div className={cn('skeleton-loading-dots', className)}>
            <span />
            <span />
            <span />
        </div>
    );
}

// Progress skeleton with animated fill
export function SkeletonProgress({
    className,
    value = 60,
    delay = 0
}: {
    className?: string;
    value?: number;
    delay?: number;
}) {
    // Define width classes for common values
    const getWidthClass = (val: number): string => {
        if (val <= 10) return 'w-[10%]';
        if (val <= 20) return 'w-[20%]';
        if (val <= 30) return 'w-[30%]';
        if (val <= 40) return 'w-[40%]';
        if (val <= 50) return 'w-[50%]';
        if (val <= 60) return 'w-[60%]';
        if (val <= 70) return 'w-[70%]';
        if (val <= 80) return 'w-[80%]';
        if (val <= 90) return 'w-[90%]';
        return 'w-full';
    };

    return (
        <div className={cn('w-full space-y-2', className)}>
            <div className="flex justify-between items-center">
                <SkeletonText size="short" delay={delay} />
                <SkeletonText size="short" delay={delay + 100} />
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full skeleton-premium rounded-full transition-all duration-1000 ease-out',
                        getDelayClass(delay + 200),
                        getWidthClass(value)
                    )}
                />
            </div>
        </div>
    );
}

// Metadata row skeleton
export function SkeletonMetadata({
    className,
    items = 3,
    delay = 0
}: {
    className?: string;
    items?: number;
    delay?: number;
}) {
    return (
        <div className={cn('flex items-center space-x-4', className)}>
            {Array.from({ length: items }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <SkeletonAvatar
                        size="sm"
                        delay={delay + (index * 100)}
                    />
                    <SkeletonText
                        size="short"
                        delay={delay + (index * 100) + 50}
                    />
                    {index < items - 1 && (
                        <div
                            className={cn(
                                'w-px h-4 bg-muted skeleton-breathing',
                                getDelayClass(delay + (index * 100) + 100)
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
