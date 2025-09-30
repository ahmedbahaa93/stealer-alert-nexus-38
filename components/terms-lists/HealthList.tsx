import { useTranslations } from 'next-intl';
import Paragraph from './Paragraph';
import Heading from './Heading';
import Box from './Box';
import { DynamicIcon } from '../DynamicIcon';

function HealthList() {
  const t = useTranslations('terms-page');

  return (
    <Box>
      <div className="my-5 flex items-center gap-7">
        <DynamicIcon
          src="/icons/terms/shield-tick.svg"
          alt="shield-icon"
          width={50}
          height={50}
        />
        <Heading data={t('list6.title')} />
      </div>
      <Paragraph data={t('list6.1st')} />
    </Box>
  );
}

export default HealthList;
