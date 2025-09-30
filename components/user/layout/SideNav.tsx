'use client';

import { Link, usePathname } from '@/i18n/routing';
import { MotionLI } from '@/components/ui/motion';
import { BookOpen, CreditCard, ScrollText, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import SideCard from './SideCard';

function SideNav() {
  const t = useTranslations('user-nav');
  const path = usePathname();

  const navItems = [
    { name: t('Profile'), href: '/profile', icon: <User /> },
    { name: t('Personal'), href: '/user-info', icon: <User /> },
    { name: t('Courses'), href: '/my-courses', icon: <BookOpen /> },
    { name: t('Certificates'), href: '/certificates', icon: <ScrollText /> },
    { name: t('Payment'), href: '/payments', icon: <CreditCard /> },
    { name: t('Settings'), href: '/settings', icon: <Settings /> }
  ];

  return (
    <SideCard className="max-xl:hidden">
      <ul className="flex flex-col gap-y-5">
        {navItems.map((item, index) => (
          <MotionLI
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <Link
              href={item.href}
              className={`bg-primary-foreground text-primary-identity hover:bg-primary-identity hover:text-primary-foreground flex gap-2 rounded-lg p-3 px-3 drop-shadow-lg drop-shadow-[#00000040] duration-300 ease-in-out ${path === item.href || (item.href !== '/' && path.startsWith(item.href)) ? 'bg-primary-identity text-white' : ''}`}
            >
              {item.icon} {item.name}
            </Link>
          </MotionLI>
        ))}
      </ul>
    </SideCard>
  );
}

export default SideNav;
