'use client';

import { Blog } from "@/hooks/useBlogs";
import Image from "../../../Ui/Image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface BlogSectionProps {
    blog: Blog;
    index: number;
}

const BlogSection = ({ blog, index }: BlogSectionProps) => {
    const t = useTranslations('Blog');
    const locale = useLocale();
    const router = useRouter();

    const handleReadMore = () => {
        router.push(`/${locale}/articles/${blog._id}`);
    };

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

    // Alternate layout for even/odd indexed blogs
    const isEven = index % 2 === 0;
    const bgColor = isEven ? "bg-white" : "bg-gradient-to-br from-blue-50 to-green-50";

    return (
        <div className={`w-full ${bgColor} py-12 md:py-16 overflow-hidden`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 md:gap-12`}>
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl p-2">
                                <div className="overflow-hidden rounded-lg h-64 md:h-80 w-full max-w-md">
                                    <Image
                                        imageurl={blog.images[0] || "/assets/Blog-Page/default-blog.jpg"}
                                        alt={blog.title}
                                        className="w-full h-full object-cover rounded-lg transition-transform hover:scale-105 duration-500"
                                    />
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className={`absolute -${isEven ? "right" : "left"}-4 -top-4 w-8 h-8 bg-blue-400/30 rounded-full`}></div>
                            <div className={`absolute -${isEven ? "left" : "right"}-4 -bottom-4 w-6 h-6 bg-green-400/30 rounded-full`}></div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className={`w-full lg:w-1/2 ${locale === 'ar' ? "" : (isEven ? "lg:pl-8" : "lg:pr-8")}`}>
                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
                            {blog.author?.name && <span>By {blog.author.name}</span>}
                            {blog.createdAt && <span>• {formatDate(blog.createdAt)}</span>}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-[#0F43B4] mb-4">{blog.title}</h2>

                        <div className="text-gray-700">
                            {/* Display truncated content */}
                            {blog.content && blog.content.length > 300
                                ? `${blog.content.substring(0, 300)}...`
                                : blog.content
                            }
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleReadMore}
                                className="bg-[#0F43B4] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                {t('readMore')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogSection;
