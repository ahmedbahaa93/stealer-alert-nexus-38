'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CourseFilters } from '@/lib/api/config';

interface ClientFiltersContextType {
    filters: CourseFilters;
    // eslint-disable-next-line no-unused-vars
    setFilter: (key: keyof CourseFilters, value: any) => void;
    // eslint-disable-next-line no-unused-vars
    setPriceRange: (min?: number, max?: number) => void;
    // eslint-disable-next-line no-unused-vars
    toggleMultiSelectFilter: (key: keyof CourseFilters, value: string) => void;
    clearFilters: () => void;
    // eslint-disable-next-line no-unused-vars
    isFilterActive: (key: keyof CourseFilters, value: any) => boolean;
    hasActiveFilters: boolean;
    getActiveFiltersCount: () => number;
}

const ClientFiltersContext = createContext<ClientFiltersContextType | undefined>(undefined);

interface ClientFiltersProviderProps {
    children: ReactNode;
    defaultFilters?: CourseFilters;
}

export function ClientFiltersProvider({ children, defaultFilters = {} }: ClientFiltersProviderProps) {
    const [filters, setFilters] = useState<CourseFilters>({
        page: 1,
        limit: 12,
        ...defaultFilters
    });

    const setFilter = useCallback((key: keyof CourseFilters, value: any) => {
        setFilters(prev => {
            // Create a new filters object
            const newFilters = { ...prev };

            // If the value is undefined, null, or empty string, remove the filter
            if (value === undefined || value === null || value === '') {
                delete newFilters[key];
                return { ...newFilters, page: 1 }; // Reset to page 1 when removing filters
            }

            // For string values, ensure they're trimmed
            const processedValue = typeof value === 'string' ? value.trim() : value;

            // If after trimming it's empty, remove the filter
            if (processedValue === '') {
                delete newFilters[key];
                return { ...newFilters, page: 1 };
            }

            // Special handling for page and limit to not reset page
            if (key === 'page' || key === 'limit') {
                return {
                    ...newFilters,
                    [key]: processedValue
                };
            }

            // Otherwise, set the filter with the processed value and reset page
            return {
                ...newFilters,
                [key]: processedValue,
                page: 1  // Reset to page 1 when changing filters
            };
        });
    }, []);

    const setPriceRange = useCallback((min?: number, max?: number) => {
        setFilters(prev => {
            const newFilters = { ...prev };

            if (min !== undefined) {
                newFilters['price[gte]'] = min;
            } else {
                delete newFilters['price[gte]'];
            }

            if (max !== undefined) {
                newFilters['price[lte]'] = max;
            } else {
                delete newFilters['price[lte]'];
            }

            newFilters.page = 1; // Reset to page 1 when changing price range
            return newFilters;
        });
    }, []);

    const toggleMultiSelectFilter = useCallback((key: keyof CourseFilters, value: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            const currentValue = newFilters[key];

            if (Array.isArray(currentValue)) {
                // If current value is an array, toggle the value
                const index = currentValue.indexOf(value);
                if (index === -1) {
                    // Add the value
                    newFilters[key] = [...currentValue, value] as any;
                } else {
                    // Remove the value
                    const updatedArray = currentValue.filter(item => item !== value);
                    if (updatedArray.length === 0) {
                        delete newFilters[key];
                    } else {
                        newFilters[key] = updatedArray as any;
                    }
                }
            } else if (currentValue === value) {
                // If current value equals the toggle value, remove it
                delete newFilters[key];
            } else {
                // Set as new single value or start array
                newFilters[key] = value as any;
            }

            newFilters.page = 1; // Reset to page 1 when changing filters
            return newFilters;
        });
    }, []);

    const getActiveFiltersCount = useCallback(() => {
        return Object.keys(filters).filter(key =>
            key !== 'page' && key !== 'limit' && filters[key as keyof CourseFilters] !== undefined
        ).length;
    }, [filters]);

    const clearFilters = useCallback(() => {
        setFilters({
            page: 1,
            limit: 12
        });
    }, []);

    const isFilterActive = useCallback((key: keyof CourseFilters, value: any) => {
        // Handle different value types correctly
        if (value === undefined || value === null) {
            // Check if the filter doesn't exist or is set to undefined/null
            return !filters[key];
        }

        if (typeof value === 'string' && value === '') {
            // Empty string is treated as filter not being set
            return !filters[key];
        }

        // For numeric comparisons, use strict equality
        if (typeof value === 'number' && typeof filters[key] === 'number') {
            return filters[key] === value;
        }

        // For string comparisons, compare trimmed lowercase values
        if (typeof value === 'string' && typeof filters[key] === 'string') {
            return filters[key].toLowerCase().trim() === value.toLowerCase().trim();
        }

        // Default comparison
        return filters[key] === value;
    }, [filters]);

    // Determine if any filters are active (excluding pagination)
    const hasActiveFilters = Object.keys(filters).some(
        key => key !== 'page' && key !== 'limit'
    );

    const value = {
        filters,
        setFilter,
        setPriceRange,
        toggleMultiSelectFilter,
        clearFilters,
        isFilterActive,
        hasActiveFilters,
        getActiveFiltersCount
    };

    return (
        <ClientFiltersContext.Provider value={value}>
            {children}
        </ClientFiltersContext.Provider>
    );
}

export function useClientFilters() {
    const context = useContext(ClientFiltersContext);
    if (context === undefined) {
        throw new Error('useClientFilters must be used within a ClientFiltersProvider');
    }
    return context;
}
