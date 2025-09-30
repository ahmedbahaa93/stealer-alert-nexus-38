"use client";

import { useTranslations } from 'next-intl';
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useSubCategoriesData } from "@/hooks/useSubCategories";
import CourseCard from "./CourseCard";
import Image from "../../../Ui/Image";
import CourseSectionSkeleton from "@/components/ui/skeletons/CourseSectionSkeleton";
import CategoryErrorState from "@/components/ui/errors/CategoryErrorState";
import CategoryEmptyState from "@/components/ui/empty/CategoryEmptyState";

const CoursesSection = () => {
    const t = useTranslations('Categories');
    const { selectedCategoryId, setSelectedSubCategoryId } = useCategoriesContext();
    const {
        subCategories,
        isLoading,
        isError,
        error,
        refetch,
        isEmpty
    } = useSubCategoriesData(selectedCategoryId || undefined);

    const handleSelect = (subCategoryId: string) => {
        setSelectedSubCategoryId(subCategoryId);
    };

    // Show loading state
    if (isLoading) {
        return <CourseSectionSkeleton />;
    }

    // Show error state
    if (isError) {
        // Check if it's a 404 error, which means no subcategories
        const is404Error = error instanceof Error && error.message && error.message.includes('404');

        if (is404Error) {
            // If it's a 404, show empty state instead of error
            return (
                <CategoryEmptyState
                    title={t('empty.noSubCategories')}
                    message={t('empty.emptyMessage')}
                />
            );
        }

        return (
            <CategoryErrorState
                error={error as Error}
                onRetry={refetch}
                title={t('errors.subCategoriesError')}
                hideHttpErrors={true}
            />
        );
    }

    // Show empty state
    if (isEmpty) {
        return (
            <CategoryEmptyState
                title={t('empty.noSubCategories')}
                message={t('empty.emptyMessage')}
            />
        );
    }

    return (
        <div className="mb-12 px-4 relative">
            {/* Decorative Images */}
            {/* Top-left decorative image */}
            <div className="absolute top-0 left-0 z-0 pointer-events-none">
                <Image
                    imageurl={'/assets/Categoires-Page/Topology-2.png'}
                    alt="Decorative topology"
                    className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-60"
                />
            </div>

            {/* Bottom-right decorative image */}
            <div className="absolute bottom-0 right-0 z-0 pointer-events-none">
                <Image
                    imageurl={'/assets/Categoires-Page/Topology-2.png'}
                    alt="Decorative topology"
                    className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-60"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                <h3 className="text-center text-2xl font-bold text-blue-600 mb-8">
                    {t('actions.chooseMajor')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto px-2 sm:px-4">
                    {subCategories.map((subcategory) => (
                        <div key={subcategory._id} className="w-full flex justify-center">
                            <CourseCard
                                title={subcategory.name}
                                components={[subcategory.description]}
                                frameworks={[]}
                                instructor={subcategory.name}
                                image={subcategory.image}
                                onSelect={() => handleSelect(subcategory._id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoursesSection;