import axios from 'axios';
import type {
  BlogsResponse,
  BlogDetailResponse,
  BlogsApiError
} from '@/lib/types/blog';

const API_BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1';

const blogsApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add language header
blogsApi.interceptors.request.use((config) => {
  // Get current locale from URL or localStorage
  const locale = window.location.pathname.split('/')[1] || 'en';
  if (locale === 'ar') {
    config.headers['Accept-Language'] = 'ar';
  }
  return config;
});

// Response interceptor for error handling
blogsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: BlogsApiError = {
      status: 'error',
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      errors: error.response?.data?.errors || []
    };
    return Promise.reject(apiError);
  }
);

export const fetchBlogs = async (): Promise<BlogsResponse> => {
  const response = await blogsApi.get<BlogsResponse>('/blogs');
  return response.data;
};

export const fetchBlogById = async (
  blogId: string
): Promise<BlogDetailResponse> => {
  const response = await blogsApi.get<BlogDetailResponse>(`/blogs/${blogId}`);
  return response.data;
};

export default blogsApi;
