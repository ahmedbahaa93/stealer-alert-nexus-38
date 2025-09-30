"use client";

import { useQuery } from '@tanstack/react-query';
import { categoryApi, SubCategoriesResponse } from '../lib/api/categories';
import { useParams } from 'next/navigation';

export const SUBCATEGORIES_QUERY_KEYS = {
  all: ['subcategories'] as const,
  byCategory: (categoryId: string) => [...SUBCATEGORIES_QUERY_KEYS.all, 'category', categoryId] as const,
};

export interface UseSubCategoriesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  initialData?: SubCategoriesResponse;
}

/**
 * Hook to fetch subcategories by category ID
 */
export const useSubCategories = (
  categoryId?: string, 
  options: UseSubCategoriesOptions = {}
) => {
  const params = useParams();
  const id = categoryId || (params?.id as string);

  return useQuery<SubCategoriesResponse, Error>({
    queryKey: SUBCATEGORIES_QUERY_KEYS.byCategory(id),
    queryFn: () => categoryApi.getSubcategoriesByCategoryId(id),
    enabled: !!id && (options.enabled ?? true),
    staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 minutes
    gcTime: options.gcTime ?? 1000 * 60 * 30, // 30 minutes
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
    initialData: options.initialData,
  });
};

/**
 * Simplified hook to get subcategories data
 */
export const useSubCategoriesData = (categoryId?: string) => {
  const { data, isLoading, isError, error, refetch, isPending } = useSubCategories(categoryId);
  
  const subCategories = data?.data?.subCategories || [];

  return {
    subCategories,
    isLoading,
    isPending,
    isError,
    error,
    refetch,
    isEmpty: subCategories.length === 0 && !isLoading && !isError,
  };
};
