'use client';

import Pagination from '@/components/Pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Heading from '../Heading';
import PaymentRecordCard from './PaymentRecordCard';
import PaymentsSkeleton from './PaymentsSkeleton';
import { useGroupedPaymentHistory } from '@/hooks/usePaymentHistory';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

function Payments() {
  const t = useTranslations('payment');
  const tError = useTranslations('ProfileErrorStates');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  // We're not using setCurrentPage directly as the Pagination component
  // will handle page changes through URL parameters
  const [currentPage] = useState(1);

  const {
    groupedPayments,
    isLoading,
    isError,
    error,
    refetch
  } = useGroupedPaymentHistory();

  // Handle loading state
  if (isLoading) {
    return <PaymentsSkeleton />;
  }

  // Handle error state
  if (isError) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <Heading data={t('title')} />
        </div>
        <ErrorState
          message={error instanceof Error ? error.message : tError('defaultMessage')}
          onRetry={() => refetch()}
        />
      </>
    );
  }

  // Handle empty state
  const paymentMonths = Object.keys(groupedPayments);
  if (paymentMonths.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <Heading data={t('title')} />
        </div>
        <EmptyState
          title={t('noPayments')}
          message={t('noPaymentsDescription')}
        />
      </>
    );
  }

  // Get filtered payments
  const getFilteredPayments = () => {
    if (filterMethod === 'all') {
      return groupedPayments;
    }

    const filtered: Record<string, any> = {};

    Object.entries(groupedPayments).forEach(([month, payments]) => {
      const filteredMonthPayments = payments.filter(payment =>
        payment.payment_method.toLowerCase() === filterMethod.toLowerCase()
      );

      if (filteredMonthPayments.length > 0) {
        filtered[month] = filteredMonthPayments;
      }
    });

    return filtered;
  };

  const filteredPayments = getFilteredPayments();
  const months = Object.keys(filteredPayments);

  // Calculate pagination
  const paymentsPerPage = 3;
  const totalPayments = Object.values(filteredPayments).reduce((sum, payments) => sum + payments.length, 0);
  const totalPages = Math.ceil(totalPayments / paymentsPerPage);

  return (
    <>
      <div className="flex items-center justify-between mb-6 ">
        <Heading data={t('title')} />
        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="text-primary-identity border-primary-identity w-[180px]">
            <SelectValue
              className="text-primary-identity"
              placeholder={t('place-holder')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allPayments')}</SelectItem>
            <SelectItem value="stripe">{t('stripe')}</SelectItem>
            <SelectItem value="paymob">{t('paymob')}</SelectItem>
            <SelectItem value="cash">{t('cash')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {months.length === 0 ? (
        <EmptyState
          title={t('noFilteredPayments')}
          message={t('noFilteredPaymentsDescription')}
        />
      ) : (
        months.map((month) => (
          <PaymentRecordCard
            key={month}
            date={month}
            payments={filteredPayments[month]}
          />
        ))
      )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </>
  );
}

export default Payments;
