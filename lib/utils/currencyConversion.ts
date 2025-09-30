/**
 * Currency Conversion Utilities
 * Handles conversion between USD and EGP with exchange rates
 */

// Default exchange rates (should be updated with real-time rates in production)
const EXCHANGE_RATES = {
  USD_TO_EGP: 31,
  EGP_TO_USD: 1 / 31
} as const;

interface ConversionOptions {
  fromCurrency: 'USD' | 'EGP';
  toCurrency: 'USD' | 'EGP';
  amount: number;
  useRealTimeRates?: boolean;
}

/**
 * Convert amount from one currency to another
 */
export const convertCurrency = ({
  fromCurrency,
  toCurrency,
  amount,
  useRealTimeRates = false // TODO: Implement real-time rates in future
}: ConversionOptions): number => {
  // Suppress unused parameter warning
  void useRealTimeRates;
  // If same currency, return original amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // For now, use static rates (can be enhanced with real-time API)
  if (fromCurrency === 'USD' && toCurrency === 'EGP') {
    return Math.round(amount * EXCHANGE_RATES.USD_TO_EGP);
  }

  if (fromCurrency === 'EGP' && toCurrency === 'USD') {
    return Math.round(amount * EXCHANGE_RATES.EGP_TO_USD * 100) / 100; // Round to 2 decimals
  }

  // Fallback
  return amount;
};

/**
 * Get the current exchange rate between two currencies
 */
export const getExchangeRate = (
  from: 'USD' | 'EGP',
  to: 'USD' | 'EGP'
): number => {
  if (from === to) return 1;

  if (from === 'USD' && to === 'EGP') {
    return EXCHANGE_RATES.USD_TO_EGP;
  }

  if (from === 'EGP' && to === 'USD') {
    return EXCHANGE_RATES.EGP_TO_USD;
  }

  return 1;
};

/**
 * Format price with proper currency symbol and locale
 * Format: Amount + Currency (e.g., "1,240 EGP" or "50.00 USD")
 */
export const formatPrice = (
  amount: number,
  currency: 'USD' | 'EGP',
  locale: string = 'en'
): string => {
  try {
    // Ensure amount has maximum 2 decimal places
    const roundedAmount =
      currency === 'EGP' ? Math.round(amount) : Math.round(amount * 100) / 100;

    // Format number without currency symbol first
    const isRTL = locale === 'ar';
    const formattedAmount = new Intl.NumberFormat(locale, {
      minimumFractionDigits: currency === 'EGP' ? 0 : 2,
      maximumFractionDigits: currency === 'EGP' ? 0 : 2
    }).format(roundedAmount);

    // Get currency symbol
    const currencySymbol = currency === 'EGP' ? 'EGP' : 'USD';

    // Format based on locale direction
    if (isRTL) {
      return `${currencySymbol} ${formattedAmount}`;
    } else {
      return `${formattedAmount} ${currencySymbol}`;
    }
  } catch (error) {
    console.error('Currency formatting error:', error);

    // Fallback formatting
    const currencySymbol = currency === 'EGP' ? 'EGP' : 'USD';
    const roundedAmount =
      currency === 'EGP' ? Math.round(amount) : Math.round(amount * 100) / 100;

    const formattedAmount =
      currency === 'EGP'
        ? Math.round(roundedAmount).toLocaleString()
        : roundedAmount.toFixed(2);

    const isRTL = locale === 'ar';
    if (isRTL) {
      return `${currencySymbol} ${formattedAmount}`;
    } else {
      return `${formattedAmount} ${currencySymbol}`;
    }
  }
};

/**
 * Smart price conversion that handles different input formats
 */
export const smartPriceConversion = (
  priceInput: number | { USD?: number; EGP?: number },
  targetCurrency: 'USD' | 'EGP'
): number => {
  // Handle object format with specific currencies
  if (typeof priceInput === 'object' && priceInput !== null) {
    // If target currency exists in the object, use it directly
    if (priceInput[targetCurrency]) {
      return priceInput[targetCurrency];
    }

    // Otherwise convert from available currency
    if (targetCurrency === 'EGP' && priceInput.USD) {
      return convertCurrency({
        fromCurrency: 'USD',
        toCurrency: 'EGP',
        amount: priceInput.USD
      });
    }

    if (targetCurrency === 'USD' && priceInput.EGP) {
      return convertCurrency({
        fromCurrency: 'EGP',
        toCurrency: 'USD',
        amount: priceInput.EGP
      });
    }

    return 0;
  }

  // Handle single number format (assume it's USD)
  if (typeof priceInput === 'number') {
    return convertCurrency({
      fromCurrency: 'USD',
      toCurrency: targetCurrency,
      amount: priceInput
    });
  }

  return 0;
};
