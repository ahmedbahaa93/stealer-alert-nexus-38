import React from 'react';

interface BlogSectionSkeletonProps {
    className?: string;
}

export const BlogSectionSkeleton: React.FC<BlogSectionSkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Image skeleton */}
                <div className="w-full lg:w-1/2">
                    <div className="aspect-video bg-gray-200 rounded-xl"></div>
                </div>

                {/* Content skeleton */}
                <div className="w-full lg:w-1/2 space-y-6">
                    {/* Title skeleton */}
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>

                    {/* Description skeleton */}
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>

                    {/* Author skeleton */}
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BlogPageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header skeleton */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
                    </div>
                </div>
            </div>

            {/* Blog sections skeleton */}
            <div className="container mx-auto px-4 py-12 space-y-16">
                {[1, 2, 3].map((index) => (
                    <BlogSectionSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

export default BlogSectionSkeleton;
