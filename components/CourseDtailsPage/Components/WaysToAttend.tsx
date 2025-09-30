"use client";

import React, { useState } from 'react';
import Image from '../../../Ui/Image';
import Border from '../../courses/Border';
import { useTranslations, useLocale } from 'next-intl';
import { EnrollmentModal } from '@/components/enrollment/EnrollmentModal';

interface StartDate {
  date: string;
  available_slots: number;
}

interface WaysToAttendProps {
  courseType?: string[] | string;
  startDates?: StartDate[];
  initialPaymentPercentage?: number;
  courseId?: string;
  courseTitle?: string;
  coursePrice?: number;
  courseDuration?: number;
}

const WaysToAttend = ({
  courseType = ['Online'],
  startDates = [],
  // initialPaymentPercentage = 50,
  courseId,
  courseTitle,
  coursePrice,
  courseDuration
}: WaysToAttendProps) => {
  const t = useTranslations('courseDetail');
  const locale = useLocale();
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const handleEnrollNow = () => {
    if (courseId) {
      // Navigate to enrollment page instead of showing modal with course type parameter
      const courseTypeParam = Array.isArray(courseType) && courseType.length > 0
        ? courseType[0]
        : typeof courseType === 'string' ? courseType : 'Online';
      window.location.href = `/${locale}/enrollment/${courseId}?type=${encodeURIComponent(courseTypeParam)}`;
    }
  };
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large decorative shapes in background */}
        <div className="absolute lg:block hidden top-20 right-16 w-60 h-36 ">
          <Image
            imageurl={'/assets/Course-Details-Page/book_ribbon.png'}
            alt='book'
          />
        </div>
        <div className="absolute lg:block hidden bottom-16 left-20 w-40 h-40 ">
          <Image
            imageurl={'/assets/Course-Details-Page/play_lesson.png'}
            alt='book'
          />
        </div>

      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Available Course Type Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
          {Array.isArray(courseType) && courseType.length > 0 ? (
            courseType.map((type, index) => (
              <button
                key={index}
                className="bg-[#0F43B4] text-white border-2 border-[#0F43B4] px-8 py-3 rounded-lg font-semibold text-lg min-w-[140px] shadow-lg"
              >
                {type.toLowerCase() === 'online' ? t('online') :
                  type.toLowerCase() === 'in person' ? t('inPerson') :
                    type.toLowerCase() === 'recorded' ? t('recorded') : type}
              </button>
            ))
          ) : typeof courseType === 'string' ? (
            <button
              className="bg-[#0F43B4] text-white border-2 border-[#0F43B4] px-8 py-3 rounded-lg font-semibold text-lg min-w-[140px] shadow-lg"
            >
              {courseType.toLowerCase() === 'online' ? t('online') :
                courseType.toLowerCase() === 'in person' ? t('inPerson') :
                  courseType.toLowerCase() === 'recorded' ? t('recorded') : courseType}
            </button>
          ) : (
            <button
              className="bg-[#0F43B4] text-white border-2 border-[#0F43B4] px-8 py-3 rounded-lg font-semibold text-lg min-w-[140px] shadow-lg"
            >
              {t('online')}
            </button>
          )}
        </div>

        {/* Subtitle Text */}
        <p className="text-gray-600 mb-8 text-base">
          {t('chooseCourseMethod')}
        </p>

        {/* Payment Information */}
        {/* {initialPaymentPercentage && initialPaymentPercentage < 100 && (
          <p className="text-gray-600 mb-4 text-sm">
            {t.rich('initialPayment', { percentage: initialPaymentPercentage })}
          </p>
        )} */}

        {/* Enroll Now Button with Gradient Border */}
        <div className="flex justify-center">
          <Border padding="p-[1px]">
            <button
              onClick={handleEnrollNow}
              disabled={!courseId}
              className="bg-white text-[#0F43B4] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-sm border border-gray-200"
            >
              {t('enrollNow')}
            </button>
          </Border>
        </div>
      </div>

      {/* Enrollment Modal */}
      {courseId && (
        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          courseId={courseId}
          startDates={startDates}
          courseTitle={courseTitle || 'Course'}
          coursePrice={coursePrice || 0}
          courseDuration={courseDuration}
          courseType={courseType}
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

export default WaysToAttend;