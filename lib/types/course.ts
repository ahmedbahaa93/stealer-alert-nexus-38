export interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  currency: string;
  discount_applied: boolean;
  discount_percentage?: number;
  category: string;
  subCategory: string;
  duration: number;
  course_type: string | string[];
  content: string[];
  framework: string;
  is_active: boolean;
  start_dates: StartDate[];
  location?: {
    country: string;
    city: string;
    address: string;
  };
}

export interface StartDate {
  date: string;
  available_slots: number;
}

export interface CoursesResponse {
  status: string;
  code: number;
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    next?: number;
  };
  data: {
    courses: Course[];
  };
}

export interface CourseApiError {
  message: string;
  status?: number;
}
