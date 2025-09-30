'use client';

import { useTranslations } from 'next-intl';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Image from 'next/image';
import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';
import { useEffect } from 'react';

function WhatWeOffer() {
  const { setShow } = useSowBreadCrumbs();

  useEffect(() => {
    setShow(true);
  }, [setShow]);

  const t = useTranslations('about-page.1st-section');
  return (
    <div className="flex flex-wrap max-lg:flex-col">
      <div className="my-auto space-y-10 max-lg:order-2 lg:w-[50%]">
        <Heading data={t('title')} />
        <Paragraph className="text-lg md:w-[80%]" data={t('description')} />
      </div>
      <div className="mx-auto max-lg:order-1 lg:w-[w-50%]">
        <Image
          src="/assets/about/people.svg"
          alt="people-groupe-photo"
          width={350}
          height={350}
        />
      </div>
    </div>
  );
}

export default WhatWeOffer;
