"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Border from "./Border";

interface CountrySelectProps {
    value: string;
    // eslint-disable-next-line no-unused-vars
    onValueChange: (value: string) => void;
    placeholder?: string;
}

const countries = [
    {
        code: "eg",
        nameKey: "egypt",
        flag: "/icons/about/eg.svg"
    },
    {
        code: "ksa",
        nameKey: "saudi",
        flag: "/icons/about/ksa.svg"
    },
    {
        code: "uae",
        nameKey: "uae",
        flag: "/icons/about/uae.svg"
    }
];

export const CountrySelect = ({ value, onValueChange, placeholder }: CountrySelectProps) => {
    const t = useTranslations("SignUp.form.country");

    const selectedCountry = countries.find(country => country.code === value);

    return (
        <Border>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-full h-[62px] border-none bg-white text-[20px] font-normal text-[#0f43b4] [font-family:'Inter',Helvetica] leading-[24px] px-[22px] focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder={placeholder || t("placeholder")}>
                        {selectedCountry && (
                            <div className="flex items-center gap-3">
                                <Image
                                    src={selectedCountry.flag}
                                    alt={`${selectedCountry.code} flag`}
                                    width={24}
                                    height={18}
                                    className="flex-shrink-0"
                                />
                                <span>{t(`options.${selectedCountry.nameKey}`)}</span>
                            </div>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {countries.map((country) => (
                        <SelectItem
                            key={country.code}
                            value={country.code}
                            className="hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={country.flag}
                                    alt={`${country.code} flag`}
                                    width={24}
                                    height={18}
                                    className="flex-shrink-0"
                                />
                                <span>{t(`options.${country.nameKey}`)}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Border>
    );
};
