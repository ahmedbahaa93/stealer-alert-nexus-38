import { useTranslations } from 'next-intl';
import { DynamicIcon } from './DynamicIcon';
import AddressInfo from './contact/AddressInfo';
import { ContactForm } from './contact/ContactForm';
import SelectCountry from './contact/SelectCountry';
import FixedCardContainer from './contact/FixedCardContainer';

function ContactUs() {
  const t = useTranslations('contact-page');

  return (
    <section className="pb-25 pt-10 min-h-screen">
      <div className="flex items-center justify-center gap-5">
        <DynamicIcon
          src="/icons/contact/customer-service.svg"
          alt="customer-service-icon"
          width={80}
        />
        <h1 className="text-primary-identity mt-3 text-3xl font-bold max-sm:px-5">
          {t('title')}
        </h1>
      </div>
      <p className="text-primary-identity mt-3 text-center text-lg max-w-4xl mx-auto px-4">
        {t('description')}
      </p>
      <div className="mt-10 w-full px-4">
        <div className="flex flex-col items-center justify-center">
          <SelectCountry />
        </div>

        {/* Responsive cards container */}
        <div className="mx-auto mt-20 grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Contact Form Card */}
          <div className="w-full h-full">
            <FixedCardContainer>
              <ContactForm />
            </FixedCardContainer>
          </div>

          {/* Address Info Card */}
          <div className="w-full h-full">
            <FixedCardContainer>
              <AddressInfo />
            </FixedCardContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
