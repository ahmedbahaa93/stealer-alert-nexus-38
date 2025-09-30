'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCategoriesData } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientFilters } from '@/context/ClientFilterProvider';

function CategoryFilter() {
    const { categories, isLoading, isError } = useCategoriesData();
    const { filters, toggleMultiSelectFilter } = useClientFilters();

    const selectedCategories = Array.isArray(filters.category)
        ? filters.category
        : filters.category
            ? [filters.category]
            : [];

    const isCategorySelected = (categoryId: string) => {
        return selectedCategories.includes(categoryId);
    };

    const handleCategoryChange = (categoryId: string) => {
        toggleMultiSelectFilter('category', categoryId);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-2">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-sm text-muted-foreground p-2">
                Failed to load categories
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="text-sm text-muted-foreground p-2">
                No categories available
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {categories.map((category) => {
                const isActive = isCategorySelected(category._id);

                return (
                    <div
                        key={category._id}
                        className={`flex items-center p-3 border-l-2 transition-colors duration-200 group cursor-pointer
                            ${isActive
                                ? 'border-l-[#0f43b4] bg-[#0f43b4]/10'
                                : 'border-transparent hover:border-l-[#0f43b4] hover:bg-[#0f43b4]/5'
                            }`}
                    >
                        <Checkbox
                            id={`category-${category._id}`}
                            checked={isActive}
                            onCheckedChange={() => handleCategoryChange(category._id)}
                            className={`mr-2 cursor-pointer ${isActive
                                ? 'data-[state=checked]:bg-[#0f43b4] data-[state=checked]:text-white'
                                : ''}`}
                        />
                        <Label
                            className={`cursor-pointer text-md pt-1 flex-1 transition-colors duration-200
                                ${isActive
                                    ? 'text-[#0f43b4] font-medium'
                                    : 'group-hover:text-[#0f43b4]'
                                }`}
                            htmlFor={`category-${category._id}`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{category.name}</span>
                                <span className={`text-xs ${isActive
                                    ? 'text-[#0f43b4]/80'
                                    : 'text-muted-foreground group-hover:text-[#0f43b4]/70'
                                    }`}>
                                    ({category.num_of_courses})
                                </span>
                            </div>
                        </Label>
                    </div>
                );
            })}
        </div>
    );
}

export default CategoryFilter;
