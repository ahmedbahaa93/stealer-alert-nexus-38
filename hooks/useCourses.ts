import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMemo } from 'react';
import { courseApi } from '../lib/api/courses';
import { CoursesResponse, Course } from '../lib/types/course';
import { CourseFilters } from '../lib/api/config';

export const COURSE_QUERY_KEYS = {
  all: ['courses'] as const,
  discounted: () => [...COURSE_QUERY_KEYS.all, 'discounted'] as const,
  regular: () => [...COURSE_QUERY_KEYS.all, 'regular'] as const,
  filtered: (filters: CourseFilters) =>
    [...COURSE_QUERY_KEYS.all, 'filtered', filters] as const
} as const;

export interface UseDiscountedCoursesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface UseCoursesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface UseFilteredCoursesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  keepPreviousData?: boolean;
}

export interface DiscountedCoursesData {
  courses: Course[];
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    next?: number;
  };
  total: number;
}

export interface CoursesData {
  courses: Course[];
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    next?: number;
  };
  total: number;
}

export function useDiscountedCourses(
  options: UseDiscountedCoursesOptions = {}
) {
  return useQuery<CoursesResponse, Error, DiscountedCoursesData>({
    queryKey: COURSE_QUERY_KEYS.discounted(),
    queryFn: courseApi.getDiscountedCourses,
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
    select: (data: CoursesResponse): DiscountedCoursesData => ({
      courses: data.data.courses,
      pagination: data.pagination,
      total: data.results
    })
  });
}

export function useDiscountedCoursesData() {
  const query = useDiscountedCourses();

  return {
    courses: query.data?.courses || [],
    pagination: query.data?.pagination,
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch
  };
}

export function useCourses(options: UseCoursesOptions = {}) {
  return useQuery<CoursesResponse, Error, CoursesData>({
    queryKey: COURSE_QUERY_KEYS.regular(),
    queryFn: courseApi.getCourses,
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
    select: (data: CoursesResponse): CoursesData => ({
      courses: data.data.courses,
      pagination: data.pagination,
      total: data.results
    })
  });
}

export function useCoursesData() {
  const query = useCourses();

  return {
    courses: query.data?.courses || [],
    pagination: query.data?.pagination,
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch
  };
}

// New hook for server-side filtered courses with API integration
export function useFilteredCourses(
  filters: CourseFilters = {},
  options: UseFilteredCoursesOptions = {}
) {
  return useQuery<CoursesResponse, Error, CoursesData>({
    queryKey: COURSE_QUERY_KEYS.filtered(filters),
    queryFn: () => courseApi.getCoursesWithFilters(filters),
    enabled: options.enabled ?? true,
    staleTime: options.staleTime ?? 1000 * 60 * 2, // 2 minutes for filtered results
    gcTime: options.gcTime ?? 1000 * 60 * 5, // 5 minutes
    placeholderData: options.keepPreviousData ? keepPreviousData : undefined,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408, 429
      if (error?.status >= 400 && error?.status < 500) {
        if (error?.status === 408 || error?.status === 429) {
          return failureCount < 2;
        }
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data: CoursesResponse): CoursesData => ({
      courses: data.data.courses,
      pagination: data.pagination,
      total: data.results
    })
  });
}

// Server-side filtered courses data hook - replaces client-side filtering
export function useFilteredCoursesData(filters: CourseFilters = {}) {
  const query = useFilteredCourses(filters, { keepPreviousData: true });

  return {
    courses: query.data?.courses || [],
    pagination: query.data?.pagination || {
      currentPage: 1,
      limit: 12,
      numberOfPages: 1
    },
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    isPlaceholderData: query.isPlaceholderData
  };
}

