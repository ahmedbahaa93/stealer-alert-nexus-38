import React, { useState } from "react";
import { Clock, DollarSign, FileText, Code, Award } from "lucide-react";
import Image from "../../../Ui/Image";
import Button from "../../../Ui/Button";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { EnrollmentModal } from "@/components/enrollment/EnrollmentModal";
import { useLocationAwarePrice } from "@/hooks/useLocationAwarePrice";

interface CourseCardProps {
    id?: string;
    title: string;
    image: string;
    description: string;
    hours: string;
    cost: string;
    courseType: string;
    content: string[];
    framework: string;
    discount?: string;
    price?: number;
    duration?: number;
    startDates?: Array<{
        date: string;
        available_slots: number;
    }>;
}

const ProfessionalCourseCard = ({
    id,
    title,
    image,
    description,
    hours,
    cost,
    courseType,
    content,
    framework,
    discount,
    price,
    duration,
    startDates = []
}: CourseCardProps) => {
    const router = useRouter();
    const locale = useLocale();
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

    // Use the id prop directly, fallback to a generated ID if needed
    const actualCourseId = id;

    // Parse price from cost string if price is not provided
    const parsedPrice = price || parseInt(cost.replace(/[^\d]/g, '')) || 0;
    // Parse duration from hours string if duration is not provided
    const parsedDuration = duration || parseInt(hours.replace(/[^\d]/g, '')) || 0;

    // Use location-aware pricing for consistent display
    const locationAwarePrice = useLocationAwarePrice(parsedPrice);
    const displayPrice = locationAwarePrice.formatted;

    const handleEnrollNow = () => {
        if (actualCourseId) {
            // Navigate directly to enrollment page instead of showing modal
            router.push(`/${locale}/enrollment/${actualCourseId}`);
        }
    };

    const handleViewDetails = () => {
        if (actualCourseId) {
            router.push(`/${locale}/course-details/${actualCourseId}`);
        }
    };

    return (
        <div>
            <div className="bg-gradient-to-r from-[#0F43B4]  to-[#61E4AE] p-[3px] rounded-2xl h-full hover:from-[#61E4AE] hover:to-[#0F43B4] hover:scale-[1.03] transition-all duration-500 ease-in-out">
                <div className="relative bg-white rounded-2xl px-6 py-5 flex flex-col h-full justify-between">
                    {/* Discount Badge */}
                    {discount && (
                        <div className="absolute -top-[3px] -right-[3px] z-10 w-12 h-16">
                            <Image
                                imageurl={"/assets/Categoires-Page/Vector.png"}
                                alt="discount"
                                className="w-full h-full"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-bold leading-tight">
                                <span>{discount}</span>
                                <span>sale</span>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col items-start mb-4">
                        <h3 className="text-lg font-bold text-[#0F43B4] mb-2 w-full">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-3 w-full line-clamp-3">
                            {description}
                        </p>
                    </div>

                    {/* Top Row: Image and Hours */}
                    <div className="flex w-full  items-center mb-4">
                        {/* Hours */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-[#0F43B4]" />
                                <span className="text-lg font-bold text-[#0F43B4]">Hours</span>
                                <span className="text-base text-black font-semibold">{hours}</span>
                            </div>
                        </div>
                        {/* Image */}
                        <div className="relative">
                            <Image
                                imageurl={image}
                                alt={title}
                                className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className="space-y-4 mb-4 w-full flex-grow">
                        <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4 text-[#0F43B4]" />
                                        <span className="text-lg font-bold text-[#0F43B4]">Cost</span>
                                    </div>
                                    <span className="text-lg text-black font-bold text-center">
                                        {displayPrice}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <Award className="w-4 h-4 text-[#0F43B4]" />
                                        <span className="text-lg font-bold text-[#0F43B4]">
                                            Course Type
                                        </span>
                                    </div>
                                    <span className="text-base text-black font-semibold text-center">
                                        {courseType}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 justify-center">
                            <div className="flex gap-2 items-center justify-center">
                                <FileText className="w-4 h-4 text-[#0F43B4]" />
                                <span className="text-lg font-bold text-[#0F43B4]">Content</span>
                            </div>
                            <span className="text-base text-black font-semibold">
                                {content.map((item, index) => (
                                    <span key={index}>
                                        {item}
                                        {index < content.length - 1 && (
                                            <span className="mx-1 text-green-400 font-bold">/</span>
                                        )}
                                    </span>
                                ))}
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 justify-center">
                            <div className="flex gap-2 items-center justify-center">
                                <Code className="w-4 h-4 text-[#0F43B4]" />
                                <span className="text-lg font-bold text-[#0F43B4]">Frame Work</span>
                            </div>
                            <span className="text-base text-black font-semibold">
                                {framework}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto pt-4 flex flex-col space-y-3">
                        <div className="bg-gradient-to-r from-[#0F43B4] to-[#61E4AE] p-[2px] rounded-lg hover:from-[#61E4AE] hover:to-[#0F43B4] transition-all duration-500 ease-in-out">
                            <Button
                                onClick={handleEnrollNow}
                                disabled={!actualCourseId}
                                className="w-full h-10 bg-white text-[#0F43B4] rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-none"
                            >
                                Enroll Now
                            </Button>
                        </div>

                        <div className="bg-gradient-to-r from-[#0F43B4] to-[#61E4AE] p-[2px] rounded-lg hover:from-[#61E4AE] hover:to-[#0F43B4] transition-all duration-500 ease-in-out">
                            <Button
                                onClick={handleViewDetails}
                                disabled={!actualCourseId}
                                className="w-full h-10 bg-white text-[#0F43B4] rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-none"
                            >
                                More Details
                            </Button>
                        </div>
                    </div>                </div>
            </div>

            {/* Enrollment Modal */}
            {actualCourseId && (
                <EnrollmentModal
                    isOpen={showEnrollmentModal}
                    onClose={() => setShowEnrollmentModal(false)}
                    courseId={actualCourseId}
                    startDates={startDates}
                    courseTitle={title}
                    coursePrice={parsedPrice}
                    courseDuration={parsedDuration}
                    courseType={courseType || ['Online']}
                    onSuccess={() => {
                        setShowEnrollmentModal(false);
                        // The enrollment hook will handle navigation to success page
                    }}
                    onError={(error) => {
                        console.error('Enrollment error:', error);
                        // Error handling is done by the modal itself
                    }}
                />
            )}
        </div>
    );
};

export default ProfessionalCourseCard;
