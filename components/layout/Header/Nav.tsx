'use client';

import { useEffect, useState } from 'react';
import BreadCrumb from '@/components/BreadCrumb';
import NavContainer from './NavContainer';
import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';
import { usePathname } from '@/i18n/routing';
import './NavStyles.css';

function Nav() {
  const { show } = useSowBreadCrumbs();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

const isCourseDetails = pathname.includes('/course-details/') || pathname.includes('/articles/');

  // Debug logging

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      document.documentElement.style.setProperty('--nav-height', `${header.offsetHeight}px`);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled past threshold
      const scrolled = currentScrollY > 20;
      setIsScrolled(scrolled);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className={`${isScrolled ? 'fixed-nav nav-shadow' : 'fixed-nav'} ${!isVisible ? 'nav-hidden' : ''}`}>
        <nav
          className={`${isCourseDetails ? 'nav-light' : 'nav-dark'} flex items-center justify-between p-1 px-4 sm:p-2 sm:px-5 md:px-6 lg:px-8 xl:px-12 2xl:px-16`}
          style={{
            backgroundColor: isCourseDetails ? 'white' : '#0f43b4',
            color: isCourseDetails ? '#0f43b4' : 'white'
          }}
        >
          <NavContainer isDarkNav={!isCourseDetails} />
        </nav>
      </header>
      <div className={`nav-spacer ${isScrolled ? 'active' : ''}`}></div>
      {show && <BreadCrumb />}
    </>
  );
}

export default Nav;
