'use client';

import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { DynamicIcon } from '../DynamicIcon';
import Box from './Box';
import Heading from './Heading';
import MainList from './MainList';
import Paragraph from './Paragraph';

function CancellationList() {
  const t = useTranslations('terms-page');
  const { setShow } = useSowBreadCrumbs();

  useEffect(() => {
    setShow(true);
  }, [setShow]);

  return (
    <Box>
      <div className="my-5 flex items-center gap-7">
        <DynamicIcon
          src="/icons/terms/no-data-icon 1.svg"
          alt="sheet-icon"
          width={50}
          height={50}
        />
        <Heading data={t('list2.title')} />
      </div>

      <Paragraph data={t('list2.content.1st')} />

      <Paragraph data={t('list2.content.2nd')} />
      <MainList t={t} path="list2.content.ul" />

      <Paragraph data={t('list2.content.3rd')} />
      <MainList t={t} path="list2.content.ul2" />
    </Box>
  );
}

export default CancellationList;
