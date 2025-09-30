'use client';

import { useParams } from 'next/navigation';
import Card from './Card';
import PaymentRecords from '../PaymentRecords';
import { UserPayment } from '@/lib/api/user';

interface PaymentRecordCardProps {
  date: string;
  payments: UserPayment[];
}

function PaymentRecordCard({ date, payments }: PaymentRecordCardProps) {
  const params = useParams();
  const locale = (params.local as string) || 'en';

  return (
    <Card date={date}>
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
