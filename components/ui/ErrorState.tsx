'use client';

import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    title?: string;
}

export default function ErrorState({ message, onRetry, title }: ErrorStateProps) {
    const t = useTranslations('ErrorStates');
    const router = useRouter();

    const handleBrowseCourses = () => {
        router.push('/courses');
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-blue-50 rounded-full p-4 mb-4">
                <AlertCircle className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title || t('title')}
            </h3>
            <p className="text-gray-600 mb-4">
                {message || t('defaultMessage')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {t('retry')}
                    </button>
                )}
                <button
                    onClick={handleBrowseCourses}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                    {t('browseCourses')}
                </button>
            </div>
        </div>
    );
}
