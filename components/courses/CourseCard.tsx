import Border from './Border';
import Heading from '../about/Heading';
import { Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '../ui/button';
import { useViewChange } from '@/context/VewChangeProvider';
import clsx from 'clsx';
import { CourseDetailsLink } from '@/components/ui/links/CourseDetailsLink';
import { SafeImage } from '@/components/ui/SafeImage';
import type { Course } from '@/lib/types/course';
import { getSafeImageUrl, formatCourseDuration } from '@/lib/utils/courseUtils';
import { useLocationAwarePrice } from '@/hooks/useLocationAwarePrice';

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  const t = useTranslations('course-page');
  const { viewMode } = useViewChange();
  const router = useRouter();
  const locale = useLocale();

  // Safe data extraction with fallbacks
  const courseImage = course ? getSafeImageUrl(course) : '/assets/course/ai.svg';

  // Truncate title if longer than 12 characters for grid view, more for list view
  const titleLength = viewMode === 'grid' ? 12 : 25;
  const courseTitle = course.title?.length > titleLength
    ? `${course.title.substring(0, titleLength)}...`
    : course.title;

  const courseDuration = formatCourseDuration(course.duration);

  // Use location-aware pricing
  const locationAwarePrice = useLocationAwarePrice(course?.price || null);
  const coursePrice = locationAwarePrice.formatted;

  // Calculate discount percentage if available
  const discountPercentage = course.discount_applied && course.discount_percentage
    ? course.discount_percentage
    : 0;

  const handleEnrollClick = () => {
    if (course?._id) {
      router.push(`/${locale}/enrollment/${course._id}`);
    }
  };

  return (
    <>
      <Border padding="py-1 px-[1px] h-full">
        <div className={clsx(
          'bg-primary-foreground course-bg rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl transition-all duration-300 ease-out',
          viewMode === 'grid'
            ? 'block h-[420px]'
            : 'flex items-center gap-x-5 h-auto min-h-[200px]'
        )}>
          {/* Course Image */}
          <div className={clsx(
            'overflow-hidden rounded-[20px] mt-[3px] relative',
            viewMode === 'grid'
              ? 'w-full max-w-[396px] h-[256px] mx-auto'
              : 'w-[280px] h-[180px] flex-shrink-0'
          )}>
            {/* Discount Badge */}
            {course.discount_applied && discountPercentage > 0 && (
              <div className="absolute -top-2 -right-2 z-10">
                <div className="relative">
                  <SafeImage
                    src="/discount-icon.svg"
                    alt="Discount"
                    width={60}
                    height={60}
                    className="w-16 h-16"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white -translate-y-1">
                    <span className="text-sm font-bold">{discountPercentage}%</span>
                    <span className="text-xs font-medium">OFF</span>
                  </div>
                </div>
              </div>
            )}
            <SafeImage
              src={courseImage}
              alt={courseTitle}
              width={396}
              height={256}
              className="object-cover w-full h-full"
              fallbackSrc="/assets/course/ai.svg"
            />
          </div>

          {/* Content */}
          <div className={clsx(
            'flex flex-col justify-between',
            viewMode === 'grid'
              ? 'h-[150px] px-4'
              : 'flex-1 px-3 py-3 h-full'
          )}>
            {/* Title */}
            <div className={clsx(
              viewMode === 'grid' ? 'mt-3' : 'mt-0'
            )}>
              <Heading data={courseTitle} />
            </div>

            {/* Course Type and Duration for List View */}
            {viewMode === 'list' && (
              <div className="flex items-center gap-4 mt-2">
                {Array.isArray(course.course_type) ? (
                  <div className="flex flex-wrap gap-1">
                    {course.course_type.map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#0f43b4]/10 text-[#0f43b4] text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="px-2 py-1 bg-[#0f43b4]/10 text-[#0f43b4] text-xs rounded-full">
                    {course.course_type}
                  </span>
                )}
                <p className="flex items-center gap-1 text-sm text-gray-600">
                  <Timer className="h-4 w-4" /> {courseDuration}
                </p>
              </div>
            )}

            {/* Description for List View */}
            {viewMode === 'list' && course.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {course.description.length > 100
                  ? `${course.description.substring(0, 100)}...`
                  : course.description
                }
              </p>
            )}

            {/* Duration and Price Row for Grid View */}
            {viewMode === 'grid' && (
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-sm text-gray-600">
                  <Timer className="h-4 w-4" /> {courseDuration}
                </p>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {coursePrice}
                  </p>
                </div>
              </div>
            )}

            {/* Price for List View */}
            {viewMode === 'list' && (
              <div className="text-right mt-2">
                <p className="text-xl font-bold text-primary">
                  {coursePrice}
                </p>
              </div>
            )}

            {/* Buttons Row */}
            <div className={clsx(
              'flex items-center gap-2 mb-3',
              viewMode === 'grid' ? 'justify-between' : 'justify-start mt-4'
            )}>
              <Border padding="p-[1px] flex-1">
                <CourseDetailsLink courseId={course._id}>
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    {t('details')}
                  </Button>
                </CourseDetailsLink>
              </Border>

              <Border padding="p-[1px] flex-1">
                <Button
                  variant="outline"
                  onClick={handleEnrollClick}
                  className="w-full"
                >
                  {t('enroll')}
                </Button>
              </Border>
            </div>
          </div>
        </div>
      </Border>
    </>
  );
}

export default CourseCard;
