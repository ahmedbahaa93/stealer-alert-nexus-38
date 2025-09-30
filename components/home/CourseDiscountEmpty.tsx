'use client';

import { GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';

function CourseDiscountEmpty() {
    const t = useTranslations('EmptyStates');

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="flex flex-col items-center text-center space-y-4">
                <GraduationCap className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">
                    {t('noDiscountedCourses.title')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    {t('noDiscountedCourses.description')}
                </p>
            </div>
        </div>
    );
}

export default CourseDiscountEmpty;
