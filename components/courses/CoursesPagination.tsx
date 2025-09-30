'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, List } from 'lucide-react';
import { useClientFilters } from '@/context/ClientFilterProvider';
import { useDirection } from '@/hooks/useLocalization';
import { useTranslations } from 'next-intl';

interface CoursesPaginationProps {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    pageSize: number;
}

function CoursesPagination({
    currentPage,
    totalPages,
    totalResults,
    pageSize
}: CoursesPaginationProps) {
    const { setFilter } = useClientFilters();
    const { isRtl } = useDirection();
    const t = useTranslations('course-page.pagination');

    const handlePageChange = (page: number) => {
        setFilter('page', page);
        // Smooth scroll to top with better positioning
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5; // Reduced for better mobile experience

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage <= 3) {
                // Current page is near the beginning
                for (let i = 2; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Current page is near the end
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Current page is in the middle
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const getPageInfo = () => {
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalResults);
        return { startItem, endItem };
    };

    if (totalPages <= 0 || totalResults === 0) {
        return null;
    }

    const { startItem, endItem } = getPageInfo();
    const pageNumbers = getPageNumbers();

    return (
        <div className="mt-16 mb-8">
            {/* Enhanced Results Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-lg font-semibold text-gray-900 mb-1">
                            {t('showing')} <span className="text-[#0f43b4] font-bold">{startItem}-{endItem}</span> {t('of')} <span className="text-[#0f43b4] font-bold">{totalResults}</span> {t('courses')}
                        </p>
                        <p className="text-sm text-gray-600">
                            {t('page')} {currentPage} {t('of')} {totalPages}
                        </p>
                    </div>

                    {/* Page Size Selector */}
                    <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
                        <List className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">{t('itemsPerPage')}:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setFilter('limit', Number(e.target.value));
                                setFilter('page', 1); // Reset to first page when changing page size
                            }}
                            title={t('itemsPerPage')}
                            aria-label={t('itemsPerPage')}
                            className="text-sm font-semibold text-[#0f43b4] bg-transparent border-none focus:outline-none cursor-pointer"
                        >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Enhanced Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                        group flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300
                        ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : 'bg-white text-[#0f43b4] border-2 border-[#0f43b4] hover:bg-[#0f43b4] hover:text-white shadow-md hover:shadow-lg hover:scale-105'
                        }
                    `}
                    aria-label={t('previous')}
                >
                    {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    <span className="hidden sm:inline">{t('previous')}</span>
                </button>

                {/* Page Numbers Container */}
                <div className="flex items-center bg-white rounded-xl border-2 border-gray-100 p-2 shadow-lg">
                    <div className="flex items-center gap-1">
                        {pageNumbers.map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <div className="flex items-center justify-center w-10 h-10 mx-1">
                                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(Number(page))}
                                        className={`
                                            flex items-center justify-center w-12 h-12 rounded-lg text-sm font-bold transition-all duration-300 relative
                                            ${currentPage === page
                                                ? 'bg-gradient-to-r from-[#0f43b4] to-[#1e5cbf] text-white shadow-lg scale-110 border-2 border-[#0f43b4]'
                                                : 'bg-gray-50 text-[#0f43b4] hover:bg-[#0f43b4]/10 hover:text-[#0f43b4] hover:scale-105 border border-gray-200 hover:border-[#0f43b4]/50'
                                            }
                                        `}
                                    >
                                        {page}
                                        {currentPage === page && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                                        )}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                        group flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300
                        ${currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : 'bg-white text-[#0f43b4] border-2 border-[#0f43b4] hover:bg-[#0f43b4] hover:text-white shadow-md hover:shadow-lg hover:scale-105'
                        }
                    `}
                    aria-label={t('next')}
                >
                    <span className="hidden sm:inline">{t('next')}</span>
                    {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
            </div>

            {/* Quick Navigation for Large Result Sets */}
            {totalPages > 10 && (
                <div className="mt-6 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
                        <span className="text-sm text-gray-600">{t('jumpToPage')}:</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            placeholder={currentPage.toString()}
                            className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:border-[#0f43b4] focus:outline-none"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    const value = parseInt((e.target as HTMLInputElement).value);
                                    if (value >= 1 && value <= totalPages) {
                                        handlePageChange(value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }
                            }}
                        />
                        <span className="text-sm text-gray-600">/ {totalPages}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CoursesPagination;
