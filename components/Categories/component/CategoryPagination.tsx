'use client';

import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDirection } from '@/hooks/useLocalization';

interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    // eslint-disable-next-line no-unused-vars
    onPageChange: (page: number) => void;
}

function CategoryPagination({ currentPage, totalPages, onPageChange }: CategoryPaginationProps) {
    const { isRtl } = useDirection();

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
                ? 'bg-[#0F43B4] text-white border-[#0F43B4]'
                : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
        );

    const handlePageClick = (pageNumber: number) => {
        onPageChange(pageNumber);
    };

    if (totalPages <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    return (
        <section className="flex justify-center pt-4">
            <div className="flex items-center gap-5">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`${currentPage !== 1 ? 'bg-white border-[#0F43B4] border-1 hover:bg-gray-100' : 'bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-400'} ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex h-10 w-10 items-center justify-center rounded-md transition-colors`}
                >
                    {isRtl ? <ChevronRight className="text-[#0F43B4] h-5 w-5" /> : <ChevronLeft className="text-[#0F43B4] h-5 w-5" />}
                </button>

                <div className="flex gap-5">
                    {getPageNumbers().map((pageNum, index) => (
                        <span key={index}>
                            {pageNum === '...' ? (
                                <span className="text-gray-500 px-2">...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageClick(Number(pageNum))}
                                    className={`${linkClass(currentPage === pageNum)} rounded-full transition-colors`}
                                >
                                    {pageNum}
                                </button>
                            )}
                        </span>
                    ))}
                </div>

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`${currentPage !== totalPages ? 'bg-white border-[#0F43B4] border-1 hover:bg-gray-100' : 'bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-400'} ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex h-10 w-10 items-center justify-center rounded-md transition-colors`}
                >
                    {isRtl ? <ChevronLeft className="text-[#0F43B4] h-5 w-5" /> : <ChevronRight className="text-[#0F43B4] h-5 w-5" />}
                </button>
            </div>
        </section>
    );
}

export default CategoryPagination;
