'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import CourseCard from './CourseCard';
import { useMyCourses } from '@/hooks/useMyCourses';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import MyCoursesCardSkeleton from './MyCoursesCardSkeleton';

function MyCoursesCard() {
  const t = useTranslations('my-courses');
  const tError = useTranslations('ProfileErrorStates');

  const { data: courses, isLoading, isError, error, refetch } = useMyCourses();

  if (isLoading) {
    return <MyCoursesCardSkeleton />;
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
          message={t('noCoursesMessage')}
          actionLabel={t('browseCourses')}
          actionLink="/courses"
        />
      </Card>
    );
  }

  return (
    <Card>
      <Heading data={t('courses')} />
      <div className="w-full grid md:grid-cols-3 gap-5">
        {courses.map(course => (
          <CourseCard
            key={course._id}
            course={course}
          />
        ))}
      </div>
    </Card>
  );
}

export default MyCoursesCard;
