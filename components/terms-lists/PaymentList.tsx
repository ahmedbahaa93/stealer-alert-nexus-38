import { useTranslations } from 'next-intl';
import MainList from './MainList';
import Heading from './Heading';
import Box from './Box';
import { DynamicIcon } from '../DynamicIcon';

function PaymentList() {
  const t = useTranslations('terms-page');

  return (
    <Box className="mt-15">
      <div className="mb-5 flex items-center gap-7">
        <DynamicIcon
          src="/icons/terms/card-pos.svg"
          alt="card-icon"
          width={50}
          height={50}
        />
        <Heading data={t('list1.title')} />
      </div>
      <MainList t={t} path="list1.content" />
    </Box>
  );
}

export default PaymentList;
