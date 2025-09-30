"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

interface CourseDetailErrorProps {
  error: Error;
  onRetry: () => void;
}

export const CourseDetailError: React.FC<CourseDetailErrorProps> = ({
  error,
  onRetry
}) => {
  const t = useTranslations('courseDetail');
  
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t('errorTitle')}
        </h2>
        <p className="text-gray-600 mb-6">
          {error instanceof Error ? error.message : t('errorMessage')}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0F43B4] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
};
