import { Category } from '../types/category';

/**
 * Validates if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Allow common image hosting domains
    const validDomains = [
      'res.cloudinary.com',
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
export function getSafeCategoryImageUrl(category: Category): string {
  const fallbackImage = '/assets/home/dev.svg';

  if (!category?.image) return fallbackImage;

  if (isValidImageUrl(category.image)) {
    return category.image;
  }

  return fallbackImage;
}

/**
 * Formats category course count for display
 */
export function formatCourseCount(count: number, locale?: string): string {
  if (locale === 'ar') {
    return `${count} دورة`;
  }

  if (count === 1) return '1 Course';
  return `${count} Courses`;
}

/**
 * Maps category name to icon
 */
export function getCategoryIcon(categoryName: string): string {
  const nameToIcon: Record<string, string> = {
    art: 'art',
    design: 'art',
    development: 'dev',
    programming: 'dev',
    network: 'dev',
    communication: 'comunycate',
    marketing: 'markiting',
    video: 'video',
    photography: 'record',
    finance: 'finance',
    science: 'since',
    content: 'content'
  };

  const normalizedName = categoryName.toLowerCase();

  // Check for exact matches first
  for (const [key, icon] of Object.entries(nameToIcon)) {
    if (normalizedName.includes(key)) {
      return icon;
    }
  }

  // Default icon
  return 'dev';
}

/**
 * Converts API category data to component props
 */
export function mapCategoryToCardProps(category: Category, locale?: string) {
  return {
    title: category.name,
    icon: getCategoryIcon(category.name),
    courseCount: formatCourseCount(category.num_of_courses, locale),
    id: category._id,
    slug: category.slug,
    description: category.description,
    image: category.image // Add the image URL from API
  };
}
