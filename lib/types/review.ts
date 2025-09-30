export interface Review {
  _id: string;
  user: string;
  fullName: string;
  jobTitle: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReviewsResponse {
  status: string;
  count: number;
  data: Review[];
}
