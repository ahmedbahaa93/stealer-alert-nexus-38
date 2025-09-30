import { useTranslations } from 'next-intl';
import Paragraph from './Paragraph';
import Heading from './Heading';
import Box from './Box';
import { DynamicIcon } from '../DynamicIcon';

function IntellectualList() {
  const t = useTranslations('terms-page');

  return (
    <Box>
      <div className="my-5 flex items-center gap-7">
        <DynamicIcon
          src="/icons/terms/copyright-symbol-svgrepo-com 1.svg"
          alt="copy-right-icon"
          width={50}
          height={50}
        />
        <Heading data={t('list5.title')} />
      </div>
      <Paragraph data={t('list5.1st')} />
      <Paragraph data={t('list5.2nd')} />
    </Box>
  );
}

export default IntellectualList;
