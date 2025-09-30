import * as yup from 'yup';

// Card formatting functions
export const formatCardNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleanedValue = value.replace(/\D/g, '');

  // Limit to 19 digits
  const limitedValue = cleanedValue.slice(0, 19);

  // Add spaces every 4 digits
  return limitedValue.replace(/(.{4})/g, '$1 ').trim();
};

export const formatExpiryDate = (value: string): string => {
  // Remove all non-digit characters
  const cleanedValue = value.replace(/\D/g, '');

  // Format as MM/YY
  if (cleanedValue.length >= 2) {
    return cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2, 4);
  }

  return cleanedValue;
};

// Card number validation
export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove all non-digit characters
  const cleanedNumber = cardNumber.replace(/\D/g, '');

  // Check if it's a valid length (13-19 digits)
  if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
    return false;
  }

  // Luhn algorithm for card validation
  let sum = 0;
  let shouldDouble = false;

  // Loop through digits from right to left
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

// Detect card type from number
export const detectCardType = (cardNumber: string): string => {
  const cleanedNumber = cardNumber.replace(/\D/g, '');

  // Visa: starts with 4
  if (/^4/.test(cleanedNumber)) {
    return 'visa';
  }

  // Mastercard: starts with 5[1-5] or 2[2-7]
  if (/^5[1-5]/.test(cleanedNumber) || /^2[2-7]/.test(cleanedNumber)) {
    return 'mastercard';
  }

  // American Express: starts with 34 or 37
  if (/^3[47]/.test(cleanedNumber)) {
    return 'amex';
  }

  // Discover: starts with 6011, 622[1-9], 64[4-9], 65
  if (
    /^6011/.test(cleanedNumber) ||
    /^622[1-9]/.test(cleanedNumber) ||
    /^64[4-9]/.test(cleanedNumber) ||
    /^65/.test(cleanedNumber)
  ) {
    return 'discover';
  }

  // Default
  return 'unknown';
};

// Get card type icon
export const getCardTypeIcon = (cardType: string): string => {
  const icons = {
    visa: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    mastercard:
      'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    amex: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg',
    discover:
      'https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg',
    unknown:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHJ4PSIzIiBmaWxsPSIjNkI3MjgwIi8+CiAgPHJlY3QgeD0iOCIgeT0iMTAiIHdpZHRoPSIyNCIgaGVpZ2h0PSI0IiByeD0iMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICA8dGV4dCB4PSIyMCIgeT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q0FSRDU8L3RleHQ+Cjwvc3ZnPg=='
  };

  return icons[cardType as keyof typeof icons] || icons.unknown;
};

// Enhanced card validation schema
export const createPaymentSchema = (t: any) =>
  yup.object().shape({
    cardholderName: yup
      .string()
      .required(t('errors.cardholderName.required'))
      .min(2, t('errors.cardholderName.min'))
      .max(50, t('errors.cardholderName.max'))
      .matches(/^[a-zA-Z\s]+$/, t('errors.cardholderName.invalid')),

    cardNumber: yup
      .string()
      .required(t('errors.cardNumber.required'))
      .test('card-format', t('errors.cardNumber.invalid'), function (value) {
        if (!value) return false;
        // Remove spaces and dashes for validation
        const cleanedValue = value.replace(/[-\s]/g, '');
        return /^\d{13,19}$/.test(cleanedValue);
      })
      .test('card-luhn', t('errors.cardNumber.invalid'), function (value) {
        if (!value) return false;
        return validateCardNumber(value);
      }),

    expiryDate: yup
      .string()
      .required(t('errors.expiryDate.required'))
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, t('errors.expiryDate.invalid'))
      .test('not-expired', t('errors.expiryDate.expired'), function (value) {
        if (!value) return false;
        const [month, year] = value.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        return expiry > now;
      }),

    cvv: yup
      .string()
      .required(t('errors.cvv.required'))
      .matches(/^\d{3}$/, t('errors.cvv.invalid')),

    country: yup.string().required(t('errors.country.required')),

    agreeTerms: yup
      .boolean()
      .required()
      .oneOf([true], t('errors.agreeTerms.required')),

    saveCard: yup.boolean().required(),

    // Payment specific fields
    startDate: yup.string().required(t('errors.startDate.required')),

    paymentMethod: yup
      .string()
      .oneOf(['stripe', 'paymob'], t('errors.paymentMethod.invalid'))
      .required(t('errors.paymentMethod.required'))
  });

export type PaymentFormData = yup.InferType<
  ReturnType<typeof createPaymentSchema>
>;

// Validation utilities
export const isValidCardNumber = (cardNumber: string): boolean => {
  const num = cardNumber.replace(/\D/g, '');

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};
