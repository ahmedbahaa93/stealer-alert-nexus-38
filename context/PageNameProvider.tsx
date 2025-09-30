'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface PageNameContextType {
  pageName: { name: string; key: string };
  // eslint-disable-next-line no-unused-vars
  setPageName: (data: { name: string; key: string }) => void;
}

// Create context with default values
const PageNameContext = createContext<PageNameContextType | undefined>(
  undefined
);

// Create the provider
export const PageNameProvider = ({ children }: { children: ReactNode }) => {
  const [pageName, setPageName] = useState<{ name: string; key: string }>({ name: '', key: '' });

  return (
    <PageNameContext.Provider value={{ pageName, setPageName }}>
      {children}
    </PageNameContext.Provider>
  );
};

// Custom hook for easy access
export const usePageName = (): PageNameContextType => {
  const context = useContext(PageNameContext);
  if (!context) {
    throw new Error('usePageName must be used within a PageNameProvider');
  }
  return context;
};
