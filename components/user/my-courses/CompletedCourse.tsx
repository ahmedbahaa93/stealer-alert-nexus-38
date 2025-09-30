'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import ProgressBar from '../ProgressBar';
import { useCompletedCourses } from '@/hooks/useMyCourses';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import CompletedCourseSkeleton from './CompletedCourseSkeleton';

function CompletedCourse() {
  const t = useTranslations('my-courses');
  const tError = useTranslations('ProfileErrorStates');

  const { data: courses, isLoading, isError, error, refetch } = useCompletedCourses();

  if (isLoading) {
    return <CompletedCourseSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('complete')} />
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
        <Heading data={t('complete')} />
        <EmptyState
          title={t('noCompletedCourses')}
          message={t('noCompletedCourses')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Heading data={t('complete')} />
      <div className='sm:w-[80%] space-y-10'>
        {courses.map(course => (
          <ProgressBar
            key={course._id}
            courseTitle={course.course.title}
            title={t('complete')}
            progress="100%"
          />
        ))}
      </div>
    </Card>
  );
}

export default CompletedCourse;
