'use client';

import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { CourseFilters } from '@/lib/api/config';

export function useCourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current filters from URL
  const filters = useMemo((): CourseFilters => {
    const params: CourseFilters = {};

    // Pagination - set defaults
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    params.page = page ? parseInt(page, 10) : 1;
    params.limit = limit ? parseInt(limit, 10) : 12;

    // Sorting
    const sort = searchParams.getAll('sort');
    if (sort.length > 0) {
      params.sort = sort.length === 1 ? sort[0] : sort;
    }

    // Course type
    const courseType = searchParams.get('course_type');
    if (courseType) params.course_type = courseType;

    // Price filters
    const priceGte = searchParams.get('price[gte]');
    const priceGt = searchParams.get('price[gt]');
    const priceLte = searchParams.get('price[lte]');
    const priceLt = searchParams.get('price[lt]');
    if (priceGte) params['price[gte]'] = parseFloat(priceGte);
    if (priceGt) params['price[gt]'] = parseFloat(priceGt);
    if (priceLte) params['price[lte]'] = parseFloat(priceLte);
    if (priceLt) params['price[lt]'] = parseFloat(priceLt);

    // Search keyword
    const keyword = searchParams.get('keyword') || searchParams.get('search');
    if (keyword) params.keyword = keyword;

    // Discount applied
    const discountApplied = searchParams.get('discount_applied');
    if (discountApplied) params.discount_applied = discountApplied === 'true';

    // Category and subcategory
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;

    // Additional filters
    const availableSlots = searchParams.get('available_slots');
    const duration = searchParams.get('duration');
    const instructor = searchParams.get('instructor');
    const level = searchParams.get('level');
    const language = searchParams.get('language');

    if (availableSlots) params.available_slots = parseInt(availableSlots, 10);
    if (duration) params.duration = parseInt(duration, 10);
    if (instructor) params.instructor = instructor;
    if (level) params.level = level;
    if (language) params.language = language;

    return params;
  }, [searchParams]);

  // Helper to update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<CourseFilters>) => {
      const params = new URLSearchParams();

      // Merge current filters with new ones
      const mergedFilters = { ...filters, ...newFilters };

      // Build new URL params
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
          } else {
            params.set(key, String(value));
          }
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [filters, router]
  );

  // Set page number
  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  // Set search keyword
  const setKeyword = useCallback(
    (keyword: string) => {
      // Reset to page 1 when searching
      updateFilters({ keyword: keyword || undefined, page: 1 });
    },
    [updateFilters]
  );

  // Set sort option
  const setSort = useCallback(
    (sort: string | string[]) => {
      updateFilters({ sort, page: 1 });
    },
    [updateFilters]
  );

  // Set course type
  const setCourseType = useCallback(
    (courseType: string) => {
      updateFilters({ course_type: courseType || undefined, page: 1 });
    },
    [updateFilters]
  );

  // Set category
  const setCategory = useCallback(
    (category: string | undefined) => {
      updateFilters({ category: category || undefined, page: 1 });
    },
    [updateFilters]
  );

  // Set price range
  const setPriceRange = useCallback(
    (min?: number, max?: number) => {
      const priceFilters: Partial<CourseFilters> = { page: 1 };

      if (min !== undefined) {
        priceFilters['price[gte]'] = min;
      }
      if (max !== undefined) {
        priceFilters['price[lte]'] = max;
      }

      updateFilters(priceFilters);
    },
    [updateFilters]
  );

  // Set discount filter
  const setDiscountApplied = useCallback(
    (discountApplied: boolean) => {
      updateFilters({ discount_applied: discountApplied, page: 1 });
    },
    [updateFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push('/courses', { scroll: false });
  }, [router]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    const filterKeys = Object.keys(filters);
    return (
      filterKeys.length > 0 &&
      !filterKeys.every((key) => key === 'page' || key === 'limit')
    );
  }, [filters]);

  return {
    filters,
    setPage,
    setKeyword,
    setSort,
    setCourseType,
    setCategory,
    setPriceRange,
    setDiscountApplied,
    clearFilters,
    hasActiveFilters,
    updateFilters
  };
}
