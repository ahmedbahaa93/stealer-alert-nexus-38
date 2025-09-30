'use client';

import { Link, usePathname } from '@/i18n/routing';
import { AnimatePresence, MotionAside, MotionLI } from '@/components/ui/motion';
import {
  BookOpen,
  ChevronRight,
  CreditCard,
  ScrollText,
  Settings,
  User
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SideCard from './SideCard';

function SideNavMob() {
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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Drawer Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-primary-identity fixed top-1/2 left-2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg xl:hidden"
      >
        <ChevronRight
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <MotionAside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg"
          >
            <SideCard className="h-full overflow-y-auto xl:hidden">
              <ul className="flex flex-col gap-y-5">
                {navItems.map((item, index) => (
                  <MotionLI
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`flex gap-2 rounded-lg p-3 px-3 drop-shadow-lg drop-shadow-[#00000040] transition-all duration-300 ease-in-out ${path === item.href ||
                          (item.href !== '/' && path.startsWith(item.href))
                          ? 'bg-primary-identity text-white'
                          : 'bg-primary-foreground text-primary-identity hover:bg-primary-identity hover:text-primary-foreground'
                        }`}
                    >
                      {item.icon} {item.name}
                    </Link>
                  </MotionLI>
                ))}
              </ul>
            </SideCard>
          </MotionAside>
        )}
      </AnimatePresence>
    </>
  );
}

export default SideNavMob;
