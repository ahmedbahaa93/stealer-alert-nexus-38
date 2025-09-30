'use client';

import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DynamicIcon } from './DynamicIcon';
import FaqCard from './faqs-cards/FaqCard';
import { MotionDiv, MotionP } from '@/components/ui/motion';

function Faqs() {
  // Using our updated FAQs data
  const t = useTranslations('faqs-page');
  const faqs = t.raw('faqs');
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0])); // Start with first FAQ open
  const { setShow } = useSowBreadCrumbs();

  useEffect(() => {
    setShow(true);
  }, [setShow]);

  const handleCardClick = (index: number) => {
    setOpenIndexes(prev => {
      const newOpenIndexes = new Set(prev);
      if (newOpenIndexes.has(index)) {
        newOpenIndexes.delete(index);
      } else {
        newOpenIndexes.add(index);
      }
      return newOpenIndexes;
    });
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <MotionDiv
        className="mb-2 flex items-center justify-center gap-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DynamicIcon
          src="/icons/faqs/faq.svg"
          alt="faq-icon"
          width={70}
          height={70}
        />
        <h1 className="text-primary-identity text-center text-3xl font-bold">
          {t('title')}
        </h1>
      </MotionDiv>
      <MotionP
        className="text-primary-identity mb-10 text-center font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {t('description')}
      </MotionP>
      <div className="mx-auto mt-25 max-w-2xl">
        {faqs.map((faq: any, index: number) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
          >
            <FaqCard
              title={faq.title}
              description={faq.description}
              isOpen={openIndexes.has(index)}
              onClick={() => handleCardClick(index)}
            />
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}

export default Faqs;
