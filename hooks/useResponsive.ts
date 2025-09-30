'use client';

import { useState, useEffect, useCallback } from 'react';
import { breakpoints } from '@/lib/responsive';

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(): Breakpoint | null {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const getBreakpoint = (): Breakpoint => {
      const width = window.innerWidth;

      if (width >= parseInt(breakpoints['2xl'])) return '2xl';
      if (width >= parseInt(breakpoints.xl)) return 'xl';
      if (width >= parseInt(breakpoints.lg)) return 'lg';
      if (width >= parseInt(breakpoints.md)) return 'md';
      if (width >= parseInt(breakpoints.sm)) return 'sm';

      return 'sm'; // Default fallback
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };

    // Set initial breakpoint
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.md})`);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`);
}

// Debounced scroll hook for performance
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollPosition(window.pageYOffset);
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScrollPosition = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, [handleScroll]);

  return scrollPosition;
}

// Intersection Observer hook for animations
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLElement>, boolean] {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  const callbackRef = useCallback((node: HTMLElement | null) => {
    setRef(node);
  }, []);

  return [
    callbackRef as unknown as React.RefObject<HTMLElement>,
    isIntersecting
  ];
}
