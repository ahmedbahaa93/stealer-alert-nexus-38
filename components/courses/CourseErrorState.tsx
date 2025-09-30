'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';

interface CourseErrorStateProps {
    error?: Error | null;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export default function CourseErrorState({
    error,
    onRetry,
    isRetrying = false
}: CourseErrorStateProps) {
    const t = useTranslations('course-page.error');

    const isNetworkError = error?.message?.includes('fetch') ||
        error?.message?.includes('network') ||
        error?.message?.includes('Failed to');

    const errorMessage = isNetworkError
        ? t('network')
        : t('general');

    return (
        <div className="col-span-2 mt-3 px-2 md:px-7">
            <div className="bg-destructive/10 border-destructive/20 flex min-h-[400px] flex-col items-center justify-center rounded-lg border p-8 text-center">
                <AlertTriangle className="text-destructive mb-4 h-16 w-16" />

                <h3 className="text-destructive mb-2 text-xl font-semibold">
                    {t('title')}
                </h3>

                <p className="text-muted-foreground mb-6 max-w-md">
                    {errorMessage}
                </p>

                {onRetry && (
                    <Button
                        onClick={onRetry}
                        disabled={isRetrying}
                        variant="outline"
                        className="border-primary-identity text-primary-identity hover:bg-primary-identity hover:text-white"
                    >
                        {isRetrying ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                {t('retrying')}
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                {t('retry')}
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
