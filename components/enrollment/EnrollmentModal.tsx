/**
 * Course Enrollment Modal
 * Handles course enrollment with payment provider selection
 */

"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CreditCard, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useEnrollment } from '@/hooks/useEnrollment';
import { type PaymentProvider } from '@/lib/types/enrollment';
import type { CourseEnrollmentProps } from '@/lib/types/enrollment';
import { useLocationAwarePrice, useLocationAwarePayment } from '@/hooks/useLocationAwarePrice';
import { useLocationStore } from '@/lib/store/locationStore';
import { LocationModal } from '@/components/location/LocationModal';

interface EnrollmentModalProps extends CourseEnrollmentProps {
    isOpen: boolean;
    onClose: () => void;
    courseType?: string[] | string;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
    isOpen,
    onClose,
    courseId,
    startDates,
    courseTitle,
    coursePrice,
    courseDuration,
    courseType = ['Online'],
    onSuccess,
    onError,
}) => {
    const t = useTranslations('courseDetail');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider['id'] | null>(null);
    const [selectedCourseType, setSelectedCourseType] = useState<string>(
        Array.isArray(courseType) && courseType.length > 0
            ? courseType[0]
            : typeof courseType === 'string'
                ? courseType
                : 'Online'
    );
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Location-aware hooks
    const { location } = useLocationStore();
    const locationAwarePrice = useLocationAwarePrice(coursePrice);
    const { paymentMethod, currency, isEgypt } = useLocationAwarePayment();

    const {
        isProcessing,
        error,
        success,
        enrollInCourse,
        resetState,
        isAuthenticated,
    } = useEnrollment();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            resetState();
            setSelectedStartDate('');
            // Auto-select payment method based on location
            setSelectedProvider(paymentMethod as PaymentProvider['id']);
        }
    }, [isOpen, resetState, paymentMethod]);

    // Handle successful enrollment
    useEffect(() => {
        if (success && onSuccess) {
            onSuccess();
        }
    }, [success, onSuccess]);

    // Handle enrollment errors
    useEffect(() => {
        if (error && onError) {
            onError(error);
        }
    }, [error, onError]);

    const handleEnroll = async () => {
        if (!selectedStartDate || !selectedProvider) {
            return;
        }

        // Ensure date is in YYYY-MM-DD format
        const formattedDate = formatDateForAPI(selectedStartDate);

        await enrollInCourse(
            {
                courseId,
                startDate: formattedDate,
                courseTitle,
                coursePrice,
                courseDuration,
                course_type: selectedCourseType
            },
            selectedProvider
        );
    };

    // Format date for API (YYYY-MM-DD)
    const formatDateForAPI = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Date formatting error:', error);
            // If the date is already in YYYY-MM-DD format, return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }
            throw new Error('Invalid date format');
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if parsing fails
            }
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            console.error('Date display formatting error:', error);
            return dateString;
        }
    };

    // eslint-disable-next-line no-unused-vars
    const formatPrice = (price: number) => {
        return locationAwarePrice.formatted;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm"></div>

            <div
                className={`relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-[#0F43B4] mb-2">
                                {t('enrollNow')}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {courseTitle}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            title={isRTL ? 'إغلاق' : 'Close'}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={isProcessing}
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Authentication Check */}
                    {!isAuthenticated && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-amber-800">
                                        {isRTL ? 'مطلوب تسجيل الدخول' : 'Login Required'}
                                    </h3>
                                    <p className="text-sm text-amber-700">
                                        {isRTL
                                            ? 'يجب تسجيل الدخول أولاً للتسجيل في الدورات'
                                            : 'You need to log in first to enroll in courses'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Location and Currency Info */}
                    {location && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-lg">
                                            {location.countryCode === 'EG' ? '🇪🇬' : '🌍'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900">
                                            {location.city}, {location.country}
                                        </h3>
                                        <p className="text-sm text-blue-700">
                                            {isRTL ? 'العملة:' : 'Currency:'} {currency} • {isRTL ? 'الدفع:' : 'Payment:'} {paymentMethod}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowLocationModal(true)}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                    {isRTL ? 'تغيير' : 'Change'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Show location modal trigger if no location */}
                    {!location && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-yellow-800">
                                            {isRTL ? 'تحديد الموقع للحصول على الأسعار الدقيقة' : 'Set Location for Accurate Pricing'}
                                        </h3>
                                        <p className="text-sm text-yellow-700">
                                            {isRTL
                                                ? 'احصل على الأسعار بالعملة المحلية وطرق الدفع المناسبة'
                                                : 'Get pricing in your local currency and suitable payment methods'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowLocationModal(true)}
                                    size="sm"
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                >
                                    {isRTL ? 'تحديد الموقع' : 'Set Location'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Course Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            {isRTL ? 'تفاصيل الدورة' : 'Course Details'}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-blue-700">{isRTL ? 'السعر:' : 'Price:'}</span>
                                <span className="font-semibold text-blue-900">{formatPrice(coursePrice)}</span>
                            </div>
                            {courseDuration && (
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-700 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {isRTL ? 'المدة:' : 'Duration:'}
                                    </span>
                                    <span className="font-semibold text-blue-900">
                                        {courseDuration} {isRTL ? 'ساعات' : 'hours'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Type Selection */}
                    {Array.isArray(courseType) && courseType.length > 1 && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-[#0F43B4]" />
                                {isRTL ? 'اختر نوع الدورة' : 'Select Course Type'}
                            </h3>
                            <div className="grid gap-3">
                                {courseType.map((type) => (
                                    <label
                                        key={type}
                                        className={`
                                            flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                                            ${selectedCourseType === type
                                                ? 'border-[#0F43B4] bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="courseType"
                                                value={type}
                                                checked={selectedCourseType === type}
                                                onChange={(e) => setSelectedCourseType(e.target.value)}
                                                disabled={isProcessing}
                                                className="w-4 h-4 text-[#0F43B4] focus:ring-[#0F43B4]"
                                            />
                                            <span className="font-medium text-gray-900">
                                                {type === 'Online' ? (isRTL ? 'عبر الإنترنت' : 'Online') :
                                                    type === 'Offline' ? (isRTL ? 'حضوري' : 'In Person') :
                                                        type === 'Recorded' ? (isRTL ? 'مسجل' : 'Recorded') : type}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Start Date Selection */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#0F43B4]" />
                            {t('availableStartDates')}
                        </h3>
                        {startDates && startDates.length > 0 ? (
                            <div className="grid gap-3">
                                {startDates.map((dateOption) => (
                                    <label
                                        key={dateOption.date}
                                        className={`
                    flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${selectedStartDate === dateOption.date
                                                ? 'border-[#0F43B4] bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                    ${dateOption.available_slots === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="startDate"
                                                value={dateOption.date}
                                                checked={selectedStartDate === dateOption.date}
                                                onChange={(e) => setSelectedStartDate(e.target.value)}
                                                disabled={dateOption.available_slots === 0 || isProcessing}
                                                className="w-4 h-4 text-[#0F43B4] focus:ring-[#0F43B4]"
                                            />
                                            <span className="font-medium text-gray-900">
                                                {formatDate(dateOption.date)}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            {dateOption.available_slots > 0 ? (
                                                <span className="text-green-600 font-medium">
                                                    {dateOption.available_slots} {t('slotsAvailable')}
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-medium">
                                                    {isRTL ? 'ممتلئ' : 'Full'}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-center justify-center mb-3">
                                        <Calendar className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <h4 className="font-semibold text-amber-800 mb-2">
                                        {isRTL ? 'لا توجد تواريخ متاحة' : 'No Available Dates'}
                                    </h4>
                                    <p className="text-amber-700 text-sm">
                                        {isRTL
                                            ? 'لم يتم تحديد تواريخ بداية لهذه الدورة بعد.'
                                            : 'Start dates for this course haven\'t been scheduled yet.'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Provider Selection */}
                    {selectedStartDate && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#0F43B4]" />
                                {isRTL ? 'اختر طريقة الدفع' : 'Select Payment Method'}
                            </h3>
                            <div className="grid gap-3">
                                {/* Show only location-appropriate payment methods */}
                                {isEgypt ? (
                                    <label className="flex items-center justify-between p-4 border-2 border-[#0F43B4] bg-blue-50 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="paymentProvider"
                                                value="paymob"
                                                checked={selectedProvider === 'paymob'}
                                                onChange={(e) => setSelectedProvider(e.target.value as PaymentProvider['id'])}
                                                disabled={isProcessing}
                                                className="w-4 h-4 text-[#0F43B4] focus:ring-[#0F43B4]"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="font-medium text-gray-900">
                                                        {isRTL ? 'باي موب' : 'Paymob'}
                                                    </span>
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {isRTL ? 'مُوصى' : 'Recommended'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {isRTL
                                                        ? 'الدفع بالجنيه المصري - الطريقة الأفضل في مصر'
                                                        : 'Pay in Egyptian Pounds - Best for Egypt'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                ) : (
                                    <label className="flex items-center justify-between p-4 border-2 border-[#0F43B4] bg-blue-50 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="paymentProvider"
                                                value="stripe"
                                                checked={selectedProvider === 'stripe'}
                                                onChange={(e) => setSelectedProvider(e.target.value as PaymentProvider['id'])}
                                                disabled={isProcessing}
                                                className="w-4 h-4 text-[#0F43B4] focus:ring-[#0F43B4]"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span className="font-medium text-gray-900">
                                                        {isRTL ? 'دفع دولي' : 'International Payment'}
                                                    </span>
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {isRTL ? 'مُوصى' : 'Recommended'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {isRTL
                                                        ? 'الدفع بالدولار الأمريكي - للعملاء الدوليين'
                                                        : 'Pay in USD - For international customers'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-red-800">
                                        {isRTL ? 'حدث خطأ' : 'Error Occurred'}
                                    </h3>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
                    <div className="flex gap-3 justify-end">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            disabled={isProcessing}
                            className="px-6"
                        >
                            {isRTL ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button
                            onClick={handleEnroll}
                            disabled={!selectedStartDate || !selectedProvider || isProcessing || !isAuthenticated || !startDates || startDates.length === 0}
                            className="px-8 bg-[#0F43B4] hover:bg-[#1a5bc4] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isProcessing
                                ? (isRTL ? 'جاري المعالجة...' : 'Processing...')
                                : !startDates || startDates.length === 0
                                    ? (isRTL ? 'لا توجد تواريخ متاحة' : 'No Dates Available')
                                    : (isRTL ? 'سجل الآن' : 'Enroll Now')
                            }
                        </Button>
                    </div>
                </div>
            </div>

            {/* Location Modal */}
            <LocationModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onSuccess={() => setShowLocationModal(false)}
            />
        </div>
    );
};
