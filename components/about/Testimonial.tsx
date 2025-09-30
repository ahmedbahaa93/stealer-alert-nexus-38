'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import Card from './Card';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MotionDiv } from '@/components/ui/motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Real partner logos from the folder
const partnerLogos = [
  {
    src: '/Raiseup success partners logos/Education For Employment-Egypt.png',
    name: 'Education For Employment Egypt'
  },
  {
    src: '/Raiseup success partners logos/Maaden.png',
    name: 'Maaden'
  },
  {
    src: '/Raiseup success partners logos/mcit-logo.png',
    name: 'MCIT Egypt'
  },
  {
    src: '/Raiseup success partners logos/Ministry of Communications and Information Technology of Saudi Arabia.png',
    name: 'MCIT Saudi Arabia'
  },
  {
    src: '/Raiseup success partners logos/Ministry-of-Defense.png',
    name: 'Ministry of Defense'
  },
  {
    src: '/Raiseup success partners logos/STC.png',
    name: 'STC'
  },
  {
    src: '/Raiseup success partners logos/tahakom logo.png',
    name: 'Tahakom'
  },
  {
    src: '/Raiseup success partners logos/Terre des hommes.png',
    name: 'Terre des hommes'
  }
];

export default function Testimonial() {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: isTablet ? (isMobile ? 1 : 3) : 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    centerMode: true,
    centerPadding: '10px',
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: '40px',
        }
      }
    ]
  };

  const reversedSettings = {
    ...sliderSettings,
    autoplay: true,
    rtl: true,
  };

  if (!isClient) {
    return (
      <div className="mt-10 py-4">
        <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="mt-10 py-8 ">
      {/* First Slider Row - Moving Left */}
      <div className="mb-6 py-6 px-4">
        <Slider {...sliderSettings}>
          {partnerLogos.map((logo, idx) => (
            <div key={`logo-${idx}`} className="px-3">
              <CertificateCard src={logo.src} name={logo.name} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Second Slider Row - Moving Right */}
      <div className="py-6 px-4">
        <Slider {...reversedSettings}>
          {partnerLogos.map((logo, idx) => (
            <div key={`logo-r-${idx}`} className="px-3">
              <CertificateCard src={logo.src} name={logo.name} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

interface CertificateCardProps {
  src: string;
  name: string;
}

function CertificateCard({ src, name }: CertificateCardProps) {
  return (
    <MotionDiv
      className="p-3 mx-2"
      whileHover={{
        y: -5,
        scale: 1.05,
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 300
        }
      }}
    >
      <Card className="h-full overflow-visible">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg p-2 w-24 h-24 flex items-center justify-center mb-2">
            <MotionDiv
              whileHover={{
                scale: 1.05,
                transition: {
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }
              }}
            >
              <Image
                src={src}
                alt={name}
                width={160}
                height={120}
                className="object-cover scale-150"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-primary font-bold text-sm">${name}</span>`;
                  }
                }}
              />
            </MotionDiv>
          </div>
          <p className="text-xs font-medium text-gray-800 text-center max-w-[100px]  text-ellipsis">
            {name.length > 15 ? `${name.substring(0, 15)}...` : name}
          </p>
        </div>
      </Card>
    </MotionDiv>
  );
}
