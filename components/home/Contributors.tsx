"use client";

import { MotionDiv, MotionH2 } from '@/components/ui/motion';
import { DynamicIcon } from '../DynamicIcon';
import ContributorsCard from './ContributorsCard';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

function Contributors() {
  const t = useTranslations('HomePage');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const contributors = [
    {
      imageSrc: '/assets/Counterbuters/Group 772.png',
      title: 'Technology Partner',
      alt: 'Technology Partnership'
    },
    {
      imageSrc: '/assets/Counterbuters/Group 772 (1).png',
      title: 'Cloud Services',
      alt: 'Cloud Services Partner'
    },
    {
      imageSrc: '/assets/Counterbuters/Group 772 (2).png',
      title: 'Education Platform',
      alt: 'Education Platform Partner'
    },
    {
      imageSrc: '/assets/Counterbuters/Group 772 (3).png',
      title: 'Industry Leader',
      alt: 'Industry Leading Partner'
    },
    {
      imageSrc: '/assets/Counterbuters/Frame 427319108.png',
      title: 'Business Solutions',
      alt: 'Business Solutions Partner'
    },
    {
      imageSrc: '/assets/Counterbuters/certificate-icon 1.png',
      title: 'Certification Authority',
      alt: 'Certification Provider'
    }
  ];

  // Duplicate contributors for seamless infinite loop
  const infiniteContributors = [...contributors, ...contributors, ...contributors];

  if (!isClient) {
    return (
      <div className="mb-15 bg-gradient-to-l from-blue-100 to-white p-5">
        <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
          <DynamicIcon
            src="/assets/home/Group (1).svg"
            alt="partners"
            width={60}
          />
          <h2 className="text-primary-identity text-4xl font-bold">
            {t('partners')}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-15 bg-gradient-to-l from-blue-100 to-white p-5 overflow-hidden relative">
      {/* Header Section */}
      <MotionDiv
        className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <MotionDiv
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          viewport={{ once: true }}
        >
          <DynamicIcon
            src="/assets/home/Group (1).svg"
            alt="partners"
            width={60}
          />
        </MotionDiv>
        <MotionH2
          className="text-primary-identity text-4xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {t('partners')}
        </MotionH2>
      </MotionDiv>

      {/* Infinite Animation Section */}
      <div className="relative w-full">
        {/* First Row - Left to Right */}
        <MotionDiv
          className="flex gap-6 mb-8"
          animate={{
            x: [0, -1920] // Adjust based on card width and gap
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {infiniteContributors.map((contributor, index) => (
            <MotionDiv
              key={`row1-${index}`}
              className="flex-shrink-0 w-80"
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ContributorsCard
                imageSrc={contributor.imageSrc}
                title={contributor.title}
                alt={contributor.alt}
              />
            </MotionDiv>
          ))}
        </MotionDiv>

        {/* Second Row - Right to Left */}
        <MotionDiv
          className="flex gap-6"
          animate={{
            x: [-1920, 0] // Opposite direction
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30, // Slightly different speed for visual interest
              ease: "linear",
            },
          }}
        >
          {infiniteContributors.slice().reverse().map((contributor, index) => (
            <MotionDiv
              key={`row2-${index}`}
              className="flex-shrink-0 w-80"
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ContributorsCard
                imageSrc={contributor.imageSrc}
                title={contributor.title}
                alt={contributor.alt}
              />
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>

      {/* Gradient Overlays for Seamless Edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-blue-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-blue-100 to-transparent z-10 pointer-events-none" />
    </div>
  );
}

export default Contributors;
