import { useTranslations } from 'next-intl';
import MainList from './MainList';
import Paragraph from './Paragraph';
import Heading from './Heading';
import Box from './Box';
import { DynamicIcon } from '../DynamicIcon';

function ComplaintsList() {
  const t = useTranslations('terms-page');

  return (
    <Box>
      <div className="my-5 flex items-center gap-7">
        <DynamicIcon
          src="/icons/terms/headset-mic-1-svgrepo-com 1.svg"
          alt="headset-icon"
          width={50}
          height={50}
        />
        <Heading data={t('list3.title')} />
      </div>

      <Paragraph data={t('list3.1st')} />
      <MainList t={t} path="list3.ul" />

      <Paragraph data={t('list3.2nd')} />
      <Paragraph data={t('list3.3rd')} />
      <Paragraph data={t('list3.4th')} />
    </Box>
  );
}

export default ComplaintsList;
