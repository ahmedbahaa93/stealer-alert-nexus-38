"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const CourseDetailEmpty = () => {
  const t = useTranslations('courseDetail');
  
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t('courseNotFound')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('courseNotFoundMessage')}
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0F43B4] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('browseCourses')}
        </Link>
      </div>
    </div>
  );
};
