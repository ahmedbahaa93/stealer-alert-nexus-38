import { CategoriesResponse } from '../types/category';
import { API_URLS } from './config';

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
        headers: {
          'Content-Type': 'application/json'
        },
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
  }
};

export interface SubCategory {
  _id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoriesResponse {
  status: string;
  code: number;
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    next?: number;
  };
  message: string;
  data: {
    subCategories: SubCategory[];
  };
}

export const categoryApi = {
  async getCategories(): Promise<CategoriesResponse> {
    return apiClient.get<CategoriesResponse>(API_URLS.CATEGORIES);
  },

  /**
   * Get subcategories by category ID
   * @param categoryId - The category ID to fetch subcategories for
   * @returns A promise that resolves to the subcategories response
   */
  async getSubcategoriesByCategoryId(
    categoryId: string
  ): Promise<SubCategoriesResponse> {
    return apiClient.get<SubCategoriesResponse>(
      `${API_URLS.BASE_URL}?path=/subCategories/category/${categoryId}`
    );
  },

  /**
   * Get courses by subcategory ID
   * @param subCategoryId - The subcategory ID to fetch courses for
   * @param page - The page number (default: 1)
   * @param limit - The number of courses per page (default: 8)
   * @returns A promise that resolves to the courses response
   */
  async getCoursesBySubcategoryId(
    subCategoryId: string,
    page: number = 1,
    limit: number = 8
  ) {
    const params = new URLSearchParams({
      path: `/courses/subCategory/${subCategoryId}`,
      page: page.toString(),
      limit: limit.toString()
    });

    return apiClient.get(`${API_URLS.BASE_URL}?${params.toString()}`);
  }
};
