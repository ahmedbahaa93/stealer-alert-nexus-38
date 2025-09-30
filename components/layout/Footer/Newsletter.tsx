'use client';

import { useTranslations } from 'next-intl';
import { MoveUp } from 'lucide-react';
import { useState, useEffect } from 'react';

function Newsletter() {
  const t = useTranslations('Layout.footer.newsletter');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-auto flex bg-[url('/assets/Looper-4.svg')] bg-cover bg-center bg-no-repeat">
      <div className="my-auto space-y-6" suppressHydrationWarning={true}>
        <h3 className="text-primary-foreground text-xl">{t('title')}</h3>
        <p className="text-primary-foreground">{t('description')}</p>
        <input
          type="text"
          placeholder="Enter Your Email"
          className="bg-background w-full rounded-md p-2"
          suppressHydrationWarning={true}
        />
        <button className="text-primary-identity bg-background cursor-pointer rounded-md px-8 py-3 text-right text-lg md:ml-[60%] md:p-2 md:px-4">
          {t('send')}
        </button>
      </div>
      {isClient && (
        <div className="m-10 mt-[80%] hidden md:block">
          <MoveUp
            className="text-primary-identity bg-background size-10 cursor-pointer rounded-full p-2"
            onClick={handleScrollToTop}
          />
        </div>
      )}
    </div>
  );
}

export default Newsletter;
