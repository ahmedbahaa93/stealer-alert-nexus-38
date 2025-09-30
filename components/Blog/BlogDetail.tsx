"use client";

import { useLocale } from 'next-intl';

interface BlogDetailProps {
    blogId: string;
}

const BlogDetail = ({ blogId }: BlogDetailProps) => {
    const locale = useLocale();
    const isArabic = locale === 'ar';

    return (
        <div className="min-h-screen bg-white py-20" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#0F43B4] mb-4">
                        {isArabic ? 'تفاصيل المقال' : 'Blog Detail'}
                    </h1>
                    <p className="text-gray-600">
                        {isArabic ? 'معرف المقال:' : 'Blog ID:'} {blogId}
                    </p>
                    <div className="mt-8 p-8 border border-gray-200 rounded-lg">
                        <p className="text-gray-700">
                            {isArabic
                                ? 'هذه صفحة مؤقتة لتفاصيل المقال. سيتم تحميل محتوى المقال هنا.'
                                : 'This is a placeholder for the blog detail page. The blog content will be loaded here.'
                            }
                        </p>
                        <p className="text-gray-500 mt-4">
                            {isArabic
                                ? 'وظائف المدونة قيد التطوير.'
                                : 'Blog functionality is under development.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
