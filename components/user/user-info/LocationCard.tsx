'use client';

import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import { useUserProfile } from '@/hooks/useUserProfile';
import LocationCardSkeleton from './LocationCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';

function LocationCard() {
  const t = useTranslations('user-info');
  const tError = useTranslations('ProfileErrorStates');

  const { data: profile, isLoading, isError, error, refetch } = useUserProfile();

  if (isLoading) {
    return <LocationCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('title-2')} />
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
        <Heading data={t('title-2')} />
        <ErrorState message={tError('defaultMessage')} onRetry={() => refetch()} />
      </Card>
    );
  }

  const { location } = profile.personal_info;

  return (
    <Card>
      <Heading data={t('title-2')} />
      <div className="w-full space-y-11">
        <div className="flex gap-3">
          <MapPin className="text-primary-identity" />
          <Paragraph data={t('country')} type="blue" />
          <Paragraph data={location?.country || '-'} />
        </div>
        <div className="flex gap-3">
          <MapPin className="text-primary-identity" />
          <Paragraph data={t('city')} type="blue" />
          <Paragraph data={location?.city || '-'} />
        </div>
        <div className="flex gap-3">
          <MapPin className="text-primary-identity" />
          <Paragraph data={t('address')} type="blue" />
          <Paragraph data={location?.address || '-'} />
        </div>
      </div>
    </Card>
  );
}

export default LocationCard;
