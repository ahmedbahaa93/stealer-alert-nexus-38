'use client';

import React from 'react';
import '@/components/ui/skeleton-loader.css';
import Card from '../Card';
import Heading from '../Heading';
import { useTranslations } from 'next-intl';

const MyCoursesCardSkeleton = () => {
    const t = useTranslations('my-courses');

    return (
        <Card>
            <Heading data={t('courses')} />
            <div className="w-full grid md:grid-cols-3 gap-5">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="skeleton h-[180px] w-full rounded-md mb-3"></div>
                        <div className="skeleton h-6 w-3/4 mb-2"></div>
                        <div className="skeleton h-4 w-1/3 mb-4"></div>
                        <div className="flex justify-between">
                            <div className="skeleton h-10 w-[45%] rounded"></div>
                            <div className="skeleton h-10 w-[45%] rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default MyCoursesCardSkeleton;
