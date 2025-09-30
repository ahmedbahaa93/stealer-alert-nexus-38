"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CustomToast, ToastOptions } from './CustomToast';

interface Toast extends ToastOptions {
    id: string;
}

interface ToastContextType {
    // eslint-disable-next-line no-unused-vars
    showToast: (_options: Omit<ToastOptions, 'id'>) => void;
    // eslint-disable-next-line no-unused-vars
    success: (_title: string, _description?: string, _duration?: number) => void;
    // eslint-disable-next-line no-unused-vars
    error: (_title: string, _description?: string, _duration?: number) => void;
    // eslint-disable-next-line no-unused-vars
    warning: (_title: string, _description?: string, _duration?: number) => void;
    // eslint-disable-next-line no-unused-vars
    loading: (_title: string, _description?: string, _duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useCustomToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useCustomToast must be used within a CustomToastProvider');
    }
    return context;
};

interface CustomToastProviderProps {
    children: ReactNode;
}

export const CustomToastProvider: React.FC<CustomToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((options: Omit<ToastOptions, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = {
            ...options,
            id,
            duration: options.duration || 5000
        };

        setToasts(prev => [...prev, newToast]);
    }, []);

    const success = useCallback((title: string, description?: string, duration?: number) => {
        showToast({
            type: 'success',
            title,
            description,
            duration
        });
    }, [showToast]);

    const error = useCallback((title: string, description?: string, duration?: number) => {
        showToast({
            type: 'error',
            title,
            description,
            duration
        });
    }, [showToast]);

    const warning = useCallback((title: string, description?: string, duration?: number) => {
        showToast({
            type: 'warning',
            title,
            description,
            duration
        });
    }, [showToast]);

    const loading = useCallback((title: string, description?: string, duration?: number) => {
        showToast({
            type: 'loading',
            title,
            description,
            duration: duration || 10000 // Loading toasts should last longer by default
        });
    }, [showToast]);

    const contextValue: ToastContextType = {
        showToast,
        success,
        error,
        warning,
        loading
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="custom-toast-container">
                {toasts.map((toast) => (
                    <CustomToast
                        key={toast.id}
                        {...toast}
                        onRemove={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
