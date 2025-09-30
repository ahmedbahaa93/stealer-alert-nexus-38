"use client";

import Image from "../../../Ui/Image";
import { useState, useEffect } from "react";
import { Blog } from '@/hooks/useBlogs';
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface HeaderOfBlogPageProps {
    featuredBlog: Blog;
}

const HeaderOfBlogPage = ({ featuredBlog }: HeaderOfBlogPageProps) => {
    const [isClient, setIsClient] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const t = useTranslations('Blog.sections.firstSection');
    const locale = useLocale();
    const router = useRouter();

    const handleReadMore = () => {
        router.push(`/${locale}/articles/${featuredBlog._id}`);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

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

    const title = featuredBlog?.title || t('title');
    const content = featuredBlog?.content || t('content');
    const imageUrl = (featuredBlog?.images && featuredBlog.images[0])
        ? featuredBlog.images[0]
        : "/assets/Blog-Page/Asian_Woman_PSD__High_Quality_Free_PSD_Templates_for_Download___Freepik-removebg-preview 1.png";
    const publishDate = featuredBlog?.createdAt ? formatDate(featuredBlog.createdAt) : '';
    const author = featuredBlog?.author?.name || '';

    return (
        <div className="w-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden min-h-[400px] sm:min-h-[450px] lg:min-h-[500px]">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top left circle - responsive sizing */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
                    <Image imageurl="/assets/Blog-Page/Lingkaran (3).png" alt="circle" className="w-full h-full" />
                </div>

                {/* Top right concentric circles - responsive sizing */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
                    <Image
                        className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                        imageurl="/assets/Blog-Page/Lingkaran.png"
                        alt="circle"
                    />
                </div>

                {/* Bottom left concentric circles - responsive sizing */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8">
                    <Image
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28"
                        imageurl="/assets/Blog-Page/Lingkaran (2).png"
                        alt="circle"
                    />
                </div>

                {/* Bottom right circle - responsive sizing */}
                <div className="absolute bottom-6 right-8 sm:bottom-8 sm:right-12 lg:bottom-12 lg:right-16 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24">
                    <Image
                        imageurl="/assets/Blog-Page/Lingkaran (3).png"
                        alt="circle"
                        className="w-full h-full"
                    />
                </div>

                {/* Additional scattered circles - responsive visibility and sizing */}
                <div className="absolute top-1/3 left-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border border-blue-300/20 rounded-full hidden sm:block"></div>
                <div className="absolute bottom-1/3 right-1/4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border border-purple-300/20 rounded-full hidden sm:block"></div>
            </div>

            {/* Main content - responsive layout */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 lg:py-16 gap-6 sm:gap-8 lg:gap-12">
                {/* Left Column - Text Content */}
                <div className="flex-1 max-w-2xl text-center lg:text-left">
                    {/* Metadata */}
                    {(author || publishDate) && (
                        <div className="mb-3 text-sm text-[#0F43B4]/70 flex flex-wrap gap-2 justify-center lg:justify-start">
                            {author && <span>By {author}</span>}
                            {publishDate && <span>• {publishDate}</span>}
                        </div>
                    )}

                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0F43B4] leading-tight mb-4 sm:mb-6">
                        {title}
                    </h1>

                    <div className="text-sm sm:text-base md:text-lg text-[#0F43B4] leading-relaxed mb-6">
                        {/* Display first 200 characters of content */}
                        {content && content.length > 200
                            ? `${content.substring(0, 200)}...`
                            : content
                        }
                    </div>

                    {/* Read More Button */}
                    <div className="flex justify-center lg:justify-start">
                        <button
                            onClick={handleReadMore}
                            className="bg-[#0F43B4] hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                        >
                            Read Full Article
                        </button>
                    </div>
                </div>

                {/* Right Column - Featured Image */}
                <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
                    <div className="relative">
                        {/* Featured image with fade-in animation - responsive sizing */}
                        <div className="w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-88 lg:w-80 lg:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                            {isClient && (
                                <>
                                    <Image
                                        imageurl={imageUrl}
                                        alt={title || "Featured blog image"}
                                        className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-0' : 'opacity-100'
                                            }`}
                                    />
                                </>
                            )}
                        </div>

                        {/* Decorative elements around the image - responsive sizing */}
                        <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 lg:-top-4 lg:-left-4 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-blue-400/30 rounded-full"></div>
                        <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 lg:-bottom-4 lg:-right-4 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-purple-400/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderOfBlogPage;
