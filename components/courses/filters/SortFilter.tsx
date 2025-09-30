'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useClientFilters } from '@/context/ClientFilterProvider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

function SortFilter() {
    const t = useTranslations('course-page.filters');
    const { filters, setFilter } = useClientFilters();

    const sortOptions = [
        { value: '', label: t('sort.default') },
        { value: 'price_asc', label: t('sort.price-low') },
        { value: 'price_desc', label: t('sort.price-high') },
        { value: 'title_asc', label: t('sort.title-az') },
        { value: 'title_desc', label: t('sort.title-za') },
        { value: 'duration_asc', label: t('sort.duration-short') },
        { value: 'duration_desc', label: t('sort.duration-long') },
    ];

    const currentSort = filters.sort || '';
    const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || t('sort.default');

    const handleSortChange = (sortValue: string) => {
        setFilter('sort', sortValue || undefined);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                    <span className="text-sm">{t('sort.label')}: {currentSortLabel}</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                {sortOptions.map((option, index) => (
                    <React.Fragment key={option.value}>
                        {index === 1 && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            onClick={() => handleSortChange(option.value)}
                            className={`cursor-pointer text-sm ${currentSort === option.value
                                ? 'bg-[#0f43b4]/10 text-[#0f43b4] font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {option.label}
                        </DropdownMenuItem>
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SortFilter;
