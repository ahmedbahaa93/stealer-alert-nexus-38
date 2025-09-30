"use client";

import Image from "../../../Ui/Image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const FinalSectionOfBlog = () => {
    const [isClient, setIsClient] = useState(false);
    const t = useTranslations('Blog.sections.thirdSection');

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="w-full bg-gray-50 py-8 md:py-12 px-4">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full max-w-2xl"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full bg-gray-50 py-8 md:py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Flex container with justify-around */}
                <div className="flex flex-col lg:flex-row justify-around items-center gap-8 lg:gap-12">
                    {/* Left Column - Text Content */}
                    <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl space-y-6 text-center lg:text-left">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F43B4] mb-4">
                            {t('title')}
                        </h2>

                        <p className="text-black font-medium leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {t('content')}
                        </p>
                    </div>

                    {/* Right Column - Image */}
                    <div className="w-full lg:w-auto lg:flex-shrink-0 lg:max-w-md flex justify-center">
                        <div className="relative max-w-sm w-full">
                            <Image
                                imageurl="/assets/Blog-Page/b2179a08f3c3a95c31ce6d2626c5ce89.jpg"
                                alt="Professional woman working remotely"
                                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-lg"
                            />

                            {/* Decorative elements - responsive visibility */}
                            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 bg-[#61E4AE]/30 rounded-full hidden sm:block"></div>
                            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-4 h-4 sm:w-6 sm:h-6 bg-purple-400/30 rounded-full hidden sm:block"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalSectionOfBlog;