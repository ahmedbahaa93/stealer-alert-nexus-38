"use client";

import { useState } from "react";
import Button from "../../../Ui/Button";
import Image from "../../../Ui/Image";
import { useTranslations } from 'next-intl';

interface CertificateSectionProps {
  certificateDetails?: string;
  brochureUrl?: string;
}

const CertificateSection = ({ certificateDetails, brochureUrl }: CertificateSectionProps) => {
  const t = useTranslations('courseDetail');
  const [showBrochure, setShowBrochure] = useState(false);

  const handleDownloadClick = () => {
    // Just show the download button when clicking on the icon
    setShowBrochure(true);
  };

  const handleDownloadBrochure = () => {
    if (brochureUrl) {
      // Open the brochure URL in a new tab
      window.open(brochureUrl, '_blank');
    }
  };
  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-7xl ">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
          {/* Left Column */}
          <div className="md:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F43B4] mb-6">
              {t('certification')}
            </h2>
            <div className="space-y-4 text-gray-500 font-medium leading-relaxed">
              <p>
                {certificateDetails || 'Upon completing this course, you will receive a professional certificate that validates your skills and knowledge in front-end development. This certificate can be added to your resume and shared on professional networking platforms.'}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex items-center gap-4 md:w-1/3">
            <div
              className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
              onClick={handleDownloadClick}
            >
              <Image
                className="w-[50px] h-[30px] md:w-[60px] md:h-[40px]"
                imageurl={'/assets/Course-Details-Page/Group (3).png'}
                alt="Download"
              />
            </div>
            <div className={`flex-none transition-all duration-500 ease-in-out ${showBrochure ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'}`}>
              <Button
                onClick={handleDownloadBrochure}
                className="inline-flex bg-[#0F43B4] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0d3a9c] transform transition-all duration-300"
              >
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateSection;
