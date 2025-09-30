'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import PaymentRecords from '../PaymentRecords';
import { useUserPayments } from '@/hooks/useUserProfile';
import PaymentRecordCardSkeleton from './PaymentRecordCardSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { useParams } from 'next/navigation';

function PaymentRecordCard() {
  const t = useTranslations('profile');
  const tError = useTranslations('ProfileErrorStates');
  const params = useParams();
  const locale = Array.isArray(params.local) ? params.local[0] : params.local || 'en';

  const { data: payments, isLoading, isError, error, refetch } = useUserPayments();

  if (isLoading) {
    return <PaymentRecordCardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <Heading data={t('payment')} />
        <ErrorState
          message={error instanceof Error ? error.message : tError('defaultMessage')}
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <Heading data={t('payment')} />
        <EmptyState
          title={t('noPayments')}
          message={t('noPayments')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Heading data={t('payment')} />
      <div className="flex flex-col gap-4">
        {payments.map((payment) => (
          <PaymentRecords
            key={payment._id}
            payment={payment}
            locale={locale}
          />
        ))}
      </div>
    </Card>
  );
}

export default PaymentRecordCard;
