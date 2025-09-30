'use client';

import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import { DynamicIcon } from '../DynamicIcon';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import '@/components/ui/carousel-fixes.css';
import TestimonialCard from './TestimonialCard';
import { useReviews } from '@/hooks/useReviews';
import TestimonialSkeleton from './TestimonialSkeleton';
import TestimonialError from './TestimonialError';
import TestimonialEmpty from './TestimonialEmpty';

export default function Testimonial() {
  const t = useTranslations('HomePage');
  const { data, isLoading, isError } = useReviews();

  if (isLoading) {
    return <TestimonialSkeleton />;
  }

  if (isError) {
    return <TestimonialError />;
  }

  if (!data?.data?.length) {
    return <TestimonialEmpty />;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-green-500 rounded-full">
              <DynamicIcon
                src="/assets/home/user-check.svg"
                alt="testimonials"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              {t('test')}
            </h2>
          </div>
          <p className="text-gray-600 max-w-lg mx-auto">
            Real success stories from our community
          </p>
        </div>

        {/* 3D floating cards carousel effect */}
        <div className="relative h-[600px] md:h-[550px] mb-12">
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-96 bg-gradient-to-r from-blue-600/10 to-green-400/10 rounded-3xl blur-xl -z-10"></div>

          <Carousel
            plugins={[
              Autoplay({
                delay: 3500,
                stopOnMouseEnter: true,
                stopOnInteraction: false,
              })
            ]}
            opts={{
              loop: true,
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {data.data.map((review) => (
                <CarouselItem
                  key={review._id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialCard
                    fullName={review.fullName}
                    jobTitle={review.jobTitle}
                    content={review.content}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
