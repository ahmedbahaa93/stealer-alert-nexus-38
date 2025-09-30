"use client";

import Button from "../../../Ui/Button";
import Image from "../../../Ui/Image";
import { CourseDetailsLink } from '@/components/ui/links/CourseDetailsLink';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useLocalization';

interface CourseCardProps {
    title: string;
    components: string[];
    frameworks: string[];
    instructor: string;
    isSelected?: boolean;
    onSelect: () => void;
    courseId?: string;
    image?: string; // New prop for category image
}

const CourseCard = ({
    title,
    components,
    frameworks,
    instructor,
    onSelect,
    courseId = '',
    image
}: CourseCardProps) => {
    const t = useTranslations('Categories');
    const { isRtl } = useDirection();
    return (
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-green-600 p-[2px] hover:from-green-600 hover:to-blue-600 hover:scale-[1.03] transition-all duration-500 ease-in-out group w-full max-w-[600px]">
            <div
                className="relative bg-white rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center h-[380px] shadow-md border-0 overflow-hidden"
            >
                {/* Mobile/Tablet Layout: Image First (Top), Content Below */}
                <div className="lg:hidden flex flex-col items-center w-full">
                    {/* Image Section - Mobile/Tablet */}
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="relative">
                            {/* Blue background positioned behind and offset */}
                            <div
                                className={`absolute -top-2 sm:-top-2 ${isRtl ? '-left-2 sm:-left-2' : '-right-2 sm:-right-2'} w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 bg-[#0F43B4] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:scale-105`}
                            ></div>

                            {/* White container with image */}
                            <div className={`relative bg-white rounded-xl p-1.5 sm:p-2 shadow-lg transition-all duration-500 ease-in-out transform group-hover:scale-105 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} group-hover:translate-y-1`}>
                                <Image
                                    imageurl={image || '/assets/Categoires-Page/image 25.png'}
                                    alt={title}
                                    className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 object-contain rounded-lg transition-all duration-500 ease-in-out group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section - Mobile/Tablet */}
                    <div className="flex flex-col w-full text-center">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#0F43B4] mb-2 sm:mb-3">
                            {title}
                        </h3>
                        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[#0F43B4] font-bold text-xs sm:text-sm">
                                    {t('courseCard.components')}
                                </span>
                                <span className="text-gray-700 text-xs sm:text-sm">
                                    {components.join(" | ")}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[#0F43B4] font-bold text-xs sm:text-sm">
                                    {t('courseCard.frameworks')}
                                </span>
                                <span className="text-gray-700 text-xs sm:text-sm">
                                    {frameworks.join(" | ")}
                                </span>
                            </div>
                        </div>

                        <div className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                            {t('courseCard.instructor')}{" "}
                            <span className="text-[#0F43B4] font-bold">{instructor}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                            <Button
                                onClick={onSelect}
                                className="w-full sm:flex-1 h-8 sm:h-9 border-2 border-blue-500 text-blue-600 bg-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-none"
                            >
                                {t('actions.selectSubCategory')}
                            </Button>
                            {courseId && (
                                <CourseDetailsLink courseId={courseId}>
                                    <Button
                                        className="w-full sm:flex-1 h-8 sm:h-9 border-2 border-blue-500 text-blue-600 bg-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-none"
                                    >
                                        {t('actions.moreDetails')}
                                    </Button>
                                </CourseDetailsLink>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop Layout: Content Left, Image Right (or reversed in RTL) */}
                <div className={`hidden lg:flex lg:flex-row lg:items-center w-full ${isRtl ? 'flex-row-reverse' : ''}`}>
                    {/* Card Content - Left/Right Side depending on direction */}
                    <div className={`flex-1 ${isRtl ? 'pl-6 xl:pl-8' : 'pr-6 xl:pr-8'}`}>
                        <h3 className="text-xl xl:text-2xl font-bold text-[#0F43B4] text-left mb-4">
                            {title}
                        </h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                                <span className="text-[#0F43B4] font-bold text-sm xl:text-base">
                                    {t('courseCard.components')}
                                </span>
                                <span className="text-gray-700 text-sm xl:text-base">
                                    {components.join(" | ")}
                                </span>
                            </div>
                            <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                                <span className="text-[#0F43B4] font-bold text-sm xl:text-base">
                                    {t('courseCard.frameworks')}
                                </span>
                                <span className="text-gray-700 text-sm xl:text-base">
                                    {frameworks.join(" | ")}
                                </span>
                            </div>
                        </div>

                        <div className="text-sm xl:text-base text-gray-700 text-left mb-5">
                            {t('courseCard.instructor')}{" "}
                            <span className="text-[#0F43B4] font-bold">{instructor}</span>
                        </div>

                        <div className="flex flex-col xl:flex-row justify-start gap-3 xl:gap-4">
                            <Button
                                onClick={onSelect}
                                className="w-full xl:w-auto xl:min-w-[140px] h-10 border-2 border-blue-500 text-blue-600 bg-white rounded-lg font-semibold text-sm xl:text-base hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-none"
                            >
                                {t('actions.selectSubCategory')}
                            </Button>
                            {courseId && (
                                <CourseDetailsLink courseId={courseId}>
                                    <Button
                                        className={`w-full xl:w-auto ${isRtl ? 'xl:min-w-[180px]' : 'xl:min-w-[160px]'} h-10 border-2 border-blue-500 text-blue-600 bg-white rounded-lg font-semibold text-sm xl:text-base hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-none`}
                                    >
                                        {t('actions.moreDetails')}
                                    </Button>
                                </CourseDetailsLink>
                            )}
                        </div>
                    </div>

                    {/* Instructor Image - Desktop */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {/* Blue background positioned behind and offset */}
                            <div
                                className={`absolute -top-3 ${isRtl ? '-left-3' : '-right-3'} w-28 h-32 xl:w-32 xl:h-40 bg-[#0F43B4] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:scale-105`}
                            ></div>

                            {/* White container with image */}
                            <div className={`relative bg-white rounded-xl p-2 shadow-lg transition-all duration-500 ease-in-out transform group-hover:scale-105 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} group-hover:translate-y-1`}>
                                <Image
                                    imageurl={image || '/assets/Categoires-Page/image 25.png'}
                                    alt={title}
                                    className="w-24 h-28 xl:w-28 xl:h-36 object-contain rounded-lg transition-all duration-500 ease-in-out group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;