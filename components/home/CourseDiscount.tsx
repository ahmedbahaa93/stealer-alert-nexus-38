'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DynamicIcon } from '../DynamicIcon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import '@/components/ui/carousel-fixes.css';
import CourseDiscountCard from './CourseDiscountCard';
import CourseDiscountSkeleton from './CourseDiscountSkeleton';
import CourseDiscountError from './CourseDiscountError';
import CourseDiscountEmpty from './CourseDiscountEmpty';
import { usePromotionsData } from '@/hooks/usePromotions';
import { useLocationReady } from '@/hooks/useLocationReady';

function CourseDiscount() {
  const t = useTranslations('HomePage');
  const [isMounted, setIsMounted] = useState(false);
  const { isLocationReady, isDetecting } = useLocationReady();

  const {
    promotionCourses: courses,
    isLoading,
    isError,
    error,
    refetch
  } = usePromotionsData();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state during SSR/hydration or location detection
  if (!isMounted || isLoading || (!isLocationReady && isDetecting)) {
    return <CourseDiscountSkeleton showTitle={true} itemCount={6} />;
  }

  const renderContent = () => {
    if (isError) {
      return (
        <div className="w-full">
          <CourseDiscountError onRetry={() => refetch()} error={error} />
        </div>
      );
    }

    if (!courses || courses.length === 0) {
      return (
        <div className="w-full">
          <CourseDiscountEmpty />
        </div>
      );
    }

    return (<CarouselContent className="w-[80%] py-4 overflow-visible">
      {courses.map((course) => (
        <CarouselItem key={course._id} className="pl-5 md:basis-1/2 xl:basis-1/3 xl:pl-20 py-4 overflow-visible">
          <CourseDiscountCard
            course={course}
            discountValue={course.discount_value}
          />
        </CarouselItem>
      ))}
    </CarouselContent>
    );
  };

  return (
    <div className="pb-15 overflow-visible">
      <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
        <DynamicIcon
          src="/assets/home/course-dis.svg"
          alt="celebrate"
          width={60}
        />
        <h2 className="text-primary-identity text-3xl font-bold">
          {t('course-dis')}
        </h2>
      </div>
      <div className="flex items-center justify-center card-hover-section">
        <Carousel opts={{ loop: true }} className="w-[70%] sm:w-[80%] overflow-visible" dir="ltr">
          {!isError && <CarouselPrevious />}
          {renderContent()}
          {!isError && <CarouselNext />}
        </Carousel>
      </div>
    </div>
  );
}

export default CourseDiscount;
