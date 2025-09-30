"use client";

import { ArrowDown } from "lucide-react";
import Button from "../../../Ui/Button";
import Image from "../../../Ui/Image";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

const IntroductionSection = () => {
    const [isClient, setIsClient] = useState(false);
    const t = useTranslations('Blog.sections.secondSection');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="w-full bg-white py-8 sm:py-10 md:py-12 px-4">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full max-w-2xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white py-8 sm:py-10 md:py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Flex container with justify-around */}
                <div className="flex flex-col lg:flex-row justify-around gap-8 sm:gap-10 lg:gap-12">
                    {/* Left Column - Main Content */}
                    <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F43B4] mb-2 sm:mb-4 lg:mb-6 text-center">
                            {t('title')}
                        </h2>

                        <div className="space-y-6 sm:space-y-8 text-center text-gray-500 font-medium leading-relaxed">
                            <p className="text-sm sm:text-base whitespace-pre-line">
                                {t('content')}
                            </p>
                        </div>

                        {/* Image Section - responsive sizing */}
                        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                            <Image
                                imageurl="/assets/Blog-Page/264e2e1b3307ecf87d46238ed1b0787d.jpg"
                                alt="Remote work collaboration"
                                className="w-full h-64 sm:h-72 md:h-80 rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Right Column - Sidebar - Updated with clearer separator lines */}
                    <div className="w-full lg:w-auto lg:flex-shrink-0 lg:max-w-xs ">
                        <div className={`bg-gradient-to-br from-white to-green-100 rounded-2xl p-4 shadow-sm border border-gray-100 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            {/* Author Info - Compact Design */}
                            <div className={`flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        imageurl="/assets/Blog-Page/Asian_Woman_PSD__High_Quality_Free_PSD_Templates_for_Download___Freepik-removebg-preview 1.png"
                                        alt="Rahma Ali"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold text-gray-900 text-sm truncate ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                        {t('author_name')}
                                    </h3>
                                    <p className={`text-xs text-gray-600 truncate ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                        {t('published_date')}
                                    </p>
                                </div>
                            </div>

                            {/* Table of Contents - With Enhanced Separator Lines */}
                            <div className="space-y-3">
                                {/* Main Introduction Item with separator line below */}
                                <div className="p-3 ">
                                    <div className={`flex items-center justify-between cursor-pointer pb-3 border-b-2 border-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <span className={`text-sm font-medium text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                            {t('introduction')}
                                        </span>
                                        <ArrowDown className={`w-4 h-4 text-gray-500 ${isRTL ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Sub-items with enhanced separator lines */}
                                    <div className="">
                                        {/* First sub-item */}
                                        <div className={`flex items-center justify-between py-3 cursor-pointer border-b-2 border-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className={`text-xs text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                                {t('faq1')}
                                            </span>
                                            <ArrowDown className={`w-4 h-4 text-gray-500 ${isRTL ? 'rotate-180' : ''}`} />
                                        </div>

                                        {/* Second sub-item */}
                                        <div className={`flex items-center justify-between py-3 cursor-pointer border-b-2 border-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className={`text-xs text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                                {t('faq2')}
                                            </span>
                                            <ArrowDown className={`w-4 h-4 text-gray-500 ${isRTL ? 'rotate-180' : ''}`} />
                                        </div>

                                        {/* Third sub-item - no border bottom */}
                                        <div className={`flex items-center justify-between py-3 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className={`text-xs text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                                {t('faq3')}
                                            </span>
                                            <ArrowDown className={`w-4 h-4 text-gray-500 ${isRTL ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Newsletter Signup - Compact Card */}
                            <div className="p-4">
                                <h4 className={`font-semibold text-gray-900 text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                    {t('weekly_newsletter')}
                                </h4>
                                <p className={`text-xs text-center text-gray-600 mb-3 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                    {t('newsletter_description')}
                                </p>

                                <div className="space-y-2">
                                    <input
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                                        dir={isRTL ? 'rtl' : 'ltr'}
                                    />
                                    <Button className="w-full bg-[#0F43B4] text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors text-xs">
                                        {t('subscribe')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroductionSection;