import type { Metadata } from 'next';

import '@/app/globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { PageNameProvider } from '@/context/PageNameProvider';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { SowBreadCrumbsProvider } from '@/context/SowBreadCrumbs';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { CustomToastProvider } from '@/components/ui/CustomToastProvider';
import { LocationProvider } from '@/components/location/LocationProvider';

export const metadata: Metadata = {
  title: 'RiseUp',
  description: 'RiseUp'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    notFound();
  }

  return (
    <CustomToastProvider>
      <QueryProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocationProvider>
            <SowBreadCrumbsProvider>
              <PageNameProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </PageNameProvider>
            </SowBreadCrumbsProvider>
          </LocationProvider>
        </NextIntlClientProvider>
      </QueryProvider>
    </CustomToastProvider>
  );
}
