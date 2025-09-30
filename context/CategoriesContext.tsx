"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CategoriesContextType {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  selectedSubCategoryId: string | null;
  setSelectedSubCategoryId: (id: string | null) => void;
  categoryName: string;
  setCategoryName: (name: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

interface CategoriesProviderProps {
  children: ReactNode;
  initialCategoryId?: string | null;
  initialCategoryName?: string;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children,
  initialCategoryId = null,
  initialCategoryName = "Web Development"
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>(initialCategoryName);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page when subcategory changes
  const handleSetSelectedSubCategoryId = (id: string | null) => {
    setSelectedSubCategoryId(id);
    setCurrentPage(1); // Reset to first page when switching subcategories
  };

  const value = {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubCategoryId,
    setSelectedSubCategoryId: handleSetSelectedSubCategoryId,
    categoryName,
    setCategoryName,
    currentPage,
    setCurrentPage,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider');
  }
  return context;
};
