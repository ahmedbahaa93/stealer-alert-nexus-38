'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import type { BlogsApiError } from '@/lib/types/blog';

interface BlogErrorProps {
    error: BlogsApiError | Error | null;
    onRetry: () => void;
}

function BlogError({ error, onRetry }: BlogErrorProps) {
    const t = useTranslations('Blog.error');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const getErrorMessage = () => {
        if (!error) return t('unknown');

        if ('code' in error) {
            switch (error.code) {
                case 404:
                    return t('notFound') || 'Blog content not found';
                case 500:
                    return t('serverError') || 'Server error occurred';
                case 0:
                    return t('networkError') || 'Network connection failed';
                default:
                    return error.message || t('unknown');
            }
        }

        return error.message || t('unknown');
    };

    return (
        <div className="w-full bg-white py-8 sm:py-10 md:py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center py-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="text-center max-w-md mx-auto space-y-6">
                        {/* Error Icon */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <AlertCircle className="h-16 w-16 text-red-500" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Error Title */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('title') || 'Unable to Load Blog Content'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {getErrorMessage()}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={onRetry}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <RefreshCw className="w-4 h-4" />
                                {t('retry') || 'Try Again'}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2"
                            >
                                {t('refresh') || 'Refresh Page'}
                            </Button>
                        </div>

                        {/* Additional Info */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>{t('checkConnection') || 'Please check your internet connection and try again.'}</p>
                            {error && 'code' in error && (
                                <p className="font-mono">Error Code: {error.code}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogError;
