
"use client";

import { useTranslations } from 'next-intl';

interface CourseDescriptionProps {
  description?: string;
}

const CourseDescription = ({ description }: CourseDescriptionProps) => {
  const t = useTranslations('courseDetail');
  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-4xl ">
        <div className="flex  gap-12 items-start">
          {/* Left Column - Course Description */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F43B4] mb-6">
              {t('courseDescription')}
            </h2>
            <div className="space-y-4 text-sm text-gray-500 font-medium leading-relaxed">
              {description ? (
                <p>{description}</p>
              ) : (
                <>
                  <p>
                    This comprehensive front-end development bootcamp is designed to equip you with the essential skills needed to create modern, responsive, and interactive websites. Whether you&apos;re a complete beginner or looking to enhance your existing skills, this program provides a structured learning path that covers all the fundamental technologies and best practices in front-end development.
                  </p>
                  <p>
                    Throughout this bootcamp, you&apos;ll gain hands-on experience with HTML5, CSS3, JavaScript, and popular frameworks like React. You&apos;ll learn how to create responsive designs that work seamlessly across all devices, implement interactive user interfaces, and follow industry best practices for code organization and version control.
                  </p>
                </>
              )}
            </div>
          </div>

         
          
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;