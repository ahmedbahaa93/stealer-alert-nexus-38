import { useTranslations } from 'next-intl';
import { DynamicIcon } from '../DynamicIcon';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Testimonial from './Testimonial';

function CertificationsSection() {
  const t = useTranslations('about-page.5th-section');

  return (
    <div className="mt-25 text-center">
      <div className="flex items-center justify-center gap-5">
        <DynamicIcon
          src="/icons/about/cert.svg"
          alt="certification-icon"
          width={80}
        />
        <Heading data={t('title')} />
      </div>
      <div className="mt-5 flex items-center justify-center md:px-40 2xl:px-110">
        <Paragraph data={t('description')} className="text-lg" />
      </div>
      <Testimonial />
    </div>
  );
}

export default CertificationsSection;
