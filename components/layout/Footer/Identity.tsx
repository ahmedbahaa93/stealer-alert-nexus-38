import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { DynamicIcon } from '@/components/DynamicIcon';

function Identity() {
  const t = useTranslations('Layout.footer');

  return (
    <div className="flex flex-col justify-start p-5 px-10">
      <Image
        src="/assets/footer-logo.svg"
        alt="logo"
        width={200}
        height={200}
        className="md:-ml-13"
      />
      <p className="text-primary-foreground md:-mt-8 w-42 max-md:mx-auto">{t('identity')}</p>
      <div className="mt-4 flex items-center justify-evenly md:w-32">
        <DynamicIcon
          src="/icons/facebook.svg"
          alt="facebook-logo"
          className="mt-2"
          width={30}
        />
        <DynamicIcon src="/icons/linkedin.svg" alt="linkidin-logo" />
        <DynamicIcon src="/icons/instagram.svg" alt="instagram-logo" />
        <DynamicIcon src="/icons/X.svg" alt="X-logo" />
      </div>
    </div>
  );
}

export default Identity;
