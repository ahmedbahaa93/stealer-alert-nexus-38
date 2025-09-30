'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { courseApi } from '../lib/api/courses';
import { Promotion, PromotionsResponse } from '../lib/types/promotion';

export const PROMOTION_QUERY_KEYS = {
  all: ['promotions'] as const
};

export interface UsePromotionsOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface PromotionsData {
  promotions: Promotion[];
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  total: number;
}

export function usePromotions(options: UsePromotionsOptions = {}) {
  return useQuery<PromotionsResponse, Error, PromotionsData>({
    queryKey: PROMOTION_QUERY_KEYS.all,
    queryFn: courseApi.getPromotions,
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
    select: (data: PromotionsResponse): PromotionsData => ({
      promotions: data.data.promotions,
      pagination: data.pagination,
      total: data.results
    })
  });
}

export function usePromotionsData() {
  const query = usePromotions();

  // Get all courses from all promotions
  const promotionCourses = useMemo(() => {
    if (!query.data?.promotions) return [];

    return query.data.promotions.flatMap((promotion) =>
      promotion.courses.map((course) => ({
        ...course,
        discount_value: promotion.discount_value,
        promotion_id: promotion._id,
        expired_at: promotion.expired_at
      }))
    );
  }, [query.data?.promotions]);

  return {
    promotions: query.data?.promotions || [],
    promotionCourses,
    pagination: query.data?.pagination,
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch
  };
}
