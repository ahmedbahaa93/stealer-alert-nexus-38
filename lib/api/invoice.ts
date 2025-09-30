import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// API base URL for invoice-related endpoints
const API_BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1/user';

/**
 * Creates an axios instance for invoice API requests with auth token
 */
export const createInvoiceApiClient = () => {
  const accessToken = useAuthStore.getState().accessToken;

  const invoiceApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  });

  // Request interceptor for adding auth tokens
  invoiceApi.interceptors.request.use(
    (config) => {
      // Get the latest token for each request
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling global error responses
  invoiceApi.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common error scenarios
      if (error.code === 'ECONNABORTED') {
        error.isTimeout = true;
      }

      if (error.response?.status === 401) {
        error.isAuthError = true;
        // Handle unauthorized errors (potentially refresh token or logout)
        useAuthStore.getState().logout();
      }

      if (error.response?.status === 429) {
        error.isRateLimit = true;
      }

      return Promise.reject(error);
    }
  );

  return invoiceApi;
};

// Invoice API Response interfaces
export interface ApiResponse<T = any> {
  status: string;
  code: number;
  message: string;
  data?: T;
}

// User Info interface for invoice
export interface InvoiceUserInfo {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
}

// Course Info interface for invoice
export interface InvoiceCourseInfo {
  _id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
}

// Payment Info interface for invoice
export interface InvoicePaymentInfo {
  _id: string;
  selected_start_date: string;
  payment_status: string;
  payment_getway: string;
  initial_payment_amount: number;
  total_amount: number;
  createdAt: string;
}

// Complete Invoice Data interface
export interface InvoiceData {
  _id: string;
  userInfo: InvoiceUserInfo;
  courseInfo: InvoiceCourseInfo;
  paymentInfo: InvoicePaymentInfo;
}

// Invoice API response
export interface InvoiceResponse {
  invoice: InvoiceData;
}

/**
 * Generate invoice for a specific payment
 * @param paymentId - The payment ID to generate invoice for
 * @returns Promise with invoice data
 */
export const generateInvoice = async (
  paymentId: string
): Promise<ApiResponse<InvoiceResponse>> => {
  const invoiceApi = createInvoiceApiClient();

  try {
    const response = await invoiceApi.post(`/${paymentId}/invoice`);
    return response.data;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

/**
 * Get invoice by invoice ID (if different from payment ID)
 * @param invoiceId - The invoice ID
 * @returns Promise with invoice data
 */
export const getInvoiceById = async (
  invoiceId: string
): Promise<ApiResponse<InvoiceResponse>> => {
  const invoiceApi = createInvoiceApiClient();

  try {
    const response = await invoiceApi.get(`/invoice/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};
