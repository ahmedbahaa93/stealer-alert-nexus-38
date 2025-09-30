import { apiClient } from './courses';
import { API_URLS } from './config';

export interface PaymentStripeRequest {
  courseId: string;
  start_date: string;
}

export interface PaymentPaymobRequest {
  courseId: string;
  start_date: string;
}

export interface PaymentResponse {
  status: string;
  code: number;
  message?: string;
  data?: any;
  redirectUrl?: string;
}

class PaymentAPI {
  async stripeCheckout(data: PaymentStripeRequest): Promise<PaymentResponse> {
    return apiClient.post<PaymentResponse>(
      API_URLS.PAYMENT.STRIPE_CHECKOUT,
      data
    );
  }

  async paymobCheckout(data: PaymentPaymobRequest): Promise<PaymentResponse> {
    return apiClient.post<PaymentResponse>(
      API_URLS.PAYMENT.PAYMOB_CHECKOUT,
      data
    );
  }
}

export const paymentApi = new PaymentAPI();
