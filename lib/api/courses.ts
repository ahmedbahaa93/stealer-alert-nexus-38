import { CoursesResponse } from '../types/course';
import { PromotionsResponse } from '../types/promotion';
import { API_URLS, buildCoursesURL, CourseFilters } from './config';
import { getLocationHeaders } from './locationHeaders';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getLocationHeaders(),
        cache: 'no-store' // Let React Query handle caching
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        0
      );
    }
  },

  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getLocationHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        0
      );
    }
  }
};

export const courseApi = {
  async getDiscountedCourses(): Promise<CoursesResponse> {
    return apiClient.get<CoursesResponse>(API_URLS.DISCOUNTED_COURSES);
  },

  async getCourses(): Promise<CoursesResponse> {
    return apiClient.get<CoursesResponse>(API_URLS.COURSES);
  },

  async getCoursesWithFilters(
    filters: CourseFilters = {}
  ): Promise<CoursesResponse> {
    const url = buildCoursesURL(filters);
    return apiClient.get<CoursesResponse>(url);
  },

  async getCourseDetail(id: string) {
    return apiClient.get(API_URLS.COURSE_DETAIL(id));
  },

  async getPromotions(): Promise<PromotionsResponse> {
    return apiClient.get<PromotionsResponse>(API_URLS.PROMOTIONS);
  }
};
