import { Course } from '../types/course';

/**
 * Validates if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Allow common image hosting domains that are configured in next.config.ts
    const validDomains = [
      'i.postimg.cc',
      'booking-courses-gilt.vercel.app',
      'images.unsplash.com',
      'via.placeholder.com',
      'localhost'
    ];

    const validExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'];

    // Check if domain is in our whitelist
    const isDomainValid = validDomains.some(
      (domain) =>
        parsedUrl.hostname === domain ||
        parsedUrl.hostname.endsWith('.' + domain)
    );

    // Check if URL has valid image extension
    const hasValidExtension = validExtensions.some((ext) =>
      parsedUrl.pathname.toLowerCase().endsWith(ext)
    );

    // URL is valid if domain is whitelisted OR has image extension
    return (
      isDomainValid && (hasValidExtension || parsedUrl.pathname.includes('/'))
    );
  } catch {
    return false;
  }
}

/**
 * Gets a safe image URL with fallback
 */
export function getSafeImageUrl(course: Course): string {
  const fallbackImage = '/assets/course/ai.svg';

  if (!course?.image) return fallbackImage;

  if (isValidImageUrl(course.image)) {
    return course.image;
  }

  return fallbackImage;
}

/**
 * Formats course duration for display
 */
export function formatCourseDuration(duration: number): string {
  if (duration < 1) return '< 1h';
  if (duration === 1) return '1h';
  return `${duration}h`;
}

/**
 * Formats course price with currency
 */
export function formatCoursePrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Checks if a course has active discount
 */
export function hasActiveDiscount(course: Course): boolean {
  return course.discount_applied && (course.discount_percentage || 0) > 0;
}

/**
 * Calculates discounted price
 */
export function getDiscountedPrice(course: Course): number {
  if (!hasActiveDiscount(course)) return course.price;

  const discountPercentage = course.discount_percentage || 0;
  const discountAmount = (course.price * discountPercentage) / 100;
  return course.price - discountAmount;
}
