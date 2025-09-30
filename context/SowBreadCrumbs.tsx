/* eslint-disable no-unused-vars */
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SowBreadCrumbsContextType {
  show: boolean;
  setShow: (show: boolean) => void;
}

const SowBreadCrumbsContext = createContext<SowBreadCrumbsContextType | undefined>(
  undefined
);

export function SowBreadCrumbsProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(true);

  return (
    <SowBreadCrumbsContext.Provider value={{ show, setShow }}>
      {children}
    </SowBreadCrumbsContext.Provider>
  );
}

export function useSowBreadCrumbs() {
  const context = useContext(SowBreadCrumbsContext);
  if (context === undefined) {
    throw new Error("useSowBreadCrumbs must be used within a SowBreadCrumbsProvider");
  }
  return context;
}
