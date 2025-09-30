/**
 * Types for course enrollment system
 */

export interface EnrollmentData {
  courseId: string;
  startDate: string;
  course_type?: string;
  courseTitle?: string;
  coursePrice?: number;
  courseDuration?: number;
}

export interface PaymentProvider {
  id: 'stripe' | 'paymob';
  name: string;
  displayName: {
    en: string;
    ar: string;
  };
  icon?: string;
  description: {
    en: string;
    ar: string;
  };
  available: boolean;
}

export interface EnrollmentState {
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  success: boolean;
  selectedProvider: PaymentProvider['id'] | null;
  enrollmentData: EnrollmentData | null;
}

export interface CourseEnrollmentProps {
  courseId: string;
  startDates: Array<{
    date: string;
    available_slots: number;
  }>;
  courseTitle: string;
  coursePrice: number;
  courseDuration?: number;
  onSuccess?: () => void;
  // eslint-disable-next-line no-unused-vars
  onError?: (error: string) => void;
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: 'stripe',
    name: 'stripe',
    displayName: {
      en: 'Credit Card (Stripe)',
      ar: 'بطاقة ائتمان (سترايب)'
    },
    description: {
      en: 'Pay securely with your credit or debit card',
      ar: 'ادفع بأمان باستخدام بطاقة الائتمان أو الخصم الخاصة بك'
    },
    icon: '/assets/payment/stripe-icon.svg',
    available: true
  },
  {
    id: 'paymob',
    name: 'paymob',
    displayName: {
      en: 'Paymob',
      ar: 'باي موب'
    },
    description: {
      en: 'Pay using Paymob payment gateway',
      ar: 'ادفع باستخدام بوابة الدفع باي موب'
    },
    icon: '/assets/payment/paymob-icon.svg',
    available: true
  }
];
