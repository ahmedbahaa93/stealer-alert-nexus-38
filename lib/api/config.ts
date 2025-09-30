// TypeScript interfaces for API filters
export interface CourseFilters {
  limit?: number;
  page?: number;
  sort?: string | string[];
  course_type?: string | string[];
  'price[gte]'?: number;
  'price[gt]'?: number;
  'price[lte]'?: number;
  'price[lt]'?: number;
  keyword?: string;
  discount_applied?: boolean;
  category?: string;
  subCategory?: string;
  available_slots?: number;
  duration?: number;
  instructor?: string;
  level?: string;
  language?: string;
}

// External API configuration (for reference)
export const EXTERNAL_API_CONFIG = {
  BASE_URL: 'https://booking-courses-gilt.vercel.app/api/v1',
  ENDPOINTS: {
    COURSES: '/courses',
    CATEGORIES: '/categories',
    REVIEWS: '/webReviews/public',
    COURSE_DETAIL: (id: string) => `/courses/${id}`,
    PAYMENT: {
      STRIPE_CHECKOUT: '/checkouts/stripe/bookCourse',
      PAYMOB_CHECKOUT: '/checkouts/paymob/courses'
    }
  },
  QUERY_PARAMS: {
    DISCOUNT_APPLIED: 'discount_applied=true'
  }
} as const;

// Proxy API configuration (use this for client-side requests)
export const API_CONFIG = {
  BASE_URL: '/api/proxy', // Use local proxy API route
  ENDPOINTS: {
    COURSES: '?path=/courses',
    CATEGORIES: '?path=/categories',
    REVIEWS: '?path=/webReviews/public',
    PROMOTIONS: '?path=/promotions',
    COURSE_DETAIL: (id: string) => `?path=/courses/${id}`,
    PAYMENT: {
      STRIPE_CHECKOUT: '?path=/checkouts/stripe/bookCourse',
      PAYMOB_CHECKOUT: '?path=/checkouts/paymob/courses'
    }
  },
  QUERY_PARAMS: {
    DISCOUNT_APPLIED: 'discount_applied=true'
  }
} as const;

export const API_URLS = {
  BASE_URL: API_CONFIG.BASE_URL,
  DISCOUNTED_COURSES: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COURSES}&${API_CONFIG.QUERY_PARAMS.DISCOUNT_APPLIED}`,
  COURSES: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COURSES}`,
  CATEGORIES: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`,
  PROMOTIONS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROMOTIONS}`,
  COURSE_DETAIL: (id: string) =>
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COURSE_DETAIL(id)}`,
  PAYMENT: {
    STRIPE_CHECKOUT: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT.STRIPE_CHECKOUT}`,
    PAYMOB_CHECKOUT: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENT.PAYMOB_CHECKOUT}`
  }
} as const;

/**
 * Build the URL for courses with filters
 * @param filters - The filters to apply to the courses request
 * @returns The URL with filters applied
 */
export function buildCoursesURL(filters: CourseFilters): string {
  // Start with the base URL and path
  const params = new URLSearchParams({ path: '/courses' });

  // Add all filters as query parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    }
  });

  return `${API_CONFIG.BASE_URL}?${params.toString()}`;
}
