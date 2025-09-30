import { routing } from '@/i18n/routing';
// import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

import { useEffect } from 'react';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

interface LangSwitchProps {
  isDark?: boolean;
}

export default function LangSwitch({ isDark = false }: LangSwitchProps) {
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
    <div
      className={`flex items-center gap-1 sm:gap-2 ${isDark ? 'bg-white/20 border-white/30' : 'bg-white border-blue-500'} rounded-md px-2 border`}
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'white',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : '#0f43b4'
      }}
    >
      {/* <Globe
        className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`}
        style={{ color: "#0f43b4" }}
      /> */}
      <LocaleSwitcherSelect isDark={isDark} defaultValue={locale} label="Select a locale">
        {routing.locales.map((cur) => (
          <option key={cur} value={cur} className={isDark ? 'text-white' : 'text-blue-500'}>
            {cur}
          </option>
        ))}
      </LocaleSwitcherSelect>
    </div>
  );
}
