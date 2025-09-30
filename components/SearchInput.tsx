'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useClientFilters } from '@/context/ClientFilterProvider';
import { useCallback, useState, useEffect } from 'react';

export interface SearchInputProps {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue }: SearchInputProps) {
  const t = useTranslations('course-page');
  const { setFilter, filters } = useClientFilters();

  const currentSearch = filters.keyword || defaultValue || '';
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Update local state when filter changes from outside
  useEffect(() => {
    setSearchValue(filters.keyword || '');
  }, [filters.keyword]);

  // Debounced search function
  const handleSearchDebounced = useCallback((term: string) => {
    const timeoutId = setTimeout(() => {
      setFilter('keyword', term.length > 0 ? term : undefined);
    }, 300); // Reduced debounce time for better UX

    return () => clearTimeout(timeoutId);
  }, [setFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearchDebounced(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setFilter('keyword', searchValue.length > 0 ? searchValue : undefined);
    }
  };

  return (
    <div className="flex w-full max-w-[270px] self-end">
      <input
        type="text"
        placeholder={t('place-holder')}
        value={searchValue}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        className="focus:ring-primary focus:border-primary w-full border-b-2 border-black bg-transparent py-2 pr-4 pl-10 transition-colors"
      />
      <div className="pointer-events-none inset-y-0 flex items-center border-b-2 border-black pl-3">
        <Search className={searchValue ? 'text-primary-identity' : ''} />
      </div>
    </div>
  );
}
