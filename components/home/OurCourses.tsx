'use client';

import { useTranslations } from 'next-intl';
import { DynamicIcon } from '../DynamicIcon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import CourseDiscountCard from './CourseDiscountCard';
import OurCoursesSkeleton from './OurCoursesSkeleton';
import OurCoursesError from './OurCoursesError';
import OurCoursesEmpty from './OurCoursesEmpty';
import { useCoursesData } from '../../hooks/useCourses';

function OurCourses() {
  const t = useTranslations('HomePage');
  const { courses, isLoading, isError, error, refetch } = useCoursesData();

  // Show skeleton during loading
  if (isLoading) {
    return <OurCoursesSkeleton />;
  }

  // Show error state
  if (isError) {
    return <OurCoursesError onRetry={refetch} error={error} />;
  }

  // Show empty state if no courses
  if (!courses || courses.length === 0) {
    return <OurCoursesEmpty />;
  }

  return (
    <div className="pb-15">
      <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
        <DynamicIcon
          src="/assets/home/book-lamb.svg"
          alt="book-with-lamb"
          width={60}
        />
        <h2 className="text-primary-identity text-3xl font-bold">{t('our')}</h2>
      </div>

      <div className="flex items-center justify-center">
        <Carousel opts={{ loop: true }} className="w-[70%] sm:w-[80%]" dir="ltr">
          <CarouselPrevious />
          <CarouselContent className="w-[80%]">
            {courses.map((course, index) => (
              <CarouselItem
                key={course._id || `course-${index}`}
                className="pl-5 md:basis-1/2 xl:basis-1/3 xl:pl-20"
              >
                <CourseDiscountCard course={course} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default OurCourses;
