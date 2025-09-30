"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Button from "../../../Ui/Button";
import { Checkbox } from "./Checkbox";
import { createPaymentSchema, formatCardNumber, formatExpiryDate, detectCardType, getCardTypeIcon } from "@/lib/validation/payment";
import { PaymentFormData } from "@/lib/types/payment";
import { usePayment } from "@/hooks/usePayment";
import { usePaymentCourseData } from "@/hooks/usePaymentCourse";
import { toast } from "sonner";

interface CreditCardFormProps {
    courseId: string;
}

// Custom Gradient Input Component with Border Label
interface GradientInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    rightElement?: React.ReactNode;
    error?: string;
}

const GradientInput = ({ id, label, type, value, onChange, placeholder, rightElement, error }: GradientInputProps) => {
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';

    return (
        <div className="relative">
            {/* Gradient Border Container */}
            <div className={`bg-gradient-to-r from-[#0F43B4] to-[#61E4AE] p-[2px] rounded-lg relative ${error ? 'bg-red-500' : ''}`}>
                {/* Label on Border */}
                <div className={`absolute -top-3 ${isRTL ? 'right-4' : 'left-4'} z-10`}>
                    <span className={`bg-white px-2 text-sm font-medium ${error ? 'text-red-500' : 'text-[#0F43B4]'}`}>
                        {label}
                    </span>
                </div>

                <div className="relative bg-white rounded-lg">
                    {/* Input Field */}
                    <input
                        id={id}
                        type={type}
                        value={value}
                        dir="auto"
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`w-full h-14 px-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 rounded-lg ${error ? 'text-red-500' : ''}`}
                    />
                    {rightElement && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            {rightElement}
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

// Custom Select Component with Gradient Border  
interface GradientSelectProps {
    label: string;
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string; flag?: string }>;
    error?: string;
}

const GradientSelect = ({ label, value, onChange, options, error }: GradientSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative">
            <div className={`bg-gradient-to-r from-[#0F43B4] to-[#61E4AE] p-[2px] rounded-lg relative ${error ? 'bg-red-500' : ''}`}>
                {/* Label on Border */}
                <div className="absolute -top-3 left-4 z-10">
                    <span className={`bg-white px-2 text-sm font-medium ${error ? 'text-red-500' : 'text-[#0F43B4]'}`}>
                        {label}
                    </span>
                </div>

                <div className="relative bg-white rounded-lg">
                    {/* Select Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full h-14 px-4 bg-transparent border-none outline-none text-left flex items-center justify-between rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            {selectedOption?.flag && (
                                <div className="w-6 h-4 relative">
                                    <img src={selectedOption.flag} alt="flag" className="w-full h-full object-cover rounded-sm" />
                                </div>
                            )}
                            <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                                {selectedOption ? selectedOption.label : 'Select Country'}
                            </span>
                        </div>
                        <svg className={`w-5 h-5 text-[#0F43B4] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Options */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg transition-colors"
                                >
                                    {option.flag && (
                                        <div className="w-6 h-4 relative">
                                            <img src={option.flag} alt="flag" className="w-full h-full object-cover rounded-sm" />
                                        </div>
                                    )}
                                    <span className="text-gray-900">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

const CreditCardForm = ({ courseId }: CreditCardFormProps) => {
    const t = useTranslations('payment-form');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardType, setCardType] = useState('unknown');

    // Get course data for payment
    const { data: courseData, isLoading: courseLoading, error: courseError } = usePaymentCourseData(courseId);

    // Payment hook
    const { processPayment, isPending, error: paymentError } = usePayment('stripe', {
        onSuccess: () => {
            setPaymentSuccess(true);
        },
        onError: () => {
            // Error handling is done by the hook
        }
    });

    // Form setup with validation
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(createPaymentSchema(t)),
        defaultValues: {
            cardholderName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            country: "",
            saveCard: false,
            agreeTerms: false,
            startDate: "",
            paymentMethod: 'stripe' as const
        }
    });

    const watchedValues = watch();

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 23) { // Allow for spaces in formatting
            setValue("cardNumber", formatted);
            // Detect and update card type
            const detectedType = detectCardType(formatted);
            setCardType(detectedType);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        if (formatted.length <= 5) {
            setValue("expiryDate", formatted);
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length <= 3) { // Limit to 3 digits
            setValue("cvv", value);
        }
    };

    const onSubmit = async (data: any) => {
        if (!courseData) return;

        setIsLoading(true);
        try {
            // Convert form data to PaymentFormData format
            const paymentData: PaymentFormData = {
                cardholderName: data.cardholderName,
                cardNumber: data.cardNumber,
                expiryDate: data.expiryDate,
                cvv: data.cvv,
                country: data.country,
                saveCard: data.saveCard,
                agreeTerms: data.agreeTerms,
                startDate: data.startDate,
                paymentMethod: data.paymentMethod
            };

            await processPayment(paymentData, courseId);

            // Navigate to success page on successful payment
            toast.success(t('paymentSuccess') || "Payment successful!");
            setTimeout(() => {
                router.push('/payment/success');
            }, 1000);

        } catch (error) {
            console.error('Payment submission error:', error);

            // Show error toast
            toast.error(t('paymentFailed') || "Payment failed. Please check your connection and try again.");

            // If there's no internet connection or other serious error, navigate to failure page
            if (!navigator.onLine) {
                setTimeout(() => {
                    router.push('/payment/failed');
                }, 1000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Get card type display info
    const getCardTypeDisplay = (type: string) => {
        const cardTypes = {
            visa: { name: 'VISA', color: 'bg-[#1565C0]', icon: getCardTypeIcon('visa') },
            mastercard: { name: 'MASTERCARD', color: 'bg-[#EB001B]', icon: getCardTypeIcon('mastercard') },
            amex: { name: 'AMEX', color: 'bg-[#006FCF]', icon: getCardTypeIcon('amex') },
            discover: { name: 'DISCOVER', color: 'bg-[#FF6000]', icon: getCardTypeIcon('discover') },
            unknown: { name: 'CARD', color: 'bg-gray-500', icon: getCardTypeIcon('unknown') }
        };

        return cardTypes[type as keyof typeof cardTypes] || cardTypes.unknown;
    };

    const countryOptions = [
        {
            value: "egypt",
            label: "Egypt",
            flag: "https://flagcdn.com/w40/eg.png"
        },
        {
            value: "usa",
            label: "United States",
            flag: "https://flagcdn.com/w40/us.png"
        },
        {
            value: "uk",
            label: "United Kingdom",
            flag: "https://flagcdn.com/w40/gb.png"
        },
        {
            value: "canada",
            label: "Canada",
            flag: "https://flagcdn.com/w40/ca.png"
        },
        {
            value: "australia",
            label: "Australia",
            flag: "https://flagcdn.com/w40/au.png"
        },
        {
            value: "germany",
            label: "Germany",
            flag: "https://flagcdn.com/w40/de.png"
        },
        {
            value: "france",
            label: "France",
            flag: "https://flagcdn.com/w40/fr.png"
        },
        {
            value: "saudi",
            label: "Saudi Arabia",
            flag: "https://flagcdn.com/w40/sa.png"
        },
        {
            value: "uae",
            label: "UAE",
            flag: "https://flagcdn.com/w40/ae.png"
        }
    ];

    // Loading state
    if (courseLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-[#0F43B4]">{t('loading.course')}</div>
            </div>
        );
    }

    // Error state
    if (courseError) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">{t('errors.general')}</div>
            </div>
        );
    }

    // Success state
    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="text-green-500 text-xl font-bold mb-4">{t('success.title')}</div>
                <p className="text-gray-600 mb-6">{t('success.message')}</p>
                <Button
                    onClick={() => router.push('/my-courses')}
                    className="bg-[#0F43B4] text-white px-6 py-3 rounded-lg"
                >
                    {t('success.button')}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Start Date Selection */}
            {courseData?.startDates && courseData.startDates.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0F43B4]">{t('course.startDates')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courseData.startDates.map((dateOption, index) => (
                            <Controller
                                key={index}
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            value={dateOption.date}
                                            checked={field.value === dateOption.date}
                                            onChange={field.onChange}
                                            className="w-4 h-4 text-[#0F43B4]"
                                        />
                                        <div>
                                            <div className="font-medium">
                                                {new Date(dateOption.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {dateOption.available_slots} {t('course.slotsAvailable')}
                                            </div>
                                        </div>
                                    </label>
                                )}
                            />
                        ))}
                    </div>
                    {errors.startDate && (
                        <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                    )}
                </div>
            )}

            {/* Payment Information Header */}
            <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-[#0F43B4] mb-6">{t('title')}</h3>

                {/* Cardholder Name */}
                <div className="mb-6">
                    <Controller
                        name="cardholderName"
                        control={control}
                        render={({ field }) => (
                            <GradientInput
                                id="cardholderName"
                                label={t('fields.cardholderName')}
                                type="text"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('placeholders.cardholderName')}
                                error={errors.cardholderName?.message}
                            />
                        )}
                    />
                </div>

                {/* Card Number */}
                <div className="mb-6">
                    <Controller
                        name="cardNumber"
                        control={control}
                        render={({ field }) => (
                            <GradientInput
                                id="cardNumber"
                                label={t('fields.cardNumber')}
                                type="text"
                                value={field.value}
                                onChange={handleCardNumberChange}
                                placeholder={t('placeholders.cardNumber')}
                                error={errors.cardNumber?.message}
                                rightElement={
                                    <div className="flex items-center gap-2">
                                        <div className={`${getCardTypeDisplay(cardType).color} text-white px-3 py-1 rounded text-sm font-bold flex items-center gap-2`}>
                                            <img
                                                src={getCardTypeDisplay(cardType).icon}
                                                alt={getCardTypeDisplay(cardType).name}
                                                className="w-6 h-4 object-contain"
                                            />
                                            <span>{getCardTypeDisplay(cardType).name}</span>
                                        </div>
                                    </div>
                                }
                            />
                        )}
                    />
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Controller
                        name="expiryDate"
                        control={control}
                        render={({ field }) => (
                            <GradientInput
                                id="expiryDate"
                                label={t('fields.expiryDate')}
                                type="text"
                                value={field.value}
                                onChange={handleExpiryChange}
                                placeholder={t('placeholders.expiryDate')}
                                error={errors.expiryDate?.message}
                            />
                        )}
                    />
                    <Controller
                        name="cvv"
                        control={control}
                        render={({ field }) => (
                            <GradientInput
                                id="cvv"
                                label={t('fields.cvv')}
                                type="text"
                                value={field.value}
                                onChange={handleCvvChange}
                                placeholder={t('placeholders.cvv')}
                                error={errors.cvv?.message}
                                rightElement={
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                            3 digits
                                        </div>
                                    </div>
                                }
                            />
                        )}
                    />
                </div>

                {/* Country */}
                <div className="mb-6">
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <GradientSelect
                                label={t('fields.country')}
                                value={field.value}
                                onChange={field.onChange}
                                options={countryOptions}
                                error={errors.country?.message}
                            />
                        )}
                    />
                </div>

                {/* Save Card Checkbox */}
                <div className="mb-6">
                    <Controller
                        name="saveCard"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="saveCard"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="w-5 h-5 border-2 border-gray-300 data-[state=checked]:bg-[#0F43B4] data-[state=checked]:border-[#0F43B4] mt-0.5"
                                />
                                <label htmlFor="saveCard" className="text-gray-700 text-sm leading-relaxed">
                                    {t('fields.saveCard')}
                                </label>
                            </div>
                        )}
                    />
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-700 text-sm text-center font-medium">
                        🔒 {t('security')}
                    </p>
                </div>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
                <Controller
                    name="agreeTerms"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="agreeTerms"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-5 h-5 border-2 border-gray-300 data-[state=checked]:bg-[#0F43B4] data-[state=checked]:border-[#0F43B4] mt-0.5"
                            />
                            <label htmlFor="agreeTerms" className="text-gray-700 text-sm leading-relaxed">
                                {t('fields.agreeTerms')}
                            </label>
                        </div>
                    )}
                />
                {errors.agreeTerms && (
                    <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>
                )}
            </div>

            {/* Error Display */}
            {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{t('errors.general')}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
                <Button
                    type="submit"
                    className="flex-1 h-12 bg-[#0F43B4] hover:bg-[#2c4885] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!watchedValues.agreeTerms || isLoading || isPending}
                >
                    {isLoading || isPending ? t('buttons.processing') : t('buttons.pay')}
                </Button>
                <Button
                    type="button"
                    className="flex-1 h-12 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors bg-white"
                    onClick={() => router.back()}
                >
                    {t('buttons.cancel')}
                </Button>
            </div>
        </form>
    );
};

export default CreditCardForm;
