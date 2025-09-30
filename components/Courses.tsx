'use client';

import { ViewChangeProvider } from '@/context/VewChangeProvider';
import { ClientFiltersProvider, useClientFilters } from '@/context/ClientFilterProvider';
import { useTranslations } from 'next-intl';
import Action from './courses/Action';
import { DynamicIcon } from './DynamicIcon';
import CoursesPagination from './courses/CoursesPagination';
import CourseView from './courses/CourseView';
import { useFilteredCoursesData } from '@/hooks/useCourses';

function Courses() {
  const t = useTranslations('course-page');

  return (
    <ClientFiltersProvider>
      <ViewChangeProvider>
        <CourseContent t={t} />
      </ViewChangeProvider>
    </ClientFiltersProvider>
  );
}

// Separate component to access context values
function CourseContent({ t }: { t: any }) {
  const { filters } = useClientFilters();
  const { pagination, total } = useFilteredCoursesData(filters);

  return (
    <section className="relative pb-32 pt-10">
      <div className="flex items-center justify-center gap-5">
        <DynamicIcon src="/icons/book.svg" alt="book-icon" width={80} />
        <h1 className="text-primary-identity mt-3 text-3xl font-bold">
          {t('title')}
        </h1>
      </div>
      <p className="text-primary-identity mt-3 text-center text-lg">
        {t('description')}
      </p>
      <Action />
      <CourseView />

      {/* Pagination Section - Always show when there are results */}
      <div className="mt-8 flex justify-center">
        {pagination && total > 0 && (
          <CoursesPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.numberOfPages}
            totalResults={total}
            pageSize={pagination.limit}
          />
        )}
      </div>
    </section>
  );
}

export default Courses;
