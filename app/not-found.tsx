import { Link } from '@/i18n/routing';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import './globals.css';
import Nav from '@/components/layout/Header/Nav';
import { PageNameProvider } from '@/context/PageNameProvider';
import { MoveLeft, MoveRight } from 'lucide-react';
import { SowBreadCrumbsProvider } from '@/context/SowBreadCrumbs';

export default function NotFound() {
  const locale = useLocale();

  const t = useTranslations('error-page');
  return (
    <NextIntlClientProvider>
      <PageNameProvider>
        <SowBreadCrumbsProvider>
          <Nav />
          <div className="common-bg relative flex flex-col items-center justify-center px-10 md:px-30 pb-20">
            <h1 className="text-primary-identity text-6xl font-bold">
              {t('title')}
            </h1>
            <p className="text-primary-identity mt-2 text-3xl">
              {t('sub-title')}
            </p>
            <div className="mt-5 md:mt-10">
              {/* Using img element for simplicity, can be replaced with next/image if preferred */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/not-found-404.svg"
                alt="404 Not Found"
                width={450}
                height={450}
                className="mx-auto w-3/4 max-w-[750px]"
              />
            </div>
            <Link
              href="/"
              className="mt-5 flex items-center gap-1 rounded-lg border border-primary-identity bg-primary-identity px-8 py-2 font-bold text-white hover:bg-white hover:text-primary-identity"
            >
              {locale === 'en' ? <MoveLeft /> : <MoveRight />}
              {t('link')}
            </Link>
          </div>
        </SowBreadCrumbsProvider>
      </PageNameProvider>
    </NextIntlClientProvider>
  );
}
