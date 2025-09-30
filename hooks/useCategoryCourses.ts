'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../lib/api/categories';
import { CoursesResponse } from '../lib/types/course';

export const CATEGORY_COURSES_QUERY_KEYS = {
  all: ['categoryCourses'] as const,
  bySubcategory: (subCategoryId: string, page: number = 1, limit: number = 8) =>
    [
      ...CATEGORY_COURSES_QUERY_KEYS.all,
      'subcategory',
      subCategoryId,
      'page',
      page,
      'limit',
      limit
    ] as const
};

export interface UseCategoryCoursesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  initialData?: CoursesResponse;
  page?: number;
  limit?: number;
}

/**
 * Hook to fetch courses by subcategory ID
 */
export const useCategoryCourses = (
  subCategoryId?: string,
  options: UseCategoryCoursesOptions = {}
) => {
  const { page = 1, limit = 8, ...restOptions } = options;

  return useQuery<CoursesResponse, Error>({
    queryKey: CATEGORY_COURSES_QUERY_KEYS.bySubcategory(
      subCategoryId || '',
      page,
      limit
    ),
    queryFn: () =>
      categoryApi.getCoursesBySubcategoryId(
        subCategoryId || '',
        page,
        limit
      ) as Promise<CoursesResponse>,
    enabled: !!subCategoryId && (restOptions.enabled ?? true),
    staleTime: restOptions.staleTime ?? 1000 * 60 * 5, // 5 minutes
    gcTime: restOptions.gcTime ?? 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry if we get a 404
      if (error instanceof Error && 'status' in error && error.status === 404) {
        return false;
      }
      // Retry up to 3 times with exponential backoff for other errors
      if (failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: restOptions.initialData
  });
};

/**
 * Simplified hook to get courses data for a specific subcategory
 */
export const useCategoryCoursesData = (
  subCategoryId?: string,
  page: number = 1,
  limit: number = 8
) => {
  const { data, isLoading, isError, error, refetch, isPending } =
    useCategoryCourses(subCategoryId, { page, limit });

  const courses = data?.data?.courses || [];
  const pagination = data?.pagination;

  return {
    courses,
    pagination,
    isLoading,
    isPending,
    isError,
    error,
    refetch,
    isEmpty: courses.length === 0 && !isLoading && !isError
  };
};
