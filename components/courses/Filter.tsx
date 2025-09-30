'use client';

import { FilterX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import PriceRangeSlider from '../ui/PriceRangeSlider';
import Border from './Border';
import Card from './Card';
import FilterSection from './filters/FilterSection';
import MultiSelectCourseTypeFilter from './filters/MultiSelectCourseTypeFilter';
import CategoryFilter from './filters/CategoryFilter';
import ActiveFilters from './filters/ActiveFilters';
import { useClientFilters } from '@/context/ClientFilterProvider';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

function Filter() {
  const t = useTranslations('course-page.filters');
  const { clearFilters, getActiveFiltersCount } = useClientFilters();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters whenever filters change
  useEffect(() => {
    const count = getActiveFiltersCount();
    setActiveFiltersCount(count);
  }, [getActiveFiltersCount]);

  return (
    <Border>
      <Card>
        <div className="px-5">
          {/* Active Filters Display */}
          <ActiveFilters className="mb-6" />

          <div className="flex justify-between items-center mb-8">
            <button
              onClick={clearFilters}
              className="border-primary-identity bg-primary-identity/5 flex cursor-pointer gap-3 rounded-lg border-1 p-3 transition-all duration-300 hover:bg-primary-identity/10 hover:border-primary-identity/70 hover:shadow-md hover:scale-[1.01] group"
            >
              <FilterX className="text-primary-identity group-hover:scale-105 transition-transform duration-300" />
              <span className="text-primary-identity group-hover:font-medium transition-all duration-300">{t('clear')}</span>
            </button>

            {activeFiltersCount > 0 && (
              <Badge className="bg-[#0f43b4] text-white hover:bg-[#0a2f7e]" variant="default">
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
              </Badge>
            )}
          </div>

          <FilterSection title={t('state.title')}>
            <MultiSelectCourseTypeFilter />
          </FilterSection>

          <FilterSection title={t('Category.title')}>
            <CategoryFilter />
          </FilterSection>

          <h3 className="text-primary-identity my-4 text-lg font-semibold">
            {t('price')}
          </h3>
          <PriceRangeSlider min={0} max={10000} />
        </div>
      </Card>
    </Border>
  );
}

export default Filter;
