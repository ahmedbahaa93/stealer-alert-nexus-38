'use client';

import Image from "../../../Ui/Image";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useBlogs } from '@/hooks/useBlogs';

const DynamicFinalSection = () => {
    const [isClient, setIsClient] = useState(false);
    const blogQuery = useBlogs();
    const { data: blogs, isLoading } = blogQuery;
    const t = useTranslations('Blog.sections.thirdSection');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="w-full bg-gray-50 py-8 md:py-12 px-4">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full max-w-2xl"></div>
                </div>
            </div>
        );
    }

    // Use data from API or fallback to default content
    const finalBlog = blogs && blogs.length > 2 ? blogs[2] : null;

    const title = finalBlog?.title || t('title');
    const content = finalBlog?.content || t('content');
    const imageUrl = (finalBlog?.images && finalBlog.images[0]) ||
        "/assets/Blog-Page/b2179a08f3c3a95c31ce6d2626c5ce89.jpg";

    const truncateContent = (text: string, maxLength: number = 400) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (isLoading) {
        return (
            <div className="w-full bg-gray-50 py-8 md:py-12 px-4">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full max-w-2xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50 py-8 md:py-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-around items-center gap-8 lg:gap-12">
                    {/* Left Column - Text Content */}
                    <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl space-y-6 text-center lg:text-left">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F43B4] mb-4">
                            {title}
                        </h2>

                        <p className="text-black font-medium leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {truncateContent(content)}
                        </p>

                        {/* Additional blog insights */}
                        {blogs && blogs.length > 3 && (
                            <div className="mt-6 space-y-3">
                                <h3 className="text-lg font-semibold text-[#0F43B4] mb-3">
                                    {locale === 'ar' ? 'مقالات ذات صلة' : 'Related Topics'}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {blogs.slice(3, 7).map((blog: any, index: number) => (
                                        <div key={blog._id || index} className="text-left">
                                            <span className="text-sm text-gray-600 hover:text-[#0F43B4] cursor-pointer transition-colors duration-200">
                                                • {blog.title.length > 40 ? blog.title.substring(0, 40) + '...' : blog.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Image */}
                    <div className="w-full lg:w-auto lg:flex-shrink-0 lg:max-w-md flex justify-center">
                        <div className="relative max-w-sm w-full">
                            <Image
                                imageurl={imageUrl}
                                alt={title}
                                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-lg"
                            />

                            {/* Decorative elements - responsive visibility */}
                            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 bg-[#61E4AE]/30 rounded-full hidden sm:block"></div>
                            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-4 h-4 sm:w-6 sm:h-6 bg-purple-400/30 rounded-full hidden sm:block"></div>

                            {/* Blog count overlay if multiple blogs */}
                            {blogs && blogs.length > 1 && (
                                <div className="absolute top-4 left-4 bg-[#0F43B4]/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                                    {blogs.length} {locale === 'ar' ? 'مقال' : 'Articles'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicFinalSection;
