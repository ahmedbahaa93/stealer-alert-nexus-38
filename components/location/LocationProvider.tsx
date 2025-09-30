/**
 * Location Provider Component - Super Perfect Implementation
 * Handles automatic location detection and modal management
 */

"use client";

import React, { useEffect, useState } from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { LocationModal } from './LocationModal';

interface LocationProviderProps {
    children: React.ReactNode;
    autoRequest?: boolean;
    delayMs?: number;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
    children,
    autoRequest = true,
    delayMs = 3000, // Increased delay for better UX
}) => {
    const {
        location,
        isLocationModalOpen,
        setLocationModalOpen,
        isLocationStale,
    } = useLocationStore();

    const [hasInitialized, setHasInitialized] = useState(false);

    // Initialize location check after component mounts
    useEffect(() => {
        if (!hasInitialized && autoRequest) {
            const timer = setTimeout(() => {
                // Only show modal if we don't have location or it's stale
                if (!location || isLocationStale()) {
                    console.log('🔔 Location needed, opening modal');
                    setLocationModalOpen(true);
                } else {
                    console.log('✅ Location is fresh, no need to request');
                }
                setHasInitialized(true);
            }, delayMs);

            return () => clearTimeout(timer);
        }
    }, [hasInitialized, autoRequest, delayMs, location, isLocationStale, setLocationModalOpen]);

    const handleLocationModalClose = () => {
        setLocationModalOpen(false);
    };

    const handleLocationSuccess = () => {
        setLocationModalOpen(false);
    };

    return (
        <>
            {children}
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={handleLocationModalClose}
                onSuccess={handleLocationSuccess}
                autoRequest={false}
            />
        </>
    );
};
