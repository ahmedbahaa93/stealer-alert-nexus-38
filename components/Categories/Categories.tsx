"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { CategoriesProvider, useCategoriesContext } from "@/context/CategoriesContext";
import CategoryHeader from "./component/CategoryHeader";
import CoursesSection from "./component/CoursesSection";
import CourseGrid from "./component/CourseGrid";

const CategoriesContent = () => {
    const [isClient, setIsClient] = useState(false);
    const { categoryName } = useCategoriesContext();
    const t = useTranslations('Categories');

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="min-h-screen w-full to-green-50 relative overflow-hidden pt-28">
            {isClient ? (
                <>
                    <CategoryHeader
                        title={t('header.title') || "Categories"}
                        subtitle={t('header.subtitle') || "Various courses suitable for everyone to learn new skills and achieve your ambitions quickly and effectively."}
                        category={categoryName}
                    />

                    <div className="py-8">
                        <CoursesSection />
                        <CourseGrid />
                    </div>
                </>
            ) : (
                <div className="min-h-screen w-full flex items-center justify-center">
                    <div className="text-center">{t('loading.loadingCourses')}</div>
                </div>
            )}
        </div>
    );
};

const Categories = () => {
    const params = useParams();
    const categoryId = params?.id as string || null;

    // If the Categories component is already inside a CategoriesProvider, use the CategoriesContent
    // Otherwise, wrap it in a CategoriesProvider
    if (categoryId) {
        return <CategoriesContent />;
    }

    return (
        <CategoriesProvider>
            <CategoriesContent />
        </CategoriesProvider>
    );
};

export default Categories;
