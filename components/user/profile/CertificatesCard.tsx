'use client';

import { ScrollText, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import { useUserCertificates } from '@/hooks/useUserProfile';
import CertificatesCardSkeleton from './CertificatesCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils/formatters';

function CertificatesCard() {
  const t = useTranslations('profile');
  const tError = useTranslations('ProfileErrorStates');

  const { data: certificates, isLoading, isError, error, refetch } = useUserCertificates();

  if (isLoading) {
    return <CertificatesCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('certificates')} />
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
        <Heading data={t('certificates')} />
        <EmptyState
          title={t('noCertificates')}
          message={t('noCertificates')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Heading data={t('certificates')} />
      <div className="w-full space-y-8">
        {certificates.map((certificate) => (
          <div key={certificate._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-[200px]">
              <ScrollText className="text-primary-identity" />
              <h4 className="text-primary-identity text-xl font-semibold">
                Certificate #{certificate._id.substring(0, 6)}
              </h4>
            </div>
            <span className="text-sm text-[#808080]">
              {certificate.createdAt ? formatDate(certificate.createdAt) : 'N/A'}
            </span>
            <a
              href={`/certificates/${certificate._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-identity hover:text-primary-identity/80 transition-colors"
              title="View Certificate"
              aria-label="View Certificate"
            >
              <ExternalLink />
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default CertificatesCard;
