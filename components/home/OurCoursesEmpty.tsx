'use client';

import { BookOpen, Search, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/DynamicIcon';

function OurCoursesEmpty() {
    const t = useTranslations('HomePage.empty');

    return (
        <div className="pb-15">
            {/* Header Section */}
            <div className="mx-auto mt-10 flex items-center justify-center space-x-3 pb-10">
                <DynamicIcon
                    src="/assets/home/book-lamb.svg"
                    alt="book-with-lamb"
                    width={60}
                    className="opacity-70"
                />
                <h2 className="text-primary-identity text-3xl font-bold opacity-70">
                    {t('our-courses-title')}
                </h2>
            </div>

            {/* Empty State Content */}
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center max-w-md mx-auto space-y-6">
                    {/* Empty State Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <BookOpen className="h-16 w-16 text-muted-foreground" />
                            <div className="absolute -top-1 -right-1 bg-muted rounded-full p-1">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Empty State Message */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                            {t('no-courses-title')}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {t('no-courses-message')}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="outline"
                            className="border-primary-identity hover:bg-primary-identity hover:text-primary-foreground"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            {t('browse-courses')}
                        </Button>

                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('request-course')}
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>{t('check-back-message')}</p>
                        <p>{t('contact-support')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OurCoursesEmpty;
