"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface CourseDetailsLinkProps {
  courseId: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A link component that navigates to the course details page
 * This component should be used in the home page, courses page, and categories page
 * when clicking on a course card or "View Details" button
 */
export const CourseDetailsLink: React.FC<CourseDetailsLinkProps> = ({
  courseId,
  children,
  className = ''
}) => {
  const t = useTranslations('Layout.bread-crumb');
  const params = useParams();
  const locale = params?.locale || 'en';

  return (
    <Link
      href={`/${locale}/course-details/${courseId}`}
      className={className}
      aria-label={`${t('course-details')}: ${courseId}`}
    >
      {children}
    </Link>
  );
};
