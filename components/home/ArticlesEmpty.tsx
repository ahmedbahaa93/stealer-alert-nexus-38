'use client';

import { FileText, PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DynamicIcon } from '../DynamicIcon';

function ArticlesEmpty() {
    const t = useTranslations('HomePage');

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

            {/* Empty Content */}
            <div className="max-w-md mx-auto text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {t('empty.no-articles-title') || 'No Articles Yet'}
                    </h3>

                    <p className="text-gray-600 mb-6">
                        {t('empty.no-articles-message') || 'We\'re working on adding new articles. Check back soon for exciting content!'}
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <PlusCircle className="h-4 w-4" />
                        <span>
                            {t('empty.check-back-message') || 'New articles are added regularly.'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticlesEmpty;
