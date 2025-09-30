'use client';

import { useViewChange } from '@/context/VewChangeProvider';
import clsx from 'clsx';
import CourseCard from './CourseCard';
import Filter from './Filter';
import { useInView } from 'react-intersection-observer';
import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';
import { useEffect } from 'react';
import { useFilteredCoursesData } from '@/hooks/useCourses';
import { useClientFilters } from '@/context/ClientFilterProvider';
import CourseCardSkeleton from './CourseCardSkeleton';
import CourseErrorState from './CourseErrorState';
import CourseEmptyState from './CourseEmptyState';
import { MotionDiv, AnimatePresence } from '@/components/ui/motion';
import { useLocationReady } from '@/hooks/useLocationReady';

function LazyCourseCard({ course, index }: { course: any; index: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1
      }}
    >
      {inView ? <CourseCard course={course} /> : <div className="h-64" />}
    </MotionDiv>
  );
}

function CourseView() {
  const { viewMode } = useViewChange();
  const { setShow } = useSowBreadCrumbs();
  const { filters, clearFilters } = useClientFilters();
  const { isLocationReady, isDetecting } = useLocationReady();

  const {
    courses,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useFilteredCoursesData(filters);

  // Check if any filters are active (excluding pagination)
  const hasActiveFilters = Object.keys(filters).some(
    key => key !== 'page' && key !== 'limit' && filters[key as keyof typeof filters] !== undefined
  );

  useEffect(() => {
    setShow(true);
  }, [setShow]);

  // Show skeleton during initial load or location detection
  if (isLoading || (!isLocationReady && isDetecting)) {
    return (
      <div className="mt-5 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="hidden lg:block">
          <Filter />
        </div>
        <CourseCardSkeleton count={12} />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="mt-5 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="hidden lg:block">
          <Filter />
        </div>
        <CourseErrorState
          error={error}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  // Show empty state
  if (!courses || courses.length === 0) {
    return (
      <div className="mt-5 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="hidden lg:block">
          <Filter />
        </div>
        <CourseEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          searchTerm={filters.keyword}
        />
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
      <div className="hidden lg:block">
        <Filter />
      </div>

      <MotionDiv
        className={clsx(
          'col-span-2 mt-3 px-2 md:px-7 relative',
          viewMode === 'grid' &&
          'grid grid-cols-2 grid-rows-4 gap-x-5 gap-y-4 max-2xl:overflow-auto max-md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3',
          viewMode === 'list' &&
          'flex flex-col gap-y-4'
        )}
        layout
      >
        {/* Loading overlay for filtering */}
        <AnimatePresence>
          {isFetching && !isLoading && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center"
            >
              <div className="bg-background border rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-identity"></div>
                  <span className="text-sm">Filtering courses...</span>
                </div>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {courses.map((course, index) => (
            <LazyCourseCard
              key={`${course._id}-${index}`}
              course={course}
              index={index}
            />
          ))}
        </AnimatePresence>
      </MotionDiv>
    </div>
  );
}

export default CourseView;
