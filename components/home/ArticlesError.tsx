'use client';

import { AlertCircle, RefreshCw, Wifi } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '../DynamicIcon';
import type { BlogsApiError } from '@/lib/types/blog';

interface ArticlesErrorProps {
    error?: BlogsApiError | Error | null;
    onRetry?: () => void;
}

function ArticlesError({ error, onRetry }: ArticlesErrorProps) {
    const t = useTranslations('HomePage');

    const isNetworkError = error?.message?.includes('Network') ||
        error?.message?.includes('timeout') ||
        error?.message?.includes('fetch');

    const errorTitle = isNetworkError
        ? t('errors.network-error-title') || 'Connection Problem'
        : t('errors.general-error-title') || 'Something went wrong';

    const errorMessage = isNetworkError
        ? t('errors.network-error-message') || 'Unable to load articles. Please check your internet connection and try again.'
        : t('errors.general-error-message') || 'We couldn\'t load the articles at this time. Please try again in a moment.';

    return (
        <div className="pb-15 overflow-visible">
            {/* Header */}
            <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
                <DynamicIcon
                    src="/assets/home/article.svg"
                    alt="celebrate"
                    width={60}
                />
                <h2 className="text-primary-identity text-3xl font-bold">
                    {t('radicals')}
                </h2>
            </div>

            {/* Error Content */}
            <div className="max-w-md mx-auto text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    {isNetworkError ? (
                        <Wifi className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    ) : (
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    )}

                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                        {errorTitle}
                    </h3>

                    <p className="text-red-600 mb-4">
                        {errorMessage}
                    </p>

                    {isNetworkError && (
                        <p className="text-sm text-red-500 mb-4">
                            {t('errors.network-help') || 'Please ensure you have a stable internet connection.'}
                        </p>
                    )}

                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            className="inline-flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                            {t('errors.retry-button') || 'Try Again'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ArticlesError;
