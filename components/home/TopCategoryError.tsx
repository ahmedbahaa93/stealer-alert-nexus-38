'use client';

import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/DynamicIcon';

interface TopCategoryErrorProps {
    onRetry: () => void;
    error?: Error | null;
}

function TopCategoryError({ onRetry, error }: TopCategoryErrorProps) {
    const t = useTranslations('HomePage.errors');

    // Determine error type for better UX
    const isNetworkError = error?.message?.toLowerCase().includes('network') ||
        error?.message?.toLowerCase().includes('fetch') ||
        !navigator.onLine;

    return (
        <div className="pb-15">
            {/* Header Section */}
            <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-2">
                <DynamicIcon
                    src="/assets/home/cat.svg"
                    alt="celebrate"
                    width={60}
                    className="opacity-50"
                />
                <h2 className="text-primary-identity text-3xl font-bold opacity-50">
                    {t('top-categories-title')}
                </h2>
            </div>
            <p className="pb-10 text-center text-lg opacity-50">{t('top-categories-subtitle')}</p>

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
                            {isNetworkError ? t('categories-network-error-message') : t('categories-general-error-message')}
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
                        <div className="text-xs text-muted-foreground">
                            <p>{t('network-help')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopCategoryError;
