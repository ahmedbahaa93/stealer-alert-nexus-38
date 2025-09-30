'use client';

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/lib/api/courses';
import { CourseDetailResponse } from '@/lib/types/courseDetail';
import { CoursePaymentInfo } from '@/lib/types/payment';

export const usePaymentCourseData = (courseId: string) => {
  return useQuery<CourseDetailResponse, Error, CoursePaymentInfo>({
    queryKey: ['paymentCourse', courseId],
    queryFn: () =>
      courseApi.getCourseDetail(courseId) as Promise<CourseDetailResponse>,
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    select: (data: CourseDetailResponse): CoursePaymentInfo => {
      const course = data.data.course;
      return {
        courseId: course._id,
        title: course.title,
        price: course.price,
        currency: course.currency,
        discount: course.discount_percentage
          ? (course.price * course.discount_percentage) / 100
          : undefined,
        discountPercentage: course.discount_percentage,
        image: course.image,
        duration: course.duration,
        startDates: course.start_dates
      };
    },
    retry: (failureCount, error) => {
      // Don't retry if we get a 404
      if (
        error instanceof Error &&
        'status' in error &&
        (error as any).status === 404
      ) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};
