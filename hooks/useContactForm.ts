'use client';

import { useMutation } from '@tanstack/react-query';
import {
  submitContactForm,
  ContactFormData,
  ContactFormError
} from '@/lib/api/contact';

export interface UseContactFormOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ContactFormError) => void;
}

export const useContactForm = (options?: UseContactFormOptions) => {
  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => submitContactForm(data),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: ContactFormError) => {
      options?.onError?.(error);
    }
  });

  return {
    submitForm: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as ContactFormError | null,
    data: mutation.data,
    reset: mutation.reset
  };
};

export default useContactForm;
