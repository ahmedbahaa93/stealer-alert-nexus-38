"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import Slider from 'react-slick';
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import NewTestimonialSkeleton from "./NewTestimonialSkeleton";
import NewTestimonialError from "./NewTestimonialError";
import NewTestimonialEmpty from "./NewTestimonialEmpty";
import NewTestimonialCard from "./NewTestimonialCard";
import { MotionDiv, MotionH2 } from "@/components/ui/motion";
import { DynamicIcon } from "../DynamicIcon";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function NewTestimonial() {
    const t = useTranslations("HomePage");
    const { data, isLoading, isError } = useReviews();
    const [isClient, setIsClient] = useState(false);
    const sliderRef = useRef<Slider>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const SliderArrow = ({ direction }: { direction: "left" | "right" }) => (
        <button
            onClick={() => {
                if (direction === "left") {
                    sliderRef.current?.slickPrev();
                } else {
                    sliderRef.current?.slickNext();
                }
            }}
            className="relative z-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-xl p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-110"
            aria-label={direction === "left" ? "Previous slide" : "Next slide"}
        >
            {direction === "left" ? (
                <ChevronLeft className="w-6 h-6" />
            ) : (
                <ChevronRight className="w-6 h-6" />
            )}
        </button>
    );

    // Responsive settings for the slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    centerMode: true,
                    centerPadding: '40px'
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    centerMode: true,
                    centerPadding: '60px'
                }
            }
        ]
    };

    if (isLoading || !isClient) {
        return <NewTestimonialSkeleton />;
    }

    if (isError) {
        return <NewTestimonialError onRetry={() => { }} />;
    }

    if (!data?.data?.length) {
        return <NewTestimonialEmpty />;
    }

    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-white">
            <div className="container mx-auto px-4 relative z-10">
                {/* Title section */}
                <MotionDiv
                    className="mx-auto flex items-center justify-center space-x-3 mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <MotionDiv
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                        viewport={{ once: true }}
                    >
                        <DynamicIcon
                            src="/assets/home/user-check.svg"
                            alt="testimonials"
                            width={60}
                        />
                    </MotionDiv>
                    <MotionH2
                        className="text-primary-identity text-4xl font-bold"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        {t("test")}
                    </MotionH2>
                </MotionDiv>

                {/* Testimonial slider */}
                <div className="relative py-12 overflow-hidden">
                    <div className="mx-2 py-6">
                        <Slider ref={sliderRef} {...settings}>
                            {data.data.map((review, index) => (
                                <div key={review._id} className="px-3 md:px-4 lg:px-6 py-6">
                                    <NewTestimonialCard
                                        fullName={review.fullName}
                                        jobTitle={review.jobTitle}
                                        content={review.content}
                                        rating={5}
                                        index={index}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    {/* Navigation buttons below slider */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <SliderArrow direction="left" />
                        <SliderArrow direction="right" />
                    </div>
                </div>
            </div>
        </section>
    );
}
