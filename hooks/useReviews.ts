import { useQuery } from '@tanstack/react-query';
import { getReviews } from '@/lib/api/reviews';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};
