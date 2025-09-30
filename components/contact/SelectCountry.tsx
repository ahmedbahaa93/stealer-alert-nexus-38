'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DynamicIcon } from '../DynamicIcon';
import Heading from './Heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import GrowAnimation from '../GrowAnimation';
import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';

function SelectCountry() {
  const t = useTranslations('contact-page.form.select');
  const countries = t.raw('option');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('country') || (countries as any[])[0].code;
    }
    return (countries as any[])[0].code;
  });

  const { setShow } = useSowBreadCrumbs();

  useEffect(() => {
    setShow(true);
  }, [setShow]);

  useEffect(() => {
    localStorage.setItem('country', selectedCountry);
  }, [selectedCountry]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const currentCountry = (countries as any[]).find(
    (country: any) => country.code === selectedCountry
  );

  return (
    <GrowAnimation scale={1.03}>
      <Heading data={t('title')} />
      <span className="mt-2"></span>

      <div className="bg-secondary border-secondary-identity flex items-center border-1 p-2">
        {currentCountry && (
          <DynamicIcon
            src={`/icons/about/${currentCountry.code}.svg`}
            alt={`${currentCountry.code}-flag`}
            width={60}
            height={30}
            className="mr-2"
          />
        )}
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="bg-secondary w-60 flex-grow rounded-md outline-none">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {(countries as any[]).map((country: any, index: number) => (
              <SelectItem key={index} value={country.code}>
                {country.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </GrowAnimation>
  );
}

export default SelectCountry;
