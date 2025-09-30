"use client";

import { useLocale } from 'next-intl';
import { useBlogs } from '@/hooks/useBlogs';

// Dynamic components with API integration
import HeaderOfBlogPage from './Components/HeaderOfBlogPage';
import BlogSkeleton from './Components/BlogSkeleton';
import BlogError from './Components/BlogError';
import BlogEmpty from './Components/BlogEmpty';
import BlogSection from './Components/BlogSection';

const BlogPage = () => {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const { data: blogs, isLoading, isError, error, refetch } = useBlogs();

    // Show loading state when fetching blogs
    if (isLoading) {
        return (
            <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
                <BlogSkeleton itemCount={6} showHeader={true} />
            </div>
        );
    }

    // Show error state
    if (isError) {
        return (
            <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
                <BlogError error={error} onRetry={refetch} />
            </div>
        );
    }

    // Show empty state if no blogs
    if (!blogs || blogs.length === 0) {
        return (
            <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
                <BlogEmpty />
            </div>
        );
    }

    return (
        <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* First blog as featured header - ensuring blogs[0] is passed to HeaderOfBlogPage */}
            {blogs.length > 0 && (
                <HeaderOfBlogPage featuredBlog={blogs[0]} />
            )}

            {/* Rest of the blogs as individual sections */}
            {blogs.slice(1).map((blog, index) => (
                <BlogSection
                    key={blog._id}
                    blog={blog}
                    index={index}
                />
            ))}
        </div>
    );
};

export default BlogPage;
