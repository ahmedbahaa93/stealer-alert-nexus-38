import { useLocale } from 'next-intl';

export function useApiErrorHandler() {
  const locale = useLocale();

  const getErrorMessage = (
    error: Error | null,
    defaultMessage: string
  ): string => {
    if (!error) return defaultMessage;

    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('fetch') || message.includes('network')) {
      return locale === 'ar'
        ? 'غير قادر على الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.'
        : 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    // Server errors
    if (message.includes('500') || message.includes('server')) {
      return locale === 'ar'
        ? 'الخادم غير متاح مؤقتاً. يرجى المحاولة مرة أخرى خلال بضع دقائق.'
        : 'Server is temporarily unavailable. Please try again in a few moments.';
    }

    // Client errors
    if (message.includes('400') || message.includes('404')) {
      return locale === 'ar'
        ? 'الطلب غير صحيح. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.'
        : 'Bad request. Please refresh the page and try again.';
    }

    return defaultMessage;
  };

  return { getErrorMessage };
}

export function useDirection() {
  const locale = useLocale();
  return {
    direction: locale === 'ar' ? 'rtl' : 'ltr',
    isRtl: locale === 'ar',
    isLtr: locale !== 'ar'
  };
}
