/**
 * Location Modal Component
 * Super perfect modal for requesting user location with advanced error handling
 */

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    MapPin,
    Globe,
    Shield,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    X,
    Loader2,
    Navigation,
    Eye,
    EyeOff,
    Info
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/lib/store/locationStore';
import { locationService } from '@/lib/services/locationService';
import { useCustomToast } from '@/components/ui/CustomToastProvider';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    autoRequest?: boolean;
}

type LocationStep = 'intro' | 'requesting' | 'success' | 'error' | 'manual';

export const LocationModal: React.FC<LocationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    autoRequest = false,
}) => {
    const t = useTranslations('location');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const customToast = useCustomToast();

    const {
        location,
        setLocation,
        setLocationLoading,
        setLocationError,
        setHasLocationPermission,
    } = useLocationStore();

    const [currentStep, setCurrentStep] = useState<LocationStep>('intro');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unavailable'>('prompt');

    // Check permission status on mount
    useEffect(() => {
        const checkPermission = async () => {
            const status = await locationService.checkLocationPermission();
            setPermissionStatus(status);
        };

        if (isOpen) {
            checkPermission();
        }
    }, [isOpen]);

    const handleLocationRequest = useCallback(async () => {
        setCurrentStep('requesting');
        setIsProcessing(true);
        setLocationLoading(true);
        setErrorMessage('');

        try {
            console.log('🔍 Starting location request...');
            const locationData = await locationService.getUserLocation();

            console.log('✅ Location detected successfully:', locationData);
            setLocation(locationData);
            setHasLocationPermission(true);
            setCurrentStep('success');

            customToast.success(
                '📍 Location Detected Successfully',
                `${locationService.formatLocationString(locationData)} - Currency: ${locationData.currency}`,
                5000
            );

            // Auto-close after success
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);

        } catch (error) {
            console.error('❌ Location request failed:', error);

            const errorMsg = error instanceof Error ? error.message : 'Failed to get location';
            setErrorMessage(errorMsg);
            setLocationError(errorMsg);
            setCurrentStep('error');

            // Show friendly error message
            if (errorMsg.includes('Too many')) {
                customToast.error(
                    '⏰ Rate Limit Reached',
                    'Please wait a moment before trying again, or select your country manually.',
                    8000
                );
            } else {
                customToast.error(
                    '❌ Location Detection Failed',
                    'Unable to detect location automatically. Please select your country manually.',
                    6000
                );
            }
        } finally {
            setIsProcessing(false);
            setLocationLoading(false);
        }
    }, [
        setLocation,
        setLocationLoading,
        setLocationError,
        setHasLocationPermission,
        customToast,
        onSuccess,
        onClose,
    ]);

    // Auto-request location if enabled and no location exists
    useEffect(() => {
        if (isOpen && autoRequest && !location) {
            handleLocationRequest();
        }
    }, [isOpen, autoRequest, location, handleLocationRequest]);

    const handleManualLocation = useCallback(() => {
        setCurrentStep('manual');
    }, []);

    const handleCountrySelect = useCallback((countryCode: string, countryName: string) => {
        const manualLocation = {
            country: countryName,
            countryCode,
            city: 'Unknown',
            latitude: 0,
            longitude: 0,
            timezone: 'UTC',
            currency: locationService.getCurrencyForCountry(countryCode),
            paymentMethod: locationService.getPaymentMethodForCountry(countryCode),
            lastUpdated: Date.now(),
        };

        setLocation(manualLocation);
        setCurrentStep('success');

        const paymentInfo = countryCode.toUpperCase() === 'EG' ?
            'Paymob Payment (EGP)' : 'Stripe Payment (USD)';

        customToast.success(
            '🌍 Country Selected',
            `${countryName} - ${manualLocation.currency} with ${paymentInfo}`,
            5000
        );

        setTimeout(() => {
            onSuccess?.();
            onClose();
        }, 1500);
    }, [setLocation, customToast, onSuccess, onClose]);

    const handleSkip = useCallback(() => {
        // Set default location (US)
        const defaultLocation = {
            country: 'United States',
            countryCode: 'US',
            city: 'New York',
            latitude: 40.7128,
            longitude: -74.0060,
            timezone: 'America/New_York',
            currency: 'USD' as const,
            paymentMethod: 'checkout' as const,
            lastUpdated: Date.now(),
        };

        setLocation(defaultLocation);

        customToast.success(
            '🌍 Default Location Set',
            'Using US location and USD currency',
            4000
        );

        onSuccess?.();
        onClose();
    }, [setLocation, customToast, onSuccess, onClose]);

    const renderIntroStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('title')}
                </h2>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                    {t('description')}
                </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-yellow-900 mb-1">
                                {t('privacy.title')}
                            </h3>
                            <p className="text-sm text-yellow-800 mb-2">
                                {t('privacy.description')}
                            </p>
                            <Button
                                onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-yellow-700 hover:text-yellow-900"
                            >
                                {showPrivacyDetails ? (
                                    <><EyeOff className="w-4 h-4 mr-1" /> {t('privacy.hide_details')}</>
                                ) : (
                                    <><Eye className="w-4 h-4 mr-1" /> {t('privacy.show_details')}</>
                                )}
                            </Button>

                            {showPrivacyDetails && (
                                <div className="mt-3 p-3 bg-yellow-100 rounded text-xs text-yellow-800">
                                    <ul className="space-y-1">
                                        <li>• {t('privacy.details.no_storage')}</li>
                                        <li>• {t('privacy.details.currency_only')}</li>
                                        <li>• {t('privacy.details.no_sharing')}</li>
                                        <li>• {t('privacy.details.secure_connection')}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">            <Button
                onClick={handleLocationRequest}
                disabled={isProcessing || permissionStatus === 'unavailable'}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('detecting')}...</>
                ) : (
                    <><Navigation className="w-4 h-4 mr-2" /> {permissionStatus === 'unavailable' ? t('unavailable') : t('allow_location')}</>
                )}
            </Button>
                <Button
                    onClick={handleManualLocation}
                    variant="outline"
                    className="flex-1"
                >
                    <Globe className="w-4 h-4 mr-2" />
                    {t('manual_select')}
                </Button>
            </div>

            <Button
                onClick={handleSkip}
                variant="ghost"
                className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
                Skip
            </Button>
        </div>
    );

    const renderRequestingStep = () => (
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('detecting')}
                </h2>
                <p className="text-gray-600 text-sm">
                    {t('please_wait')}
                </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                        {t('browser_prompt')}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderSuccessStep = () => (
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('success')}
                </h2>
                {location && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-2xl">
                                {locationService.getCountryFlag(location.countryCode)}
                            </span>
                            <span className="font-semibold text-green-900">
                                {locationService.formatLocationString(location)}
                            </span>
                        </div>
                        <div className="text-sm text-green-800">
                            <p>{t('currency')}: {location.currency}</p>
                            <p>{t('payment_method')}: {location.paymentMethod}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderErrorStep = () => (
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('error')}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                    {errorMessage}
                </p>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-red-800">
                        {t('error_help')}
                    </p>
                </div>
            </div>
            <div className="flex gap-3">
                <Button
                    onClick={handleLocationRequest}
                    disabled={isProcessing}
                    className="flex-1"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('retry')}
                </Button>
                <Button
                    onClick={handleManualLocation}
                    variant="outline"
                    className="flex-1"
                >
                    <Globe className="w-4 h-4 mr-2" />
                    {t('manual_select')}
                </Button>
            </div>
        </div>
    );

    const renderManualStep = () => {
        const countries = [
            { code: 'EG', name: 'Egypt', currency: 'EGP', flag: '🇪🇬' },
            { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
            { code: 'GB', name: 'United Kingdom', currency: 'USD', flag: '🇬🇧' },
            { code: 'CA', name: 'Canada', currency: 'USD', flag: '🇨🇦' },
            { code: 'AU', name: 'Australia', currency: 'USD', flag: '🇦🇺' },
            { code: 'DE', name: 'Germany', currency: 'USD', flag: '🇩🇪' },
            { code: 'FR', name: 'France', currency: 'USD', flag: '🇫🇷' },
            { code: 'IT', name: 'Italy', currency: 'USD', flag: '🇮🇹' },
            { code: 'ES', name: 'Spain', currency: 'USD', flag: '🇪🇸' },
            { code: 'NL', name: 'Netherlands', currency: 'USD', flag: '🇳🇱' },
        ];

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('select_country')}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {t('select_country_description')}
                    </p>
                </div>

                <div className="grid gap-2 max-h-64 overflow-y-auto">
                    {countries.map((country) => (
                        <Button
                            key={country.code}
                            onClick={() => handleCountrySelect(country.code, country.name)}
                            variant="outline"
                            className="flex items-center justify-between p-4 h-auto text-left hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{country.flag}</span>
                                <span className="font-medium">{country.name}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                {country.currency}
                            </div>
                        </Button>
                    ))}
                </div>

                <Button
                    onClick={() => setCurrentStep('intro')}
                    variant="ghost"
                    className="w-full"
                >
                    {t('back')}
                </Button>
            </div>
        );
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'intro':
                return renderIntroStep();
            case 'requesting':
                return renderRequestingStep();
            case 'success':
                return renderSuccessStep();
            case 'error':
                return renderErrorStep();
            case 'manual':
                return renderManualStep();
            default:
                return renderIntroStep();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with subtle blur effect */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />

            <div
                className={`relative w-full max-w-md bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'
                    }`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                                {t('location_setup')}
                            </span>
                        </div>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isProcessing}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    );
};
