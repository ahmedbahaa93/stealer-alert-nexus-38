import React from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogErrorProps {
    error?: {
        message?: string;
        code?: number;
    };
    onRetry?: () => void;
}

export const BlogError: React.FC<BlogErrorProps> = ({ error, onRetry }) => {
    const t = useTranslations('blog.error');

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t('title')}
                </h3>

                <p className="text-gray-600 mb-6">
                    {error?.message || t('message')}
                </p>

                {onRetry && (
                    <Button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2"
                        variant="outline"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {t('retry')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export const BlogEmpty: React.FC = () => {
    const t = useTranslations('blog.empty');

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t('title')}
                </h3>

                <p className="text-gray-600">
                    {t('message')}
                </p>
            </div>
        </div>
    );
};
