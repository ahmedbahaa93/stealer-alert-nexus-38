"use client";

import { MotionDiv, MotionH2 } from '@/components/ui/motion';
import { DynamicIcon } from '../DynamicIcon';
import ContributorsCard from './ContributorsCard';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

function TrainingVendors() {
    const t = useTranslations('HomePage');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const itVendors = [
        {
            imageSrc: '/vendors-logos/It Education partners logos/Cisco – Cisco Partner - Learning Partner.png',
            title: t('vendors.cisco'),
            alt: t('vendors.cisco')
        },
        {
            imageSrc: '/vendors-logos/It Education partners logos/Microsoft – Microsoft Cloud Training Services.png',
            title: t('vendors.microsoft'),
            alt: t('vendors.microsoft')
        },
        {
            imageSrc: '/vendors-logos/It Education partners logos/AWS – AWS Partner Network - Training Partner.png',
            title: t('vendors.aws'),
            alt: t('vendors.aws')
        },
        {
            imageSrc: '/vendors-logos/It Education partners logos/CompTIA – CompTIA - Authorized Partner – Platinum.png',
            title: t('vendors.comptia'),
            alt: t('vendors.comptia')
        },
        {
            imageSrc: '/vendors-logos/It Education partners logos/Oracle – Oracle Partner.png',
            title: t('vendors.oracle'),
            alt: t('vendors.oracle')
        },
        {
            imageSrc: '/vendors-logos/It Education partners logos/EC-Council – EC-Council - Accredited Training Center.png',
            title: t('vendors.eccouncil'),
            alt: t('vendors.eccouncil')
        }
    ];

    const eduVendors = [
        {
            imageSrc: '/vendors-logos/Education partners logos/PECB.png',
            title: t('vendors.pecb'),
            alt: t('vendors.pecb')
        },
        {
            imageSrc: '/vendors-logos/Education partners logos/ISACA.png',
            title: t('vendors.isaca'),
            alt: t('vendors.isaca')
        },
        {
            imageSrc: '/vendors-logos/Education partners logos/ATD – Association for Talent Development.png',
            title: t('vendors.atd'),
            alt: t('vendors.atd')
        },
        {
            imageSrc: '/vendors-logos/Education partners logos/CIPD-logo.jpg',
            title: t('vendors.cipd'),
            alt: t('vendors.cipd')
        },
        {
            imageSrc: '/vendors-logos/Education partners logos/CIPS – Chartered Institute of Procurement & Supply.png',
            title: t('vendors.cips'),
            alt: t('vendors.cips')
        },
        {
            imageSrc: '/vendors-logos/Education partners logos/ASCM – Association for Supply Chain Management  Partner.png',
            title: t('vendors.ascm'),
            alt: t('vendors.ascm')
        }
    ];

    // Combine both vendor types
    const contributors = [...itVendors, ...eduVendors];

    // Duplicate contributors for seamless infinite loop
    const infiniteContributors = [...contributors, ...contributors, ...contributors];

    if (!isClient) {
        return (
            <div className="mb-15 bg-gradient-to-l from-blue-100 to-white p-5">
                <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-10">
                    <DynamicIcon
                        src="/assets/home/Group (1).svg"
                        alt="training vendors"
                        width={60}
                    />
                    <h2 className="text-primary-identity text-4xl font-bold">
                        {t('training-vendors')}
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
                        alt="training vendors"
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
                    {t('training-vendors')}
                </MotionH2>
            </MotionDiv>

            {/* Infinite Moving Animation */}
            <div className="relative w-full overflow-hidden py-8">
                <MotionDiv
                    className="flex gap-6 w-fit"
                    animate={{
                        x: [0, -100 * contributors.length - 200]
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
                            key={`${contributor.title}-${index}`}
                            className="flex-shrink-0 px-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: (index % contributors.length) * 0.1
                            }}
                            viewport={{ once: true }}
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

            {/* Enhanced Gradient Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 pointer-events-none" />

            {/* Subtle Animation Background */}
            <MotionDiv
                className="absolute inset-0 opacity-10"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)"
                    ]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
}

export default TrainingVendors;
