import { format } from 'date-fns';

/**
 * Formats a date string to a readable format
 *
 * @param dateString The date string to format
 * @param formatString The format pattern to use (default: 'MMM dd, yyyy \'at\' h:mm a')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  formatString: string = "MMM dd, yyyy 'at' h:mm a"
): string => {
  try {
    return format(new Date(dateString), formatString);
  } catch {
    return dateString;
  }
};

/**
 * Formats a date string to a short date format (DD/MM/YYYY)
 *
 * @param dateString The date string to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatShortDate = (dateString: string): string => {
  return formatDate(dateString, 'dd/MM/yyyy');
};

/**
 * Formats a payment amount with currency
 *
 * @param amount The amount to format
 * @param currency The currency symbol (default: 'L.E')
 * @returns Formatted amount with currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'L.E'
): string => {
  return `${amount} ${currency}`;
};
