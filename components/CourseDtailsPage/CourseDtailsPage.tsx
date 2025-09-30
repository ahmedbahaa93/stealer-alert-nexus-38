"use client";

import { useCourseDetailData } from "@/hooks/useCourseDetail";
import { useTranslations } from 'next-intl';
import Image from "../../Ui/Image";
import HeaderOfPage from "./Components/HeaderOfPage";
import CourseDescription from "./Components/CourseDescription";
import CourseContent from "./Components/CourseContent";
import CertificateSection from "./Components/CertificateSection";
import WaysToAttend from "./Components/WaysToAttend";
import SectionAnimation from "./Components/SectionAnimation";
import { CourseDetailSkeleton } from "../ui/skeletons/CourseDetailSkeleton";
import { CourseDetailError } from "../ui/errors/CourseDetailError";
import { CourseDetailEmpty } from "../ui/empty/CourseDetailEmpty";
import Border from "../home/Border";

interface CourseDtailsPageProps {
  courseId?: string;
}

const CourseDtailsPage = ({ courseId }: CourseDtailsPageProps) => {
  const { course, isLoading, isError, error, refetch } = useCourseDetailData(courseId);
  const t = useTranslations('courseDetail');

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError) {
    return <CourseDetailError error={error as Error} onRetry={refetch} />;
  }

  if (!course) {
    return <CourseDetailEmpty />;
  }

  return (
    <div className="page-container">

      <HeaderOfPage
        title={course.title}
        description={course.description}
        categoryName={course.category?.name}
        frameworks={course.framework}
        courseType={course.course_type}
        price={course.price}
        currency={course.currency}
        courseId={courseId}
        startDates={course.start_dates}
        duration={course.duration}
        lessons={course.content_details}
      />

      {/* What's Included Section */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-green-50 py-12 px-4 relative overflow-hidden">
        {/* Background decorative stars */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top left stars */}
          <div className="absolute top-8 left-8">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>
          <div className="absolute top-16 left-32">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>

          {/* Top right stars */}
          <div className="absolute top-6 right-16">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>

          {/* Middle stars */}
          <div className="absolute top-1/2 right-20">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>

          {/* Bottom stars */}
          <div className="absolute bottom-8 left-24">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>
          <div className="absolute bottom-12 right-10">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>

          {/* Additional scattered stars */}
          <div className="absolute top-1/4 left-1/3">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>
          <div className="absolute bottom-10 left-1/3">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>
          <div className="absolute top-1/4 right-1/3">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>
          <div className="absolute bottom-10 right-1/3">
            <Image
              className="lg:w-[30px] lg:h-[30px] w-[15px] h-[15px]"
              imageurl={'/assets/Course-Details-Page/Burst-star.png'}
              alt="star"
            />
          </div>
        </div>

        {/* Main content container */}
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F43B4] mb-2">
              {t('whatsIncluded')}
            </h2>
          </div>

          {/* Cards container */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">
            {/* Projects Card */}
            <div className="relative w-full max-w-sm lg:max-w-xs">
              <Border padding="py-1 px-[1px] h-fit">
                <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="mb-6">
                    <Image
                      className="w-16 h-16 mx-auto"
                      imageurl={'/assets/Course-Details-Page/Group.png'}
                      alt="Projects icon"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F43B4]">
                    {t('projects')}
                  </h3>
                </div>
              </Border>
            </div>

            {/* Certificate Card */}
            <div className="relative w-full max-w-sm lg:max-w-xs">
              <Border padding="py-1 px-[1px] h-fit">
                <div className="bg-white w-[98.5%] mx-auto rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="mb-6">
                    <Image
                      className="w-16 h-16 mx-auto"
                      imageurl={'/assets/Course-Details-Page/Group (1).png'}
                      alt="Certificate icon"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F43B4]">
                    {t('certificateOfCompletion')}
                  </h3>
                </div>
              </Border>
            </div>

            {/* Quizzes Card */}
            <div className="relative w-full max-w-sm lg:max-w-xs">
              <Border padding="py-1 px-[1px] h-fit">
                <div className="bg-white w-[98.5%] mx-auto rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="mb-6">
                    <Image
                      className="w-16 h-16 mx-auto"
                      imageurl={'/assets/Course-Details-Page/Group (2).png'}
                      alt="Quizzes icon"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F43B4]">
                    {t('quizzes')}
                  </h3>
                </div>
              </Border>
            </div>
          </div>
        </div>
      </div>

      <SectionAnimation direction="up" delay={0.2}>
        <CourseDescription description={course.description} />
      </SectionAnimation>

      <SectionAnimation direction="up" delay={0.3}>
        <CourseContent
          content={course.content}
          contentDetails={course.content_details}
          courseVideo={{
            title: course.title,
            videoUrl: course.vedio_url
          }}
        />
      </SectionAnimation>

      <SectionAnimation direction="up" delay={0.4}>
        <CertificateSection
          certificateDetails={course.certificate_details}
          brochureUrl={course.brochure}
        />
      </SectionAnimation>

      <SectionAnimation direction="up" delay={0.5}>
        <WaysToAttend
          courseType={course.course_type}
          startDates={course.start_dates}
          initialPaymentPercentage={course.initial_payment_percentage}
          courseId={courseId}
          courseTitle={course.title}
          coursePrice={course.price}
          courseDuration={course.duration}
        />
      </SectionAnimation>
    </div>
  );
};

export default CourseDtailsPage;
