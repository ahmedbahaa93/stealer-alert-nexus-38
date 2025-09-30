import { useTranslations } from 'next-intl';
import { DynamicIcon } from './DynamicIcon';
import VisionSection from './about/VisionSection';
import WhatWeOffer from './about/WhatWeOffer';
import GlobalSection from './about/GlobalSection';
import CertificationsSection from './about/CertificationsSection';
import OurPromise from './about/OurPromise';

function About() {
  const t = useTranslations('about-page');
  return (
    <section className="pb-30 pt-10">
      <div className="flex items-center justify-center gap-5">
        <DynamicIcon
          src="/icons/about/about.svg"
          alt="about-icon"
          width={100}
          height={100}
        />
        <h1 className="text-primary-identity mt-3 text-3xl font-bold">
          {t('title')}
        </h1>
      </div>
      <WhatWeOffer />
      <VisionSection />
      <OurPromise />
      <GlobalSection />
      <CertificationsSection />
    </section>
  );
}

export default About;
