"use client";

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../lib/api/courses';
import { CourseDetailResponse } from '../lib/types/courseDetail';
import { useParams } from 'next/navigation';

export const COURSE_DETAIL_QUERY_KEYS = {
  all: ['courseDetail'] as const,
  detail: (id: string) => [...COURSE_DETAIL_QUERY_KEYS.all, id] as const
};

export interface UseCourseDetailOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  initialData?: CourseDetailResponse;
}

export const useCourseDetail = (
  courseId?: string, 
  options: UseCourseDetailOptions = {}
) => {
  const params = useParams();
  const id = courseId || (params?.id as string);

  return useQuery<CourseDetailResponse, Error>({
    queryKey: COURSE_DETAIL_QUERY_KEYS.detail(id),
    queryFn: () => courseApi.getCourseDetail(id) as Promise<CourseDetailResponse>,
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

export const useCourseDetailData = (courseId?: string) => {
  const { data, isLoading, isError, error, refetch, isSuccess, isPending } = useCourseDetail(courseId);
  
  const course = data?.data?.course;

  return {
    course,
    isLoading,
    isPending,
    isError,
    error,
    isSuccess,
    refetch
  };
};
