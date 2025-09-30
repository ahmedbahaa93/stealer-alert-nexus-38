'use client';

import { Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import Heading from '@/components/about/Heading';
import Border from '@/components/courses/Border';
import { Button } from '@/components/ui/button';
import { CourseDetailsLink } from '@/components/ui/links/CourseDetailsLink';
import { SafeImage } from '@/components/ui/SafeImage';
import type { Course } from '@/lib/types/course';
import { PromotionCourse } from '@/lib/types/promotion';
import { formatCourseDuration } from '@/lib/utils/courseUtils';
import { useLocationAwarePrice } from '@/hooks/useLocationAwarePrice';
import styles from './CourseDiscountCard.module.css';

interface CourseDiscountCardProps {
  course?: Course | (PromotionCourse & { discount_value?: number });
  discountValue?: number;
}

function CourseDiscountCard({ course, discountValue }: CourseDiscountCardProps) {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const locale = useLocale();
  const locationAwarePrice = useLocationAwarePrice(course?.price || 0);

  if (!course) {
    return null;
  }

  // Safe data extraction with fallbacks
  const courseImage = course.image || '/assets/course/ai.svg';
  const courseTitle = course.title || 'Artificial Intelligence';

  // Truncate title if longer than 12 characters
  const truncatedTitle = courseTitle.length > 12
    ? courseTitle.substring(0, 12) + '...'
    : courseTitle;

  // Use a default duration for promotion courses that might not have it
  const courseDuration = 'duration' in course
    ? formatCourseDuration((course as Course).duration)
    : '40h';

  // Use location-aware pricing for consistent display
  const coursePrice = locationAwarePrice.formatted;

  // Get discount value (either from promotion course or passed as prop)
  const discount = discountValue !== undefined ? discountValue : ('discount_value' in course ? course.discount_value : 0);

  const handleEnrollClick = () => {
    if (course?._id) {
      router.push(`/${locale}/enrollment/${course._id}`);
    }
  };

  // All hooks moved to the top

  return (
    <div className={`${styles.cardContainer} w-[408px] h-[420px]`}>
      <Border padding="py-1 px-[1px] h-full">
        <div className={`${styles.courseCard} bg-primary-foreground course-bg rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl h-full transition-all duration-300 ease-out`}>
          {/* Course Image */}
          <div className="w-full max-w-[396px] h-[256px] mt-[3px] mx-auto rounded-[20px] overflow-hidden relative">
            {discount !== undefined && discount > 0 && (
              <div className="absolute -top-2 -right-2 z-10">
                <div className="relative">
                  <SafeImage
                    src="/discount-icon.svg"
                    alt="Discount"
                    width={80}
                    height={80}
                    className="w-24 h-24"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white -translate-y-2">
                    <span className="text-xl font-bold">{discount}%</span>
                    <span className="text-sm font-medium">{t('sale')}</span>
                  </div>
                </div>
              </div>
            )}
            <SafeImage
              src={courseImage}
              alt={truncatedTitle}
              width={396}
              height={256}
              className="object-cover w-full h-full"
              fallbackSrc="/assets/course/ai.svg"
            />
          </div>

          {/* Content */}
          <div className="px-4 flex flex-col justify-between h-[150px]">
            {/* Title */}
            <div className="mt-3">
              <Heading data={truncatedTitle} />
            </div>

            {/* Duration and Price Row */}
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1 text-sm text-gray-600">
                <Timer className="h-4 w-4" /> {courseDuration}
              </p>
              <p className="text-lg font-bold text-primary">{coursePrice}</p>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <Border padding="p-[1px] flex-1">
                <CourseDetailsLink courseId={course?._id || ''}>
                  <Button
                    variant="outline"
                    disabled={!course?._id}
                    className="w-full"
                  >
                    {t('more')}
                  </Button>
                </CourseDetailsLink>
              </Border>

              <Border padding="p-[1px] flex-1">
                <Button
                  variant="outline"
                  disabled={!course?._id}
                  onClick={handleEnrollClick}
                  className="w-full"
                >
                  {t('enroll') || 'Enroll'}
                </Button>
              </Border>
            </div>
          </div>
        </div>
      </Border>
    </div>
  );
}

export default CourseDiscountCard;
