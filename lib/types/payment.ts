export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

export interface CoursePaymentInfo {
  courseId: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  discount?: number;
  discountPercentage?: number;
  image?: string;
  duration?: number;
  startDates?: CourseStartDate[];
}

export interface CourseStartDate {
  date: string;
  available_slots: number;
}

export interface PaymentFormData {
  // Card details
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  country: string;

  // Payment options
  saveCard: boolean;
  agreeTerms: boolean;

  // Course selection
  startDate: string;

  // Method selection
  paymentMethod: 'stripe' | 'paymob';
}

export interface PaymentState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export interface PaymentResponse {
  status: string;
  code: number;
  message?: string;
  data?: {
    paymentUrl?: string;
    sessionId?: string;
    orderId?: string;
  };
  redirectUrl?: string;
}

export interface CountryOption {
  value: string;
  label: string;
  flag?: string;
}
