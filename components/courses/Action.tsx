'use client';

import { FilterIcon, Grid2X2, List } from 'lucide-react';
import SearchInput from '../SearchInput';
import SortFilter from './filters/SortFilter';
import { useViewChange } from '@/context/VewChangeProvider';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import Filter from './Filter';
import { useTranslations } from 'next-intl';

function Action() {
  const t = useTranslations('course-page');
  const { viewMode, setViewMode } = useViewChange();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="col-span-3 mt-12 flex h-fit justify-end px-8">
        <div className="relative flex items-end gap-3">
          <SearchInput />
          <SortFilter />
          <Grid2X2 className="cursor-pointer max-md:hidden" />
          <List className="cursor-pointer max-md:hidden" />
          <Button
            variant="outline"
            className="border-primary-identity border-2 lg:hidden"
          >
            <FilterIcon className="text-primary-identity" />
            <span className="text-primary-identity">Filter</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-3 mt-12 flex h-fit justify-end px-8">
      <div className="relative flex items-end gap-3">
        <SearchInput />
        <SortFilter />
        <Grid2X2
          className={`${viewMode === 'grid' && 'text-primary-identity'} cursor-pointer max-md:hidden`}
          onClick={() => setViewMode('grid')}
        />
        <List
          className={`${viewMode === 'list' && 'text-primary-identity'} cursor-pointer max-md:hidden`}
          onClick={() => setViewMode('list')}
        />
        <Button
          variant="outline"
          className="border-primary-identity border-2 lg:hidden"
          onClick={() => setShow((prev) => !prev)}
        >
          <FilterIcon className="text-primary-identity" />{' '}
          <span className="text-primary-identity">
            {show ? t('close') : t('filter')}
          </span>
        </Button>
        {show && (
          <div className="absolute top-full z-3 mt-5 max-h-[80vh] w-full overflow-y-auto">
            <Filter />
          </div>
        )}
      </div>
    </div>
  );
}

export default Action;
