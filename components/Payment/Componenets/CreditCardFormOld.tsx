"use client";

import { useState } from "react";
import Button from "../../../Ui/Button";
import { Checkbox } from "./Checkbox";
import Image from "../../../Ui/Image";

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
}

const GradientInput = ({ id, label, type, value, onChange, placeholder, rightElement }: GradientInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    console.log(isFocused)

    return (
        <div className="relative">
            {/* Gradient Border Container */}
            <div className="bg-gradient-to-r from-[#0F43B4] to-[#61E4AE] p-[2px] rounded-lg relative">
                {/* Label on Border */}
                <div className="absolute -top-3 left-4 z-10">
                    <span className="bg-white px-2 text-sm font-medium text-[#0F43B4]">
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
                        className="w-full h-14 px-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 rounded-lg"
                    />

                    {/* Right Element */}
                    {rightElement && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            {rightElement}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom Gradient Select Component with Border Label
interface GradientSelectProps {
    id: string;
    label: string;
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    options: { value: string; label: string; flag?: string }[];
}

const GradientSelect = ({ label, value, onChange, options }: GradientSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className="relative">
            {/* Gradient Border Container */}
            <div className="bg-gradient-to-r from-[#0F43B4] to-[#61E4AE] p-[2px] rounded-lg relative">
                {/* Label on Border */}
                <div className="absolute -top-3 left-4 z-10">
                    <span className="bg-white px-2 text-sm font-medium text-[#0F43B4]">
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
        </div>
    );
};

const CreditCardForm = () => {
    const [formData, setFormData] = useState({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        country: "",
        saveCard: false,
        agreeTerms: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join('-');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 19) {
            handleInputChange("cardNumber", formatted);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        if (formatted.length <= 5) {
            handleInputChange("expiryDate", formatted);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Payment form submitted:", formData);
    };

    const countryOptions = [
        { value: "egypt", label: "Egypt", flag: "/assets/Payment-Page/egypt-flag-icon 1 (1).svg" },
        { value: "usa", label: "USA" },
        { value: "uk", label: "United Kingdom" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Cardholder Name */}
            <GradientInput
                id="cardholderName"
                label="Cardholder Name"
                type="text"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                placeholder=""
            />

            {/* Card Number */}
            <GradientInput
                id="cardNumber"
                label="Card Number"
                type="text"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000-0000-0000-0000"
                rightElement={
                    <div className="bg-[#0F43B4] text-white px-3 py-1 rounded text-sm font-bold">
                        VISA
                    </div>
                }
            />

            {/* Country */}
            <GradientSelect
                id="country"
                label="Your Country"
                value={formData.country}
                onChange={(value) => handleInputChange("country", value)}
                options={countryOptions}
            />

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-6">
                <GradientInput
                    id="expiryDate"
                    label="Expire Date"
                    type="text"
                    value={formData.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                />
                <GradientInput
                    id="cvv"
                    label="CVV"
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                            handleInputChange("cvv", value);
                        }
                    }}
                    placeholder="***"
                    rightElement={
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
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
                <span>Your Payment is protected with 256 bit SSL encryption</span>
            </div>

            {/* Checkboxes */}
            <div className="space-y-5">
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="saveCard"
                        checked={formData.saveCard}
                        onCheckedChange={(checked) => handleInputChange("saveCard", checked as boolean)}
                        className="w-5 h-5 border-2 border-gray-300 data-[state=checked]:bg-[#0F43B4] data-[state=checked]:border-[#0F43B4]"
                    />
                    <label htmlFor="saveCard" className="text-gray-700 text-sm font-medium">
                        save this card for future purchase
                    </label>
                </div>

                <div className="flex items-start space-x-3">
                    <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                        className="w-5 h-5 border-2 border-gray-300 data-[state=checked]:bg-[#0F43B4] data-[state=checked]:border-[#0F43B4] mt-0.5"
                    />
                    <label htmlFor="agreeTerms" className="text-gray-700 text-sm leading-relaxed">
                        I agree to the{" "}
                        <a href="#" className="text-[#0F43B4] font-semibold underline">
                            Terms&conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[#0F43B4] font-semibold underline">
                            Privacy Policy
                        </a>
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
                <Button
                    type="submit"
                    className="flex-1 h-12 bg-[#0F43B4] hover:bg-[#2c4885] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.agreeTerms}
                >
                    Pay
                </Button>
                <Button
                    type="button"
                    className="flex-1 h-12 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors bg-white"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default CreditCardForm;