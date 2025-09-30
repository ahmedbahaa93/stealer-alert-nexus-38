"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";
import Button from "../../../Ui/Button";
import { Checkbox } from "./Checkbox";
import Image from "../../../Ui/Image";
import { createPaymentSchema, formatCardNumber, formatExpiryDate } from "@/lib/validation/payment";
import { PaymentFormData } from "@/lib/types/payment";
import { usePayment } from "@/hooks/usePayment";
import { usePaymentCourseData } from "@/hooks/usePaymentCourse";

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
    const [, setIsFocused] = useState(false);

    return (
        <div className="relative">
            {/* Gradient Border Container */}
            <div className={`bg-gradient-to-r from-[#0F43B4] to-[#61E4AE] p-[2px] rounded-lg relative ${error ? 'bg-red-500' : ''}`}>
                {/* Label on Border */}
                <div className="absolute -top-3 left-4 z-10">
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
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
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
    id: string;
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
                                    <Image className="w-full" imageurl={selectedOption.flag} alt="flag" />
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
                                            <Image className="w-full" imageurl={option.flag} alt="flag" />
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

    // Get course data for payment
    const { data: courseData, isLoading: courseLoading, error: courseError } = usePaymentCourseData(courseId);

    // Payment hook
    const { processPayment, isPending, error: paymentError } = usePayment('stripe', {
        onSuccess: (data) => {
            setPaymentSuccess(true);
            // Handle redirect if needed
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        },
        onError: (error) => {
            console.error('Payment failed:', error);
        }
    });

    // Form setup with validation
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<PaymentFormData>({
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
            paymentMethod: 'stripe'
        }
    });

    const watchedValues = watch();

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 19) {
            setValue("cardNumber", formatted);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        if (formatted.length <= 5) {
            setValue("expiryDate", formatted);
        }
    };

    const onSubmit = async (data: PaymentFormData) => {
        if (!courseData) return;

        setIsLoading(true);
        try {
            await processPayment(data, courseId);
        } catch (error) {
            console.error('Payment submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const countryOptions = [
        { value: "egypt", label: "Egypt", flag: "/assets/Payment-Page/egypt-flag-icon 1 (1).svg" },
        { value: "usa", label: "USA" },
        { value: "uk", label: "United Kingdom" },
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

            {/* Cardholder Name */}
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

            {/* Card Number */}
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
                            <div className="bg-[#0F43B4] text-white px-3 py-1 rounded text-sm font-bold">
                                VISA
                            </div>
                        }
                    />
                )}
            />

            {/* Country */}
            <Controller
                name="country"
                control={control}
                render={({ field }) => (
                    <GradientSelect
                        id="country"
                        label={t('fields.country')}
                        value={field.value}
                        onChange={field.onChange}
                        options={countryOptions}
                        error={errors.country?.message}
                    />
                )}
            />

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-6">
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
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) {
                                    field.onChange(value);
                                }
                            }}
                            placeholder={t('placeholders.cvv')}
                            error={errors.cvv?.message}
                            rightElement={
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    )}
                />
            </div>

            {/* Security Message */}
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 py-2">
                <div className="flex items-center justify-center">
                    <Image
                        imageurl="/assets/Payment-Page/shield-tick.svg"
                        alt="security"
                        className="w-5 h-5"
                    />
                </div>
                <span>{t('security')}</span>
            </div>

            {/* Checkboxes */}
            <div className="space-y-5">
                <Controller
                    name="saveCard"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="saveCard"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-5 h-5 border-2 border-gray-300 data-[state=checked]:bg-[#0F43B4] data-[state=checked]:border-[#0F43B4]"
                            />
                            <label htmlFor="saveCard" className="text-gray-700 text-sm font-medium">
                                {t('fields.saveCard')}
                            </label>
                        </div>
                    )}
                />

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
