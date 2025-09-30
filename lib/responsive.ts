// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Mobile-first media queries
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`
} as const;

// Utility functions for responsive design
export const getResponsiveValue = <T>(
  values: Partial<Record<keyof typeof breakpoints | 'base', T>>,
  currentBreakpoint?: keyof typeof breakpoints
): T | undefined => {
  if (currentBreakpoint && values[currentBreakpoint] !== undefined) {
    return values[currentBreakpoint];
  }

  if (values.base !== undefined) {
    return values.base;
  }

  // Return the largest available value as fallback
  const availableBreakpoints = Object.keys(breakpoints) as Array<
    keyof typeof breakpoints
  >;
  for (const bp of availableBreakpoints.reverse()) {
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
};

// Common responsive classes
export const responsiveClasses = {
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  },
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl'
  },
  spacing: {
    section: 'py-12 sm:py-16 lg:py-20',
    component: 'py-6 sm:py-8 lg:py-10'
  }
} as const;
