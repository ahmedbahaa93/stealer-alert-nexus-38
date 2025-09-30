"use client";

import Image from 'next/image';
import { DynamicIcon } from '../DynamicIcon';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { MotionDiv, MotionH2 } from '@/components/ui/motion';

function SuccessPartners() {
    const t = useTranslations('HomePage');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const successPartners = [
        {
            imageSrc: '/Raiseup success partners logos/Education For Employment-Egypt.png',
            title: t('partners-logos.eefe'),
            alt: t('partners-logos.eefe')
        },
        {
            imageSrc: '/Raiseup success partners logos/Maaden.png',
            title: t('partners-logos.maaden'),
            alt: t('partners-logos.maaden')
        },
        {
            imageSrc: '/Raiseup success partners logos/mcit-logo.png',
            title: t('partners-logos.mcit'),
            alt: t('partners-logos.mcit')
        },
        {
            imageSrc: '/Raiseup success partners logos/Ministry of Communications and Information Technology of Saudi Arabia.png',
            title: t('partners-logos.mcit-sa'),
            alt: t('partners-logos.mcit-sa')
        },
        {
            imageSrc: '/Raiseup success partners logos/Ministry-of-Defense.png',
            title: t('partners-logos.mod'),
            alt: t('partners-logos.mod')
        },
        {
            imageSrc: '/Raiseup success partners logos/STC.png',
            title: t('partners-logos.stc'),
            alt: t('partners-logos.stc')
        },
        {
            imageSrc: '/Raiseup success partners logos/tahakom logo.png',
            title: t('partners-logos.tahakom'),
            alt: t('partners-logos.tahakom')
        },
        {
            imageSrc: '/Raiseup success partners logos/Terre des hommes.png',
            title: t('partners-logos.tdh'),
            alt: t('partners-logos.tdh')
        }
    ];

    // function to cut long text that have characters more than 20
    const cutLongText = (text: string) => {
        if (text.length > 20) {
            return text.slice(0, 20) + '...';
        }
        return text;
    };

    // Duplicate partners for seamless infinite loop
    const infinitePartners = [...successPartners, ...successPartners, ...successPartners];

    if (!isClient) {
        return (
            <div className="mb-10 bg-[#0e43b4] px-5 pt-3 pb-12 overflow-hidden relative">
                <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
                    <DynamicIcon
                        src="/assets/home/up-down.svg"
                        alt="celebrate"
                        width={60}
                    />
                    <h2 className="text-3xl font-bold text-white">
                        {t('success-partners')}
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-10 bg-[#0e43b4] px-5 pt-3 pb-12 overflow-hidden relative">
            {/* Header Section */}
            <MotionDiv
                className="mx-auto mt-12 flex items-center justify-center space-x-3 pb-14"
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
                        src="/assets/home/up-down.svg"
                        alt="celebrate"
                        width={70}
                    />
                </MotionDiv>
                <MotionH2
                    className="text-4xl font-bold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    {t('success-partners')}
                </MotionH2>
            </MotionDiv>

            {/* Infinite Tab Animation */}
            <div className="relative w-full overflow-hidden z-30">
                <MotionDiv
                    className="flex gap-10 w-full z-30"
                    animate={{
                        x: [0, -120 * successPartners.length]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {infinitePartners.map((partner, index) => (
                        <MotionDiv
                            key={`${partner.title}-${index}`}
                            className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-xl p-6 w-72 h-52 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300 z-10"
                            whileHover={{
                                backgroundColor: "rgba(255, 255, 255, 0.25)",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: (index % successPartners.length) * 0.1
                            }}
                            viewport={{ once: true }}
                        >
                            <div className="text-center">
                                <div className="w-28 h-28 mx-auto mb-3 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <Image
                                        src={partner.imageSrc}
                                        alt={partner.alt}
                                        width={180}
                                        height={180}
                                        className="object-contain"
                                        onError={(e) => {
                                            // Fallback to text if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<span class="text-[#0e43b4] font-bold text-lg">${partner.title}</span>`;
                                            }
                                        }}
                                    />
                                </div>
                                <p className="text-white text-base font-medium">
                                    {cutLongText(partner.title)}
                                </p>
                            </div>
                        </MotionDiv>
                    ))}
                </MotionDiv>
            </div>

            {/* Background Shapes */}
            <Image
                src="/assets/home/Topology-1.svg"
                alt="shape-for-bg"
                width={150}
                height={150}
                className="absolute -bottom-12 -left-12 z-0"
            />
            <Image
                src="/assets/home/Topology-1.svg"
                alt="shape-for-bg"
                width={150}
                height={150}
                className="rotate-180 absolute -top-12 -right-12 z-0"
            />
        </div>
    );
}

export default SuccessPartners;
