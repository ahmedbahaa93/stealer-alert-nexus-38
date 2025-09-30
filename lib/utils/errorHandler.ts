/**
 * Enhanced error handling utility for authentication flows
 * Provides comprehensive error parsing and user-friendly toast messages
 */

export interface ToastInterface {
  // eslint-disable-next-line no-unused-vars
  success: (_title: string, _description?: string, _duration?: number) => void;
  // eslint-disable-next-line no-unused-vars
  error: (_title: string, _description?: string, _duration?: number) => void;
}

export interface ErrorHandlerOptions {
  onRetry?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  context?: 'signup' | 'login' | 'otp' | 'resend';
  customToast?: ToastInterface;
}

export interface ParsedError {
  type: string;
  message: string;
  originalError: string;
}

/**
 * Extracts error message from various error formats
 */
export function extractErrorMessage(error: any): string {
  if (error?.message) {
    return error.message;
  } else if (error?.data?.message) {
    return error.data.message;
  } else if (error?.response?.data?.message) {
    return error.response.data.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unexpected error occurred';
  }
}

/**
 * Parses error message and categorizes it
 */
export function parseError(error: any): ParsedError {
  const message = extractErrorMessage(error).toLowerCase();

  // Email-related errors
  if (
    message.includes('email') &&
    (message.includes('already') ||
      message.includes('exists') ||
      message.includes('in use') ||
      message.includes('registered'))
  ) {
    return {
      type: 'email_exists',
      message: 'This email is already registered',
      originalError: extractErrorMessage(error)
    };
  }

  // Credential errors
  if (
    message.includes('credential') ||
    message.includes('password') ||
    message.includes('incorrect') ||
    message.includes('invalid')
  ) {
    return {
      type: 'invalid_credentials',
      message: 'Invalid email or password',
      originalError: extractErrorMessage(error)
    };
  }

  // User not found
  if (
    message.includes('user not found') ||
    message.includes('account not found')
  ) {
    return {
      type: 'user_not_found',
      message: 'No account found with this email',
      originalError: extractErrorMessage(error)
    };
  }

  // OTP errors
  if (message.includes('otp') || message.includes('code')) {
    if (message.includes('invalid')) {
      return {
        type: 'invalid_otp',
        message: 'Invalid verification code',
        originalError: extractErrorMessage(error)
      };
    }
    if (message.includes('expired')) {
      return {
        type: 'expired_otp',
        message: 'Verification code has expired',
        originalError: extractErrorMessage(error)
      };
    }
  }

  // Network errors
  if (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('fetch') ||
    message.includes('timeout')
  ) {
    return {
      type: 'network_error',
      message: 'Connection problem',
      originalError: extractErrorMessage(error)
    };
  }

  // Server errors
  if (
    message.includes('server') ||
    message.includes('500') ||
    message.includes('503')
  ) {
    return {
      type: 'server_error',
      message: 'Server is experiencing issues',
      originalError: extractErrorMessage(error)
    };
  }

  // Rate limiting
  if (message.includes('too many') || message.includes('rate limit')) {
    return {
      type: 'rate_limit',
      message: 'Too many attempts',
      originalError: extractErrorMessage(error)
    };
  }

  // Generic error
  return {
    type: 'generic',
    message: extractErrorMessage(error),
    originalError: extractErrorMessage(error)
  };
}

/**
 * Shows appropriate toast message based on error type and context
 */
export function showErrorToast(error: any, options: ErrorHandlerOptions = {}) {
  const {
    // eslint-disable-next-line no-unused-vars
    onRetry: _onRetry,
    // eslint-disable-next-line no-unused-vars
    onNavigateToLogin: _onNavigateToLogin,
    // eslint-disable-next-line no-unused-vars
    onNavigateToSignup: _onNavigateToSignup,
    context = 'generic',
    customToast
  } = options;

  if (!customToast) {
    console.error('CustomToast not provided to showErrorToast');
    return;
  }

  const parsedError = parseError(error);

  console.error(`${context.toUpperCase()} Error:`, parsedError.originalError);

  switch (parsedError.type) {
    case 'email_exists':
      customToast.error(
        '📧 Email Already Taken',
        'This email is already registered. Please use a different email or try logging in.',
        6000
      );
      break;

    case 'invalid_credentials':
      customToast.error(
        '🔐 Invalid Credentials',
        'The email or password you entered is incorrect. Please double-check and try again.',
        6000
      );
      break;

    case 'user_not_found':
      customToast.error(
        '👤 Account Not Found',
        'No account exists with this email address. Would you like to create one?',
        6000
      );
      break;

    case 'invalid_otp':
      customToast.error(
        '🔢 Invalid Code',
        'The verification code you entered is incorrect. Please check and try again.',
        6000
      );
      break;

    case 'expired_otp':
      customToast.error(
        '⏰ Code Expired',
        'Your verification code has expired. Please request a new one.',
        6000
      );
      break;

    case 'network_error':
      customToast.error(
        '🌐 Connection Problem',
        'Please check your internet connection and try again.',
        5000
      );
      break;

    case 'server_error':
      customToast.error(
        '🔧 Server Issue',
        'Our servers are experiencing issues. Please try again in a few moments.',
        6000
      );
      break;

    case 'rate_limit':
      customToast.error(
        '🚫 Too Many Attempts',
        'Please wait a few minutes before trying again.',
        8000
      );
      break;

    default:
      customToast.error(
        '❌ Something Went Wrong',
        parsedError.message ||
          'An unexpected error occurred. Please try again.',
        6000
      );
      break;
  }
}

/**
 * Shows success toast messages
 */
export function showSuccessToast(
  message: string,
  description?: string,
  duration = 5000,
  customToast?: ToastInterface
) {
  if (!customToast) {
    console.error('CustomToast not provided to showSuccessToast');
    return;
  }

  customToast.success(message, description, duration);
}
