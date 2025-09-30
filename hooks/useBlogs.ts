'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchBlogs, fetchBlogById } from '@/lib/api/blogs';
import type { BlogsApiError, Blog } from '@/lib/types/blog';

// Hook for fetching all blogs
export const useBlogs = (): UseQueryResult<Blog[], BlogsApiError> => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await fetchBlogs();
      return response.data.categories; // Note: API returns blogs in categories field
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Hook for fetching a single blog by ID
export const useBlogById = (
  blogId: string
): UseQueryResult<Blog, BlogsApiError> => {
  return useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const response = await fetchBlogById(blogId);
      return response.data.blog;
    },
    enabled: !!blogId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Export types for convenience
export type { Blog, BlogsApiError } from '@/lib/types/blog';
