"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { MotionDiv, AnimatePresence } from "@/components/ui/motion";
import Border from "./Border";

interface PhoneInputProps {
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    // eslint-disable-next-line no-unused-vars
    onCountryChange?: (country: string) => void;
    country?: string;
    placeholder?: string;
}

const phoneCountryData: { [key: string]: { flag: string; code: string; starter: string; name: string } } = {
    eg: { flag: "/icons/about/eg.svg", code: "EG", starter: "+20", name: "Egypt" },
    ksa: { flag: "/icons/about/ksa.svg", code: "SA", starter: "+966", name: "Saudi Arabia" },
    uae: { flag: "/icons/about/uae.svg", code: "AE", starter: "+971", name: "UAE" },
};

export const PhoneInput = ({ value, onChange, onCountryChange, country = "eg", placeholder }: PhoneInputProps) => {
    const t = useTranslations("SignUp.form.phone");
    const [selectedCountry, setSelectedCountry] = useState(country);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Get current country data
    const currentCountry = selectedCountry;
    const countryData = phoneCountryData[currentCountry] || phoneCountryData.eg;

    const handleCountrySelect = (countryCode: string) => {
        setSelectedCountry(countryCode);
        setIsDropdownOpen(false);

        // Notify parent component of country change
        if (onCountryChange) {
            onCountryChange(countryCode);
        }

        // Clear the phone input when country changes to avoid confusion
        onChange('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-digits from the input
        const numericValue = e.target.value.replace(/\D/g, '');

        // Limit length based on selected country for better UX
        let maxLength = 15;
        if (selectedCountry === 'eg') maxLength = 11; // Egyptian numbers
        if (selectedCountry === 'ksa') maxLength = 9; // Saudi numbers
        if (selectedCountry === 'uae') maxLength = 9; // UAE numbers

        if (numericValue.length <= maxLength) {
            onChange(numericValue);
        }
    };

    // Simple display - no complex formatting to avoid issues
    const getDisplayValue = () => {
        return value || '';
    };

    return (
        <Border>
            <div className="flex items-center w-full h-[56px] md:h-[60px] lg:h-[62px] bg-white relative">
                {/* Country Selector Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-[16px] md:px-[20px] lg:px-[22px] border-r border-gray-200 h-full hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                    >
                        <Image
                            src={countryData.flag}
                            alt={`${countryData.code} flag`}
                            width={24}
                            height={18}
                            className="flex-shrink-0 w-[20px] md:w-[22px] lg:w-[24px] h-auto"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        <span className="text-[16px] md:text-[18px] lg:text-[20px] font-normal text-[#0f43b4] [font-family:'Inter',Helvetica] leading-[24px]">
                            {countryData.starter}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-[#0f43b4] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <MotionDiv
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 min-w-[200px]"
                            >
                                {Object.entries(phoneCountryData).map(([countryCode, data]) => (
                                    <button
                                        key={countryCode}
                                        type="button"
                                        onClick={() => handleCountrySelect(countryCode)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left first:rounded-t-lg last:rounded-b-lg ${selectedCountry === countryCode ? 'bg-blue-50 text-[#0f43b4]' : 'text-gray-700'
                                            }`}
                                    >
                                        <Image
                                            src={data.flag}
                                            alt={`${data.code} flag`}
                                            width={24}
                                            height={18}
                                            className="flex-shrink-0 w-[24px] h-auto"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium">
                                                {data.name}
                                            </span>
                                            <span className="text-[12px] text-gray-500">
                                                {data.starter}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                {/* Phone Number Input */}
                <Input
                    type="tel"
                    id="phone"
                    value={getDisplayValue()}
                    onChange={handleChange}
                    placeholder={placeholder || t("placeholder")}
                    className="flex-1 h-full border-none bg-transparent text-[16px] md:text-[18px] lg:text-[20px] font-normal text-[#0f43b4] [font-family:'Inter',Helvetica] leading-[24px] px-[16px] md:px-[20px] lg:px-[22px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                {/* Click outside to close dropdown */}
                {isDropdownOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                )}
            </div>
        </Border>
    );
};
