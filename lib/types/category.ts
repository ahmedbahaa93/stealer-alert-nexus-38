export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  num_of_courses: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  status: string;
  code: number;
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  message: string;
  data: {
    categories: Category[];
  };
}

export interface CategoryApiError {
  message: string;
  status?: number;
}
