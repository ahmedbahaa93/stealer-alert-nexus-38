'use client';

import { ArrowDown } from "lucide-react";
import Button from "../../../Ui/Button";
import Image from "../../../Ui/Image";
import { useTranslations, useLocale } from "next-intl";
import { useBlogs } from '@/hooks/useBlogs';
import BlogSkeleton from './BlogSkeleton';
import BlogError from './BlogError';
import BlogEmpty from './BlogEmpty';

const DynamicBlogContent = () => {
    const blogQuery = useBlogs();
    const { data: blogs, isLoading, isError, error, refetch } = blogQuery;
    const t = useTranslations('Blog.sections.secondSection');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // Show loading state
    if (isLoading) {
        return <BlogSkeleton />;
    }

    // Show error state
    if (isError) {
        return <BlogError error={error} onRetry={refetch} />;
    }

    // Show empty state if no blogs
    if (!blogs || blogs.length === 0) {
        return <BlogEmpty />;
    }

    // Get the first blog for main content display
    const mainBlog = blogs[0];
    const secondaryBlogs = blogs.slice(1, 4); // Get next 3 blogs for sidebar

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return '';
        }
    };

    const truncateContent = (content: string, maxLength: number = 300) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <div className="w-full bg-white py-8 sm:py-10 md:py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-around gap-8 sm:gap-10 lg:gap-12">
                    {/* Left Column - Main Blog Content */}
                    <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F43B4] mb-2 sm:mb-4 lg:mb-6 text-center">
                            {mainBlog.title}
                        </h2>

                        <div className="space-y-6 sm:space-y-8 text-center text-gray-500 font-medium leading-relaxed">
                            <p className="text-sm sm:text-base whitespace-pre-line">
                                {truncateContent(mainBlog.content)}
                            </p>
                        </div>

                        {/* Main Blog Image */}
                        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                            {mainBlog.images && mainBlog.images[0] ? (
                                <Image
                                    imageurl={mainBlog.images[0]}
                                    alt={mainBlog.title}
                                    className="w-full h-64 sm:h-72 md:h-80 rounded-lg shadow-lg object-cover"
                                />
                            ) : (
                                <Image
                                    imageurl="/assets/Blog-Page/264e2e1b3307ecf87d46238ed1b0787d.jpg"
                                    alt="Default blog image"
                                    className="w-full h-64 sm:h-72 md:h-80 rounded-lg shadow-lg object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar with Dynamic Content */}
                    <div className="w-full lg:w-auto lg:flex-shrink-0 lg:max-w-xs">
                        <div className={`bg-gradient-to-br from-white to-green-100 rounded-2xl p-4 shadow-sm border border-gray-100 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            {/* Author Info */}
                            <div className={`flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        imageurl="/assets/Blog-Page/Asian_Woman_PSD__High_Quality_Free_PSD_Templates_for_Download___Freepik-removebg-preview 1.png"
                                        alt={mainBlog.author?.name || 'Author'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold text-gray-900 text-sm truncate ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                        {mainBlog.author?.name || t('author_name')}
                                    </h3>
                                    <p className={`text-xs text-gray-600 truncate ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                        {mainBlog.createdAt ? formatDate(mainBlog.createdAt) : t('published_date')}
                                    </p>
                                </div>
                            </div>

                            {/* Table of Contents - Dynamic Blog Titles */}
                            <div className="space-y-3">
                                <div className="p-3">
                                    <div className={`flex items-center justify-between cursor-pointer pb-3 border-b-2 border-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <span className={`text-sm font-medium text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                            {t('introduction') || 'Recent Articles'}
                                        </span>
                                        <ArrowDown className={`w-4 h-4 text-gray-500 ${isRTL ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Secondary Blog Titles */}
                                    <div className="space-y-3 mt-3">
                                        {secondaryBlogs.map((blog: any, index: number) => (
                                            <div key={blog._id} className={`flex items-center justify-between py-3 cursor-pointer ${index < secondaryBlogs.length - 1 ? 'border-b-2 border-gray-400' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <span className={`text-xs text-gray-600 ${isRTL ? 'text-right' : 'text-left'} line-clamp-2`} dir={isRTL ? 'rtl' : 'ltr'}>
                                                    {blog.title}
                                                </span>
                                                <ArrowDown className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-2 ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Newsletter Signup */}
                                <div className="p-4">
                                    <h4 className={`font-semibold text-gray-900 text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                        {t('weekly_newsletter') || 'Weekly Newsletter'}
                                    </h4>
                                    <p className={`text-xs text-center text-gray-600 mb-3 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                        {t('newsletter_description') || 'Get the latest blog updates delivered to your inbox.'}
                                    </p>

                                    <div className="space-y-2">
                                        <input
                                            type="email"
                                            placeholder={t('email_placeholder') || 'Enter your email'}
                                            className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                                            dir={isRTL ? 'rtl' : 'ltr'}
                                        />
                                        <Button className="w-full bg-[#0F43B4] text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors text-xs">
                                            {t('subscribe') || 'Subscribe'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicBlogContent;
