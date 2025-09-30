/**
 * Location Test Component
 * Add this to any page to test location-aware pricing functionality
 */

"use client";

import React, { useState } from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { useLocationAwarePrice } from '@/hooks/useLocationAwarePrice';
import { Button } from '@/components/ui/button';

export const LocationTestComponent: React.FC = () => {
    const { location, setLocation } = useLocationStore();
    const [testPrice] = useState(1000); // Test price
    const locationAwarePrice = useLocationAwarePrice(testPrice);

    const setEgyptLocation = () => {
        const egyptLocation = {
            country: 'Egypt',
            countryCode: 'EG',
            city: 'Cairo',
            latitude: 30.0444,
            longitude: 31.2357,
            timezone: 'Africa/Cairo',
            currency: 'EGP' as const,
            paymentMethod: 'paymob' as const,
            lastUpdated: Date.now()
        };
        setLocation(egyptLocation);
    };

    const setUSALocation = () => {
        const usaLocation = {
            country: 'United States',
            countryCode: 'US',
            city: 'New York',
            latitude: 40.7128,
            longitude: -74.006,
            timezone: 'America/New_York',
            currency: 'USD' as const,
            paymentMethod: 'checkout' as const,
            lastUpdated: Date.now()
        };
        setLocation(usaLocation);
    };

    const clearLocation = () => {
        localStorage.removeItem('location-store');
        window.location.reload();
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
            <h3 className="font-bold text-lg mb-3">🧪 Location Test Panel</h3>

            <div className="space-y-3">
                {/* Current Location Info */}
                <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold text-sm">Current Location:</h4>
                    <p className="text-sm">
                        {location ? `${location.city}, ${location.country}` : 'Not detected'}
                    </p>
                    <p className="text-sm">
                        Currency: {location?.currency || 'Unknown'}
                    </p>
                    <p className="text-sm">
                        Payment: {location?.paymentMethod || 'Unknown'}
                    </p>
                </div>

                {/* Test Price Display */}
                <div className="bg-blue-50 p-3 rounded">
                    <h4 className="font-semibold text-sm">Test Price (1000):</h4>
                    <p className="text-lg font-bold text-blue-600">
                        {locationAwarePrice.formatted}
                    </p>
                </div>

                {/* Test Buttons */}
                <div className="space-y-2">
                    <Button
                        onClick={setEgyptLocation}
                        className="w-full text-sm"
                        variant="outline"
                    >
                        🇪🇬 Set to Egypt (EGP)
                    </Button>

                    <Button
                        onClick={setUSALocation}
                        className="w-full text-sm"
                        variant="outline"
                    >
                        🇺🇸 Set to USA (USD)
                    </Button>

                    <Button
                        onClick={clearLocation}
                        className="w-full text-sm"
                        variant="destructive"
                    >
                        🔄 Clear & Re-detect
                    </Button>
                </div>

                {/* Instructions */}
                <div className="text-xs text-gray-600 mt-3">
                    <p>• Use VPN to test real location detection</p>
                    <p>• Check Network tab for location headers</p>
                    <p>• Verify prices change with location</p>
                </div>
            </div>
        </div>
    );
};
