export interface BlogAuthor {
  userId: string;
  name: string;
}

export interface Blog {
  _id: string;
  author: BlogAuthor;
  title: string;
  content: string;
  images: string[];
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogsResponse {
  status: string;
  code: number;
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: {
    categories: Blog[];
  };
}

export interface BlogDetailResponse {
  status: string;
  code: number;
  message: string;
  data: {
    blog: Blog;
  };
}

export interface BlogsApiError {
  status: string;
  code: number;
  message: string;
  errors?: string[];
}
