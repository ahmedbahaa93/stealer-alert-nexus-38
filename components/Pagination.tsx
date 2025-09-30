'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCourseFilters } from '@/hooks/useCourseFilters';
import { useDirection } from '@/hooks/useLocalization';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
}

function Pagination({ currentPage: propCurrentPage, totalPages: propTotalPages }: PaginationProps) {
  const router = useRouter();
  const { filters, setPage } = useCourseFilters();
  const { isRtl } = useDirection();

  // Use props if provided, otherwise use filters
  const currentPage = propCurrentPage || filters.page || 1;
  const totalPages = propTotalPages || 10; // Default fallback

  // Prefetch the next and prev page when component mounts or currentPage changes
  useEffect(() => {
    if (currentPage < totalPages) {
      router.prefetch(`?page=${currentPage + 1}`);
    }

    if (currentPage > 1) {
      router.prefetch(`?page=${currentPage - 1}`);
    }
  }, [currentPage, totalPages, router]);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [1];

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const linkClass = (active: boolean) =>
    clsx(
      'border text-sm flex items-center justify-center w-8 h-8 transition-colors',
      active
        ? 'bg-primary-identity text-white border-primary-identity'
        : 'bg-primary-foreground hover:bg-muted border-input text-muted-foreground'
    );

  const handlePageClick = (page: number) => {
    setPage(page);
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <section className="mt-40 flex justify-center pt-4">
      <div className="flex items-center gap-5">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={`${currentPage !== 1 ? 'bg-primary-foreground border-primary-identity border-1 hover:bg-muted' : 'bg-primary-foreground hover:bg-muted border-input text-muted-foreground'} ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex h-10 w-10 items-center justify-center rounded-md transition-colors`}
        >
          {isRtl ? <ChevronRight className="text-primary-identity h-5 w-5" /> : <ChevronLeft className="text-primary-identity h-5 w-5" />}
        </button>

        <div className="flex gap-5">
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="text-muted-foreground px-2">...</span>
              ) : (
                <button
                  onClick={() => handlePageClick(Number(page))}
                  className={`${linkClass(currentPage === page)} rounded-full transition-colors`}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={`${currentPage !== totalPages ? 'bg-primary-foreground border-primary-identity border-1 hover:bg-muted' : 'bg-primary-foreground hover:bg-muted border-input text-muted-foreground'} ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex h-10 w-10 items-center justify-center rounded-md transition-colors`}
        >
          {isRtl ? <ChevronLeft className="text-primary-identity h-5 w-5" /> : <ChevronRight className="text-primary-identity h-5 w-5" />}
        </button>
      </div>
    </section>
  );
}

export default Pagination;
