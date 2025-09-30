import { useTranslations } from 'next-intl';
import MainList from './MainList';
import Paragraph from './Paragraph';
import Heading from './Heading';
import Box from './Box';
import { DynamicIcon } from '../DynamicIcon';

function ForceList() {
  const t = useTranslations('terms-page');

  return (
    <Box>
      <div className="my-5 flex items-center gap-7">
        <DynamicIcon
          src="/icons/terms/hand-protest-sign-icon 1.svg"
          alt="hand-icon"
          width={50}
          height={50}
        />
        <Heading data={t('list7.title')} />
      </div>
      <Paragraph data={t('list7.1st')} />
      <MainList t={t} path="list7.ul" />
      <Paragraph data={t('list7.2nd')} />
    </Box>
  );
}

export default ForceList;
