"use client";

import Image from 'next/image';
import Border from './Border';
import { MotionDiv, MotionH2 } from '@/components/ui/motion';
import styles from './ContributorsCard.module.css';

interface ContributorsCardProps {
  imageSrc: string;
  title: string;
  alt: string;
}

function ContributorsCard({ imageSrc, title, alt }: ContributorsCardProps) {
  return (
    <div className={`${styles.cardContainer} w-[300px] h-[240px] z-50`}>
      <Border padding="py-1 px-[1px] h-full">
        <div className={`${styles.contributorCard} bg-card rounded-lg p-5 drop-shadow-lg transition-all duration-300 hover:shadow-xl h-full flex flex-col justify-between`}>
          <div className="mx-auto h-[120px] w-full flex items-center justify-center mb-4">
            <MotionDiv
              whileHover={{
                scale: 1.15,
                rotate: 3,
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 10
              }}
            >
              <Image
                src={imageSrc}
                alt={alt}
                width={160}
                height={120}
                className="object-contain max-w-full max-h-full"
              />
            </MotionDiv>
          </div>
          <MotionH2
            className="text-center text-base font-bold text-gray-800"
            whileHover={{ color: "#0F43B4", scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </MotionH2>
        </div>
      </Border>
    </div>
  );
}

export default ContributorsCard;
