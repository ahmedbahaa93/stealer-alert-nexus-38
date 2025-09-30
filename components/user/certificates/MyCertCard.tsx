'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import CertCard from './CertCard';
import { useUserCertificates } from '@/hooks/useUserProfile';
import MyCertCardSkeleton from './MyCertCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

function MyCertCard() {
  const t = useTranslations('prof-cert');
  const tError = useTranslations('ProfileErrorStates');

  const { data: certificates, isLoading, isError, error, refetch } = useUserCertificates();

  if (isLoading) {
    return <MyCertCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('title')} />
        <ErrorState
          message={error instanceof Error ? error.message : tError('defaultMessage')}
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <Card>
        <Heading data={t('title')} />
        <EmptyState
          title={t('noCertificates')}
          message={t('noCertificatesMessage')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Heading data={t('title')} />
      <div className="grid grid-cols-2 grid-rows-4 gap-x-5 gap-y-4 max-2xl:overflow-auto max-md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
        {certificates.map((certificate) => (
          <CertCard key={certificate._id} certificate={certificate} />
        ))}
      </div>
    </Card>
  );
}

export default MyCertCard;
