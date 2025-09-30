"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface NoToastContextType {
    showToast: () => void;
    success: () => void;
    error: () => void;
    warning: () => void;
    loading: () => void;
}

const NoToastContext = createContext<NoToastContextType | undefined>(undefined);

export const useCustomToast = () => {
    const context = useContext(NoToastContext);
    if (!context) {
        // Return dummy functions if context not found
        return {
            showToast: () => { },
            success: () => { },
            error: () => { },
            warning: () => { },
            loading: () => { }
        };
    }
    return context;
};

interface NoToastProviderProps {
    children: ReactNode;
}

export const NoToastProvider: React.FC<NoToastProviderProps> = ({ children }) => {
    const contextValue: NoToastContextType = {
        showToast: () => {
            console.log('Toast disabled on this page');
        },
        success: () => {
            console.log('Success toast disabled on this page');
        },
        error: () => {
            console.log('Error toast disabled on this page');
        },
        warning: () => {
            console.log('Warning toast disabled on this page');
        },
        loading: () => {
            console.log('Loading toast disabled on this page');
        }
    };

    return (
        <NoToastContext.Provider value={contextValue}>
            {children}
        </NoToastContext.Provider>
    );
};
