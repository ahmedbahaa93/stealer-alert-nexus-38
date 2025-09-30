'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useClientFilters } from '@/context/ClientFilterProvider';
import { useCategoriesData } from '@/hooks/useCategories';

interface ActiveFiltersProps {
    className?: string;
}

function ActiveFilters({ className = '' }: ActiveFiltersProps) {
    const t = useTranslations('course-page.filters');
    const { filters, setFilter, clearFilters } = useClientFilters();
    const { categories } = useCategoriesData();

    // Create an array of active filters to display
    const activeFilters: Array<{
        key: string;
        subKey?: string;
        label: string;
        value: string | boolean;
    }> = [];

    // Course type filters - handle multiple selections
    if (filters.course_type) {
        const courseTypes = Array.isArray(filters.course_type)
            ? filters.course_type
            : [filters.course_type];

        courseTypes.forEach(courseType => {
            const courseTypeOption = t.raw('state.options').find(
                (option: any) => option.href === courseType?.toLowerCase()
            );
            activeFilters.push({
                key: 'course_type',
                subKey: courseType,
                label: courseTypeOption?.text || courseType,
                value: courseType
            });
        });
    }

    // Category filters - handle multiple selections
    if (filters.category) {
        const categoryIds = Array.isArray(filters.category)
            ? filters.category
            : [filters.category];

        categoryIds.forEach(categoryId => {
            const category = categories.find(cat => cat._id === categoryId);
            activeFilters.push({
                key: 'category',
                subKey: categoryId,
                label: category?.name || 'Category',
                value: categoryId
            });
        });
    }

    // Price range filters
    if (filters['price[gte]'] !== undefined || filters['price[lte]'] !== undefined) {
        const minPrice = filters['price[gte]'] || 0;
        const maxPrice = filters['price[lte]'] || '∞';
        activeFilters.push({
            key: 'price_range',
            label: `${minPrice} - ${maxPrice} EGP`,
            value: 'price_range'
        });
    }

    // Discount filter
    if (filters.discount_applied !== undefined) {
        activeFilters.push({
            key: 'discount_applied',
            label: filters.discount_applied ? 'Discounted' : 'Regular Price',
            value: filters.discount_applied
        });
    }

    // Keyword search
    if (filters.keyword) {
        activeFilters.push({
            key: 'keyword',
            label: `"${filters.keyword}"`,
            value: filters.keyword
        });
    }

    const removeFilter = (filterKey: string, subKey?: string) => {
        switch (filterKey) {
            case 'course_type':
                if (subKey) {
                    // Remove specific course type
                    const currentTypes = Array.isArray(filters.course_type)
                        ? filters.course_type
                        : [filters.course_type];
                    const updatedTypes = currentTypes.filter(type => type !== subKey);
                    if (updatedTypes.length === 0) {
                        setFilter('course_type', undefined);
                    } else if (updatedTypes.length === 1) {
                        setFilter('course_type', updatedTypes[0]);
                    } else {
                        setFilter('course_type', updatedTypes);
                    }
                } else {
                    setFilter('course_type', undefined);
                }
                break;
            case 'category':
                if (subKey) {
                    // Remove specific category
                    const currentCategories = Array.isArray(filters.category)
                        ? filters.category
                        : [filters.category];
                    const updatedCategories = currentCategories.filter(cat => cat !== subKey);
                    if (updatedCategories.length === 0) {
                        setFilter('category', undefined);
                    } else if (updatedCategories.length === 1) {
                        setFilter('category', updatedCategories[0]);
                    } else {
                        setFilter('category', updatedCategories);
                    }
                } else {
                    setFilter('category', undefined);
                }
                break;
            case 'price_range':
                setFilter('price[gte]', undefined);
                setFilter('price[lte]', undefined);
                break;
            case 'discount_applied':
                setFilter('discount_applied', undefined);
                break;
            case 'keyword':
                setFilter('keyword', undefined);
                break;
            default:
                break;
        }
    };

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <div className={`flex flex-wrap items-center gap-3 mb-6 ${className}`}>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Filters:
                </span>
                {activeFilters.map((filter, index) => (
                    <div
                        key={`${filter.key}-${filter.subKey || filter.value}-${index}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0f43b4]/10 border border-[#0f43b4]/20 rounded-full text-sm font-medium text-[#0f43b4] transition-all duration-200 hover:bg-[#0f43b4]/15"
                    >
                        <span>{filter.label}</span>
                        <button
                            onClick={() => removeFilter(filter.key, filter.subKey)}
                            className="flex items-center justify-center w-4 h-4 rounded-full bg-[#0f43b4]/20 hover:bg-[#0f43b4]/30 transition-colors duration-200"
                            aria-label={`Remove ${filter.label} filter`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>

            {activeFilters.length > 1 && (
                <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 hover:border-red-300 transition-all duration-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}

export default ActiveFilters;
