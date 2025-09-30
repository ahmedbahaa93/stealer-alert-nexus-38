'use client';

import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/DynamicIcon';

interface OurCoursesErrorProps {
    onRetry: () => void;
    error?: Error | null;
}

function OurCoursesError({ onRetry, error }: OurCoursesErrorProps) {
    const t = useTranslations('HomePage.errors');

    // Determine error type for better UX
    const isNetworkError = error?.message?.toLowerCase().includes('network') ||
        error?.message?.toLowerCase().includes('fetch') ||
        !navigator.onLine;

    return (
        <div className="pb-15">
            {/* Header Section */}
            <div className="mx-auto mt-10 flex items-center justify-center space-x-3 pb-10">
                <DynamicIcon
                    src="/assets/home/book-lamb.svg"
                    alt="book-with-lamb"
                    width={60}
                    className="opacity-50"
                />
                <h2 className="text-primary-identity text-3xl font-bold opacity-50">
                    {t('our-courses-title')}
                </h2>
            </div>

            {/* Error Content */}
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center max-w-md mx-auto space-y-6">
                    {/* Error Icon */}
                    <div className="flex justify-center">
                        {isNetworkError ? (
                            <WifiOff className="h-16 w-16 text-muted-foreground" />
                        ) : (
                            <Wifi className="h-16 w-16 text-muted-foreground" />
                        )}
                    </div>

                    {/* Error Message */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                            {isNetworkError ? t('network-error-title') : t('general-error-title')}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {isNetworkError ? t('network-error-message') : t('general-error-message')}
                        </p>
                    </div>

                    {/* Retry Button */}
                    <Button
                        onClick={onRetry}
                        variant="outline"
                        className="border-primary-identity hover:bg-primary-identity hover:text-primary-foreground"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t('retry-button')}
                    </Button>

                    {/* Additional Help */}
                    {isNetworkError && (
                        <p className="text-xs text-muted-foreground">
                            {t('network-help')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OurCoursesError;
