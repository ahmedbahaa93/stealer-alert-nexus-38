import { useTranslations } from 'next-intl';
import PaymentList from './terms-lists/PaymentList';
import CancellationList from './terms-lists/CancellationList';
import ComplaintsList from './terms-lists/ComplaintsList';
import TrainerList from './terms-lists/TrainerList';
import IntellectualList from './terms-lists/IntellectualList';
import HealthList from './terms-lists/HealthList';
import ForceList from './terms-lists/ForceList';

function Terms() {
  const t = useTranslations('terms-page');
  return (
    <section className="pb-60">
      <h1 className="text-primary-identity text-center text-3xl font-bold">
        {t('title')}
      </h1>
      <p className="text-primary-identity px-5 max-lg:mt-5 lg:px-50">
        {t('description')}
      </p>

      <div className="px-5 lg:px-20">
        <PaymentList />
        <CancellationList />
        <ComplaintsList />
        <TrainerList />
        <IntellectualList />
        <HealthList />
        <ForceList />
      </div>
      <p className="text-primary-identity mt-10 text-2xl max-md:px-5">
        {t('footer')}
      </p>
    </section>
  );
}

export default Terms;
