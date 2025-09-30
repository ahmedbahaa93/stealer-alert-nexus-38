'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import { Calendar, Mail, PenTool, Phone, VenusAndMars, MapPin, Building, Briefcase, GraduationCap } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import InfoCardSkeleton from './InfoCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import { formatShortDate } from '@/lib/utils/formatters';

function InfoCard() {
  const t = useTranslations('user-info');
  const tError = useTranslations('ProfileErrorStates');

  const { data: profile, isLoading, isError, error, refetch } = useUserProfile();

  if (isLoading) {
    return <InfoCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
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
        <ErrorState message={tError('defaultMessage')} onRetry={() => refetch()} />
      </Card>
    );
  }

  const { personal_info, professional_info, education_info } = profile;

  return (
    <Card>
      <Heading data={t('title')} />
      <div className="items-center justify-between lg:flex">
        <div className="space-y-5 lg:w-[50%] lg:space-y-11">
          <div className="flex gap-3">
            <PenTool className="text-primary-identity" />
            <Paragraph data={t('first')} type="blue" />
            <Paragraph data={personal_info.full_name.split(' ')[0] || '-'} />
          </div>
          <div className="flex gap-3">
            <Mail className="text-primary-identity" />
            <Paragraph data={t('email')} type="blue" />
            <Paragraph data={personal_info.email || '-'} />
          </div>
          <div className="flex gap-3">
            <Phone className="text-primary-identity" />
            <Paragraph data={t('num')} type="blue" />
            <Paragraph data={personal_info.phone_number || '-'} />
          </div>
          <div className="flex gap-3">
            <MapPin className="text-primary-identity" />
            <Paragraph data={t('country')} type="blue" />
            <Paragraph data={personal_info.location?.country || '-'} />
          </div>
          <div className="flex gap-3">
            <Building className="text-primary-identity" />
            <Paragraph data={t('city')} type="blue" />
            <Paragraph data={personal_info.location?.city || '-'} />
          </div>
        </div>
        <div className="space-y-5 max-lg:mt-5 lg:w-[50%] lg:space-y-11">
          <div className="flex gap-3">
            <PenTool className="text-primary-identity" />
            <Paragraph data={t('last')} type="blue" />
            <Paragraph data={personal_info.full_name.split(' ').slice(1).join(' ') || '-'} />
          </div>
          <div className="flex gap-3">
            <VenusAndMars className="text-primary-identity" />
            <Paragraph data={t('gender')} type="blue" />
            <Paragraph data={personal_info.gender || '-'} />
          </div>
          <div className="flex gap-3">
            <Calendar className="text-primary-identity" />
            <Paragraph data={t('date')} type="blue" />
            <Paragraph data={formatShortDate(personal_info.date_of_birth)} />
          </div>
          <div className="flex gap-3">
            <Briefcase className="text-primary-identity" />
            <Paragraph data={t('job')} type="blue" />
            <Paragraph data={professional_info.current_job_title || '-'} />
          </div>
          <div className="flex gap-3">
            <GraduationCap className="text-primary-identity" />
            <Paragraph data={t('edu')} type="blue" />
            <Paragraph data={education_info.highest_education_level || '-'} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default InfoCard;
