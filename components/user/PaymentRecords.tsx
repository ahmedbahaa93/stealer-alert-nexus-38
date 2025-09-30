import { CreditCard, Receipt, Calendar } from 'lucide-react';
import { UserPayment } from '@/lib/api/user';
import { format } from 'date-fns';
import { arEG } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { SafeImage } from '@/components/ui/SafeImage';
import { useRouter } from 'next/navigation';

interface PaymentRecordProps {
  payment: UserPayment;
  locale?: string;
}

function PaymentRecords({ payment, locale = 'en' }: PaymentRecordProps) {
  const t = useTranslations('payment');
  const router = useRouter();

  const formattedDate = payment.createdAt
    ? format(
      new Date(payment.createdAt),
      'MMM dd, yyyy \'at\' h:mm a',
      { locale: locale === 'ar' ? arEG : undefined }
    )
    : t('dateNotAvailable') || 'Date not available';

  const handleViewInvoice = () => {
    if (!payment._id) {
      console.error('Payment ID not found');
      alert('Error: Payment ID not found');
      return;
    }

    // Navigate to the invoice page
    router.push(`/${locale}/user/invoice/${payment._id}`);
  }; return (
    <div className="w-full space-y-6">
      <div className="items-center justify-between space-y-3 md:space-x-3 sm:flex flex-wrap">
        <div className="flex items-center gap-3 sm:w-[250px]">
          {payment.image ? (
            <div className="relative h-10 w-10 rounded-md overflow-hidden">
              <SafeImage
                src={payment.image}
                alt={typeof payment.course_title === 'object' ? payment.course_title?.en || "Course" : payment.course_title || "Course"}
                width={40}
                height={40}
                className="object-cover w-full h-full"
                fallbackSrc="/assets/course/ai.svg"
              />
            </div>
          ) : (
            <CreditCard className="text-primary-identity" />
          )}
          <h4 className="text-primary-identity text-lg font-semibold line-clamp-1">
            {locale === 'ar' && typeof payment.course_title === 'object' && payment.course_title?.ar ?
              payment.course_title.ar :
              (typeof payment.course_title === 'object' && payment.course_title?.en) ||
              (typeof payment.course_title === 'string' ? payment.course_title : "Course")}
          </h4>
        </div>
        <span className="text-sm text-[#808080]">{t(payment.payment_method.toLowerCase()) || payment.payment_method}</span>
        <span className="text-sm text-[#808080]">
          {(payment.paid_amount || payment.initial_payment_amount || 0).toFixed(2)} {locale === 'ar' ? 'ج.م' : 'L.E'}
        </span>
        <span className="text-sm text-[#808080] flex items-center gap-1">
          <Calendar size={14} />
          {formattedDate}
        </span>
        <button
          onClick={handleViewInvoice}
          title="View Invoice"
          className="flex items-center gap-1 text-primary-identity hover:text-primary-identity/80 transition-colors"
        >
          <Receipt className="inline cursor-pointer" size={16} />
        </button>
      </div>
    </div>
  );
}

export default PaymentRecords;
