import { useTranslations } from 'next-intl';
import Heading from './Heading';
import { DynamicIcon } from '../DynamicIcon';
import MiniCard from './MiniCard';
import Image from 'next/image';
import { MotionDiv } from '@/components/ui/motion';

function GlobalSection() {
  const t = useTranslations('about-page.4th-section');

  return (
    <div className="mt-16 will-change-auto">
      <MotionDiv
        className="flex items-center justify-center gap-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <DynamicIcon
          src="/icons/about/global.svg"
          alt="global-icon"
          width={80}
        />
        <Heading data={t('title')} />
      </MotionDiv>
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-3 gap-5 max-lg:grid-cols-1">
        {t.raw('cards').map((item: any, index: any) => {
          return (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.03, 0.1),
                ease: "easeOut"
              }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ willChange: 'transform' }}
            >
              <MiniCard
                key={index}
                title={item.title}
                code={item.code}
                address={item.address}
              />
            </MotionDiv>
          );
        })}
      </div>
      <MotionDiv
        className="mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Image
          src="/assets/about/map.svg"
          alt="map-photo"
          width={545}
          height={240}
          className="mx-auto"
          priority
          loading="eager"
        />
      </MotionDiv>
    </div>
  );
}

export default GlobalSection;
