'use client';

import { usePageName } from '@/context/PageNameProvider';
import { Link } from '@/i18n/routing';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

function BreadCrumb() {
  const { pageName } = usePageName(); // Get both name and key
  const locale = useLocale();
  const t = useTranslations('Layout.bread-crumb');

  return (
    <div className="mt-5 mb-14 flex px-5 md:px-35">
      <Link href="/" className="text-ring">
        {t('title')}
      </Link>
      {locale === 'en' ? <ChevronRight /> : <ChevronLeft />}
      <p className="text-primary-identity">
        {pageName?.name || (pageName?.key ? t(pageName?.key) : '')}
      </p>
    </div>
  );
}

export default BreadCrumb;
