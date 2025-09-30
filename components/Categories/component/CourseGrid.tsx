"use client";

import { useTranslations } from 'next-intl';
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useCategoryCoursesData } from "@/hooks/useCategoryCourses";
import ProfessionalCourseCard from "./ProfessionalCourseCard";
import CourseGridSkeleton from "@/components/ui/skeletons/CourseGridSkeleton";
import CategoryErrorState from "@/components/ui/errors/CategoryErrorState";
import CategoryEmptyState from "@/components/ui/empty/CategoryEmptyState";
import CategoryPagination from "./CategoryPagination";
import { useLocationAwarePrice } from '@/hooks/useLocationAwarePrice';

// Component to create location-aware course cards
const LocationAwareCourseCard = ({ course }: { course: any }) => {
    const locationAwarePrice = useLocationAwarePrice(course.price);

    return (
        <ProfessionalCourseCard
            id={course._id}
            title={course.title}
            description={course.description}
            hours={`${course.duration} H`}
            cost={locationAwarePrice.formatted}
            courseType={course.course_type}
            content={course.content || []}
            framework={course.framework}
            image={course.image}
            discount={course.discount_percentage ? `${course.discount_percentage}%` : undefined}
            price={course.price}
            duration={course.duration}
            startDates={course.startDates || []}
        />
    );
};

const CourseGrid = () => {
    const t = useTranslations('Categories');
    const { selectedSubCategoryId, currentPage, setCurrentPage } = useCategoriesContext();
    const {
        courses,
        pagination,
        isLoading,
        isError,
        error,
        refetch,
        isEmpty
    } = useCategoryCoursesData(selectedSubCategoryId || undefined, currentPage, 8);

    // If no subcategory is selected, don't display anything
    if (!selectedSubCategoryId) {
        return null;
    }

    // Show loading state
    if (isLoading) {
        return <CourseGridSkeleton />;
    }

    // Show error state
    if (isError) {
        return (
            <CategoryErrorState
                error={error as Error}
                onRetry={refetch}
                title={t('errors.coursesError')}
            />
        );
    }

    // Show empty state
    if (isEmpty) {
        return (
            <CategoryEmptyState
                title={t('empty.noCourses')}
                message={t('empty.emptyMessage')}
            />
        );
    }

    return (
        <div className="container bg-gray-100 mx-auto px-5 py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">
                    {courses[0]?.title || t('courseGrid.title')}
                </h2>
                <p className="text-gray-600">
                    {t('courseGrid.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                    <div key={course._id} className="h-full">
                        <LocationAwareCourseCard course={course} />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.numberOfPages > 1 && (
                <div className="mt-12 flex justify-center">
                    <CategoryPagination
                        currentPage={currentPage}
                        totalPages={pagination.numberOfPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default CourseGrid;