'use client';

import { BookOpen, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';

interface CourseEmptyStateProps {
    hasFilters?: boolean;
    onClearFilters?: () => void;
    searchTerm?: string;
}

export default function CourseEmptyState({
    hasFilters = false,
    onClearFilters,
    searchTerm
}: CourseEmptyStateProps) {
    const t = useTranslations('course-page.empty');

    const isSearchResult = !!searchTerm;
    const icon = isSearchResult ? Search : BookOpen;
    const IconComponent = icon;

    return (
        <div className="col-span-2 mt-3 px-2 md:px-7">
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg p-8 text-center">
                <IconComponent className="text-muted-foreground mb-6 h-20 w-20" />

                <h3 className="text-primary-identity mb-2 text-xl font-semibold">
                    {isSearchResult ? t('search.title') : t('general.title')}
                </h3>

                <p className="text-muted-foreground mb-6 max-w-md">
                    {isSearchResult
                        ? t('search.message', { searchTerm })
                        : hasFilters
                            ? t('filtered.message')
                            : t('general.message')
                    }
                </p>

                {(hasFilters || isSearchResult) && onClearFilters && (
                    <Button
                        onClick={onClearFilters}
                        variant="outline"
                        className="border-primary-identity text-primary-identity hover:bg-primary-identity hover:text-white"
                    >
                        {isSearchResult ? t('search.clear') : t('filtered.clear')}
                    </Button>
                )}
            </div>
        </div>
    );
}
