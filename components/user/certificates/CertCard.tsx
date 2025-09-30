'use client';

import Image from 'next/image';
import { useState } from 'react';
import { File } from 'lucide-react';
import { useTranslations } from 'next-intl';

import GrowAnimation from '@/components/GrowAnimation';
import Border from '@/components/courses/Border';
import { Button } from '@/components/ui/button';
import { UserCertificate } from '@/lib/api/user';
import CertificateModal from './CertificateModal';

interface CertCardProps {
  certificate: UserCertificate;
}

function CertCard({ certificate }: CertCardProps) {
  const t = useTranslations('prof-cert');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract course title from certificate with character limit
  const getCourseTitle = () => {
    const title = certificate.courseInfo?.title || certificate.course_title?.en || 'Course Certificate';
    return title.length > 20 ? `${title.substring(0, 20)}...` : title;
  };

  // Get course description with character limit
  const getCourseDescription = () => {
    const description = certificate.courseInfo?.description || '';
    return description.length > 30 ? `${description.substring(0, 30)}...` : description;
  };

  return (
    <>
      <GrowAnimation scale={1.03}>
        <Border padding="py-1 px-[1px] h-fit">
          <div className="bg-primary-foreground course-bg block rounded-md p-1 drop-shadow-lg md:drop-shadow-2xl">
            <Image
              src="/cert.svg"
              alt={`${getCourseTitle()} certificate`}
              width={396}
              height={230}
              className={'mx-auto'}
              style={{ width: 'auto', height: 'auto' }}
            />
            <div className="px-3">
              <h3 className="text-xl font-bold text-primary-identity mb-3 line-clamp-1">
                {getCourseTitle()}
              </h3>

              {/* Description replaces the Completed section */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {getCourseDescription()}
              </p>

              <div className="mt-3 mb-3 flex justify-center xl:gap-2 xl:px-3">
                <Border padding="p-[1px]">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <File /> {t('view')}
                  </Button>
                </Border>
              </div>
            </div>
          </div>
        </Border>
      </GrowAnimation>

      <CertificateModal
        certificate={certificate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default CertCard;
