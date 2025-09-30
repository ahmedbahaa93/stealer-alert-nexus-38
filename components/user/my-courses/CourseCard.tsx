'use client';

import Image from 'next/image';
import { Timer, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import GrowAnimation from '@/components/GrowAnimation';
import Border from '@/components/courses/Border';
import { Button } from '@/components/ui/button';
import { UserCourse } from '@/lib/api/user';
import Link from 'next/link';

interface CourseCardProps {
  course: UserCourse;
}

function CourseCard({ course }: CourseCardProps) {
  const t = useTranslations('my-courses');
  const params = useParams();
  const locale = params.local || 'en';

  return (
    <GrowAnimation scale={1.03}>
      <Border padding="py-1 px-[1px] h-fit">
        <div className="bg-primary-foreground course-bg block rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl">
          {course.course.image ? (
            <div className="w-full h-[230px] relative">
              <Image
                src={course.course.image}
                alt={`${course.course.title} course thumbnail`}
                fill
                className="object-cover rounded-t-md"
              />
            </div>
          ) : (
            <div className="w-full h-[230px] bg-gray-200 flex items-center justify-center rounded-t-md">
              <Clock size={48} className="text-gray-400" />
            </div>
          )}
          <div className="px-3 pt-2">
            <h3 className="text-xl font-bold text-primary-identity mb-3 line-clamp-2 min-h-[3rem]">
              {course.course.title || 'Course Title'}
            </h3>
            <p className="text-sm flex items-center gap-1 text-gray-600 mt-1 mb-3">
              <Timer size={16} /> {course.course.duration || 0}h • {Array.isArray(course.course.course_type) ? course.course.course_type.join(', ') : course.course.course_type || 'Online'}
            </p>

            {/* Display booking status and payment status */}
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${course.booking_status === 'Confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {course.booking_status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${course.payment_status === 'Partial'
                  ? 'bg-orange-100 text-orange-700'
                  : course.payment_status === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {course.payment_status}
                </span>
              </div>

              {course.selected_start_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(course.selected_start_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 mb-3 flex justify-center">
              <div className="w-full">
                <Border padding="p-[1px]">
                  <Link href={`/${locale}/course-details/${course.course._id}`} className="w-full">
                    <Button variant="outline" className="w-full">{t('continueLearning')}</Button>
                  </Link>
                </Border>
              </div>
            </div>
          </div>
        </div>
      </Border>
    </GrowAnimation>
  );
}

export default CourseCard;
