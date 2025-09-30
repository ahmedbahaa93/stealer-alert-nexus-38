'use client';

import { useTranslations, useLocale } from 'next-intl';
import { DynamicIcon } from '../DynamicIcon';
import CategoryCard from './CategoryCard';
import TopCategorySkeleton from './TopCategorySkeleton';
import TopCategoryError from './TopCategoryError';
import TopCategoryEmpty from './TopCategoryEmpty';
import { useCategoriesData } from '../../hooks/useCategories';
import { mapCategoryToCardProps } from '../../lib/utils/categoryUtils';

function TopCategory() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const { categories, isLoading, isError, error, refetch } = useCategoriesData();

  // Show skeleton during loading
  if (isLoading) {
    return <TopCategorySkeleton />;
  }

  // Show error state
  if (isError) {
    return <TopCategoryError onRetry={refetch} error={error} />;
  }

  // Show empty state if no categories
  if (!categories || categories.length === 0) {
    return <TopCategoryEmpty />;
  }

  return (
    <div >
      <div className="mx-auto mt-10 flex items-center justify-center space-x-2 pb-2">
        <DynamicIcon src="/assets/home/cat.svg" alt="celebrate" width={60} />
        <h2 className="text-primary-identity text-3xl font-bold">
          {t('top-cat')}
        </h2>
      </div>
      <p className="text-center text-lg">{t('des-top')}</p>
      <div className="grid-cols-3 gap-3 px-15 max-md:space-y-5 md:grid lg:grid-cols-4 lg:gap-15 xl:grid-cols-5 overflow-hidden">
        {categories.map((category) => {
          const cardProps = mapCategoryToCardProps(category, locale);
          return (
            <CategoryCard
              key={category._id}
              icon={cardProps.icon}
              title={cardProps.title}
              courseCount={cardProps.courseCount}
              id={cardProps.id}
              image={cardProps.image}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TopCategory;
