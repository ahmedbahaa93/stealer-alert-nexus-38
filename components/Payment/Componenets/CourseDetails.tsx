"use client";

import Image from "../../../Ui/Image";
import { usePaymentCourseData } from "@/hooks/usePaymentCourse";
import { useTranslations } from "next-intl";

interface CourseDetailsProps {
    courseId: string;
}

const CourseDetails = ({ courseId }: CourseDetailsProps) => {
    const t = useTranslations('payment-form');
    const { data: courseData, isLoading, error } = usePaymentCourseData(courseId);

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl md:w-[600px] w-full shadow-lg shadow-gray-500 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (error || !courseData) {
        return (
            <div className="bg-white rounded-xl md:w-[600px] w-full shadow-lg shadow-gray-500 p-6">
                <div className="text-red-500 text-center">{t('course.error')}</div>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-xl md:w-[600px] w-full shadow-lg shadow-gray-500">
            <div className="relative inset-0 pointer-events-none">
                <div className="absolute top-8 left-8 w-16 h-16">
                    <Image imageurl="/assets/Payment-Page/document.svg" className="md:w-[70px] w-[40px]" alt="circle" />
                </div>
            </div>

            {/* Course Illustration */}
            <div className="p-1 flex items-center justify-center rounded-lg text-center">
                <Image
                    className="w-[500px] h-[300px] object-cover rounded-lg"
                    imageurl={courseData.image || "/assets/Payment-Page/image 32.svg"}
                    alt={courseData.title || "Course Image"}
                />
            </div>

            {/* Course Information */}
            <div className="p-6 space-y-4" dir="auto">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{courseData.title}</h3>
                    {courseData.description && (
                        <p className="text-gray-600 text-sm">{courseData.description}</p>
                    )}
                </div>                    {/* Pricing Details */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-black font-medium">{t('course.price')}</span>
                        <span className="font-semibold text-gray-900">
                            {courseData.price} {courseData.currency || '$'}
                        </span>
                    </div>

                    {courseData.discount && courseData.discountPercentage && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-green-600 font-medium">{t('course.discount')}</span>
                            <span className="font-semibold text-green-600">
                                -{courseData.discountPercentage}%
                            </span>
                        </div>
                    )}

                    {courseData.duration && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-black font-medium">{t('course.duration')}</span>
                            <span className="font-semibold text-gray-900">
                                {courseData.duration} {t('course.hours')}
                            </span>
                        </div>
                    )}

                    {/* Final Price */}
                    <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4 mt-4">
                        <span className="text-[#0F43B4] font-bold text-lg">{t('course.total')}</span>
                        <span className="font-bold text-[#0F43B4] text-xl">
                            {courseData.discount && courseData.discountPercentage
                                ? Math.round(courseData.price * (1 - courseData.discountPercentage / 100))
                                : courseData.price
                            } {courseData.currency || '$'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
