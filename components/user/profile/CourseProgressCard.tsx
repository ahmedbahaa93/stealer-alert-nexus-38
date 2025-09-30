'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import { useUserCourses } from '@/hooks/useUserProfile';
import CourseProgressCardSkeleton from './CourseProgressCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { SafeImage } from '@/components/ui/SafeImage';

function CourseProgressCard() {
  const t = useTranslations('profile');
  const tError = useTranslations('ProfileErrorStates');

  const { data: courses, isLoading, isError, error, refetch } = useUserCourses();

  if (isLoading) {
    return <CourseProgressCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('courses')} />
        <ErrorState
          message={error instanceof Error ? error.message : tError('defaultMessage')}
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Card>
        <Heading data={t('courses')} />
        <EmptyState
          title={t('noCourses')}
          message={t('noCourses')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Heading data={t('courses')} />
      <div className='lg:w-[80%] space-y-10'>
        {courses.map((course) => (
          <div key={course._id} className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <SafeImage
                src={course.course.image || null}
                alt={`${course.course.title || 'Course'} image`}
                width={64}
                height={64}
                className="rounded-lg object-cover bg-gray-100"
                fallbackSrc="/assets/course/ai.svg"
              />
              <div>
                <h3 className="text-lg font-medium mb-1">
                  {course.course.title || 'Course Title'}
                </h3>
                <div className="flex gap-3 text-sm text-gray-600">
                  <span>{Array.isArray(course.course.course_type)
                    ? course.course.course_type.join(', ')
                    : course.course.course_type || 'Online'}</span>
                  <span>•</span>
                  <span>{course.course.duration ? `${course.course.duration} hours` : 'Duration N/A'}</span>
                  <span>•</span>
                  <span className={`${course.payment_status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    {course.payment_status || 'Status pending'}
                  </span>
                </div>
              </div>
            </div>
            {/* <ProgressBar
              title="Progress"
              progress={calculateProgress(course.booking_status)}
            /> */}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default CourseProgressCard;
