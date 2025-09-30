import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../lib/api/categories';
import { CategoriesResponse, Category } from '../lib/types/category';

export const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  list: () => [...CATEGORY_QUERY_KEYS.all, 'list'] as const
} as const;

export interface UseCategoriesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface CategoriesData {
  categories: Category[];
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  total: number;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  return useQuery<CategoriesResponse, Error, CategoriesData>({
    queryKey: CATEGORY_QUERY_KEYS.list(),
    queryFn: categoryApi.getCategories,
    enabled: options.enabled ?? true,
    staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 minutes
    gcTime: options.gcTime ?? 1000 * 60 * 10, // 10 minutes
    retry: (failureCount) => {
      // Retry up to 3 times with exponential backoff
      if (failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data: CategoriesResponse): CategoriesData => ({
      categories: data.data.categories,
      pagination: data.pagination,
      total: data.results
    })
  });
}

export function useCategoriesData() {
  const query = useCategories();

  return {
    categories: query.data?.categories || [],
    pagination: query.data?.pagination,
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch
  };
}
