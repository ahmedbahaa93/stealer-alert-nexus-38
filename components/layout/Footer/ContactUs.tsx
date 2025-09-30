import { Mail, MapPin, PhoneCall } from 'lucide-react';
import { useTranslations } from 'next-intl';

function ContactUs() {
  const t = useTranslations('Layout.footer.contact-us');

  return (
    <div className="flex flex-col gap-y-6 max-md:mx-auto md:my-auto">
      <h3 className="text-primary-foreground text-xl">{t('title')}</h3>
      <div className="flex gap-2 max-md:items-center max-md:justify-center">
        <MapPin className="text-primary-foreground size-6" />
        <p className="text-primary-foreground w-[40%]">{t('address')}</p>
      </div>
      <div className="flex gap-2 max-md:items-center max-md:justify-center">
        <Mail className="text-primary-foreground siz-6" />
        <p className="text-primary-foreground w-[40%] wrap-anywhere">
          {t('email')}
        </p>
      </div>
      <div className="flex gap-2 max-md:items-center max-md:justify-center">
        <PhoneCall className="text-primary-foreground size-6" />
        <p className="text-primary-foreground w-[40%]">{t('number')}</p>
      </div>
    </div>
  );
}

export default ContactUs;
