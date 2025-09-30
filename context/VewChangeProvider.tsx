'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface ViewChangeContextType {
  viewMode: 'grid' | 'list';
  // eslint-disable-next-line no-unused-vars
  setViewMode: (mode: 'grid' | 'list') => void;
}

// Create context with default values
const ViewChangeContext = createContext<ViewChangeContextType | undefined>(
  undefined
);

// Create the provider
export const ViewChangeProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default to grid view

  return (
    <ViewChangeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewChangeContext.Provider>
  );
};

// Custom hook for easy access
export const useViewChange = (): ViewChangeContextType => {
  const context = useContext(ViewChangeContext);
  if (!context) {
    throw new Error('useViewChange must be used within a ViewChangeProvider');
  }
  return context;
};
