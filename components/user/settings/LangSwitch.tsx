import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

import { useEffect } from 'react';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LangSwitch() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    if (locale === 'ar') {
      document.documentElement.className = 'ar';
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.className = '';
      document.documentElement.dir = 'ltr';
    }
  }, [locale]);

  return (
    <div className="flex items-center">
      <Globe className="text-primary-foreground" />
      <LocaleSwitcherSelect defaultValue={locale} label="Select a locale">
        {routing.locales.map((cur) => (
          <option key={cur} value={cur} className="text-primary-foreground">
            {cur}
          </option>
        ))}
      </LocaleSwitcherSelect>
    </div>
  );
}
