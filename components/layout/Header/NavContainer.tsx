import { useEffect, useState } from 'react';
import LangSwitch from './LangSwitch';
import Logo from './Logo';
import EnhancedMobileMenu from './EnhancedMobileMenu';
import NavAction from './NavAction';
import NavActionMobile from './NavActionMobile';
import Navigation from './Navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useLocale } from 'next-intl';

interface NavContainerProps {
  isDarkNav?: boolean;
}

function NavContainer({ isDarkNav = false }: NavContainerProps) {
  const [width, setWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // More responsive breakpoints for better mobile experience
  const desktopBreakpoint = 1024; // lg breakpoint
  const tabletBreakpoint = 768; // md breakpoint

  useEffect(() => {
    setIsClient(true);
    const handleResizeWindow = () => setWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      // subscribe to window resize event "onComponentDidMount"
      window.addEventListener('resize', handleResizeWindow);
    }
    return () => {
      // unsubscribe "onComponentDestroy"
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResizeWindow);
      }
    };
  }, []);

  // Force re-render when auth state changes
  useEffect(() => {
    // This ensures the component re-renders when auth state changes
  }, [isAuthenticated]);

  // Show loading state until client is hydrated
  if (!isClient) {
    return (
      <div className="w-full flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex gap-4 lg:gap-6 xl:gap-8 items-center">
          <Logo isDark={isDarkNav} />
          <LangSwitch isDark={isDarkNav} />
        </div>
        <div className="flex-1 flex justify-center mx-4">
          <Navigation isDark={isDarkNav} />
        </div>
        <div className="flex justify-end">
          <NavAction isDark={isDarkNav} />
        </div>
      </div>
    );
  }

  // Desktop layout (lg and above)
  if (width >= desktopBreakpoint) {
    return (
      <div className="w-full flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex gap-4 lg:gap-6 xl:gap-8 items-center">
          <Logo isDark={isDarkNav} />
          <LangSwitch isDark={isDarkNav} />
        </div>
        <div className="flex-1 flex justify-center mx-4">
          <Navigation isDark={isDarkNav} />
        </div>
        <div className="flex justify-end">
          <NavAction isDark={isDarkNav} />
        </div>
      </div>
    );
  }

  // Tablet layout (md to lg)
  if (width >= tabletBreakpoint) {
    return (
      <div className="w-full flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`flex gap-4 md:gap-6 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <EnhancedMobileMenu isDark={isDarkNav} />
          <Logo isDark={isDarkNav} />
        </div>
        <div className={`flex gap-2 md:gap-4 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <LangSwitch isDark={isDarkNav} />
          <NavActionMobile isDark={isDarkNav} />
        </div>
      </div>
    );
  }

  // Mobile layout (below md)
  return (
    <div className="w-full flex items-center justify-between py-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {isRTL ? (
        <>
          {/* RTL Layout: Logo on right, controls on left */}
          <div className="flex items-center gap-2">
            <NavActionMobile isDark={isDarkNav} />
            <LangSwitch isDark={isDarkNav} />
            <EnhancedMobileMenu isDark={isDarkNav} />
          </div>
          <div className="flex items-center">
            <Logo isDark={isDarkNav} />
          </div>
        </>
      ) : (
        <>
          {/* LTR Layout: Logo on left, controls on right */}
          <div className="flex items-center">
            <Logo isDark={isDarkNav} />
          </div>
          <div className="flex items-center gap-2">
            <LangSwitch isDark={isDarkNav} />
            <NavActionMobile isDark={isDarkNav} />
            <EnhancedMobileMenu isDark={isDarkNav} />
          </div>
        </>
      )}
    </div>
  );
}

export default NavContainer;
