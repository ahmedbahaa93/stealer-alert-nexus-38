'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Locale, routing, usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
  isDark?: boolean;
};

export default function LocaleSwitcherSelect({ defaultValue, label, isDark = false }: Props) {
  const router = useRouter();

  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(nextLocale: string) {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: nextLocale as Locale }
    );
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger
        className={`${isDark ? 'text-white' : 'text-blue-500'} h-6 sm:h-7 w-[80px] sm:w-[90px] lg:w-[95px] border-none bg-transparent focus:ring-0 focus:ring-offset-0 text-xs sm:text-sm`}
        style={{ color: isDark ? 'white' : '#0f43b4' }}
        aria-label={label}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="z-[9998] bg-white border shadow-lg"
        style={{ zIndex: 9998 }}
        position="popper"
        sideOffset={4}
      >
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale === 'en' ? 'English' : 'العربيه'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
