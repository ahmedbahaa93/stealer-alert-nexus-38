import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import DeleteAlert from './DeleteAlert';

function DeleteCard() {
  const t = useTranslations('settings.delete');

  return (
    <Card>
      <Heading data={t('title')} />
      <p className="text-lg text-[#808080] md:w-1/2 md:text-2xl">{t('des')}</p>
      <div className="flex items-center justify-end">
        <DeleteAlert />
      </div>
    </Card>
  );
}

export default DeleteCard;
