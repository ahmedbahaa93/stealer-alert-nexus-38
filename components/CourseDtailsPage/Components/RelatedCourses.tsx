"use client";

import React from 'react';
import Button from '../../../Ui/Button';
import Border from '../../courses/Border';
import { MotionDiv } from '@/components/ui/motion';
import { CourseDetailsLink } from '@/components/ui/links/CourseDetailsLink';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/lib/api/courses';
import { Timer } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';
import { useLocationAwarePrice } from '@/hooks/useLocationAwarePrice';

interface RelatedCoursesProps {
  currentCourseId?: string;
}

// Component to handle location-aware pricing for each course
const CoursePrice = ({ price }: { price?: number }) => {
  const locationAwarePrice = useLocationAwarePrice(price || null);
  return (
    <p className="text-lg font-bold text-primary">
      {locationAwarePrice.formatted}
    </p>
  );
};

const RelatedCourses = ({ currentCourseId }: RelatedCoursesProps = {}) => {
  const t = useTranslations('courseDetail');
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const id = currentCourseId || (params?.id as string);

  const handleEnrollClick = (course: any) => {
    // Navigate to enrollment page instead of opening modal
    router.push(`/${locale}/enrollment/${course._id}`);
  };

  // Fetch available courses from API
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getCourses,
    // If error, we'll fall back to the static courses below
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fallback courses - used if API call fails or before data is loaded
  const fallbackCourses = [
    {
      _id: "646ac3e3a79bcd104522e32a",
      title: "Introduction to Node.js",
      image: '/assets/Course-Details-Page/Rectangle 8382.png',
      duration: "30 H",
    },
    {
      _id: "646ac3e3a79bcd104522e36c",
      title: "Artificial Intelligence",
      image: '/assets/Course-Details-Page/Rectangle 8382.png',
      duration: "140 H",
    },
    {
      _id: "646ac3e3a79bcd104522e31a",
      title: "Web Development",
      image: '/assets/Course-Details-Page/Rectangle 8382.png',
      duration: "80 H",
    }
  ];

  // Use API data if available, otherwise use fallback
  const apiCourses = coursesData?.data?.courses || [];

  // Take up to 3 courses from API, filter out current course
  const courses = apiCourses.length > 0
    ? apiCourses.filter((course: any) => course._id !== id).slice(0, 3)
    : fallbackCourses.filter(course => course._id !== id);

  return (
    <div className="w-full">
      {/* Grid container for cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <MotionDiv
            key={course._id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: index * 0.1
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            <Border padding="py-1 px-[1px] h-full">
              <div className="bg-primary-foreground course-bg rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl transition-all duration-300 ease-out h-[350px]">
                {/* Course Image */}
                <div className="overflow-hidden rounded-[20px] mt-[3px] w-full h-[200px] mx-auto">
                  <SafeImage
                    src={course.image || '/assets/course/ai.svg'}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                    fallbackSrc="/assets/course/ai.svg"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between h-[130px] px-4">
                  {/* Title */}
                  <div className="mt-3">
                    <h3 className="text-lg font-bold text-[#0F43B4] line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                  </div>

                  {/* Duration and Price Row */}
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-sm text-gray-600">
                      <Timer className="h-4 w-4" />
                      {typeof course.duration === 'number' ? `${course.duration} H` : course.duration}
                    </p>
                    <CoursePrice price={(course as any).price} />
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Border padding="p-[1px] flex-1">
                      <CourseDetailsLink courseId={course._id}>
                        <Button
                          className="w-full bg-white text-[#0F43B4] px-2 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                          {t('moreDetails')}
                        </Button>
                      </CourseDetailsLink>
                    </Border>

                    <Border padding="p-[1px] flex-1">
                      <Button
                        onClick={() => handleEnrollClick(course)}
                        className="w-full bg-white text-[#0F43B4] px-2 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        {t('enrollNow')}
                      </Button>
                    </Border>
                  </div>
                </div>
              </div>
            </Border>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;