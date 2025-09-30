export interface CourseCategory {
  _id: string;
  name: string;
  image: string;
}

export interface ContentDetail {
  title: string;
  content: string[];
}

export interface StartDate {
  date: string;
  available_slots: number;
}

export interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  discount_applied: boolean;
  discount_percentage: number;
  category: CourseCategory;
  subCategory: CourseCategory;
  booking_count: number;
  duration: number;
  course_type: string[] | string;
  content: string[];
  content_details: ContentDetail[];
  framework: string;
  is_active: boolean;
  initial_payment_percentage: number;
  start_dates: StartDate[];
  certificate_details: string;
  brochure?: string;
  vedio_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailResponse {
  status: string;
  code: number;
  data: {
    course: CourseDetail;
  };
}
