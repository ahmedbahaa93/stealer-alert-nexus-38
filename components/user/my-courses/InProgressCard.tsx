'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import ProgressBar from '../ProgressBar';
import { useInProgressCourses } from '@/hooks/useMyCourses';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import InProgressCardSkeleton from './InProgressCardSkeleton';

function InProgressCard() {
  const t = useTranslations('my-courses');
  const tError = useTranslations('ProfileErrorStates');

  const { data: courses, isLoading, isError, error, refetch } = useInProgressCourses();

  if (isLoading) {
    return <InProgressCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('progress')} />
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
        <Heading data={t('progress')} />
        <EmptyState
          title={t('noInProgressCourses')}
          message={t('noInProgressCourses')}
        />
      </Card>
    );
  }

  // Function to calculate a random progress for demo purposes
  const calculateProgress = () => {
    return `${Math.floor(Math.random() * 60 + 30)}%`; // Random between 30% and 90%
  };

  return (
    <Card>
      <Heading data={t('progress')} />
      <div className="sm:w-[80%] space-y-10">
        {courses.map(course => (
          <ProgressBar
            key={course._id}
            courseTitle={course.course.title}
            title={t('progress')}
            progress={calculateProgress()}
          />
        ))}
      </div>
    </Card>
  );
}

export default InProgressCard;
