'use client';

import { useTranslations } from 'next-intl';
import Card from '../Card';
import Heading from '../Heading';
import LangSwitch from './LangSwitch';

function LangCard() {
  const t = useTranslations('settings.lang');

  return (
    <Card>
      <Heading data={t('title')} />
      <div>
        <LangSwitch />
      </div>
    </Card>
  );
}

export default LangCard;
