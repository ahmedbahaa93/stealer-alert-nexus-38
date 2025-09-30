"use client";

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useClientAuth } from '@/hooks/useClientAuth';

interface NavigationProps {
  isDark?: boolean;
}

function Navigation({ isDark = false }: NavigationProps) {
  const t = useTranslations('Layout.nav');
  const path = usePathname();
  const { isAuthenticated } = useClientAuth();
  const locale = useLocale();
  const isRTL = locale === 'ar';



  // Navigation items for non-authenticated users
  const guestNavItems = [
    { name: t('home'), href: '/' },
    { name: t('aboutUs'), href: '/about' },
    { name: t('courses'), href: '/courses' },
    { name: t('blog'), href: '/blog' },
    { name: t('contactUs'), href: '/contact' },
    { name: t('faqs'), href: '/faqs' }
  ];

  // Navigation items for authenticated users
  const authNavItems = [
    { name: t('home'), href: '/' },
    { name: t('aboutUs'), href: '/about' },
    { name: t('courses'), href: '/courses' },
    { name: t('blog'), href: '/blog' },
    { name: t('contactUs'), href: '/contact' },
    { name: t('faqs'), href: '/faqs' }
  ];

  const navItems = isAuthenticated ? authNavItems : guestNavItems;

  return (
    <div className="flex items-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <ul className={`flex gap-x-6 lg:gap-x-8 xl:gap-x-10 ${isRTL ? 'space-x-reverse' : ''}`}>
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`
                text-sm lg:text-base font-medium
                transition-all duration-200 ease-in-out
                relative py-1 px-1
                ${path === item.href || (item.href !== '/' && path.startsWith(item.href))
                  ? `${isDark ? 'text-white after:bg-white' : 'text-blue-600 after:bg-blue-600'} after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:rounded-full`
                  : `${isDark ? 'text-white/80 hover:text-white after:bg-white' : 'text-gray-800 hover:text-blue-600 after:bg-blue-600'} after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center`
                }
              `}
              style={{
                color: isDark ? 'white' : '#374151'
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navigation;
