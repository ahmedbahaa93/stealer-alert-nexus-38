'use client';

import { PenTool } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import { useUserProfile } from '@/hooks/useUserProfile';
import PersonalCardSkeleton from './PersonalCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';

function PersonalCard() {
  const t = useTranslations('user-info');
  const tError = useTranslations('ProfileErrorStates');

  const { data: profile, isLoading, isError, error, refetch } = useUserProfile();

  if (isLoading) {
    return <PersonalCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('title-3')} />
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
        <Heading data={t('title-3')} />
        <ErrorState message={tError('defaultMessage')} onRetry={() => refetch()} />
      </Card>
    );
  }

  const { professional_info } = profile;

  return (
    <Card>
      <Heading data={t('title-3')} />
      <div className="w-full space-y-11">
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('job')} type="blue" />
          <Paragraph data={professional_info.current_job_title || '-'} />
        </div>
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('company')} type="blue" />
          <Paragraph data={professional_info.company_organization_name || '-'} />
        </div>
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('field')} type="blue" />
          <Paragraph data={professional_info.industry_field_of_work || '-'} />
        </div>
        <div className="flex gap-3">
          <PenTool className="text-primary-identity" />
          <Paragraph data={t('yrs')} type="blue" />
          <Paragraph data={professional_info.years_of_experience?.toString() || '0'} />
        </div>
      </div>
    </Card>
  );
}

export default PersonalCard
