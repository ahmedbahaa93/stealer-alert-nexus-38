'use client';

import React from 'react';
import '@/components/ui/skeleton-loader.css';
import Card from '../Card';
import Heading from '../Heading';
import { useTranslations } from 'next-intl';

const CompletedCourseSkeleton = () => {
    const t = useTranslations('my-courses');

    return (
        <Card>
            <Heading data={t('complete')} />
            <div className='sm:w-[80%] space-y-10'>
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="skeleton h-6 w-1/3"></div>
                        <div className="skeleton h-4 w-full rounded"></div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default CompletedCourseSkeleton;
