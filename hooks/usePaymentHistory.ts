'use client';

import { useQuery } from '@tanstack/react-query';
import { createUserApiClient, UserPayment } from '@/lib/api/user';
import { useAuthStore } from '@/lib/store/authStore';

// Create a dedicated client for user payments
const userApi = createUserApiClient();

/**
 * Query key factory for payment related queries
 */
export const paymentsKeys = {
  all: ['payments'] as const,
  list: () => [...paymentsKeys.all, 'list'] as const,
  details: (id: string) => [...paymentsKeys.all, 'details', id] as const
};

/**
 * Interface for the response from the payments endpoint
 */
interface PaymentsResponse {
  status: string;
  code: number;
  count: number;
  data: UserPayment[];
}

/**
 * Hook for fetching user payment history
 */
export const usePaymentHistory = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: paymentsKeys.list(),
    queryFn: async (): Promise<UserPayment[]> => {
      try {
        const response = await userApi.get<PaymentsResponse>('/payments');
        if (response.data && response.data.status === 'success') {
          return response.data.data;
        }
        return [];
      } catch (error: any) {
        console.error('Error fetching payment history:', error);
        throw new Error(
          error.response?.data?.message || 'Failed to fetch payment data'
        );
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
};

/**
 * Groups payments by month and year
 */
export const useGroupedPaymentHistory = () => {
  const {
    data: payments,
    isLoading,
    isError,
    error,
    refetch
  } = usePaymentHistory();

  const groupedPayments = payments ? groupPaymentsByMonth(payments) : {};

  return {
    groupedPayments,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * Helper function to group payments by month and year
 */
function groupPaymentsByMonth(payments: UserPayment[]) {
  const groups: Record<string, UserPayment[]> = {};
  const currentDate = new Date();
  const currentMonthYear = `${currentDate.toLocaleString('en', { month: 'long' })},${currentDate.getFullYear()}`;

  payments.forEach((payment) => {
    if (!payment.createdAt) {
      // If no createdAt date, put in current month group
      if (!groups[currentMonthYear]) {
        groups[currentMonthYear] = [];
      }
      groups[currentMonthYear].push(payment);
      return;
    }

    const date = new Date(payment.createdAt);
    const monthYear = `${date.toLocaleString('en', { month: 'long' })},${date.getFullYear()}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(payment);
  });

  return groups;
}