// Legacy client-side filtering hook (kept for backward compatibility)
export function useClientFilteredCoursesData(filters: CourseFilters = {}) {
  // Get all courses first
  const allCoursesQuery = useCourses();

  // Apply frontend filtering
  const filteredData = useMemo(() => {
    if (!allCoursesQuery.data?.courses) {
      return {
        courses: [],
        pagination: {
          currentPage: 1,
          limit: 12,
          numberOfPages: 1
        },
        total: 0
      };
    }

    let filteredCourses = [...allCoursesQuery.data.courses];

    // Apply keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(keyword) ||
          course.description?.toLowerCase().includes(keyword) ||
          course.framework?.toLowerCase().includes(keyword)
      );
    }

    // Apply course type filter - FIXED: Support multiple types per course AND multiple filter selections
    if (filters.course_type) {
      const selectedTypes = Array.isArray(filters.course_type)
        ? filters.course_type
        : [filters.course_type];

      filteredCourses = filteredCourses.filter((course) => {
        // Handle courses with multiple types
        if (Array.isArray(course.course_type)) {
          // Check if any of the course's types match any of the selected types
          return course.course_type.some((courseType) =>
            selectedTypes.some(
              (selectedType) =>
                courseType.toLowerCase() === selectedType.toLowerCase()
            )
          );
        } else {
          // Handle courses with single type
          const courseType = course.course_type;
          if (typeof courseType === 'string') {
            return selectedTypes.some(
              (selectedType) =>
                courseType.toLowerCase() === selectedType.toLowerCase()
            );
          }
          return false;
        }
      });
    }

    // Apply category filter - FIXED: Multiple categories support
    if (filters.category) {
      const selectedCategories = Array.isArray(filters.category)
        ? filters.category
        : [filters.category];

      filteredCourses = filteredCourses.filter((course) => {
        // Handle courses with multiple categories
        if (Array.isArray(course.category)) {
          return course.category.some((courseCategory) =>
            selectedCategories.includes(courseCategory)
          );
        } else {
          // Handle courses with single category
          return selectedCategories.includes(course.category);
        }
      });
    }

    // Apply price filters - FIXED: Proper number conversion and validation
    if (filters['price[gte]'] !== undefined && filters['price[gte]'] !== null) {
      const minPrice = Number(filters['price[gte]']);
      if (!isNaN(minPrice) && minPrice >= 0) {
        filteredCourses = filteredCourses.filter((course) => {
          const coursePrice = Number(course.price);
          return !isNaN(coursePrice) && coursePrice >= minPrice;
        });
      }
    }

    if (filters['price[lte]'] !== undefined && filters['price[lte]'] !== null) {
      const maxPrice = Number(filters['price[lte]']);
      if (!isNaN(maxPrice) && maxPrice >= 0) {
        filteredCourses = filteredCourses.filter((course) => {
          const coursePrice = Number(course.price);
          return !isNaN(coursePrice) && coursePrice <= maxPrice;
        });
      }
    }

    // Apply discount filter
    if (filters.discount_applied !== undefined) {
      filteredCourses = filteredCourses.filter(
        (course) => course.discount_applied === filters.discount_applied
      );
    }

    // Apply sorting if specified
    if (filters.sort) {
      const sortBy = Array.isArray(filters.sort)
        ? filters.sort[0]
        : filters.sort;

      switch (sortBy) {
        case 'price_asc':
        case 'price-low':
          filteredCourses.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case 'price_desc':
        case 'price-high':
          filteredCourses.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case 'title_asc':
        case 'title-az':
          filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title_desc':
        case 'title-za':
          filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'duration_asc':
        case 'duration-short':
          filteredCourses.sort(
            (a, b) => Number(a.duration) - Number(b.duration)
          );
          break;
        case 'duration_desc':
        case 'duration-long':
          filteredCourses.sort(
            (a, b) => Number(b.duration) - Number(a.duration)
          );
          break;
        default:
          // Default sorting by newest first (if courses have creation date)
          break;
      }
    }

    // Calculate pagination - FIXED: Always show pagination when there are courses
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 12;
    const total = filteredCourses.length;
    const numberOfPages = Math.max(1, Math.ceil(total / limit)); // Ensure at least 1 page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return {
      courses: paginatedCourses,
      pagination: {
        currentPage: page,
        limit,
        numberOfPages,
        next: page < numberOfPages ? page + 1 : undefined
      },
      total
    };
  }, [allCoursesQuery.data, filters]);

  return {
    courses: filteredData.courses,
    pagination: filteredData.pagination,
    total: filteredData.total,
    isLoading: allCoursesQuery.isLoading,
    isFetching: allCoursesQuery.isFetching,
    isError: allCoursesQuery.isError,
    error: allCoursesQuery.error,
    isSuccess: allCoursesQuery.isSuccess,
    refetch: allCoursesQuery.refetch,
    isPlaceholderData: false
  };
}
