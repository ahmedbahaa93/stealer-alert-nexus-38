'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useClientFilters } from '@/context/ClientFilterProvider';

function MultiSelectCourseTypeFilter() {
    const t = useTranslations('course-page.filters');
    const { filters, setFilter } = useClientFilters();

    // Get current selected course types as an array
    const selectedTypes = Array.isArray(filters.course_type)
        ? filters.course_type
        : filters.course_type
            ? [filters.course_type]
            : [];

    const courseTypeOptions = t.raw('state.options').filter((option: any) => option.href !== 'all');

    const handleCourseTypeChange = (typeValue: string, checked: boolean) => {
        let newSelectedTypes = [...selectedTypes];

        if (checked) {
            // Add the type if not already selected
            if (!newSelectedTypes.includes(typeValue)) {
                newSelectedTypes.push(typeValue);
            }
        } else {
            // Remove the type if it's selected
            newSelectedTypes = newSelectedTypes.filter(type => type !== typeValue);
        }

        // Update the filter
        if (newSelectedTypes.length === 0) {
            setFilter('course_type', undefined);
        } else if (newSelectedTypes.length === 1) {
            setFilter('course_type', newSelectedTypes[0]);
        } else {
            setFilter('course_type', newSelectedTypes);
        }
    };

    const formatTypeValue = (href: string): string => {
        return href.charAt(0).toUpperCase() + href.slice(1);
    };

    const isTypeSelected = (href: string): boolean => {
        // Check against both raw href and formatted value for compatibility
        return selectedTypes.includes(href) || selectedTypes.includes(formatTypeValue(href));
    };

    return (
        <div className="flex flex-col space-y-2">
            {courseTypeOptions.map((option: any) => {
                const formattedValue = formatTypeValue(option.href);
                const isActive = isTypeSelected(option.href);

                return (
                    <div
                        key={option.href}
                        className={`flex items-center p-3 border-l-2 transition-colors duration-200 group
              ${isActive
                                ? 'border-l-[#0f43b4] bg-[#0f43b4]/10'
                                : 'border-transparent hover:border-l-[#0f43b4] hover:bg-[#0f43b4]/5'
                            }`}
                    >
                        <Checkbox
                            id={`course-type-${option.href}`}
                            checked={isActive}
                            onCheckedChange={(checked) =>
                                handleCourseTypeChange(formattedValue, checked as boolean)
                            }
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
                            htmlFor={`course-type-${option.href}`}
                        >
                            {option.text}
                        </Label>
                    </div>
                );
            })}
        </div>
    );
}

export default MultiSelectCourseTypeFilter;
