/**
 * Location Provider Component
 * Automatically detects user location on app startup and manages location state
 */

"use client";

import React, { useEffect, useState } from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { locationService } from '@/lib/services/locationService';
import { LocationModal } from '@/components/location/LocationModal';

interface LocationProviderProps {
    children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    const {
        location,
        setLocation,
        isLocationModalOpen,
        setLocationModalOpen,
        isLocationStale
    } = useLocationStore();

    const [hasTriedAutoDetection, setHasTriedAutoDetection] = useState(false);

    useEffect(() => {
        const initializeLocation = async () => {
            // Skip if we already have valid location data
            if (location && !isLocationStale()) {
                console.log('✅ Using existing valid location:', location);
                return;
            }

            // Skip if we already tried auto-detection in this session
            if (hasTriedAutoDetection) {
                return;
            }

            setHasTriedAutoDetection(true);

            try {
                console.log('🔍 Auto-detecting location...');
                const detectedLocation = await locationService.getUserLocation();

                if (detectedLocation) {
                    console.log('✅ Location auto-detected:', detectedLocation);
                    setLocation(detectedLocation);
                    return;
                }
            } catch (error) {
                console.warn('⚠️ Auto location detection failed:', error);
            }

            // If auto-detection failed and we don't have valid location, show modal
            if (!location || isLocationStale()) {
                console.log('🏠 Showing location modal for manual selection');
                setLocationModalOpen(true);
            }
        };

        // Small delay to ensure the app is fully loaded
        const timer = setTimeout(initializeLocation, 1000);

        return () => clearTimeout(timer);
    }, [location, setLocation, isLocationModalOpen, setLocationModalOpen, isLocationStale, hasTriedAutoDetection]);

    const handleLocationSuccess = () => {
        console.log('✅ Location successfully set');
        setLocationModalOpen(false);
    };

    const handleLocationModalClose = () => {
        setLocationModalOpen(false);

        // If user closes modal without selecting location, set default
        if (!location) {
            console.log('🌍 Setting default location (US)');
            const defaultLocation = locationService.getDefaultLocation();
            setLocation(defaultLocation);
        }
    };

    return (
        <>
            {children}

            {/* Location Modal */}
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={handleLocationModalClose}
                onSuccess={handleLocationSuccess}
                autoRequest={false} // We handle auto-request in useEffect
            />
        </>
    );
};
