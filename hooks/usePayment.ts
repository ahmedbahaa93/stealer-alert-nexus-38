'use client';

import { useMutation } from '@tanstack/react-query';
import {
  paymentApi,
  PaymentStripeRequest,
  PaymentPaymobRequest,
  PaymentResponse
} from '@/lib/api/payment';
import { PaymentFormData } from '@/lib/types/payment';

export interface UsePaymentOptions {
  onSuccess?: (data: PaymentResponse) => void;
  onError?: (error: Error) => void;
}

export const useStripePayment = (options: UsePaymentOptions = {}) => {
  return useMutation<PaymentResponse, Error, PaymentStripeRequest>({
    mutationFn: (data: PaymentStripeRequest) => paymentApi.stripeCheckout(data),
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
    }
  });
};

export const usePaymobPayment = (options: UsePaymentOptions = {}) => {
  return useMutation<PaymentResponse, Error, PaymentPaymobRequest>({
    mutationFn: (data: PaymentPaymobRequest) => paymentApi.paymobCheckout(data),
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
    }
  });
};

export const usePayment = (
  paymentMethod: 'stripe' | 'paymob',
  options: UsePaymentOptions = {}
) => {
  const stripeMutation = useStripePayment(options);
  const paymobMutation = usePaymobPayment(options);

  const mutation = paymentMethod === 'stripe' ? stripeMutation : paymobMutation;

  return {
    ...mutation,
    processPayment: (formData: PaymentFormData, courseId: string) => {
      const paymentData = {
        courseId,
        start_date: formData.startDate
      };

      return mutation.mutate(paymentData);
    }
  };
};
