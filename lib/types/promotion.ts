export interface PromotionCourse {
  _id: string;
  title: string;
  image: string;
  description: string;
  price: number;
}

export interface Promotion {
  _id: string;
  courses: PromotionCourse[];
  discount_value: number;
  started_at: string;
  expired_at: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionsResponse {
  status: string;
  code: number;
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: {
    promotions: Promotion[];
  };
}
