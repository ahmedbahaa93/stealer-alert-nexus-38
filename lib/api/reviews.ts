import { ReviewsResponse } from '../types/review';
import { API_CONFIG } from './config';

export const getReviews = async (): Promise<ReviewsResponse> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVIEWS}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
