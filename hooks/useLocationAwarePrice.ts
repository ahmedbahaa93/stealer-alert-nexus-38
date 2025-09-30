/**
 * Location-aware pricing hook
 * Handles currency conversion and price display based on user location
 */

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useLocationStore } from '@/lib/store/locationStore';
import { formatPrice } from '@/lib/utils/currencyConversion';

interface PriceData {
  EGP?: number;
  USD?: number;
}

interface LocationAwarePrice {
  amount: number;
  currency: 'EGP' | 'USD';
  formatted: string;
  symbol: string;
  paymentMethod: 'paymob' | 'checkout';
}

export const useLocationAwarePrice = (
  priceData: PriceData | number | null
): LocationAwarePrice => {
  const { location } = useLocationStore();
  const locale = useLocale();

  return useMemo(() => {
    // Default fallback
    const defaultPrice: LocationAwarePrice = {
      amount: 0,
      currency: 'USD',
      formatted: '$0.00',
      symbol: '$',
      paymentMethod: 'checkout'
    };

    if (!priceData) {
      return defaultPrice;
    }

    // Determine user's preferred currency based on location
    const userCurrency = location?.currency || 'USD';
    const userCountry = location?.countryCode || 'US';

    // Handle legacy number format (single price value)
    if (typeof priceData === 'number') {
      // If the backend sent a price, trust it's in the correct currency for the user's location
      // Backend should send EGP prices for Egyptian users and USD for others
      const currency = userCountry === 'EG' ? 'EGP' : 'USD';
      const amount = priceData;

      return {
        amount,
        currency,
        formatted: formatPrice(amount, currency, locale),
        symbol: getCurrencySymbol(currency),
        paymentMethod:
          location?.paymentMethod ||
          (userCountry === 'EG' ? 'paymob' : 'checkout')
      };
    }

    // Handle new price object format with multiple currencies
    if (typeof priceData === 'object' && priceData !== null) {
      // Prefer the currency that matches user's location
      let amount: number;
      let currency: 'EGP' | 'USD';

      if (userCurrency === 'EGP' && priceData.EGP) {
        amount = priceData.EGP;
        currency = 'EGP';
      } else if (userCurrency === 'USD' && priceData.USD) {
        amount = priceData.USD;
        currency = 'USD';
      } else {
        // Fallback: use any available price and convert if needed
        if (priceData.EGP && userCurrency === 'EGP') {
          amount = priceData.EGP;
          currency = 'EGP';
        } else if (priceData.USD) {
          amount = priceData.USD;
          currency = userCurrency;
        } else if (priceData.EGP) {
          amount = priceData.EGP;
          currency = userCurrency;
        } else {
          return defaultPrice;
        }
      }

      return {
        amount,
        currency,
        formatted: formatPrice(amount, currency, locale),
        symbol: getCurrencySymbol(currency),
        paymentMethod:
          location?.paymentMethod ||
          (userCountry === 'EG' ? 'paymob' : 'checkout')
      };
    }

    return defaultPrice;
  }, [priceData, location, locale]);
};

// Helper function to get currency symbol
const getCurrencySymbol = (currency: 'EGP' | 'USD'): string => {
  const symbols = {
    EGP: 'ج.م',
    USD: '$'
  };

  return symbols[currency] || '$';
};

// Hook for getting payment method based on location
export const useLocationAwarePayment = () => {
  const { location } = useLocationStore();

  return useMemo(() => {
    const paymentMethod = location?.paymentMethod || 'checkout';
    const currency = location?.currency || 'USD';
    const countryCode = location?.countryCode || 'US';

    return {
      paymentMethod,
      currency,
      countryCode,
      isEgypt: countryCode === 'EG',
      endpoint:
        paymentMethod === 'paymob'
          ? '/api/v1/checkouts/paymob/courses'
          : '/api/v1/checkouts/checkout/courses'
    };
  }, [location]);
};

// Hook for location-aware course filtering
export const useLocationAwareCourses = () => {
  const { location } = useLocationStore();

  return useMemo(() => {
    const currency = location?.currency || 'USD';
    const countryCode = location?.countryCode || 'US';

    return {
      currency,
      countryCode,
      isEgypt: countryCode === 'EG'
      // Add any location-specific course filtering logic here
    };
  }, [location]);
};
