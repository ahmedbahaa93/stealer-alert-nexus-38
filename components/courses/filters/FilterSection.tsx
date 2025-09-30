import React from 'react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-primary-identity my-4 text-lg font-semibold">
        {title}
      </h3>
      <div className="flex flex-col space-y-2">
        {children}
      </div>
    </div>
  );
}

export default FilterSection;