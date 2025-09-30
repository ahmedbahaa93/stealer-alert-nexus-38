'use client';

import { useEffect, useState } from 'react';
import FooterLarge from './FooterLarge';
import FooterMobile from './FooterMobile';
import FooterTablet from './FooterTablet';

function Footer() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Ensure window is defined before accessing it
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      const handleResizeWindow = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResizeWindow);
      return () => {
        window.removeEventListener('resize', handleResizeWindow);
      };
    }
  }, []);

  const mobileBreakpoint = 768; // Example breakpoint for mobile
  const tabletBreakpoint = 1250; // Example breakpoint for tablet

  if (width < mobileBreakpoint) {
    return <FooterMobile />;
  } else if (width >= mobileBreakpoint && width < tabletBreakpoint) {
    return <FooterTablet />;
  } else {
    return <FooterLarge />;
  }
}

export default Footer;
