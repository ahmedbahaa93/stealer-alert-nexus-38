'use client';

import { FileSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface EmptyStateProps {
    title?: string;
    message?: string;
    actionLink?: string;
    actionLabel?: string;
}

export default function EmptyState({ title, message, actionLink, actionLabel }: EmptyStateProps) {
    const t = useTranslations('EmptyStates');

    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileSearch className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title || t('title')}
            </h3>
            <p className="text-gray-600 mb-4">
                {message || t('defaultMessage')}
            </p>
            {actionLink && (
                <Link
                    href={actionLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    {actionLabel || t('action')}
                </Link>
            )}
        </div>
    );
}
