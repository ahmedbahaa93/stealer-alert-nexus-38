'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { MotionDiv, AnimatePresence } from '@/components/ui/motion';
import { Link } from '@/i18n/routing';
import { SafeImage } from '@/components/ui/SafeImage';
import { Course } from '@/lib/types/course';
import { courseApi } from '@/lib/api/courses';
import { getSafeImageUrl } from '@/lib/utils/courseUtils';
import './search-input.css';

interface SearchIconProps {
    isDark?: boolean;
}

export default function SearchIcon({ isDark = false }: SearchIconProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [searchResults, setSearchResults] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load all courses on mount
    useEffect(() => {
        const loadCourses = async () => {
            try {
                const response = await courseApi.getCourses();
                setAllCourses(response.data.courses);
            } catch (error) {
                console.error('Failed to load courses:', error);
            }
        };

        if (isOpen) {
            loadCourses();
        }
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        if (!searchTerm.trim() || !allCourses.length) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Frontend filtering with a small delay for better UX
        const timeoutId = setTimeout(() => {
            const term = searchTerm.toLowerCase();
            const results = allCourses.filter(course =>
                course.title.toLowerCase().includes(term) ||
                course.category.toLowerCase().includes(term) ||
                course.subCategory.toLowerCase().includes(term)
            );

            setSearchResults(results);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, allCourses]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            inputRef.current?.focus();
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSearchClick = () => {
        setIsOpen(!isOpen);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        inputRef.current?.focus();
    };

    const handleCourseClick = () => {
        setIsOpen(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const formatPrice = (price: number, currency: string) => {
        if (currency === 'EGP') {
            return `${price} ج.م`;
        }
        return `$${price}`;
    };

    return (
        <div ref={searchRef} className="search">
            {/* Search Icon */}
            <Search
                onClick={handleSearchClick}
                className={`search__trigger ${isDark ? 'search__trigger--dark' : 'search__trigger--light'}`}
                role="button"
                tabIndex={0}
                aria-label="Open search"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleSearchClick();
                    }
                }}
            />

            {/* Search Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="search__dropdown"
                        role="dialog"
                        aria-label="Search courses"
                    >
                        {/* Search Input */}
                        <div className="search__input-container">
                            <div className="search__input-wrapper">
                                <Search className="search__input-icon" aria-hidden="true" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search courses..."
                                    className="search__input"
                                    aria-label="Search courses"
                                    autoComplete="off"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="search__clear-button"
                                        title="Clear search"
                                        aria-label="Clear search"
                                        type="button"
                                    >
                                        <X className="search__clear-icon" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search Results */}
                        <div className="search__results" role="region" aria-live="polite">
                            {isLoading ? (
                                <div className="search__loading">
                                    <div className="search__loading-content">
                                        <div className="search__loading-spinner" aria-hidden="true"></div>
                                        <span className="search__loading-text">Searching courses...</span>
                                    </div>
                                </div>
                            ) : searchTerm && searchResults.length === 0 ? (
                                <div className="search__empty">
                                    <div className="search__empty-content">
                                        <BookOpen className="search__empty-icon" aria-hidden="true" />
                                        <p className="search__empty-text">
                                            No courses found for &quot;<strong>{searchTerm}</strong>&quot;
                                        </p>
                                        <p className="search__empty-suggestion">
                                            Try different keywords or browse all courses
                                        </p>
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="search__results-list">
                                    {searchResults.map((course, index) => (
                                        <MotionDiv
                                            key={course._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="search__result-item"
                                        >
                                            <Link
                                                href={`/course-details/${course._id}`}
                                                onClick={handleCourseClick}
                                                className="search__result-link"
                                                role="button"
                                            >
                                                <div className="search__result-content">
                                                    <div className="search__result-image">
                                                        <SafeImage
                                                            src={getSafeImageUrl(course)}
                                                            alt={course.title}
                                                            width={48}
                                                            height={48}
                                                            className="search__result-img"
                                                            fallbackSrc="/assets/course/ai.svg"
                                                        />
                                                    </div>
                                                    <div className="search__result-info">
                                                        <h4 className="search__result-title">
                                                            {course.title}
                                                        </h4>
                                                        <div className="search__result-meta">
                                                            <span className="search__result-category">
                                                                {course.framework || course.category || 'Course'}
                                                            </span>
                                                            <span className="search__result-price">
                                                                {formatPrice(course.price, course.currency)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </MotionDiv>
                                    ))}
                                </div>
                            ) : (
                                <div className="search__default">
                                    <div className="search__default-content">
                                        <Search className="search__default-icon" aria-hidden="true" />
                                        <p className="search__default-text">Start typing to search for courses</p>
                                        <p className="search__default-hint">Find courses by title, category, or framework</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {searchResults.length > 0 && (
                            <div className="search__footer">
                                <Link
                                    href="/courses"
                                    onClick={handleCourseClick}
                                    className="search__footer-link"
                                >
                                    <span>View all courses</span>
                                    <span className="search__footer-arrow" aria-hidden="true">→</span>
                                </Link>
                            </div>
                        )}
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
}