'use client';

import { useState, useEffect } from 'react';
import { MotionDiv, MotionLI, AnimatePresence } from '@/components/ui/motion';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { AlignLeft, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

interface MobileNavProps {
  isDark?: boolean;
}

function MobileNav({ isDark = false }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Layout.nav');
  const path = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [, forceUpdate] = useState({});

  // Force re-render when auth state changes
  useEffect(() => {
    forceUpdate({});
  }, [isAuthenticated]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      // Store original styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      // Get current scroll position
      const scrollY = window.scrollY;

      // Apply scroll lock styles
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // Store scroll position for restoration
      document.body.setAttribute('data-scroll-y', scrollY.toString());

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;

        // Restore scroll position
        const savedScrollY = document.body.getAttribute('data-scroll-y');
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY));
          document.body.removeAttribute('data-scroll-y');
        }
      };
    }
  }, [isOpen]);

  // Navigation items for non-authenticated users
  const guestNavItems = [
    { name: t('home'), href: '/' },
    { name: t('aboutUs'), href: '/about' },
    { name: t('courses'), href: '/courses' },
    { name: t('blog'), href: '/blog' },
    { name: t('contactUs'), href: '/contact' },
    { name: t('faqs'), href: '/faqs' },
    { name: t('login'), href: '/login' },
    { name: t('signUp'), href: '/signup' }
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

  const menuVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: '0%',
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 sm:p-2 focus:outline-none transition-transform duration-200 hover:scale-110 active:scale-95"
        aria-label="Toggle navigation menu"
      >
        {/* Menu Icon - Responsive sizing */}
        <AlignLeft
          className={`${isDark ? 'text-white' : 'text-primary-identity'} h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8`}
          style={{ color: isDark ? 'white' : '#0f43b4' }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <MotionDiv
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 w-full h-full min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <MotionDiv
              className="bg-primary-identity fixed inset-y-0 left-0 z-50 flex w-[280px] sm:w-[320px] md:w-[360px] flex-col shadow-2xl h-screen min-h-screen max-h-screen"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
                <div className="text-primary-foreground font-bold text-lg sm:text-xl">
                  Menu
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <X className="text-primary-foreground h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <ul className="flex flex-col gap-y-3 sm:gap-y-4">
                  {navItems.map((item, index) => (
                    <MotionLI
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full"
                    >
                      <Link
                        href={item.href}
                        className={`
                          block w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg text-base sm:text-lg font-medium
                          transition-all duration-300 ease-in-out
                          hover:bg-white/10 hover:translate-x-2 hover:shadow-lg
                          ${path === item.href || (item.href !== '/' && path.startsWith(item.href))
                            ? 'bg-white/20 text-secondary-identity border-l-4 border-secondary-identity'
                            : 'text-primary-foreground hover:text-secondary-identity'
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </MotionLI>
                  ))}
                </ul>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileNav;
