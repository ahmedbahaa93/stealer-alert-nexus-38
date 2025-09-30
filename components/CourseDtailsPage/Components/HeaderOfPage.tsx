"use client";

import React, { useState } from "react";
import Image from "../../../Ui/Image";
import Stars from "./Stars/Stars";
import SectionAnimation from "./SectionAnimation";
import { MotionButton, MotionDiv, MotionSpan, MotionSvg } from "@/components/ui/motion";
import { useTranslations, useLocale } from 'next-intl';
import { useDirection } from "@/hooks/useLocalization";
import { EnrollmentModal } from "@/components/enrollment/EnrollmentModal";
import { useLocationAwarePrice } from "@/hooks/useLocationAwarePrice";

interface HeaderOfPageProps {
  title?: string;
  description?: string;
  categoryName?: string;
  frameworks?: string;
  courseType?: string[] | string;
  price?: number;
  currency?: string;
  courseId?: string;
  startDates?: Array<{
    date: string;
    available_slots: number;
  }>;
  duration?: number;
  lessons?: Array<{
    title: string;
    content: string[];
  }>;
}

const HeaderOfPage = ({
  title,
  description,
  categoryName,
  frameworks,
  courseType,
  price,
  // currency, // Not used anymore - location-aware pricing handles this
  courseId,
  startDates = [],
  duration,
  lessons = []
}: HeaderOfPageProps) => {
  const t = useTranslations('courseDetail');
  const { isRtl } = useDirection();
  const locale = useLocale();
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  // Use location-aware pricing
  const locationAwarePrice = useLocationAwarePrice(price || null);

  const handleEnrollNow = () => {
    if (courseId) {
      // Navigate to enrollment page instead of showing modal
      window.location.href = `/${locale}/enrollment/${courseId}`;
    }
  };
  // Use the props or fallback to placeholder values
  return (
    <div className="w-full bg-[#0F43B4] relative overflow-hidden pt-20">
      {/* Background decorative elements - responsive sizing */}
      <div className="absolute lg:block hidden left-0 bottom-0 opacity-60 sm:opacity-70 lg:opacity-80 w-32 h-32 sm:w-40 sm:h-40 lg:w-50 lg:h-50">
        <Image
          className="w-full h-full"
          imageurl={'/assets/Course-Details-Page/Looper-3 (1).png'}
          alt="Looper"
        />
      </div>
      <div className="absolute lg:block hidden right-0 top-10 w-40 h-40 sm:w-50 sm:h-50 lg:w-60 lg:h-60">
        <Image
          className="w-full h-full"
          imageurl={'/assets/Course-Details-Page/Looper-3.png'}
          alt="Looper"
        />
      </div>

      {/* Main content with responsive margins and layout */}
      <div dir={isRtl ? "rtl" : "ltr"} className="relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between mx-4 sm:mx-6 md:mx-8 lg:mx-16 xl:mx-24 2xl:mx-32 pt-10 lg:pt-14  pb-6 sm:pb-8 md:pb-10 lg:pb-12 gap-6 sm:gap-8 min-h-[400px] sm:min-h-[450px] lg:min-h-[500px]">
        {/* LEFT - Text Content */}
        <div className={`flex flex-col gap-4 sm:gap-5 lg:gap-6 text-white w-full lg:max-w-[55%] text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
          <SectionAnimation direction="up" delay={0.1}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {title || 'Front-End Bootcamp: 5 essential skills to build modern websites'}
            </h1>
          </SectionAnimation>

          <SectionAnimation direction="up" delay={0.2}>
            <p className="text-xs sm:text-sm text-center uppercase tracking-wide text-gray-300 font-medium">
              {categoryName || 'Web Development Program'}
            </p>
          </SectionAnimation>

          <SectionAnimation direction="up" delay={0.3}>
            <div className={`flex justify-center ${isRtl ? 'lg:justify-end' : 'lg:justify-start'}`}>
              <Stars />
            </div>
          </SectionAnimation>

          <SectionAnimation direction="up" delay={0.4}>
            <p className={`text-sm sm:text-base lg:text-md leading-relaxed ${isRtl ? 'mr-6' : 'ml-6'} text-gray-200 max-w-4xl`}>
              {description || 'Learn the essential front-end skills to build modern, interactive websites. This program covers responsive design, HTML/CSS fundamentals, JavaScript, and popular frameworks like React. Understand how to structure user interfaces and implement real-world web component'}{" "}
              <span className="text-[#61E4AE] font-medium cursor-pointer hover:underline">{t('learnMore')}</span>
            </p>
          </SectionAnimation>

          {/* Tags - responsive layout - Dynamic from lessons */}
          <SectionAnimation direction="up" delay={0.5} stagger={true} staggerDelay={0.1}>
            <div className="flex flex-col gap-2 sm:gap-3 mt-2">
              {lessons && lessons.length > 0 ? (
                // Group lessons into rows of 2-3 tags each for responsive layout
                <>
                  {/* First row */}
                  <div className="flex gap-3 sm:gap-5 justify-center flex-wrap">
                    {lessons.slice(0, 3).map((lesson, index) => (
                      <MotionDiv
                        key={`lesson-${index}`}
                        className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {lesson.title}
                      </MotionDiv>
                    ))}
                  </div>
                  {/* Second row if more than 3 lessons */}
                  {lessons.length > 3 && (
                    <div className="flex gap-3 sm:gap-5 justify-center flex-wrap">
                      {lessons.slice(3, 6).map((lesson, index) => (
                        <MotionDiv
                          key={`lesson-second-${index}`}
                          className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {lesson.title}
                        </MotionDiv>
                      ))}
                      {/* Show "+" indicator if more than 6 lessons */}
                      {lessons.length > 6 && (
                        <MotionDiv
                          className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          +{lessons.length - 6} more
                        </MotionDiv>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Fallback to static tags if no lessons data
                <>
                  <div className="flex gap-5 justify-center">
                    <MotionDiv
                      className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {Array.isArray(courseType) ? courseType[0] : courseType || 'Online'}
                    </MotionDiv>
                    <MotionDiv
                      className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {frameworks?.split(',')[0] || 'JavaScript Fundamentals'}
                    </MotionDiv>
                  </div>
                  <div className="flex gap-5 justify-center">
                    <MotionDiv
                      className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('responsive')}
                    </MotionDiv>
                    <MotionDiv
                      className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {frameworks?.split(',')[1] || 'React Basics'}
                    </MotionDiv>
                    <MotionDiv
                      className="border border-white/60 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Version Control with Git
                    </MotionDiv>
                  </div>
                </>
              )}
            </div>
          </SectionAnimation>

          {/* CTA and Price - responsive layout */}
          <SectionAnimation direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-center mt-4 sm:mt-6 justify-center lg:justify-around">
              <div className="flex  justify-center items-center">
                <MotionButton
                  className="bg-transparent  text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold flex items-center gap-2 justify-center lg:text-md text-base"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('subscribeNow')}
                  <MotionSvg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </MotionSvg>
                </MotionButton>

                <MotionButton
                  onClick={handleEnrollNow}
                  disabled={!courseId}
                  className="bg-white text-[#0F43B4] px-5 py-2 rounded-[10px] font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('enrollNow')}
                </MotionButton>
              </div>
              <div className="flex justify-center items-center">
                <div className="text-white flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                  <span className="font-medium text-sm sm:text-base">{t('price')}</span>
                  <MotionSvg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </MotionSvg>
                  <MotionSpan
                    className="bg-white text-[#0F43B4] px-5 py-2 rounded-[10px] font-bold text-sm sm:text-lg shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  >
                    {locationAwarePrice.formatted}
                  </MotionSpan>
                </div>
              </div>
            </div>
          </SectionAnimation>
        </div>

        {/* RIGHT - Image Section */}
        <SectionAnimation direction="right" delay={0.3} className="w-full lg:w-[45%] flex justify-center items-center relative mt-6 lg:mt-0">
          <div className="relative w-full flex justify-center items-center">
            <MotionDiv
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                imageurl={'/assets/Course-Details-Page/Bootcamp_-_Traffic_Transformation_Bootcamp-removebg-preview.png'}
                alt="Course illustration"
                className="object-contain lg:translate-x-20 max-w-[300px] translate-y-8"
              />
            </MotionDiv>
            {/* Additional glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${isRtl ? 'from-white/5 via-transparent to-transparent' : 'from-transparent via-white/5 to-transparent'} rounded-lg`}></div>
          </div>
        </SectionAnimation>
      </div>

      {/* Enrollment Modal */}
      {courseId && (
        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          courseId={courseId}
          startDates={startDates}
          courseTitle={title || 'Course'}
          coursePrice={locationAwarePrice.amount}
          courseDuration={duration}
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

export default HeaderOfPage;