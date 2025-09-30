'use client';

import { PenTool } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import { useUserProfile } from '@/hooks/useUserProfile';
import EducationCardSkeleton from './EducationCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';

function EducationCard() {
  const t = useTranslations('user-info');
  const tError = useTranslations('ProfileErrorStates');

  const { data: profile, isLoading, isError, error, refetch } = useUserProfile();

  if (isLoading) {
    return <EducationCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('title-4')} />
        <ErrorState
          message={error instanceof Error ? error.message : tError('defaultMessage')}
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <Heading data={t('title-4')} />
        <ErrorState message={tError('defaultMessage')} onRetry={() => refetch()} />
      </Card>
    );
  }

  const { education_info } = profile;

  return (
    <Card>
      <Heading data={t('title-4')} />
      <div className="w-full space-y-11">
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('edu')} type="blue" />
          <Paragraph data={education_info.highest_education_level || '-'} />
        </div>
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('study')} type="blue" />
          <Paragraph data={education_info.field_of_study || '-'} />
        </div>
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('graduation')} type="blue" />
          <Paragraph data={education_info.graduation_year?.toString() || '-'} />
        </div>
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('unv')} type="blue" />
          <Paragraph data={education_info.university_institution_name || '-'} />
        </div>
      </div>
    </Card>
  );
}

export default EducationCard
