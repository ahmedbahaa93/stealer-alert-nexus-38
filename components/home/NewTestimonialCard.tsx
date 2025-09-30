"use client";

import { MotionDiv, MotionSvg } from '@/components/ui/motion';
import { useEffect, useState } from "react";
import { DynamicIcon } from "../DynamicIcon";

interface TestimonialCardProps {
    fullName: string;
    jobTitle: string;
    content: string;
    rating?: number;
    avatarUrl?: string;
    index: number;
}

function NewTestimonialCard({
    fullName,
    jobTitle,
    content,
    rating = 5,
    avatarUrl,
    index,
}: TestimonialCardProps) {
    const [isClient, setIsClient] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Check if we're on a mobile device
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isClient) return null;

    // Generate initials from name
    const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Get a deterministic color based on the name
    const getColorFromName = (name: string) => {
        const colors = [
            "from-blue-500 to-blue-600",
            "from-green-500 to-green-600",
            "from-purple-500 to-purple-600",
            "from-indigo-500 to-indigo-600",
            "from-pink-500 to-pink-600",
            "from-red-500 to-red-600",
            "from-yellow-500 to-yellow-600",
            "from-teal-500 to-teal-600",
        ];

        const hash = name.split("").reduce((acc, char) => {
            return acc + char.charCodeAt(0);
        }, 0);

        return colors[hash % colors.length];
    };

    const bgGradient = getColorFromName(fullName);

    // Staggered animations based on index - simplified for mobile
    return (
        <MotionDiv
            className="h-full w-full will-change-transform"
            initial={{ opacity: 0, y: isMobile ? 20 : 50 }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                    duration: isMobile ? 0.4 : 0.7,
                    delay: isMobile ? 0 : index * 0.15,
                    ease: isMobile ? "easeOut" : [0.23, 1, 0.32, 1] // Simpler easing for mobile
                }
            }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={isMobile ? undefined : {
                scale: 1.05,
                y: -8,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: {
                    duration: 0.3,
                    ease: "easeOut"
                }
            }}
        >
            <div className="bg-[#0F43B4] rounded-2xl p-4 md:p-6 lg:p-8 shadow-xl h-full min-h-[280px] md:min-h-[300px] lg:min-h-[320px] transition-all duration-300 flex flex-col relative opacity-100 testimonial-card-blue">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 bg-white rounded-full p-2 shadow-md">
                    <div className={`w-10 h-10 bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center`}>
                        <DynamicIcon
                            src="/assets/home/qoute.svg"
                            width={20}
                            height={20}
                            alt="quote-icon"
                            className="text-white"
                        />
                    </div>
                </div>

                {/* Rating */}
                <div className="flex mb-6 mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <MotionSvg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={i < rating ? "#FFB800" : "#E5E7EB"}
                            className="mr-1"
                            initial={{ opacity: 0, scale: isMobile ? 0.8 : 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    delay: isMobile ? i * 0.05 : (index * 0.15) + (i * 0.1),
                                    duration: isMobile ? 0.2 : 0.3,
                                    type: isMobile ? "tween" : "spring", // Use simpler animation type for mobile
                                    stiffness: isMobile ? 100 : 200 // Reduce spring stiffness on mobile
                                }
                            }}
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </MotionSvg>
                    ))}
                </div>

                {/* Testimonial content */}
                <div className="flex-grow mb-6">
                    <p className="text-white text-base md:text-lg leading-relaxed line-clamp-4">&ldquo;{content}&rdquo;</p>
                </div>

                {/* Avatar and person info */}
                <div className="flex items-center mt-auto pt-5 border-t border-white/20">
                    {avatarUrl ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <DynamicIcon
                                src={avatarUrl}
                                alt={fullName}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ) : (
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-medium text-base shadow-sm`}>
                            {initials}
                        </div>
                    )}

                    <div className="ml-3">
                        <h3 className="text-white font-semibold text-base">{fullName}</h3>
                        <p className="text-white/80 text-sm">{jobTitle}</p>
                    </div>
                </div>
            </div>
        </MotionDiv>
    );
}

export default NewTestimonialCard;
