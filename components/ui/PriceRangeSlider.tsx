'use client';

import * as Slider from '@radix-ui/react-slider';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useClientFilters } from '@/context/ClientFilterProvider';
import { useTranslations } from 'next-intl';

interface PriceRangeSliderProps {
  min: number;
  max: number;
}

export default function PriceRangeSlider({ min, max }: PriceRangeSliderProps) {
  const { filters, setPriceRange } = useClientFilters();
  const t = useTranslations('course-page.filters');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize range from filters or use defaults
  const [range, setRange] = useState<[number, number]>(() => {
    const filterMin = filters['price[gte]'];
    const filterMax = filters['price[lte]'];
    return [
      filterMin !== undefined ? Number(filterMin) : min,
      filterMax !== undefined ? Number(filterMax) : max
    ];
  });

  // Extract filter values for proper dependency tracking
  const filterMinPrice = filters['price[gte]'];
  const filterMaxPrice = filters['price[lte]'];

  // Update local state when filters change externally
  useEffect(() => {
    const newMin = filterMinPrice !== undefined ? Number(filterMinPrice) : min;
    const newMax = filterMaxPrice !== undefined ? Number(filterMaxPrice) : max;

    // Only update if values are different to avoid infinite loops
    if (newMin !== range[0] || newMax !== range[1]) {
      setRange([newMin, newMax]);
    }
  }, [filterMinPrice, filterMaxPrice, min, max, range]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced function to update price range
  const debouncedUpdatePriceRange = useCallback((newRange: [number, number]) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const [newMin, newMax] = newRange;
      const minToApply = newMin === min ? undefined : newMin;
      const maxToApply = newMax === max ? undefined : newMax;
      setPriceRange(minToApply, maxToApply);
    }, 300);
  }, [min, max, setPriceRange]);

  const handleValueChange = useCallback((newValue: number[]) => {
    const newRange: [number, number] = [newValue[0], newValue[1]];
    setRange(newRange);
    // Update filters on every change for immediate visual feedback
    debouncedUpdatePriceRange(newRange);
  }, [debouncedUpdatePriceRange]);

  return (
    <div className="w-full max-w-md px-5">
      <div className="mb-4 flex justify-between text-sm font-medium text-gray-700">
        <span>{t('priceRange.min') || 'Min'}</span>
        <span>{t('priceRange.max') || 'Max'}</span>
      </div>

      <Slider.Root
        className="relative flex h-6 w-full touch-none items-center select-none"
        min={min}
        max={max}
        step={10}
        value={range}
        onValueChange={handleValueChange}
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-gray-200">
          <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#0f43b4] to-[#0f43b4]" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-5 w-5 cursor-pointer rounded-full border-2 border-[#0f43b4] bg-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0f43b4]/50 transition-all duration-200 relative z-10"
          aria-label={t('priceRange.minLabel') || 'Minimum price'}
        />
        <Slider.Thumb
          className="block h-5 w-5 cursor-pointer rounded-full border-2 border-[#0f43b4] bg-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0f43b4]/50 transition-all duration-200 relative z-10"
          aria-label={t('priceRange.maxLabel') || 'Maximum price'}
        />
      </Slider.Root>

      <div className="mt-4 flex justify-between text-sm font-medium">
        <div className="flex items-center space-x-1">
          <span className="text-gray-600">{range[0]}</span>
          <span className="text-gray-500 text-xs">EGP</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-gray-600">{range[1]}</span>
          <span className="text-gray-500 text-xs">EGP</span>
        </div>
      </div>

      {/* Clear price filter button */}
      {(range[0] !== min || range[1] !== max) && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => {
              setRange([min, max]);
              setPriceRange(undefined, undefined);
            }}
            className="text-xs text-[#0f43b4] hover:text-[#0a2f7e] transition-colors duration-200"
          >
            {t('priceRange.clear') || 'Clear price filter'}
          </button>
        </div>
      )}
    </div>
  );
}
