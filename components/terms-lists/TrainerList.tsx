import { useTranslations } from 'next-intl';
import Paragraph from './Paragraph';
import Heading from './Heading';
import Box from './Box';
import { DynamicIcon } from '../DynamicIcon';

function TrainerList() {
  const t = useTranslations('terms-page');

  return (
    <Box>
      <div className="my-5 flex items-center gap-7">
        <DynamicIcon
          src="/icons/terms/tutor-icon 1.svg"
          alt="instructor-icon"
          width={50}
          height={50}
        />
        <Heading data={t('list4.title')} />
      </div>
      <Paragraph data={t('list4.1st')} />
      <Paragraph data={t('list4.2nd')} />
    </Box>
  );
}

export default TrainerList;
