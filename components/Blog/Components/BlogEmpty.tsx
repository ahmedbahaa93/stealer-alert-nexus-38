'use client';

import { FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';

function BlogEmpty() {
    const t = useTranslations('Blog.empty');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    return (
        <div className="w-full bg-white py-8 sm:py-10 md:py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center py-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="text-center max-w-md mx-auto space-y-6">
                        {/* Empty State Icon */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <FileText className="h-16 w-16 text-gray-400" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <PlusCircle className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Empty State Content */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('title') || 'No Blog Posts Yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {t('message') || 'We\'re working on adding exciting blog content. Check back soon for insightful articles and updates!'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                {t('refresh') || 'Refresh Page'}
                            </Button>
                        </div>

                        {/* Additional Info */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>{t('checkBack') || 'New blog posts are added regularly.'}</p>
                            <p>{t('contact') || 'Follow us on social media for updates.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogEmpty;
