'use client';

import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';
import { Sparkle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect } from 'react';

function HeroSection() {
  const { setShow } = useSowBreadCrumbs();
  const t = useTranslations('HomePage');

  useEffect(() => {
    setShow(false);
  }, [setShow]);

  // Get current locale to check for RTL
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className={`hero min-h-screen text-primary-foreground pb-20 md:pb-24 px-10 lg:px-16 lg:pb-36 ${isRTL && 'flex justify-end'}`} data-section="hero">
      <div
        className={`text-hero lg:w-1/2 mt-10 lg:mt-16 overflow-hidden`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className={isRTL ? 'text-right pr-10 pt-20' : 'pl-10 pt-20'}>
          <h1 className="mb-3 text-2xl text-[#0e43b4] font-bold sm:text-3xl lg:text-4xl xl:w-[90%] leading-tight">
            {t('title')}
          </h1>
          <p className="mb-5 text-black text-base sm:text-lg lg:text-xl leading-relaxed xl:w-[95%]">{t('des')}</p>

          <h2 className="mb-4 text-xl font-bold text-[#0e43b4] sm:text-2xl lg:text-3xl">{t('list.title')}</h2>
          <ul className="space-y-3 text-black text-sm sm:text-base lg:text-lg">
            {t.raw('list.list').map((item: string, index: number) => {
              return (
                <li key={index} className={`flex items-center ${isRTL && 'space-x-reverse flex-row-reverse justify-end'} space-x-2`}>
                  {isRTL && <span>{item}</span>}
                  <Sparkle className="fill-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#0e43b4]" />
                  {!isRTL && <span>{item}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
