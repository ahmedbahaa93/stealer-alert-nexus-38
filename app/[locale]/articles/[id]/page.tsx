'use client';

import { useParams } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ArticleDetailContent from '@/components/articles/ArticleDetailContent';
import { fetchBlogById } from '@/lib/api/blogs';
import type { Blog, BlogsApiError } from '@/lib/types/blog';

function ArticleDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header skeleton */}
            <div className="mb-8 text-center">
                <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                <div className="flex items-center justify-center gap-6">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </div>

            {/* Image skeleton */}
            <div className="w-full max-w-4xl mx-auto mb-8">
                <Skeleton className="aspect-video rounded-lg w-full" />
                <div className="flex gap-2 mt-4 justify-center">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

function ArticleDetailError({ onRetry }: { onRetry: () => void }) {
    const locale = useLocale();

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

                <h1 className="text-2xl font-bold text-red-800 mb-4">
                    {locale === 'ar' ? 'تعذر تحميل المقال' : 'Failed to Load Article'}
                </h1>

                <p className="text-red-600 mb-6">
                    {locale === 'ar'
                        ? 'حدث خطأ أثناء تحميل المقال. يرجى المحاولة مرة أخرى.'
                        : 'An error occurred while loading the article. Please try again.'
                    }
                </p>

                <div className="space-y-4">
                    <Button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        {locale === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
                    </Button>

                    <div>
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                        >
                            {locale === 'ar' ? 'العودة إلى المقالات' : 'Back to Articles'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ArticleDetailPage() {
    const params = useParams();
    const blogId = params.id as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<BlogsApiError | null>(null);

    const fetchBlog = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetchBlogById(blogId);
            setBlog(response.data.blog);
        } catch (err) {
            setError(err as BlogsApiError);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (blogId) {
            fetchBlog();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId]);

    if (isLoading) {
        return <ArticleDetailSkeleton />;
    }

    if (error || !blog) {
        return <ArticleDetailError onRetry={fetchBlog} />;
    }

    return <ArticleDetailContent blog={blog} />;
}
